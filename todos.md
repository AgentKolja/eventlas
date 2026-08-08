# Deine To-dos + versandfertige Texte (Stand 08.08.2026)

Karte ist live: **https://eventlas.netlify.app** — alle Texte unten sind fertig zum Kopieren.
> Die Karte selbst ist fertig umgebaut und getestet — Details in roadmap.md.
> Unten bei "Fragen an dich" bitte kurz entscheiden, dann kann der Agent weiterarbeiten.

## Jetzt am Handy (vor dem Laptop)
- [ ] nebenan.de-Konto anlegen (Adresse im Viertel; Verifizierung kann Tage dauern — sofort starten)
- [ ] WhatsApp Business App installieren und mit 015254170703 verknüpfen (kostenlos, private Chats
      bleiben getrennt; Autoantwort = Text 5 einrichten) — die Nummer ist bereits in der Karte eingebaut

## Am Laptop (~30 Min)
- [ ] **Domain eventlas.de registrieren** (vor der Markenanmeldung checken/sichern; .app optional dazu)
- [ ] **Di 11.08.: DPMA-Wortmarke "Eventlas" anmelden** (~290 €, Klassen 35, 38, 41, 42).
      Recherche-Update 08.08.: TMview ohne "Eventlas"-Treffer; eventlas.com ist ein toter anonymer
      SEO-Blog ohne DE-Bezug → Risiko niedrig, Anmeldung sichert deine Priorität. NICHT verschieben.
- [ ] **Eigene Projekt-Mail anlegen** (z. B. eventlas.aachen@gmail.com) und mir Bescheid geben —
      aktuell steht deine private nikolas.voth92@gmail.com im Melde-Flow der Seite (öffentlich!).
      Ich tausche sie dann in index.html → KONFIG.mail aus.
- [ ] **Impressum-Daten liefern** (Name + ladungsfähige Anschrift; Pflicht nach § 5 DDG, sobald die
      Seite öffentlich ist). Platzhalter steht im ⓘ-Info-Modal — ich trage es ein, sobald du es schickst.
- [x] ~~Netlify-Upload~~ → **live auf https://eventlas.netlify.app** (08.08.)
- [x] ~~GitHub-Push~~ → erledigt (08.08.)
- [ ] **Prüfen: Repo-Secret ANTHROPIC_API_KEY gesetzt?** (github.com → Repo → Settings → Secrets
      and variables → Actions). Ohne das bricht der tägliche Auto-Update-Lauf ab. Testen kannst du
      es unter "Actions" → "Eventlas täglich aktualisieren" → "Run workflow".
- [ ] Mail an die Stadt schicken (Text 6) → schaltet die beste Datenquelle frei (1427 Events)
- [ ] Google-Kalender-Zeitzone von Asia/Tokyo auf Europe/Berlin umstellen (alter Fund)

## ⚠️ Wichtig für künftige Netlify-Uploads
Beim letzten Mal wurden `index.html` und `pins.json` in den `Upload/`-Ordner **verschoben** statt
kopiert — dadurch fehlten sie im Projektordner (die GitHub-Action schreibt aber genau dorthin).
Ich habe sie zurückgeholt. Für den nächsten Upload gibt es jetzt einen Doppelklick-Helfer:

**`upload-vorbereiten.cmd` doppelklicken** → kopiert die aktuellen Dateien in den `Upload/`-Ordner
und öffnet ihn. Dann nur noch den Ordner auf app.netlify.com/drop ziehen. Nichts wird verschoben.

## Flyer drucken (Vorlauf einplanen!)
- [ ] **`flyer.html` im Browser öffnen → Strg+P → "Als PDF speichern"** — QR-Code zeigt bereits auf
      eventlas.netlify.app, Design ist fertig.
- [ ] PDF zum Copyshop: **100 × A6, 300 g, farbig** (Kosten grob 15–25 €). Vor dem Alleenfest
      (29./30.08.) bestellen, Druckereien brauchen oft 2–3 Werktage.

## Fragen an dich (kurz antworten reicht)
- [ ] **Mail-Adresse:** Neue Projekt-Adresse anlegen oder private Gmail vorerst okay?
- [ ] **Google-Login:** bleibt als V3 geplant (erst sinnvoll mit Backend) — einverstanden?
- [ ] **Beispiel-Pins:** Sollen die drei [Beispiel]-Pins nach den ersten echten Nutzer-Pins
      verschwinden? (Empfehlung: ja, mache ich dann automatisch.)

## Sobald Karte live + Accounts bereit
- [ ] nebenan: Projektvorstellung posten (Text 1)
- [ ] 5 Insta-DMs an Läden (Text 2) — Accounts vorher prüfen: Öcher Eistreff, Insulaner,
      Musikbunker, Café Soleil, Trattoria Centrale 46
- [ ] Bürgerverein anschreiben über Kontakt auf wir-frankenberger.de (Text 3)
- [ ] 2–3 Kleinanzeigen aus dem Viertel einzeln anschreiben (Text 4 — sparsam, keine Massen-DMs)

---

## Text 1 — nebenan.de Projektvorstellung
Hallo Nachbarschaft! Ich habe eine kleine Viertelkarte für Aachen gebaut: https://eventlas.netlify.app
Dort sieht man auf einen Blick, was hier läuft — Wochenmärkte, Alleenfest, Konzerte, sogar wo man gerade Brombeeren pflücken kann — und jede*r kann eigene Pins melden: etwas zu verschenken, Hilfe gesucht (Einkauf, Paket mitnehmen), Hofflohmarkt. Melden geht direkt in der Karte per WhatsApp oder Mail, kostenlos und ohne Anmeldung. Ich pflege die Pins von Hand und prüfe jede Meldung. Ein paar Pins sind als [Beispiel] markiert, damit man sieht, wie es aussieht. Die Karte ist komplett kostenlos und werbefrei. Wenn ihr etwas eintragen wollt oder Ideen habt (Glühbirnen-Knopf oben rechts!): immer her damit. Beim Alleenfest am 29./30.8. bin ich auf der Oppenhoffallee unterwegs — sprecht mich gern an.

## Text 2 — Instagram-DM an Läden (Tagging-Bitte)
Hi! Ich bin [VORNAME] aus dem Frankenberger und habe eine kostenlose Stadtkarte gebaut, die zeigt, was in Aachen läuft: https://eventlas.netlify.app. Wenn ihr Aktionen oder Veranstaltungen habt: markiert einfach @eventlas_aachen oder schickt mir den Post — ich setze es kostenlos als Pin auf die Karte. Liebe Grüße aus der Nachbarschaft!

## Text 3 — Mail an Bürgerverein Frankenb(u)erger
Betreff: Viertelkarte fürs Frankenberger — Terminpflege als Kooperation?

Hallo liebes Team der Frankenb(u)erger,
ich wohne im Viertel und habe eine kostenlose Online-Stadtkarte gebaut: https://eventlas.netlify.app. Sie zeigt Termine wie den Wochenmarkt und das Alleenfest sowie Nachbarschafts-Pins (Verschenken, Hilfe gesucht, Hofflohmärkte). Zwei Fragen:
1. Darf ich eure Veranstaltungstermine regelmäßig übernehmen — jeweils mit Link auf euch? Ich pflege das zuverlässig ein. (Euer Alleenfest und das UWAGA!-Konzert an der Burg sind schon drauf.)
2. Gibt es beim Alleenfest am 30.8. im Rahmen von "Ein Viertel präsentiert sich" die Möglichkeit, das Projekt kurz vorzustellen oder Flyer auszulegen? Die Karte ist komplett kostenlos und werbefrei.
Viele Grüße
[NAME], [STRASSE]

## Text 4 — Kleinanzeigen-Einzelanschreiben (nur einzeln, individuell anpassen)
Hi! Ich habe deine Anzeige gesehen — ich betreibe eine kleine kostenlose Karte für Aachen: https://eventlas.netlify.app. Wenn du magst, setze ich dein Angebot als Pin mit Link auf deine Anzeige darauf. Mehr Sichtbarkeit direkt aus der Nachbarschaft, kostet nichts — ein kurzes Ok reicht.

## Text 5 — WhatsApp-Autoantwort auf Pin-Meldungen
Danke für deine Pin-Meldung für Eventlas! Ich prüfe sie kurz und stelle sie meist innerhalb von 24 h online. Falls noch nicht dabei, schick mir bitte: Typ (Event/Angebot/Hilfe-Gesuch), Titel, 1–2 Sätze Beschreibung, optional einen Link — oder einfach ein Foto vom Plakat.

## Text 6 — Mail an die Stadt (Datenfreigabe iCal-Export) → offenedaten@mail.aachen.de
Betreff: Nutzung des Veranstaltungskalender-iCal-Exports für nichtkommerzielle Stadtkarte

Guten Tag,
ich betreibe die nichtkommerzielle, werbefreie Stadtkarte "Eventlas Aachen" (https://eventlas.netlify.app), die Aachener Veranstaltungen mit Quellenangabe und Link auf die Originalseite darstellt. Der Veranstaltungskalender auf aachen.de bietet einen iCal-Export (event.ics). Darf ich diesen Export automatisiert einmal täglich abrufen, um daraus Veranstaltungshinweise (Titel, Datum, Ort) mit Verlinkung auf aachen.de zu übernehmen? Falls es dafür eine bevorzugte Schnittstelle, Lizenz oder Bedingungen gibt, richte ich mich gern danach. Ein offener Veranstaltungsdatensatz auf offenedaten.aachen.de wäre übrigens ein Traum — ich wäre sofort Erstnutzer.
Vielen Dank und viele Grüße
[NAME], [KONTAKT]

---

## Namensfindung (abgeschlossen)
Entschieden: **Eventlas** (07.08.), Handle @eventlas_aachen existiert. Recherche-Historie der
Alternativen (Questlas, MissionMap, HeuteHier …) steht in der Git-Historie dieser Datei.
eventlas.com-Analyse vom 08.08. → roadmap.md ("Entscheidung eventlas.com").
