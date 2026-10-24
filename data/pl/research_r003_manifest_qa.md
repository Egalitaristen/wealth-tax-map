# Independent R003 manifesto QA — 2026-10-22

Checker: separate Poland QA agent; no canonical CSV edits or verification-flag changes. Snapshot read: 262 actors, 279 evidence rows; every evidence `verified` value was `n`. This report records source and meaning checks, not full authentication of every endorsement.

## Common source, definition, grade and date

- Original roster: https://regeneracjamanifest.wordpress.com/manifest-popieraja/
- Original manifesto: https://regeneracjamanifest.wordpress.com/
- Cached WordPress response: `.cache/pl/regeneration-roster-api.json`; published 2020-03-25T18:27:18+01:00, modified 2021-04-19T20:06:35+02:00.
- Manifesto financing paragraph separately names luxury consumption, highest incomes and wealth. An unspecified wealth-tax interpretation is justified; it does not establish a particular rate, annual frequency or net base.
- Grade B is appropriate for the campaign's published endorsement roster. It is not individual authentication of signatures. Institutional affiliations describe people; they do not establish endorsement by those institutions.
- Date 2021-04-19 must remain explicitly described as the dated roster edition/modification, not an individual's signature date. Individual signature dates are unknown.
- All 189 original academic-candidate entry strings matched the cached roster after HTML/whitespace normalization (0 unmatched). Name-only quotes can legitimately be short where that is all the original entry supplies; this does not itself confirm identity.

## Academic sample

Random sample: Python random seed 8343, 20 candidates. Positions: 154 Michał Żabiński; 187 Izabela Wagner-Saffray; 297 Rafał Gruszczyński; 224 Łukasz Moll; 337 Kinga Połyńczuk-Alenius; 68 Piotr P. Płucienniczak; 29 Hanna Szymborska; 87 Joanna Wowrzeczka; 275 Adam Dąbrowski; 62 Anna Ząbkowicz; 79 Rafał Majerek; 94 Sławomir Czech; 25 Zofia Łapniewska; 238 Jerzy Kociatkiewicz; 57 Jakub Muchowski; 38 Anna Romanowicz; 139 Andrzej Kozina; 181 Łukasz Sochacki; 459 Jędrzej Krakowski; 193 Anna Baumgart.

Sample entry/name extraction passed. Identity and death discovery checks found no additional matching death beyond the known exclusion of Krakowski. Adam Dąbrowski has multiple unrelated obituaries; the UAM geography discipline must be preserved and no deceased namesake QID inferred. Doctoral title alone does not establish an academic employment role: Anna Baumgart is independently a public artist and `cultural_figure` is appropriate. Joanna Wowrzeczka also has a public Cieszyn councillor role.

Representative institutional/first-person identity sources consulted:

- https://gap.uek.krakow.pl/blog/pracownicy/dr-michal-zabinski/
- https://www.home.umk.pl/~gruszka/
- https://socjologia.uwr.edu.pl/instytut/pracownicy/pracownicy-instytutu/lukasz-moll/
- https://wbask.asp.waw.pl/zespol/dr-piotr-p-plucienniczak/
- https://ifispan.pl/reality-truth-and-the-democratic-imagination-in-journalistic-reporting-on-antiracist-queer-and-feminist-activism-in-poland/
- https://us.edu.pl/kandydat/joanna-wowrzeczka-ambasadorka-kierunku-studiow/
- https://economicus.ue.katowice.pl/info/author/UEKT37fbdd5c5450400e8f5e4932a90660f6/
- https://orcid.org/0000-0001-6449-1185
- https://rada-uczelni.uj.edu.pl/sklad-rady
- https://ippa.uek.krakow.pl/kpp/pracownicy/pracownik-3-3/
- https://www.uni.lodz.pl/aktualnosc/szczegoly/nowe-zajecia-soniczna-etnografia

Additional homonym checks: the living UEP economist Paweł Łuczak, UJ management scholar Michał Pałasz, Łazarski economist Krzysztof Beck and UWr sociologist Adam Mrozowicki are distinct from historical/deceased namesakes. Michał Piekarski is the UWr security scholar, confirmed by https://wns.uwr.edu.pl/pracownicy-jednostki/?omegaId=UWRbac6466b36d94cfe9944642d89323100 ; do not conflate with a philosopher or historical figure. Remove any apparent street address from a roster quote.

## Known exclusions and holds

- Jędrzej Krakowski (459): deceased 2022. Government obituary located at https://www.kombatanci.gov.pl/index.php/pl/po%C5%BCegnania/3265-nekrolog-%C5%9Bp-prof-dr-hab-j%C4%99drzeja-krakowskiego . Search-index discovery supported the exclusion; direct retrieval failed in this checker session.
- Grzegorz Grochowski: deceased 2022. Primary IBL PAN archive identified at https://archiwum.ibl.waw.pl/ewidencja-archiwum/dr-hab.-grzegorz-grochowski-prof.-ibl-pan-19702022 ; direct retrieval returned 502 in this checker session.
- Ewa Bobrowska (424), UJ sociology/pedagogy: deceased 2021; must not be confused with the living ASP visual artist. Primary university memorial location identified: *Alma Mater* 227 (2021), printed p134, https://ruj.uj.edu.pl/bitstreams/01c0e8af-bc8e-4d83-80c5-ddf06c7020f6/download . University repository landing page was opened, but PDF content was not retrievable here; indexed text identifies the UJ pedagogue/sociologist in the memorial section. Treat as an identified primary corroboration location, not a fully reopened obituary in this QA session.
- Keep ambiguous doctor-only entries without adequate independent public-role/identity proof on hold. No automatic QID assignment.

Artist type audit: roster positions 60 Zofia Nierodzińska, 193 Anna Baumgart, 341 Karolina Freino, 401 Dariusz Fodczuk, 406 Mariusz Sołtysik and 472 Katarzyna Górna are currently `cultural_figure`, as requested. Do not conflate Karolina with the distinct Helena Freino.

## Public-role import sample: seven originals reopened

Read `research_r003_manifest_public.csv` and `research_r003_manifest_public.md`, then checked the following against the original numbered roster and independent public-role pages. All seven have substantive public roles; no sampled person requires removal as a private ordinary signer.

| Position | Person | Opened role source and finding |
| --- | --- | --- |
| 1 | Nikodem Szewczyk | https://nikodemszewczyk.com/ and linked https://nikodemszewczyk.com/files/Nikodem_Szewczyk_CV.pdf plus https://nikodemszewczyk.com/writing/ — economics researcher, published author and public commentator. Current doctoral-student status does not make him a private ordinary signer. Historical Instrat affiliation comes from roster, not current CV. |
| 352 | Emilia Ślimko | https://zielonasiec.pl/nasz-zespol/ — public-hearings coordinator, campaign leader, expert and cofounder of Fundacja Otwarty Plan. Organisation continuity matches roster. |
| 473 | Wojtek Mejor | https://agriculture.ec.europa.eu/system/files/2020-12/bio-speakers-agri-outlook-conf-2020_en_0.pdf , p13 — cooperative representative, public educator/organiser/food-sovereignty activist. |
| 346 | Barbara Nawrocka | https://szkola-doktorska.uken.krakow.pl/doktorant/barbara-nawrocka/ — awarded architect, activist, curator, published author and cofounder of public initiatives; more than an ordinary private professional. Roster architecture discipline fits. |
| 456 | Ada Piekarska | https://culture.pl/pl/tworca/ada-piekarska — public curator, critic and cultural organiser associated with Galeria Bielska BWA, matching roster. |
| 361 | Wojciech Jasiński | https://konfederacjapracy.org.pl/kontakt/ — union regional representative for Wielkopolskie, with Solaris organisational connection matching roster. Position367 is a likely duplicate roster occurrence; do not create another actor solely for it. |
| 269 | Zenobia Żaczek | https://noizz.pl/wywiady/prawa-lokatorskie-tvp-i-transplciowosc-wywiad-z-zenobia-zaczek/spfc2dv — autobiographical public interview confirms tenants-rights cofounder and ZSP workers-rights activity. Keep current canonical name and the organisation-only roster quote; no earlier-name copy is needed in this report or canonical notes. |

Public-role sample outcome: acceptable. Current and historical affiliations must remain distinguished. No institutional endorsement inferred. Remaining scope: this is a sampled independent review, not authentication of all221 roster endorsements. All verification flags intentionally remain `n`.
