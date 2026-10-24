## What this changes

<!-- Country folder(s) touched, number of actors and evidence rows added or changed. -->

## Depth and what was left out

<!-- Seed / Standard / Exhaustive. Which layers and units were not searched, and why (blocked, low yield, out of scope). The plan for the next runs is in the last row of runs.csv. -->

## Checklist

- [ ] `python skill/scripts/wtdb.py validate data/<iso2>` passes
- [ ] Every new row has a dated, working source URL and a short quote from the page itself (not a paraphrase)
- [ ] I ran `wtdb.py checkquotes` on the new rows and looked at anything it could not fetch
- [ ] I ran `wtdb.py dedupe` and merged true duplicates
- [ ] Supporters only: no opponents, no petition signers, no private individuals
- [ ] I checked for death records; anyone found dead is in `exclusions.csv`
- [ ] `checkquotes` finds every new quote on its source
- [ ] `meta.json` is filled in (`name`, `iso2`, `lead`, `status`)
- [ ] If there is a map: the shapes have a stated open licence (named here, with a link), and the unit codes are the official ones, not invented (`licence`, `licence_url` and `code_scheme` in `boundaries.json`)

## AI assistance

- [ ] An AI assistant did some or all of the research, and I checked a sample of its rows against the sources
- [ ] No AI assistance
