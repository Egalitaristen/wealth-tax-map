#!/usr/bin/env python3
"""Fill profiles.csv for a country folder from Wikidata and the actors' website column.

Usage: python skill/scripts/profiles_wikidata.py data/<iso2> [--dry-run]

For every supporter who has a wikidata_qid, adds the website, X, Bluesky, Mastodon, Instagram, Facebook, YouTube,
TikTok and LinkedIn accounts that Wikidata lists, plus the English Wikipedia page. It also copies a filled
`website` column into profiles. Only official or professional accounts that Wikidata records are added. Nothing is
guessed from a name. Existing (actor, platform) pairs are never overwritten, so it is safe to run again.

Skips actors whose only type is wealthy_individual (see the rules in SKILL.md). Standard library only.
"""
import argparse, csv, json, subprocess, sys, time, urllib.parse, urllib.request
from datetime import date
from pathlib import Path

WTDB = Path(__file__).with_name("wtdb.py")
UA = {"User-Agent": "wealth-tax-supporters/0.1 (https://github.com/Egalitaristen/wealth-tax-supporters)"}
PROPS = {"P2002": ("x", "https://x.com/{}"), "P12361": ("bluesky", "https://bsky.app/profile/{}"),
         "P2003": ("instagram", "https://www.instagram.com/{}/"), "P2013": ("facebook", "https://www.facebook.com/{}"),
         "P2397": ("youtube", "https://www.youtube.com/channel/{}"), "P7085": ("tiktok", "https://www.tiktok.com/@{}"),
         "P6634": ("linkedin", "https://www.linkedin.com/in/{}/")}


def get(url):
    for i in range(3):
        try:
            return json.load(urllib.request.urlopen(urllib.request.Request(url, headers=UA), timeout=40))
        except Exception:
            time.sleep(2 * (i + 1))
    return None


def claim(ent, p):
    best = None
    for c in ent.get("claims", {}).get(p, []):
        if c.get("rank") == "deprecated":
            continue
        v = c.get("mainsnak", {}).get("datavalue", {}).get("value")
        if v is None:
            continue
        if c.get("rank") == "preferred":
            return v
        best = best or v
    return best


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("dir")
    ap.add_argument("--dry-run", action="store_true")
    a = ap.parse_args()
    d = Path(a.dir)
    rd = lambda f: list(csv.DictReader(open(d / f, encoding="utf-8"))) if (d / f).exists() else []
    actors, evidence, prof = rd("actors.csv"), rd("evidence.csv"), rd("profiles.csv")
    sup = {e["actor_id"] for e in evidence}
    have = {(p["actor_id"], p["platform"]) for p in prof}
    today = date.today().isoformat()
    new = []

    def add(aid, platform, url, source):
        if (aid, platform) in have or not url.startswith("https://"):
            return
        have.add((aid, platform))
        new.append({"actor_id": aid, "platform": platform, "url": url, "source": source, "checked": today})

    eligible = []
    for r in actors:
        if r["actor_id"] not in sup:
            continue
        types = {r["actor_type"], *[x for x in r.get("other_types", "").split(";") if x]}
        if types == {"wealthy_individual"}:
            continue
        eligible.append(r)
        if r.get("website"):
            add(r["actor_id"], "website", r["website"].replace("http://", "https://", 1), "actors.csv website column")
    by_q = {r["wikidata_qid"]: r for r in eligible if r.get("wikidata_qid")}
    ids = list(by_q)
    for i in range(0, len(ids), 40):
        data = get("https://www.wikidata.org/w/api.php?action=wbgetentities&props=claims|sitelinks&format=json&ids="
                   + "|".join(ids[i:i + 40]))
        for qid, ent in (data or {}).get("entities", {}).items():
            r, src = by_q[qid], f"Wikidata {qid}"
            v = claim(ent, "P856")
            # Some entries give a social account as the "official website"; that one is added under its platform below.
            social = ("x.com/", "twitter.com/", "facebook.com/", "instagram.com/", "bsky.app/", "youtube.com/", "tiktok.com/", "linkedin.com/")
            if isinstance(v, str) and not any(s in v for s in social):
                add(r["actor_id"], "website", v.replace("http://", "https://", 1), src)
            for p, (plat, tpl) in PROPS.items():
                v = claim(ent, p)
                if isinstance(v, str):
                    add(r["actor_id"], plat, tpl.format(v), src)
            v = claim(ent, "P4033")
            if isinstance(v, str) and "@" in v:
                user, host = v.lstrip("@").split("@", 1)
                add(r["actor_id"], "mastodon", f"https://{host}/@{user}", src)
            sl = ent.get("sitelinks", {}).get("enwiki")
            if sl:
                add(r["actor_id"], "wikipedia", "https://en.wikipedia.org/wiki/"
                    + urllib.parse.quote(sl["title"].replace(" ", "_")), src)
        time.sleep(0.3)
    print(f"{len(by_q)} actors with a Wikidata ID; {len(new)} new links")
    if a.dry_run or not new:
        return
    tmp = d / "_profiles_new.jsonl"
    tmp.write_text("\n".join(json.dumps(r, ensure_ascii=False) for r in new), encoding="utf-8")
    subprocess.run([sys.executable, str(WTDB), "add", str(d), "profiles", "@" + str(tmp)], check=True,
                   stdout=subprocess.DEVNULL)
    tmp.unlink()
    print("Added. Run wtdb.py validate to check them.")


if __name__ == "__main__":
    main()
