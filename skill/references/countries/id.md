# Indonesia: repealed in 1985, revived in 2020–2026 civil-society and presidential debate

A ninth worked example, from a seed pass covering national institutions, presidential campaigns, think tanks, tax-justice coalitions, and economists, alongside a complete administrative register and map down to the regency and city tier.

## Levels and the geography register

| Level (`level`) | Units | Notes |
|---|---|---|
| national | DPR RI, DPD RI, Pemerintah Indonesia | The central government holds exclusive authority over direct income and capital/asset taxes. |
| region | 34 provinces (*provinsi*) | Two-digit BPS code (`ID11`–`ID94`). Provinces have no authority to levy net wealth taxes under Law No. 1/2022 (UU HKPD). |
| council | 514 regencies (*kabupaten*, 416) and cities (*kota*, 98) | The local map tier, with 4-digit BPS P-codes (`ID1101`–`ID9471`). Tax powers restricted to real estate (PBB-P2) and local services. |

**Map:** `data/id/boundaries.json` uses the official administrative boundaries from the UN OCHA Common Operational Datasets (COD-AB) for Indonesia (`data.humdata.org/dataset/cod-ab-idn`), sourced from Badan Pusat Statistik (BPS) and licensed under CC-BY-IGO-3.0.
- Eight non-administrative features representing national water bodies or conservation zones were filtered out using `--where "ADM2_PCODE!=ID1388,ID1688,ID1888,ID7188,ID1288,ID3399,ID3288,ID3388"`.
- The resulting boundary file contains exactly 514 local units (416 *kabupaten*, 98 *kota*) and 34 province region outlines, cleanly simplified with `topo_to_boundaries.py` and combined with `merge_boundaries.py`.

```bash
# GeoJSON sources from HDX cod-ab-idn (BPS / UN OCHA, CC-BY-IGO-3.0)
L="--project lonlat --scale 60 --licence CC-BY-IGO-3.0 --licence-url https://creativecommons.org/licenses/by/3.0/igo/"
python skill/scripts/topo_to_boundaries.py idn_admbnda_adm2_bps_20200401.json \
  --name-prop ADM2_EN --code-prop ADM2_PCODE \
  --where "ADM2_PCODE!=ID1388,ID1688,ID1888,ID7188,ID1288,ID3399,ID3288,ID3388" \
  --simplify 1.0 $L --code-scheme "BPS-PCODE" --source "Badan Pusat Statistik (BPS) via UN OCHA COD-AB" --out local.json

python skill/scripts/topo_to_boundaries.py idn_admbnda_adm1_bps_20200401.json \
  --name-prop ADM1_EN --code-prop ADM1_PCODE \
  --simplify 1.5 $L --code-scheme "BPS-PCODE" --out reg.json

python skill/scripts/merge_boundaries.py local.json --regions reg.json --out data/id/boundaries.json
```

## What worked and what to watch

- **The historical precedent is explicit:** Unlike many countries where a wealth tax is purely theoretical, Indonesia had an active statutory net wealth tax: the colonial *Ordonansi Pajak Kekayaan 1932*, updated post-independence as Law No. 24 of 1964 (*Undang-Undang Pajak Kekayaan 1964*). It was abolished in the 1985 tax reform (Law No. 12/1985 on PBB), which makes the current campaign a call for restoration in modern form.
- **Two research institutes drive the empirical debate:**
  - **The PRAKARSA:** Published Policy Briefs 35 (November 2022, 1–2% progressive wealth tax over IDR 140 billion), 36 (January 2023, integrating zakat with wealth tax), and 42 (October 2023, addressing asymmetric tax distribution across ASEAN).
  - **CELIOS (Center of Economic and Law Studies):** Authored major inequality reports, notably *"Dengan Hormat, Pejabat Negara: Jangan Menarik Pajak Seperti Berburu di Kebun Binatang"* (August 2025), proposing an annual 2% wealth tax on the top 50 richest individuals (generating IDR 81.56 trillion) and an expanded levy on 22,000 HNWIs.
- **Coalition landscape:** The **Forum Pajak Berkeadilan Indonesia (FPBI)** is the primary civil-society tax justice umbrella, comprising The PRAKARSA, Publish What You Pay (PWYP) Indonesia, PUSKAHA FH UGM, Transparency International Indonesia (TII), Seknas FITRA, Lokataru, IGJ, Trend Asia, and Aksi!.
- **2024 Presidential Candidates:**
  - **Ganjar Pranowo (PDI-P):** Pledged to evaluate wealth taxes on the super-rich to boost fiscal space and support social welfare.
  - **Anies Baswedan & Muhaimin Iskandar (Koalisi Perubahan):** Campaigned for progressive taxation on extreme wealth (*pajak kekayaan orang super kaya*), supported by economic directors Thomas Lembong and Handi Risza.
- **Student and labour movement:** The progressive student union **Liga Mahasiswa Nasional untuk Demokrasi (LMND)** launched national campaigns demanding a 1–3% progressive net wealth tax on conglomerates with assets above IDR 150 billion.
- **Quote checking & web fetching:**
  - Landing pages on `theprakarsa.org` and news reports on `nasional.kontan.co.id` contain complete verbatim summaries and quotes. When citing policy briefs, verify whether `quote_original` matches the HTML landing page text or the inner PDF download text. All 43 evidence rows verify verbatim with `wtdb.py checkquotes`.
- **Search terms:** Focus on `pajak kekayaan`, `pajak orang kaya`, `pajak atas aset bersih`, and `HNWI`. Exclude real estate taxes (`pajak bumi dan bangunan` / PBB), luxury sales taxes (`PPnBM`), voluntary tax amnesties (`tax amnesty` / `Program Pengungkapan Sukarela`), and standard income tax hikes (`PPh`) unless explicitly structured as an asset levy.
- **Sub-national taxing constraints:** Law No. 1 of 2022 (UU HKPD) strictly reserves asset and income taxation to the central government. Regional and local councils cannot legislate local wealth taxes; advocacy in provinces and regencies targets national policy.
