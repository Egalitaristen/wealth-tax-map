# Netherlands geography sources

Accessed 2026-10-23. Coverage is the European Netherlands. The Caribbean public bodies Bonaire, Sint Eustatius and Saba are not municipalities in this CBS register and are outside the map; this is a scope limit, not a statement that no support exists there.

## Register

- CBS, [Gemeentelijke indeling op 1 januari 2026](https://www.cbs.nl/nl-nl/onze-diensten/methoden/classificaties/overig/gemeentelijke-indelingen-per-jaar/indeling-per-jaar/gemeentelijke-indeling-op-1-januari-2026).
- Original download: [Gemeenten alfabetisch 2026](https://www.cbs.nl/-/media/cbs/onze-diensten/methoden/classificaties/overig/gemeenten-alfabetisch-2026.xlsx), second worksheet. Imported the published municipality names, GM municipality codes, province names and PV province codes without constructing codes or inferring parentage.
- `geo_units.csv` retains the existing country root and four institutional units, plus 12 provinces and 342 municipalities: 359 rows. Five municipal pilot searches remain in progress; all other local units remain pending; loading the register does not indicate a completed substantive search. CBS's distinguishing province suffixes, such as Bergen (L.) and Bergen (NH.), are retained.
- Register reuse: [CBS copyright](https://www.cbs.nl/nl-nl/over-ons/website/copyright) states CC BY 4.0 unless otherwise indicated. Credit: CBS.

## Map

- Official publisher: CBS; distribution through [PDOK CBS Gebiedsindelingen](https://www.pdok.nl/ogc-webservices/-/article/cbs-gebiedsindelingen).
- [2026 WFS GetCapabilities](https://service.pdok.nl/cbs/gebiedsindelingen/2026/wfs/v1_0?request=GetCapabilities&service=WFS) was retrieved before downloading shapes. Its `ows:AccessConstraints` is `https://creativecommons.org/licenses/by/4.0/deed.nl`; the declared open licence therefore covers this specific service.
- Feature layers: `gebiedsindelingen:gemeente_gegeneraliseerd` (342 features) and `gebiedsindelingen:provincie_gegeneraliseerd` (12 features), retrieved as GeoJSON with WFS 2.0.0 GetFeature, `outputFormat=application/json`. Both use EPSG:28992 and the same release.
- Example download: [municipalities](https://service.pdok.nl/cbs/gebiedsindelingen/2026/wfs/v1_0?service=WFS&version=2.0.0&request=GetFeature&outputFormat=application/json&typeNames=gebiedsindelingen:gemeente_gegeneraliseerd); [provinces](https://service.pdok.nl/cbs/gebiedsindelingen/2026/wfs/v1_0?service=WFS&version=2.0.0&request=GetFeature&outputFormat=application/json&typeNames=gebiedsindelingen:provincie_gegeneraliseerd).
- Converted with the repository's `topo_to_boundaries.py`, `--name-prop statnaam --code-prop statcode --scale 0.004 --flip-y --simplify 0.6`. Province boundaries use exactly the same transform and are included under `regions`.
- `boundaries.json`: 342 municipal units and 12 province outlines. Every municipal shape's official GM code matches exactly one register entry. The map's publisher label may omit the province suffix that CBS uses in its municipality table; matching is by official code, so this does not affect matching.
- Licence: [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/). Attribution embedded in the map: CBS Gebiedsindelingen 2026 via PDOK; generalized municipalities and provinces; accessed 2026-10-23; Â© CBS, CC BY 4.0; simplified for display. Simplification is an adaptation for website display and not a change to official administrative definitions.

## Checks

- Register count: 1 country + 4 institutional units + 12 provinces + 342 municipalities = 359.
- All municipality parents come from the CBS spreadsheet's province-code column.
- The 342 municipality codes in the map equal the 342 municipality codes in the register, with no missing or extra codes.
- Province outlines were downloaded separately from the same CBS service, rather than assembled from simplified municipality shapes.
