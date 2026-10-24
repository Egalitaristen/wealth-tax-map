---
name: wealth-tax-supporters-refine
description: Refine the supporters already in one country's register of the Wealth Tax Supporters database. For each supporter, in order: add their official website and public social accounts, place them as precisely as public sources allow, add up to three more sourced statements (stronger grades and recent ones first), and check that their support is still current. Use when asked to refine, enrich, deepen, update or improve an existing country, or to add links, locations or more sources for its supporters.
---

# Refine a country's supporters

The research skill (`skill/SKILL.md`) finds supporters. This skill makes each entry better: easier to reach, better placed, better sourced and still true. It works on supporters who are already in `data/<iso2>/`; it does not look for new ones (that is a research run).

**The rules of `skill/SKILL.md` apply unchanged**: what counts as a wealth tax (section 2), the grades (3), who may be recorded (1 and 4), the file formats and controlled values (5). Read sections 1 to 5 before the first run. This file only adds the refinement workflow.

## 1. Start

1. Pick the country. If the user did not name one, take the country whose supporters were refined longest ago (or never: the `refined` column in `actors.csv` is empty), say which, and start.
2. Work on a branch and open one pull request per run. Never push to `main`.
3. Make the batch: `python skill/scripts/refine_queue.py data/<iso2> --n 60 --out refine_batch.csv`. It ranks supporters by their gaps (no links first, then a coarse place, weak grades, a single statement, old evidence, no Wikidata ID), puts prominent ones first and skips anyone refined in the last 180 days. Keep the batch file outside the repository. A run is one batch; 30 to 80 supporters is a good size.

## 2. The automatic pass (whole country, minutes)

Run these first; they fill what open data already knows, so the manual work starts from the real gaps:

```bash
python skill/scripts/match_wikidata.py data/<iso2>       # Wikidata IDs where the match is unambiguous
python skill/scripts/profiles_wikidata.py data/<iso2>    # websites and accounts that Wikidata lists
python skill/scripts/wtdb.py locate data/<iso2>          # geo_unit_id and location in step
python skill/scripts/archive_sources.py data/<iso2>      # archive_url from existing Wayback snapshots
```

Spot-check a handful of what `match_wikidata.py` filled (the description should fit the person) before going on.

## 3. Each supporter, in this order

Work through the batch one supporter at a time and write to the files as you go (`wtdb.py add`, `wtdb.py set`). Spend minutes, not hours, on each: take what the sources readily give and move on.

### 3.1 Links (most important)
A visitor who finds a supporter should be able to reach them. Add to `profiles.csv`:
- their **official website** (their own, their office's or their organisation's page about them);
- the **public social accounts they run in their public role**: X, Bluesky, Mastodon, Instagram, Facebook, YouTube, TikTok, LinkedIn, Substack;
- their **parliament or party page**, and **Wikipedia**.

Find accounts where the person or organisation links them: the header or footer of their website, their parliament or party profile, their organisation's page. A name search on a platform is not a source: the account must be linked from a page they control or one that lists them officially (Wikidata or a parliament counts). `source` is the page where you found the link and `checked` the date. Only https links. Skip private accounts, and skip links for people who are on the register only as signatories of a list and hold no public role.

### 3.2 Place
Put each supporter in the finest place a public source shows, and record that source in `location_source`:
- a legislator: the seat (constituency, district, state), as in `skill/SKILL.md` 6.7 (no `location_source` needed);
- an organisation: the city of its head office, or of the branch that made the statement;
- a person: where public sources say they are based or from. A news profile, their own biography, their university or employer page all count, as does Wikidata. Town level at most: never a street, an address or anything a reader could use to find their home.

Write the place as a path that resolves to a register unit (`wtdb.py locate` updates `geo_unit_id`); anything finer than the register goes after it as place text. If sources disagree, use the one closest to their public role and say so in the run log.

### 3.3 Statements (at most three new ones per supporter per run)
In this order of value:
1. **A stronger grade**: their own words or a formal act (a vote, a sponsored bill, a signed letter, a policy) for a supporter who is only at B or C;
2. **A recent statement**, if their latest is more than a few years old;
3. **A different kind or year**, to show the support is consistent.

Their own channels first (website, press releases, speeches, parliamentary records, their own posts and op-eds), then interviews and reporting. Apply section 2 of `skill/SKILL.md` to every statement: words about taxing wealth, not just "tax the rich". Quote verbatim, translate in `quote_en`, grade each row on its own, and leave the existing rows as they are. Three is a cap, not a target.

### 3.4 Still a supporter?
If their latest statement is from before 2020, or anything suggests a change of mind (a new party, a government role, a vote against), search for their recent position. If they now oppose a wealth tax, add a row with `stance=retracted`, quoting where they said so. The site leaves out anyone whose latest evidence is a retraction, and the files keep the history. If it is unclear, keep them and note it in the run log, not in `notes`.

### 3.5 Facts and finish
Update `role`, `party` and `status` (`former_role` when they no longer hold the role the evidence came from) when a source shows a change. Merge any duplicate you notice (`wtdb.py dedupe`, then `merge`). Then set the date: `python skill/scripts/wtdb.py set data/<iso2> actors <ID> refined=<YYYY-MM-DD>`. Set it also when you found nothing to add, so the queue moves on.

## 4. End of the run

1. `wtdb.py validate data/<iso2>`: fix every error.
2. `wtdb.py checkquotes data/<iso2> --run <run>`: every new quote must be on its page; fix or remove what is not.
3. `archive_sources.py data/<iso2> --save` for the new sources (slow: run it in the background).
4. Add a row to `runs.csv` with `focus` = `refine: <n> supporters`, and in `notes_next` what the next batch should look at.
5. Open the pull request. Report from the files, not memory:
   - links added, and supporters who still have none;
   - places made finer;
   - statements added and grades raised;
   - retractions;
   - supporters you could not improve, and why.

## 5. Things to avoid

- **Guessed links.** An account with the right name but no link from the person's own pages may belong to someone else. Leave it out.
- **Home towns that reveal homes.** Town level at most, and only from a public source about their public life.
- **Rewriting history.** Never edit or delete an existing evidence row because a newer one exists; add the new one. Remove a row only when its quote is not on its page.
- **Notes that narrate the work.** ("Checked X, nothing found.") That goes in the run log; `notes` are shown to readers.
- **New supporters.** Someone you meet who is not in the register is a lead for a research run: list them in the run log or `harvest.csv` instead of adding them here.
