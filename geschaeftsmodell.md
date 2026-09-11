# Geld verdienen mit Eventlas — Plan (Stand 11.09.2026)

Diese Datei gehört zu `roadmap.md` (Projektgedächtnis) und `todos.md` (was nur du tun kannst).
Hier steht: **womit Eventlas Geld verdienen kann, in welcher Reihenfolge, und was es nicht kann.**

---

## Die Kurzfassung

**Das Produkt ist nicht die Karte. Das Produkt ist die Fähigkeit, in wenigen Tagen eine
gepflegte Karte für irgendjemanden zu bauen, der dafür ein Budget hat.**
Die Aachen-Karte bleibt kostenlos und werbefrei — sie ist das Schaufenster, nicht die Ware.

Daraus folgt die Reihenfolge, sortiert nach **Euro pro Stunde Arbeit**:

| # | Weg | Realistisch | Aufwand | Wann |
|---|---|---|---|---|
| 1 | **Heimat-Scheck NRW** | 2.000 € einmalig | ~4 h Papierkram | **Frist 31.10.2026** |
| 2 | **Auftragskarten** (Feste, Vereine, Hochschule, Wohnungsbau) | 500–2.500 € je Auftrag | 1–3 Tage, 90 % Code steht | ab Oktober |
| 3 | **Gründungsstipendium.NRW** | 1.200 €/Monat × 12 = 14.400 € | 20–30 h + Pitch | Bewerbung ab sofort |
| 4 | **Einbett-Widget im Abo** | 30–80 €/Monat je Kunde | 1 Tag einmalig bauen | ab Q1 2027 |
| 5 | **Zweite Stadt als Lizenz** | 1.500–3.000 € + 100–250 €/Monat | 3–5 Tage je Stadt | ab Q2 2027 |
| — | Werbung, Affiliate, Spenden | zusammen 0–80 €/Monat | gering | nebenbei |

Realistisches Ziel: **~3.000 € bis Jahresende 2026**, **12.000–25.000 € in 2027** (die Spanne
ist das Gründungsstipendium). Das ist ein wachsendes Nebeneinkommen, kein Gehalt im ersten Jahr.

**Aber zuerst:** Nichts davon lässt sich verkaufen, solange die Karte einen Monat alt ist.

---

## 0. Was heute wirklich da ist (gemessen am 11.09.2026, nicht geschätzt)

| Befund | Wie gemessen | Bedeutung fürs Geld |
|---|---|---|
| Seite ist online, 143 Pins | HTTP 200 auf eventlas.netlify.app | ✅ Es gibt ein vorzeigbares Produkt |
| **Datenstand `08.08.` — 34 Tage alt** | `"stand"` in der ausgelieferten pins.json | 🔴 Die Karte zeigt überwiegend abgelaufene August-Termine |
| **Auto-Update läuft seit 10.08. nicht mehr** | letzter Auto-Commit im Git-Log: 13.08. | 🔴 Der Kern des Produkts (Aktualität) ist tot |
| **Netlify-Build kommt nicht durch** | `/version.json` antwortet 404, obwohl der Build sie anlegt | 🔴 Auch neue Arbeit geht nicht live |
| eventlas.de nicht registriert | DNS antwortet nicht | 🟡 Keine Rechnungsadresse, keine seriöse Mail |
| Keine Besucherzahlen | keinerlei Statistik eingebaut | 🔴 Ohne Zahlen kein Verkaufsgespräch und kein Pitch |
| Private Gmail steht öffentlich in der App | `KONFIG.mail` in index.html | 🟡 Geht auf Rechnungen und Anträgen nicht |
| Laufende Kosten ≈ 0 € | Netlify frei, OpenFreeMap frei, kein Backend | ✅ Nur Claude-API (~5–15 €/Monat) + Domain |

**Der wichtigste Satz dieses Abschnitts:** Eventlas trägt sich längst selbst — die Frage ist
nicht, wie die Karte ihre Kosten deckt, sondern wie sie **dich** bezahlt. Das ändert die
Strategie: Du brauchst keine Werbeeinnahmen zum Überleben. Du kannst dir aussuchen, wofür du
Geld nimmst — und das ist ein seltener Luxus.

---

## 1. Die Grundentscheidung: Die Aachen-Karte bleibt frei

Du hast öffentlich versprochen, dass die Karte „komplett kostenlos und werbefrei" ist —
auf nebenan.de, in den Insta-DMs und in Text 7 sogar wörtlich: *„die Karte finanziert sich
nicht über Einträge."* Das ist kein Hindernis, das ist dein bestes Verkaufsargument.

Drei Gründe, es zu halten:

1. **Rechnerisch bringt der Bruch fast nichts.** Selbst 20 zahlende Läden à 25 €/Monat
   (das wären ~60 Stunden Klinkenputzen) ergeben 500 €/Monat. Ein einziger Auftrag für ein
   Stadtfest bringt dasselbe in zwei Tagen — ohne ein Versprechen zu brechen.
2. **Bezahlte Sichtbarkeit zerstört genau das, was du verkaufst.** Dein Angebot an
   Stadtmarketing, Vereine und Hochschulen lautet „unabhängig kuratiert, alles geprüft".
   Wer Plätze verkauft, verkauft keine Kuration mehr, sondern Anzeigenfläche — und damit
   konkurrierst du plötzlich mit rausgegangen.de und dem Klenkes, statt sie zu ergänzen.
3. **Kennzeichnungspflicht.** Bezahlte Inhalte müssen als Werbung erkennbar sein
   (§ 6 DDG, UWG — Schleichwerbung ist abmahnfähig). Ein „Anzeige"-Label auf einem Pin
   sieht in einer kuratierten Karte immer nach Ausverkauf aus.

**Die Regel, an die du dich hältst:** Auf der öffentlichen Aachen-Karte ist **Platzierung
und Reihenfolge niemals käuflich.** Geld fließt nur für Arbeit, die du für jemanden machst —
eine eigene Karte, ein Widget, eine Auswertung, eine Lizenz. Wer bei dir anruft und „ganz oben
stehen" will, bekommt ein freundliches Nein und ein Angebot für eine eigene Karte.

---

## 2. Warum die naheliegenden Wege wenig bringen

Bevor der Plan kommt, das Gegenteil — damit du nicht Monate in das Falsche steckst. Alle
Zahlen sind für dein Szenario gerechnet (lokale Reichweite, ein Betreiber, keine Redaktion):

| Weg | Was hängen bleibt | Warum so wenig |
|---|---|---|
| **Bannerwerbung / AdSense** | 0–5 €/Monat | Lokaler Traffic bringt 1–3 € pro 1.000 Aufrufe. Bei 2.000 Aufrufen im Monat: 2–6 €. Dafür verlierst du Werbefreiheit, Ladezeit und Datenschutz-Sauberkeit. |
| **Ticket-Affiliate (Eventim)** | 0–30 €/Monat | Eventim zahlt 20 % der **Vorverkaufsgebühr**, und die ist selbst nur 8–10 % vom Ticketpreis → knapp **2 % vom Ticket**. Ein 40-€-Ticket bringt dir ~0,70 €. Für 50 €/Monat müsstest du ~70 Tickets im Monat vermitteln. |
| **Spenden / Kaffeekasse** | 0–50 €/Monat | Spenden kommen von Fans, nicht von Besuchern. Realistisch nach lokaler Bekanntheit: 10–20 Leute × 3 €. |
| **„Featured Pins" an Läden verkaufen** | 0 € bis Frühjahr 2027 | Verkauft man nicht ohne Besucherzahlen. Und siehe Abschnitt 1. |
| **App/Code verkaufen** | 0 € | Steht schon in roadmap.md: „Der Code ist in ein paar Tagen nachgebaut, die Datenpflege nicht." Der Wert liegt in Daten, Marke und Pflege — nicht in index.html. |
| **Bezahlte Posts auf Instagram** | 0 € | Bei einem lokalen Account unter ~5.000 Followern zahlt niemand für Posts. |

Zusammen: **unter 80 €/Monat, im besten Fall.** Trotzdem sind Affiliate-Links und Kaffeekasse
sinnvoll — weil sie einmal eingebaut nichts mehr kosten (siehe Phase 1). Aber sie sind Trinkgeld,
kein Plan.

---

## 3. Die vier Geldquellen, die tatsächlich tragen

### A) Fördergeld — das Beste pro Stunde, und du bist dafür gebaut

**A1 — Heimat-Scheck NRW: 2.000 €, Frist 31.10.2026**

Das Land NRW gibt pauschal 2.000 € für Projekte mit Heimat- und Nachbarschaftsbezug, die
öffentlich erlebbar sind. Antrag komplett online über das Portal Heimat.WEB, **natürliche
Personen sind antragsberechtigt** — du brauchst keinen Verein. Bewilligung läuft fortlaufend,
aber Anträge nach dem 31.10. landen erst im nächsten Jahr. Einer pro Person und Jahr.

Eventlas ist fast ein Musterfall: ein frei zugängliches, nicht-kommerzielles Nachbarschafts-
projekt für ein Aachener Viertel. Was du ins Antragsprojekt schreibst, sind konkrete Ausgaben
(Druck, Material, eine Viertel-Aktion), **nicht dein eigener Arbeitslohn** — eigene Arbeitszeit
ist in solchen Programmen üblicherweise nicht förderfähig. Passende Posten:

- Flyer und Plakate in echter Auflage (statt 100 × A6: 2.000 Flyer + 20 Plakate)
- Gedruckte Viertelkarte als Papier-Beilage (Bürgerverein, Cafés, Arztpraxen)
- Aufkleber mit QR-Code für Schaufenster teilnehmender Läden
- Eine öffentliche Aktion: „Viertel-Rallye" oder ein Kartier-Spaziergang mit Nachbarn
- Standgebühr/Material für einen Stand auf einem Stadtteilfest

→ Das ist echtes Geld, das die Marketing-Ausgaben abdeckt, die du sowieso hättest.
**Beste Stunden-Rendite im ganzen Plan: ~500 €/Stunde.**

**A2 — Gründungsstipendium.NRW: 1.200 €/Monat für 12 Monate = 14.400 €**

Das größte Einzelposten im Plan. Voraussetzungen: mindestens 18, Wohnsitz und Lebensmittelpunkt
in NRW ✅, Gründung liegt noch kein Jahr zurück ✅, innovative Geschäftsidee, und das Vorhaben
muss **hauptberuflich** verfolgt werden — das ist die Hürde, die du selbst beantworten musst
(siehe Frage 1 in todos.md). Vergeben wird es nach einem Pitch vor der Jury eines
akkreditierten Gründungsnetzwerks; in deiner Region sind das:

- **GründerRegion Aachen** — begleitet von der ersten Einschätzung bis zur Einreichung,
  kostenlose Beratung, `info@gruenderregion.de`, Ansprechpartner Peter Kampmeier
- **digitalHUB Aachen e.V.** — `startup@hubaachen.de`, Schwerpunkt Digitalgründungen

⚠️ **Wichtige Einschränkung:** Wegen hoher Nachfrage **pausieren die Jurysitzungen seit
01.04.2026 vorerst**. Eingegangene Anträge werden weiter bearbeitet und Stipendien weiter
vergeben; die Sitzungen sollen im Jahresverlauf wieder aufgenommen werden. Praktische Folge:
Du kommst nicht in vier Wochen ans Geld, aber **jetzt in die Warteschlange zu kommen kostet
nur ein Erstgespräch** — und das Gespräch bei der GründerRegion ist kostenlos und bringt dir
unabhängig vom Stipendium eine Einschätzung deines Geschäftsmodells.

→ **Erstgespräch vereinbaren, nicht auf das Programm warten.** Der Plan darf davon nicht
abhängen (deshalb zwei Szenarien in Abschnitt 7).

**A3 — was noch geht, aber später:** Verfügungs-/Bürgerfonds für Innenstadt-Projekte über das
Citymanagement Aachen; bei einer grenzüberschreitenden Euregio-Variante (Vaals, Kerkrade ist
10 Minuten weg) die Kleinprojekte-Töpfe von Interreg. Beides erst anschauen, wenn Phase 2 läuft.

---

### B) Auftragskarten — die verlässlichste Einnahme

Das Geschäft: Jemand mit Budget braucht für ein paar Wochen eine eigene Karte. Du hast den
Bausatz schon — MapLibre-Karte, Pin-Schema, Filter, Liste, Mobilansicht, PWA, Offline-Fähigkeit.
Eine neue Karte ist eine neue `pins.json` plus Farben und Logo: **ein bis drei Tage Arbeit.**

Was du verkaufst und was es kostet:

| Paket | Inhalt | Preis |
|---|---|---|
| **Festkarte** | Eigene Karte für ein Fest/Markt: Stände, Bühnen, Programm, Toiletten, Notausgänge; QR-Code für Plakate; läuft 4 Wochen | **600–1.200 €** |
| **Festkarte groß** | dazu Live-Änderungen während der Veranstaltung, Programm-Push, Auswertung danach | **1.500–2.500 €** |
| **Vereins-/Viertelkarte** | Dauerhafte Karte für einen Verein oder ein Viertel, eingebettet auf deren Website | **800 € Aufbau + 40 €/Monat** |
| **Nachbarschaftskarte Wohnungsbau** | Mieterservice: was läuft im Umkreis, Behörden, Ärzte, Spielplätze, Müllkalender | **1.200 € + 80 €/Monat** |

Konkrete Adressen in und um Aachen, nach Wahrscheinlichkeit sortiert:

1. **Bürgerverein Frankenb(u)erger** (wir-frankenberger.de) — kennt dich schon, Alleenfest ist
   ihr Fest. Startet als Referenz, notfalls günstig. **Eine Referenz ist mehr wert als der erste
   Rechnungsbetrag.**
2. **Werbegemeinschaften einzelner Straßen/Viertel** (Adalbertstraße, Pontviertel, Frankenberger) —
   haben kleine, aber echte Budgets und sind für Sichtbarkeit ihres Viertels zuständig.
3. **AStA RWTH / AStA FH / Studierendenwerk** — Ersti-Karte. ~45.000 Studierende, jedes Jahr
   tausende Neue, die buchstäblich nach „was läuft hier" suchen. Siehe Phase 1: Dieses Jahr
   **kostenlos als Reichweitenmotor**, nächstes Jahr als bezahltes Paket.
4. **Wohnungsgesellschaften/-genossenschaften** (gewoge und Genossenschaften im Viertel) —
   Mieterservice ist ein etablierter Budgetposten, und eine Nachbarschaftskarte ist ein
   greifbarer Vorteil gegenüber anderen Vermietern.
5. **Citymanagement Aachen / Stadtmarketing** — arbeiten an „hybridem Einzelhandel" und
   Innenstadtentwicklung; ein Termin dort öffnet gleichzeitig Türen zu Fördertöpfen.
6. **aachen tourist service e.V. / Hotels** — Gästekarte „diese Woche in Aachen", QR im Zimmer.
   Hotels zahlen für Gästeservice und haben keine Lust, selbst zu kuratieren.
7. **Schausteller/Veranstalter** von Bend, Trödelmärkten, Weihnachtsmarkt-Beschickern.

**So verkaufst du:** Nie mit einem Angebot anfangen, sondern **mit einer fertigen Karte.**
Bau die Karte für das Fest, schick den Link („ich hab das mal gemacht, gefällt's euch?") und
rede erst danach über Geld. Bei 1–3 Tagen Bauaufwand ist das kalkulierbar, und es umgeht den
Teil, in dem du dich erklären musst.

---

### C) Wiederkehrend: Einbett-Widget

Steht schon als Idee in roadmap.md („Embed-Widget: Karte als iframe für wir-frankenberger.de /
Café-Websites"). Als Produkt gedacht:

- Ein `<iframe>`-Schnipsel, den jede Website einbauen kann, gefiltert auf das, was zum Kunden passt
  (Viertel, Thema, Zeitraum): `?stadt=aachen&tag=musik&umkreis=500m`
- Für nicht-kommerzielle Nachbarn und Vereine: **kostenlos** — das ist Marketing, jeder Einbau
  ist ein Link auf dich und bringt Besucher
- Für Gewerbe (Hotels, Cafés, Makler, Immobilienportale): **30–80 €/Monat**, mit eigenem Logo
  und ohne Eventlas-Branding

Warum das sauber bleibt: Der Kunde zahlt für ein **Werkzeug auf seiner Seite**, nicht für einen
Platz auf deiner. Die öffentliche Karte bleibt unberührt. 10 zahlende Einbettungen = 300–800 €/Monat
bei praktisch null laufendem Aufwand — das ist der erste Betrag im Plan, der ohne dich weiterläuft.

---

### D) Zweite Stadt — der eigentliche Skalierungshebel

Die Architektur steht bereits (`STAEDTE`-Eintrag + `pins-<stadt>.json`), und `quellen-handbuch.md`
wurde ausdrücklich dafür geschrieben: „Wie schalte ich die nächste Stadt auf, ohne von vorn
anzufangen?" Das ist ein verkaufbares Produkt, sobald Aachen als Referenz funktioniert.

**Wer kauft:** Stadtmarketing-Gesellschaften und Werberinge kleinerer Städte im Umland —
Eschweiler, Stolberg, Alsdorf, Würselen, Herzogenrath, Baesweiler, Düren, Jülich. Die haben
dasselbe Problem wie Aachen, aber weder Kulturkalender-API noch IT-Abteilung. Dazu die
Euregio-Nachbarn (Vaals, Kerkrade) — grenzüberschreitend ist zusätzlich förderfähig.

**Preis:** 1.500–3.000 € Aufbau (Quellenrecherche nach dem Prüfraster, Spielstätten anlegen,
Erstbefüllung) + 100–250 €/Monat für Betrieb und Pflege. Bei drei Städten sind das
300–750 €/Monat wiederkehrend — und die Pflege läuft über dasselbe nächtliche Skript.

**Reihenfolge beachten:** Erst wenn Aachen wieder tagesaktuell läuft und du Besucherzahlen
vorzeigen kannst. Vorher verkaufst du ein Versprechen statt eines Produkts.

---

## 4. Der Fahrplan

### Phase 0 — „wieder lebendig und messbar" (jetzt bis ~20.09.)
Ohne diesen Schritt ist alles andere wertlos. Eine Karte mit August-Terminen kann man niemandem
zeigen, und ohne Zahlen kann man nichts verkaufen und nichts pitchen.

| Was | Wer |
|---|---|
| Netlify-Build reparieren (`/version.json` fehlt → Build läuft nicht durch) | Agent + du (Deploy-Log) |
| Auto-Update wieder starten (läuft seit 10.08. nicht; API-Schlüssel/Guthaben prüfen) | du (Secret) + Agent |
| Abgelaufene Pins raus, Herbstprogramm rein | Agent |
| **Besucherzählung einbauen** — serverseitig, ohne Cookies, ohne Tracking-Banner | Agent |
| Domain eventlas.de sichern, Projekt-Mail anlegen | **nur du** |
| Impressum eintragen | **nur du** (Daten liefern) |

### Phase 1 — „Geld holen, das schon bereitliegt" (bis 31.10.)

| Was | Ertrag | Frist |
|---|---|---|
| **Heimat-Scheck beantragen** | 2.000 € | **31.10.2026 — hart** |
| **Erstgespräch GründerRegion Aachen** | Weg zu 14.400 € | so früh wie möglich |
| **Ersti-Kampagne Oktober** — Karte kostenlos über AStA-Kanäle, Insta, Aushänge | Reichweite = Verkaufsargument | Semesterstart Anfang Oktober |
| Affiliate-Links für Tickets, Kaffeekasse einbauen | 20–80 €/Monat | nebenbei |
| Gewerbe anmelden (sobald die erste Rechnung ansteht) | Voraussetzung | vor Rechnung 1 |

> **Warum Oktober entscheidend ist:** Der Semesterstart ist der einzige Moment im Jahr, an dem
> zehntausend Menschen gleichzeitig neu in Aachen sind und exakt die Frage haben, die Eventlas
> beantwortet. Diese Welle verpasst du sonst ein volles Jahr. Reichweite ist hier kein
> Selbstzweck — sie ist die Zahl, die in jedem Verkaufsgespräch und jedem Antrag steht.

### Phase 2 — „erster bezahlter Auftrag" (Oktober bis Dezember)

1. Eine **Musterkarte** für ein Fest bauen und als Schaufenster online stellen (Weihnachtsmarkt
   ist der naheliegende Anlass — läuft ab ~20.11.)
2. Damit an die fünf wahrscheinlichsten Adressen aus Abschnitt B herantreten — **mit fertiger
   Karte, nicht mit einem Angebot**
3. Ziel: **ein** bezahlter Auftrag über 600–1.500 € bis Jahresende. Einer reicht — er ist die
   Referenz, mit der die nächsten fünf leichter werden.

### Phase 3 — „das, was von allein weiterläuft" (ab Januar 2027)

1. Einbett-Widget als Produkt fertig bauen, kostenlos an Vereine, kostenpflichtig an Gewerbe
2. Zweite Stadt: eine Stadt im Umland aufschalten und an deren Stadtmarketing verkaufen
3. Erst jetzt, mit belastbaren Zahlen: Partner-Profile für Läden prüfen — **und nur in der Form,
   die Abschnitt 1 erlaubt** (kein gekaufter Rang)

---

## 5. Was du rechtlich und steuerlich brauchst, bevor Geld fließt

| Thema | Was zu tun ist | Kosten |
|---|---|---|
| **Gewerbeanmeldung** | Beim Gewerbeamt Aachen, sobald du die erste Rechnung schreibst. Kartenbau ist gewerblich, nicht freiberuflich — nicht lange diskutieren, einfach anmelden. | ~20–40 € |
| **Kleinunternehmerregelung (§ 19 UStG)** | Ankreuzen im Fragebogen zur steuerlichen Erfassung. Grenzen: **25.000 € Vorjahr / 100.000 € laufendes Jahr**. Du bleibst auf Jahre darunter → keine Umsatzsteuer auf Rechnungen, aber auch kein Vorsteuerabzug. | 0 € |
| **Impressum (§ 5 DDG)** | Name + ladungsfähige Anschrift. Ist überfällig, sobald die Seite öffentlich ist — steht schon in todos.md. | 0 € |
| **Datenschutzerklärung** | Einmal anwaltlich prüfen lassen, bevor du gewerblich auftrittst. Ab dem Moment ist Nachlässigkeit abmahnbar. | 100–300 € |
| **Kennzeichnung bezahlter Inhalte** | Falls je bezahlte Einträge: sichtbar als „Anzeige". Siehe Abschnitt 1 — besser gar nicht erst anfangen. | — |
| **Marke** | DPMA-Anmeldung (~290 €, Klassen 35/38/41/42) war für den 11.08. geplant — Stand prüfen. Vor Lizenzverkäufen an andere Städte zwingend. | 290 € |
| **Haftung für Fremdinhalte (§ 10 DDG)** | Bereits sauber gelöst: Du prüfst jede Meldung von Hand. Beibehalten. | 0 € |
| **Fördermittel + Gewerbe** | Heimat-Scheck geht auch an natürliche Personen. Beim Gründungsstipendium prüft die Jury, ob das Vorhaben hauptberuflich verfolgt wird. Vorher klären, nicht hinterher. | — |

Steuerlich: Einnahmen aus selbständiger Tätigkeit gehören in die Einkommensteuererklärung
(Anlage EÜR ab dem ersten Euro). Bei den hier geplanten Beträgen reicht eine simple
Einnahmen-Überschuss-Rechnung — dafür brauchst du keinen Steuerberater, aber ein Konto,
das getrennt vom privaten läuft.

---

## 6. Preisliste (damit du im Gespräch nicht rechnen musst)

| Leistung | Preis | Anmerkung |
|---|---|---|
| Festkarte, klein (bis 4 Wochen) | 600–1.200 € | Erste Referenz notfalls für 300 € |
| Festkarte, groß (mit Betreuung) | 1.500–2.500 € | Live-Änderungen während der Veranstaltung |
| Vereins-/Viertelkarte | 800 € + 40 €/Monat | Einbettung auf deren Website |
| Nachbarschaftskarte Wohnungsbau | 1.200 € + 80 €/Monat | pro Quartier |
| Einbett-Widget, Gewerbe | 30–80 €/Monat | ohne Eventlas-Branding: oberes Ende |
| Einbett-Widget, Verein/gemeinnützig | 0 € | Marketing, kein Verzicht |
| Neue Stadt (Lizenz + Aufbau) | 1.500–3.000 € + 100–250 €/Monat | nach Prüfraster aus dem Quellen-Handbuch |
| Tagessatz, falls jemand danach fragt | 450–650 € | für Umbauten außerhalb der Pakete |

**Nicht unter Wert verkaufen:** Eine Agentur berechnet für dieselbe Festkarte 4.000–8.000 €
und liefert eine schlechtere, weil sie die Datenquellen nicht kennt. Dein Vorteil ist Tempo
und Ortskenntnis, nicht der Preis.

---

## 7. Drei Szenarien in Zahlen

| | Vorsichtig | Realistisch | Gut gelaufen |
|---|---|---|---|
| **2026 (Sep–Dez)** | | | |
| Heimat-Scheck | 0 € (Frist verpasst) | 2.000 € | 2.000 € |
| Aufträge | 0 € | 1 × 800 € | 2 × 1.200 € |
| Affiliate/Kaffeekasse | 20 € | 60 € | 150 € |
| **Summe 2026** | **20 €** | **≈ 2.860 €** | **≈ 4.550 €** |
| **2027** | | | |
| Gründungsstipendium | 0 € | 0 € (Jury pausiert) | 14.400 € |
| Auftragskarten | 2 × 800 € | 5 × 1.100 € | 8 × 1.400 € |
| Widget-Abos | 0 € | 6 × 50 € × 8 Mon. | 12 × 60 € × 10 Mon. |
| Zweite Stadt | 0 € | 1 × 2.000 € + 150 €/M × 6 | 2 × 2.500 € + 200 €/M × 8 |
| Affiliate/Spenden | 200 € | 600 € | 1.200 € |
| **Summe 2027** | **≈ 1.800 €** | **≈ 11.600 €** | **≈ 38.000 €** |

Laufende Kosten in allen Szenarien: **unter 400 €/Jahr** (Domain, Claude-API, Druck) — plus
die einmaligen 290 € für die Marke. Das Projekt kann also nicht wirklich scheitern, es kann
nur langsamer wachsen als gehofft.

**Ehrliche Einordnung:** Die realistische Spalte ist ein gutes Nebeneinkommen und ein Beweis,
dass das Modell trägt. Ein Gehalt wird daraus frühestens 2028 — oder schlagartig über das
Stipendium, wenn die Jurysitzungen wieder aufgenommen werden und du hauptberuflich gründen
willst und kannst.

---

## 8. Was ich an deiner Stelle nicht machen würde

- **Kein Backend bauen, bevor ein Kunde dafür zahlt.** Konten, Logins, Datenbank, Push —
  alles in roadmap.md als V3 geparkt. Jede dieser Funktionen bringt laufende Kosten,
  DSGVO-Pflichten und Wartung, aber keinen einzigen Euro, solange niemand dafür bezahlt.
- **Keine App im Store.** Die PWA kann alles, was gebraucht wird; ein Store-Auftritt kostet
  99 €/Jahr (Apple), Review-Aufwand und nochmal Datenschutzarbeit.
- **Nicht den Job kündigen, um Eventlas hauptberuflich zu machen** — außer das Stipendium
  wird tatsächlich bewilligt. Dann ist die Rechnung eine andere.
- **Nicht 50 Läden anschreiben, um Einträge zu verkaufen.** 50 Absagen kosten dich Wochen und
  deinen Ruf im Viertel. Fünf gezielte Gespräche mit Budgetverantwortlichen sind mehr wert.
- **Keine bezahlten Rankings.** Einmal gemacht, ist die Unabhängigkeit weg — und mit ihr das
  einzige Argument, das dich von rausgegangen.de unterscheidet.
- **Nicht auf die Freigabe der Stadt warten** (iCal-Export, 1427 Events). Die wäre großartig
  für die Datenqualität, aber sie ist kein Geschäftsmodell und kein Blocker.

---

## 9. Woran du merkst, ob es funktioniert

Prüfe das **Ende Dezember 2026** an vier Zahlen. Nicht am Gefühl:

| Frage | Grün | Rot |
|---|---|---|
| Ist die Karte an 90 % der Tage aktuell? | Auto-Update läuft täglich durch | wieder wochenlang tot → das Produkt existiert nicht |
| Besucher im Dezember? | > 500 im Monat | < 100 → niemand wird dafür zahlen |
| Heimat-Scheck beantragt? | ja | nein → 2.000 € liegengelassen |
| Mindestens ein bezahlter Auftrag? | ja, egal wie klein | nein → das Verkaufen, nicht das Produkt, ist das Problem |

**Zwei rote Felder = Kurs ändern**, nicht mehr arbeiten. Die wahrscheinlichste Kurskorrektur:
weg von „Karte für Aachen betreiben", hin zu „Karten für Auftraggeber bauen" — also Abschnitt B
als Hauptgeschäft und die Aachen-Karte nur noch als Portfolio-Stück pflegen. Das ist keine
Niederlage, sondern die Version des Plans, die am schnellsten Geld bringt.

---

## Quellen (Stand 11.09.2026, bitte vor Antragstellung nachprüfen)

- Heimat-Scheck NRW: [mhkbd.nrw](https://www.mhkbd.nrw/foerderprogramme/heimat-scheck) ·
  [engagiert-in-nrw.de](https://www.engagiert-in-nrw.de/heimat-scheck)
- Gründungsstipendium.NRW: [gründungsstipendium.nrw](https://www.xn--grndungsstipendium-n6b.nrw/) ·
  [Ablauf bei der GründerRegion](https://www.gruenderregion.de/gruenderstipendium-nrw/ablauf.html) ·
  [digitalHUB Aachen](https://www.aachen.digital/startups/gruendungsstipendiumnrw/)
- Eventim-Partnerprogramm (Provisionsmodell): [affiliate-marketing.de](https://www.affiliate-marketing.de/partnerprogramme/eventim.de)
- Kleinunternehmerregelung 2026: [IHK Region Stuttgart](https://www.ihk.de/stuttgart/fuer-unternehmen/recht-und-steuern/steuerrecht/umsatzsteuer-national/kleinunternehmerregelung-in-der-umsatzsteuer-1843632)
- Citymanagement Aachen: [citymanagement-aachen.de](https://citymanagement-aachen.de/) ·
  [Innenstadtentwicklung](https://www.aachen.de/DE/wirtschaft_technologie/aufgaben/innenstadtentwicklung/index.html)
