#!/usr/bin/env python3
"""Rank a country's supporters for a refinement pass (skill/refine/SKILL.md) and print the next batch.

Usage: python skill/scripts/refine_queue.py data/<iso2> [--n 60] [--days 180] [--out batch.csv]

Each actor gets a score from its gaps, links first, as the refine skill orders the work:
  no website or profile link           4
  placed coarser than they could be    2   (a person or local body at the country or region level; not a legislator
                                           already in their seat, or a foreign figure)
  best evidence grade B / C            2 / 3
  only one statement                   1.5
  latest statement before 2020         1.5 (is the support still current?)
  person without a Wikidata ID         1
Prominent actors (national, international) count 1.3 times. Actors refined in the last --days are skipped.
--out writes the batch with each actor's gaps, for the run to work through. Standard library only.
"""
import argparse, csv, datetime as dt, sys
from collections import Counter, defaultdict
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent))
import wtdb  # noqa: E402


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("dir"); ap.add_argument("--n", type=int, default=60); ap.add_argument("--days", type=int, default=180)
    ap.add_argument("--out")
    a = ap.parse_args()
    db = wtdb.load_all(a.dir)
    geo = {g["geo_unit_id"]: g for g in db["geo_units"]}
    ev = defaultdict(list)
    for e in db["evidence"]:
        ev[e["actor_id"]].append(e)
    linked = {p["actor_id"] for p in db["profiles"]}
    cutoff = (dt.date.today() - dt.timedelta(days=a.days)).isoformat()
    rows = []
    for r in db["actors"]:
        es = [e for e in ev.get(r["actor_id"], []) if e.get("stance", "support") == "support"]
        if not es or (r.get("refined") and r["refined"] >= cutoff):
            continue
        gaps, score = [], 0.0
        if r["actor_id"] not in linked and not r.get("website"):
            gaps.append("links"); score += 4
        lvl = geo.get(r.get("geo_unit_id"), {}).get("level", "")
        coarse = lvl in ("national", "region") and (r["kind"] == "person" or r.get("level") in ("local", "regional"))
        seated = lvl == "region" and wtdb.LEGISLATOR.search(r.get("role", ""))  # a state or constituency seat is the place
        if coarse and not seated and r.get("level") != "supranational" and not (r.get("level") == "national" and r["kind"] != "person"):
            gaps.append("place"); score += 2
        best = min(e["grade"] for e in es)
        if best in "BC":
            gaps.append(f"grade {best}"); score += 2 if best == "B" else 3
        if len(es) == 1:
            gaps.append("one statement"); score += 1.5
        if max(e["date"] for e in es)[:4] < "2020":
            gaps.append("still current?"); score += 1.5
        if r["kind"] == "person" and not r.get("wikidata_qid"):
            gaps.append("wikidata"); score += 1
        if r.get("prominence") in ("national", "international"):
            score *= 1.3
        if gaps:
            rows.append((round(score, 1), r, gaps))
    rows.sort(key=lambda x: (-x[0], x[1]["actor_id"]))
    print(f"{len(rows)} actors with gaps; gap counts: " + ", ".join(f"{k} {v}" for k, v in
          Counter(g.split()[0] if g.startswith("grade") else g for _, _, gs in rows for g in gs).most_common()))
    batch = rows[:a.n]
    for s, r, gaps in batch:
        print(f"{s:5}  {r['actor_id']}  {r['name'][:40]:40}  {r['actor_type'][:14]:14}  {', '.join(gaps)}")
    if a.out:
        with open(a.out, "w", newline="", encoding="utf-8") as f:
            w = csv.writer(f, lineterminator="\n")
            w.writerow(["actor_id", "name", "actor_type", "location", "score", "gaps"])
            for s, r, gaps in batch:
                w.writerow([r["actor_id"], r["name"], r["actor_type"], r["location"], s, "; ".join(gaps)])
        print(f"Wrote {len(batch)} actors to {a.out}")


if __name__ == "__main__":
    sys.exit(main())
