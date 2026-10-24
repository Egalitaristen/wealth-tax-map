# Poland: no wealth tax, a left-wing and academic case

An eleventh worked example. Poland has no net-wealth tax, only a real-estate tax. The case is made by Razem and the Greens, the Young Left, the OPZZ union confederation, economists and commentators, and a 2020 pandemic-recovery manifesto ("Regeneracja zamiast tarczy"). Polish Left MEPs also voted for wealth-tax amendments in the European Parliament in 2023. Check every URL still works before relying on it.

## Levels and the geography register

| Level (`level`) | Units | Notes |
|---|---|---|
| national | Sejm, Senate, government | |
| region | 16 voivodeships (*województwa*) | |
| county | 379 counties (*powiaty*) and cities with county rights | |
| council | 2,479 gminas | The register's tier, with the seven-digit TERYT/TERC code (the last digit says whether the gmina is urban (1), rural (2) or mixed (3)), so a town and its rural gmina of the same name (Bolesławiec) are separate units. Source: Statistics Poland's TERC file (`eteryt.stat.gov.pl`, "pliki pełne", TERC urzędowy) |

**Map:** `data/pl/boundaries.json` uses GUGiK's Państwowy Rejestr Granic (PRG, version of October 2026): gminas as units, powiats as regions and voivodeships as `regions_upper`. All three layers carry the TERYT/TERC code in `JPT_KOD_JE` (2, 4 and 7 digits), and every code matches `data/pl/geo_units.csv` exactly (16, 380 and 2,479), including the type digit that separates same-named urban and rural gminas. Licence: the PRG is material of the national geodetic and cartographic resource (PZGiK) and "może być wykorzystywany bez ograniczeń" (dataset record on `dane.gov.pl/pl/dataset/726`, whose licence field is empty; the terms are the quoted sentence and the credit line), with the duty to print "Wykorzystano/opracowano na podstawie materiałów państwowego zasobu geodezyjnego i kartograficznego"; the Geoportal says "Dane PRG są dostępne bezpłatnie i do dowolnego wykorzystania", and art. 40a(2)(1)(a) of the Prawo geodezyjne i kartograficzne exempts PRG from fees. Download: `opendata.geoportal.gov.pl/prg/granice/00_jednostki_administracyjne.zip` (shapefiles `A01_Granice_wojewodztw`, `A02_Granice_powiatow`, `A03_Granice_gmin`; UTF-8). Despite the page text the shapefiles are in ETRS89 degrees, not EPSG:2180, so convert with `topo_to_boundaries.py --project lonlat --scale 100 --simplify 0.12 --name-prop JPT_NAZWA_ --code-prop JPT_KOD_JE --code-scheme "TERYT/TERC codes"` for each layer and combine with `merge_boundaries.py --regions counties.json --upper voivodeships.json`. The zip is 377 MB.

## What counts, and what was changed in review

- **Counts:** a named roll-call vote on a wealth-tax amendment, a party programme, a named statement, an open letter's signatories.
- **European Parliament votes** (10 May 2023, Amendment 2 to A9-0155/2023; 12 December 2023, Amendment 2 to A9-0336/2023): each member's FOR is confirmed on howtheyvote.eu, an open dataset of the Parliament's roll calls (`howtheyvote.eu/api/votes/155121` and `/162327`), because the Parliament's own site blocks automated requests.
- **The "Regeneracja zamiast tarczy" signatories (251) are grade C.** The manifesto asks to raise "the currently among the lowest in Europe" taxes on "luxury consumption, highest incomes and wealth"; it names no wealth tax and no design, and signing it endorses the whole document.
