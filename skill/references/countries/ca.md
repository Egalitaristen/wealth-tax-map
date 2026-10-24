# Canada: a federal state where the wealth-tax case comes from the NDP, unions and civil society

A tenth worked example. Canada has no net-wealth tax. Support comes from the NDP (a 2020 House motion for a 1% tax on wealth above CAD 20 million, convention resolutions from riding associations), the Greens, Québec solidaire, the big unions and the Canadian Labour Congress, civil-society coalitions (Québec's *Manifeste pour un Québec sans pauvreté*, Canadians for Tax Fairness, CCPA) and a group of Patriotic Millionaires Canada signatories. Check every URL still works before relying on it.

## Levels and the geography register

| Level (`level`) | Units | Notes |
|---|---|---|
| national | House of Commons, Senate, federal government | `ourcommons.ca` blocks automated requests (403), so vote pages cannot be read by `checkquotes`; check a vote against the Commons page or Hansard by hand |
| region | 10 provinces and 3 territories | Two-digit PRUID in `code` |
| council | 5,054 census subdivisions (CSDs) | The map tier, with the seven-digit CSDUID. CSDs include municipalities, First Nations reserves and unorganised areas, so not all elect councils |

**Map:** `data/ca/boundaries.json` draws the 2025 Census Subdivision boundary file (CSDUID codes, as the register uses) clipped to the shoreline, with the provinces and territories from the 2021 cartographic boundary file. Licence: Open Government Licence - Canada, credit "Statistics Canada". Statistics Canada's 2025 files are *digital* boundaries, which run out over the water (Hudson Bay, and about 840 km of Arctic Ocean north of Ellesmere Island), so drawn as they are the north is a grey slab of sea. The *cartographic* files (`geo.statcan.gc.ca/geo_wa/rest/services/2021/Cartographic_boundary_files/MapServer`, layer 0 provinces, layer 9 CSDs) stop at the coast but are from 2021, and New Brunswick's 2023 mergers changed its CSD codes (Moncton, Fredericton), so use them only as the coastline. Build: query the 2025 CSDs (`.../2025/lcsd000a25s_e/MapServer/0`) and the 2021 cartographic CSDs as GeoJSON in EPSG:3347 (`outSR=3347`, `maxAllowableOffset=300`, pages of 250 with `orderByFields=CSDUID`; the server answers 500 now and then, so retry); intersect each 2025 CSD with the nearby 2021 CSDs using a spatial index (shapely `STRtree`; one polygon for all of Canada is far too slow), keep only the polygon parts of each result, convert with `topo_to_boundaries.py --project planar --flip-y --scale 0.0005 --simplify 0.35`, convert the 2021 provinces with the same options and combine with `merge_boundaries.py`. 168 specks under 1.5 km² (reserves) vanish at this scale and are not drawn; none holds a supporter.

## What counts, and what was removed in review

- **Counts:** a roll-call vote on the NDP wealth-tax motion, organisations and individuals who signed a letter or manifesto that calls for a wealth tax, riding associations and unions that submitted a convention resolution, and named statements.
- **Dates:** a roster's "last updated" date is not the date of the statement. The manifesto signatories carry the manifesto's publication date (3 September 2025).
- **Does not count:** the 48 members of a Nova Scotia housing working group (a 2021 brief lists a 1% wealth tax as one of ten fiscal options, not as a recommendation), and a Kairos row whose page never mentions a wealth tax.
