# Poland: no wealth tax, a left-wing and academic case

An eleventh worked example. Poland has no net-wealth tax, only a real-estate tax. The case is made by Razem and the Greens, the Young Left, the OPZZ union confederation, economists and commentators, and a 2020 pandemic-recovery manifesto ("Regeneracja zamiast tarczy"). Polish Left MEPs also voted for wealth-tax amendments in the European Parliament in 2023. Check every URL still works before relying on it.

## Levels and the geography register

| Level (`level`) | Units | Notes |
|---|---|---|
| national | Sejm, Senate, government | |
| region | 16 voivodeships (*województwa*) | |
| county | 379 counties (*powiaty*) and cities with county rights | |
| council | 2,479 gminas | The register's tier, with the seven-digit TERYT/TERC code (the last digit says whether the gmina is urban (1), rural (2) or mixed (3)), so a town and its rural gmina of the same name (Bolesławiec) are separate units. Source: Statistics Poland's TERC file (`eteryt.stat.gov.pl`, "pliki pełne", TERC urzędowy) |

**Map: not built yet.** Eurostat's GISCO municipal file (LAU 2024) has 2,477 Polish gminas but no TERYT codes (its ids look like `PL_1002301600202`), and matching by name is unsafe. The national border register (PRG, GUGiK, `geoportal.gov.pl/dane/panstwowy-rejestr-granic`) carries TERYT codes and is "free for any use", but its formal licence is not stated on the page; read the Geoportal terms before using it. Then convert the administrative units SHP (EPSG:2180, planar metres) with `topo_to_boundaries.py --flip-y --scale 0.002` and `merge_boundaries.py`.

## What counts, and what was changed in review

- **Counts:** a named roll-call vote on a wealth-tax amendment, a party programme, a named statement, an open letter's signatories.
- **European Parliament votes** (10 May 2023, Amendment 2 to A9-0155/2023; 12 December 2023, Amendment 2 to A9-0336/2023): each member's FOR is confirmed on howtheyvote.eu, an open dataset of the Parliament's roll calls (`howtheyvote.eu/api/votes/155121` and `/162327`), because the Parliament's own site blocks automated requests.
- **The "Regeneracja zamiast tarczy" signatories (251) are grade C.** The manifesto asks to raise "the currently among the lowest in Europe" taxes on "luxury consumption, highest incomes and wealth"; it names no wealth tax and no design, and signing it endorses the whole document.
