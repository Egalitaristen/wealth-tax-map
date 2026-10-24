# Nigeria: no federal wealth or inheritance tax since 1996; support led by tax-justice coalitions, unions, economists and Lagos tax conferences

Worked notes from the Nigeria seed pass (`R001`) and wide sweep (`R002`, 2026-10-22; 95 supporters, 108 evidence rows before the 2026-10-24 review, which removed land, property and luxury-tax rows and "tax the rich" statements and left 39 supporters, 40 rows). Check every URL still works before relying on it.

## Levels and the geography register

| Level (`level`) | Units | Notes |
|---|---|---|
| national | House of Representatives, Senate, Federal Government of Nigeria | The 1999 Constitution places company income, stamp duties and capital gains under federal legislation while personal income tax and state land charges are collected by state internal revenue services |
| region | 36 states and the Federal Capital Territory (FCT) | Official OSGOF / OCHA COD-AB P-codes (`NG001`–`NG037`) in `code`. 15 states/FCT swept (`Adamawa`, `Anambra`, `Borno`, `Delta`, `Edo`, `Enugu`, `FCT`, `Kaduna`, `Kano`, `Lagos`, `Ogun`, `Ondo`, `Osun`, `Oyo`, `Rivers`) |
| council | 774 Local Government Areas (LGAs) | The map tier, with official OSGOF / OCHA COD-AB P-codes (`NG001001`–`NG037006`) in `code`. Under the Fourth Schedule of the 1999 Constitution, LGAs levy tenement rates and market fees and cannot enact a net wealth or inheritance tax |

**Map:** `data/ng/boundaries.json` uses the official administrative boundaries of Nigeria (Admin 1 states + FCT and Admin 2 Local Government Areas) from the Office of the Surveyor General of the Federation (OSGOF), eHealth Africa and the UN Cartographic Section (UNCS), distributed via the OCHA Common Operational Datasets on HDX (`https://data.humdata.org/dataset/cod-ab-nga`, package metadata at `https://data.humdata.org/api/3/action/package_show?id=cod-ab-nga`). Licence: `CC-BY-IGO-3.0` (`https://creativecommons.org/licenses/by/3.0/igo/legalcode`). Both `units` (774 LGAs) and `regions` (36 states + FCT) come from the same shapefile bundle (`nga_admbnda_adm2_osgof_20190417.shp` and `nga_admbnda_adm1_osgof_20190417.shp`), so region outlines fall cleanly on LGA borders. Built with:

```bash
python skill/scripts/topo_to_boundaries.py nga_adm2.geojson --code-prop ADM2_PCODE --name-prop ADM2_EN \
  --project lonlat --scale 80 --simplify 1.2 --licence CC-BY-IGO-3.0 \
  --licence-url https://creativecommons.org/licenses/by/3.0/igo/legalcode --code-scheme OSGOF-PCODE --out units.json
python skill/scripts/topo_to_boundaries.py nga_adm1.geojson --code-prop ADM1_PCODE --name-prop ADM1_EN \
  --project lonlat --scale 80 --simplify 1.2 --licence CC-BY-IGO-3.0 \
  --licence-url https://creativecommons.org/licenses/by/3.0/igo/legalcode --code-scheme OSGOF-PCODE --out regions.json
```

## What worked and what to watch

- **The October 2024 Oxfam / CISLAC / TJNA / CARE reports (`H0001`, `H0002`, `H0006`) and May 2017 Oxfam report (`H0009`) are the richest bulk lists.**
  1. *Income and Wealth Inequality in Nigeria: Trends and Drivers* (15 October 2024, policy brief PDF on `oi-files-cng-v2-prod.s3.eu-west-2.amazonaws.com`) names two lead authors (Henry Ushie at Oxfam in Nigeria and Chinedu Bassey at CISLAC / Tax Justice and Governance Platform), eight contributing authors, and foreword co-signers John Makina (Oxfam in Nigeria) and Dr Hussaini Abdu (CARE International in Nigeria). It proposes a 1% annual net wealth tax above $1 million (raising ~$7.5bn/year) or tiered rates of 2% above $5m, 3%–5% above $50m and 5%–10% above $1bn, plus a 0.02% stock levy and a Comprehensive Wealth Registry.
  2. *Taxing the Rich: Nigerian Fair Tax Monitor Thematic Report* (15 October 2024, PDF on `oi-files-cng-v2-prod.s3.eu-west-2.amazonaws.com`) by Mtwalo Msoni and Ishmael Zulu (Tax Justice Network Africa), edited with Martin Brehm Christensen (Oxfam Novib) and Henry Ushie, and co-published with CISLAC (led by Auwal Musa Rafsanjani) and Make Tax Fair, proposes a tiered annual Net Wealth Tax and reintroducing a federal inheritance tax above ₦50 million.
  3. *Inequality in Nigeria: Exploring the Drivers* (17 May 2017, direct PDF at `https://www-cdn.oxfam.org/s3fs-public/file_attachments/cr-inequality-in-nigeria-170517-en.pdf`; note that `oxfamilibrary.openrepository.com` now serves an Angular SPA shell without static text, so always use the `www-cdn.oxfam.org` PDF URL).
- **Politicians, former finance ministers, and Senate debates (`R002`):**
  - Former Vice President **Atiku Abubakar** (`A0071`) proposed a 15% luxury tax on private jets, luxury cars, jewellery, and first/business-class tickets of the super-wealthy (`vanguardngr.com`, Nov 2020).
  - Former Finance Ministers **Ngozi Okonjo-Iweala** (`A0077`, 10% import surcharge on private jets in the 2015 budget, `dailytrust.com`) and **Zainab Shamsuna Ahmed** (`A0076`, special luxury taxes on private jets and yachts, `thesun.ng`, Dec 2018), plus former Budget Office DG **Ben Akabueze** (`A0035`, 100% tax on private jets, `ripplesnigeria.com`, Nov 2022).
  - Senate screening and plenary speeches yielded **Rauf Aregbesola** (`A0072`, pledging to pioneer "privilege taxes" on wealthy Nigerians, `channelstv.com`), **Senator Adams Oshiomhole** (`A0073`, `vanguardngr.com`), **Senator Jimoh Ibrahim** (`A0074`, calling for the rich to pay more for their luxury assets, `punchng.com`), and **Senator Mohammed Ali Ndume** (`A0075`, `dailytrust.com`).
- **Academic, legal, and business voices on net wealth, inheritance, and property-wealth taxes (`R002`):**
  - Economist **Dr Nasir Aminu** (`A0054`, `saharareporters.com`, Jan 2022) and Senior Advocate of Nigeria **Ahmed Adeniyi Raji SAN** (`A0055`, `dailypost.ng`, Oct 2021) explicitly called for an annual net wealth tax in Nigeria.
  - C&I Leasing Chairman **Emeka Ndu** (`A0056`, `leadership.ng`, Dec 2024) and accounting scholars **Abdulganiyu Babayanju** and **Rasheed Olatunji Animasaun** (`A0057`–`A0058`, `ijnrd.org`, Apr 2024, `H0007`) called for reinstating Nigeria's repealed Capital Transfer Tax (inheritance tax).
  - **African Centre for Tax and Governance (ACTG)** (`A0059`–`A0063`, `logri.org`, Nov 2025, `H0008`), **African Cities Research Consortium** (`A0037`–`A0040`, `african-cities.org`, Dec 2025, `H0005`), **WAIFEM** (`A0064`–`A0065`, `leadership.ng`, Oct 2023), **BudgIT** (`A0091`, `budgit.org`, Oct 2025), and law/estate-management scholars **Dr Ngozi Asomadu**, **Prof. Meshach Nnama Umenweke** (`A0066`–`A0067`, `nigerianjournalsonline.org`), and **Wike Emmanuel Okanwene** (`A0068`, `journals.unizik.edu.ng`) advocated progressive property-wealth taxation on millionaires and elite landowners.
- **Deceased check caught four prominent union/socialist leaders:**
  - **Dr Peter Ozo-Eson** (former NLC Chief Economist & General Secretary, died 13 Dec 2025, `X0001`), **Segun Sango** (DSM General Secretary & former SPN National Chairperson, died 23 Jan 2024, `X0008`), **Ibrahim Khaleel** (NULGE National President, died 7 Oct 2020, `X0009`), and **Dr Dipo Fashina** (former ASUU President & JAF Chairperson, died May 2024, `X0010`).
- **Fetch & false-positive notes:**
  - `thecable.ng` and `saction.org` block scripted HTTP fetches with Cloudflare 403; `publicservices.international` is a client-side Nuxt SPA; `oxfamilibrary.openrepository.com` is an Angular SPA. Use direct PDFs or accessible Nigerian news mirrors (*Vanguard*, *The Punch*, *Daily Trust*, *Nigerian Tribune*, *Channels TV*, *Leadership*, *Daily Post*, *Sahara Reporters*, *Ripples Nigeria*).
  - Exclude the January 2026 *Independent Nigeria* op-ed by Dominic Joshua claiming the 2026 tax act introduced a "National Solidarity Wealth Tax" (no such provision exists in the Nigeria Tax Act 2025).
