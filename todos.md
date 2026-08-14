# Deine To-dos + versandfertige Texte (Stand 08.08.2026)

Karte ist live: **https://eventlas.netlify.app** — alle Texte unten sind fertig zum Kopieren.

## ✅ Erledigt: Deploy-Kette läuft (14.08.)
Netlify ist mit GitHub verbunden — **das Hochladen entfällt ab jetzt komplett.** Geprüft: Der
erste verbundene Build ist sauber durchgelaufen, alle Live-Dateien sind da (auch die neuen
`bilder/` und `orte.json`), und `roadmap.md`, `todos.md`, `venues.json` sind korrekt von der
Website ausgeschlossen. Der Ordner `Upload/` und `upload-vorbereiten.cmd` bleiben als Notnagel
liegen, brauchst du aber nicht mehr.

**Der zweite Grund, warum „daily update nicht funktioniert" hat**, war ein eigener Fehler und
ist ebenfalls behoben: Die nächtlichen Läufe vom **11., 12. und 13.08. sind alle abgestürzt.**
Nicht weil eine Datenquelle kaputt war, sondern weil ein Aussetzer der Recherche-Schnittstelle
den *ganzen* Lauf beendete — obwohl Kulturkalender, Musikbunker und die Konzertkalender
einwandfrei lieferten. Dadurch sind rund **144 Termine nie live gegangen**.

Ab jetzt: Fällt die Recherche aus, laufen die übrigen vier Quellen weiter, und der Ausfall steht
als Warnung oben im Action-Bericht. Beim nächsten nächtlichen Lauf solltest du deutlich mehr
Termine auf der Karte sehen (im Test: 284 statt 144).

- [ ] Falls du nicht bis morgen früh warten willst: github.com/AgentKolja/eventlas → **Actions**
      → „Eventlas täglich aktualisieren" → **Run workflow**. Nach ~2 Min ist die Karte aktuell.
- [ ] Wenn im Bericht „⚠️ Recherche ausgefallen" steht: meist ist das Guthaben des API-Schlüssels
      leer oder das Modell wurde umbenannt. Beides ohne Codeänderung lösbar — Modell umstellen
      unter Settings → Secrets and variables → Actions → **Variables** → `EVENTLAS_MODELL`.

## 💬 Kommentare freischalten (10 Min, einmalig)
Jeder Pin hat jetzt eine **Gesprächssektion**: Leute schreiben direkt in der App, sehen die
Beiträge der anderen und können antworten — kein WhatsApp mehr. Dafür braucht es einen Speicher;
statische Dateien können keine Nutzereingaben behalten. Ich habe **Supabase** vorbereitet
(kostenlose Stufe reicht dauerhaft, EU-Server wählbar).

1. **supabase.com** → kostenlos registrieren → **New project**
   - Name: `eventlas` · Region: **Frankfurt (eu-central-1)** ← wichtig für die DSGVO
   - Datenbank-Passwort vergeben und notieren (brauchst du später kaum)
2. Im Projekt links auf **SQL Editor** → **New query** → den kompletten Inhalt von
   `scripts/kommentare-setup.sql` hineinkopieren → **Run**. Das legt die Tabelle und die
   Sicherheitsregeln an.
3. Links auf **Project Settings** (Zahnrad) → **API**. Dort stehen zwei Werte:
   - **Project URL** (z. B. `https://abcdefgh.supabase.co`)
   - **anon public** (ein langer Schlüssel)
4. Beides in `index.html` ganz oben im KONFIG-Block eintragen:
   ```js
   supabaseUrl: "https://abcdefgh.supabase.co",
   supabaseKey: "eyJhbGci…",
   ```
5. Hochladen bzw. pushen — fertig. Die Gesprächssektion schaltet sich von selbst frei.

**Ist der öffentliche Schlüssel ein Risiko?** Nein — er ist zur Veröffentlichung gedacht. Was
damit möglich ist, legen die Regeln in der SQL-Datei fest: Kommentare lesen, schreiben, melden,
eigene binnen 24 h löschen. Mehr nicht — auch kein Ändern fremder Beiträge.

**Moderation:** Beiträge erscheinen sofort (sonst ist es kein Gespräch). Ab **drei Meldungen**
verschwindet einer automatisch. Zum Nachsehen: Supabase → SQL Editor → `select * from moderation;`
— gemeldete und ausgeblendete stehen oben. Löschen kannst du dort per Rechtsklick.

- [ ] Supabase-Projekt angelegt und SQL ausgeführt
- [ ] URL + Key in index.html eingetragen
- [ ] Einmal selbst einen Kommentar geschrieben und wieder gelöscht (Test)

## Neu: Fotos und Tipps von Nutzern
Im Detail eines Pins gibt es jetzt „📷 Foto beisteuern" und „💬 Tipp schreiben". Beides landet
per WhatsApp/Mail bei dir. **So pflegst du es ein** (in `pins.json` beim jeweiligen Pin):
```json
"bild": { "url": "bilder/foto.jpg", "credit": "Foto: Vorname", "lizenz": "", "quelle": "" },
"tipps": [ { "text": "Am besten früh da sein.", "von": "Lisa", "datum": "2026-08-12" } ]
```
Datei in den Ordner **`bilder/`** legen — `upload-vorbereiten.cmd` und der Netlify-Build nehmen
ihn automatisch mit. **Vor dem Einpflegen kurz prüfen:** eigene Aufnahme? Keine Personen im
Mittelpunkt? Kein Plakat-/Kunstwerk-Foto (Urheberrecht)? Im Zweifel weglassen. Bei fremden
Fotos unter freier Lizenz gehören `lizenz` und `quelle` dazu — die Angabe erscheint dann
zwingend unter dem Bild, so verlangen es die CC-Lizenzen.

## Nichts zu tun: 10 Ortsfotos sind schon drauf (13.08.)
Die Fotospots zeigen jetzt Bilder — frei lizenzierte Aufnahmen von Wikimedia Commons
(Lousberg, Belvedere, Katschhof, Elisenbrunnen, Ponttor, Marschiertor, Burg Frankenberg,
Gut Melaten, Stadtgarten, Dreiländereck). Sie liegen bei uns im Ordner `bilder/`, nicht bei
Wikimedia — dadurch entsteht beim Betrachten keine Verbindung zu einem fremden Server, und
die Seite bleibt ohne Einwilligungsbanner. Urheber und Lizenz stehen unter jedem Bild.

## Nichts zu tun: Anfahrt und Barrierefreiheit stehen jetzt an jedem Pin (13.08.)
Im Detail steht ab sofort die nächste Haltestelle mit Fußweg und Linien, ob der Ort
barrierefrei ist, ggf. die Öffnungszeiten und ein Satz Hintergrund aus der Wikipedia.
Das gilt für **143 von 144 Pins** — die Zuordnung läuft über Koordinaten, also erben auch
alle künftigen Konzerte am selben Ort die Angaben automatisch.

Die Daten stehen in der neuen Datei **`orte.json`** (OpenStreetMap + Wikipedia, einmal
abgeholt statt live abgefragt). Aufgefrischt wird sie automatisch am 1. jedes Monats über die
neue Action **„Ortsdaten auffrischen"** — ohne API-Schlüssel, weil beide Quellen frei sind.
- [ ] Nur falls du magst: einmal unter *Actions* → „Ortsdaten auffrischen" → **Run workflow**
      testen. Nötig ist es nicht, die Datei ist aktuell.

## ✨ Neu: Neueröffnungen auf der Karte (testweise, 15.08.)
Vier Einträge sind drauf — **Action** (Aachen Arkaden, Adresse über die offizielle Filialseite
belegt), **Cura's Coffee** (obere Pontstraße), **Çiğköftem** (Adalbertstraße) und das
**CinemaxX**, das für Januar 2027 angekündigt ist. Eigene Kategorie „✨ Neu eröffnet", eigenes
Symbol auf der Karte.

Bei dreien kenne ich nur die Straße, nicht die Hausnummer. Das steht auch so im Pin (mit `*`),
statt eine Nummer zu erfinden. Zwei Wege, das zu klären:

- **Besucher bestätigen selbst:** Jeder Ortseintrag hat jetzt „Bist du gerade dort?" mit
  ✓ Gibt es / ✗ Gibt es nicht mehr. Ein Tipp öffnet eine fertig formulierte Mail an dich —
  absenden, fertig. Bewusst über dich statt automatisch: Eine Angabe, die ungeprüft durch
  Klicks kippt, wäre manipulierbar, und für falsche Fremdinhalte haftest du (§ 10 DDG).
- [ ] **Du fragst direkt nach:** Vorlage unten als **Text 7**. Klärt die Hausnummer und lädt
      den Laden gleich ein, künftig eigene Termine zu schicken. Adressen der Läden über deren
      Website oder Instagram.

> Wichtig zur Erwartung: Es gibt **keine automatische Quelle** für Neueröffnungen.
> OpenStreetMap trägt bei Läden fast nie ein Eröffnungsdatum ein, und Presseartikel sind
> urheberrechtlich geschützt — die *Tatsachen* daraus (wer, wo, wann) darf ich übernehmen,
> die Formulierungen nicht. Diese vier sind daher von Hand recherchiert und belegt.
> Nachschub kommt am ehesten über die GastroNews der Aachener Zeitung, über
> neueroeffnung.info und über die Läden selbst.

## Kurz gegenprüfen, wenn du magst (Datenqualität)
- [ ] **Hotel Europa / Apollo:** Deren Programmseiten drucken kein Jahr; die Termine wurden über
      den Wochentag auf 2026 datiert. Bei Gelegenheit stichprobenartig prüfen.
- [ ] **Südoase:** Website hat ein defektes TLS-Zertifikat → nicht automatisch auslesbar. Wenn du
      dort Programm siehst, schick es mir, dann pflege ich es ein (oder sag dem Laden Bescheid —
      das Zertifikat ist auch für ihre Gäste ein Problem).
- [ ] **Vier Spielstätten** haben noch geschätzte Koordinaten (Grenzlandtheater, Saalbau Rothe
      Erde, Barbarossa, Café Vers) — falls du die Adressen kennst, sag Bescheid.
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
- [ ] **Datenschutzerklärung einmal anwaltlich durchsehen lassen** (vor dem 22.08.). Die Angaben in
      der App sind jetzt vollständig und belegt (OpenFreeMap/Ungarn, Cloudflare, Service-Worker-
      Speicher, kein Tracking) — aber ich bin kein Anwalt, und die Seite wird öffentlich. Eine
      einmalige Durchsicht ist gut investiert, gerade weil am 11.08. die Markenanmeldung läuft.
- [x] ~~Netlify-Upload~~ → **live auf https://eventlas.netlify.app** (08.08.)
- [x] ~~GitHub-Push~~ → erledigt (08.08.)
- [x] ~~Netlify mit GitHub verbinden~~ → erledigt (14.08.), Build geprüft
- [ ] **Prüfen: Repo-Secret ANTHROPIC_API_KEY gültig und mit Guthaben?** (github.com → Repo →
      Settings → Secrets and variables → Actions). Gesetzt ist er — die Läufe am 09./10.08. haben
      funktioniert. Ob er noch Guthaben hat, sieht man nur am Bericht des nächsten Laufs: steht
      dort „⚠️ Recherche ausgefallen", liegt es meist daran. Die Karte bleibt trotzdem aktuell,
      es fehlen dann nur die per Websuche gefundenen Termine.
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

## Text 7 — Anfrage an eine Neueröffnung (Bestätigung + Einladung)
*Wofür:* Die vier Neueröffnungs-Pins stehen auf der Karte, drei davon mit ungenauer Hausnummer.
Diese Mail klärt beides auf einmal — Adresse bestätigen und den Laden gleich einladen, künftig
selbst Bescheid zu geben. Adresse der Läden über deren Website oder Instagram.

Betreff: Ihr steht auf der Aachener Stadtkarte — stimmen die Angaben?

Hallo [NAME],

herzlichen Glückwunsch zur Eröffnung! Ich betreibe **Eventlas**, eine kostenlose und werbefreie
Karte für Aachen: https://eventlas.netlify.app — dort sieht man auf einen Blick, was gerade in
der Stadt läuft. Neueröffnungen wie eure sind darauf als eigene Kategorie markiert.

Euer Eintrag steht schon drin. Zwei kurze Fragen dazu:

1. **Stimmt die Adresse?** Ich habe bisher nur „[STRASSE]" ohne Hausnummer — mit der genauen
   Angabe sitzt der Punkt exakt richtig.
2. **Wollt ihr eigene Termine daraufsetzen?** Eröffnungsfeier, Aktionstage, besondere
   Angebote — schickt sie mir einfach, ich pflege sie kostenlos ein. Ihr müsst euch nirgends
   anmelden und es entstehen keine Kosten; die Karte finanziert sich nicht über Einträge.

Falls etwas nicht stimmt oder ihr den Eintrag lieber nicht möchtet, sagt einfach Bescheid —
dann nehme ich ihn heraus.

Viele Grüße
[NAME]
Eventlas Aachen · https://eventlas.netlify.app

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
