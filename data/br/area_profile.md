# Area profile — Brazil

First written 2026-10-21 (run R001). Seed pass, national level only. Lines marked *[verify]* come from a search summary or a secondary page and were not checked against the primary document.

## 1. Scope
- Area: Brazil (República Federativa do Brasil); federal republic of 26 states and the Federal District, with 5,570 municípios.
- Depth: **Seed** (SKILL.md 6.1). National level: Câmara dos Deputados, Senado Federal, the federal government, civil-society coalitions. The register holds the country root, the two houses and the federal government, the 27 UFs (IBGE codes) and the 5,570 municípios (IBGE 7-digit codes, from `servicodados.ibge.gov.br/api/v1/localidades`). Nothing below the federal level has been searched.
- Languages to search in: Portuguese (main), English. Only these two were used.
- Date of first run: 2026-10-21.

## 2. Wealth tax history and live proposals (2010 onwards)
- The Imposto sobre Grandes Fortunas (IGF) is provided for in art. 153, VII of the 1988 Constitution ("nos termos de lei complementar") and has never been regulated ([Maria Regina Paiva Duarte, IHU 2020](https://ihu.unisinos.br/605247-maria-regina-duarte-a-escolha-do-sistema-tributario-de-um-pais-e-uma-escolha-politica)). There is therefore no existing wealth tax to defend; every row is about creating one.
- Since 2010 the Câmara open data lists 45 bills with "grandes fortunas" in the summary (PLP, PL), filed by deputies from nearly every party (H0001-H0045). Waves: 2011-2012, 2015, 2016, March-August 2020 (COVID-19 emergency taxes and compulsory loans) and 2024-2026.
- 30 Oct 2024: the Câmara rejected the PSOL-Rede amendment to PLP 108/2024 (second tax-reform regulation) that would have created an annual tax on net wealth above R$ 10m at 0.5%, 1% and 1.5% (136 yes, 262 no; [vote](https://dadosabertos.camara.leg.br/api/v2/votacoes/2438459-77), H0050). PT-PCdoB-PV, PSOL-Rede and PSB told their members to vote yes; the government released its bench *[verify, press]*.
- 2024: Brazil's G20 presidency put a minimum tax on billionaires' wealth (Zucman proposal, 2% of wealth) on the agenda; the July 2024 finance ministers' text accepted the principle without a rate, and Lula repeated the 2% figure at the Rio summit on 18 Nov 2024 ([Times Brasil](https://timesbrasil.com.br/brasil/lula-taxacao-de-2-sobre-super-ricos-pode-gerar-r-14-tri-entenda-a-resistencia-a-proposta/)).
- 2025: the Lula government's income-tax reform (PL 1087/2025, exemption up to R$ 5,000 a month, minimum tax on high incomes) is an income tax and is **not** a wealth tax; the coalition "Tem Um Elefante Na Sala" backs it and also proposes a contribution on large fortunes ([CUT](https://www.cut.org.br/noticias/oxfam-dieese-e-organizacoes-lancam-cartilha-popular-sobre-taxacao-de-super-ricos-ed76)).
- Polls: none recorded yet. Press cites a 2021 Ipsos poll (69% for taxing large fortunes) and a CASB poll (53% for, 20% against) *[verify, not read]*; add the pollsters' own releases.

## 3. Legislatures and where their records are
- **Câmara dos Deputados.** Open data API (`dadosabertos.camara.leg.br/api/v2`, send `Accept: application/json`): `/proposicoes?siglaTipo=PLP&keywords=...`, `/proposicoes/{id}/autores` (named authors), `/deputados/{id}` (current party, state and `dataFalecimento`), `/proposicoes/{id}/votacoes`, `/votacoes/{id}/votos`. The bill page (`camara.leg.br/proposicoesWeb/fichadetramitacao?idProposicao=`) prints the summary, so `checkquotes` can verify it. Sort/order parameters return HTTP 400 on some endpoints.
- **Senado Federal.** `legis.senado.leg.br/dadosabertos/materia/autoria/{codigo}` still works but is deprecated (to be replaced by `/processo/{id}`). The keyword search on `materia/pesquisa/lista` only matches the summary and returned one bill. The bill pages on `www25.senado.leg.br/web/atividade/materias/-/materia/{code}` print the summary.
- State assemblies and city councils: not opened.

## 4. Parties
- Voting bloc on 30 Oct 2024: 136 yes votes, 63 PT, 18 PDT, 10 PSB, 8 PSOL, 7 PCdoB, 4 PV, 1 Rede, plus 25 from centre and centre-right parties (MDB, PSD, União, Solidariedade, Republicanos and others).
- In the database (R002): PT (A: its 2019 tax-reform proposal, 0.45% on net wealth above 8,000 times the income-tax exemption limit, as reported by O Globo; B: Agência PT's January 2021 report), and PSB, Rede, PCdoB, PDT and PSOL (B, from the same 2021 report that deputies of the six parties presented "Tributar os super-ricos para reconstruir o país" to the tax-reform rapporteur). No party programme or congress resolution has been read yet; PV is not in the database.

## 5. Government below national level
- 26 states and the Federal District (assembleias legislativas, governors); 5,570 municípios (câmaras de vereadores). Not searched.

## 6. Sources
- Câmara and Senado open data; Correio Braziliense, Times Brasil/CNBC, Metrópoles (press); CUT (union site, reporting the campaign); IHU Unisinos (interview); a copy of a Folha de S.Paulo column hosted on bresserpereira.org.br; IBGE localidades API for the register.

## 7. Blocked or hard to read
- Nothing blocked. The Congresso em Foco list of how each deputy voted is a JavaScript widget and could not be read, so the roll call comes from the Câmara API. Quotes for those rows are the vote's own description line; the individual's yes vote is in `/votacoes/2438459-77/votos` and `checkquotes` cannot confirm it per person.

## 8. Map
- None. IBGE publishes municipal and state meshes (`servicodados.ibge.gov.br/api/v3/malhas`, `geoftp.ibge.gov.br`), but I found no explicit open licence for them (their read-me files carry a disclaimer about limits, not a licence). Find the licence statement in IBGE's data policy before building one; `mapaslivres/municipios-br` on GitHub is another candidate to check.

## 9. Run log
- R001 (2026-10-21): seed. 222 actors, 339 evidence rows: 114 deputies who authored an IGF bill, 4 senators, 92 further deputies who voted yes on 30 Oct 2024, Lula, Haddad, a Davos signatory (Pacífico), the tax-justice professional Maria Regina Paiva Duarte, and 8 organisations of the "Tem Um Elefante Na Sala" coalition. All rows `verified=n`; `checkquotes` found every quote on its page. One deputy (Assis Carvalho, d. 2020-07-05) was excluded as deceased. Party names are those in the register at the member's latest status.

- R002 (2026-10-21): wide sweep. +44 actors, +60 evidence rows (266 actors, 399 rows). Senate: a scan of PLP, PLS, PEC, PL and REQ summaries 2010-2026 found four more bills (PLP 38/2020 Reguffe, PLP 50/2020 Eliziane Gama, PLP 101/2021 Randolfe Rodrigues, PLS 534/2011 Valadares), and Agência Senado's report of 14 Apr 2020 gave statements by Rogério Carvalho, Humberto Costa, Jean Paul Prates and Plínio Valério (design: 0.5-1% above R$ 22.8m). The 2020 campaign "Tributar os Super-Ricos" (IGF on fortunes above R$ 10m) gave the Instituto Justiça Fiscal, Fenafisco, Anfip, Auditores Fiscais pela Democracia, MST, MTST, UNE, Contraf-CUT, CNTE, CNTSS, Confetam and Governor Flávio Dino (1-1.5% above R$ 8m); its study's technical coordinator is the economist Eduardo Fagnani. Ten union centrais and two popular fronts joined the April 2020 petition "Taxar Fortunas para Salvar Vidas", and eight centrais signed a July 2023 note listing the tax. Also: PT and five other parties, Ciro Gomes (0.5-1.5% above R$ 20m), Zucman (G20 report), Luciana Genro, Walter Salles, the G20 declaration, Unafisco and its president. One poll (Ipsos 2024, 69%) is in `meta.json`.

- R003 (2026-10-21): weak spots. +7 actors, +16 evidence rows (273 actors, 415 rows). The Câmara API cannot find amendments, requests or other proposition types by keyword (their summaries do not carry the phrase), so that route is closed. New: PSOL's ADO 55 petition to the Supreme Court (2 Oct 2019), PDT and Ciro Gomes's 2022 plan (0.5% above R$ 20m), PCdoB (2015 headline), PT adviser Guilherme Mello (2022), the CTB president's 2012 column backing PLP 48/2011, the July 2010 IHU interview after the CCJ approved PLP 277/2008 (Luciana Genro, economist Rodrigo Vieira de Ávila), Piketty (2014), an O Povo editorial (2024), Walter Salles in his own words (CartaCapital, 9 Jul 2025, replacing the headline), the national launch of the 2026 campaign "Taxar os Super-ricos" (IGF above R$ 10m; more than 90 entities, two named), and Fenafisco's president. Excluded as deceased: Major Olimpio (rapporteur of PLP 183/2019 [verify]).

- R004 (2026-10-21): last web-search sweep. +2 evidence rows (Lula and the PT, 2022 plan as summarised by O Povo). Searched for committee hearings, state-assembly motions, a parliamentary front, the 80-90 entities of the 2026 campaign and party filings: none found through the search tool. The academic review of parliamentary positions (Revista Debate Econômico 2018) names only bill authors already in the database. Web search is saturated; what is left needs direct access to the sources listed in section 10 item 0.

## 10. Plan for the next runs (by expected yield)
0. **Still open after R003:** faith groups (no CNBB/Cáritas statement found in four searches), columnists and editorials (one editorial, no columns), Brazilian signatories of rich-donor letters (only Pacífico), the full list of the 90+ entities in the 2026 campaign, party programmes and TSE filings (PT, PSB, Rede, PCdoB), committee hearings and speeches.
1. **Parties from primary pages:** PT, PSOL, PCdoB, PDT, PSB, PV, Rede programmes and congress resolutions (pt.org.br answers 403 to plain clients: try `fetch_page.py` or the TSE candidate filings at divulgacandcontas.tse.jus.br).
2. **Câmara beyond bills:** hearings and debates on the IGF in committees, plenary speeches (the API has `/deputados/{id}/discursos`), the CCJ vote on PLP 277/2008 in July 2010, requerimentos. The roll call of 30 Oct 2024 is the only plenary vote found; no vote was found on the Senate side.
3. **Economists, academics, commentators:** Pedro Rossi (IHU 2017 interview), Marcelo Medeiros, Laura Carvalho, Sérgio Gobetti, Rodrigo Orair, Grazielle David (Rede Justiça Fiscal), Guilherme Klein and Made/USP (excluded for now), IPEA/IPC-IG 2018 paper authors; columnists in Folha, Carta Capital, Brasil de Fato, Outras Palavras (no column found by search yet).
4. **Coalitions:** the full signatory list of "Tributar os Super-Ricos" (campaign site and IJF), the 2025-26 campaign "Taxar os super-ricos: justiça tributária começa no topo" and "Justiça Tributária Já!" (Vermelho, Brasil de Fato 2026-06-22), Plataforma Justa, Contag, CNBB/Cáritas (no statement found), Frente Parlamentar.
5. **Wealthy and business:** João Paulo Pacífico (Davos 2024) is in; look for other Brazilian signatories of "Proud to pay more" or "Millionaires for Humanity" lists. Opponents to skip: Flávio Rocha, João Doria.
6. **Polls:** the Oxfam/Datafolha series (84-85% for higher taxes on the very rich) asks about taxing the rich in general; read the releases to see whether any item names large fortunas.
7. **Regional and local:** sample the Assembleias of Rio Grande do Sul, São Paulo, Rio, Bahia and capital councils (Luciana Genro is a state deputy in RS); likely low yield, as the tax is federal.
8. **Map** once the IBGE licence is settled.
