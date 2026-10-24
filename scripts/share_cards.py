"""Share images (1200x630 PNG) for link previews on Discord, social media and chat apps.

Used by build_site.py when Pillow is installed (pip install pillow). Fonts are in scripts/fonts (SIL OFL).
Images are cached in .cache/cards by a hash of their content, so a rebuild only draws what changed.
"""
import hashlib, json, re, shutil
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

HERE = Path(__file__).resolve().parent
FONTS = HERE / "fonts"
CACHE = HERE.parent / ".cache" / "cards"
VERSION = "5"  # bump to redraw every card after a design change

W, H, S = 1200, 630, 2  # drawn at 2x, then scaled down for smooth edges
PAPER, PAPER2, INK, INK2, INK3, RULE = (243, 239, 230), (233, 227, 214), (23, 21, 15), (74, 70, 61), (124, 118, 106), (214, 207, 191)
SIGNAL, LAND, NIGHT = (217, 67, 30), (207, 199, 181), (18, 17, 14)
FOOT = 74

# The logo mark on its 64-unit grid (see site/index.html).
MARK_BODY = "M4 58 L4 57 C30 57 42 56.5 47 53 C52 49.5 54 42 54 30 C54.27 27.3 54.61 24.6 55.03 21.94 L60 21.94 L60 58 Z"
MARK_TIP = "M55.03 17.94 C56.15 10.75 57.81 3.84 60 -2 L60 17.94 Z"
MARK_DEP = "M4 54.5 L43.92 54.5 C37.66 56.65 25.71 57 4 57 Z"


def _font(name, size, weight=None):
    f = ImageFont.truetype(str(FONTS / name), int(size * S))
    if weight:
        try:
            f.set_variation_by_axes([weight])
        except Exception:  # not a variable font, or no axis support: keep the default weight
            pass
    return f


SERIF = lambda s: _font("InstrumentSerif-Regular.ttf", s)
ITALIC = lambda s: _font("InstrumentSerif-Italic.ttf", s)
SANS = lambda s, w=400: _font("Geist.ttf", s, w)


def _bez(p0, p1, p2, p3, n=24):
    return [((1 - t) ** 3 * p0[0] + 3 * (1 - t) ** 2 * t * p1[0] + 3 * (1 - t) * t * t * p2[0] + t ** 3 * p3[0],
             (1 - t) ** 3 * p0[1] + 3 * (1 - t) ** 2 * t * p1[1] + 3 * (1 - t) * t * t * p2[1] + t ** 3 * p3[1])
            for t in (i / n for i in range(1, n + 1))]


def _rings(d):
    """M/L/l/C/Z path data (absolute, or relative lines) to a list of point rings."""
    toks = re.findall(r"[MLlCZz]|-?\d+(?:\.\d+)?", d)
    rings, cur, i, pt, cmd = [], [], 0, None, None
    num = lambda k: float(toks[k])
    while i < len(toks):
        if toks[i] in "MLlCZz":
            cmd = toks[i]; i += 1
            if cmd in "Zz":
                if len(cur) > 2: rings.append(cur)
                cur = []
            continue
        if cmd == "M":
            if len(cur) > 2: rings.append(cur)
            pt = (num(i), num(i + 1)); i += 2; cur = [pt]; cmd = "L"
        elif cmd == "L":
            pt = (num(i), num(i + 1)); i += 2; cur.append(pt)
        elif cmd == "l":
            pt = (pt[0] + num(i), pt[1] + num(i + 1)); i += 2; cur.append(pt)
        elif cmd == "C":
            a = [(num(i + k), num(i + k + 1)) for k in (0, 2, 4)]; i += 6
            cur += _bez(pt, *a); pt = a[2]
        else:
            i += 1
    if len(cur) > 2: rings.append(cur)
    return rings


def _mark(dr, x, y, size, ink, signal):
    k = size / 64 * S
    tr = lambda ring: [((x * S) + px * k, (y * S) + (py + 4) * k) for px, py in ring]
    for d, col in ((MARK_BODY, ink), (MARK_TIP, signal), (MARK_DEP, signal)):
        for r in _rings(d):
            dr.polygon(tr(r), fill=col)


def _wrap(dr, text, font, width, lines):
    words, out, cur = text.split(), [], ""
    for w in words:
        t = (cur + " " + w).strip()
        if dr.textlength(t, font=font) <= width * S:
            cur = t
        else:
            if cur: out.append(cur)
            cur = w
            if len(out) == lines: break
    if cur and len(out) < lines: out.append(cur)
    if len(out) == lines and " ".join(out) != " ".join(words):
        last = out[-1]
        while last and dr.textlength(last + "…", font=font) > width * S:
            last = last.rsplit(" ", 1)[0] if " " in last else last[:-1]
        out[-1] = last.rstrip(",;:.") + "…"
    return out


def _fit(dr, text, maker, width, start, smallest):
    size = start
    while size > smallest and dr.textlength(text, font=maker(size)) > width * S:
        size -= 4
    return maker(size), size


def _canvas(bg=PAPER):
    img = Image.new("RGB", (W * S, H * S), bg)
    return img, ImageDraw.Draw(img)


def _footer(dr, dark=False):
    """The branded strip along the bottom of every card."""
    top = H - FOOT
    dr.rectangle((0, top * S, W * S, H * S), fill=INK if not dark else (35, 33, 28))
    _mark(dr, 44, top + 13, 46, PAPER, SIGNAL)
    dr.text((104 * S, (top + 18) * S), "Wealth Tax", font=SERIF(34), fill=PAPER)
    x = 104 * S + dr.textlength("Wealth Tax ", font=SERIF(34))
    dr.text((x, (top + 18) * S), "Supporters", font=ITALIC(34), fill=SIGNAL)
    url = "wealthtaxsupporters.com"
    f = SANS(22, 500)
    dr.text(((W - 44) * S - dr.textlength(url, font=f), (top + 26) * S), url, font=f, fill=(200, 193, 180))


def _area_map(dr, box, units, highlight=None):
    """Draw a country's area map into box=(x, y, w, h): units are (path, t) with t in 0..1 for shading."""
    bx, by, bw, bh = box
    rings = [(_rings(p), t) for p, t in units]
    xs = [x for rs, _ in rings for r in rs for x, _ in r]
    ys = [y for rs, _ in rings for r in rs for _, y in r]
    if not xs:
        return
    x0, x1, y0, y1 = min(xs), max(xs), min(ys), max(ys)
    k = min(bw / (x1 - x0), bh / (y1 - y0))
    ox, oy = bx + (bw - (x1 - x0) * k) / 2, by + (bh - (y1 - y0) * k) / 2
    tr = lambda r: [((ox + (x - x0) * k) * S, (oy + (y - y0) * k) * S) for x, y in r]
    for i, (rs, t) in enumerate(rings):
        if highlight is not None:
            col = SIGNAL if i in highlight else LAND
        elif t > 0:
            col = tuple(round(LAND[c] + (SIGNAL[c] - LAND[c]) * t) for c in range(3))
        else:
            col = LAND
        for r in rs:
            if len(r) > 2:
                dr.polygon(tr(r), fill=col, outline=PAPER if (x1 - x0) * k < 2000 else None)


def _save(img, out):
    img = img.resize((W, H), Image.LANCZOS).quantize(colors=64, method=Image.Quantize.MEDIANCUT)
    out.parent.mkdir(parents=True, exist_ok=True)
    img.save(out, "PNG", optimize=True)


def cached(out, key, draw):
    """Copy a cached image if its inputs are unchanged, otherwise draw and cache it."""
    h = hashlib.md5((VERSION + json.dumps(key, sort_keys=True, ensure_ascii=False)).encode()).hexdigest()
    c = CACHE / f"{h}.png"
    if not c.exists():
        draw(c)
    out.parent.mkdir(parents=True, exist_ok=True)
    shutil.copyfile(c, out)
    return c.exists()


# ---------- cards ----------
def home_card(out, totals):
    def draw(path):
        img, dr = _canvas()
        dr.text((60 * S, 54 * S), "AN OPEN, SOURCED REGISTER", font=SANS(20, 500), fill=INK3)
        f = SERIF(118)
        dr.text((56 * S, 96 * S), "Who backs a", font=f, fill=INK)
        dr.text((56 * S, 206 * S), "wealth tax", font=f, fill=INK)
        dr.text((56 * S, 316 * S), "near you?", font=ITALIC(118), fill=SIGNAL)
        # totals, right column
        x = 790
        dr.line((x * S, 70 * S, x * S, 470 * S), fill=RULE, width=2 * S)
        rows = [(f"{totals['supporters']:,}", "public figures and organisations"), (f"{totals['evidence']:,}", "sourced statements"),
                (f"{totals['countries']}", "countries, and counting")]
        for i, (n, lab) in enumerate(rows):
            y = 76 + i * 132
            dr.text(((x + 36) * S, y * S), n, font=SERIF(84), fill=INK)
            dr.text(((x + 40) * S, (y + 86) * S), lab, font=SANS(22), fill=INK2)
        _footer(dr)
        _save(img, path)
    return cached(out, ["home", totals], draw)


def country_card(out, c, units, kicker, sub):
    """c: country summary from build_site; units: [(path, t)] map units; kicker/sub: page specific lines."""
    poll = (c.get("polls") or [None])[0]

    def draw(path):
        img, dr = _canvas()
        dr.text((60 * S, 54 * S), kicker.upper(), font=SANS(20, 500), fill=INK3)
        nf, size = _fit(dr, c["name"], SERIF, 640, 112, 64)
        dr.text((56 * S, 86 * S), c["name"], font=nf, fill=INK)
        y = 86 + size + 18
        dr.text((60 * S, y * S), f"{c['supporters']:,}", font=SERIF(64), fill=SIGNAL)
        nx = 60 * S + dr.textlength(f"{c['supporters']:,}", font=SERIF(64)) + 16 * S
        for i, ln in enumerate(_wrap(dr, sub, SANS(24), 640 - (nx / S - 60), 2)):
            dr.text((nx, (y + 8 + i * 30) * S), ln, font=SANS(24), fill=INK2)
        if poll:
            py = 410
            dr.rectangle((60 * S, py * S, 66 * S, (py + 92) * S), fill=SIGNAL)
            fig = poll.get("support_text") or f"{poll['support']}%"
            ff, _ = _fit(dr, fig, SERIF, 230, 70, 44)
            dr.text((84 * S, (py + 4) * S), fig, font=ff, fill=SIGNAL)
            fx = 84 * S + dr.textlength(fig, font=ff) + 18 * S
            q = "back " + poll["question"][0].lower() + poll["question"][1:]
            q = re.sub(r"\s*\(.*?\)", "", q)
            lines = _wrap(dr, q, SANS(21), 690 - fx / S, 2)
            for i, ln in enumerate(lines):
                dr.text((fx, (py + 10 + i * 27) * S), ln, font=SANS(21), fill=INK)
            src = ", ".join(x for x in [poll.get("pollster"), poll.get("published", "")[:4]] if x)
            src = _wrap(dr, src, SANS(17), 690 - fx / S, 1)[0]
            dr.text((fx, (py + 14 + len(lines) * 27) * S), src, font=SANS(17), fill=INK3)
        if units:
            dr.rectangle((740 * S, 40 * S, 1160 * S, 516 * S), fill=PAPER2)
            _area_map(dr, (760, 60, 380, 436), units)
        _footer(dr)
        _save(img, path)
    return cached(out, ["country", c["name"], c["supporters"], c["evidence"], kicker, sub, poll, len(units), [round(t, 2) for _, t in units]], draw)


def person_card(out, p, country, quote, units, highlight, typelabel, gradeline):
    def draw(path):
        img, dr = _canvas()
        right = 760 if units else 1140
        dr.text((60 * S, 54 * S), f"{typelabel} · {country}".upper(), font=SANS(20, 500), fill=INK3)
        nf, size = _fit(dr, p["name"], SERIF, right - 80, 96, 52)
        dr.text((56 * S, 84 * S), p["name"], font=nf, fill=INK)
        y = 84 + size + 12
        for ln in _wrap(dr, p["role"], SANS(23), right - 80, 2):
            dr.text((60 * S, y * S), ln, font=SANS(23), fill=INK2); y += 30
        if not units:
            right = 860
            _mark(dr, 930, 250, 210, INK, SIGNAL)
        if quote:
            y += 26
            room = (H - FOOT - 70) - y
            qs = 46 if len(quote) < 140 else 40
            qf, lh = ITALIC(qs), int(qs * 1.18)
            lines = _wrap(dr, "“" + quote + "”", qf, right - 110, max(1, room // lh))
            dr.rectangle((60 * S, (y + 6) * S, 65 * S, (y + len(lines) * lh) * S), fill=SIGNAL)
            for ln in lines:
                dr.text((84 * S, y * S), ln, font=qf, fill=INK); y += lh
        dr.text((60 * S, (H - FOOT - 50) * S), gradeline, font=SANS(20, 500), fill=SIGNAL)
        if units:
            dr.rectangle((800 * S, 40 * S, 1160 * S, 516 * S), fill=PAPER2)
            _area_map(dr, (816, 56, 328, 444), units, highlight=highlight)
        _footer(dr)
        _save(img, path)
    return cached(out, ["person", p, country, quote, typelabel, gradeline, len(units), sorted(highlight or [])], draw)


def page_card(out, kicker, title, line):
    def draw(path):
        img, dr = _canvas()
        dr.text((60 * S, 54 * S), kicker.upper(), font=SANS(20, 500), fill=INK3)
        tf, size = _fit(dr, title, SERIF, 880, 118, 64)
        dr.text((56 * S, 96 * S), title, font=tf, fill=INK)
        y = 96 + size + 30
        for ln in _wrap(dr, line, SANS(28), 860, 3):
            dr.text((60 * S, y * S), ln, font=SANS(28), fill=INK2); y += 38
        _mark(dr, 980, 300, 170, INK, SIGNAL)
        _footer(dr)
        _save(img, path)
    return cached(out, ["page", kicker, title, line], draw)
