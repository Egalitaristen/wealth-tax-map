# Spain: a ceded wealth tax and a national top-up

A seventh worked example. Spain still levies the Impuesto sobre el Patrimonio, but the autonomous communities run it and Madrid and Andalusia rebate it to zero; the national Impuesto Temporal de Solidaridad de las Grandes Fortunas (Ley 38/2022) tops it up on net wealth above EUR 3m. Supporters cluster on the left of the PSOE (Podemos, Sumar, IU, ERC, EH Bildu, BNG), in the big unions and the tax-justice platforms. Check every URL still works before relying on it.

## Levels and the geography register

| Level (`level`) | Units | Notes |
|---|---|---|
| national | Cortes Generales (Congreso, Senado), Gobierno | Roll calls are open data on congreso.es; the server blocks heavy scanning (HTTP 403 after about 10,000 requests), so fetch only the votes you need |
| region | 17 autonomous communities and Ceuta and Melilla | ISO 3166-2:ES codes (`ES-CT`), because INE numbers communities and provinces from 01 alike. Names in English (Catalonia, Community of Madrid) |
| county | 52 provinces, Ceuta and Melilla | Two-digit INE code. Deputies and senators are elected by province, so they go there |
| council | 8,132 municipios (INE list of 1 January 2026) | The map tier, with the five-digit INE code. INE writes articles last ("Coruña, A", "Rozas de Madrid, Las"); the register puts them first (A Coruña, Las Rozas de Madrid) |

**Map:** `data/es/boundaries.json` uses the IGN's reference boundaries (CC BY 4.0, credit "© Instituto Geográfico Nacional"), as packaged in TopoJSON by the npm package es-atlas (`es/municipalities.json`, whose ids are INE codes, with the provinces and communities in the same file, so the lines agree). The shared lands (codes 53xxx) and Gibraltar (54) are dropped and the Canary Islands are moved into an inset. es-atlas predates a few municipios created since, so a handful of register units have no shape.

```bash
npm pack es-atlas@0.6.0 && tar xzf es-atlas-0.6.0.tgz
M=package/es/municipalities.json; L="--project lonlat --scale 300 --licence CC-BY-4.0 --licence-url https://creativecommons.org/licenses/by/4.0/"
python skill/scripts/topo_to_boundaries.py $M --object municipalities --code-prop id --where "id!=53*,54*"   --shift "35*,38*:17,6.8" --simplify 0.5 $L --code-scheme "INE municipality codes"   --source "© Instituto Geográfico Nacional (IGN), CNIG reference data via es-atlas, CC BY 4.0" --out mun.json
python skill/scripts/topo_to_boundaries.py $M --object provinces --code-prop id --where "id!=54" --shift "35,38:17,6.8"   --simplify 0.8 $L --code-scheme "INE province codes" --out prov.json
python skill/scripts/topo_to_boundaries.py $M --object autonomous_regions --code-prop id --where "id!=20" --shift "05:17,6.8"   --simplify 1 $L --code-scheme INE --out ccaa.json
python skill/scripts/merge_boundaries.py mun.json --regions prov.json --upper ccaa.json --out data/es/boundaries.json
```

## Where supporters were found (seed pass, October 2026)
- The Congreso roll call of 7 June 2022 on the Unidas Podemos bill for a tax on fortunes over EUR 10m (58 yes).
- Bills and their signatories (BOCG series B), the parties that voted for Ley 38/2022, Sumar's programmes.
- The Plataforma por la Justicia Fiscal and its members, Oxfam Intermón, Gestha, CCOO, UGT, Attac, backers of the European citizens' initiative "Tax the Rich".
- Regional bodies: the Catalan Parlament and Generalitat, Navarre, the Basque foral bodies.
- Not found: any Spanish millionaire or business owner on record for a wealth tax.
