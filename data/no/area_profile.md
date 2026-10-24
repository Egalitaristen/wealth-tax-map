# Area profile — Norway

First written 2026-10-22 (run R001).

## 1. Scope
- Area: Norway; type: country.
- Scope: Seed pass — prominent national supporters across all key layers, plus sampled regional (15 fylker / counties) and local (357 kommuner / municipalities).
- Levels of government in scope: national (Stortinget, regjeringen), regional (15 fylker / fylkeskommuner), and local (357 kommuner / kommunestyrer). Svalbard and Jan Mayen are not municipalities and are out of scope.
- Languages to search in: Norwegian (Bokmål and Nynorsk), English.
- Date of first run: 2026-10-22.

## 2. Wealth tax history and live proposals (2010 onwards)
- Norway is one of the few OECD countries with an **active, continuous annual net wealth tax** (*formuesskatt*), levied partly by the primary municipality (*formuesskatt til primærkommunen*) and partly by the state (*formuesskatt til staten*).
- Under the Solberg coalition government (2013–2021), the wealth tax rate was reduced from 1.1% to 0.85%, and valuation discounts on "working capital" (*arbeidende kapital* — shares and commercial assets) were introduced and increased up to 45% (2021).
- Under the Støre government (Arbeiderpartiet and Senterpartiet, with budget support from SV / Sosialistisk Venstreparti) from autumn 2021 onwards, the wealth tax was strengthened and increased:
  - 2022: Rate increased to 0.95% up to NOK 20m, and a second progressive bracket of 1.1% introduced for fortunes over NOK 20m. Share valuation discount reduced.
  - 2023–2024: Rates set to 1.0% (0.70% municipal + 0.30% state) for net wealth above the threshold (NOK 1.7m) up to NOK 20m, and 1.1% (0.70% municipal + 0.40% state) above NOK 20m. Valuation of shares/commercial property set to 80% (20% discount).
  - 2024–2026: Debates on the exit tax (*utflytterskatt*) following the relocation of several ultra-wealthy Norwegians to Switzerland, municipal attempts in Bø i Vesterålen and Asker to cut the municipal wealth tax rate, and the 2025–2026 government tax commission (*Skattekommisjonen*).
- Positions:
  - **Sosialistisk Venstreparti (SV)**: Demands a higher and more progressive wealth tax (additional bracket at NOK 100m at 1.8%, abolition of valuation discounts on shares, and strict exit tax).
  - **Arbeiderpartiet (Ap)**: Defends the wealth tax as essential for redistribution, against right-wing proposals to abolish it on working capital.
  - **Senterpartiet (Sp)**: Defends keeping the wealth tax and opposes abolition, while advocating higher thresholds and relief for local small/medium businesses.
  - **Rødt**: Demands steep progressive wealth taxation, national luxury tax, and closing loopholes.
  - **Miljøpartiet De Grønne (MDG)**: Supports progressive wealth taxation with high thresholds and higher rates for the ultra-rich.
  - **Opponents (exclusions)**: Høyre (wants to abolish wealth tax on working capital), Fremskrittspartiet (wants complete repeal), NHO.

## 3. Legislatures and where their records are
- **Stortinget (National Parliament):**
  - Open data REST API: `https://data.stortinget.no/` (free public XML/JSON export covering sessions, cases, questions, votes, and member biographies).
  - Web site: `https://www.stortinget.no/`
  - Wealth tax rates and thresholds are set annually in the budget bill *Innstilling fra finanskomiteen om skatter, avgifter og toll* (*Innst. 3 S*).
  - Key debates and votes also occur on representative proposals (*Dokument 8*).

## 4. Parties
- Major Storting parties:
  - `Labour Party` (Arbeiderpartiet, Ap)
  - `Socialist Left Party` (Sosialistisk Venstreparti, SV)
  - `Centre Party` (Senterpartiet, Sp)
  - `Red Party` (Rødt)
  - `Green Party` (Miljøpartiet De Grønne, MDG)
  - Opponents: `Conservative Party` (Høyre), `Progress Party` (Fremskrittspartiet, FrP), `Liberal Party` (Venstre), `Christian Democratic Party` (KrF).

## 5. Government below national level
- **15 fylker (counties):** Oslo (03), Rogaland (11), Møre og Romsdal (15), Nordland (18), Østfold (31), Akershus (32), Buskerud (33), Innlandet (34), Vestfold (39), Telemark (40), Agder (42), Vestland (46), Trøndelag (50), Troms (55), Finnmark (56).
- **357 kommuner (municipalities):** All loaded into `geo_units.csv` with official 4-digit SSB codes.
- Local taxation: Municipalities receive a fixed maximum share of the wealth tax (currently 0.70%), which goes into the municipal equalization system (*inntektsutjevningen*). A few municipalities (notably Bø i Vesterålen in 2020) reduced their local rate, sparking national debate.
- Boundary data: Kartverket (Norwegian Mapping Authority), *Administrative enheter kommuner og fylker* (2024), published under CC BY 4.0 via Geonorge.

## 6. Search terms
| Term | Note |
|---|---|
| formuesskatt, formueskatt | The wealth tax; both spellings used |
| formuesskatten | Definite form ("the wealth tax") |
| milliardærskatt, skatt på de rikeste | Billionaire tax, tax on the richest |
| formuesbeskatning | Wealth taxation |
| utflytterskatt, exit-skatt | Exit tax on unrealized gains / departing fortunes |
| arbeidende kapital | "Working capital" (the political battleground term in Norway) |

## 7. Media
- National dailies: *Klassekampen* (left daily, editorial defender of wealth tax), *Dagsavisen*, *VG*, *Aftenposten*, *Dagens Næringsliv* (business daily), *E24*, *FriFagbevegelse* (labour movement news).
- Broadcasters: *NRK* (public broadcaster), *TV 2*.

## 8. Registers
- Brønnøysundregistrene (`brreg.no`): official business and entity register.
- Stortinget open data: `data.stortinget.no`.
- SSB (Statistisk sentralbyrå): `ssb.no`.

## 9. Known networks
- LO (Landsorganisasjonen i Norge) and member unions (Fagforbundet, Fellesforbundet).
- Think tanks: Tankesmien Manifest, Tankesmien Agenda.
- NGOs & coalitions: Tax Justice Norge, Attac Norge, Kirkens Nødhjelp, Oxfam partners.

## 10. Plan for the next runs
- Order by expected yield:
  1. Storting roll calls on budget votes (Innst. 3 S) and parliamentary motions.
  2. Economists snowballing (Kalle Moene, Gabriel Zucman Norway visits/co-authors, Rolf Aaberge, Annette Alstadsæter).
  3. Regional and local sweep of key municipalities (Oslo, Bergen, Trondheim, Tromsø council groups).
  4. Business/wealthy voices (patriotic millionaires letters, business op-eds).
