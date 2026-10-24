# Italy: economist manifestos, a popular initiative bill, and budget amendments

A worked example for a unitary state with no general net wealth tax, where support is anchored by the May 2024 *Manifesto per un'agenda Tax the Rich per l'Italia* (134 economists from 50 universities), the May 2026 popular initiative bill *1% Equo* ("Imposta grandi patrimoni"), parliamentary budget-law amendments by Alleanza Verdi e Sinistra (AVS) and left-wing PD/LeU/M5S MPs, CGIL's solidarity-levy proposal, and civil-society campaigns (Oxfam Italia, Campagna Sbilanciamoci!, Forum Disuguaglianze e Diversità, Fondazione Demo). Check every URL still works before relying on it.

## Levels and the geography register

| Level (`level`) | Units | Notes |
|---|---|---|
| national | Parlamento (Camera dei deputati, Senato della Repubblica), Governo | Budget-law wealth-tax amendments are examined in the 5th Committee (*Commissione Bilancio*) and often declared inadmissible or withdrawn before plenary electronic roll calls |
| region | 20 regions (5 with special statute) | ISO 3166-2:IT codes (`IT-21` to `IT-88`). Names written in English where standard (`Lombardy`, `Piedmont`, `Tuscany`, `Apulia`, `Sicily`, `Sardinia`, `Aosta Valley`, `Trentino-South Tyrol`) |
| county | 107 supra-municipal territorial units (*Unità territoriali sovracomunali*): provinces, metropolitan cities, free municipal consortia (Sicily), and regional decentralization entities (Friuli-Venezia Giulia) | 3-digit ISTAT `COD_UTS` code (zero-padded, e.g. `001` Torino, `015` Milano, `058` Roma). Includes the autonomous provinces of Bolzano/Bozen (`021`) and Trento (`022`) |
| council | 7,896 *comuni* (ISTAT list as of 1 January 2025) | The map tier, with the 6-digit ISTAT `PRO_COM_T` code. Two pairs of *comuni* share a name across different provinces (`Castro` in Bergamo and Lecce; `abbreviated/homonymous` `Samone` in Torino and Trento) — disambiguate in searches by adding the province |

**Map:** `data/it/boundaries.json` uses ISTAT's *Confini delle unità amministrative a fini statistici al 1° gennaio 2025* (generalised version, `Limiti01012025_g.zip`, EPSG:32632 / UTM zone 32N): *comuni* (`Com01012025_g_WGS84.shp`) as units, provinces/UTS (`ProvCM01012025_g_WGS84.shp`) as region outlines, and regions (`Reg01012025_g_WGS84.shp`) as upper outlines. Licence: CC BY 4.0 (`https://www.istat.it/note-legali/`); credit `© ISTAT (2025), Confini delle unità amministrative a fini statistici al 1° gennaio 2025, CC BY 4.0`.

```bash
# https://www.istat.it/storage/cartografia/confini_amministrativi/generalizzati/2025/Limiti01012025_g.zip
L="--scale 0.001 --flip-y --licence CC-BY-4.0 --licence-url https://www.istat.it/note-legali/"
python skill/scripts/topo_to_boundaries.py Com01012025_g_WGS84.shp --name-prop COMUNE --code-prop PRO_COM_T --simplify 0.5 $L \
  --code-scheme "ISTAT 6-digit municipality code (PRO_COM_T)" \
  --source "© ISTAT (2025), Confini delle unità amministrative a fini statistici al 1° gennaio 2025, CC BY 4.0" --out com.json
python skill/scripts/topo_to_boundaries.py ProvCM01012025_g_WGS84.shp --name-prop DEN_UTS --code-prop COD_UTS --simplify 0.8 $L \
  --code-scheme "ISTAT 3-digit province/UTS code (COD_UTS)" --out prov.json
python skill/scripts/topo_to_boundaries.py Reg01012025_g_WGS84.shp --name-prop DEN_REG --code-prop COD_REG --simplify 1.2 $L \
  --code-scheme "ISTAT region code" --out reg.json
python skill/scripts/merge_boundaries.py com.json --regions prov.json --upper reg.json --out data/it/boundaries.json
```

## Where supporters were found (seed pass, October 2026)

- **The May 2024 Manifesto of 134 economists (`H0001`):** *Manifesto per un'agenda Tax the Rich per l'Italia*, drafted by Demetrio Guzzardi, Elisa Palagi and Andrea Roventini (Sant'Anna Pisa) and presented at the Senate on 22 May 2024 with Oxfam Italia and Patriotic Millionaires. Calls for a progressive annual wealth tax on the richest 0.1% (net wealth > EUR 5.4m, rates 1.7%–3.5%, est. EUR 15.7bn/year). Because `oxfamitalia.org` returns HTTP 403 to plain clients, use the full signatory reproduction on `policymakermag.it` (`checkquotes`-compatible) and the Sant'Anna / *Avvenire* reports.
- **Popular initiative bill *1% Equo* ("Imposta grandi patrimoni", `H0003`):** Filed at the Court of Cassation on 7 May 2026 by Partito della Rifondazione Comunista and Comitato 1% Equo (11 first signatories: Maurizio Acerbo, Pier Giorgio Ardeni, Anna Bruna Camposampiero, Elena Coccia, Francesca Fornario, Alfonso Gianni, Matteo Prencipe, Rosa Rinaldi, Nadia Rosa, Benedetta Sabene, Marco Veronese Passarella). Proposes a 1%–3.5% progressive annual wealth tax above EUR 2m excluding the primary residence.
- **Parliamentary budget amendments and party packages:**
  - December 2020 Orfini–Fratoianni budget amendment (`H0002`, progressive net wealth tax from 0.2% over EUR 500k to 2% over EUR 50m, replacing IMU and bank/securities stamp duty): Matteo Orfini, Nicola Fratoianni, Enza Bruno Bossio, Andrea Colletti.
  - 2024–2026 Alleanza Verdi e Sinistra (AVS) amendments and *"Restituzione fiscale"* package (annual progressive wealth tax above EUR 5.4m plus 26% exit tax; Nov 2025 Senate amendment by Tino Magni for 1.3% above EUR 2m; Chamber amendment by Marco Grimaldi).
  - Fondazione Demo (PD cultural foundation) working group coordinated by Emanuele Felice and Vincenzo Visco: 2–3% national Zucman-style wealth tax on fortunes above EUR 100m.
  - Movimento 5 Stelle: 2026 Nova programmatic proposal for a progressive levy on large financial assets, plus MPs/MEPs Chiara Appendino and Pasquale Tridico backing a full national wealth tax above EUR 5m.
- **Unions, NGOs, wealthy and cultural figures:** CGIL and Maurizio Landini (1.5% solidarity contribution above EUR 2m), Oxfam Italia and Mikhail Maslennikov, Campagna Sbilanciamoci! (*Controfinanziaria* progressive wealth tax above EUR 1m), Forum Disuguaglianze e Diversità (Fabrizio Barca), industrialist Carlo De Benedetti, and actor Flavio Insinna.
- **Regional and local sample:** Provincial Council of Bolzano / Regional Council of Trentino-Alto Adige Voto n. 39/25 *"Tax the Rich"* (co-sponsored by Sandro Repetto and Brigitte Foppa, `api-idap.landtag-bz.org`), and Rifondazione Comunista — Federazione di Lucca coordinating municipal URP signature collection across Lucca province.

## What to watch in Italian sources

- **Ambiguity of *"patrimoniale"*:** In Italian media, *"patrimoniale"* or *"mini-patrimoniale"* is frequently used for IMU (municipal real-estate tax), cadastral reform (*riforma del catasto*), inheritance tax (*imposta sulle successioni*), or the 0.2% stamp duty on bank/securities accounts. Always verify that the source specifies a tax on total net wealth (*grandi patrimoni*, *patrimoni netti*, *ricchezza netta*), large financial wealth, or a billionaire minimum tax.
- **Blocked portals and `ilfattoquotidiano.it` HTML quirks:** `senato.it` and `aic.camera.it` serve Radware Captcha pages to plain clients, and `oxfamitalia.org` returns HTTP 403. On `ilfattoquotidiano.it`, the JSON-LD `<script>` block at the top of each page leaves raw `\u00ec` escapes in the text stream while `wtdb._plain` replaces `<a>` tags in the HTML body with a space `" "` (so `“<a>Zucman tax</a>”` becomes `" zucman tax "` with spaces inside the quotes). Pick quotes from spans without inline `<a>` tags adjacent to punctuation so `wtdb.py checkquotes` matches 100%.
