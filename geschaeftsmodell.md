# Geld verdienen mit Eventlas — Plan (Stand 11.09.2026, überarbeitet auf „maximal Geld, minimal Aufwand")

Diese Datei gehört zu `roadmap.md` (Projektgedächtnis) und `todos.md` (was nur du tun kannst).
Ziel dieser Fassung: **so viel Ertrag wie möglich pro Stunde deiner Zeit, und zwar aus Dingen,
die ohne dich weiterlaufen.** Alles, was Klinkenputzen bedeutet, ist rausgeflogen.

---

## Die Arithmetik, die alles entscheidet

Werbung auf deutschsprachigem Lokal-Inhalt bringt grob **2–5 € pro 1.000 Seitenaufrufe**.
Daraus folgt:

| Was du verdienen willst | Dafür nötige Seitenaufrufe pro Monat |
|---|---|
| 200 € | ~60.000 |
| 1.000 € | ~300.000 |
| 5.000 € | ~1.300.000 |
| 20.000 € („reich") | ~5.000.000 — das ist eine Top-500-Website in Deutschland |

Aachen hat 250.000 Einwohner. Ein **großer** lokaler Erfolg wären 30.000–50.000 Aufrufe im
Monat — also rund **150 €**. Das ist keine Meinung, das ist Multiplikation.

**Schlussfolgerung: Eine Stadt kann dich nicht reich machen — egal wie gut die Karte wird.**
Es gibt genau drei Stellschrauben, und der Plan besteht nur noch aus ihnen:

1. **Mehr Besucher, ohne sie selbst herbeizutragen** → Suchmaschinen (heute: null)
2. **Mehr Umsatz pro Besucher** → Tourismus-Affiliate statt Bannerwerbung (4× besser)
3. **Mehr Städte durch dieselbe Maschine** → Aufwand bleibt gleich, Ertrag wächst

Und einmalig, weil es unschlagbar bezahlt ist: **Fördergeld** — 2.000 € für vier Stunden
Formular, 14.400 € für einen Pitch. Das sind die einzigen sicheren vierstelligen Beträge im
ganzen Plan.

---

## Der Flaschenhals: Google sieht Eventlas überhaupt nicht

Gemessen am 11.09.2026 an der Live-Seite:

| Prüfung | Ergebnis |
|---|---|
| schema.org-/JSON-LD-Auszeichnung im HTML | **0 Treffer** |
| `sitemap.xml` | **404** |
| `robots.txt` | **404** |
| Einzelseiten für Events, Spielstätten, Stadt | **keine** — eine einzige URL |
| Wie kommen die Pins in die Seite? | erst nach dem Laden per JavaScript aus `pins.json` |

Für Google ist Eventlas damit **eine leere Seite mit einer Karte darauf.** Es gibt nichts zu
indexieren, also gibt es keinen organischen Besucher — heute nicht und in zehn Jahren nicht.

Genau das ist der Grund, warum der erste Plan so viel Handarbeit enthielt: Ohne Suchmaschinen
musst du **jeden einzelnen Besucher selbst herbeitragen** — Flyer, Insta-DMs, nebenan-Posts,
Standdienst. Das ist die teuerste Art, Reichweite zu kaufen, und sie hört sofort auf, wenn du
aufhörst.

**Das Gute:** Die Daten sind längst da — 143 Pins, 36 Spielstätten, Öffnungszeiten,
Barrierefreiheit, Anfahrt, Ortsfotos, Beschreibungen, Koordinaten, Quellen. Es fehlt nur die
**Ausgabe als Seiten**. Das ist ein Build-Schritt, keine neue Datenarbeit.

---

## Hebel 1 — Geld, für das man nur ein Formular ausfüllt

Bleibt unverändert im Plan, weil es dein Kriterium besser erfüllt als alles andere:

| Was | Betrag | Dein Aufwand | Rendite |
|---|---|---|---|
| **Heimat-Scheck NRW** | 2.000 € | ~4 h Formular | **~500 €/Stunde** |
| **Gründungsstipendium.NRW** | 14.400 € (12 × 1.200 €) | Pitch + Papiere, ~20 h | **~700 €/Stunde** |

Der Heimat-Scheck ist pauschal, online zu beantragen, auch für Privatpersonen, **Frist
31.10.2026**. Das Geld ist für Projektausgaben (Druck, Material, eine Aktion im Viertel),
nicht für deine Arbeitszeit.

Das Stipendium ist der **größte Einzelbetrag im gesamten Plan** — mehr als die passiven Hebel
2–4 in drei Jahren zusammen einbringen. Jurysitzungen pausieren seit 01.04.2026 „vorerst",
Anträge werden aber weiter bearbeitet und bewilligt. Bedingung ist, dass du das Vorhaben
hauptberuflich verfolgst.

→ Wenn du aus diesem Plan nur **eine** Sache machst, dann diese beiden Anträge.

---

## Hebel 2 — Die Maschine sichtbar machen (einmal bauen, dann nie wieder anfassen)

Der Umbau, der aus Eventlas eine Seite macht, die Google lesen kann. Dieselben Daten, andere
Ausgabe. Was `bauen.sh` künftig zusätzlich erzeugt:

| Seitentyp | Beispiel | Wonach Leute suchen |
|---|---|---|
| Eine Seite pro Termin | `/event/alleenfest-2026` | „Alleenfest Aachen 2026" |
| Eine Seite pro Spielstätte | `/ort/musikbunker` | „Musikbunker Aachen Programm" |
| Tagesseite je Stadt | `/aachen/heute` | „was ist heute los in Aachen" |
| Themenseite je Stadt | `/aachen/floehmarkt` | „Flohmarkt Aachen" |
| Wochenendseite | `/aachen/wochenende` | „Aachen Wochenende Veranstaltungen" |

Dazu drei Dinge, die heute komplett fehlen:

- **schema.org/Event-Auszeichnung** auf jeder Terminseite → Google zeigt Termine als
  Event-Ergebnis mit Datum und Ort an, nicht als blauen Link. Das ist der eigentliche Grund,
  warum Veranstaltungsseiten Traffic bekommen.
- **`sitemap.xml`** — wird beim Build aus `pins.json` erzeugt, damit Google alle Seiten findet
- **Eigene Domain.** `netlify.app` ist eine geteilte Subdomain und für Suchmaschinen wertlos.
  `eventlas.de` antwortet aktuell nicht, ist also vermutlich noch frei.

Die Karte bleibt, wie sie ist — sie wird nur der Einstieg statt der einzige Inhalt.

**Aufwand:** 2–3 Tage, davon mache ich das meiste. Du musst die Domain registrieren und
einmal nach `main` pushen. **Danach kommt der Traffic ohne dich.**

⚠️ **Ehrlich zur Geschwindigkeit:** Eine neue Domain braucht in einem lokalen Wettbewerbsfeld
**6–18 Monate**, bis sie nennenswert rankt. Der Hebel ist groß, aber er ist nicht schnell.

---

## Hebel 3 — Mehr Umsatz pro Besucher, ohne mehr Besucher

Die Wahl des Partnerprogramms verändert den Ertrag um den Faktor 4, bei identischem Aufwand:

| Programm | Provision | Bei 40 € Warenkorb | Passt zu |
|---|---|---|---|
| Eventim (Tickets) | 20 % der Vorverkaufsgebühr ≈ 2 % vom Ticket | **~0,70 €** | Konzerte |
| **GetYourGuide (Touren/Attraktionen)** | **bis 7 %** | **~2,80 €** | Dom, Thermen, Führungen, Weihnachtsmarkt |
| Booking/Hotels | ~4 % der Buchung | 2–6 € je Nacht | Städtereisende |

Aachen ist eine **Touristenstadt**: UNESCO-Dom, Weihnachtsmarkt mit internationalem Publikum,
Carolus Thermen, Dreiländereck, CHIO. Touristen kaufen; Einheimische informieren sich nur.
Das ist der Grund, warum Tourismus-Affiliate hier besser passt als Ticketprovision.

**Display-Werbung** (AdSense & Co.) lohnt sich erst ab grob 30.000 Aufrufen/Monat — vorher
bringt sie einstellige Beträge und kostet Ladezeit, Datenschutz-Sauberkeit und den Ruf. Also
später, nicht jetzt.

**Aufwand:** ein Nachmittag (Anmeldung, Links automatisch aus vorhandenen Ortsdaten erzeugen).
Danach null.

---

## Hebel 4 — Städte vervielfachen

Erst sinnvoll, **wenn Hebel 2 in Aachen nachweislich funktioniert.** Dann aber der einzige
Hebel mit echtem Multiplikator:

- Die Architektur ist schon stadt-unabhängig (`STAEDTE`-Eintrag + `pins-<stadt>.json`)
- `quellen-handbuch.md` wurde genau dafür geschrieben — Prüfraster für neue Quellen
- Viele NRW-Städte haben denselben Kulturkalender-Typ und dieselben WordPress-Kalender wie
  Aachen; die Parser existieren bereits

**Aufwand je Stadt:** ~1 Tag Quellenrecherche und Konfiguration, danach läuft sie im selben
nächtlichen Lauf mit. Kein Verkaufsgespräch, kein Kunde, keine Rechnung — reines Hinzufügen.

---

## Was das realistisch bringt

Angenommen: Hebel 1 sofort, Hebel 2 im Herbst, Hebel 3 danach, Hebel 4 ab Mitte 2027.
Durchschnittlich 3.000 Seitenaufrufe pro Stadt und Monat nach 12–18 Monaten SEO (konservativ).

| | bis Ende 2026 | 2027 | 2028 |
|---|---|---|---|
| Städte | 1 | 8–15 | 25–40 |
| Seitenaufrufe/Monat | ~2.000 | ~25.000 | ~100.000 |
| Affiliate | ~20 € gesamt | 60–200 €/Monat | 250–800 €/Monat |
| Display-Werbung | 0 € | 0–70 €/Monat | 200–400 €/Monat |
| **Passiv pro Monat** | ~5 € | **60–270 €** | **450–1.200 €** |
| Fördergeld (einmalig) | 2.000 € | 0–14.400 € | — |

**Die ehrliche Summe:** Nach zwei bis drei Jahren ein passives Einkommen von grob
**500–1.200 € im Monat**, bei dann tatsächlich fast null laufendem Aufwand. Dazu einmalig
2.000–16.400 € Fördergeld, das du in den nächsten sechs Wochen beantragen kannst.

Das ist ein sehr gutes Nebeneinkommen für eine Maschine, die von allein läuft. **Reich wird
man davon nicht** — dafür müssten die Seitenaufrufe fünfzig- bis hundertmal höher liegen, und
dahin kommt man nur mit einer Redaktion, einem Werbebudget oder Jahren Vollzeit.

Wenn du das nicht willst (und nach deiner Ansage willst du es nicht), dann ist das hier die
beste verfügbare Version: **maximaler Ertrag pro Stunde, Obergrenze inklusive.**

---

## Was dafür gestrichen ist

Aus der ersten Fassung fliegt alles raus, was deine Zeit gegen Geld tauscht statt sie zu
vervielfachen:

- ~~Läden abklappern und Einträge verkaufen~~ — 60 Stunden für 500 €/Monat
- ~~Auftragskarten für Feste aktiv verkaufen~~ — gute Stundensätze, aber jede Karte kostet dich
  wieder Tage. Bleibt als **Option auf Zuruf**: Wenn jemand von allein fragt, nimm 600–2.500 €
  (Preisliste im Anhang). Aber hinterherlaufen lohnt sich für dein Ziel nicht.
- ~~Flyer und Standdienst als Hauptkanal~~ — hört auf zu wirken, sobald du aufhörst.
  Nur noch als Beiwerk, und bezahlt aus dem Heimat-Scheck.
- ~~Partner-Profile für Händler~~ — braucht Verkauf, Betreuung, Kennzeichnung, und bricht das
  Werbefrei-Versprechen. Bei der Ertragserwartung nicht den Ärger wert.

Was **bleibt**: Die Aachen-Karte ist weiter kostenlos und werbefrei, Platzierung nie käuflich.
Nicht aus Idealismus, sondern weil bezahlte Plätze bei diesen Besucherzahlen ohnehin nichts
einbringen — und Unabhängigkeit ist das Einzige, was dich von rausgegangen.de unterscheidet.

---

## Die harten Grenzen (damit dich später nichts überrascht)

| Risiko | Was es bedeutet |
|---|---|
| **SEO dauert** | 6–18 Monate bis zu spürbarem Traffic. Es gibt keine Abkürzung, die nicht abgestraft wird. |
| **Quellen machen dicht** | `rausgegangen.de` sperrt uns bereits aus (HTTP 403, Bot-Schutz). Je mehr Städte, desto öfter passiert das. |
| **Rechtlich** | Nur offizielle APIs, iCal-Exporte und offene Daten nutzen. Fremde Datenbanken systematisch auslesen ist nach § 87a UrhG und nach den AGB heikel — bei einer kommerziellen Seite mehr als bei einem Hobbyprojekt. |
| **API-Kosten skalieren mit Städten** | Der Claude-Rechercheschritt kostet pro Stadt und Nacht. Muss optional bleiben — die Karte muss auch ohne ihn voll werden (ist seit heute so). |
| **Google kann alles zurücknehmen** | Ein Core-Update kann Traffic halbieren. Deshalb Affiliate **und** Werbung, nie nur eins. |
| **Ohne Domain kein SEO** | `eventlas.de` ist der Startpunkt, nicht die Kür. |

---

## Dein Aufwand, konkret

| Wann | Du | Stunden |
|---|---|---|
| Diese Woche | Anthropic-Guthaben aufladen, Reparatur nach `main` pushen | 0,5 |
| Diese Woche | `eventlas.de` registrieren | 0,5 |
| Bis 31.10. | Heimat-Scheck beantragen (ich schreibe den Text) | 4 |
| Wenn du magst | Erstgespräch GründerRegion → Weg zum Stipendium | 2 + Pitch |
| Einmalig | GetYourGuide-Partnerkonto anlegen | 0,5 |
| Einmalig | Impressum-Daten schicken | 0,25 |
| **Summe** | | **~8 Stunden + Pitch** |

Alles andere — SEO-Seiten, schema.org, Sitemap, Affiliate-Links, weitere Städte, Pflege —
läuft über den Build und über mich.

---

## Anhang: Wenn du doch aktiv verkaufen willst

Falls sich das Ziel ändert oder jemand von allein anfragt, hier die Preise. Der Bausatz steht,
eine zugeschnittene Karte ist ein bis drei Tage Arbeit:

| Leistung | Preis |
|---|---|
| Festkarte, klein (bis 4 Wochen) | 600–1.200 € |
| Festkarte, groß (mit Betreuung während der Veranstaltung) | 1.500–2.500 € |
| Vereins-/Viertelkarte | 800 € + 40 €/Monat |
| Nachbarschaftskarte für Wohnungsunternehmen | 1.200 € + 80 €/Monat |
| Einbett-Widget, Gewerbe / Verein | 30–80 €/Monat / kostenlos |
| Neue Stadt als Lizenz | 1.500–3.000 € + 100–250 €/Monat |
| Tagessatz | 450–650 € |

Rechtliches, sobald eine Rechnung rausgeht: Gewerbeanmeldung (~20–40 €),
Kleinunternehmerregelung nach § 19 UStG ankreuzen (Grenzen 25.000 € Vorjahr / 100.000 €
laufendes Jahr), Impressum nach § 5 DDG, Datenschutzerklärung einmal anwaltlich prüfen lassen.

---

## Quellen (Stand 11.09.2026, vor Antragstellung nachprüfen)

- Heimat-Scheck NRW: [mhkbd.nrw](https://www.mhkbd.nrw/foerderprogramme/heimat-scheck)
- Gründungsstipendium.NRW: [gründungsstipendium.nrw](https://www.xn--grndungsstipendium-n6b.nrw/) ·
  [Ablauf GründerRegion](https://www.gruenderregion.de/gruenderstipendium-nrw/ablauf.html)
- GetYourGuide-Partnerprogramm: [partner.getyourguide.com](https://partner.getyourguide.com/de-de/signup) ·
  [Konditionen](https://www.100partnerprogramme.de/p/getyourguide-9117/)
- Eventim-Partnerprogramm: [affiliate-marketing.de](https://www.affiliate-marketing.de/partnerprogramme/eventim.de)
- Werbeerlöse pro 1.000 Aufrufe: [Publift: Ezoic vs. AdSense](https://www.publift.com/blog/ezoic-vs-adsense-vs-publift)
- Kleinunternehmerregelung: [IHK Region Stuttgart](https://www.ihk.de/stuttgart/fuer-unternehmen/recht-und-steuern/steuerrecht/umsatzsteuer-national/kleinunternehmerregelung-in-der-umsatzsteuer-1843632)
