# Roadmap Eventlas

Diese Datei bei neuen Chats mit Claude hochladen — sie ist das Projektgedächtnis.

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
- **Kategorien:** `event` (türkis, Kreis, Kalender-Icon) · `angebot` (orange, Quadrat, Geschenk) ·
  `hilfe` (gelb, Raute, Herz) · `spot` (violett, Ring, Kamera). Form + Icon + Farbe → auch für
  Farbenblinde unterscheidbar. Altes `aufgabe` wird automatisch als `hilfe` gelesen.
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
- **PWA:** manifest.json + Service-Worker → "Zum Startbildschirm", Offline-Fallback (Fallback-Pins
  sind schon eingebaut, fehlt nur der SW). Kleiner Aufwand, großer Mobil-Gewinn.
- **Embed-Widget:** Karte als iframe für wir-frankenberger.de / Café-Websites → Reichweite.
- **Mehrsprachig EN/NL** für die Euregio (Vaals ist 10 Min entfernt).
- **Open-Graph-Bild** (Karten-Screenshot) für schönere WhatsApp-Link-Vorschau.
- **Saisonkalender-Ansicht:** Liste "Was ist gerade Saison?" (Daten sind da: 21 Ernteorte mit
  Saisonfenstern).
- **Beispiel-Pins automatisch ausblenden,** sobald ≥3 echte Nutzer-Pins derselben Kategorie leben.
- **Statistik ohne Tracking:** Netlify-Analytics (serverseitig) reicht für Launch-KPIs.
- **Marker-Spreizung bei Überlappung:** Am Katschhof liegen mehrere Pins fast übereinander —
  bei Klick auffächern (Spiderfy) oder bei niedrigem Zoom leicht versetzen.

## Erledigt-Log
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
