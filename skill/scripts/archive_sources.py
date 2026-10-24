#!/usr/bin/env python3
"""Fill evidence.archive_url with a Wayback Machine copy of each source, so quotes stay checkable when pages move.

Usage: python skill/scripts/archive_sources.py data/<iso2> [--ids E00012,E00013] [--limit 200] [--save] [--dry-run]

For each evidence row without an archive_url, asks the Wayback Machine for the snapshot closest to the statement's
date. With --save, a source that has no snapshot yet is submitted for saving (slowly: the Wayback Machine limits how
often one client can save), and its new snapshot is recorded. Sources are looked up once each, however many rows
cite them. Standard library only.
"""
import argparse, json, sys, time, urllib.error, urllib.parse, urllib.request
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent))
import wtdb  # noqa: E402

UA = {"User-Agent": "wealth-tax-supporters/0.1 (https://github.com/Egalitaristen/wealth-tax-supporters)"}


def closest(url, date):
    stamp = "".join(ch for ch in (date or "") if ch.isdigit())[:8]
    q = "https://archive.org/wayback/available?" + urllib.parse.urlencode({"url": url, **({"timestamp": stamp} if stamp else {})})
    d = None
    for wait in (0, 15, 45, 120):  # the Wayback Machine answers 429 when asked too fast: wait and try again
        time.sleep(wait)
        try:
            d = json.load(urllib.request.urlopen(urllib.request.Request(q, headers=UA), timeout=40))
            break
        except urllib.error.HTTPError as e:
            if e.code != 429:
                return ""
        except Exception:
            return ""
    if d is None:
        return ""
    snap = (d.get("archived_snapshots") or {}).get("closest") or {}
    return snap.get("url", "").replace("http://web.archive.org", "https://web.archive.org") if snap.get("available") else ""


def save(url):
    try:
        r = urllib.request.urlopen(urllib.request.Request("https://web.archive.org/save/" + url, headers=UA), timeout=120)
        loc = r.geturl()
        return loc if "/web/" in loc else ""
    except Exception:
        return ""


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("dir"); ap.add_argument("--ids"); ap.add_argument("--limit", type=int, default=200)
    ap.add_argument("--save", action="store_true"); ap.add_argument("--dry-run", action="store_true")
    a = ap.parse_args()
    rows = wtdb.load(a.dir, "evidence")
    todo = [e for e in rows if not e.get("archive_url") and e.get("source_url", "").startswith("http")
            and (not a.ids or e["evidence_id"] in a.ids.split(","))]
    urls = list(dict.fromkeys(e["source_url"] for e in todo))[:a.limit]
    found = {}
    for i, u in enumerate(urls, 1):
        date = min(e["date"] for e in todo if e["source_url"] == u)
        snap = closest(u, date)
        if not snap and a.save:
            snap = save(u)
            time.sleep(12)
        found[u] = snap
        print(f"[{i}/{len(urls)}] {'ok  ' if snap else 'none'} {u[:90]}")
        time.sleep(3)
    n = 0
    for e in rows:
        if not e.get("archive_url") and found.get(e.get("source_url")):
            e["archive_url"] = found[e["source_url"]]; n += 1
    print(f"{sum(1 for v in found.values() if v)} of {len(urls)} sources archived; archive_url set on {n} rows")
    if not a.dry_run:
        wtdb.save(a.dir, "evidence", rows)


if __name__ == "__main__":
    sys.exit(main())
