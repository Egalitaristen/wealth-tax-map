# Germany: a federal state with a suspended wealth tax

A fourth worked example. It shows a country where the wealth tax was never repealed, only suspended (1997), where the opposition has tabled motions on it in every Bundestag term, and where the strongest evidence is a few bulk lists: Bundestag sponsors and an alliance statement. Check every URL still works before relying on it.

## Levels and the geography register

| Level (`level`) | Units | Notes |
|---|---|---|
| national | Bundestag, Bundesrat, Bundesregierung | The tax is federal law (*Vermögensteuergesetz*); the yield goes to the Länder |
| supranational | German MEPs | Not yet searched |
| region | 16 Länder (each with a Landtag) | Names written in English (Bavaria, Lower Saxony, …) so the site reads in English |
| county | 401 Kreise: 294 Landkreise and Kreise, 107 kreisfreie Städte and Stadtkreise (Hanau since 1 January 2026) | 5-digit AGS in `code`. Named as Germans write them: `München` (the city) and `Landkreis München`, `Kreis Pinneberg`, `Region Hannover`. Bundestag members go in the Land of their seat (direct or list), from the Bundestag's MdB-Stammdaten |
| council | 10,939 Gemeinden, including 192 unincorporated areas (`Gemeindefreies Gebiet …`, mostly forests and lakes) | The map tier, with the 8-digit AGS. A kreisfreie Stadt is one Gemeinde inside its own Kreis (München > München); actors placed in such a city go in the Gemeinde, so the map shades them. Two Gemeinden called Neuenkirchen share a Landkreis and are written `Neuenkirchen bei Anklam` and `Neuenkirchen bei Greifswald` |

**Map:** `data/de/boundaries.json` uses the BKG's *Verwaltungsgebiete 1:250 000* (VG250, as of 1 January): Gemeinden as units, Kreise as region outlines and Länder as the upper outlines, all from the same shapefile set so codes and borders agree. Licence: Datenlizenz Deutschland – Namensnennung – Version 2.0; the credit `© BKG (year) dl-de/by-2-0` with the data-sources link must appear wherever the map is shown, and the site prints the file's `source` on the Method page. `GF=4` keeps land areas (2 is water).

```bash
# https://daten.gdz.bkg.bund.de/produkte/vg/vg250_ebenen_0101/aktuell/vg250_01-01.utm32s.shape.ebenen.zip
L="--scale 0.005 --flip-y --licence dl-de/by-2-0 --licence-url https://www.govdata.de/dl-de/by-2-0"
python skill/scripts/topo_to_boundaries.py VG250_GEM.shp --name-prop GEN --code-prop AGS --where GF=4 --simplify 1.2 $L   --code-scheme "AGS (Amtlicher Gemeindeschlüssel)" --source "© BKG (2026) dl-de/by-2-0, VG250 ..." --out gem.json
python skill/scripts/topo_to_boundaries.py VG250_KRS.shp --name-prop GEN --code-prop AGS --where GF=4 --simplify 1.5 $L --code-scheme AGS --out krs.json
python skill/scripts/topo_to_boundaries.py VG250_LAN.shp --name-prop GEN --code-prop AGS --where GF=4 --simplify 2 $L --code-scheme AGS --out lan.json
python skill/scripts/merge_boundaries.py gem.json --regions krs.json --upper lan.json --out data/de/boundaries.json
```

## Where the national record is

- **Drucksachen** (motions, bills, committee reports) as PDF: `https://dserver.bundestag.de/btd/<term>/<nnn>/<term><number>.pdf`, for example `21/040/2104029.pdf`. They open with the named sponsors (*Antrag der Abgeordneten … und der Fraktion …*), which makes each motion a bulk list (SKILL 6.4). The demand is in section II (*Der Deutsche Bundestag fordert die Bundesregierung auf*).
- **Official member register with death dates:** `https://www.bundestag.de/resource/blob/472878/MdB-Stammdaten.zip` (XML, linked from `bundestag.de/services/opendata`). It gives name, party, birth and death date and the Land of each term, so one lookup does the alive check and the `location` for every MP. Names differ from the Drucksache in places (*Cansin Köktürk*, *Agnieszka Brugger*, *Jan Aken* with *van* in a separate field), so match on surname plus first initial and read the unmatched ones by hand.
- **Plenary summaries:** `bundestag.de/dokumente/textarchiv/<year>/kw<nn>-de-…` (speakers and quotes of each debate).
- **Roll calls:** the abgeordnetenwatch.de API reproduces Bundestag roll calls with every member's vote (`/api/v2/polls?label[cn]=<term>`, then `/polls/<id>?related_data=votes`). It found the 36 yes votes on motion 20/4307 (2022) in one call; it does not reach the 2013 vote on the Greens' bill, whose names are only in the 228 MB plenary protocol PDF (`dserver.bundestag.de/btp/17/17250.pdf`, garbled text layer).
- **Committee hearings:** `heute im bundestag` (hib) reports name each expert and what they argued, for example hib 509/2021 on the 2021 hearing (`bundestag.de/presse/hib/835812-835812`): three of eight experts argued for the tax.
- **Landtage:** Drucksachen are readable at the Landtag's own site (for example `padoka.landtag.sachsen-anhalt.de/files/drs/wp7/drs/d0845dan.pdf`, `starweb.hessen.de/cache/DRS/19/7/04497.pdf`, `parlament-berlin.de/adosservice/19/IIIPlen/vorgang/d19-1952.pdf`). The Left's own motion database lists many more but its certificate does not match the host.
- **Terms in German:** Vermögensteuer / Vermögenssteuer, Vermögensabgabe (one-off levy, Art. 106(1) no. 5 Basic Law, Lastenausgleich), Millionärsteuer, Milliardärssteuer, Zucman-Steuer. *Reichensteuer* is also the top income tax rate. *Erbschaftsteuer* alone is out of the definition.

## What worked and what to watch

- **Bulk lists first.** Eight Drucksachen gave 115 of the first 176 actors, each with a stated design (Left motions 2010–2026; the Greens' 2012 bill). The same names appear in several terms, so the member register and one actor row per person kept the file small.
- **Alliance statements.** The joint statement of 4 October 2024 ("Die Zeit ist reif: Superreiche gerecht besteuern", PDF on attac.de) names 22 signatories and the demand in one sentence; the roster page of Netzwerk Steuergerechtigkeit lists 27 plus 12 supporters. Roster-only organisations are grade B.
- **Party programmes.** The SPD (2025 government programme PDF) and Greens (2021 programme PDF) are fetchable. For the Greens 2025 use the web page `gruene.de/artikel/zusammen-wachsen`.
- **Two parties voted against the Left in 2026.** The Finance Committee's report 21/8481 records SPD and Greens voting against motion 21/4029; their own positions are recorded from their programmes, not from that vote.
- **Name collisions:** people of the same name exist (the Green MP Ulrich Schneider, b. 1972, is not the chief executive of the Paritätischer, b. 1958). Match on the Bundestag register's birth date, and write a distinguishing name in `actors.csv` when two people share one.
- **Do not count as support:** statements about the inheritance tax (*Erbschaftsteuer*) alone (Truger, Sachverständigenrat 2025) and revenue calculations without an endorsement (Stefan Bach, DIW). A pseudonymous campaigner whose real name is withheld (Stefanie Bremer) cannot be identified or checked for death.

## Tooling that changed what was reachable

- `die-linke.de` and `linksfraktion.de` answer 403 to curl and to the headless browser; an easy-read edition of the 2025 programme is hosted by a third party. `bsw-vg.de` is refused by the egress proxy. `taxmenow.eu` shows a bot check; `zeit.de`, `gew.de` and `der-paritaetische.de` answer 403 to plain clients.
- Wikipedia and Wikidata APIs rate-limit shared addresses (HTTP 429); `profiles_wikidata.py` needs QIDs, which are not yet filled.
- `wtdb.py checkquotes` skips quotes of fewer than three words, so a roster entry that is only a name must be quoted with its neighbours on the printed list.
