#!/usr/bin/env python3
"""Fill empty wikidata_qid values in a country folder, conservatively.

Usage: python skill/scripts/match_wikidata.py data/<iso2> [--dry-run] [--any-country]

A person gets a QID only when exactly one human (Q5) on Wikidata has the actor's exact name as label or alias (in
English or the country's languages), holds that citizenship (P27) and fits the actor's type: a politician holds an
office (P39) or is a politician by occupation; an economist, academic, journalist or union official has that
occupation. Other types (campaigners, wealthy signers) are not matched. An organisation needs exactly one
non-human item with the exact label and that country (P17); aliases are not used, since they join national
branches to their parent. Anything ambiguous is left blank and listed. --any-country drops the citizenship tie
(for foreign economists on a national list, say); a foreign figure also gets the QID another country's register
already holds for the same exact name and type. A spot check of an earlier, looser version found one wrong match
in eight. The QID is the key that links one person across
countries on the site, so a wrong match is worse than none: spot-check a sample of what it fills. Standard library only.
"""
import argparse, csv, json, sys, time, urllib.parse, urllib.request
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent))
import wtdb  # noqa: E402

UA = {"User-Agent": "wealth-tax-supporters/0.1 (https://github.com/Egalitaristen/wealth-tax-supporters)"}
COUNTRY = {"BE": ("Q31", ["nl", "fr", "de", "en"]), "BR": ("Q155", ["pt", "en"]), "CA": ("Q16", ["en", "fr"]),
           "CN": ("Q148", ["zh", "en"]), "DE": ("Q183", ["de", "en"]), "ES": ("Q29", ["es", "ca", "eu", "gl", "en"]),
           "FR": ("Q142", ["fr", "en"]), "GB": ("Q145", ["en"]), "ID": ("Q252", ["id", "en"]), "IN": ("Q668", ["en", "hi"]),
           "JP": ("Q17", ["ja", "en"]), "MY": ("Q833", ["ms", "en"]), "NG": ("Q1033", ["en"]), "NL": ("Q55", ["nl", "en"]),
           "NO": ("Q20", ["nb", "nn", "en"]), "PL": ("Q36", ["pl", "en"]), "SE": ("Q34", ["sv", "en"]),
           "SG": ("Q334", ["en", "zh"]), "US": ("Q30", ["en"])}


def sparql(q):
    body = urllib.parse.urlencode({"query": q, "format": "json"}).encode()  # POST: long VALUES lists break GET
    for i in range(4):
        try:
            req = urllib.request.Request("https://query.wikidata.org/sparql", data=body, headers=UA)
            return json.load(urllib.request.urlopen(req, timeout=90))["results"]["bindings"]
        except Exception as e:  # rate limits and timeouts: back off and retry
            err = e
            time.sleep(5 * (i + 1))
    raise SystemExit(f"Wikidata query failed: {err}")


def lit(s):
    return json.dumps(s, ensure_ascii=False)


def matches(names, langs, person, country, any_country):
    """{name: set(qids)} for names that are an exact label or alias of a human / a non-human in the country."""
    vals = " ".join(f"{lit(n)}@{l}" for n in names for l in langs)
    if person:
        tie = "" if any_country else f"?item wdt:P27 wd:{country} ."
        kind, label = "?item wdt:P31 wd:Q5 .", "rdfs:label|skos:altLabel"
    else:  # organisations: the exact label only, since aliases join national branches to the parent (Oxfam GB, Oxfam)
        tie = f"?item wdt:P17 wd:{country} ."
        kind, label = "FILTER NOT EXISTS { ?item wdt:P31 wd:Q5 }", "rdfs:label"
    q = f"""SELECT DISTINCT ?name ?item WHERE {{ VALUES ?label {{ {vals} }}
      ?item {label} ?label . {kind} {tie} BIND(STR(?label) AS ?name) }}"""
    out = {}
    for b in sparql(q):
        out.setdefault(b["name"]["value"], set()).add(b["item"]["value"].rsplit("/", 1)[1])
    return out


ROLE = {"politician": "{ ?item p:P39 [] } UNION { ?item wdt:P106 wd:Q82955 }",
        "economist": "?item wdt:P106/wdt:P279* wd:Q188094 .",
        "academic": "?item wdt:P106/wdt:P279* wd:Q1622272 .",
        "journalist": "?item wdt:P106/wdt:P279* wd:Q1930187 .",
        "union_official": "?item wdt:P106/wdt:P279* wd:Q15627169 ."}


def fitting(qids, actor_type):
    """The candidates whose Wikidata entry fits the actor's role (a politician holds an office, and so on)."""
    out, qids = set(), sorted(qids)
    for i in range(0, len(qids), 150):
        vals = " ".join(f"wd:{q}" for q in qids[i:i + 150])
        out |= {b["item"]["value"].rsplit("/", 1)[1]
                for b in sparql(f"SELECT DISTINCT ?item WHERE {{ VALUES ?item {{ {vals} }} {ROLE[actor_type]} }}")}
        time.sleep(1)
    return out


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("dir"); ap.add_argument("--dry-run", action="store_true"); ap.add_argument("--any-country", action="store_true")
    a = ap.parse_args()
    meta = json.load(open(Path(a.dir) / "meta.json", encoding="utf-8"))
    country, langs = COUNTRY[meta["iso2"].upper()]
    rows = wtdb.load(a.dir, "actors")
    taken = {r["wikidata_qid"] for r in rows if r.get("wikidata_qid")}
    todo = [r for r in rows if not r.get("wikidata_qid") and r.get("kind") in ("person", "organisation")]
    found, unclear = {}, []
    for person in (True, False):
        names = sorted({r["name"] for r in todo if (r["kind"] == "person") == person})
        for i in range(0, len(names), 40):
            found.update({(person, n): q for n, q in matches(names[i:i + 40], langs, person, country, a.any_country).items()})
            time.sleep(1)
    # A person matches only through their role, so a same-name stranger (a sports announcer for a water-board
    # director) cannot slip in. Types without a role check (campaigners, wealthy signers) are left for a person.
    fit = {t: fitting({q for r in todo if r["kind"] == "person" and r["actor_type"] == t
                       for q in found.get((True, r["name"]), set())}, t) for t in ROLE}
    filled = 0
    for r in todo:
        q = found.get((r["kind"] == "person", r["name"]), set())
        if r["kind"] == "person":
            q = q & fit.get(r["actor_type"], set())
        if len(q) == 1 and next(iter(q)) not in taken:
            r["wikidata_qid"] = next(iter(q)); taken.add(r["wikidata_qid"]); filled += 1
        elif len(q) > 1:
            unclear.append(f"{r['actor_id']} {r['name']}: {', '.join(sorted(q))}")
    # Foreign figures (Zucman on the Spanish register) fail the citizenship tie; take the QID that another country's
    # register already holds for the same exact name and type, when there is exactly one.
    known = {}
    for other in Path(a.dir).parent.iterdir():
        if other.resolve() != Path(a.dir).resolve() and (other / "actors.csv").exists():
            for o in wtdb.load(str(other), "actors"):
                if o.get("wikidata_qid"):
                    known.setdefault((o["name"], o["actor_type"]), set()).add(o["wikidata_qid"])
    for r in todo:
        q = known.get((r["name"], r["actor_type"]), set())
        if not r.get("wikidata_qid") and len(q) == 1 and next(iter(q)) not in taken:
            r["wikidata_qid"] = next(iter(q)); taken.add(r["wikidata_qid"]); filled += 1
    print(f"{filled} of {len(todo)} actors without a QID matched; {len(unclear)} ambiguous (left blank):")
    for u in unclear:
        print("  " + u)
    if not a.dry_run:
        wtdb.save(a.dir, "actors", rows)


if __name__ == "__main__":
    sys.exit(main())
