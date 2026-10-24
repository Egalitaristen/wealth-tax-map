# R003 expert and public-commentator research, 22 October 2026

Worker: pl_public_experts. Staging only; canonical CSVs untouched. Read repository skill including 6.10. Broad Polish and English discovery, bulk lists first, then primary opinions/interviews. No narrower follow-up batch should be mistaken for a finished country sweep.

## Results written incrementally

13 actor/evidence pairs in `staging_r003_experts.jsonl`: Jakub Rok, Jakub Kronenberg, Polish Zero Waste Association, EKO-UNIA, Fundacja Kupuj Odpowiedzialnie, Elżbieta Mączyńska, Michał Sutowski, Ryszard Bugaj, Gabriel Zucman, Grzegorz Malinowski, Jacek Tomkiewicz, Stefan Paweł Załęski, Paweł Bukowski. Coordinator reports Malinowski/Tomkiewicz already added in parallel and Załęski covered by another worker: deduplicate these three. Counts here are staging counts, not final new-actor counts.

- Beyond Growth letter (15 May 2023): original English PDF lists all five Polish signatories; page 2 expressly proposes a carbon wealth tax. Original roster gives Rok/UW and Kronenberg/Lodz affiliations. Organisation representatives Barczak, Gawlik and Huma were NOT counted as separate personal signers.
- Mączyńska: PAP interview, 12 May 2020, syndicated in full by Ino.online. Advocates tax on wealth value, separately saying this also applies to cadastral tax, and pointing to multimillionaire/billionaire wealth taxation.
- Sutowski: own 23 February 2017 article expressly supports an ad valorem tax “nie tylko od nieruchomości”. Clear broad wealth-stock support; rejects a maximum wealth cap.
- Bugaj: 18 June 2015 interview supports a named wealth tax, emphasising immovable assets but also discussing an EU reform replacing income taxes with wealth taxes. Grade B; review scope carefully. Separate 2014 RP interview was cadastral-only and excluded.
- Zucman: own introduction to Polish edition, republished 19 October 2026, expressly calls for Poland to tax large fortunes at minimum 2% of wealth; threshold EUR100m discussed. Foreign actor included only because this is specifically directed at Poland.
- Malinowski/Tomkiewicz: original 2015 coauthored paper, issue43(3/2015), says global wealth tax is a necessity. Date is year-only honestly; schema allows YYYY. No invented publication day.
- Załęski: own 2 June 2020 article rejects a uniform tax but prioritises stock taxation of financial instruments/unlisted shares. Qualifies partial_wealth, distinct from separate proposals for VAT/transaction taxes and land taxes.
- Bukowski: coauthored RP opinion 28 April 2020; visible original opening explicitly recommends progressive tax on income AND wealth of richest to finance health investment. Strong corroborating primary interview is https://oko.press/ratowanie-gospodarki-finansuja-niezamozni-ludzie-sie-zorientuja-ze-cos-tu-nie-gra-rozmowa (26 April 2020), saying “Dlatego proponujemy trochę to odwrócić i wprowadzić podatek majątkowy, który jest silnie progresywny”. His own site also republishes plan at https://napokolenia.pl/mamy-plan-jak-uratowac-gospodarke/ (14 April 2020).

## Source access and checks

All evidence URLs opened and dated/byline passages read. Raw public-page downloads via urllib confirmed exact whitespace-normalised quotations for all six HTML evidence rows. Both original PDFs were also downloaded into memory and extracted with pypdf: all seven PDF-row quotes/signatory names matched. Thus all13staged rows passed direct source-text matching. Coordinator should still run standard quote checker after merge. All `verified=n` for independent review. No source snippets used as final evidence.

Alive checks: obituary searches for every new person plus current professional pages. Important identity collision: pharmacist Jakub Rok (Silesian Medical University) died in November2024; the signer is the living Warsaw EUROREG ecological economist, whose institutional biography gives a 2021 economics doctorate and current assistant professorship. Mączyńska obituary result from1989 is a different person; PTE reports her May2026 conference appearance. Current university profiles and ongoing publications corroborate other people. No home/contact information stored.

Browser/search tool served the full text of most Polish articles. Direct local networking initially blocked; read-only public-source exact-match check succeeded with network escalation. RP Kotecki original interview is paywalled; original TOKFM interview write-up accessible but only directly quotes property-tax increase, while the broader holdings statement is paraphrased. No Kotecki row added from a headline or secondary report. PTE bulletin first returned502, archive copy exceeds search reader14.6MB limit. Switched sources rather than building tooling. Rachel original OKO article is paywalled, author-site excerpt is descriptive; no unsupported endorsement row.

## Bulk leads and exclusions

1. https://reimagine-economy.eeb.org/ and https://reimagine-economy.eeb.org/wp-content/uploads/2023/06/EN-BG-Open-Letter.pdf — processed Poland-affiliated roster; five qualifying actors. Ilona M. Otto signs as Graz researcher: no Poland-directed action established; nationality alone not imported.
2. https://www.money.pl/podatki/lepiej-opodatkowac-majatki-niz-prace-tak-ale-sa-warunki-opinia-7120228510276384a.html — tempting “55economists” bulk lead actually asks about cadastral/property tax. Do NOT import all respondents. Other articles loosely describe it as wealth tax.
3. https://krytykapolityczna.pl/gospodarka/europo-czas-skonczyc-z-uzaleznieniem-od-wzrostu-gospodarczego/ — 2018 letter238academics has generic progressive taxes, carbon tax, income minimum/maximum; no explicit included wealth-stock tax. Agata Hummel and Kronenberg on roster do not justify new wealth-tax rows. https://degrowth.info/en/signatories-open-letter is a different large later roster, likewise not imported without matching qualifying letter.
4. Global Redistribution Advocates open letter checked in prior run: no Poland-affiliated roster names. Not reimported international supporters merely because letter cites Polish polling.
5. PSE100economists2023letter: earlier lead remains generic fiscal/property support; no mass import justified.

Other checked sources/leads:
- Piotr Wójcik: https://krytykapolityczna.pl/gospodarka/jak-zmniejszyc-nierownosci-majatkowe-w-polsce/ is expressly against a national broad wealth tax for now, preferring cadastral/local taxes and PIT. Do not infer endorsement from headline. https://krytykapolityczna.pl/gospodarka/progresywna-polityka-w-interesie-sredniakow-piotr-wojcik/ defends middle-class interests but strong own endorsement not established. Future wealth tax appears deferred, not current policy advocacy.
- Ludwik Kotecki: https://pro.rp.pl/raporty-ekonomiczne/art42815181-ludwik-kotecki-rpp-jestesmy-juz-na-tyle-bogaci-ze-czas-na-podatek-majatkowy (8Aug2025) paywall; https://www.tokfm.pl/polska/tokfm-7-103085-32168502-nowy-podatek-zasypie-dziure-w-budzecie-bardzo-latwe-do-zrobienia (11Aug2025) primary write-up. Secondary Forsal and Interia report broader stock support. High-priority original audio/transcript lead.
- Łukasz Rachel: https://napokolenia.pl/jak-opodatkowac-bogactwo-ekonomisci-tocza-pasjonujacy-spor/ (8Sep2026) own excerpt, descriptive then points to https://oko.press/jak-opodatkowac-bogactwo-ekonomisci-tocza-pasjonujacy-spor (6Sep2026), subscriber-only. Need original conclusion before count.
- Mikołaj Iwański: https://krytykapolityczna.pl/gospodarka/osobiste-konta-inwestycyjne-podatek-belki-inwestowanie/ (15Aug2025) enthusiastically supports OKI account asset tax0.8–0.9% above100k; coordinator explicitly held optional savings-wrapper out of scope inR002. Do NOT import this alone or whole bill votes.
- Piotr Kaszczyszyn: https://klubjagiellonski.pl/2019/11/28/wypalony-lewiatan-na-dziejowej-emeryturze/ mentions wealth tax among possible tools in author's discussion, but no clear chosen policy recommendation; held as contextual lead.
- Łukasz Łachecki: https://krytykapolityczna.pl/kraj/donald-tusk-mial-racje-rafal-brzoska-jest-niebezpieczny/ (8Aug2024) own strong tax-rich support, links Monbiot/Piketty but does not itself explicitly name wealth-stock tax. No row. Follow linked Monbiot policy and author's other texts only if own endorsement clear.
- Ewa Sapieżyńska: https://krytykapolityczna.pl/swiat/norwegia-wybory-podatek-majatkowy-bogaci/ (13Sep2025), Norway-based reporter/social scientist. Sympathetic framing does not by itself establish personal advocacy or Poland-directed action.
- Jan Śpiewak: https://www.piib.org.pl/images/stories/aktualnosci/2020-03/26032020cz3/BUDOWLANI.pdf indexed headline “Nie będzie lepszego czasu, by wprowadzić podatek od fortun i zlikwidować raje podatkowe”. Original named interview needed, other worker political layer may cover.
- Jeffrey Sachs: https://forsal.pl/artykuly/802085,jeffrey-sachs-ja-tylko-doradzalem.html (2014) original interview endorses his US tax proposal; without Polish-specific wealth-tax advocacy do not count merely because interviewed in Poland.
- Jacek Żakowski: “Ekonomista jako gwiazda rocka” is Marc Tracy's translated article; related-link/byline metadata can misattribute it to Żakowski. Not included.
- Artur Troost latest19Oct2026wealthtaxopinion is duplicate existing actor.
- Marek Kośny current2026university/Forbes interview remains cautious and implementation-oriented, no clear recommendation found.
- Michał Brzeziński papers/revenue estimates alone are research, not endorsement. His2025Money opinion mostlyprogressivity; not inferred.
- No public Polish wealthy/business/faith/cultural declarations established from broad terms and named searches (Tokarczuk, Twardoch, Holland, Żulczyk, Szczerek, Brzoska etc.). This is honest incomplete coverage, not no supporters.

## Next expected-yield order

1. Obtain openly available Kotecki TOKFM interview transcript/audio; broad holdings support reported across sources, avoid property-only quote.
2. Continue snowballing coauthors and Polish postgrowth/taxjustice reports, distinguish explicit recommendations from researchers' models. Check further dated letter rosters with qualifying wealth clause.
3. Rachel2026full original conclusion if publicly accessible elsewhere, then newer interviews of Brzeziński/Sawulski and author opinion archives.
4. Public cultural/wealthy declarations and verified official social posts; no private petition signatures.
5. PTE2021bulletin manual/local PDF reader to identify chapter authors and recommendations; do not attribute all bulletin articles to editors.

Query ledger follows in a separate section, generated from actual search terms used in this worker turn.

## Actual query ledger (80 search queries; includes alive checks)

1. `"podatek majątkowy" "list" "ekonomiści"`
2. `"podatek od majątku" "popieram" Polska ekonomista`
3. `"podatek majątkowy" "powinniśmy" ekonomista`
4. `"wealth tax" "Polish" "signatories" economists`
5. `"55 ekonomistów" "majątkowy"`
6. `"podatek majątkowy" "list otwarty" Polska`
7. `"Beyond Growth" "open letter" "Poland" 2023 signatories`
8. `"podatek majątkowy" "Kotecki" Rzeczpospolita wywiad`
9. `"Jakub Rok" zmarł śmierć`
10. `"Jakub Kronenberg" zmarł śmierć`
11. `"podatek majątkowy" "powinien" "Żakowski"`
12. `"podatek majątkowy" "Sroczyński"`
13. `"podatek majątkowy" "popieram" -site:senat.gov.pl -site:jbc.bj.uj.edu.pl`
14. `"podatek majątkowy" "jestem za" ekonomista`
15. `"podatek majątkowy" "Sadowski" OR "Kołodko" OR "Bugaj" OR "Mączyńska"`
16. `"podatek majątkowy" "Mączyńska"`
17. `"podatek majątkowy" "Kołodko"`
18. `"podatek majątkowy" "Bugaj"`
19. `"podatek majątkowy" "Bendyk"`
20. `"podatek majątkowy" "Wójcik"`
21. `"podatek majątkowy" "Brzeziński"`
22. `"podatek majątkowy" "Szumlewicz"`
23. `"podatek majątkowy" "Szahaj"`
24. `"Elżbieta Mączyńska" zmarła śmierć 2026`
25. `"Ryszard Bugaj" zmarł śmierć 2026`
26. `"Ludwik Kotecki" zmarł śmierć 2026`
27. `"Piotr Wójcik" ekonomiczny zmarł`
28. `"podatek majątkowy" "Tokarczuk" OR "Twardoch" OR "Holland"`
29. `"podatek majątkowy" "Solorz" OR "Ows iak" OR "Brzoska"`
30. `"podatek majątkowy" "ksiądz" OR "katolicki"`
31. `"podatek od fortun" Polska ekonomista`
32. `"podatek majątkowy" "Śpiewak"`
33. `"podatek majątkowy" "Sierakowski"`
34. `"podatek majątkowy" "Leszczyński"`
35. `"podatek majątkowy" "Tomkiewicz"`
36. `"2018" "open letter" "wealth tax" "238"`
37. `"Koncepcja globalnego podatku majątkowego" Tomkiewicz pdf`
38. `"Jan Śpiewak" "fortuny" podatek`
39. `"podatek majątkowy" site:krytykapolityczna.pl -Wójcik -Troost -Wroński -Fejfer -Woś -Szumlewicz`
40. `degrowth 2018 238 academics wealth tax signatories Poland`
41. `"podatek od majątku" "jestem" ekonomista Polska`
42. `"podatek majątkowy" "Jan Śpiewak" -site:jbc.bj.uj.edu.pl`
43. `"10.15584/nsawg.2015.3.7"`
44. `"podatek majątkowy" "Piotr Nowak"`
45. `"podatek majątkowy" "Jakub Majmurek"`
46. `"Grzegorz Malinowski" ekonomista zmarł`
47. `"Jacek Tomkiewicz" zmarł`
48. `"Michał Sutowski" zmarł`
49. `"Gabriel Zucman" death died 2026`
50. `"podatek majątkowy" "Paweł" -site:jbc.bj.uj.edu.pl -site:senat.gov.pl -site:sejm.gov.pl -site:onet.pl -site:biznes.interia.pl`
51. `"podatek majątkowy" "Kinga Dunin"`
52. `"podatek majątkowy" "Domański" ekonomista`
53. `"podatek majątkowy" "Jan Sowa"`
54. `"Stefan Paweł Załęski" zmarł`
55. `"Paweł Bukowski" ekonomista zmarł`
56. `"podatek majątkowy" "Zandberg" "ekonomiści"`
57. `"podatek majątkowy" "Żakowski" -site:jbc.bj.uj.edu.pl -site:sbc.org.pl`
58. `"podatek majątkowy" "przywrócić" Polska ekonomista`
59. `"podatek od bogactwa" "Polska" "powinien"`
60. `"podatek od wielkich majątków" "Polska"`
61. `"podatek majątkowy" "książka" "Szahaj"`
62. `"podatek majątkowy" "Rachel"`
63. `"podatek majątkowy" "Sawulski"`
64. `"podatek majątkowy" "Zygmunt" "Bauman"`
65. `"podatek majątkowy" "Dunin"`
66. `"podatek majątkowy" "Nowak" "Lewica"`
67. `"podatek majątkowy" "Gadomski"`
68. `"podatek majątkowy" "Sroczyński" poparcie`
69. `"podatek majątkowy" "Markiewka"`
70. `"podatek majątkowy" "profesor" -site:jbc.bj.uj.edu.pl -site:sejm.gov.pl -site:sbc.org.pl -Wroński -Kotecki -Mączyńska -Paczos`
71. `"wealth tax" "Poland" "letter" -site:jbc.bj.uj.edu.pl -California -Kopczuk`
72. `"podatek majątkowy" site:tygodnikprzeglad.pl`
73. `"podatek majątkowy" "Brzoska" "płacić"`
74. `"podatek majątkowy" "Żulczyk"`
75. `"podatek majątkowy" "Szczerek"`
76. `"podatek majątkowy" "Gdula"`
77. `"Donald Tusk miał rację" "Brzoska"`
78. `"podatek majątkowy" "katolicy"`
79. `"podatek majątkowy" "Sowa" -site:pl.wikisource.org -site:jbc.bj.uj.edu.pl -site:sbc.org.pl`
80. `"podatek majątkowy" "Szahaj" -site:jbc.bj.uj.edu.pl`
