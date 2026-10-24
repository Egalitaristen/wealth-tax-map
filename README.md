# Wealth Tax Supporters

An open, sourced database of who publicly backs an actual wealth tax, built country by country. Each country is a folder of CSV files; The site built from them is deployed to Cloudflare at [wealthtaxsupporters.com](https://wealthtaxsupporters.com).

> **The data is AI-generated and may be wrong.** Every entry links to a source, and many rows have not yet been checked by a person. If you spot a mistake or want an entry removed, use the **Report** link on the site, or [open an issue](../../issues/new?template=data-report.yml).

## Why this exists

The aim is to make it easy for people who share the view that wealth should be taxed to find each other, wherever they are. The place to start is the public record: the politicians, parties, organisations, economists and commentators who have said so, each with a source. A community layer for ordinary supporters is planned, but not built. See [docs/community.md](docs/community.md).

## What is here

| Path | What it holds |
|---|---|
| `data/<iso2>/` | One database per country or region, for example `data/gb/`. Plain CSV files plus a `meta.json`. |
| `skill/` | The research workflow (`SKILL.md`), source playbook, country examples and helper scripts (`wtdb.py`, `profiles_wikidata.py`, `topo_to_boundaries.py`). Works for people and for AI assistants. |
| `refine/` | The refinement workflow (`SKILL.md`) for supporters already in a register: links, finer places, more statements, and a check that support is still current. Uses the scripts in `skill/scripts/` (`refine_queue.py`, `archive_sources.py`). |
| `site/` | The static front end: one page and one script, no framework. Home with search and a dot world map, country pages (area map, directory, timeline, method), a page per supporter, method and contribute pages. |
| `scripts/build_site.py` | Turns `data/` into the site data, a search index and CSV downloads. Standard library plus `pycountry`. |
| `scripts/share_cards.py`, `scripts/fonts/` | Link-preview images for every page (home, each country page, each supporter), drawn with Pillow. The build also writes a small HTML file per page with its own title, description and image, so previews on Discord and social media match the page. |
| `scripts/serve.py` | Serves the built site locally the way Cloudflare does (unknown paths fall back to `index.html`). |
| `scripts/deploy.py`, `wrangler.jsonc` | Build and deploy the site to Cloudflare from a local checkout. |
| `docs/`, `infra/` | The community plan, and the Cloudflare setup and draft database schema. Nothing deployed yet. |

Nine countries so far, all work in progress: the United Kingdom (`data/gb/`, with a council-level map), the United States (`data/us/`, federal and state level, with a county map), Sweden (`data/se/`, national first pass done; regional and local sweep planned, with a municipality map), Germany (`data/de/`, a seed pass: Bundestag sponsors since 2010, party programmes, the alliance "Vermögen besteuern jetzt", unions, economists and commentators, with a map of the 10,939 Gemeinden), France (`data/fr/`, a seed pass: Assemblée and Sénat roll calls on the "taxe Zucman" and earlier ISF bills, the Le Monde appeal, Nobel economists, NGOs, unions and left parties, with a commune map), Spain (`data/es/`, a seed pass: the Congreso roll call of 7 June 2022 on the Unidas Podemos wealth-tax bill, the law that created the solidarity tax on large fortunes, Sumar, ministers, two former prime ministers, Oxfam Intermón, Gestha and the big unions, with a municipality map), Brazil (`data/br/`, a seed pass: every wealth-tax bill in the Câmara since 2010 with its named authors, the 30 October 2024 roll call on the PSOL-Rede amendment, the G20 billionaire-tax track under Lula and Haddad and the Oxfam Brasil-led "Tem Um Elefante Na Sala" coalition, with a map of the 5,570 municípios), India (`data/in/`, a seed pass: the 2024 World Inequality Lab proposal, the Left parties, the central trade unions, Oxfam India, the Tax the Top campaign and its petition signers, and a few economists, with a provisional district map) and Norway (`data/no/`, a seed pass: 145 supporters among the political parties, trade unions, think tanks, economists, commentators and campaigners who defend the formuesskatt in their own words, with a map of the 357 kommuner). Every country is registered and mapped down to its lowest tier of local government (councils, municipalities, communes, Gemeinden, kommuner or counties), so maps are comparable; see `skill/SKILL.md` 6.7.

## What counts

- **Supporters only.** Opponents and sceptics are not recorded as actors.
- **An actual wealth tax:** a recurring tax on net wealth, a one-off levy, or a minimum tax on billionaires. Income, property and capital gains reforms alone do not count.
- **Dated, linked source** and a short quote for every entry. Grades: **A** explicit (a formal act or a stated design), **B** named, **C** implied.
- **Public figures and organisations only.** Petition signers and other private individuals are never recorded.
- People are assumed alive unless a death record is found; anyone found dead is removed.

## How the research works

The goal is a trustworthy list of who publicly backs an actual wealth tax, with the evidence behind every name, found by going after the most prominent supporters first. A first pass touches every layer once (legislature, parties, coalitions and unions, economists, commentators, wealthy and business, regional) and ends with a plan for later runs ordered by expected yield. Local sweeps are sampled first and expanded only where they pay. Coverage is reported honestly, so a blank means "not searched". The details are in [`skill/SKILL.md`](skill/SKILL.md); read its section 0 first.

## Add your country

1. Fork this repository.
2. Read [CONTRIBUTING.md](CONTRIBUTING.md) and `skill/SKILL.md`.
3. Create `data/<iso2>/`:
   ```bash
   python skill/scripts/wtdb.py init data/de --area "Germany"
   ```
4. Do the research, by hand or with an AI assistant. Tell the assistant the country, the scope (national, plus regional, plus local) and the depth (a first-pass seed is the default). It should start with the biggest supporters, not with tooling. Work on a branch, never on `main`.
5. Check your work:
   ```bash
   python skill/scripts/wtdb.py validate data/de
   python skill/scripts/wtdb.py checkquotes data/de --run R001     # quotes really are on the pages
   python skill/scripts/profiles_wikidata.py data/de               # websites and socials from Wikidata
   ```
6. For a local map, build a boundary file (see `skill/scripts/topo_to_boundaries.py`) and name it in `meta.json`.
7. Open a pull request. Every quote must be found on its source (`wtdb.py checkquotes`); readers report mistakes from the site.

## Build the site locally

```bash
pip install pycountry pillow          # Pillow is optional: without it pages share the default image
python scripts/build_site.py          # writes _site/
python scripts/serve.py               # http://localhost:8000
```

The site uses clean URLs (`/gb` with its map, `/gb/directory`, `/gb/time`, `/gb/method`, a profile at `/gb/A0001`, `/about`), so it needs a host that falls back to `index.html` for unknown paths. The Cloudflare deployment does this (`not_found_handling` in `wrangler.jsonc`), and `scripts/serve.py` does the same locally.

The maintainer deploys from a local checkout with `python scripts/deploy.py` (after a one-time `npx wrangler login`). Merging to `main` does not deploy by itself. Filtered views are shareable: `/gb/directory?place=United Kingdom > Wales&type=economist`.

## Licences

- Code: [MIT](LICENSE).
- Data in `data/`: [CC BY 4.0](DATA_LICENSE.md). Quotes are short extracts from cited sources and stay under their owners' copyright.

## Corrections and removals

Use the Report links on the site, or open a [data report](../../issues/new?template=data-report.yml). Reports are public issues, so do not paste private information into them.
