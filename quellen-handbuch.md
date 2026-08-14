# Quellen-Handbuch — wie Eventlas an Termine kommt

Diese Datei beantwortet zwei Fragen: **Woher kommen die Daten in Aachen?** und
**Wie schalte ich die nächste Stadt auf, ohne von vorn anzufangen?**

Grundsatz: Für alles, was es schon frei und verlässlich gibt, bauen wir keine eigene
Datenpflege auf. Umgekehrt gilt: Was rechtlich nicht sauber übernehmbar ist, wird
**verlinkt statt kopiert**.

---

## 1. Prüfraster für jede neue Quelle

Eine Quelle kommt nur infrage, wenn **alle fünf** Antworten stimmen. In dieser Reihenfolge
prüfen — die frühen Fragen sind billig und sortieren die meisten Kandidaten aus.

| # | Frage | Wenn nein |
|---|---|---|
| 1 | **Kostet sie nichts?** Kein Abo, kein Kontingent, kein Schlüssel mit Verfallsdatum | verwerfen |
| 2 | **Erlaubt sie die Nutzung?** robots.txt lesen, AGB/Nutzungsbedingungen überfliegen | verlinken statt übernehmen |
| 3 | **Kommt sie ohne Anmeldung aus?** Login = laufende Pflege und ein Konto, das ablaufen kann | nur mit gutem Grund |
| 4 | **Ist sie maschinenlesbar?** JSON/iCal/klare HTML-Struktur schlägt Fließtext | LLM-Recherche statt Parser |
| 5 | **Bringt sie einen Ort mit?** Adresse oder Koordinaten — sonst landet nichts auf der Karte | nur bei bekannter Spielstätte |

### robots.txt richtig lesen
`https://<domain>/robots.txt` aufrufen und nach `User-agent: *` suchen. Wichtig sind
`Disallow`-Pfade (dort nicht crawlen) und `Crawl-delay` (Wartezeit zwischen Abrufen —
einhalten, auch wenn niemand es kontrolliert). Ein fehlendes robots.txt ist **keine**
Erlaubnis; dann entscheiden die AGB.

### Was grundsätzlich NICHT geht
Google Maps, Instagram, Facebook, TripAdvisor, Kleinanzeigen, nebenan.de: Deren
Nutzungsbedingungen untersagen automatisiertes Auslesen ausdrücklich, und an Fotos und
Bewertungen hängen fremde Rechte. Auch „nur ein paar Kommentare" ist eine Übernahme.
**Verlinken ist erlaubt und erwünscht** — genau dafür gibt es das Feld `quelle` in jedem Pin.

---

## 2. Was in Aachen läuft (Stand 15.08.2026)

| Quelle | Art | Liefert | Wie eingebunden |
|---|---|---|---|
| **Kulturkalender Aachen** | JSON-API, CORS offen | ~109 Termine städtischer Häuser | `kulturApi` in venues.json; Zuordnung über `muster` je Spielstätte |
| **rausgegangen.de** | HTML, robots.txt erlaubt, Crawl-Delay 10 s | Konzerte, Party, Bühne, Comedy, Märkte, Sport, Kinder, Kennenlernen | `rausgegangen[]` in venues.json — je Rubrik URL + Themen-Tags |
| **Musikbunker (Bigcartel)** | JSON-Shop-API | ~20 Konzerte mit Preis | `bigcartelShop` |
| **The-Events-Calendar-APIs** | JSON (WordPress-Plugin) | ~73 Termine (aachen-kalender, mubu, raststaette, ludwigforum) | `tribeApis[]` — überall gleich aufgebaut |
| **Claude + Websuche** | LLM | alles, was kein Parser abdeckt | darf ausfallen, ohne den Lauf zu stoppen |
| **OpenStreetMap** | Overpass | Haltestellen, Barrierefreiheit, Öffnungszeiten | `orte-aktualisieren.mjs`, monatlich |
| **Wikipedia** | REST-API | Ortsbeschreibungen | dito |
| **Wikimedia Commons** | API | Ortsfotos (CC) | einmalig heruntergeladen nach `bilder/` |
| **Open-Meteo** | JSON | Wetter für Open-Air-Pins | einzige **Live**-Abfrage der App |
| **mundraub.org** | — | Ernteorte | verlinkt, nicht kopiert |

### Warum fast alles eingepflegt statt live abgefragt wird
Jede Live-Abfrage überträgt die IP des Besuchers an einen fremden Server, muss in die
Datenschutzerklärung und macht die Seite abhängig. Termine ändern sich täglich — die holt
deshalb das nächtliche Skript und legt sie als Datei ab. Haltestellen und Baudenkmäler ändern
sich über Jahre kaum — monatlich genügt. Nur das Wetter muss live sein, weil eine Vorhersage
von gestern wertlos ist.

---

## 3. Noch nicht erschlossen (Kandidaten mit Bewertung)

| Kandidat | Status | Anmerkung |
|---|---|---|
| **iCal-Export aachen.de** (1427 Events, mit Adressen!) | ⏸ wartet auf Freigabe | `X-Robots-Tag: noai`, keine Lizenzangabe → Anfrage an offenedaten@mail.aachen.de liegt in todos.md (Text 6). **Größter Hebel überhaupt.** |
| **Kinostarts** (Kinopolis, Cineplex, Apollo) | 🔎 zu prüfen | Ketten-Websites sind oft JS-gerendert. Erst robots.txt, dann ob es einen JSON-Endpunkt gibt. Apollo läuft bereits über die Tribe-API. |
| **openairaachen.de** | 🔎 zu prüfen | Domain existiert. Struktur unbekannt — wahrscheinlich saisonal und klein genug für einen einfachen Parser oder Handpflege. |
| **Neueröffnungen** (Läden, Restaurants) | 🔎 schwierig | Keine saubere Quelle. Realistisch: OSM-Objekte mit jungem `start_date`, Lokalpresse per LLM-Recherche, oder Meldungen der Betreiber selbst. |
| **AVV/ASEAG GTFS** | offen | Abfahrtszeiten je Haltestelle. Die Linien haben wir schon aus OSM — der Zusatznutzen wäre gering. |

---

## 4. Neue Stadt aufschalten — Reihenfolge

1. **`venues.json`**: Eintrag unter `staedte.<schluessel>` anlegen mit `name` und `bbox`.
2. **Spielstätten sammeln** (das ist die eigentliche Arbeit): 20–35 Häuser mit geprüften
   Koordinaten. Ohne sie verwirft das Skript jeden Termin ohne Ortsangabe.
   Koordinaten aus OpenStreetMap holen, nicht raten.
3. **Quellen suchen**, in dieser Reihenfolge des Aufwands:
   - Hat die Stadt eine offene Termin-API oder einen iCal-Export? (Bürgerbüro/Open Data fragen)
   - Gibt es rausgegangen.de für die Stadt? Dann Rubriken eintragen — der Parser ist fertig.
   - Nutzen die Häuser WordPress mit „The Events Calendar"? Test:
     `https://<domain>/wp-json/tribe/events/v1/events` — liefert das JSON, ist man fertig.
   - Ticketshops der Clubs (Bigcartel, pretix, Reservix) haben oft offene JSON-Endpunkte.
4. **`STADT=<schluessel> node scripts/update-pins.mjs`** laufen lassen und das Log lesen:
   Es sagt pro Quelle, wie viele Termine kamen und wie viele mangels Ort verworfen wurden.
5. **`orte-aktualisieren.mjs`** einmal laufen lassen — Haltestellen und Ortswissen kommen
   dann von selbst, ohne Konfiguration.
6. **Beispiel-Pins** für den Start: Eine leere Karte wirkt kaputt. Titel mit `[Beispiel]`
   beginnen — die App blendet sie automatisch aus, sobald genug echte Pins da sind.

### Was sich NICHT ändern muss
Code. Alle stadtspezifischen Angaben stehen in `venues.json`. Das ist der Punkt der Übung:
Die zweite Stadt soll ein Nachmittag Datenarbeit sein, kein Umbau.

---

## 5. Erfahrungen, die Zeit gekostet haben

- **Overpass drosselt hart** (HTTP 429) und lässt abgebrochene Abfragen serverseitig
  weiterlaufen. Zwei Server im Wechsel, Einzelabfragen statt eines großen Blocks.
- **Buslinien stehen nicht am Haltestellen-Knoten**, sondern in Routen-Relationen
  (7 von 2952 Knoten hatten `route_ref`). Zweite Abfrage über `rel(bn.h)`.
- **Namensähnlichkeit allein ordnet falsch zu.** „Grenzlandtheater Aachen" fing den
  Stadtknoten *Aachen* ein. Objekte mit `place`- oder `highway`-Tag ausschließen.
- **Kulturkalender liefert HTML-kodiert** (`&#8222;` statt `„`). Erst dekodieren, dann
  Titel aufbereiten — sonst greifen die Anführungszeichen-Regeln nicht.
- **Wikimedia-Vorschaubilder** gibt es nur in bestimmten Breiten: 960 px liefert ein Bild,
  800 px antwortet mit HTTP 400. Immer die `thumburl` aus der API nehmen.
- **Eine Quelle darf nie den ganzen Lauf beenden.** Genau daran starben die nächtlichen
  Läufe vom 11.–13.08.: Ein Aussetzer der LLM-Recherche riss vier funktionierende Quellen mit.
