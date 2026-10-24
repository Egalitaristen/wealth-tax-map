#!/usr/bin/env python3
"""Review supporter suggestions sent from the site's /suggest form (Cloudflare D1 database wts-suggestions).

Usage:
  python scripts/suggestions.py                     list new suggestions, oldest first
  python scripts/suggestions.py --all               list every suggestion, with its status
  python scripts/suggestions.py mark ID STATUS [NOTE]   STATUS: added | duplicate | rejected | new
  python scripts/suggestions.py export FILE.csv     write the new ones to a CSV (for a research run to work through)

A suggestion is a lead, not evidence: check it against its source with the rules in skill/SKILL.md before adding
anyone, then mark it. Needs Node.js and a one-time `npx wrangler login`. ID may be the first 8 characters.
"""
import argparse, csv, json, shutil, subprocess, sys, textwrap
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
DB = "wts-suggestions"
COLS = "id, created_at, name, country, place, links, said, page, status, review_note"


def d1(sql, *params):
    npx = shutil.which("npx") or shutil.which("npx.cmd")
    if not npx:
        sys.exit("npx not found: install Node.js, then run `npx wrangler login` once.")
    for p in params:  # wrangler takes one SQL string; quote values as SQL literals
        sql = sql.replace("?", "'" + str(p).replace("'", "''") + "'", 1)
    out = subprocess.run([npx, "--yes", "wrangler@4", "d1", "execute", DB, "--remote", "--json", "--command", sql],
                         cwd=ROOT, capture_output=True, text=True, encoding="utf-8")
    if out.returncode:
        sys.exit(out.stderr or out.stdout)
    return json.loads(out.stdout)[0].get("results", [])


def full_id(prefix):
    rows = d1("SELECT id FROM suggestions WHERE id LIKE ?", prefix + "%")
    if len(rows) != 1:
        sys.exit(f"{len(rows)} suggestions match '{prefix}'")
    return rows[0]["id"]


def show(rows):
    for r in rows:
        print(f"\n[{r['id'][:8]}] {r['created_at'][:16].replace('T', ' ')}  {r['status'].upper()}")
        print(f"  {r['name']}  ·  {r['country']}" + (f"  ·  {r['place']}" if r.get("place") else ""))
        for link in (r.get("links") or "").splitlines():
            print(f"  {link}")
        if r.get("said"):
            print(textwrap.indent(textwrap.fill(r["said"], 100), "  > "))
        if r.get("review_note"):
            print(f"  note: {r['review_note']}")
    print(f"\n{len(rows)} suggestion(s)")


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("cmd", nargs="?", default="list", choices=["list", "mark", "export"])
    ap.add_argument("args", nargs="*")
    ap.add_argument("--all", action="store_true")
    a = ap.parse_args()
    if a.cmd == "list":
        where = "" if a.all else "WHERE status = 'new'"
        show(d1(f"SELECT {COLS} FROM suggestions {where} ORDER BY created_at"))
    elif a.cmd == "mark":
        if len(a.args) < 2 or a.args[1] not in ("added", "duplicate", "rejected", "new"):
            sys.exit("Usage: suggestions.py mark ID added|duplicate|rejected|new [NOTE]")
        sid = full_id(a.args[0])
        d1("UPDATE suggestions SET status = ?, review_note = ?, reviewed_at = ? WHERE id = ?", a.args[1],
           " ".join(a.args[2:]), datetime.now(timezone.utc).isoformat(timespec="seconds"), sid)
        print(f"{sid[:8]} marked {a.args[1]}")
    elif a.cmd == "export":
        if not a.args:
            sys.exit("Usage: suggestions.py export FILE.csv")
        rows = d1(f"SELECT {COLS} FROM suggestions WHERE status = 'new' ORDER BY created_at")
        with open(a.args[0], "w", newline="", encoding="utf-8") as f:
            w = csv.DictWriter(f, fieldnames=[c.strip() for c in COLS.split(",")], lineterminator="\n")
            w.writeheader(); w.writerows(rows)
        print(f"Wrote {len(rows)} new suggestion(s) to {a.args[0]}")


if __name__ == "__main__":
    sys.exit(main())
