# Roadmap Eventlas

Diese Datei bei neuen Chats mit Claude hochladen — sie ist das Projektgedächtnis.

## 🟢 LIVE: https://eventlas.netlify.app (seit 08.08.2026)
Nach jeder Änderung neu hochladen: **`upload-vorbereiten.cmd` doppelklicken** (kopiert alle
Live-Dateien nach `Upload/`, verschiebt nichts) → Ordner auf app.netlify.com/drop ziehen.
Zum Live-Bestand gehören inzwischen: `index.html`, `pins.json`, `manifest.json`, `sw.js`,
`og.png`, `icon-192.png`, `icon-512.png`.

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
- **Zeitfilter:** Heute | Demnächst (30 Tage) | Alle (alles Kommende) — rollierende Fenster statt
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

## Deploy-Kette (wichtig — Stand 10.08.)
```
GitHub Action (täglich 05:30 UTC)
   └─ recherchiert → schreibt pins.json → committet ins Repo
        └─ Netlify (verbunden mit dem Repo) baut und veröffentlicht automatisch
             └─ Live-Seite zeigt die neuen Termine
```
**Bis zum 10.08. fehlte das mittlere Glied:** Die Action lief zwar (Commits vom 09. und 10.08.),
die Live-Seite wurde aber per Drag-and-drop befüllt und bekam davon nichts mit. Behoben durch
`netlify.toml` + Repository-Verknüpfung (Anleitung in todos.md).

**Zweiter Fehler derselben Ursache:** Weil der aktuelle Stand nicht gepusht war, lief die Action
tagelang mit dem Skript vom 08.08. — ohne Konzertquellen und ohne `venues.json`. Ergebnis waren
28 statt 84 Musik-Pins und Tags aus dem alten Schema. Seit dem Push vom 10.08. behoben.

**Merke:** Nach jeder Änderung an `scripts/`, `venues.json` oder `index.html` muss gepusht
werden — sonst arbeitet die nächtliche Action mit einem veralteten Stand weiter, ohne zu meckern.
Der Workflow prüft das Ergebnis jetzt (Pin-Anzahl, Koordinaten, gültige Tags) und committet bei
Auffälligkeiten gar nicht erst, damit eine kaputte Datei nie live geht.

## Content-Pipeline (aktualisiert 08.08.)
**Automatisch (GitHub Action, täglich 05:30 UTC):** scripts/update-pins.mjs
1. Feste Pins (`fest:true`) bleiben immer: Fotospots, Ernteorte, Beispiele, Wochenmärkte, Alleenfest.
2. Kulturkalender-API `api.kulturkalender-aachen.de/events` (undokumentiert, CORS *, 7 städtische
   Häuser mit fester Koordinaten-Map) → Kultur-Pins der nächsten 45 Tage, ohne LLM.
3. Claude + Websuche für den Rest (neues Schema, Quelle pro Pin Pflicht, keine Geschäfte).
4. Merge + Dedupe (Titel+Datum), `hinzu` bleibt bei bekannten Pins stabil, 90-Tage-Pruning.
   Abbruch ohne Schaden bei ungültiger Antwort.

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

## Neue Feature-Ideen (gesammelt 08.08., noch nicht beauftragt)
- **Cluster-Vorschau:** Antippen zoomt derzeit hinein — alternativ könnte ein kleines Popup
  die enthaltenen Pins auflisten (gut bei Pins, die exakt aufeinanderliegen).
- **„Heute Abend"-Schnellfilter** neben Heute/Demnächst — trifft den häufigsten Impuls
  („was mache ich gleich?") genauer als der ganze Tag.
- **Relevanz-Sortierung auch auf der Karte:** unwichtige Pins bei weitem Zoom ausblenden statt
  clustern (weniger Klickarbeit, aber weniger transparent — erst testen).
- **Embed-Widget:** Karte als iframe für wir-frankenberger.de / Café-Websites → Reichweite.
- **Mehrsprachig EN/NL** für die Euregio (Vaals ist 10 Min entfernt).
- **Saison-Push:** "🍏 Brombeeren sind jetzt reif" als Insta-Story-Vorlage automatisch aus den
  Saisondaten erzeugen (Content-Marketing ohne Aufwand).
- **Statistik ohne Tracking:** Netlify-Analytics (serverseitig) reicht für Launch-KPIs.
- **Marker-Spreizung bei Überlappung:** Am Katschhof liegen mehrere Pins fast übereinander —
  bei Klick auffächern (Spiderfy) oder bei niedrigem Zoom leicht versetzen.

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
