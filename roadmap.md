# Roadmap Eventlas

Diese Datei bei neuen Chats mit Claude hochladen — sie ist das Projektgedächtnis.

## 🟢 LIVE: https://eventlas.netlify.app (seit 08.08.2026)
**Seit 14.08. verbunden mit GitHub** — jeder Push geht automatisch live, Hochladen entfällt.
`upload-vorbereiten.cmd` und der Ordner `Upload/` bleiben nur noch als Notnagel liegen.
Zum Live-Bestand gehören: `index.html`, `pins.json`, `orte.json`, `manifest.json`, `sw.js`,
`flyer.html`, `og.png`, die Icons, `schriften/` und `bilder/`.

## 🔧 Auftragsliste vom 14.08. (Nutzer) — Reihenfolge nach Dringlichkeit
| # | Was | Status |
|---|---|---|
| 4 | **Tägliche Fehlermail abstellen** | ✅ 14.08. |
| 8 | **Onboarding blockiert die Karte** | ✅ 14.08. |
| 7 | **DAS DA Theater und Südoase aufnehmen** | ✅ 14.08. |
| 2 | **Code-Diebstahl erschweren** | ✅ 14.08. |
| 1 | **Liste auf dem Handy**: Zurück-Geste, Karte sichtbar, Bereiche erkennbar, filterbar | ✅ 14.08. |
| 5 | **Filter auf dem Handy präsenter** | ✅ 14.08. (in der Liste) |
| 6 | **Clustering empfindlicher**, gleicher Ort → direkt Liste | ✅ 14.08. |
| 3 | **Pin melden: Ortauswahl sofort** ✅, Nutzer legen Einträge selbst an | siehe B7 unten |

## 🔧 Auftragsliste vom 14.08., zweite Runde
| # | Was | Status |
|---|---|---|
| B1 | **Zeitfilter aufräumen:** „Heute" zeigt nur noch, was nicht schon vorbei ist → „Abend" wird dadurch überflüssig und entfällt | 🔨 |
| B2 | **Kategorie-Filter (Events/Angebote/Hilfe/Spots) entfernen** — wird nicht gebraucht | 🔨 |
| B3 | **Beispiel-Gesuche entfernen** | 🔨 |
| B4 | **Profil-Knopf absetzen** von den übrigen Symbolen | 🔨 |
| B5 | **Ticketkauf verlinken, mit Preisangabe** | 🔨 |
| B6 | **Neue Quellen:** rausgegangen breiter ✅ · Kinostarts/Neueröffnungen/openairaachen 🔎 geprüft, siehe Handbuch | teilweise |
| B7 | **Pins bestätigen ohne Supabase:** Formular → Mail mit fertigem JSON + .ics | ✅ 15.08. |
| B8 | **Fotos und Kommentare aus dem Netz** einbinden, soweit rechtlich sauber | siehe Grenze unten |
| B9 | **Quellen-Handbuch** für die nächste Stadt | ✅ [quellen-handbuch.md](quellen-handbuch.md) |

### Zu B1: warum „Abend" entfallen kann
Der Filter war eine Krücke gegen ein anderes Problem: „Heute" zeigte auch das, was um 10 Uhr
begonnen und um 12 Uhr geendet hat. Wenn „Heute" stattdessen ab **jetzt** rechnet, steht um
19 Uhr von selbst nur noch das da, was am Abend läuft — ein eigener Abendfilter wäre dann
dieselbe Liste unter anderem Namen. Ein Chip weniger, und die verbleibenden stimmen immer.

Ausgenommen bleiben Pins **ohne Uhrzeit** (Wochenmarkt „vormittags", Ausstellungen): Ohne
belastbare Zeitangabe wäre das Ausblenden geraten. Sie rutschen ans Ende statt zu verschwinden.

### Zu B2: warum die Kategoriezeile weg kann
Vier Chips für event/angebot/hilfe/spot kosten dauerhaft Platz, obwohl Form und Farbe der
Marker dieselbe Information tragen. Die Themen-Chips (Musik, Kultur, Markt …) sind das, wonach
Leute tatsächlich filtern. Die Kategorien bleiben in den Daten und in der Legende erhalten —
nur die Filterzeile entfällt.

### Zu B7: Bestätigen per Mail statt per Datenbank
Deutlich einfacher als Supabase und ohne laufende Kosten: Eine Meldung erzeugt eine
**strukturierte Mail** an dich (feste Felder, Koordinaten, fertiger JSON-Block zum Einfügen)
plus optional einen **Kalendereintrag als .ics**. Dein Mail-Assistent kann daraus direkt einen
Termin anlegen. Vorteil gegenüber der Datenbank: keine Moderationsschulden, keine Haftung für
ungeprüfte Fremdinhalte (§ 10 DDG), kein zusätzlicher Dienst im Datenschutztext.

### Zu B8, ehrliche Grenze
Fotos und Kommentare von Google Maps, Instagram oder TripAdvisor sind **nicht** frei
übernehmbar — deren Nutzungsbedingungen untersagen das Auslesen ausdrücklich, und an fremden
Fotos hängen Urheberrechte. Was geht: freie Quellen einbinden (Wikimedia Commons, OSM-Fotos,
Veranstalter-Material mit Erlaubnis) und alles andere **verlinken statt kopieren**. Genau so
läuft es schon bei Wikipedia und den Ortsfotos.

### Zu Nr. 2 vorab, damit die Erwartung stimmt
Eine Web-App wird im Browser des Besuchers ausgeführt — der Quelltext **muss** dorthin
übertragen werden, sonst läuft nichts. Vollständig verhindern lässt sich das Kopieren daher
nicht, bei keiner Website, auch nicht bei Google. Was wirklich hilft, ist eine Mischung aus:
- **Rechtlich** (der eigentliche Schutz): Urheberrecht besteht automatisch, aber ein sichtbarer
  Copyright-Hinweis + `LICENSE`-Datei machen eine Übernahme angreifbar statt geduldet.
  Dazu die laufende **Markenanmeldung** — sie schützt den Namen, und der ist das Wertvolle.
- **Praktisch:** Minifizierung macht das Weiterentwickeln fremden Codes unattraktiv.
- **Inhaltlich:** Der echte Wert steckt nicht im Code, sondern in den gepflegten Daten
  (`pins.json`, `venues.json`, `orte.json`) und in der lokalen Präsenz. Der Code ist in ein
  paar Tagen nachgebaut, die Datenpflege nicht.

Was **nicht** hilft und deshalb nicht gebaut wird: Rechtsklick sperren, Tastenkürzel abfangen,
„DevTools-Erkennung". Das kostet Barrierefreiheit und hält niemanden auf, der kopieren will.

## Status (Stand 08.08.2026 — großer V2-Umbau durch KI-Agent)
- **index.html komplett neu gebaut** — alle 24 Features der Prioritätenliste vom 07.08. sind
  umgesetzt oder entschieden (Details unten). Lokal getestet (Mobile + Desktop), null Konsolenfehler.
- **pins.json: 64 verifizierte Pins** (30 Events bis Ende September, 22 Angebote inkl. 21 Ernte-/
  Saisonorte, 2 Hilfe-Beispiele, 10 Fotospots). Jede Angabe mit Quell-URL, Recherche 08.08.2026.
- **Auto-Update-Skript v2** (scripts/update-pins.mjs): feste Pins bleiben erhalten (`fest:true`),
  90-Tage-Pruning, neue Zweitquelle Kulturkalender-API, neues Schema.
- **flyer.html fertig** (A6 druckfertig, QR baut sich clientseitig): nach Netlify-Upload nur noch
  `KARTEN_URL` im Skript-Kopf eintragen → Strg+P → PDF → Copyshop (100 × A6, 300 g).
  Verteilung: Wochenmarkt samstags, Cafés Oppenhoffallee, Alleenfest 29./30.08.
- Launch-Ziel bleibt: bis 22.08., Anker Alleenfest 29./30.08. Oppenhoffallee.
- Offen (Nutzer): Netlify-Upload (jetzt **index.html + pins.json zusammen**), Impressum,
  DPMA Di 11.08., eigene Mail-Adresse → siehe todos.md.

## Wie die Karte jetzt funktioniert (V2-Architektur)
- **Kategorien (4, feste Chip-Reihe):** `event` (türkis, Kreis, Kalender-Icon) · `angebot`
  (orange, Quadrat, Geschenk) · `hilfe` (gelb, Raute, Herz) · `spot` (violett, Ring, Kamera).
  Form + Icon + Farbe → auch für Farbenblinde unterscheidbar. Altes `aufgabe` = `hilfe`.
- **Themen (genau 7, überschneidungsfrei — Stand 08.08. nach drittem Nutzertest):**
  | Tag | Was hinein gehört |
  |---|---|
  | `musik` | Konzerte, Clubnächte, DJs, Livemusik, Oper, Chor *(früher musik + party)* |
  | `kultur` | Theater, Museum, Ausstellung, Lesung, Kino, Comedy, Führungen |
  | `fest` | Stadt-/Straßenfeste, Kirmes, CSD — das Feiern selbst ist der Anlass |
  | `markt` | Wochenmarkt, Flohmarkt, Trödel, Antik, Food *(früher flohmarkt + essen)* |
  | `sport` | Spiele, Läufe, Turniere, Sport im Park |
  | `familie` | Programm für Kinder und Familien |
  | `natur` | Ernte, Selbstpflücke, Natur-Erlebnis |

  **Bewusst KEINE Tags:** `kostenlos` (Eigenschaft → Meta-Zeile + Volltextsuche),
  `saisonal` (ergibt sich aus dem Feld `saison`), `fotospot`/`hilfe`/`verschenken`
  (Doppelung zur Kategorie-Reihe darunter). Unbekannte Tags werden beim Laden verworfen —
  so bläht auch das Auto-Update die Leiste nicht wieder auf.
- **Pin-Schema:** `tags[]`, `quelle` (Beleg-URL im Popup), `link` (CTA), `hot` (🔥-Puls),
  `hinzu` (für Neu-Badge), `saison {von,bis}` (jährlich wiederkehrend, MM-TT), `fest` (Auto-Update
  löscht nie), `wdh`, `start/ende`.
- **Zeitfilter:** Heute | 🌙 Abend | Demnächst (30 Tage) | Alle (alles Kommende) — rollierende Fenster statt
  Jahresfilter, damit der Jahreswechsel nie bricht. Abgelaufenes wird nie angezeigt; das
  Update-Skript räumt Einträge >90 Tage nach Ende aus der Datei (Nr. 13).
- **Filter:** Tag-Chips (dynamisch aus den Pins, mit Emoji), Kategorie-Chips mit Icons + Zählern,
  Zähler beziehen sich auf den sichtbaren Kartenausschnitt (Nr. 16). Fällt ein geklickter Pin aus
  dem Filter, schließt sein Popup automatisch (Nr. 12).
- **Suche** (Lupe oben): Volltext über Titel/Text/Tags + Zeit-Schlagwörter "heute", "morgen",
  "wochenende" (Nr. 17). Dazu **📅 Zeitraum-Chip** (eigenes Von/Bis) und **☰ Listenansicht**
  (zeigt exakt die gezählten Pins im Ausschnitt, Antippen springt zur Karte) sowie
  **✕ Zurücksetzen-Chip**, sobald ein Filter aktiv ist (alle drei aus dem User-Test 08.08.).
- **Popup:** Quellverweis, 📍-Route (Google-Maps-Deeplink = GPS/Navi, Nr. 23), 👍 Danke,
  ↗ Teilen (Web-Share mit Deep-Link `#pin=<id>`), bei Fotospots ☀️ Goldene Stunde (clientseitig
  berechnete Sonnenzeiten, NOAA-Näherung ±3 Min, Nr. 6).
- **Melden** (Nr. 9/19/24): Knopf → Wahl "Ort auf Karte" oder "Plakat-Foto". Ort gewählt →
  senden über das ＋-Icon UND den Knopf, jeweils WhatsApp **oder** E-Mail. Plakat-Foto:
  Kamera/Galerie → Web-Share-API direkt zu WhatsApp/Mail (Fallback: vorbereitete Nachricht).
  WhatsApp-Nummer aktualisiert: 4915254170703.
- **Profil (nur lokal, DSGVO-minimal):** Onboarding-Sheet beim ersten Öffnen (Interessen),
  implizites Lernen über Pin-Klicks, "✦ Für dich"-Modus hebt passende Pins hervor. Rang/Punkte
  (Danke, Teilen, Meldungen, Ideen = Inzentivierung Nr. 20, ohne Server). Heimat-Bereich mit
  Radius → beim Öffnen "✨ N neue Pins in deinem Bereich" (lokale Variante von Nr. 22).
  Alles unter ⓘ → Profil zurücksetzbar.
- **💡-Knopf** (Nr. 18): Ideen-Modal → WhatsApp/Mail.
- **Merkliste:** ★ Merken im Popup + Filter-Chip "★ Gemerkt" (lokal). **Kalender-Export:**
  📅-Knopf erzeugt .ics clientseitig für jeden datierten Pin (beides am 08.08. nachgereicht).
- **Multi-Stadt vorbereitet** (Nr. 15): `STAEDTE`-Konfig + URL-Parameter `?stadt=`, Aachen ist
  Standard. Neue Stadt = ein Konfig-Eintrag + eigene Pins-Datei.
- **Sicherheit:** alle Pin-Felder werden HTML-escaped (wichtig, weil pins.json automatisch
  generiert wird); Links nur http(s).
- Dev-Server für lokale Tests: `.claude/serve.ps1` (PowerShell, Port 8123) — kein Node nötig.

## Entscheidung eventlas.com / Facebook "Eventlas" (Nr. 1 — recherchiert 08.08.)
**NICHT verlinken, nicht integrieren.** Befund: eventlas.com ist ein anonymer englischsprachiger
SEO-Blog (WordPress, AdSense), Inhalte großteils 2023–2025, seit März 2026 eingefroren (Feed 404),
Facebook-Seite seit Nov 2023 tot (358 Follower), kein DE/EU-Bezug, kein Impressum. Verlinken würde
Verwechslungsgefahr schaffen und die eigene Marke verwässern. **Markenrisiko für DPMA-Anmeldung:
niedrig** (TMview 08.08.: keine Marke "Eventlas" in DE/EU/IR; ausländische unregistrierte Nutzung
begründet ohne Verkehrsgeltung in DE keine älteren Rechte — keine Rechtsberatung). Anmeldung
11.08. wie geplant durchziehen, sie sichert die Priorität. Einschränkung: .com ist bis Feb 2027
vergeben → international ggf. .app/.eu/eventlas.de-Subdomains.
**Umgang mit anderen Initiativen (Grundsatz):** verlinken statt kopieren, Kooperation anbieten,
niemals fremde Texte/Fotos übernehmen — bei Namensgleichheit zusätzlich: klare Trennung, keine
Bezugnahme. Für internationale Events später bessere Quellen: Ticketmaster Discovery API,
OpenAgenda, offizielle Tourismusportale.

## Spielstätten-System (venues.json) — Schlüssel für Konzerte & andere Städte
**Problem, das es löst:** Häuser mit wechselndem Programm (Musikbunker, Eurogress, FRANZ, Südoase …)
tauchen bei allgemeiner Websuche kaum auf — deshalb fehlten Konzerte fast komplett.

**Lösung:** `venues.json` listet pro Stadt die Spielstätten mit **geprüften Koordinaten**,
Programm-URL, Art und Tags. Das Update-Skript
1. schreibt diese Liste in den Rechercheauftrag ("prüfe gezielt das Programm dieser Häuser"),
2. **snappt** gefundene Events auf die hinterlegten Koordinaten (Ende geratener Positionen),
3. warnt im Log, wenn kaum Musik-Pins herauskommen (→ Programmseite tot/umgezogen).

**Neue Stadt aufschalten** (ohne eine Zeile Code):
1. In `venues.json` unter `staedte` einen Eintrag anlegen: `name`, `bbox`, optional `kulturApi`,
   dazu die Spielstätten mit `name`, `lng`, `lat`, `programm`, `tags`, optional `aliase`.
2. Update-Skript mit `STADT=<schluessel>` starten (GitHub-Action-Variable).
3. In `index.html` → `STAEDTE` denselben Schlüssel ergänzen (Zentrum + Zoom + Pins-Datei).
Aufruf dann über `?stadt=<schluessel>`.

**Automatische Quellen (Stand 08.08., alle ohne Browser nutzbar):**
| Quelle | Was | Hinweis |
|---|---|---|
| `rausgegangen.de/aachen/kategorie/konzerte-und-musik/` | ~57 Konzerte, 2 Seiten | robots.txt erlaubt ClaudeBot ausdrücklich, Crawl-Delay 10 s wird eingehalten; Venue + Datum stehen in der Kachel |
| `api.bigcartel.com/musikbunkeraachen/products.json` | Musikbunker-Tickets | echtes JSON; Datum steckt im Produktnamen (`// TT.MM.JJJJ`) |
| `aachen-kalender.de/wp-json/tribe/events/v1/events` | stadtweit | deckt sogar Kneipen ohne eigene Website ab (Schlüsselloch, Café Kittel) |
| `mubu.ac`, `raststaette.org`, `ludwigforum.de` (je `/wp-json/tribe/…`) | hausgenau | sauberes JSON |
| `api.kulturkalender-aachen.de/events` | 7 städtische Museen | nur ~7 Konzerte im Bestand — als Konzertquelle untauglich |

**Nicht automatisierbar (manuell pflegen):** Theater Aachen (AJAX-Kalender), Südoase (TLS-Zertifikat
defekt), Nachtschicht (nur Facebook). **Redirect-Fallen:** eurogress-aachen.de → aachen-event.com,
theater-aachen.de → theateraachen.de (ohne Bindestrich), az-aachen.**de** (nicht .org).

**Pflege:** Vier Einträge tragen noch `"koordinaten_pruefen": true` (Grenzlandtheater, Saalbau
Rothe Erde, Barbarossa, Café Vers) — beim nächsten Durchgang verifizieren und das Flag entfernen.

## Deploy-Kette (geschlossen seit 14.08.)
```
GitHub Action (täglich 05:30 UTC)
   └─ recherchiert → schreibt pins.json → committet ins Repo
        └─ Netlify (mit dem Repo verbunden) baut und veröffentlicht automatisch
             └─ Live-Seite zeigt die neuen Termine
```
Die Kette hatte **drei** unabhängige Bruchstellen. Alle drei sahen für sich genommen aus wie
„das Update funktioniert nicht", hatten aber nichts miteinander zu tun:

| # | Bruchstelle | Symptom | behoben |
|---|---|---|---|
| 1 | Netlify war nie mit dem Repo verbunden | Action grün, Live-Seite alt | 14.08. (Nutzer) |
| 2 | Aktueller Stand nicht gepusht | Action lief mit dem Skript vom 08.08. | 10.08. |
| 3 | Recherche brach den ganzen Lauf ab | Action rot, 11.–13.08. gar kein Update | 14.08. |

**Zu Nr. 3 (der teuerste):** `claudePins()` war die einzige der fünf Quellen ohne Auffangnetz —
vier `process.exit(1)`, wo alle anderen bei einem Fehler still ein leeres Array liefern. Ein
Aussetzer der Anthropic-API beendete damit alles, obwohl Kulturkalender, Musikbunker und die
Tribe-Kalender einwandfrei lieferten. Rund 144 Termine gingen dadurch nie live.
Jetzt: Die Recherche darf ausfallen, der Lauf geht weiter, der Ausfall landet als Warnung in der
Zusammenfassung. Umgekehrt bricht der Lauf ab, wenn **keine** Quelle etwas liefert — sonst würden
die alten Pins nur mit neuem Datum zurückgeschrieben und Stillstand sähe aus wie Erfolg.

**Merke:** Nach jeder Änderung an `scripts/`, `venues.json` oder `index.html` muss gepusht
werden — sonst arbeitet die nächtliche Action mit einem veralteten Stand weiter, ohne zu meckern.
Der Workflow prüft das Ergebnis (Pin-Anzahl, Koordinaten, gültige Tags) und committet bei
Auffälligkeiten gar nicht erst, damit eine kaputte Datei nie live geht.

**Modellname ist eine Zeitbombe:** Fest verdrahtet war `claude-sonnet-4-6`. Wird ein Modell
abgekündigt, scheitert der Lauf jede Nacht neu. Jetzt `claude-sonnet-5`, umstellbar ohne
Codeänderung über die Repo-Variable `EVENTLAS_MODELL` (Settings → Secrets and variables →
Actions → Variables). Sieht ein Fehler nach Modellproblem aus, sagt das Log es ausdrücklich.

## Content-Pipeline (aktualisiert 08.08.)
**Automatisch (GitHub Action, täglich 05:30 UTC):** scripts/update-pins.mjs
1. Feste Pins (`fest:true`) bleiben immer: Fotospots, Ernteorte, Beispiele, Wochenmärkte, Alleenfest.
2. Kulturkalender-API `api.kulturkalender-aachen.de/events` (undokumentiert, CORS *, 7 städtische
   Häuser mit fester Koordinaten-Map) → Kultur-Pins der nächsten 45 Tage, ohne LLM.
3. Konzertquellen ohne LLM: rausgegangen.de, Bigcartel-Shop des Musikbunkers, Tribe-Kalender.
4. Claude + Websuche für den Rest (neues Schema, Quelle pro Pin Pflicht, keine Geschäfte).
   **Darf ausfallen** — siehe Deploy-Kette Nr. 3.
5. Merge + Dedupe (Titel+Datum), `hinzu` bleibt bei bekannten Pins stabil, 90-Tage-Pruning.

**Titel aus dem Kulturkalender brauchen Nacharbeit (14.08.):** Die Stadt liefert Katalog-
schreibweise und HTML-kodiert — `&#8222;Alles Anders&#8220; &#8211; Eine Musicalproduktion`
oder `Reit WM 2026 – Rahmenprogramm. „Ms. Jeanna Magic".` Reihenfolge der Aufbereitung ist
wichtig: **erst** Entities dekodieren (Node kann das nicht von selbst), **dann** Anführungs-
zeichen auswerten — sonst findet die Titelbereinigung die Zeichen gar nicht, weil sie noch als
`&#8222;` dastehen. Regel: Was in Anführungszeichen steht, ist der Titel; alles davor und
dahinter wandert in den Beschreibungstext. Ergebnis auf 104 Pins: keine Entities, keine
Anführungszeichen, keine Schlusspunkte, maximal 70 Zeichen.

**Beste ungenutzte Quelle (V2.6-Kandidat):** offizieller iCal-Export des aachen.de-Kalenders —
`https://www.aachen.de/kalender/veranstaltungskalender-alle-termine/event.ics?weekends=false&tagMode=ALL`
(1427 Events, mit Straßenadressen!). Haken: keine Lizenzangabe + `X-Robots-Tag: noai` →
**erst Freigabe bei offenedaten@mail.aachen.de erfragen** (Mailtext liegt in todos.md, Text 6).
Danach: ICS-Parser + Venue-Geokodierung (einmalig cachen) = echte Vollautomation, legal.
Kein offener Veranstaltungsdatensatz auf offenedaten.aachen.de/open.nrw/govdata (geprüft 08.08.).

**Manuell weiterhin:** Nutzer-Meldungen per WhatsApp/Mail prüfen und als Pin (mit `fest:true`,
damit das Auto-Update sie nicht verliert!) in pins.json eintragen.
**Prüf-Prozess eingehende Meldungen (Nr. 9):** 1) Link/Absender plausibel? 2) Ort existiert?
3) Kein Kommerz-Spam, keine fremden Rechte? → dann eintragen; im Zweifel nachfragen oder ablehnen.
Automatische Übernahme ohne Prüfung erst mit Backend + Moderation (V3).

## Kleinanzeigen & nebenan.de (unverändert: KEIN Crawler)
Keine offenen APIs, Auslesen verstößt gegen AGB. Einbau über Nutzer-Meldung mit Link zur eigenen
Anzeige — verlinken ist erlaubt. Wachstum manuell und sparsam (Einzel-Anschreiben, keine Massen-DMs).

## Offene Fragen an den Betreiber (Antworten bitte in todos.md abhaken)
1. **E-Mail-Adresse:** Aktuell steht nikolas.voth92@gmail.com öffentlich im Melde-Flow der Seite.
   Empfehlung: eigene Adresse (z. B. eventlas.aachen@gmail.com oder später hallo@eventlas.de)
   anlegen und in index.html → KONFIG.mail eintragen.
2. **WhatsApp-Privatnummer (Nr. 19):** eingebaut wie gewünscht (015254170703). Empfehlung:
   **WhatsApp Business App** auf derselben Nummer (kostenlos, getrenntes Firmenprofil,
   Autoantworten, Labels) — oder später separate Prepaid-/eSIM-Nummer. Entscheidung offen.
3. **Google-Login (Nr. 21):** bewusst NICHT in V2 (Anmeldehürde killt QR-Scans, und ohne Backend
   bringt er nichts). Sinnvoll erst mit Backend: Konto = gemeldete Pins verwalten + Mail-Benach-
   richtigungen + Gewerbe-Profile für Featured Pins. Als V3 eingeplant — ok so?

## V3-Kandidaten (unpriorisiert)
- **ICS-Import aachen.de** nach Freigabe (siehe oben) — größter Hebel für Datenqualität
- Formular + kleines Backend für Pin-Meldungen (ab ~20 Meldungen/Woche); erst damit werden möglich:
  echte Web-Push-Notifications (Nr. 22 voll), Google-Login (Nr. 21), serverseitige Danke-Zähler /
  Reputation (Nr. 20 voll), automatische Pin-Übernahme nach Validierung (Nr. 9 voll)
- **Plakat-Foto → Auto-Pin (Stufe B):** Serverless-Funktion ruft Claude-Vision auf → Pin-Entwurf
  zur Freigabe. Stufe A läuft bereits: Foto kommt per WhatsApp/Share, Claude liest es beim Update.
  Plakatfoto selbst NIE veröffentlichen (Urheberrecht).
- Push/WhatsApp-Broadcast "Neue Pins für deine Interessen"
- Featured-Pin-Verwaltung für zahlende Händler
- Zweite Stadt aufschalten (Architektur steht: STAEDTE-Eintrag + pins-<stadt>.json)

## Neue Feature-Ideen (gesammelt 08.08.)
- ~~**Cluster-Vorschau**~~ ✅ umgesetzt: Antippen listet die enthaltenen Pins nach Spielstätte
  gebündelt auf ("49 Pins an dieser Stelle → Centre Charlemagne · 30").
- ~~**„Heute Abend"-Schnellfilter**~~ ✅ umgesetzt 14.08. — siehe unten.
- **Relevanz-Sortierung auch auf der Karte:** unwichtige Pins bei weitem Zoom ausblenden statt
  clustern (weniger Klickarbeit, aber weniger transparent — erst testen).
- **Embed-Widget:** Karte als iframe für wir-frankenberger.de / Café-Websites → Reichweite.
- **Mehrsprachig EN/NL** für die Euregio (Vaals ist 10 Min entfernt).
- **Saison-Push:** "🍏 Brombeeren sind jetzt reif" als Insta-Story-Vorlage automatisch aus den
  Saisondaten erzeugen (Content-Marketing ohne Aufwand).
- **Statistik ohne Tracking:** Netlify-Analytics (serverseitig) reicht für Launch-KPIs.
- **Marker-Spreizung bei Überlappung:** Am Katschhof liegen mehrere Pins fast übereinander —
  bei Klick auffächern (Spiderfy) oder bei niedrigem Zoom leicht versetzen.

## Auftrag 14.08. im Detail (Nummern wie in der Tabelle oben)

### 1 — Liste auf dem Handy überarbeiten
Vier Teilprobleme, die zusammen die Hauptnavigation auf dem Handy ausmachen:
- **Zurück-Geste:** Wischen von der Bildschirmkante schließt derzeit die ganze Seite statt der
  Liste. Lösung: beim Öffnen einen `history.pushState`-Eintrag setzen, `popstate` schließt die
  Liste. Gleiches Muster für das Detail-Sheet und die Modals — sonst wird es inkonsistent.
- **Karte sichtbar lassen:** Die Liste darf nicht den ganzen Bildschirm füllen. Oben ein
  Kartenstreifen bleibt stehen und ist antippbar zum Schließen (wie Google Maps / Airbnb).
- **Bereiche erkennbar machen:** Sichtbare Abschnittsköpfe („Heute Abend", „Als Nächstes",
  „Dauerhaft") statt einer durchlaufenden Liste — man muss sehen, was man gerade ansieht.
- **In der Liste filtern:** Filterzeile direkt in der Liste, ohne sie schließen zu müssen.

### 2 — Code-Diebstahl erschweren
Einordnung siehe oben. Konkret umzusetzen:
- `LICENSE`-Datei (proprietär, alle Rechte vorbehalten) + Copyright-Kommentar im Quelltext
- Sichtbarer Hinweis im ⓘ-Fenster: Inhalte und Gestaltung urheberrechtlich geschützt
- Minifizierung im Netlify-Build (Quelle im Repo bleibt lesbar, ausgeliefert wird kompakt)
- **Nicht** umgesetzt: Rechtsklicksperre und DevTools-Erkennung (schaden mehr, als sie nützen)

### 3 — Pin melden: direkter und selbstbedienbar
- **Ortauswahl sofort:** Der Zwischenschritt entfällt, die Karte geht direkt in den
  Setzen-Modus. Der Ort ist die einzige Angabe, die man auf der Karte machen *muss*.
- **Nutzer legen Einträge selbst an:** Neue Supabase-Tabelle `vorschlaege` (gleiche Bauart wie
  `kommentare`: anon darf einfügen, aber nicht lesen, was noch nicht geprüft ist). Eingereichte
  Pins landen dort mit Status `neu`.
- **Prüflauf:** Ich hole die offenen Vorschläge, prüfe sie (Ort plausibel? Rechte? Kein
  Kommerz-Spam?) und trage die guten mit `fest:true` in `pins.json` ein — danach Bescheid.
  Wichtig: **Das läuft nicht automatisch, sondern wenn du mich darum bittest.** Ein Agent, der
  ungeprüft veröffentlicht, wäre nach § 10 DDG ein Haftungsrisiko.

### 4 — Tägliche Fehlermail (im Screenshot vom 14.08.)
Zwei Dinge, die nichts miteinander zu tun haben:
- **Node-20-Warnung:** `actions/checkout@v4` und `setup-node@v4` laufen auf Node 20, das
  GitHub abkündigt. Auf `@v5` heben.
- **Der Fehlschlag selbst:** „Voraussetzungen prüfen" war grün, der Schlüssel ist also da —
  das Skript stürzt danach binnen Sekunden ab. Ohne Log-Zugriff (die API gibt sie nur mit
  Token heraus) ist die Ursache nicht direkt lesbar, deshalb: Das Skript schreibt seine
  Ausgabe künftig **selbst in die Job-Zusammenfassung**, dann steht die Ursache in der Mail.

### 5 — Filter auf dem Handy präsenter
Aktuell klappt die Filterzeile weg und ist schwach sichtbar. Ziel: dauerhaft erreichbar,
mit erkennbarem Zustand („3 Filter aktiv"), ohne mehr Platz von der Karte zu nehmen.

### 6 — Clustering auf dem Handy empfindlicher
Auf kleinen Bildschirmen liegen Marker dichter beieinander als auf dem Desktop, die Zellgröße
ist aber dieselbe. Zwei Änderungen: Zellgröße abhängig von der Bildschirmbreite, und Pins am
**selben Ort** (gleiche Spielstätte) werden nie räumlich aufgefächert, sondern immer sofort
als Liste geöffnet — nebeneinandergelegte Marker desselben Hauses helfen niemandem.

### 7 — Zwei Spielstätten ergänzen
- **DAS DA Theater** — steht schon in `venues.json`, Termine kommen über den Kulturkalender.
- **Südoase** — Website hat ein kaputtes TLS-Zertifikat, daher nicht automatisch auslesbar.
  Vom Nutzer bestätigtes festes Programm, wird als wiederkehrender Pin eingetragen:
  **Do ab 19 Uhr** Live-Jam & Billard (Reggae), **Fr ab 19 Uhr** Live-Jam & Billard (offen).

### 8 — Onboarding blockiert die Karte
Beim ersten Aufruf liegt die Interessen-Abfrage über dem ganzen Bildschirm. Das ist die
schlechteste Stelle für eine Hürde: Wer über einen QR-Code kommt, will die Karte sehen, nicht
ein Formular. Neu: Karte sofort sichtbar, Personalisierung über einen **Profil-Knopf (Männchen)
oben rechts** — Interessen, Wohnort, Kartenstil. Der Kurz-Hinweis für Neulinge bleibt, aber
als kleiner Streifen, den man wegtippen kann.

## Kartenanbieter: Warum NICHT Google Maps (recherchiert 09.08.2026)
**Entscheidung: Bei MapLibre + OpenFreeMap bleiben.** Drei Varianten geprüft:

| | Google My Maps | Google Maps JS API | **MapLibre + OpenFreeMap (jetzt)** |
|---|---|---|---|
| Kosten | 0 € | 10.000 Kartenaufrufe/Monat frei, danach **7 $/1.000** | **0 €, unbegrenzt** |
| Abrechnungskonto | nein | **Kreditkarte zwingend**, auch im Freikontingent | nein |
| Cookie-Banner nötig | ja | ja | **nein** |
| Offline-PWA | nein | **von den ToS verboten** (Caching-Verbot) | ja |
| Eigene Filter/Zeitlogik | **nein** (max. 10 Ebenen, keine Facetten) | ja | ja |
| Automatisches Update | **nein** (keine API mehr) | ja | ja |
| Eigenes Design | nein | eingeschränkt, Google-Branding Pflicht | **frei** |

Die drei Ausschlussgründe, in dieser Reihenfolge:
1. **Cookie-Banner.** Google Maps überträgt Daten in die USA, bevor die Karte erscheint → in DE
   einwilligungspflichtig (§ 25 TDDDG; LG München 3 O 17493/20 zu Google Fonts, VG Hannover
   10 A 5385/22, OLG Frankfurt 11.12.2025). Das zerstört die Kern-Journey „QR scannen → Karte in
   2 Sekunden". OpenFreeMap dagegen: keine Cookies, EU-Server (Ungarn), Rechtsgrundlage Art. 6
   Abs. 1 lit. f — kein Banner nötig.
2. **Offline-Betrieb wäre ToS-widrig.** Die Maps-Platform-Bedingungen verbieten das Zwischen-
   speichern von Kartenmaterial — genau das macht unser Service Worker.
3. **Kostenrisiko genau bei Erfolg.** Das alte 200-$-Guthaben wurde im März 2025 abgeschafft.
   Bei 25.000 Kartenaufrufen/Monat wären es rund 96 €, bei 50.000 rund 256 € — monatlich.

**Stattdessen umgesetzt:** Pin-**Export als GeoJSON und KML** (ⓘ → Exportieren). Damit kann jede:r
die Orte in die eigene App holen — Organic Maps und OsmAnd lesen GeoJSON direkt, Google My Maps
importiert KML (GeoJSON kann Google nicht). Ein Multi-Marker-URL-Schema für die Google-Maps-App
existiert nicht; Deep-Links pro Pin (Route) sind bereits eingebaut und bleiben der richtige Weg.

**Nebenbefund, sofort behoben:** Die Seite lud Anton und Inter von `fonts.googleapis.com` —
also genau die Konstellation aus dem LG-München-Urteil. Beide Schriften liegen jetzt lokal
(`schriften/`, 66 KB). Verifiziert: keine Anfrage mehr an Google.

**Zur Nachfrage „geht es nicht doch über die eigene Website?"** — Ja, technisch schon: Die Maps
JavaScript API liefert nur die Kacheln, unser UI (Filter, Sheet, Suche, Clustering) bliebe
komplett erhalten. Die drei Nachteile oben bleiben davon aber unberührt, weil sie nicht am UI
hängen, sondern am Datenfluss zu Google. Wer nur ein anderes Kartenbild will, hat seit 09.08.
den **Stil-Umschalter** (Info → Kartenbild): Standard · Farbig · Ruhig · Dunkel — alle von
OpenFreeMap, EU-gehostet, ohne Cookies. Falls später doch Google-Kacheln gewünscht sind, wäre
der saubere Weg ein Umschalter mit vorgeschalteter Einwilligung nur für diesen Stil.

## Prinzip: Bestehendes einbinden statt selbst erzeugen
Leitgedanke seit 13.08.: Für alles, was es schon frei und verlässlich gibt, bauen wir keine
eigene Datenpflege auf. Voraussetzung ist jedes Mal dieselbe: kostenlos, ohne Anmeldung,
ohne Cookies, EU-nah — sonst kollidiert es mit dem bannerfreien Profil.

| Quelle | Liefert | Status |
|---|---|---|
| **Open-Meteo** | Wetter für Open-Air-Pins (7 Tage) | ✅ eingebaut (live abgefragt) |
| **Wikimedia Commons** | freie Fotos der Wahrzeichen und Fotospots | ✅ 10 Bilder eingepflegt |
| **mundraub.org** | Ernteorte samt Beschreibungen | ✅ eingebaut (verlinkt) |
| **rausgegangen / Tribe-APIs / Bigcartel** | Konzerttermine | ✅ eingebaut |
| **Wikipedia** | Kurzbeschreibungen der Orte | ✅ 19 Beschreibungen in `orte.json` |
| **OpenStreetMap** | Haltestellen + Linien, Barrierefreiheit, Öffnungszeiten | ✅ in `orte.json` |
| **GTFS der AVV/ASEAG** | Abfahrtszeiten je Haltestelle | offen (Linien reichen vorerst) |

Umgekehrt gilt: Was rechtlich nicht sauber übernehmbar ist (Google-Bewertungen, Forenbeiträge,
Presse-Fotos), wird **verlinkt statt kopiert** — siehe die `quelle`-Zeile in jedem Pin.

### Warum eingepflegt statt live abgefragt (Entscheidung 13.08.)
Jede Live-Abfrage überträgt die IP des Besuchers an einen fremden Server und muss in der
Datenschutzerklärung stehen. Bei Wetterdaten ist das unvermeidlich — eine Vorhersage von
gestern ist wertlos. Fotos, Haltestellen und Ortsbeschreibungen ändern sich dagegen über
Jahre kaum. Sie werden deshalb **einmal recherchiert und liegen bei uns**: keine Verbindung
zu Wikimedia, OpenStreetMap oder Wikipedia beim Betrachten, kein Bannerbedarf, offline nutzbar,
und die Karte bleibt schnell. Nachgeführt wird per Skript, nicht von Hand.

### `orte.json` — Ortswissen getrennt von Terminen
| | `pins.json` | `orte.json` |
|---|---|---|
| Inhalt | was **passiert** (Termine) | was der **Ort ist** |
| Erzeugt von | `update-pins.mjs`, täglich | `orte-aktualisieren.mjs`, monatlich genügt |
| Verknüpfung | — | über **Koordinaten** (bis 150 m), nicht über Pin-IDs |

Die Koordinaten-Verknüpfung ist der Kern: Sie überlebt das nächtliche Update (das `pins.json`
komplett neu schreibt) und gilt **automatisch für jede neue Veranstaltung am selben Ort**.
Deshalb haben 143 von 144 Pins eine Anfahrtsangabe, obwohl nur 70 Orte erfasst sind — alle
Konzerte im Musikbunker erben sie von ihrem Ort.

Stand 13.08.: 70 Orte · 69 mit Haltestelle (Median 171 m Luftlinie) · 19 mit Wikipedia-Absatz ·
15 mit Barrierefreiheit · 5 mit Öffnungszeiten.

**Erneuern:** `node scripts/orte-aktualisieren.mjs` (im Projektordner). Braucht Node ≥ 18,
läuft sonst über die GitHub Action `ortsdaten.yml` (Reiter *Actions* → *Run workflow*).

**Fallstricke, die beim Bau Zeit gekostet haben:**
- Overpass drosselt hart (HTTP 429) und lässt eine abgebrochene Abfrage serverseitig
  weiterlaufen. Das Skript weicht deshalb auf `overpass.kumi.systems` aus.
- Eine `around`-Abfrage mit 70 Koordinaten läuft in den Timeout. Eine Bounding-Box-Abfrage
  mit lokaler Zuordnung ist um ein Vielfaches billiger — und liefert dasselbe.
- Buslinien stehen **nicht** am Haltestellen-Knoten (nur 7 von 2952 hatten `route_ref`),
  sondern in den Routen-Relationen. Zweite Abfrage über `rel(bn.h)`, dann auf den
  Haltestellennamen hochrollen — so kamen 44 von 46 Haltestellen zu ihren Linien.
- Reine Namensähnlichkeit ordnet falsch zu: „Grenzlandtheater Aachen" fängt den Stadtknoten
  *Aachen* ein, „Café Kittel" die *Pontstraße*. Objekte mit `place`- oder `highway`-Tag werden
  deshalb ausgeschlossen, und Füllwörter („Markt", „Fotospot", „Konzert") dürfen einen Treffer
  nie allein begründen.
- Wikimedia-Vorschaubilder gibt es nur in bestimmten Breiten: 960 px liefert ein Bild,
  800 px antwortet mit HTTP 400. Immer die `thumburl` aus der API verwenden.

## „Heute Abend"-Filter (14.08.)
Beantwortet die häufigste Frage überhaupt — *was mache ich gleich?* — und ist bei über 250
Terminen der schnellste Weg durch die Menge. Aus 31 Tagesterminen werden 5 Abendtermine.

Bewusst **strenger** als der Uhrzeit-Filter im Zeitraum-Dialog: Dort bleiben Pins ohne
Zeitangabe sichtbar (im Zweifel zeigen), hier fliegen sie raus. Wer „Abend" wählt, will eine
kurze verlässliche Liste — Wochenmarkt, Ausstellung und Fotospot gehören nicht hinein. Ohne
Zahl im Text zählt nur ein ausdrückliches Wort wie „abends" oder „open end".

**Dabei einen älteren Fehler gefunden:** `startMinute()` las Zeitspannen von hinten. Aus
„Sa 7–13 Uhr" wurde 13:00, aus „11–17 Uhr" wurde 17:00 — weil das Wort „Uhr" hinter der
*End*zeit steht und die Einzelzeit-Suche dort zugriff. Zwei Ernteorte tauchten dadurch unter
„Heute Abend" auf. Der Fehler betraf auch den Uhrzeit-Filter seit dem 09.08.: Eine Suche nach
„8–12 Uhr" hätte den Wochenmarkt fälschlich ausgeschlossen. Jetzt werden Zeitspannen zuerst
geprüft, und der Beginn zählt. Acht Formate gegengeprüft („20 Uhr", „20:30", „ab 18 Uhr",
„Mo–Fr 8–18:30 Uhr", ohne Zeit …).

## Kommentare: echtes Gespräch pro Pin (Stand 13.08.)
Jeder Pin hat eine Gesprächssektion. Beiträge werden **in der App** geschrieben und erscheinen
**sofort für alle** — kein Wechsel zu WhatsApp mehr, kein Warten auf Freigabe. Umgesetzt gegen
die REST-Schnittstelle von **Supabase** (kostenlose Stufe, Region Frankfurt), ohne eigenen
Server und ohne zusätzliche Bibliothek. Einrichtung: `scripts/kommentare-setup.sql` + zwei
Werte in KONFIG (Anleitung in todos.md). Solange die Werte fehlen, zeigt die Sektion einen
Hinweis und verweist auf E-Mail — die App funktioniert also auch ohne.

**Sicherheit:** Der öffentliche anon-Key steht im Quelltext; was damit geht, entscheiden allein
die Datenbank-Regeln: sichtbare Beiträge lesen, neue schreiben (2–600 Zeichen), melden, eigene
binnen 24 h löschen. Kein Ändern fremder Beiträge, keine anderen Tabellen. Längen und
Moderationsfelder sind zusätzlich in der Datenbank abgesichert, nicht nur im Browser.

**Moderation ohne Team:** Beiträge erscheinen sofort — eine Vorabfreigabe würde das Gespräch
töten, und rechtlich haftet man als Host erst ab Kenntnis (§ 10 DDG). Jeder kann melden; ab
drei Meldungen verschwindet ein Beitrag automatisch. Übersicht über `select * from moderation;`.

**Redaktionelle Tipps** (`tipps [{text, von, datum}]` in pins.json) bleiben daneben bestehen —
sie stehen über dem Gespräch und eignen sich für geprüfte Hinweise, die immer sichtbar sein
sollen. Fotos laufen weiterhin über Einreichung, weil dort Urheber- und Persönlichkeitsrechte
eine Vorabprüfung nötig machen.

## Mobile-Konzept (Stand 09.08., nach Messung)
Ausgangslage: HUD belegte 25 % des Bildschirms (auf 360×740 sogar 32 %), Touch-Ziele lagen bei
30–36 px statt der empfohlenen 44 px, und jeder Klick auf ein Listen-Element zerstörte den
Kontext (Liste zu → Pin auf der Karte suchen).

- **Detail-Sheet statt Karten-Popup** (nur Mobil): Infos fahren von unten ein, Karte bleibt oben
  sichtbar, alle Knöpfe in Daumenreichweite. Wischen nach unten schließt, seitlich blättert.
  Am Desktop bleibt das Popup — dort ist Platz und die Maus zielt genau.
- **Liste ↔ Detail ohne Kontextverlust:** „‹ Zurück zur Liste" führt in denselben Tab zurück.
- **Filter einklappbar** (nur Mobil, Zustand gemerkt): kleine Displays starten eingeklappt →
  575 px Karte statt 419 px. Ein „aktiv"-Marker zeigt eingeklappt, dass Filter greifen.
- **Aktionshierarchie:** eine Primäraktion in voller Breite (Tickets bzw. Route), Rest kompakt.
- **Gerätespezifisches:** `100dvh` gegen Safaris einfahrende Adressleiste, Eingabefelder ≥15 px
  gegen iOS-Auto-Zoom, Querformat-Regeln ab Höhe ≤520 px, `overscroll-behavior` gegen das
  Gummiband über der Karte.

## Erledigt-Log
**09.08. (KI-Agent):** Google-Maps-Frage recherchiert und entschieden (bleibt MapLibre — Begründung
oben), dabei die Google-Fonts-Einbindung als echtes Risiko entdeckt und behoben. **Pin-Export**
(GeoJSON/KML), **Fotos und Tipps** von Nutzern, **Kartenstil-Umschalter**, ausführliche
Datenschutzangaben.
**09.08. (KI-Agent, Mobile-Optimierung):** Systematisch vermessen und umgebaut — Detail-Sheet
statt Popup, Liste↔Detail ohne Kontextverlust, einklappbare Filter, Touch-Ziele auf Norm,
Aktionshierarchie, Querformat- und iOS-Regeln. Details siehe „Mobile-Konzept" oben.

**09.08. (KI-Agent, fünfter Nutzertest):** **Liste ist Haupteinstieg** — steht gleichwertig im
HUD neben „Pin melden" und zeigt die Trefferzahl live; Tabs heißen jetzt verständlich
„🔥 Aktuell / 📍 Auf der Karte / 🍏 Saison". **Cluster öffnen ab 6 Pins die Liste** statt zu
zoomen, gruppiert nach Spielstätte und chronologisch — am Markt liest sich das als Spielplan
(„MARKT · 15" mit allen WM-Konzerten). **Hover-Karte** zeigt zusätzlich den ersten
Beschreibungssatz und Hinweise (Highlight, gratis, laufende Saison, Entfernung).
**09.08. früh (KI-Agent, vierter Nutzertest):** **Kategorien final auf 7** — „Markt" steckte
doppelt (Flohmarkt/Essen&Markt), Musik/Party/Feste überschnitten sich. Jetzt trennscharf, mit
erweiterten Suchsynonymen (Museum/Galerie → Kultur, Yoga/Bewegung → Sport). **Zeitraum-Filter
mit Uhrzeit** (Feld links neben dem Datum) plus Schnellwahl „Heute Abend"; die Startzeit wird aus
der Meta-Zeile gelesen. **Hover-Vorschau** am Pin (Titel, Datum, Ort ohne Klick).
**Durchblättern im Popup** nach Immobilienportal-Vorbild („‹ 3 von 17 ›"), Trefferliste beim
Öffnen eingefroren. **Popup-Überlappung behoben:** Karte schiebt sich minimal, bis das Popup
frei von Kopfzeile und Filterleiste steht.
**08.08. spätnachts (KI-Agent, dritter Nutzertest):** **Kategorien halbiert** — von 15 auf 9
Themen, alle Doppelungen aufgelöst (Natur/Ernte/Saisonal beschrieben dieselben Pins, ebenso
Essen/Markt). **Highlights clustern jetzt mit:** Sie waren vom Clustering ausgenommen und
überlagerten sich am Markt zu 17 verschmierten Glut-Ringen. Der Cluster trägt Flamme und Ring
stellvertretend; liegen Pins praktisch aufeinander, öffnet ein Tipp die Liste statt zu zoomen.
Neuer Chip **🔥 Highlights** zeigt alle beliebten Pins auf einmal (ohne Clustering, Karte zoomt
passend heraus).
**08.08. Nacht (KI-Agent):** **Orientierung statt Datenflut** — mit 144 Pins wurde die Karte
unübersichtlich. Drei Ebenen dagegen: (1) **„🔥 Was ist los?"** als erster Tab der Listenansicht
— Heute und Als Nächstes, je max. 8 Einträge nach Relevanz (Highlight-Flag, Zeitnähe,
Beliebtheit, Profil-Interessen); Dauerangebote nur noch als Fußnote. (2) **Clustering** —
Pins unter 58 px Abstand werden zu einem Kreis mit Anzahl zusammengefasst, ab Zoom 16 lösen sie
sich auf, Highlights bleiben immer einzeln. Stadtansicht: ~44 statt 143 Symbole. (3) **Einführung**
beim ersten Öffnen (5 Punkte, vor der Interessenwahl), jederzeit über ⓘ erneut aufrufbar.
**08.08. spät (KI-Agent):** **Tag „kostenlos" abgeschafft** — das ist eine Eigenschaft, kein Thema,
und verdrängte echte Themen aus der Filterleiste. Gratis-Hinweis steht jetzt in der Meta-Zeile,
Suche nach „gratis/umsonst/verschenken" läuft über den Volltext. Neue Themen 🪩 Party und
🎁 Verschenken. **Musik-Lücke der nächsten 14 Tage geschlossen:** von 8 auf 37 Termine, heute
statt null jetzt vier. Größter Fund: die 13 Gratis-Open-Air-Abende der WM-Bühne auf dem Markt
(11.–23.08., täglich 20:30, u. a. Álvaro Soler, MiA, Shantel, Harris & Ford). **Leere
Filterergebnisse** zeigen jetzt den nächsten passenden Termin statt einer leeren Karte.
**08.08. Abend (KI-Agent, zweiter User-Test):** **Konzert-Lücke geschlossen** — die App hatte
fast keine Musik-Events, weil der Kulturkalender nur Museen kennt. Jetzt 47 Konzerte über 14
Spielstätten in pins.json, plus drei neue automatische Quellen (rausgegangen.de-Konzertkategorie,
Bigcartel-JSON des Musikbunkers, Tribe-Event-APIs inkl. aachen-kalender.de). **Spielstätten-
Koordinaten korrigiert** — mehrere Schätzwerte lagen bis 2 km daneben. **Suche kontextgerecht:**
11 Synonymgruppen, Umlaut- und Stammform-Normalisierung, Trefferzähler mit Hilfestellung bei
0 Treffern. **Highlight-Pins** mit Glut-Ring statt nur Flammen-Badge. **Kamera-Knopf** oben:
öffnet direkt die Kamera und bestimmt den Ort automatisch (EXIF-GPS → Standort → manuell).
Dazu: Tag-Leiste priorisiert gesuchte Themen und zeigt Trefferzahlen, Aktualitäts-Anzeige im
Info-Modal, Entfernungen in der Liste, kompakterer Header auf schmalen Handys.
**08.08. nach Launch, Teil 2 (KI-Agent):** **Saisonkalender** als zweiter Tab in der Listenansicht
— gruppiert in "Jetzt Saison" (sortiert nach letzter Chance: was zuerst endet, steht oben),
"Bald dran" (≤45 Tage) und "Später im Jahr"; im Popup zeigt jeder Saison-Pin seinen Status
("🍏 Jetzt Saison — noch 8 T" bzw. "startet in 7 Tagen"). **Beispiel-Pins blenden sich selbst aus,**
sobald eine Kategorie ≥2 echte Pins hat (aktuell: Sofa-Beispiel weg, Hilfe-Beispiele bleiben, bis
echte Gesuche eingehen — kein manueller Eingriff mehr nötig).

**08.08. nach Launch (KI-Agent):** Karte ist live. Live-URL überall eingetragen (Flyer-QR zeigt
jetzt auf eventlas.netlify.app, alle Anschreiben-Texte einsatzbereit). **PWA** komplett:
manifest.json, Service Worker (network-first für eigene Dateien, damit Netlify-Uploads sofort
ankommen; Kacheln bewusst ungecacht), App-Icons, "Zum Startbildschirm"-Knopf im Info-Modal.
**Open-Graph-Bild** (og.png, 1200×630, im Karten-Design) + Twitter-Card → Links sehen in
WhatsApp/Insta jetzt aus wie ein Produkt, nicht wie ein nackter Link. **Marker-Auffächerung**:
Pins auf gleicher Koordinate (7 Gruppen, u. a. Katschhof, Elisenbrunnen, Tivoli) werden im Kreis
um ~16 m versetzt gezeichnet und sind damit einzeln antippbar — die Route im Popup zeigt weiterhin
auf die echte Koordinate. Dazu `upload-vorbereiten.cmd` (verhindert, dass Dateien beim Netlify-
Upload aus dem Projekt verschwinden) und `.claude/bilder-generator.html` (erzeugt og.png/Icons neu,
falls sich das Design ändert).

**08.08. abends (KI-Agent, nach User-Test + Code-Review):** Alle 6 Punkte aus User Test.md
umgesetzt (Marker-Positions-Bug behoben — Icons wanderten beim Zoomen; Tag-Chip-Aktivzustand;
✕-Zurücksetzen-Chip; Themen-Emojis auf den Karten-Blips; 📅 Zeitraum-Filter mit Von/Bis;
☰ Listenansicht mit Karte-Sprung). Dazu 7 bestätigte Review-Befunde gefixt: Saisonfenster über
Jahreswechsel, wdh+start-Kombination erschien zu früh, Melde-Flow hatte keinen Abbruch mehr,
Heimat-Kreis-Zeichnungs-Race, Update-Skript gehärtet (LLM/API dürfen fest/hot/id nicht mehr
setzen — Prompt-Injection-Schutz; Dedupe berücksichtigt jetzt den Ort; Duplikate werden geloggt).
**08.08. (KI-Agent, V2-Umbau):** Alle 24 Prioritäts-Features umgesetzt/entschieden — Icons +
Farbenblind-Design (2), Geschäfte-Pins entfernt (3), 64 echte Pins mit Quellen (4, 10), Saisonlogik
+ 17 mundraub-/Selbstpflück-Orte (5), 10 Fotospots mit Goldene-Stunde-Berechnung (6), Tag-/Zeit-/
Viewport-Filter (7, 11, 16), Kategorien Events/Angebote/Hilfe + Hotspots (8), Melde-Flow mit
Icon+Knopf, WhatsApp+Mail, Plakat-Upload (9, 24), Popup-Autoclose (12), rollierende Zeitfenster
(13), Zeitfilter-Kontrast (14), ganz Aachen + Multi-Stadt-Konfig (15), Suche mit Zeit-Keywords
(17), 💡-Feedback (18), Nummer aktualisiert (19), lokales Karma/Rang-System (20), Interessen-
Onboarding + Für-dich + Heimat-Bereich + Neu-Banner (22), Routen-Deeplink (23). Dazu: eventlas.com-
Recherche (1), Update-Skript v2, Kulturkalender-API entdeckt, Favicon, XSS-Escaping, Deep-Links.
**07.08.:** Datumslogik V1, WhatsApp-Meldetext, Namensentscheidung Eventlas, @eventlas_aachen
gegründet.

## Konto-Notizen
- nebenan.de-Anmeldung läuft über Google-Konto nikolas.voth92@gmail.com
- Google-Kalender-Zeitzone stand auf Asia/Tokyo → auf Europe/Berlin umstellen
- Insta-Handle @eventlas_aachen existiert; Domain eventlas.de **noch nicht gesichert** → todos.md

## Naming-Architektur (beschlossen 07.08., bestätigt 08.08.)
Dachmarke "Eventlas" + lokale Instanz ("Eventlas Aachen", später "Eventlas Köln" …).
DPMA/TMview ohne DE/EU-Treffer (zuletzt geprüft 08.08., inkl. eventlas.com-Analyse — siehe oben).
Reihenfolge nach Anmeldung: Domain eventlas.de → DPMA-Marke (Klassen 35, 38, 41, 42) →
Branding steht bereits in index.html.
