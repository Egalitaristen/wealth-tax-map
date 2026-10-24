#!/usr/bin/env python3
"""Build the static site from data/<country>/ into _site/.

Usage: python scripts/build_site.py [--out _site]

Reads every folder in data/ that has a meta.json, writes one JSON file per country plus
world.json (country summary and projected world map paths), and copies the site files.
Needs only the standard library, plus pycountry for ISO codes (pip install pycountry).
"""
import argparse, csv, hashlib, json, math, re, shutil, sys, collections, datetime
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(Path(__file__).resolve().parent))
DATA = ROOT / "data"
SITE = ROOT / "site"
RANK = {"A": 0, "B": 1, "C": 2}

try:
    import pycountry
except ImportError:  # the build still works; countries then match on name only
    pycountry = None


def rd(path):
    p = Path(path)
    if not p.exists():
        return []
    with open(p, encoding="utf-8", newline="") as f:
        return list(csv.DictReader(f))


# ---------- world map: decode world-atlas TopoJSON and project with Equal Earth ----------
def equal_earth(lon, lat):
    A1, A2, A3, A4 = 1.340264, -0.081106, 0.000893, 0.003796
    lam, phi = math.radians(lon), math.radians(lat)
    th = math.asin(math.sqrt(3) / 2 * math.sin(phi))
    t2, t6 = th * th, th ** 6
    x = 2 * math.sqrt(3) * lam * math.cos(th) / (3 * (A1 + 3 * A2 * t2 + t6 * (7 * A3 + 9 * A4 * t2)))
    y = th * (A1 + A2 * t2 + t6 * (A3 + A4 * t2))
    return x, y


def world_paths():
    topo = json.load(open(SITE / "vendor" / "countries-110m.json", encoding="utf-8"))
    sx, sy = topo["transform"]["scale"]
    tx, ty = topo["transform"]["translate"]
    arcs = []
    for arc in topo["arcs"]:
        x = y = 0
        pts = []
        for dx, dy in arc:
            x += dx; y += dy
            pts.append((x * sx + tx, y * sy + ty))
        arcs.append(pts)

    def ring(idx):
        pts = []
        for i in idx:
            a = arcs[i] if i >= 0 else arcs[~i][::-1]
            pts.extend(a if not pts else a[1:])
        return pts

    def clip(pts, keep, edge):
        """Sutherland-Hodgman against one vertical edge. keep(lon) says which side stays; edge is +-180."""
        out = []
        for i, p in enumerate(pts):
            q = pts[i - 1]
            pin, qin = keep(p[0]), keep(q[0])
            if pin != qin:
                t = (edge - q[0]) / (p[0] - q[0])
                out.append((edge, q[1] + t * (p[1] - q[1])))
            if pin:
                out.append(p)
        return out

    def split_antimeridian(pts):
        """Rings that cross +-180 are unwrapped, then cut into an eastern and a western piece."""
        un, off = [pts[0]], 0.0
        for a, b in zip(pts, pts[1:]):
            if b[0] - a[0] > 180: off -= 360
            elif b[0] - a[0] < -180: off += 360
            un.append((b[0] + off, b[1]))
        if max(p[0] for p in un) <= 180 and min(p[0] for p in un) >= -180:
            return [pts]
        east = clip(un, lambda lon: lon <= 180, 180.0)
        west = clip([(lon - 360, lat) for lon, lat in un], lambda lon: lon >= -180, -180.0)
        return [r for r in (east, west) if len(r) > 2]

    out = {}
    for g in topo["objects"]["countries"]["geometries"]:
        cid = str(g.get("id", ""))
        if not cid or cid == "010":  # skip Antarctica and unidentified shapes
            continue
        polys = g["arcs"] if g["type"] == "MultiPolygon" else [g["arcs"]]
        d = ""
        for poly in polys:
            for r in poly:
                for part in split_antimeridian(ring(r)):
                    pts = [equal_earth(*p) for p in part]
                    d += "M" + "L".join(f"{x * 100:.1f} {-y * 100:.1f}" for x, y in pts) + "Z"
        out[cid] = {"name": g["properties"]["name"], "path": d}
    return out


def numeric_for(iso2):
    if pycountry:
        c = pycountry.countries.get(alpha_2=iso2.upper())
        if c:
            return c.numeric  # three digits, zero-padded, as the world map ids are ("076" for Brazil)
    return ""


# ---------- locations: "Country > Region > Place" paths resolved against geo_units.csv ----------
def _bare(n):
    return re.sub(r"\s*\(.*$", "", n or "").strip().lower()


def geo_index(geo):
    by_id = {g["geo_unit_id"]: g for g in geo}
    kids, roots = collections.defaultdict(dict), {}
    for g in geo:
        if g.get("parent_id") and g["parent_id"] in by_id:
            kids[g["parent_id"]].setdefault(_bare(g["name"]), g["geo_unit_id"])
        elif g.get("unit_type") == "country":
            roots[_bare(g["name"])] = g["geo_unit_id"]
    return by_id, kids, roots


def resolve_location(location, idx):
    by_id, kids, roots = idx
    parts = [p.strip() for p in (location or "").split(">") if p.strip()]
    uid = roots.get(_bare(parts[0])) if parts else None
    if not uid:
        return "", 0, parts
    depth = 1
    for seg in parts[1:]:
        nxt = kids.get(uid, {}).get(_bare(seg))
        if not nxt:
            break
        uid, depth = nxt, depth + 1
    return uid, depth, parts[depth:]


def unit_path(uid, by_id):
    names, seen = [], set()
    while uid and uid in by_id and uid not in seen:
        seen.add(uid); names.append(re.sub(r"\s*\(.*$", "", by_id[uid]["name"]).strip()); uid = by_id[uid]["parent_id"]
    return " > ".join(reversed(names))


# ---------- per-country data ----------
def build_country(folder):
    meta = json.load(open(folder / "meta.json", encoding="utf-8"))
    slug = folder.name
    actors, ev, geo = rd(folder / "actors.csv"), rd(folder / "evidence.csv"), rd(folder / "geo_units.csv")
    # Supporters whose latest evidence is a retraction (stance=retracted) stay in the files but leave the site.
    latest = {}
    for e in sorted(ev, key=lambda e: e["date"]):
        latest[e["actor_id"]] = e.get("stance", "support")
    gone = {i for i, st in latest.items() if st == "retracted"}
    actors, ev = [a for a in actors if a["actor_id"] not in gone], [e for e in ev if e["actor_id"] not in gone]
    prof = collections.defaultdict(list)
    for p in rd(folder / "profiles.csv"):
        if p["url"].startswith("https://"):
            prof[p["actor_id"]].append([p["platform"], p["url"]])
    links, runs, excl = rd(folder / "links.csv"), rd(folder / "runs.csv"), rd(folder / "exclusions.csv")
    gidx = geo_index(geo)
    by_id = gidx[0]
    by = collections.defaultdict(list)
    for e in ev:
        by[e["actor_id"]].append(e)

    E = [[e["actor_id"], e["date"], e["grade"], e["evidence_type"], e["wt_design"], e["design_detail"],
          e["quote_original"][:420], e["source_url"], e["source_title"], e["publisher"], e.get("archive_url", ""),
          e["evidence_id"]] for e in ev]
    P = []
    for a in actors:
        es = by.get(a["actor_id"], [])
        if not es:
            continue
        best = min(RANK.get(x["grade"], 3) for x in es)
        dates = sorted(x["date"] for x in es if x["date"])
        designs = sorted({x["wt_design"] for x in es if x["wt_design"]})
        P.append([a["actor_id"], a["name"], a["kind"], a["actor_type"], a["role"], a["affiliation"], a["level"],
                  a.get("location", ""), "ABC"[best], len(es), dates[0] if dates else "",
                  dates[-1] if dates else "", designs, a["notes"], a["website"], a.get("party", ""),
                  [x.strip() for x in a.get("other_types", "").split(";") if x.strip()], prof.get(a["actor_id"], []),
                  a.get("wikidata_qid", "")])

    bounds = None
    bfile = meta.get("boundaries")
    if bfile and (folder / bfile).exists():
        bounds = json.load(open(folder / bfile, encoding="utf-8"))
    units = {_bare(g["name"]): g for g in geo}
    by_code = {g["code"]: g for g in geo if g.get("code")}  # codes are safer: names repeat (US counties)
    here, inside = collections.defaultdict(list), collections.defaultdict(list)
    for a in actors:
        if a["actor_id"] not in by:
            continue
        uid = a.get("geo_unit_id") if a.get("geo_unit_id") in by_id else resolve_location(a.get("location", ""), gidx)[0]
        if uid:
            here[uid].append(a["actor_id"])
        seen = set()
        while uid and uid in by_id and uid not in seen:  # an actor counts for its unit and every unit above it
            seen.add(uid); inside[uid].append(a["actor_id"]); uid = by_id[uid]["parent_id"]
    roots = set(gidx[2].values())
    C, vb, mapped = [], None, set()
    # A unit's place path is its parent's path plus its name; send each parent path once (UP) and its index in C,
    # since a commune map repeats "France > Occitanie > Haute-Garonne" thousands of times.
    UP, up_at = [], {}

    def up_index(g):
        par = unit_path(g.get("parent_id"), by_id)
        if par not in up_at:
            up_at[par] = len(UP); UP.append(par)
        return up_at[par]

    if bounds:
        vb = bounds["viewBox"]
        for u in bounds["units"]:
            g = by_code.get(u.get("code")) if by_code else units.get(_bare(u["name"]))
            if not g:
                continue
            mapped.add(g["geo_unit_id"])
            ids = inside.get(g["geo_unit_id"], [])
            state = "support" if ids else ("clear" if g["sweep_status"] == "done" else "open")
            # Supporters known only at a level above (a province, state or Land, say) tint the area lightly on the map.
            above, near, anc = 0, "", g.get("parent_id")
            while anc and anc in by_id and anc not in roots:
                if here.get(anc):
                    above += len(here[anc]); near = near or re.sub(r"\s*\(.*$", "", by_id[anc]["name"]).strip()
                anc = by_id[anc].get("parent_id")
            C.append([re.sub(r"\s*\(.*$", "", g["name"]).strip(), u.get("code", ""), state, g["sweep_status"], g["hits"],
                      g["notes"][:600], ids, u["path"], up_index(g), above, near])
    O = []
    for g in geo:
        uid = g["geo_unit_id"]
        if uid in mapped or not here.get(uid):
            continue
        name = g["name"] + (" (country level)" if uid in roots else "")
        O.append([name, g["level"], g["sweep_status"], g["notes"][:500], here[uid], unit_path(uid, by_id)])
    L = [[l["from_actor_id"], l["to_actor_id"], l["link_type"], l["note"]] for l in links]
    last = max([r.get("date", "") for r in runs] or [""])
    done = sum(1 for g in geo if g["sweep_status"] == "done")
    with_sup = sum(1 for u, ids in inside.items() if ids and u not in roots)
    grades = collections.Counter(p[8] for p in P)
    summary = dict(slug=slug, iso2=meta.get("iso2", slug.split("-")[0].upper()), name=meta["name"],
                   status=meta.get("status", ""), lead=meta.get("lead", ""), notes=meta.get("notes", ""),
                   supporters=len(P), evidence=len(E), A=grades["A"], B=grades["B"], C=grades["C"],
                   units=len(geo) - len(roots), units_done=done, units_with_supporters=with_sup, updated=last, excluded=len(excl),
                   polls=[p for p in meta.get("polls", []) if str(p.get("url", "")).startswith("https://")])
    summary["map_source"] = (bounds or {}).get("source", "")
    summary["map_licence"] = [(bounds or {}).get("licence", ""), (bounds or {}).get("licence_url", "")]
    R = [r["path"] for r in (bounds or {}).get("regions", [])]
    R2 = [r["path"] for r in (bounds or {}).get("regions_upper", [])]  # a second, bolder outline (régions over départements)
    country = dict(meta=summary, P=P, E=E, C=C, UP=UP, vb=vb, O=O, L=L, R=R, R2=R2)

    # Search index rows: [slug, id, name, type, role, place, grade, statements]
    index = [[slug, p[0], p[1], p[3], p[4][:80], [x.strip() for x in p[7].split(">")][-1] if p[7] else "", p[8], p[9], p[18]]
             for p in P]
    # Place rows: [slug, unit path, supporters inside]
    places = [[slug, unit_path(u, by_id), len(ids)] for u, ids in inside.items() if ids and u not in roots]
    summary["featured"] = featured(P, ev)
    summary["types"] = dict(collections.Counter(p[3] for p in P).most_common())
    summary["designs"] = dict(collections.Counter(d for p in P for d in p[12]).most_common())
    return summary, country, index, places


FEATURE_TYPES = ["economist", "wealthy_individual", "campaigner", "journalist", "politician", "union_official",
                 "academic", "business_leader", "cultural_figure", "legal_tax_professional", "faith"]


def featured(P, ev):
    """A few short, explicit quotes from named people for the home page, spread across types."""
    people = {p[0]: p for p in P if p[2] == "person"}
    spoken = {"speech", "op_ed", "statement", "interview", "social_post", "testimony", "publication", "editorial", "campaign"}
    best = {}
    for e in ev:
        p = people.get(e["actor_id"])
        q = re.sub(r"\s+", " ", e["quote_original"]).strip()
        if not p or e["grade"] != "A" or not (70 <= len(q) <= 230) or not e["source_url"].startswith("http"):
            continue
        # Whole sentences in the person's own voice: starts with a capital, ends with punctuation,
        # and does not describe them in the third person.
        surname = p[1].split()[-1].lower()
        if (e["evidence_type"] not in spoken or not q[0].isupper() or q[-1] not in '.!?"”'
                or surname in q.lower() or re.match(r"(He|She|They|His|Her|Their)\s", q)):
            continue
        score = (len(p[17]) > 0, p[3] != "politician" or p[6] == "national", e["date"])
        if e["actor_id"] not in best or score > best[e["actor_id"]][0]:
            best[e["actor_id"]] = (score, [p[0], p[1], p[3], p[4][:90], q, e["source_url"], e["publisher"], e["date"]])
    by_type = collections.defaultdict(list)
    for score, row in sorted(best.values(), key=lambda x: x[0], reverse=True):
        by_type[row[2]].append(row)
    out = []
    while len(out) < 8 and any(by_type.values()):
        for t in FEATURE_TYPES + sorted(by_type):
            if by_type.get(t) and len(out) < 8:
                out.append(by_type[t].pop(0))
    return out


# ---------- share pages: one small HTML file per page with its own title, description and image ----------
SITE_URL = "https://wealthtaxsupporters.com"
TYPE = {"politician": "Politician", "party": "Party", "government_body": "Council or public body", "academic": "Academic",
        "economist": "Economist", "think_tank": "Think tank", "ngo_campaign": "Campaign group", "union": "Union",
        "union_official": "Union official", "journalist": "Commentator", "media_outlet": "Media outlet",
        "legal_tax_professional": "Legal or tax expert", "wealthy_individual": "Wealthy individual",
        "business_leader": "Business leader", "faith": "Faith leader or body", "cultural_figure": "Cultural figure",
        "campaigner": "Campaigner", "international_body": "International body", "funder": "Funder"}
GRADE = {"A": "Explicit support", "B": "Named support", "C": "Implied support"}
SPOKEN = {"speech", "op_ed", "statement", "interview", "social_post", "testimony", "publication", "editorial", "campaign"}


def the(name):
    return ("the " if name.startswith(("United ", "Netherlands", "Philippines", "Czech")) else "") + name


def _attr(s):
    return (s or "").replace("&", "&amp;").replace('"', "&quot;").replace("<", "&lt;")


def page_html(base, title, desc, path, image, alt):
    """The site page with this page's meta tags, so link previews show the right title and image."""
    h = base
    h = re.sub(r"<title>.*?</title>", f"<title>{_attr(title)}</title>", h, count=1)
    for prop, val in (("name=\"description\"", desc), ("property=\"og:title\"", title), ("property=\"og:description\"", desc),
                      ("property=\"og:url\"", SITE_URL + path), ("property=\"og:image\"", SITE_URL + image),
                      ("property=\"og:image:alt\"", alt)):
        h = re.sub(r'(<meta %s content=")[^"]*(")' % prop, lambda m: m.group(1) + _attr(val) + m.group(2), h, count=1)
    return h


def poll_line(c):
    p = (c.get("polls") or [None])[0]
    if not p:
        return ""
    q = re.sub(r"\s*\(.*?\)", "", p["question"])
    return f" In polls, {p.get('support_text') or str(p['support']) + '%'} back {q[0].lower() + q[1:]} ({p['pollster']}, {str(p.get('published', ''))[:4]})."


def share_pages(out, base, countries, full):
    """Writes per-page HTML (and share images when Pillow is installed). Returns the number of pages."""
    try:
        import share_cards as cards
    except ImportError:
        cards = None
        print("  Pillow not installed: pages get text previews and the default image (pip install pillow)")
    pages = 0

    def write(path, title, desc, image_key, alt, draw):
        nonlocal pages
        img = f"/og/{image_key}.png"
        if cards:
            draw(out / img.lstrip("/"))
        else:
            img = "/og.png"
        dest = out / ("index.html" if path == "/" else path.lstrip("/") + ".html")
        dest.parent.mkdir(parents=True, exist_ok=True)
        dest.write_text(page_html(base, title, desc, path, img, alt), encoding="utf-8")
        pages += 1

    tot = dict(supporters=sum(c["supporters"] for c in countries), evidence=sum(c["evidence"] for c in countries), countries=len(countries))
    write("/", "Wealth Tax Supporters: who backs a wealth tax near you?",
          f"{tot['supporters']:,} public figures and organisations across {tot['countries']} countries who have backed a wealth tax on the record. Every name links to its source.",
          "home", "Who backs a wealth tax near you?", lambda o: cards.home_card(o, tot))
    write("/about", "How the register is built · Wealth Tax Supporters",
          "What counts as support for a wealth tax, how statements are sourced and graded, and how to report a mistake.",
          "about", "How the register is built", lambda o: cards.page_card(o, "Method", "How the register is built", "Sourced, graded and open: every name links to where they said it."))
    write("/contribute", "Put your country on the map · Wealth Tax Supporters",
          "Start a register for your country, suggest a supporter, or help check the entries that are already here.",
          "contribute", "Put your country on the map", lambda o: cards.page_card(o, "Contribute", "Put your country on the map", "Start a register for your country, or suggest a supporter."))
    write("/suggest", "Suggest a supporter · Wealth Tax Supporters",
          "Know a public figure or organisation who has backed a wealth tax? Send a name, a country and a link. No account needed.",
          "suggest", "Suggest a supporter", lambda o: cards.page_card(o, "Suggest a supporter", "Know someone on the record?", "A name, a country and a link to where they said it. No account needed."))

    for c in countries:
        D, slug, name = full[c["slug"]], c["slug"], c["name"]
        mx = max([len(u[6]) for u in D["C"]] or [1]) or 1
        mx_up = max([u[9] for u in D["C"]] or [1]) or 1
        # The same shading as the site map: real supporters from 0.42 up, areas known only through the level above
        # a faint 0.08 to 0.28.
        units = [(u[7], (0.42 + 0.58 * math.log(len(u[6]) + 1) / math.log(mx + 1)) if u[6]
                  else (0.08 + 0.2 * math.log(u[9] + 1) / math.log(mx_up + 1)) if u[9] else 0) for u in D["C"]]
        found = f"public figures and organisations in {the(name)} on the record so far"
        years = sorted({e[1][:4] for e in D["E"] if e[1]})
        sections = {
            "": (f"Wealth tax supporters in {the(name)}", "Wealth tax supporters in", found,
                 f"{c['supporters']:,} public figures and organisations in {the(name)} have backed a wealth tax on the record, found so far.{poll_line(c)}"),
            "directory": (f"Directory of wealth tax supporters · {name}", "Directory · every name with its source", found,
                          f"Browse all {c['supporters']:,} public figures and organisations in {the(name)} who back a wealth tax, by place, party and type."),
            "time": (f"When they said it · {name}", "Over time · statements per year", f"sourced statements since {years[0] if years else ''}",
                     f"{c['evidence']:,} sourced statements in support of a wealth tax in {the(name)}, year by year."),
            "method": (f"How it was built · {name}", "Method · polls, sources and downloads", found,
                       f"How the {name} register was built, what polls say about a wealth tax, and the data as CSV.{poll_line(c)}"),
        }
        for sec, (title, kicker, sub, desc) in sections.items():
            n_sub = c["evidence"] if sec == "time" else c["supporters"]
            cc = dict(c, supporters=n_sub)
            write(f"/{slug}" + (f"/{sec}" if sec else ""), f"{title} · Wealth Tax Supporters", desc, slug + (f"-{sec}" if sec else ""),
                  f"{title}: {c['supporters']:,} found so far",
                  lambda o, cc=cc, kicker=kicker, sub=sub: cards.country_card(o, cc, units, kicker, sub))
        # one page per supporter
        ev_by = collections.defaultdict(list)
        for e in D["E"]:
            ev_by[e[0]].append(e)
        inside = collections.defaultdict(set)
        for i, u in enumerate(D["C"]):
            for a in u[6]:
                inside[a].add(i)
        for p in D["P"]:
            es = sorted(ev_by[p[0]], key=lambda e: (e[2] != "A", e[3] not in SPOKEN, not e[6], -int((e[1] or "0")[:4] or 0)))
            quote = re.sub(r"\s+", " ", es[0][6]).strip() if es and es[0][6] else ""
            if quote and quote[0].islower():
                quote = "…" + quote
            role = " · ".join(x for x in (p[4], p[5]) if x)
            y0, y1 = (p[10] or "")[:4], (p[11] or "")[:4]
            span = y0 if y0 == y1 else f"{y0}–{y1}"
            gradeline = f"{GRADE.get(p[8], '')} · {p[9]} statement{'s' if p[9] != 1 else ''}" + (f" · {span}" if y0 else "")
            desc = (f"{role}. " if role else "") + (f"“{quote[:200]}{'…' if len(quote) > 200 else ''}” " if quote else "") + \
                f"{p[9]} sourced statement{'s' if p[9] != 1 else ''} in support of a wealth tax."
            hl = inside.get(p[0], set())
            write(f"/{slug}/{p[0]}", f"{p[1]} backs a wealth tax · Wealth Tax Supporters", desc, f"{slug}/{p[0]}",
                  f"{p[1]}, {TYPE.get(p[3], p[3])}, {name}",
                  lambda o, p=p, quote=quote, gradeline=gradeline, hl=hl: cards.person_card(
                      o, {"name": p[1], "role": role if (role := " · ".join(x for x in (p[4], p[5]) if x)) else ""}, name, quote,
                      units if hl else [], hl, TYPE.get(p[3], p[3]), gradeline))
    return pages


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--out", default=str(ROOT / "_site"))
    out = Path(ap.parse_args().out)
    if out.exists():
        shutil.rmtree(out)
    (out / "data").mkdir(parents=True)
    # Every file in site/ except the page and the vendored map source is copied as is.
    assets = [f for f in SITE.iterdir() if f.is_file() and f.name != "index.html"]
    for f in assets:
        shutil.copy(f, out / f.name)
    # A content hash in each asset URL makes updates show at once despite caching.
    html = (SITE / "index.html").read_text(encoding="utf-8")
    for f in assets:
        if f.suffix in (".js", ".css", ".svg"):
            h = hashlib.md5(f.read_bytes()).hexdigest()[:8]
            html = html.replace(f'"/{f.name}"', f'"/{f.name}?v={h}"')
    (out / "index.html").write_text(html, encoding="utf-8")
    countries, index, places, full = [], [], [], {}
    for folder in sorted(DATA.iterdir()):
        if folder.is_dir() and (folder / "meta.json").exists():
            summary, country, idx, pl = build_country(folder)
            summary["numeric"] = numeric_for(summary["iso2"].split("-")[0])
            countries.append(summary)
            full[folder.name] = country
            index += idx
            places += pl
            json.dump(country, open(out / "data" / f"{folder.name}.json", "w", encoding="utf-8"),
                      separators=(",", ":"), ensure_ascii=False)
            dl = out / "download" / folder.name
            dl.mkdir(parents=True)
            for name in ("actors.csv", "evidence.csv", "profiles.csv", "geo_units.csv"):
                if (folder / name).exists():
                    shutil.copy(folder / name, dl / name)
            print(f"  {folder.name}: {summary['supporters']} supporters, {summary['evidence']} evidence rows")
    paths = world_paths()
    # Every country's everyday name, for the suggestion form: people may suggest supporters anywhere, not only
    # where a register has started.
    # One name per ISO country: the register's name, else the world map's everyday name, else ISO's common name.
    own = {c["iso2"].upper(): c["name"] for c in countries}
    every = {p["name"] for p in paths.values()} | set(own.values())
    for c in (pycountry.countries if pycountry else []):
        if c.alpha_2 not in own and c.numeric not in paths:
            every.add(getattr(c, "common_name", None) or c.name)
    world = dict(paths=paths, countries=countries, all_countries=sorted(every), built=datetime.date.today().isoformat())
    json.dump(world, open(out / "data" / "world.json", "w", encoding="utf-8"), separators=(",", ":"), ensure_ascii=False)
    json.dump(dict(people=index, places=places), open(out / "data" / "index.json", "w", encoding="utf-8"),
              separators=(",", ":"), ensure_ascii=False)
    n = share_pages(out, html, countries, full)
    print(f"Built {len(countries)} countr{'y' if len(countries) == 1 else 'ies'} and {n} share pages into {out}")


if __name__ == "__main__":
    sys.exit(main())
