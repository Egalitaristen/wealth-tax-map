#!/usr/bin/env python3
"""Scan a country folder for the evidence problems that have come up in review, before opening a pull request.

Usage: python skill/scripts/review_scan.py data/<iso2> [--names] [--max 12]

It never changes a file. Each check prints a count and examples; judge them by reading the rows. The checks:
  1. platform  many people sharing one source and quote (a party manifesto or questionnaire answer, a roster page)
  2. nowords   quotes with no wealth or tax wording at all (a name, a biography, a slogan, a citation)
  3. citation  quotes that are a bibliography entry or paper title
  4. exit_only supporters whose only design is an exit tax (SKILL.md counts it only when tied to a wealth tax)
  5. partial   rows typed partial_wealth whose text is about land, property, luxury goods, VAT or inheritance
  6. dates     statement dates that are the access date, in the future, or shared by ten or more recent rows (a roster's update date)
  7. personal  quotes that carry a birth date or other personal data
  8. polls     each poll, for checking its figures at the source (is it about a wealth tax? who paid for it?)
  9. names     (--names) actors whose name is not on their source page (rosters, author lists)
Standard library only (the names check fetches pages).
"""
import argparse, collections, datetime as dt, re, sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent))
import wtdb  # noqa: E402

WORDS = re.compile(r"wealth|tax|levy|fortun|billionair|millionair|richest|asset|patrimoin|patrimon|vermog|vermög|steuer|belast|"
                   r"imp[oô]t|impost|riquez|formue|skatt|förmögen|pajak|kekayaan|cukai|podat|majątk|bogac|富|税|課税|資産|財産|"
                   r"财|賦|kaya|jutawan|miljon|miljard|superrijk|zucman|piketty", re.I)
CITE = re.compile(r"\(\d{4}\)|\b(?:19|20)\d\d\)\.|\bet al\.|^[A-ZÆØÅ][a-zæøå]+,\s[A-Z]\.", re.M)
PARTIAL_OUT = re.compile(r"land|vacant|property|real estate|luxur|jet|VAT|inherit|estate duty|erfen|arv|cadastr|house|housing|mansion", re.I)
PERSONAL = re.compile(r"\b(19|20)\d\d-\d\d-\d\dT\d\d:|\bkvinne\b|\bmann\b\s*$|date of birth|born on", re.I)
SHARED = {"manifesto", "policy_adoption", "campaign", "coalition_membership", "open_letter", "motion_signature", "report", "statement"}


def show(title, rows, A, n, fmt=None):
    print(f"\n[{title}] {len(rows)}")
    for r in rows[:n]:
        print("   " + (fmt(r) if fmt else r))
    if len(rows) > n:
        print(f"   ... {len(rows) - n} more")


def main():
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("dir"); ap.add_argument("--names", action="store_true"); ap.add_argument("--max", type=int, default=12)
    a = ap.parse_args()
    db = wtdb.load_all(a.dir)
    A = {r["actor_id"]: r for r in db["actors"]}
    E = db["evidence"]
    nm = lambda e: f"{e['evidence_id']} {A[e['actor_id']]['name'][:26]} [{A[e['actor_id']]['actor_type'][:9]}] {e['evidence_type'][:9]} \"{e['quote_original'][:70]}\""
    print(f"{a.dir}: {len(A)} actors, {len(E)} evidence rows")

    # 1 platform / roster groups
    groups = collections.defaultdict(list)
    for e in E:
        if e["evidence_type"] in SHARED and A[e["actor_id"]]["kind"] == "person":
            groups[(e["source_url"], e["quote_original"][:60].lower())].append(e)
    big = sorted((g for g in groups.values() if len({x["actor_id"] for x in g}) >= 6), key=len, reverse=True)
    print(f"\n[platform] {len(big)} groups of 6 or more people sharing one source and quote")
    for g in big[:a.max]:
        types = collections.Counter(A[x["actor_id"]]["actor_type"] for x in g).most_common(2)
        print(f"   {len(g):3}x {g[0]['evidence_type']}/{g[0]['grade']} {types} {g[0]['source_url'][8:60]} \"{g[0]['quote_original'][:60]}\"")

    show("nowords", [e for e in E if e["evidence_type"] != "vote" and not WORDS.search(e["quote_original"])], A, a.max, nm)
    show("citation", [e for e in E if CITE.search(e["quote_original"]) and e["evidence_type"] != "vote"], A, a.max, nm)
    designs = collections.defaultdict(set)
    for e in E:
        designs[e["actor_id"]].add(e["wt_design"])
    only = [i for i, d in designs.items() if d == {"exit_tax"}]
    show("exit_only", only, A, a.max, lambda i: f"{i} {A[i]['name']}")
    show("partial", [e for e in E if e["wt_design"] == "partial_wealth" and PARTIAL_OUT.search(e["quote_original"] + " " + e["design_detail"])], A, a.max, nm)
    today = dt.date.today()
    recent = collections.Counter(e["date"] for e in E if e["date"][:10] >= (today - dt.timedelta(days=30)).isoformat())
    odd = [e for e in E if e["date"] > today.isoformat() or e["date"] == e.get("accessed") or recent[e["date"]] >= 10]
    show("dates", odd, A, a.max, lambda e: f"{nm(e)} date {e['date']} ({recent[e['date']]} rows share it)")
    show("personal", [e for e in E if PERSONAL.search(e["quote_original"])], A, a.max, nm)

    import json
    try:
        meta = json.load(open(Path(a.dir) / "meta.json", encoding="utf-8"))
    except OSError:
        meta = {}
    print(f"\n[polls] {len(meta.get('polls', []))}")
    for p in meta.get("polls", []):
        print(f"   {p.get('support')}% | {p.get('question', '')[:80]} | {p.get('pollster')} | commissioned by {p.get('commissioned_by') or '?'} | {p.get('url', '')[:70]}")

    if a.names:
        cache, miss = {}, []
        for e in E:
            if e["evidence_type"] == "vote":
                continue
            page = cache.setdefault(e["source_url"], wtdb._fetch_for_check(e["source_url"], 30))
            if page is None:
                continue
            n = wtdb._plain(A[e["actor_id"]]["name"]); last = n.split()[-1] if n.split() else ""
            if n not in page and not (len(last) >= 4 and last in page):
                miss.append(e)
        show("names", miss, A, a.max, nm)


if __name__ == "__main__":
    sys.exit(main())
