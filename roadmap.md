# Roadmap Frankenberger-Karte

Diese Datei bei neuen Chats mit Claude hochladen — sie ist das Projektgedächtnis.

## Status (Stand 07.08.2026)
- V1 live-bereit: **index.html** (Dateiname für Netlify nötig!) — WhatsApp-Nummer 4915237752368 eingebaut
- Launch-Ziel: bis 22.08., Anker Alleenfest 29./30.08. Oppenhoffallee
- Offen: Koordinaten-Check, Netlify-Upload → **URL an Claude schicken**

## Vorgemerkt: QR-Code + Flyer (Trigger: Netlify-URL liegt vor)
Claude liefert dann: flyer.html im Karten-Design, druckfertig A6, QR wird client-seitig
per CDN-Bibliothek erzeugt (Browser öffnen → drucken/als PDF sichern). 100 Stück Copyshop.
Verteilung: Wochenmarkt samstags, Cafés Oppenhoffallee, Alleenfest 29./30.08.

## Content-Pipeline V2.5 (wöchentliches Pin-Update)
Ablauf jede Woche (dein Aufwand ~10 Min):
1. DU schreibst Claude "Pin-Update" + leitest ggf. Insta-Screenshots/WhatsApp-Meldungen weiter
2. CLAUDE liest rausgegangen.de/aachen (+ Detailseiten) und veranstaltungen.meinestadt.de/aachen,
   prüft wir-frankenberger.de — übernimmt nur Fakten (Titel, Datum, Ort) + Quelllink, keine
   fremden Texte; filtert aufs Gebiet; liefert fertigen PINS-Block
3. DU kopierst den Block in index.html und ziehst die Datei erneut auf Netlify (ersetzt die Site)

Quellenbewertung (geprüft 07.08.):
- rausgegangen.de: lesbar, gute Viertel-Treffer möglich → Hauptquelle
- veranstaltungen.meinestadt.de/aachen: lesbar, eher Ticket-Events → Ergänzung
- aachen.de-Kulturkalender: lädt nur per JavaScript, nicht direkt lesbar →
  stattdessen V3-Prüfauftrag: offenedaten.aachen.de auf Veranstaltungsdatensatz/iCal prüfen —
  falls vorhanden: kleines Skript, das Pins automatisch generiert (echte Automation, legal)
- Instagram: keine API für fremde Posts, Scraping verboten → Screenshots an Claude senden;
  Läden bitten, @deinAccount zu taggen oder Posts per DM zu schicken

## Kleinanzeigen & nebenan.de (beschlossen: KEIN Crawler)
Keine offenen APIs, automatisiertes Auslesen verstößt gegen AGB (Abmahn-/Sperr-Risiko).
Einbau über Nutzer: Pin-Meldung enthält Link zur eigenen Anzeige — verlinken ist erlaubt.
Wachstum manuell: einzelne Viertel-Anzeigen freundlich anschreiben ("Stell dein Angebot
kostenlos auf die Viertelkarte") — sparsam und individuell, keine Massennachrichten.
nebenan.de: als Nachbar beitreten, Karte als Nachbarschaftsprojekt vorstellen (Werberegeln beachten).

## V2 (vorgemerkt): Interessenprofile + manuelle Tag-Filter
**Trigger:** nach Launch + ersten echten Nutzer-Pins (frühestens Sept.), oder Zuruf "bau V2".

**Entscheidung Google:**
- Google Sign-In: optional später als Komfort-Login (liefert nur Name/E-Mail/Bild).
- Interessen-/Werbedaten von Google: nicht verfügbar — keine API dafür, auch nicht mit Nutzer-Zustimmung. Nicht weiterverfolgen.

**Stattdessen (beschlossen):** Profile selbst erheben, lokal im Gerät.
1. Onboarding-Sheet beim ersten Öffnen: 3–5 Interessen antippen
   (Tags: flohmarkt, musik, essen, kinder, sport, nachbarschaftshilfe, kurier, kultur)
   + Opt-in-Satz: "Deine Auswahl wird nur auf deinem Gerät gespeichert, um Pins zu sortieren. Jederzeit löschbar."
2. Datenmodell: jeder Pin bekommt tags:[]; Profil = {tags:[], klicks:{tag:zahl}, optIn:true} in localStorage, mit try/catch (fällt ohne Speicher sauber auf Nicht-personalisiert zurück).
3. Implizites Lernen: Pin-Antippen zählt +1 auf dessen Tags.
4. UI: horizontale Tag-Chip-Leiste über dem HUD (manueller Filter), "Für dich"-Modus hebt passende Pins hervor (größerer Blip), Menüpunkt "Profil zurücksetzen".
5. DSGVO: nur lokale Speicherung, kein Server, keine Übertragung → minimaler Fußabdruck; Datenschutzerklärung um einen Absatz ergänzen. Erst bei späterem Backend: Account, serverseitige Profile, Löschprozess.

**Warum kein Login-Zwang in V2:** Hyperlokal-MVP lebt von reibungslosem Erstkontakt (QR-Code → Karte in 2 Sek.). Jede Anmeldehürde kostet den Großteil der Flyer-Scans.

## V3-Kandidaten (unpriorisiert)
- Formular + kleines Backend für Pin-Meldungen (ab ~20 Meldungen/Woche)
- **Plakat-Foto → Auto-Pin (Stufe B):** Upload in der Karte → Backend (z. B. Serverless-Funktion)
  ruft Claude-API mit Vision auf → extrahiert Titel/Datum/Ort → Pin-Entwurf zur Freigabe an Betreiber.
  Nur Fakten übernehmen, Plakatfoto selbst NIE veröffentlichen (Urheberrecht am Design).
  Stufe A läuft bereits heute: Nutzer schickt Plakatfoto per WhatsApp → beim Pin-Update an Claude
  weiterleiten → Claude liest das Plakat und liefert den Pin.
- Push/WhatsApp-Broadcast "Neue Pins für deine Interessen"
- Featured-Pin-Verwaltung für zahlende Händler
- Google Sign-In (nur Komfort)

## Erledigt in V1 (07.08. nachmittags)
- Datumslogik eingebaut: Pins können start/ende (ISO) oder wdh ("mo".."so") tragen.
  Zeitfilter-Chips Heute | Demnächst (30 Tage, Standard) | Alle. Abgelaufene Events
  verschwinden automatisch — auch unter "Alle". Popup zeigt Datum formatiert.
- WhatsApp-Meldetext lädt jetzt aktiv zum Plakat-Foto ein.

## Konto-Notizen
- nebenan.de-Anmeldung läuft über Google-Konto nikolas.voth92@gmail.com
- Google-Kalender-Zeitzone stand auf Asia/Tokyo → auf Europe/Berlin umstellen

## Naming-Architektur (beschlossen 07.08.)
Generische Dachmarke + lokale Instanz: "[NAME] — Frankenberger Viertel", skaliert als
"[NAME] Aachen", "[NAME] Köln" usw. ENTSCHIEDEN 07.08.: Eventlas — DPMA (inkl. EM-Bestand) und TMview ohne DE/EU-Treffer;
"Eventlasting" nur Australien (irrelevant). MissionMap verworfen: EU-Marke identischen
Wortlauts im Register, Klasse 35 im Trefferset. EventMap: DE/EU kollisionsfrei, aber
UK-Aktivmarke (Expansions-Minus) + Wortmarke kaum eintragbar.
Nach Namenswahl: Branding in index.html-KONFIG umstellen (Titel/Untertitel), Insta-Handle
+ Domain + DPMA-Marke (Klassen 35, 38, 41, 42) in dieser Reihenfolge sichern.
