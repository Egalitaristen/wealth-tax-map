# Malaysia: wealth tax debate, sources and layers

Notes from seed and expansion passes (R001 & R002, October 2026). Check that URLs still resolve before relying on them.

## Levels and the geography register

| Level (`level`) | Units | Notes |
|---|---|---|
| national | Parliament of Malaysia (Dewan Rakyat, Dewan Negara), Government of Malaysia | Direct and indirect taxation is exclusively a federal power under the Ninth Schedule of the Federal Constitution |
| region | 13 States and 3 Federal Territories | Codes: OCHA/DOSM P-codes (`MY01` to `MY17`), parent `G0001` |
| local | 144 administrative districts (*daerah*) | The map tier. Codes: official DOSM / OCHA P-codes (`MY0101` to `MY1709`), parented to their respective states |

**Map:** `data/my/boundaries.json` is generated from the Department of Statistics Malaysia (DOSM) boundaries republished under **CC BY-IGO** by OCHA via the Common Operational Datasets on HDX (`data.humdata.org/dataset/cod-ab-mys`). Districts carry official DOSM P-codes; states carry region codes. Converted with `topo_to_boundaries.py` and merged with `merge_boundaries.py`.

## What worked and what to watch

- **Parliamentary debates (Dewan Rakyat & Dewan Negara):** The Parliament of Malaysia publishes official Hansard PDFs (*Penyata Rasmi*) on `parlimen.gov.my`. Budget debates on the annual Supply Bill (*Rang Undang-Undang Pembekalan*) provide formal parliamentary speeches:
  - Syed Saddiq Syed Abdul Rahman (MUDA MP for Muar, DR 16.12.2020 p. 32) explicitly challenged the government to introduce a wealth tax, inheritance tax, and capital gains tax on extraordinary wealth.
  - Tan Sri Shahrir Abdul Samad (veteran UMNO MP for Johor Bahru and BNBBC Chairman, DR 16.10.2014 pp. 29–30) proposed an annual 2.5% wealth tax on stored assets, drawing on Islamic zakat harta and European wealth taxes in Norway and the Netherlands.
  - Datuk Mohd Hisamudin Yahaya (UMNO Senator, DN 30.11.2023 pp. 34–35) proposed a global millionaire wealth tax in Dewan Negara to generate RM1 billion annually.
  - Ahmad Saad Yahaya (PAS MP for Pokok Sena, DR 16.10.2025 p. 83) proposed an explicit 2.5% wealth tax on the ultra-rich based on zakat principles and Argentina's emergency wealth tax.
  - Hassan Abdul Karim (PKR MP for Pasir Gudang, DR 28.10.2025) argued for a wealth tax on multimillionaires and billionaires above US$1m.
  - Mohd Khairuddin Aman Razali (PAS MP for Kuala Nerus, DR 16.10.2019 p. 98) proposed a 2.5% wealth tax on stock holdings and corporate reserves.
- **Parties:**
  - Parti Islam Se-Malaysia (PAS): Formally adopted an economic resolution at its 71st Muktamar Tahunan (Sept 2025) demanding an explicit wealth tax (*cukai kekayaan*) on luxury assets and high-value wealth.
  - Parti Sosialis Malaysia (PSM): Dedicated wealth-tax party adopting wealth taxation at its 28th National Congress (August 2026), alternative economic budgets (July 2020), official statements by central committee member Gandipan Nantha Gopalan (June 2025), and health campaign op-eds by Dr. Cecilia Anthonysamy (April 2026).
- **Think tanks and academics:**
  - Bait Al-Amanah: Published the comprehensive policy study *Saranan Cukai Kekayaan* (2018/2019) modeling a 0.5%–1.75% (or 1.0%–3.5%) progressive wealth tax on net assets exceeding RM10 million, based on Spain's *Impuesto sobre el Patrimonio*.
  - Research for Social Advancement (REFSA): Published policy analysis defending high-exemption wealth taxes against growth and innovation critiques.
  - Senior economists: Tan Sri Ramon Navaratnam (former Deputy Secretary-General of the Treasury) and Dr. Jomo Kwame Sundaram (Khazanah Research Institute, former UN Assistant Secretary-General) have both championed wealth taxes as necessary instruments to redress excessive inequality.
  - Civil society analysts: Anil Netto (Aliran, chartered accountant) and Dr. Kua Kia Soong (former Petaling Jaya MP, sociologist, SUARAM co-founder) have published extensive blueprints in Aliran (2%–3% net wealth tax, graduated 1%–1.5% tax on fortunes > RM100m/RM500m).
- **Exclusions:**
  - Watch for *cukai harta pusaka* / *cukai pewarisan* (inheritance tax / estate duty), which was abolished in Malaysia in 1991 and is often proposed by consumer groups like CAP or economists like Dr. Muhammed Abdul Khalid. Estate duty is excluded under the core definition.
  - Watch for *cukai durian runtuh* (windfall profit levy) and capital gains tax on unlisted shares, which are corporate or transactional taxes and excluded on their own.
  - Opponents documented: Wee Ka Siong (MCA, DR 22.10.2018), Mohd Afzanizam Abdul Rashid (Bank Muamalat, May 2026), William Ng (SAMENTA, May 2026), Geoffrey Williams (July 2024), Yeah Kim Leng (Sunway University), Lim Guan Eng (Finance Minister 2018–2020), Anwar Ibrahim (Prime Minister & Finance Minister 2022–present), and Johan Mahmood Merican (Treasury Secretary-General).
