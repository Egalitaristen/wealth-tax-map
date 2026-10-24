# R004 local and campaign follow-up

Ten candidate actor/evidence pairs staged in staging_r004_local.jsonl. Nine local actors and one national public campaign professional; no municipal institution is inferred to endorse a tax.

## Search and yield

Dutch queries sampled SP/local party sources in Amsterdam, Rotterdam, Utrecht, Groningen and The Hague, then followed specifically named campaign reports into Heerlen and Zutphen. Queries included miljonairsbelasting + city/afdeling/gemeenteraad/raadslid; wealth-cap/faith/culture terms were also sampled. Amsterdam programme and Utrecht/The Hague campaign reports justified targeted snowballing to other identified branches, not an exhaustive342-municipality crawl. Rotterdam returned no qualifying attributable new source; Groningen returned Jimmy Dijk (already in database) and an untranscribed2015video. No absent support is inferred.

Agent-reach Exa command attempted, failed EACCES/offline; tool web search plus direct original retrieval and agent-reach Jina reader fallback used. Access problems were changed within minutes, no crawler built.

## Originals and exact checks

- LOC1 SP Amsterdam: [2026–2030 programme](https://openresearch.amsterdam/image/2026/1/2/2026_gr_definitief_verkiezingsprogramma-231639407.pdf), PDF index19/printedp36. Direct original27.9MB PDF retrieved and extracted with pypdf; title page establishes2026edition. Explicit national millionaire-tax call, separate from OZB/property measures. A/manifesto; no rate. Not every candidate or committee member imported.
- LOC2–5: [Tribune March2015](https://cdn.sp.nl/2025/01/sptr032015webdef_0.pdf), printed/PDFp11. Old www.sp.nl URL403; originalpublisher CDN works. Original text directly identifies Jan de Wit collecting signatures, Riet de Wit helping, Dominique Ducornez organising a local millionaire-tax petition, and SP Heerlen operating it. B/campaign attribution. Names/brief roster quotations intentional; surrounding text unequivocally names the tax and purpose. Jan's former national office is historical; he acts here in Heerlen. No ordinary petitioner imported.
- LOC6–8: [Tribune March2016](https://cdn.sp.nl/2025/01/tribune_03_2016.pdf), pp6–7. Direct PDF retrieval and extraction. Explicit local SP campaigns in Utrecht and Den Haag on20February2016; existing R003 four national/local participants are not duplicated. Bottomp7photo caption personally names Miloš Todorović explaining contents before campaigning, with purpose establishedp6. He has a public SP communications role (2025official magazine masthead), so campaigner primary, national geography; the meeting venue is not treated as residence/constituency. GradeB; no implied party membership endorsement.
- LOC9: [Tribune October2015](https://cdn.sp.nl/2025/01/tribune_09_2015_0.pdf), p26. Direct original PDF extracted. Explicit formation of Heerlen local committee Haal het geld waar het zit to further develop millionaire taxation; B/campaign. Exact foundation date not established, so magazine month retained. Historical committee; present activity not established, no dissolution record found. Coordinator may omit if uncomfortable with sparse continuity evidence.
- LOC10: [SP Zutphen annual report2024/plan2025](https://web.archive.org/web/20250524062952id_/https://zutphen.sp.nl/sites/zutphen.sp.nl/files/jaarverslag_2024_en_jaarplan_2025_sp_zutphen.pdf), p2. Live original now404 (Jina confirmed). Wayback CDX found May24,2025 original snapshot; retrieved PDF and independently extracted. Report explicitly says June2024 campaign collected support for its own millionaire-tax plan. B/campaign, retrospective act monthJune2024; source edition2025. No personal endorsement inferred from foreword author Debbie van Dijk.

All staged quote strings confirmed in original PDF extraction (line-wrap whitespace normalisation); no quote from search snippets alone. Extraction caches local-*.txt retained under .cache, no source PDFs redistributed. All verified=n.

## Identity, public role and living checks

Jan/Riet de Wit: death queries included party/Heerlen qualifiers; irrelevant same-name obituaries excluded. [Official SP Heerlen2026candidate list](https://heerlen.sp.nl/nieuws/kandidatenlijst-gemeenteraadsverkiezingen-2026/) opened and explicitly lists Jan45/Riet46, independently supporting continued public identity. Jan is the former MP/advocate, Riet former Heerlen alderman, not Maastricht website coach. Dominique Ducornez has an original2015public councillor role; exactname obituary query found no death record (unrelated French physician/artist profiles not used). Miloš Todorović public identity corroborated by SP2025official Tribune masthead and current SP communications credits; exact-name/party obituary query no death record. alive_checked=y stored, not narrated in actor notes.

## Withheld / next leads

- Wypke Zuidweg (P21 Bunnik), own16June2021column [STOP de hondenbelasting](https://www.bunniksnieuws.nl/lokaal/column/689637/raadspraat-stop-de-hondenbelasting), directly opened. Its rhetorical EUR30per-millionaire substitute levy is not clearly a tax on wealth stock; withheld rather than interpreting it as recurring wealth tax.
- Dordrecht9April2024council draftminutes: search locates an explicit personal millionaire-tax remark, but original council PDF returns security denial and Jina challenge; no speaker attribution/full original recovered, withheld. URL https://raad.dordrecht.nl/Documenten/2-1-2024-04-09-Notulen-Gemeenteraad-Dordrecht-concept-2.pdf
- StopCorruptie/DeCollectieveBeweging current campaign explicitly advocates EUR10mwealthcap but page is undated;2026copyright alone not sufficient actdate, withheld pending dated campaign source. https://stopcorruptie.nl/
- Myrthe Hilkens, Peter Mertens and musician Calien Eurlings appear at a2015Heerlen discussion; speaking slot/performance alone does not prove personally supportive words, withheld. Same October2015Tribune source.
- No ordinary residents, petition signers, private socialmedia users, photographers or straight-news authors imported. No copied national platform merely mirrored on branch sites counted as a separate branch endorsement.

Geography: AmsterdamG0035 Noord-Holland; HeerlenG0141 Limburg; UtrechtG0300 Utrecht; DenHaagG0018 Zuid-Holland; ZutphenG0356 Gelderland. Explicit locality sources in each evidence, not guessed residence. Units remain in_progress rather than marked exhaustively done.
