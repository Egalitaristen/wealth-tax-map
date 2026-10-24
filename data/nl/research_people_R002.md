# Netherlands people source ledger â€” R002, 2026-10-23

Research used Dutch and English queries. Agent Reach's Exa backend was attempted but network access failed; web search and original-source opening were used, with the Agent Reach public Jina reader for blocked ESB/Fiscaal Vanmorgen pages.

## Included sources

- Proud to Pay More: both https://proudtopaymore.org/ and https://proudtopaymore.org/signatures opened in full. Letter calls for taxation of extreme wealth, not merely income or donations. Five names were selected from the seven NL names because their public roles were established separately. Date 2024-01-17 is the public letter release date; individual signing timestamps are unavailable. https://www.fiscaalvanmorgen.nl/2024/01/17/miljonairs-vragen-opnieuw-om-meer-belasting/ was retrieved through Jina and its article paragraph checked directly. It identifies Bregman (author), Groenen (wealth manager), Veugen (internet entrepreneur), Kaag (IT entrepreneur). Erik de Bruijn's public co-founder role is established by the opened Tilburg University article https://www.tilburguniversity.edu/nl/magazine/3d-printers-schieten-te-hulp-tijdens-coronacrisis. Founder role for Kaag independently opened at https://www.founderspledge.com/members/1398.
- Ingrid Robeyns: opened https://www.uu.nl/in-de-media/wat-is-het-limitarisme-hoogleraar-ingrid-robeyns-legt-het-uit. It reproduces her 2023-12-01 Volkskrant interview and specifies a EUR 10 million political wealth cap for the Netherlands. Evidence is a wealth cap under the project's explicit inclusion rule; it should not be described as a specified tax rate or as an inheritance-tax proposal. Source page itself published 2023-12-06.
- Reinier Kooiman: opened the complete NPO Radio 1 / EO interview report, 2025-04-18. 8.5% levy covers money, home, car and pension and replaces all other taxes. Newer 2026 VPRO material was also opened; not needed as a duplicate evidence row.
- Hans Stegeman: opened the October 2021 Idee original PDF, page 46 (zero-based PDF page 2). His own interview explicitly proposes more wealth taxation to finance climate policy. Rate/base unspecified, grade B. Do not attribute Pepijn Vloemans's separate interview in the same document to Stegeman.
- Ron Stoop and Jasper Lukkezen: original coauthored ESB article, 2023-04-20. Direct ESB fetching returned 403; full original article text retrieved through https://r.jina.ai/https://esb.nu/inleiding-vermogensbelasting-zonder-compromis/. Original search extraction identifies both authors; original PDF search extraction identifies the same bylines. Article argues wealth taxation is necessary to limit long-term wealth concentration, distinct from addressing avoidance structures. Each quoted fragment is 11 words; total across the two rows remains below 25.
- Gabriel Zucman: opened full 2026-02-13 FTM interview at https://www.ftm.nl/artikelen/interview-econoom-gabriel-zucman-vermogensbelasting. Direct Netherlands advocacy at lines around 100â€“108 of extraction, explicit support for the Netherlands introducing the 2%-of-wealth minimum, potential lower Dutch threshold of 15 million, and continued liability after emigration. The international-actor inclusion rule applies because the interview is expressly about Dutch implementation, after a Tweede Kamer visit. No Dutch nationality implied.

Death-record searches were run for every included person. Unrelated same-name records were not attached to living public figures. Rows remain verified=n for independent review.

## Queued and excluded leads

- Eduard de Jong and Peter Leest: present in the public campaign signature list but not imported because public roles and unambiguous identities could not be established in this pass. Treat as queued identity research, not as proved private individuals or proved deceased.
- Bas Jacobs: substantial recent advocacy concerns ordinary Box 3 returns and broad annual accrual taxation rather than a special ultra-wealthy design. No row imported from those sources; his views on actual wealth taxation need a separate, carefully scoped source check. His criticism of Kooiman's 8% proposal is not itself support.
- Sander Schimmelpenninck: leads predominantly concerned capital gains, inheritances or ambiguous use of Dutch 'vermogensbelasting'. No row imported; find direct stock-of-wealth advocacy before including.
- Wiemer Salverda and Irene van Staveren: searched; no sufficiently explicit personally attributable qualifying original was established in this pass. Wealth-inequality research alone does not establish advocacy.
- Arnoud Boot: promising BNR lead 'noem het gewoon vermogensbelasting', 2024-12-07, but detailed scope and exact original statement remain to be checked. Not imported from the video description alone.

## Independent organisation spot-check

The people researcher independently opened the organisation researcher's first two source rows, without editing shared data or setting verified=y:

- ORG_E001 / Socialistische Partij: source date 1 May 2024 confirmed. The exact stored quote is in the source, and context confirms a 5% tax directly on wealth above EUR 5 million. Grade A campaign evidence is justified. The article identifies Jimmy Dijk as the proposer, but this check does not import him independently.
- ORG_E002 / D66: source explicitly records adoption of motion PM117.C12 and the 13 May 2023 congress. Stored quote found verbatim. The operative paragraphs ask for a progressive stock tax as an alternative to annual gains taxation, with illustrative 0.5-percentage-point steps up to 2%, a significant tax-free allowance, and addressing avoidance through Box 2. Grade A formal adoption / partial_wealth is justified. The record is congress policy; it is not a parliamentary vote or enacted tax.

Public-letter scope proof: the opened campaign letter distinguishes government action from one-off donations or philanthropy and requests taxation on extreme private wealth. The signatures page lists each included name as a signatory. The public 17 January 2024 Fiscaal Vanmorgen report supplies both the release date and named roles for four imported signers; NOS independently identifies Rutger Bregman as a writer and signer on the same date. Erik de Bruijn's role comes from Tilburg University. Eduard de Jong and Peter Leest remain omitted rather than assumed public from names alone.

This is a seed pass, not saturation of the economists, commentator or wealthy-supporter layers.


Integration note: staging identifiers refer to research lanes; CSV actor/evidence IDs were remapped when combined with the existing Netherlands pull request. All new rows belong to R002. Original seed R001 rows were retained, not newly verified.

Manual PDF follow-up (coordinator, 2026-10-23): E00072 Hans Stegeman exact quote found in original Idee October 2021 PDF, printed p46 (index 2). His name and Triodos economist role appear in the same spread. The interview explicitly contrasts middle-income climate levies with wealth taxation to reduce wealth inequality; no particular base/rate is specified, so B remains appropriate. Automated PDF skip reflected missing pdftotext, not an absent quote.
