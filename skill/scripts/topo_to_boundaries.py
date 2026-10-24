#!/usr/bin/env python3
"""Turn a TopoJSON file or a shapefile of areas (councils, municipalities, counties) into a boundaries.json.

The site draws data/<iso2>/boundaries.json as the local map. TopoJSON needs only the standard library; a
shapefile (.shp) needs pyshp (pip install pyshp).

Map units are matched to geo_units.csv by `code` when the register has codes (the safe choice: names repeat,
for example 30 US counties are called Washington County), and otherwise by name. A name also matches when the
geo_units name starts with the boundary name followed by " (".

Only use shapes with a stated open licence (public domain, CC0, CC BY, ODbL, an open government licence). A
source that states no licence, or a non-commercial one such as GADM, is not used: a country without a map is
better than a map that cannot be republished. --licence and --licence-url are required, and the official code
system of the units goes in --code-scheme. Never invent codes.

Examples
  # US counties, already projected to a flat 975 x 610 canvas (npm package us-atlas, counties-albers-10m.json)
  python skill/scripts/topo_to_boundaries.py counties-albers-10m.json --object counties --code-prop id \\
      --scale 4 --simplify 1.5 --source "US Census cartographic boundaries via us-atlas" \\
      --licence "Public domain (US Government work)" --licence-url https://www.usa.gov/government-copyright \\
      --code-scheme "Census FIPS county codes" --out data/us/boundaries.json

  # German Kreise from the BKG shapefile (planar UTM metres, so scale them down)
  python skill/scripts/topo_to_boundaries.py VG2500_KRS.shp --name-prop GEN --code-prop AGS --scale 0.002 \\
      --flip-y --simplify 0.6 --source "(c) GeoBasis-DE / BKG (2025)" --licence dl-de/by-2-0 \\
      --licence-url https://www.govdata.de/dl-de/by-2-0 --code-scheme AGS --out data/de/boundaries.json

  # Spanish provinces from es-atlas (IGN shapes), Gibraltar dropped and the Canary Islands moved into an inset
  python skill/scripts/topo_to_boundaries.py provinces.json --object provinces --code-prop id --where "id!=54" \
      --shift 35,38:17,6.8 --project lonlat --scale 100 --simplify 0.4 --licence CC-BY-4.0 \
      --licence-url https://creativecommons.org/licenses/by/4.0/ --code-scheme "INE province codes" --out prov.json

  # Longitude/latitude shapes (for example geoBoundaries gbOpen, after checking that country's licence)
  python skill/scripts/topo_to_boundaries.py regions.geojson --project lonlat --name-prop shapeName \\
      --licence CC-BY-4.0 --licence-url https://www.geoboundaries.org/ --out data/xx/boundaries.json
"""
import argparse, fnmatch, json, math, sys
from pathlib import Path


def decode(topo):
    tr = topo.get("transform")
    arcs = []
    for arc in topo["arcs"]:
        pts, x, y = [], 0, 0
        for p in arc:
            if tr:
                x += p[0]; y += p[1]
                pts.append((x * tr["scale"][0] + tr["translate"][0], y * tr["scale"][1] + tr["translate"][1]))
            else:
                pts.append((p[0], p[1]))
        arcs.append(pts)
    return arcs


def ring_points(arcs, idx):
    pts = []
    for i in idx:
        a = arcs[i] if i >= 0 else arcs[~i][::-1]
        pts.extend(a if not pts else a[1:])
    return pts


def simplify(pts, tol):
    """Douglas-Peucker on a ring (in output units). Keeps at least four points so small areas stay visible."""
    if tol <= 0 or len(pts) < 5:
        return pts

    def dp(a, b):
        (x1, y1), (x2, y2) = pts[a], pts[b]
        dx, dy = x2 - x1, y2 - y1
        n = math.hypot(dx, dy) or 1e-9
        best, at = 0.0, None
        for i in range(a + 1, b):
            d = abs(dy * pts[i][0] - dx * pts[i][1] + x2 * y1 - y2 * x1) / n
            if d > best:
                best, at = d, i
        if best > tol and at is not None:
            return dp(a, at)[:-1] + dp(at, b)
        return [pts[a], pts[b]]

    mid = len(pts) // 2
    out = dp(0, mid)[:-1] + dp(mid, len(pts) - 1)
    return out if len(out) >= 4 else pts


def keep(where, get):
    """--where FIELD=V1,V2 keeps shapes whose FIELD is one of the values; FIELD!=V1,V2 drops them. Values may use * (53*)."""
    if not where:
        return True
    neg = "!=" in where
    key, _, vals = where.partition("!=" if neg else "=")
    return any(fnmatch.fnmatchcase(str(get(key)), v) for v in vals.split(",")) != neg


def read_topojson(a):
    topo = json.load(open(a.source_file, encoding="utf-8"))
    arcs = decode(topo)
    for g in topo["objects"][a.object]["geometries"]:
        props = g.get("properties", {}) or {}
        if not keep(a.where, lambda k: g.get("id") if k == "id" else props.get(k)):
            continue
        name = props.get(a.name_prop, "")
        polys = g.get("arcs") or []
        polys = polys if g["type"] == "MultiPolygon" else [polys]
        code = g.get("id") if a.code_prop == "id" else props.get(a.code_prop, "") if a.code_prop else ""
        yield name, code, [ring_points(arcs, r) for poly in polys for r in poly]


def read_geojson(a):
    gj = json.load(open(a.source_file, encoding="utf-8"))
    for f in gj.get("features", []):
        props, g = f.get("properties") or {}, f.get("geometry") or {}
        if not keep(a.where, props.get):
            continue
        polys = g.get("coordinates") or []
        polys = polys if g.get("type") == "MultiPolygon" else [polys]
        yield props.get(a.name_prop, ""), props.get(a.code_prop, "") if a.code_prop else "", [r for poly in polys for r in poly]


def read_shapefile(a):
    import shapefile  # pyshp
    sf = shapefile.Reader(a.source_file, encoding=a.encoding)
    fields = [f[0] for f in sf.fields[1:]]
    for sr in sf.iterShapeRecords():
        rec = dict(zip(fields, sr.record))
        if not keep(a.where, rec.get):
            continue
        pts, parts = sr.shape.points, list(sr.shape.parts) + [len(sr.shape.points)]
        rings = [pts[parts[i]:parts[i + 1]] for i in range(len(parts) - 1)]
        yield rec.get(a.name_prop, ""), rec.get(a.code_prop, "") if a.code_prop else "", rings


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("source_file", help="a TopoJSON (.json), a GeoJSON (.geojson) or a shapefile (.shp)")
    ap.add_argument("--encoding", default="utf-8", help="shapefile text encoding (default utf-8; SCB files are latin-1)")
    ap.add_argument("--object", help="TopoJSON only: name of the object inside the file (for example counties)")
    ap.add_argument("--name-prop", default="name", help="property or field holding the area name (default: name)")
    ap.add_argument("--code-prop", default="", help="property or field (or 'id') holding the official code")
    ap.add_argument("--project", choices=["planar", "lonlat"], default="planar",
                    help="planar: coordinates are already flat; lonlat: degrees, drawn with a mid-latitude correction")
    ap.add_argument("--scale", type=float, default=10, help="multiply coordinates before rounding to integers")
    ap.add_argument("--simplify", type=float, default=0, help="Douglas-Peucker tolerance in output units (0 = off)")
    ap.add_argument("--flip-y", action="store_true", help="planar sources with y pointing up (most shapefiles)")
    ap.add_argument("--where", default="", help="keep only shapes where FIELD=V1,V2 (GF=9 keeps land areas in BKG data), "
                                                "or drop them with FIELD!=V1,V2")
    ap.add_argument("--shift", action="append", default=[], metavar="CODES:DX,DY",
                    help="move outlying areas into an inset, in source units, before projecting: 35,38:5,7 moves the "
                         "shapes with codes 35 and 38 (the Canary Islands) 5 east and 7 north; codes may use * (35*). Repeatable")
    ap.add_argument("--source", default="", help="where the shapes come from and the credit the licence asks for")
    ap.add_argument("--licence", required=True,
                    help="the shapes' open licence, as the source states it (CC0-1.0, CC-BY-4.0, OGL-UK-3.0, ...). "
                         "No stated licence means do not use the source")
    ap.add_argument("--licence-url", required=True, help="https link to the licence text or the source's licence page")
    ap.add_argument("--code-scheme", default="",
                    help="the official code system in --code-prop (GSS, FIPS, AGS, LGD ...); required for the local "
                         "units. Never invent codes")
    ap.add_argument("--strip-prefix", default="", help="drop this prefix from codes (OCHA P-codes: BR1100015 -> 1100015)")
    ap.add_argument("--out", required=True)
    a = ap.parse_args()
    if a.licence.strip().lower() in ("", "unknown", "none", "not stated", "unclear"):
        ap.error("the shapes need an open licence; find a source that states one (SKILL.md, boundaries.json)")
    if not a.licence_url.startswith("https://"):
        ap.error("--licence-url must be an https link")

    ext = a.source_file.lower().rsplit(".", 1)[-1]
    if ext == "json" and not a.object:
        ap.error("--object is needed for TopoJSON")
    shapes = list(read_shapefile(a) if ext == "shp" else read_geojson(a) if ext == "geojson" else read_topojson(a))
    if a.strip_prefix:
        shapes = [(n, str(c)[len(a.strip_prefix):] if str(c).startswith(a.strip_prefix) else c, r) for n, c, r in shapes]
    for spec in a.shift:
        codes, _, d = spec.partition(":")
        dx, dy = (float(v) for v in d.split(","))
        codes = codes.split(",")
        shapes = [(n, c, [[(p[0] + dx, p[1] + dy) for p in r] for r in rings])
                  if any(fnmatch.fnmatchcase(str(c), k) for k in codes) else (n, c, rings)
                  for n, c, rings in shapes]
    lats = [p[1] for _, _, rings in shapes for r in rings for p in r]
    k = math.cos(math.radians((min(lats) + max(lats)) / 2)) if a.project == "lonlat" else 1.0
    flip = a.project == "lonlat" or a.flip_y

    def xy(p):
        return round(p[0] * k * a.scale), round((-p[1] if flip else p[1]) * a.scale)

    units, xs, ys, npts = [], [], [], 0
    for name, code, rings in shapes:
        if not name and not code:
            continue
        d = ""
        for r in rings:
            pts = []
            for p in simplify([xy(p) for p in r], a.simplify):
                if not pts or p != pts[-1]:  # rounding makes neighbouring points equal; drop the repeats
                    pts.append(p)
            if len(pts) < 3:
                continue
            # Relative steps after the first point keep the file small (a commune map has 35,000 shapes)
            d += f"M{pts[0][0]} {pts[0][1]}l" + " ".join(f"{x - px} {y - py}" for (px, py), (x, y) in zip(pts, pts[1:])) + "z"
            xs += [p[0] for p in pts]; ys += [p[1] for p in pts]; npts += len(pts)
        if d:
            units.append({"name": str(name), "code": str(code or ""), "path": d})
    if not units:
        sys.exit("No shapes left: check --object, --name-prop, --code-prop and --where")
    out = {"viewBox": [min(xs), min(ys), max(xs) - min(xs), max(ys) - min(ys)], "source": a.source,
           "licence": a.licence, "licence_url": a.licence_url, "code_scheme": a.code_scheme,
           "match": "code" if a.code_prop else "name", "units": units}
    Path(a.out).write_text(json.dumps(out, separators=(",", ":"), ensure_ascii=False), encoding="utf-8")
    print(f"Wrote {a.out}: {len(units)} units, {npts} points, {Path(a.out).stat().st_size // 1024} KB")


if __name__ == "__main__":
    sys.exit(main())
