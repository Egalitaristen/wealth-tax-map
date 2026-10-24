# Canada: a federal state where the wealth-tax case comes from the NDP, unions and civil society

A tenth worked example. Canada has no net-wealth tax. Support comes from the NDP (a 2020 House motion for a 1% tax on wealth above CAD 20 million, convention resolutions from riding associations), the Greens, Québec solidaire, the big unions and the Canadian Labour Congress, civil-society coalitions (Québec's *Manifeste pour un Québec sans pauvreté*, Canadians for Tax Fairness, CCPA) and a group of Patriotic Millionaires Canada signatories. Check every URL still works before relying on it.

## Levels and the geography register

| Level (`level`) | Units | Notes |
|---|---|---|
| national | House of Commons, Senate, federal government | `ourcommons.ca` blocks automated requests (403), so vote pages cannot be read by `checkquotes`; check a vote against the Commons page or Hansard by hand |
| region | 10 provinces and 3 territories | Two-digit PRUID in `code` |
| council | 5,054 census subdivisions (CSDs) | The map tier, with the seven-digit CSDUID. CSDs include municipalities, First Nations reserves and unorganised areas, so not all elect councils |

**Map:** `data/ca/boundaries.json` uses Statistics Canada's 2025 Census Subdivision boundary file and its 2021 provincial and territorial outlines, in the same projection (EPSG:3347). Licence: Open Government Licence - Canada, credit "Statistics Canada". The feature services are `geo.statcan.gc.ca/geo_wa/rest/services/2025/lcsd000a25s_e/MapServer/0` (CSDs) and `.../2021/Digital_boundary_files/MapServer/0` (provinces); query them as GeoJSON, convert with `topo_to_boundaries.py --project planar`, and combine with `merge_boundaries.py`.

## What counts, and what was removed in review

- **Counts:** a roll-call vote on the NDP wealth-tax motion, organisations and individuals who signed a letter or manifesto that calls for a wealth tax, riding associations and unions that submitted a convention resolution, and named statements.
- **Dates:** a roster's "last updated" date is not the date of the statement. The manifesto signatories carry the manifesto's publication date (3 September 2025).
- **Does not count:** the 48 members of a Nova Scotia housing working group (a 2021 brief lists a 1% wealth tax as one of ten fiscal options, not as a recommendation), and a Kairos row whose page never mentions a wealth tax.
