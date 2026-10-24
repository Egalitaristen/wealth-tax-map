# Brazil: a constitutional wealth tax never regulated

An eighth worked example. Brazil's 1988 Constitution (art. 153, VII) lets the Union levy an *Imposto sobre Grandes Fortunas* (IGF) by complementary law, and none has passed. Support shows up as bills (about 45 in the Câmara since 2010, a few in the Senate), one plenary roll call (30 October 2024, PSOL-Rede amendment to PLP 108/2024, 136-262), union and civil-society campaigns ("Tributar os Super-Ricos", "Taxar Fortunas para Salvar Vidas", "Tem Um Elefante Na Sala") and the G20 billionaire-tax track under Lula and Haddad. Check every URL still works before relying on it.

## Levels and the geography register

| Level (`level`) | Units | Notes |
|---|---|---|
| national | Câmara dos Deputados, Senado Federal, Governo Federal | The Câmara's open-data API (`dadosabertos.camara.leg.br/api/v2`) lists bills with authors and every member's vote |
| region | 26 states and the Federal District | Two-digit IBGE code. Deputies and senators are elected by state, so they go there |
| council | 5,571 municípios | The map tier, with the seven-digit IBGE code |

**Roll calls:** quote each member's own entry. The per-member list is `/api/v2/votacoes/<id>/votos` (JSON with `tipoVoto` and `deputado_.nome`); `quote_original` is the `nome` as printed there and `source_url` that endpoint. `checkquotes` reads it.

**Map:** IBGE's own pages state no licence for the *malhas territoriais*, but OCHA ROLAC republishes IBGE's 2020 boundaries on HDX (`cod-ab-bra`) under CC BY-IGO, with P-codes that are `BR` plus the IBGE code. The two lagoons (`BR4300001`, `BR4300002`) have no município. Boa Esperança do Norte (MT, `5101837`, created 2025) has no shape in the 2020 file.

```bash
# https://data.humdata.org/dataset/cod-ab-bra  (bra_adm_ibge_2020_SHP.zip)
L="--project lonlat --scale 60 --licence CC-BY-IGO --licence-url https://creativecommons.org/licenses/by/3.0/igo/ --strip-prefix BR"
python skill/scripts/topo_to_boundaries.py bra_admbnda_adm2_ibge_2020.shp --name-prop ADM2_PT --code-prop ADM2_PCODE   --where "ADM2_PCODE!=BR4300001,BR4300002" --simplify 0.4 $L --code-scheme "IBGE municipality codes" --source "..." --out mun.json
python skill/scripts/topo_to_boundaries.py bra_admbnda_adm1_ibge_2020.shp --name-prop ADM1_PT --code-prop ADM1_PCODE   --simplify 0.8 $L --code-scheme "IBGE state codes" --out uf.json
python skill/scripts/merge_boundaries.py mun.json --regions uf.json --out data/br/boundaries.json
```
