# R002 organisation research ledger — 2026-10-23

Researcher: Codex organisation worker. Output: `staging_nl_orgs.jsonl`, nine actor/evidence pairs, all `verified=n`. Eight grade A, one grade B. Eight national organisations and one regional union branch.

All nine source URLs in staging were opened, and the quoted text was read in the originals (web page text or PDF extraction). Quotes range from 5 to 20 words. Formal policy adoption supports A for adopted manifestos even where the design is unspecified. No generic party membership or petition signatures were imported.

## Scope decisions

- SP's own 1 May 2024 announcement is an explicit stock tax of 5% above EUR 5 million. It also identifies Jimmy Dijk's personal sponsorship; the coordinator was notified for deduplication with the politician lane.
- D66's adopted congress motion PM117.C12 is explicitly dated 13 May 2023 and marked `Aangenomen`. It asks the parliamentary group to develop a progressive stock tax as an alternative to the proposed annual gains tax in Box 3. It is therefore `partial_wealth`. Its illustrative 0.5-percentage-point steps to 2% and significant allowance are in the design detail, not claimed as enacted law. The 2025 manifesto independently repeats a millionaires' tax (printed page 89), but no extra evidence row was staged to avoid redundant seed records.
- BIJ1's 2025 final manifesto calls for a wealth cap with a 100% marginal rate above a democratically decided limit. This meets the workflow's explicit wealth-cap inclusion rule. Its separate corporate exit tax was not treated as a personal wealth tax.
- PvdD's 2023 manifesto, printed page 58, has a stock-tax rate schedule. Do not mix its inheritance or income-tax proposals into this evidence.
- GroenLinks-PvdA is recorded once as the joint alliance, using its 2025 final manifesto (printed page 183), rather than automatically duplicating the joint policy across every constituent party or member. A stand-alone GroenLinks 2022 page was found but blocked on opening and is not used.
- FNV evidence is from the official northern regional publication and is therefore attributed to FNV Noord, not treated as a national congress decision. It quotes named union official Stijn Duursma endorsing Zucman's 2% stock tax applied to Quote-500 fortunes. The coordinator was notified of the individual lead. A national FNV 2024 tax-policy PDF was found but failed to open; references to `vermogensbelasting` in search text mostly concerned income on assets and should not be imported without checking.
- Tax Justice NL's own 15 September 2026 editorial recommends 2–5% on wealth of the richest 1% of Dutch households. This is distinct from the same editorial's recommendations on realised income.
- Oxfam Novib's 2025 petition brief calls for a permanent wealth tax starting at 2% above EUR 2.3 million. Only the organisation is staged; no private signers are recorded. Date precision is the edition year in the official document filename; no individual signature date is assumed.
- Volt's own 9 March 2021 statement explicitly names a higher wealth tax for millionaires, graded B. Its current undated policy page goes further and specifies a progressive wealth tax above EUR 1 million, but that undated passage was not staged. The dated statement is authored by candidate Martin Gravelotte; the coordinator can follow this individual lead after an alive check.

## Search and access

Agent-reach Exa command was attempted once and failed with network EACCES. Switched promptly to the available web search tool. About 22 Dutch web queries covered party, union, NGO and coalition layers. Eleven distinct original documents/pages opened successfully, including corroborating D66 sources; four original URL variants failed (two GroenLinks variants, a PvdA-hosted copy of the 2023 joint manifesto, and the national FNV 2024 policy PDF). These are access failures, not absent support.

## Next highest-yield organisation work

1. Recover national FNV 2024 tax policy and find an explicit broad stock tax before upgrading from regional-branch evidence to national organisational policy.
2. Original 2023/2025 programmes and adopted motions for DENK, ChristenUnie, 50PLUS and other parties; do not import third-party voting-guide answers or an opponent's claim about PVV/BBB without opening the underlying party response.
3. Stand-alone GroenLinks and PvdA evidence before their joint alliance, plus DWARS and Jonge Socialisten adopted wealth-tax motions. A 2025 amendment bundle contains an amendment submitted on behalf of both youth boards; check the adopted outcome and precise wealth-tax scope before adding.
4. Broader Tax Justice network membership is a lead list, not proof that every member supports its wealth-tax design.

Schema, deduplication, automated quotation checks and the site build are left to the coordinator after import.

## Manual PDF recheck after merged quotation check

On 2026-10-23 the coordinator reported 28 found / 0 misses / 5 skipped for the merged 33 evidence rows. Four skips belong to this organisation lane. I reopened all four original PDF URLs through the web reader, reread each exact CSV quote and its surrounding policy text, and found all four. PDF line wraps are normalised to spaces; no wording is paraphrased in the original-language quote.

| Evidence | Original document location | Result and meaning |
|---|---|---|
| E00058 — BIJ1 | PDF page 23 (zero-based page 22), manifesto point 41, extraction lines 1021–1029 | Found exact quote. Explicit 100% marginal wealth cap, threshold to be democratically decided; frequency remains unspecified. |
| E00059 — Partij voor de Dieren | PDF/printed page 58 (zero-based page 57), extraction lines 3247–3253 | Found exact quote. Progressive wealth-stock levy from 1% up to EUR 500,000, rising to 5% above EUR 5 million; separate provision increases the allowance. |
| E00060 — GroenLinks-PvdA | PDF/printed page 183 (zero-based page 182), paragraph “Progressieve belastingen”, extraction lines 5234–5240 | Found exact quote, including the opening “We” at the preceding line end. Party alliance's own promise to introduce a millionaires' tax; rate remains unspecified. |
| E00063 — Oxfam Novib | Single-page PDF page 1 (zero-based page 0), item 1 under “Concreet stelt Oxfam Novib voor”, extraction lines 12–15 | Found exact quote. Explicit permanent progressive wealth-stock tax starting at 2% above EUR 2.3 million. |

These are not quote misses. `Get-Command pdftotext` returned no executable in this environment; the helper requires that executable to extract a PDF and returns no text when it is absent. All four original URLs were accessible in the web PDF reader for this manual recheck. This establishes a missing local extraction dependency, rather than treating the skipped result itself as evidence that the publishers blocked access. PDF screenshot requests additionally succeeded for BIJ1 and GroenLinks-PvdA; the PvdD and Oxfam screenshot service returned cache misses, while their original PDF text remained readable. The CSV `verified` fields stay `n` because this is an author recheck, not independent verification.


Integration note: staging identifiers refer to research lanes; CSV actor/evidence IDs were remapped when combined with the existing Netherlands pull request. All new rows belong to R002. Original seed R001 rows were retained, not newly verified.
