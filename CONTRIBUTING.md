# Contributing

Thanks for helping. This project records, with sources, who publicly supports a wealth tax. Accuracy matters more than volume.

## Ground rules

1. **Supporters only.** If someone opposes or doubts a wealth tax, do not add them. If a supporter later retracts, add an evidence row with `stance=retracted`.
2. **Every row needs a source.** A dated, working URL and a short word-for-word quote (keep quotes under about 25 words). Add an archive link in `archive_url` where you can.
3. **Quote what you read.** Do not quote from memory, from a search snippet or from a summary tool's paraphrase, and never write a sentence of your own into the quote column. Use the page's own text and run `python skill/scripts/wtdb.py checkquotes data/<iso2> --run <run>`.
4. **Public figures and organisations only.** Never add petition signers or private individuals. Self-declared signers of a public open letter are fine.
5. **Grade honestly.** A: formal act or a stated design. B: names a wealth tax. C: implied. When unsure, use the lower grade.
6. **People are assumed alive.** Check for a death record (Wikidata is a good start) and set `alive_checked=y`. If dead, add them to `exclusions.csv` with reason `deceased`, not to `actors.csv`. Do not write "alive" or "no Wikidata match" in `notes`; notes are shown to readers and are for identity caveats and sources only.
7. **Every quote is found on its source.** Run `wtdb.py checkquotes` and fix or remove what it cannot find.

## Adding a country or region

```bash
python skill/scripts/wtdb.py init data/<iso2> --area "<Name>"
```

Use the lowercase ISO 3166-1 alpha-2 code (`de`, `fr`), or `<iso2>-<region>` for a sub-national area (`us-ca`). Then follow `skill/SKILL.md`, starting with section 0.

What a good first contribution looks like: the most prominent supporters across every layer (legislature, parties, coalitions and unions, economists, commentators, wealthy and business, regional), each with a checked quote, and a short plan for what to do next. Regional and local work is sampled first and expanded only where it finds support. You do not need to cover every municipality; say what you did not search. In `data/<iso2>/meta.json` set `name`, `iso2`, `lead` (your GitHub username) and `status`.

For a local map, add a `boundaries.json` and name it in `meta.json`. If you have a TopoJSON of your areas, `python skill/scripts/topo_to_boundaries.py` writes it for you (the US map was made that way). Format:

```json
{"viewBox": [x, y, width, height],
 "units": [{"name": "Area name", "code": "optional", "path": "M0 0L10 0L10 10Z"}]}
```

Unit names must match the `name` column of `geo_units.csv`, or match it up to the opening bracket (`Alabama` matches `Alabama (state legislature and state government)`). Paths use any flat coordinate system; the viewBox is in the same units.

## Using an AI assistant

Allowed and encouraged, with these conditions:

- State in the pull request that an assistant did the research.
- Check a sample of its rows yourself against the sources. Assistants invent quotes and misread dates.
- Assistants and agents work on a branch and open a pull request. They never push to `main`.
- Record what you chose to leave out (levels, years, sources that blocked you) in `meta.json` `notes` and the area profile, so the next person can continue.

## Pull request checks

CI runs `python skill/scripts/wtdb.py validate` on every country and builds the site; errors must be fixed before merge. It also spot-checks a sample of quotes against their pages. That check is advisory, because some sites block automated fetches, so a miss is a prompt to look, not a failure.

## Corrections and removals

Anyone can open a [data report](../../issues/new?template=data-report.yml). Maintainers aim to fix clear errors quickly and will remove an entry when its source does not support it, when the person is not a public figure, or when the person has died.

## Party column

For politicians, fill the `party` column with the party's common English name (`Labour`, `Green Party`, `Independent` if none), one name per party, so the site can filter on it. `validate` warns when a politician has no party.

## Location

Every actor has a `location` path from the country down, for example `United States > California > Camarillo` or `United Kingdom > London > Hackney`. Give the finest place you can prove and stop there: a state if you only know the state, just the country for a national group. A legislator's location is the place they represent, not the institution. The country root and the register units are in `geo_units.csv`; places not in the register stay as text and resolve when that layer is added. `validate` checks that the path starts at the country root.

## More than one type

Pick the main role for `actor_type` and list any others in `other_types`, separated by `;` (for example `journalist` with `economist`). The site filters and counts a person under every type they hold.

## Links and socials

Add rows to `profiles.csv` for public figures and organisations: their own website, their parliament, council or party page, and professional social accounts they publish, or links that Wikidata lists for them. Never add personal accounts, email addresses or phone numbers, and do not guess a handle from a name search. Skip private individuals, including people only known as wealthy signers of a letter. `validate` checks that links are https and match their platform.
