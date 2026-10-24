# Belgium: a federal state, a long-running "millionaires' tax" campaign

A ninth worked example. Belgium has had no net-wealth tax since the 1990s. The case for one comes from the left: the PTB-PVDA has put a "miljonairstaks" bill to the Chamber since 2019 (1% above EUR 1m, later 2% above EUR 5m), the PS and Groen have filed their own bills, Ecolo and Vooruit carry versions in their programmes, and the unions ABVV-FGTB and ACV-CSC back one. Check every URL still works before relying on it.

## Levels and the geography register

| Level (`level`) | Units | Notes |
|---|---|---|
| national | Chamber of Representatives, Senate, federal government | Bills and their cosponsors are in the Chamber's documents (`lachambre.be/FLWB/PDF/<legislature>/<doc>/<doc>001.pdf`). They are bilingual two-column PDFs, so `checkquotes` may report a French or Dutch quote as not found when the extraction interleaves the columns; read the PDF to confirm |
| region | 3 regions (Flanders, Wallonia, Brussels-Capital) | NUTS 1 |
| county | 10 provinces | NUTS 2 |
| council | 581 municipalities | The map tier, with the five-digit NIS/INS code (REFNIS) in `code` |

**Map:** `data/be/boundaries.json` uses Eurostat GISCO's LAU 2024 municipal boundaries and NUTS 2024 provinces, both from the same release so the lines agree. Licence: CC BY 4.0 under Commission Decision 2011/833/EU, credit "© European Union, 1995-today" (the site prints the file's `source` on the Method page). The files are `LAU_RG_01M_2024_4326.json`, `NUTS_RG_01M_2024_4326_LEVL_1.json` and `..._LEVL_2.json` at `gisco-services.ec.europa.eu/distribution/v2/`; keep the units with `CNTR_CODE=BE`, convert with `topo_to_boundaries.py --project lonlat` and combine with `merge_boundaries.py`.

## What counts, and what was removed in review

- **Counts:** a bill's cosponsors (A), a party manifesto or a named statement of the design (A or B), a union's proposal (A).
- **Does not count:** a candidate-list biography ("Député PTB, ex-enseignant, 60 ans"), a party's manifesto sentence attributed to every member, or a slogan such as "Tax the rich!". The first draft had about 40 such rows; they were removed.
