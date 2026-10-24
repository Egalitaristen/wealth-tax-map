---
name: wealth-tax-supporters
description: Build or extend a sourced database of the people, organisations and institutions in a country, region or supranational area that publicly support actual wealth taxation since 2010. Goal-first: find the most prominent supporters across every layer, with verifiable evidence and honest coverage notes, then plan the next runs. Use when asked to add a country, or to find, update, check or export wealth tax supporters for any area.
---

# Wealth Tax Supporters

Build a comprehensive, verifiable overview of everyone in an area who supports — or appears to support — **actual wealth taxation**: politicians who voted for or sponsored it, academics who argued for it, journalists who advocate it, organisations campaigning for it, councils that passed motions for it, and so on.

This is a database, not a ranking. Every entry rests on dated, sourced, quoted evidence. The work is done in repeatable **runs**; each run reads the current state from disk, works the highest-yield gaps, writes results as it goes, and logs what it did and what to do next, so any assistant in any session can pick up where the last one stopped. **Read section 0 first.**

Files in this skill (use them if present; the rules in this file are sufficient on their own):
- `references/source-playbook.md` — layers, bulk-list sources, query templates, search terms in many languages
- `references/area-profile-template.md` — what to establish about an area before searching
- `references/countries/gb.md` — the UK: levels of government, sources and an exhaustive council sweep (a worked example, not the template for every country)
- `references/countries/us.md` — a federal system (states, ballot measures, coalition letters), and what worked there
- `references/countries/se.md` — a unitary state with open parliamentary data, 21 regions and 290 municipalities
- `references/countries/de.md` — a federal state with a suspended wealth tax, Bundestag motions as bulk lists of named sponsors, and an official member register for the alive check
- `references/countries/in.md` — a country with no wealth tax since 2015, where support sits in the Left parties, a campaign (Tax the Top), Oxfam India and a handful of economists; notes on blocked sources and the district map
- `scripts/wtdb.py` — Python helper (stdlib; `openpyxl` only for xlsx export): `init`, `add`, `set`, `validate`, `dedupe`, `merge`, `checkquotes`, `status`, `export`
- `scripts/profiles_wikidata.py` — fills `profiles.csv` (websites, socials, Wikipedia) from Wikidata IDs
- `scripts/topo_to_boundaries.py` — turns a TopoJSON or shapefile of local areas (and their region outlines) into `boundaries.json`, so the country gets a local map on the site
- `scripts/fetch_page.py` — optional headless-browser reader for JavaScript pages and sites that answer 403 to plain clients, including their PDFs (needs `pip install playwright trafilatura`, a Chromium build, and optionally `npm install defuddle jsdom` in `scripts/`). `wtdb.py checkquotes` uses it automatically when a page cannot be read otherwise
- `scripts/adapters/se_meetingplus_scan.py` — optional Sweden adapter: full-text search of MeetingPlus council portals (Stockholm, Huddinge, Danderyd, Region Gotland)
- `scripts/adapters/se_riksdag_scan.py` — optional Sweden adapter: Riksdag scanner: motions, questions, committee reports, plenary debates, votes, member register
- `scripts/adapters/` — per-country source adapters (for example `gb_ocn_scan.py`, a UK council meeting scanner). Adapters are optional and always secondary to the first pass (6.5)

---

## 0. The goal, and how to use this skill

**The goal:** produce a trustworthy, sourced list of the people, organisations and institutions in an area who publicly back an actual wealth tax, so that anyone can see where support comes from and check the evidence behind every name.

**Success looks like:**
1. The **most prominent supporters are found first**: legislators who sponsored or voted for a wealth tax, parties with it in their programme, the big coalitions, unions and NGOs, leading economists, well-known commentators, public wealthy supporters.
2. **Every row is real**: a dated source you opened and a quote that is on the page.
3. **The coverage is honest**: the area profile and `notes` say what was searched, what was blocked and what was left out, so a blank is understood as "not searched" and not as "no support".
4. **The next person can continue**: the run log ends with a plan ordered by expected yield.

**Success is not** finishing every step of a process, covering every tiny unit, or building clever tooling. A first pass that finds 150 well-sourced supporters across all the important layers is worth far more than a half-finished crawler over 300 municipalities.

**How to use this skill:**
- The **rules** (sections 1 to 4: no source no row, the definition, grades, supporters only, public figures only) are firm. The **data format** (section 5) is firm, so that every country merges into one site.
- The **workflow** (section 6) is a default, not a script. Countries differ: some have powerful regions, some have no searchable local records, some have a single dominant campaign. Adapt the plan to the country, and write down what you changed and why in the area profile.
- **Aim at yield.** Before any large piece of work, ask "how many supporters will this find, and how sure am I?" Test with a small sample first. If a sample finds almost nothing, do not scale it up.
- **Look at what already exists** in the repository (the other countries' folders, notes in `skill/references/countries/`, helper scripts) before inventing something new.
- **When something does not work, change approach quickly.** A blocked site, a missing archive or an unsearchable register is a reason to switch source (archive copy, a browser, another outlet, a bulk list) within a few minutes, not a reason to build a tool. Say what you did in the run log.

---

## 1. Ground rules

1. **Apply the definition (section 2) to every piece of evidence.** Support for a mansion tax, capital gains reform or inheritance tax is not support for wealth taxation.
2. **No source, no row.** Every claim is an evidence row with a URL you actually opened and a **verbatim** quote found on that page. Never add an actor or evidence from memory or from a search-result snippet alone.
   - Fetch tools that return a summary can paraphrase. Quote from the raw page text (download it, or use a browser) and run `wtdb.py checkquotes` on the rows you add. It reads PDFs with `pdftotext` and falls back to the headless browser (`fetch_page.py`) for pages that block plain clients.
   - Never compose a sentence of your own and put it in `quote_original`. For list or roster pages where the only text is a name, use the text the page itself prints for that entry: a claim sentence in the page's structured data (JSON-LD), an official bill-status field such as `Rep. Lee, Barbara [D-CA-13]`, or the name and role as listed. Keep quotes short (about 25 words or fewer).
3. **Time window and the living.** Only evidence dated 2010-01-01 or later counts. Individuals are assumed alive unless a death record is found. Check before adding (Wikidata's date of death, or an obituary search when in doubt); anyone found dead goes in `exclusions.csv` (`deceased`), not in `actors.csv`. Record the check by setting `alive_checked=y`; do not narrate it in `notes`. Dissolved organisations may stay, marked `dissolved`.
4. **Supporters only.** Opponents are not recorded as actors. If an existing supporter later retracts or votes against, add evidence with `stance=retracted` (dated, quoted and sourced like any other row). An actor whose latest evidence is a retraction stays in the files but leaves the site.
5. **Public role, public record.** Only people acting in a public capacity (elected officials, officials, published authors, journalists, organisation leaders, people who publicly declared themselves, e.g. signed a published letter). Never record private individuals (ordinary petition signers, private social-media users), and never record home addresses, personal phone numbers or personal emails. Organisation websites and official pages are fine.
6. **The CSV files are the database.** Write each actor and its evidence to disk as soon as you have checked it — never hold a batch in memory to write at the end. The xlsx is a generated export, never edited by hand.
7. **Controlled vocabularies only** (section 5). If nothing fits, use the closest value and say so in `notes`; propose a vocabulary change in the run log rather than inventing a value.
8. **Report counts from the files**, not from memory (`wtdb.py status`, or count the CSV rows).
9. **Search in every official language of the area** (local-language terms are in the source playbook). English-only searching misses most of the local layer.

---

## 2. What counts as wealth taxation

A tax on the **stock of wealth** (net assets) of the wealthy, rather than on income, transactions or a single type of property.

**Included** — the `wt_design` values:

| wt_design | Meaning | Examples |
|---|---|---|
| `annual_net_wealth` | Recurring annual tax on net wealth above a threshold | 2% on assets over £10m; Spain's patrimonio; Norway's formuesskatt |
| `one_off_levy` | One-time levy on net wealth | California's one-time 5% billionaire tax ballot measure; post-crisis wealth levies |
| `billionaire_minimum` | Minimum tax set as a % of wealth for the ultra-rich | Zucman's 2% minimum tax on billionaires; the G20 2024 billionaire-tax discussion; France's "taxe Zucman" |
| `unrealised_gains` | Annual taxation of unrealised gains for the very wealthy (mark-to-market) | US billionaire minimum income tax on unrealised gains |
| `exit_tax` | Tax on wealth or unrealised gains when the wealthy emigrate | Exit-tax proposals tied to a wealth tax |
| `partial_wealth` | Recurring tax on net holdings of a broad asset class (e.g. financial assets), not a single property | — |
| `defend_existing` | Opposing abolition, or supporting keeping or raising an existing wealth tax | Defending a national wealth tax against repeal |
| `wealth_tax_unspecified` | Calls for "a wealth tax" without saying which design | "We need a wealth tax" |

**Excluded** (never qualifies on its own): mansion or high-value property taxes; council tax or property tax reform; land value tax; capital gains tax changes on realisation; inheritance, estate or gift taxes; income or dividend tax rises; windfall taxes; corporate taxes; financial transaction taxes; closing loopholes or tax-avoidance measures; generic "tax the rich" or "fair share" with no reference to the stock of wealth.

**Ambiguous phrases.** "Tax wealth like work" or "tax wealth not work" often means aligning capital gains with income tax (common UK usage). Treat it as grade C at most, and only when nothing in the speaker's own platform shows they mean capital gains. If it clearly means capital gains or dividends, it does not qualify. Watch local terms that also cover excluded taxes (e.g. Italian *patrimoniale* can mean property taxes; Dutch *vermogensbelasting* often refers to the savings box) and read the context.

**Not enough on their own:** "tax the wealthy", "tax billionaires more", "make the rich pay their fair share", and support for bills that change income or capital-gains tax (a millionaires' surtax, a minimum income tax on realised income). Count them only when the person's own words or the named bill refer to wealth, net worth or unrealised gains, as in the table above. Record the near-misses in `exclusions.csv` (`out_of_definition` or `insufficient_evidence`) so nobody re-checks them.

**Wealth caps.** A cap on individual wealth (the limitarian position, for example The Wealth Cap Project) counts as a 100% levy above a threshold. Record it under the closest design (usually `wealth_tax_unspecified`) and say "wealth cap" in `design_detail`.

Someone who supports both an included design and an excluded one qualifies on the included evidence; record only that evidence.

---

## 3. Evidence grades

| Grade | Label | Rule |
|---|---|---|
| **A** | Explicit | Endorses an included design **with specifics** (rate, threshold, named bill or proposal), **or** a formal act: voted for, sponsored or co-sponsored, signed a motion or letter that calls for an included design, organisational policy adoption, authored a publication recommending one, gave supportive testimony. |
| **B** | Named | Supports "a wealth tax", "wealth levy", "billionaire tax" or an equivalent local term by name, without specifics. |
| **C** | Implied | Language that probably means wealth taxation but is ambiguous ("make the super-rich pay on their wealth"). Included and flagged as *appears to support*; a target for upgrade. C still needs words about wealth: "those with most should contribute more" is not C, it is an exclusion (section 2). Neither is a name on an event programme or a speaking slot without the words spoken. |

**Roster and endorsement lists.** When a campaign's own page lists someone as an endorser, that is a claim by the campaign, not a statement by the endorser. Grade it **B** and say so in `grading_note`; upgrade to A when you find the endorser's own statement, vote or signature. Sponsors and cosponsors in official bill data are a formal act (A).

An actor's grade is the best grade among its support evidence. Grade each piece of evidence on its own, and write one line in `grading_note` explaining why.

---

## 4. Who counts — actor types and inclusion rules

`kind` is `person`, `organisation` or `institution` (a public body: a council, parliament, government or commission).

| actor_type | kind | Include when… |
|---|---|---|
| `politician` | person | Elected official or candidate at any level (supranational to local), or a minister, with qualifying evidence: vote, sponsorship, signed motion, speech or statement. Record level and geography. |
| `party` | organisation | Party, party branch, council group or youth wing; evidence from a manifesto, policy document or conference motion. |
| `government_body` | institution | A council, parliament, government or commission that **passed** a motion or adopted a position, or a commission that recommended it. A failed motion goes on the proposer, not the body. |
| `academic` | person | Scholar outside economics (law, politics, public health, sociology and so on) who wrote in favour (paper, book, report, op-ed, testimony). Merely researching wealth taxes does not count. |
| `economist` | person | Any economist, whether at a university, central bank, international organisation, bank, think tank or consultancy, arguing in favour. Use this for economists in academia too, so that one filter finds them all. |
| `think_tank` | organisation | Published a recommendation, or campaigns for it. |
| `ngo_campaign` | organisation | NGO, charity, campaign group or coalition campaigning for or endorsing it. |
| `union` | organisation | Union, union confederation or trades council with a policy, motion or campaign. |
| `union_official` | person | Union leader or official speaking for it. |
| `journalist` | person | Writes **opinion** pieces (columns, op-eds, essays, podcasts, video commentary) arguing for it. Reporters writing straight news do not count. |
| `media_outlet` | organisation | An editorial (the outlet's own stated view) argues for it. |
| `legal_tax_professional` | person / organisation | Tax lawyer, accountant, valuer, former tax-authority official or professional body that publishes in favour or gives supportive evidence. |
| `wealthy_individual` | person | A wealthy person who has **publicly** declared support (signed letter, member of a public group such as Patriotic Millionaires, statement). |
| `business_leader` | person / organisation | A business figure or business association publicly in favour. |
| `faith` | person / organisation | Faith leader or faith organisation. |
| `cultural_figure` | person | Artist, writer, athlete or celebrity with a public statement. |
| `campaigner` | person | Individual activist or NGO leader with a public profile (spokesperson, founder, author, charity chief executive). |
| `international_body` | institution / organisation | International or supranational body, or intergovernmental group (UN, IMF, OECD, G20 track, EU institutions, EU Tax Observatory). |
| `funder` | organisation | Foundation that **funds wealth-tax advocacy or research specifically**; evidence is a grant record or a programme page. |

International actors (Zucman, Oxfam International) are included in a country database only when they acted **in or towards that area** (testimony to its parliament, a campaign there). Give them their Wikidata ID so databases can be merged later.

---

## 5. Data files

In this repository, `<area-slug>` is the lowercase ISO 3166-1 alpha-2 code (`gb`, `de`) or `<iso2>-<region>` (`us-ca`). Each folder also needs a `meta.json` (`name`, `iso2`, `lead`, `status`, `boundaries`, `notes`; `init` creates it). Put the scope you chose (levels covered, anything left out) in `notes` and in section 1 of `area_profile.md`. Everything lives in `data/<area-slug>/` (e.g. `data/gb/`, `data/us-california/`, `data/eu/`). Create it with `python skill/scripts/wtdb.py init data/<slug> --area "<Area name>"`, or by hand with exactly these headers. IDs are prefix + zero-padded number (A0001, E00001, G0001, L0001, H0001, X0001, R001).

**actors.csv** — one row per actor
`actor_id, name, kind, actor_type, other_types, role, affiliation, party, affiliation_actor_id, country, level, location, geo_unit_id, location_source, wikidata_qid, website, status, alive_checked, prominence, notes, added_run, updated, refined`
- `other_types`: extra `actor_type` values separated by `;`, for people who fit more than one (for example `journalist` primary with `economist` here). `actor_type` is the main role; the site and the coverage grid count a person under every type they hold.
- `party`: for politicians, the party's common name in English (for example `Labour`, `Green Party`, `Democratic Party`; `Independent` if none). Use one name per party so the site can filter on it; a regional or state branch uses the national party's name (the Minnesota DFL is `Democratic Party`). Blank for non-politicians, and for local officials in non-partisan offices when the party is not known. `validate` warns about a missing party above local level.
- `level`: supranational · national · regional · local (the level of government or society they act at)
- `location`: where they are based or whom they represent, written as a path from the country down, separated by ` > `: `United States > California > Camarillo`, `United Kingdom > London > Hackney`, `United Kingdom > Yorkshire and The Humber > Leeds East`. The first part is the country root unit in `geo_units.csv`. Each next part that matches a register unit under the previous one is resolved to that unit; anything after that is plain place text (a city, district or constituency the register does not list yet). Give the finest place you can prove. If you only know the state, stop at the state; if you only know the country (a national union, a nationwide campaign), write just the country. Never guess a finer place. A national-level actor sits at the country; a legislator sits at the place they represent (the district, constituency, state or region), not at the institution (that goes in `role`). The site counts an actor for every unit on the path, so a city actor counts for their state and the country.
- `geo_unit_id`: the register unit the actor is placed in, the deepest unit `location` resolves to. It is the stable key (names change: Araba became Álava, and Connecticut's counties became planning regions). `wtdb.py add` fills it from `location`; `wtdb.py locate` fills any that are empty and, after a unit is renamed or moved, rewrites the unit part of `location` from the register and keeps the place text after it. `validate` fails when the two disagree.
- `location_source`: the page that shows the place, when it is not obvious from the evidence (a news profile saying where they are from, their organisation's address, a university page). A legislator's seat needs none. Never a home address.
- `refined`: the date of the last refinement pass on this actor (the `refine` skill), so the next pass can skip them.
- `status`: active · former_role · dissolved
- `alive_checked`: y · na (organisations and institutions). `y` means you looked for a death record and found none.
- `notes`: only what a reader needs: an identity caveat (a common name, a role taken from a list), where the party or role came from, or context the evidence rows do not show. **Never** write that the person is alive, that Wikidata has no match, or that no death record was found; `alive_checked` already says it, and the site shows the notes to readers. Leave `notes` empty when there is nothing to add.
- `prominence`: international · national · regional · local (how widely they are known on this issue)

**evidence.csv** — one row per piece of evidence (an actor can have many)
`evidence_id, actor_id, date, stance, grade, evidence_type, wt_design, design_detail, quote_original, quote_lang, quote_en, source_url, source_title, publisher, archive_url, accessed, harvest_id, grading_note, run_id`
- `date`: YYYY-MM-DD (or YYYY-MM / YYYY if that is all that is known); the date of the act or statement, not of a later article about it
- `stance`: support · retracted
- `grade`: A · B · C
- `evidence_type`: vote · bill_sponsorship · motion · motion_signature · open_letter · publication · report · op_ed · editorial · speech · statement · interview · social_post · manifesto · policy_adoption · campaign · coalition_membership · testimony · funding · other
- `wt_design`: values in section 2
- `design_detail`: rate, threshold, bill name or number (e.g. "2% over £10m")
- `quote_original`: verbatim from the source page; `quote_lang`: ISO code; `quote_en`: translation if not English
- `archive_url`: a Wayback Machine copy of the source (`skill/scripts/archive_sources.py` fills it), so the quote stays checkable when the page moves or goes behind a paywall

**geo_units.csv** — the tree of places you report on, and the checklist for regional and local sweeps (6.5, 6.7)
`geo_unit_id, name, level, unit_type, parent_id, website, sweep_status, swept_run, swept_date, queries_run, hits, notes, code`
- The register is a **tree**. The top row is the **country root** (`unit_type=country`, `level=national`, no parent), named as the first part of every `location`. Regions, states and nations are its children (`parent_id`), and councils, counties or cities sit below those. Institutions such as the legislature or the executive are also children of the root, but actors are not placed on them (see `location`).
- Unit names must be unique among siblings. Write the plain name (`California`), not `California (state legislature)`; put descriptions in `unit_type` and `notes`. Where a city and a district share a name, use the usual local form to tell them apart (`München` and `Landkreis München`).
- `code`: the official code of the unit (ONS GSS code, US county FIPS, German AGS, Swedish kommunkod). Give every local unit one: map shapes are matched by code, because names repeat (thirty US counties are called Washington County).
- `level`: supranational · national · devolved · region · county · combined_authority · council · sub_council. In a federal country, states are `region`. Load the register down to the local tier (6.7) even where you do not sweep it; a unit with children is a parent, and `status` counts the lowest units.
- `sweep_status`: pending · in_progress · done · skipped

**Polls** (optional, `meta.json` `polls`): published opinion polls on a wealth tax in the country, so a visitor can see that the register is the visible tip of wider support. One object per poll: `support` (percent), optional `support_text` ("About 8 in 10") and `oppose` (kept in the data, not shown on the site), `scope` (who was asked), `question` (the design asked about, in English), optional `question_original`, `pollster`, `commissioned_by`, `fieldwork`, `sample`, `published` (YYYY-MM-DD or YYYY-MM) and an https `url`. Use the pollster's own release or tables where they exist. Include polls that show low support as well as high, and put the most recent poll on a tax on the very rich first: the site shows the first one in the country header.

**boundaries.json** (in the country folder, named in `meta.json`) draws the local map on the site: `{"viewBox": [x, y, w, h], "source", "licence", "licence_url", "code_scheme", "units": [{"name", "code", "path"}], "regions": [{"name", "code", "path"}]}`.

**Map licence rule (hard):** the shapes must come from a source that states an open licence (public domain, CC0, CC BY, ODbL, or an open government licence such as OGL or dl-de/by), and the unit codes must be the official ones. In order of preference, look for:
1. the national statistics office or mapping agency, which also publishes the codes;
2. a well-known open republication of those official shapes (us-atlas for the US Census; DataMeet for the Survey of India);
3. OCHA's Common Operational Datasets on HDX (`data.humdata.org/dataset/cod-ab-<iso3>`): the national agency's boundaries, usually under CC BY-IGO, with P-codes built from the official codes (Brazil's `BR1100015` is IBGE `1100015`; `topo_to_boundaries.py --strip-prefix BR`). The HDX API (`/api/3/action/package_show?id=cod-ab-<iso3>`) states the licence.
4. geoBoundaries gbOpen, after checking the licence of that country's entry (`geoboundaries.org/api/current/gbOpen/<ISO3>/ADM2/` gives `boundaryLicense`).

When the national agency states no licence on its own site, look at 3 and 4 before giving up: they often republish the same official shapes under an open licence.

A personal GitHub repository or blog with no licence file, a "free to use" note, a non-commercial licence (GADM is CC BY-NC, so not usable), or any shapes whose origin you cannot name are **not** used, however convenient. Never invent codes, not even "state code plus a running number". If no open source with official codes turns up, ship the country without a map: the site works without one, and say so in `meta.json` notes. Write `licence`, `licence_url` (https) and `code_scheme` into the file. `topo_to_boundaries.py` requires them, `wtdb.py validate` fails without them and warns about licences it does not know, and the PR description must name the licence. (India's first map broke this rule and had to be replaced.) `units` are the local tier (6.7) and are matched to `geo_units.csv` by `code` when the register has codes, otherwise by name. `regions` are the outlines of the level above (English regions and UK nations, län, Länder, states, départements, provinces), drawn as lines over the map; every country has them. Where there are two levels above the units, put the higher one in `regions_upper` (régions over départements, communities over provinces), drawn bolder; `scripts/merge_boundaries.py` combines the files. Take units and regions from the same agency and coordinate system so the lines fall on the unit borders (deriving region borders from simplified units does not work: neighbours rarely share vertices). Make both with `scripts/topo_to_boundaries.py` from a TopoJSON, GeoJSON or shapefile (`--simplify` keeps the file small, `--where` drops water areas, `--encoding` reads Latin-1 shapefiles). `source` names where the shapes come from and their licence; the site prints it on the country's Method page as the credit most licences require. `wtdb.py validate` warns about shapes that match no unit.

**links.csv** — relationships, used for snowballing
`link_id, from_actor_id, to_actor_id, link_type, evidence_id, source_url, note`
- `link_type`: member_of · works_for · leads · co_author · co_signatory · funds · founded · coalition_partner · party_of

**profiles.csv** — official or professional links for an actor, one row per link
`profile_id, actor_id, platform, url, source, checked`
- `platform`: website · official_page · x · bluesky · mastodon · instagram · facebook · youtube · tiktok · linkedin · substack · wikipedia
- Only pages the person or their organisation publishes (their own site, party or parliament page, professional social accounts), or that Wikidata or a parliament lists for them. No personal accounts, email addresses or phone numbers, and nothing guessed from a name search. `url` must be https. `source` says where the link came from and `checked` is the date you read that source. Skip private individuals and people who are only known as wealthy signers.

**harvest.csv** — bulk lists to process (see 6.4)
`harvest_id, title, list_type, url, date, est_size, status, actors_added, notes`
- `list_type`: roll_call · cosponsors · motion_signatories · open_letter · coalition_members · report_authors · commission_evidence · conference_motion · other
- `status`: queued · in_progress · done · failed

**exclusions.csv** — candidates checked and rejected, so they are not checked again
`exclusion_id, name, reason, detail, source_url, run_id`
- `reason`: out_of_definition · pre_2010_only · deceased · private_individual · opposes · insufficient_evidence · duplicate

**runs.csv** — one row per run
`run_id, date, assistant, focus, targets, queries_run, sources_opened, candidates_seen, new_actors, new_evidence, grade_upgrades, saturation, notes_next`

**area_profile.md** — the area profile (section 6.2).

Helper commands (when Python is available):
```
python skill/scripts/wtdb.py add data/gb actors '{"name":"…","kind":"person",…}'   # assigns ID; prints it
python skill/scripts/wtdb.py add data/gb evidence @new_evidence.jsonl               # one JSON object per line
python skill/scripts/wtdb.py set data/gb geo_units G0042 sweep_status=done hits=2 queries_run=6
python skill/scripts/wtdb.py validate data/gb     # errors must be fixed before a run ends
python skill/scripts/wtdb.py locate data/gb       # fill geo_unit_id; repair locations after a unit is renamed
python skill/scripts/match_wikidata.py data/gb  # fill wikidata_qid where the match is unambiguous; spot-check it
python skill/scripts/wtdb.py dedupe data/gb       # likely duplicate actors
python skill/scripts/wtdb.py merge data/gb A0012 A0345   # merge a duplicate (second) into the first: moves evidence, links, profiles
python skill/scripts/wtdb.py checkquotes data/gb --run R004   # fetch sources and check the quotes are on the pages
python skill/scripts/profiles_wikidata.py data/gb  # websites, socials and Wikipedia from Wikidata IDs
python skill/scripts/topo_to_boundaries.py counties-albers-10m.json --object counties --code-prop id --scale 4 --simplify 0.8 --out data/us/boundaries.json
python skill/scripts/wtdb.py status data/gb       # counts, coverage grid, sweep progress, suggested next targets
python skill/scripts/wtdb.py export data/gb       # writes data/gb/<slug>_wealth_tax_supporters.xlsx
```
Writing CSVs directly is fine too, but quote fields properly (quotes often contain commas), and run `validate` afterwards.

---

## 6. Workflow

### 6.1 Start (brief)
1. Read this file, the area's folder if it exists (`area_profile.md`, the last three `runs.csv` rows, `wtdb.py status`), and the notes for the nearest country in `skill/references/countries/`. For a new country, also list the suggestions people have already sent for it from the site (`python scripts/suggestions.py`): the form accepts any country, so they wait there until a register starts, and they go into the first pass's leads.
2. Settle three things with the user, in **one short message**, each with a recommended default: **which area**, **scope** (national only; plus regional; plus local) and **depth** (see the ladder below). If the user has already told you, do not ask again. If they do not answer, use the defaults and say so.
3. In this repository, work on a branch and open one pull request per run. Never push to `main`.
4. `wtdb.py init data/<iso2> --area "<Name>"`, then **load the geography register down to the local tier and build the map** (6.7): an official list with codes and one open-licence shape file, usually under an hour. It is part of every seed pass, not a later run, and `validate` fails while the register stops at regions. Then go straight to 6.2. State your plan in a few lines and begin; do not wait for approval of the plan.

**Depth ladder** (pick one, and say which in `meta.json` `notes`):

| Depth | What it delivers | Local and regional |
|---|---|---|
| **Seed** (default for a new country) | The prominent supporters in every layer at the national level, with a plan for the next runs | Regional legislatures and the largest cities, sampled |
| **Standard** | Seed, plus every harvest list and layer pass until new finds dry up | Regional bodies in full; local bodies where the sample showed they matter |
| **Exhaustive** | Standard, plus every local unit | Every unit in scope, as in the UK run |

### 6.2 Orient (an hour, not a day)
Fill in `area_profile.md` from `references/area-profile-template.md`, briefly: the history of wealth taxes in the area since 2010; live bills, ballot measures and campaigns; which parties, unions, NGOs and economists have taken positions; which languages and search terms to use; where the legislature publishes votes, bills and motions; whether local bodies pass motions and publish records you can search; which sources block you. Every factual line gets a source. Mark anything from a search summary only as `[verify]`.

This step decides the plan. Spend your effort where the evidence says support lives.

### 6.3 The first pass
Touch **every layer once, highest yield first**, before going deep in any one. A typical order (adapt it):
1. **Legislature:** sponsors and cosponsors of wealth-tax bills, roll-call votes, motions, amendments, committee evidence.
2. **Parties:** programmes and manifestos since 2010, congress motions, party youth wings.
3. **Coalitions, NGOs, unions, think tanks:** campaign coalitions and their member lists, union congress motions, tax-justice groups, think-tank reports.
4. **Economists and academics:** open letters, commission and report authors, op-eds.
5. **Commentators and media:** opinion columns, editorials, podcasters and video commentators with a public profile.
6. **Wealthy individuals, business, faith, culture, funders:** public declarations and letters.
7. **Regional and local:** regional parliaments and governments, then a sample of local units (6.5).

For bulk lists (letters, rosters, coalition pages, bill cosponsor data) queue them in `harvest.csv` and process them whole; they produce many actors with uniform evidence (6.4). Use search in the area's languages (the playbook has terms). Check the definition against what each list or person actually calls for.

**End the first pass when every layer has been touched and the biggest lists are in.** Then validate, run the quote check, open the pull request, and write the run plan (6.6). The first pass should take hours. If you find yourself building a crawler or sweeping hundreds of units one by one, stop and check the plan against the goal.

### 6.4 Bulk harvest
Lists produce many actors at once with uniform, strong evidence. Queue each in `harvest.csv`, then process it entry by entry:
- roll-call votes on wealth-tax bills or amendments, and bill co-sponsors
- signatories of parliamentary or council motions
- open letters with published signatory lists (economists, millionaires, faith leaders, organisations)
- coalition and campaign member lists
- authors of wealth-tax reports and commissions; witnesses and written evidence
- union and party conference motions (mover, seconder, supporting bodies)

Rosters can be large (a ballot campaign's endorsement page listed about 250 names). Parse the page's structured data instead of retyping names, check each name against the database (name variants such as "Coalition for Human Needs" and "Coalition on Human Needs" are the same body: `merge`), and keep the list's own entry text as the quote. For a roll call, that is the member's own line: the `source_url` is the official per-member list (an open-data API endpoint is fine, such as the Câmara's `/votacoes/<id>/votos`) and `quote_original` is the name exactly as that list prints it, with the vote, party and seat in `grading_note`. Never quote the result line ("Yes: 136; No: 262") for every member: it is the same on every row and proves nobody's vote. Wikipedia and other secondary lists are good for finding names, never as the source; re-read each name at its own cited page.

For each person or organisation on a list: check for duplicates, check the definition applies to what the list actually calls for, check they are not dead (or, for an organisation, that it still exists), then add the actor and an evidence row whose `harvest_id` points to the list. Mark the list `done` with `actors_added`.

### 6.5 Regional and local: proportional, sampled, honest
Local support is real in some countries (UK councils pass motions) and nearly absent or unsearchable in others. Decide from evidence, not from a checklist.

1. **Load the geography register to the depth you intend to use** (6.7), not deeper.
2. **Sample first.** Pick 5 to 10 units: the largest cities, and units run by the parties most likely to support a wealth tax. Search each (site-restricted web search, the unit's own records search, local news, party and union branches). Count the supporters found and the time spent.
3. **Decide from the sample.** If most sampled units yield something, continue region by region. If few do, stop sweeping units one by one and look for the aggregators instead: a party's list of its councillors who signed a letter, a union branch network, a campaign's local groups, a national motion template that councils copied.
4. **Be honest in the register.** `sweep_status=done` means the unit was actually read. Units you chose not to search are `skipped` with a reason in `notes`. A unit you only sampled stays `in_progress`. Never mark a unit done to make progress look complete.
5. **Prefer search to scraping.** A site-restricted web search ("site:example.se förmögenhetsskatt motion") over a municipality's own pages is usually enough. Build a crawler only when **all** of these hold: a sample shows the documents really contain hits; many units (about 30 or more) share one platform; and you have told the user what it will cost. Keep it in `skill/scripts/adapters/<iso2>_*.py` with a docstring, treat its hits as **leads** (confirm each in the source), and never let it replace the first pass.
6. Failed motions still identify the proposer and seconder as supporters. Councils that **passed** a motion are `government_body` actors.

### 6.6 Plan the next runs
At the end of the first pass, write the plan into the last `runs.csv` row (`notes_next`) and the area profile (section 10): the layers and lists still to do, ordered by **expected yield per hour**, with what you expect from each and what is blocked. Include the regional and local decision from 6.5 and, if it is "continue", the order of regions. The user reads this to choose what to run next.

### 6.7 Geography register
A tree of the places you will report on, in `geo_units.csv`, with a country root and `parent_id` set (section 5).

**Every country uses the same depth: the register and the map go down to the lowest tier of general-purpose local government, with the regions or states above it as parents.** That keeps countries comparable and lets a visitor find supporters near them. Today:

| Country | Regions (parents) | Local tier (map units) |
|---|---|---|
| United Kingdom | nations and English regions, counties | 361 local authority districts (GSS codes) |
| Sweden | 21 län | 290 kommuner (kommunkod) |
| Germany | 16 Länder, 401 Kreise and kreisfreie Städte | 10,939 Gemeinden and unincorporated areas (AGS, BKG VG250) |
| India | 36 states and union territories (ISO 3166-2:IN) | 734 districts (LGD codes; Survey of India shapes) |
| United States | 50 states and DC | 3,143 counties and equivalents (FIPS) |
| Brazil | 26 states and the Federal District (IBGE codes) | 5,571 municípios (IBGE codes) |
| France | 13 regions (ISO 3166-2:FR), 101 départements | 34,920 communes (INSEE, COG 2025) |
| Netherlands | 12 provinces (CBS PV codes) | 342 gemeenten (CBS GM codes, PDOK Gebiedsindelingen 2026, CC BY 4.0) |
| Spain | 17 autonomous communities and 2 autonomous cities (ISO 3166-2:ES), 52 provinces (INE) | 8,132 municipios (INE) |

For a new country, pick the tier that elects a council and runs local services (municipalities, districts or counties), not wards or parishes. Take that tier even when it runs to tens of thousands of units (France's 35,000 communes): an official list loads in minutes, a generalised shape file (a few MB) draws fine, and the site needs no change. Supporters still sit at whatever level the evidence shows (a deputy in the département, a mayor in the commune); areas below a level with supporters get a faint tint graded by how many are known there. Give the regions a different code system from the units when the official ones overlap (INE numbers both Spanish provinces and communities from 01): use ISO 3166-2 for the regions, since `validate` rejects duplicate codes. Fetch the **official current list** with codes (a statistics office, mapping agency or interior ministry), not memory, and build `boundaries.json` from the same agency's shapes where possible, so codes match. **Check the licence before you download anything** (map licence rule, section 5): an unlicensed map has to be thrown away later, and so does the work built on it.

Loading the local tier is not a promise to sweep it: sweeping stays proportionate to what the sample finds (6.5), and unswept units stay `pending`. Place each actor at the finest unit the source shows (a mayor in the city's unit, a state legislator in the state). Finer places you meet are not lost: put them in `location` as place text after the last unit (`United States > California > Ventura County > Camarillo`). On the map, areas with their own supporters are shaded, and areas whose region only has supporters at region level get a light tint. Seats are places, not institutions: an MP belongs to the constituency, a US representative to the district. Roll calls rarely print the constituency, so look it up in bulk: Wikidata records it as the qualifier *electoral district* (P768) on the member's *position held* (P39) statement, one SPARQL query for the whole list. `validate` warns about legislators left at the country root. For a map, also build `boundaries.json` (see `scripts/topo_to_boundaries.py`).

### 6.8 Later runs
Improving the supporters already found (links, finer places, more statements, a check that support is still current) is a separate workflow: `refine/SKILL.md`.

Each run reads the folder (`status`, `notes_next`), picks the top of the plan, works it, and writes a new plan. A good run is one harvest list, or one region, plus one layer pass. Priority order when the plan is silent:
1. suggestions sent from the site for this country (`python scripts/suggestions.py export new.csv`; check each against its source, then `mark` it added, duplicate or rejected)
2. queued harvest lists
3. thin cells in the coverage grid (actor type × level)
4. upgrades of C- and B-graded actors (look for a vote, a signed letter, a specified design; leave the old evidence in place)
5. snowballing: follow co-authors, co-signatories, coalition members, their organisation and party outwards
6. regional and local units, as decided in 6.5
7. retractions: for prominent supporters, check whether they have since retracted

**Stopping.** A layer is saturated when about nine in ten of the candidates you find are already in the database (or excluded) for two passes in a row. The database is "complete for now" when the plan is empty or the remaining items are low yield; after that, runs are update sweeps (new evidence since the last run). Completeness is never a precondition for publishing: a partial database with honest coverage notes is the normal state.

### 6.9 QA, and the pull request (end of every run)
1. `validate` → fix every error. Warnings: fix or justify in `notes`.
2. `dedupe` → merge true duplicates with `merge`.
3. **Quote check:** `checkquotes --run <this run>`. Fix or remove every row it reports as not found. Rows it skips (PDFs, blocked pages) need a manual look: open the page, find the quote. The checker reads the page's declared charset (so Chinese and Japanese pages work), falls back to `pypdf` when `pdftotext` is missing, and counts CJK quotes by characters. A quote too short to compare (a single-word roster name) is listed as "too short to check" rather than as missing. Then spot-check at least 10% of the run's rows (minimum 5) by hand for grade and meaning, not just wording. There is no separate verification mark: a row is in the database because its quote was found on its source, and readers report mistakes from the site.
4. `profiles_wikidata.py` for new actors with Wikidata IDs. Check that `boundaries.json` exists (6.7); `validate` warns when it does not.
5. Append the run row to `runs.csv`, including `saturation` and `notes_next` (the plan).
6. Open or update the pull request and report to the user: new actors and evidence by type and level, what was left out and why, the plan for the next runs, and numbers from `status`, not from memory.

### 6.10 Parallel work (if the assistant can run subagents)
Split by layer or by region, never so that two workers write the same file. Each worker writes `staging_<worker>.jsonl` files (actors and evidence with temporary IDs) and returns them; the coordinator deduplicates against the database, adds with `wtdb.py add`, runs `validate`, and has a separate worker do the spot-check. Do not use parallel workers to do a large sweep that the sampling step (6.5) has not justified.

### 6.11 Without code
Follow the same steps by hand: keep the CSVs in exactly the format above, check the `validate` rules yourself (required fields, allowed values, dates from 2010, a URL and a quote on every evidence row, no actor without evidence, no duplicates), and deliver the CSVs or a spreadsheet built from them.

---

## 7. Export

The xlsx export contains: **Overview** (counts, grade mix, coverage and sweep progress, definitions); **Supporters** (one row per actor: grade, *explicit / named / appears to support*, designs, evidence count, first and latest evidence date, strongest source); **Evidence**; **Local coverage** (each geography unit with sweep status and supporter count); **Links**; **Profiles** (websites and socials); **Harvest lists**; **Run log**; **Former supporters** (latest stance retracted, shown only when there are some). There is no points score. Users filter by grade, type, level, prominence and date.

---

## 8. Things that went wrong before (avoid them)

- Actions typed outside the vocabulary, so the methodology no longer described the data → always use the controlled values; `validate` enforces them.
- Mansion-tax and council-tax supporters counted as wealth-tax supporters → apply section 2 to every piece of evidence.
- Opponents mixed into the supporter list → supporters only.
- Related tables existed only in the assistant's memory and never reached the file; earlier turns "compressed" in the log → write to disk continuously; log every run.
- Theme-by-theme, name-by-name searching gave few new actors per turn → bulk lists first, then the geography sweep, then snowballing.
- Reporters counted as supporters because they quoted one → journalists need opinion pieces.
- Notes full of "alive on the basis of..." and "no Wikidata match" on hundreds of rows, shown to readers on the site → `alive_checked=y` records the check; `validate` now warns when notes narrate it.
- Paraphrased "quotes": a roster import wrote its own sentence ("Campaign lists X as an endorser…") into 252 rows, because the fetch tool summarises pages → quote the page's own text, and run `checkquotes`.
- One bucket hid a group: all university economists were typed `academic`, so the Economist filter showed four people → type by discipline (`economist` for any economist) and use `other_types` for people who fit two.
- Near-duplicate organisations from different letters and rosters ("Coalition for Human Needs" and "Coalition on Human Needs") → `dedupe` after every large import, then `merge`.
- Party names written several ways ("Labour Party", "Labour", "Welsh Labour"; "Democratic-Farmer-Labor") → one common name per party, branches use the national name.
- Pages that said "tax the wealthy" but not wealth tax were nearly counted → apply section 2 to the speaker's own words.
- Progress reports that ignored higher-level units ("no geography units loaded") → `status` counts the lowest units of whatever depth you loaded.
- Pushing straight to `main` → branch and pull request.
- A run began by writing a crawler for 290 municipalities' protocols before the national legislature, parties and major organisations had been searched, because "every unit, no exceptions" was read as an order → touch every layer once first, sample local units, and build tooling only when a sample shows it pays (6.5).
- Several scoping questions asked one after another before any research → one short message with recommended defaults, then start.
- Brazil's seed pass shipped without a map because IBGE's own pages state no licence, though OCHA republishes the same IBGE shapes with IBGE codes under CC BY-IGO → check HDX and geoBoundaries before giving up on a map (section 5). The same run quoted the roll call's result line on all 136 vote rows, so no row proved its member's vote → quote the member's own entry on the per-member list (6.4).
- Countries were mapped at different depths (US and German maps stopped at states and Länder while the UK and Sweden went down to councils), so maps could not be compared and most local supporters had nowhere to go → load the local tier everywhere (6.7), whether or not you sweep it.
- Maps were built from whatever shapes were easiest to find: Sweden from a GitHub repository whose licence was "to be confirmed", India from a personal compilation with no licence and district codes invented for the project. Both had to be rebuilt → follow the map licence rule (section 5): an open licence and official codes, or no map.
- The UK's exhaustive council sweep was treated as the template for every country. It fits where councils pass motions and publish searchable minutes. Elsewhere, regional or local work should be proportionate to what the sample finds.
- Progress measured by units marked done rather than by supporters found and checked → report supporters, grades and checked rows.
- Spain's seed pass stopped the register at the autonomous communities and shipped without a map, and left all 58 deputies of a roll call at "Spain", because 6.3 warned against "loading hundreds of units" and the map step came last → the register and map are now step 4 of 6.1, `validate` fails without a local tier and warns about a missing map and about legislators at the root.
- A journalist went in at grade C for "those with most should contribute more", and a minister for opening a conference on wealth caps → grade C still needs words about wealth; vague fairness language and event programmes are exclusions or nothing.
