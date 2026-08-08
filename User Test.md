##TEST FEEDBACK (priorisieren):
> Status vom KI-Agenten, 08.08.2026 abends — alle 6 Punkte umgesetzt und lokal getestet.

- [x] Icons verschieben sich an verschiedene Orte, wenn man bei Karte rein und rauszoomt --> fixen!
      → **Ursache gefunden:** eigenes CSS hat MapLibres `position:absolute` der Marker mit
      `position:relative` überschrieben — dadurch hingen die Icons im Layout-Fluss statt fest
      an der Koordinate. Behoben; Marker sitzen jetzt in jeder Zoomstufe fix.
- [x] Filterauswahl spinnt - wenn das eine ausgewählt ist und man nochmal klickt ändert es
      Auswahlfarben nicht konsistent
      → Tag-Chips setzen ihren Aktiv-Zustand (Farbe + aria-pressed) jetzt direkt beim Klick.
      (Deckte sich mit einem Befund des Code-Reviews.)
- [x] Auswahl aufheben Möglichkeit?
      → Neuer Chip „✕ Zurücksetzen" erscheint links in der Themenleiste, sobald irgendein
      Filter aktiv ist (Themen, Suche, Zeitraum, Kategorie aus, Für dich, Gemerkt) — ein Tipp
      setzt alles auf Standard zurück.
- [x] Mundraub nicht als Angebot markieren - die Icons beim Filter sind gut, diese auch auf
      der Karte übernehmen.
      → Karten-Blips zeigen jetzt das Themen-Symbol wie in der Filterleiste (🍏 Ernte,
      🧺 Markt, ⚽ Sport, 🎵 Musik, 📸 Fotospot …); die Kategorie bleibt über Form + Farbe
      erkennbar. Mundraub-Orte sind damit sofort als Ernte lesbar.
- [x] Noch zeitliche Auswahl verbessern - in bestimmten Zeiträumen ermöglichen
      → Neuer Chip „📅 Zeitraum" neben Heute/Demnächst/Alle: Von/Bis-Datum wählen, der Chip
      zeigt den aktiven Zeitraum (z. B. „📅 29.8.–30.8."), aufheben jederzeit möglich.
- [x] Die Anzahl der Events wird nicht richtig dargestellt - Bei der Anzahl auch Möglichkeit
      zur Listenansicht machen, die mit der Karte interagiert!
      → Die Zähler beziehen sich bewusst auf den sichtbaren Kartenausschnitt (beim Zoomen/
      Verschieben zählen sie live mit). Damit das nachvollziehbar ist, gibt es jetzt die
      **Listenansicht** (☰-Knopf oben): zeigt genau die gezählten Pins sortiert nach Kategorie
      und Datum, Antippen springt zur Karte und öffnet das Popup.
