# Netherlands: no wealth tax, a box 3 fight, and a motion archive that lists every signatory

Support sits with SP, GroenLinks-PvdA, PvdD, Volt, DENK, BIJ1 and D66 on the "miljonairsbelasting", plus Oxfam Novib and a few public wealthy signers. "Vermogensbelasting" usually means box 3 (a deemed-return tax on savings); read each text before counting it.

- **Best source:** Tweede Kamer open data, `https://gegevensmagazijn.tweedekamer.nl/OData/v4/2.0/Document` filtered on `contains(Onderwerp,'miljonairsbelasting')` and similar, expanded with `DocumentActor` (signatories), `Zaak/Besluit/Stemming` (votes per fractie only). The text is at `Document(<Id>)/resource`.
- **Map:** CBS/PDOK `api.pdok.nl/cbs/gebiedsindelingen/ogc/v1/collections/gemeente_gegeneraliseerd/items?f=json&jaarcode=2026` (CC BY 4.0); province outlines from `provincie_gegeneraliseerd`; municipality to province by label point in polygon (`gemeente_labelpoint`).
- **Blocked:** the Groningen party-programme archive (dnpprepo.ub.rug.nl), taxence.nl.
