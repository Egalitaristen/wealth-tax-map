#!/usr/bin/env python3
"""Put region outlines into a boundaries.json made by topo_to_boundaries.py.

The units file (the local tier) keeps its viewBox, licence and codes; `regions` are the outlines of the level above
(départements over communes, provinces over municipios) and `regions_upper` an optional bolder outline one level
higher still (régions, autonomous communities). Make all three files with the same --project, --scale and --shift
so the lines fall on the unit borders.

  python skill/scripts/merge_boundaries.py mun.json --regions prov.json --upper ccaa.json --out data/es/boundaries.json
"""
import argparse, json, sys
from pathlib import Path


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("units")
    ap.add_argument("--regions", required=True, help="outlines of the level above the units")
    ap.add_argument("--upper", help="optional bolder outlines one level higher")
    ap.add_argument("--code-prefix", default="", help="prefix for region codes, e.g. ES- (keeps them apart from unit codes)")
    ap.add_argument("--out", required=True)
    a = ap.parse_args()
    out = json.load(open(a.units, encoding="utf-8"))
    for key, f in (("regions", a.regions), ("regions_upper", a.upper)):
        if f:
            src = json.load(open(f, encoding="utf-8"))
            if src["viewBox"][2] > out["viewBox"][2] * 1.05 or src["viewBox"][3] > out["viewBox"][3] * 1.05:
                sys.exit(f"{f}: extent {src['viewBox']} is larger than the units' {out['viewBox']}; use the same "
                         f"--project, --scale and --shift")
            out[key] = [{"name": u["name"], "code": a.code_prefix + u["code"] if u["code"] else "", "path": u["path"]}
                        for u in src["units"]]
    Path(a.out).write_text(json.dumps(out, separators=(",", ":"), ensure_ascii=False), encoding="utf-8")
    print(f"Wrote {a.out}: {len(out['units'])} units, {len(out.get('regions', []))} regions, "
          f"{len(out.get('regions_upper', []))} upper regions, {Path(a.out).stat().st_size // 1024} KB")


if __name__ == "__main__":
    sys.exit(main())
