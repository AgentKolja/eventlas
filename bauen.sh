#!/usr/bin/env bash
# Netlify-Build: kopiert die öffentlichen Dateien nach public/ und verkleinert die App.
#
# Warum ein eigenes Skript statt einer Zeile in netlify.toml: Die Minifizierung darf die
# Seite unter keinen Umständen offline nehmen. Sie läuft deshalb mit Prüfung und fällt
# im Zweifel auf die unveränderte Datei zurück — lieber 173 KB ausliefern als eine kaputte
# Seite. Der Rest des Builds bricht dagegen hart ab, wenn etwas fehlt.
set -euo pipefail

mkdir -p public/schriften public/bilder
cp pins.json orte.json manifest.json sw.js flyer.html public/
cp og.png icon-192.png icon-512.png public/
cp schriften/*.woff2 public/schriften/
cp bilder/*.jpg public/bilder/

# Erste und wichtigste Nagelprobe: Lässt sich das JavaScript überhaupt lesen? Ein einziges
# schiefes Anführungszeichen im deutschen Text macht die ganze Datei unparsbar und die App
# zeigt nur noch eine leere Karte — genau das ist am 14.08. passiert. Hier bricht der Build
# absichtlich hart ab: Eine Seite, die gar nicht startet, darf nicht live gehen.
node scripts/js-pruefen.mjs index.html

roh=$(wc -c < index.html)

# Kommentare bleiben absichtlich erhalten: Der Copyright-Hinweis oben in der Datei soll
# lesbar bleiben, und die erklärenden Kommentare kosten nach der Komprimierung durch den
# Server kaum etwas. Verkleinert wird, was wirklich Platz frisst — Leerraum, CSS und JS.
if npx --yes html-minifier-terser@7 \
      --collapse-whitespace --conservative-collapse \
      --minify-css true --minify-js true \
      -o public/index.html index.html 2>/dev/null; then

  klein=$(wc -c < public/index.html)
  # Drei Nagelproben: Ist überhaupt etwas herausgekommen, stehen die Stellen noch drin, ohne
  # die die App nicht startet, und ist das Ergebnis noch gültiges JavaScript? Ein Minifizierer,
  # der still die Hälfte verschluckt, fällt sonst erst dem Besucher auf. Hier wird nicht
  # abgebrochen, sondern auf das geprüfte Original zurückgefallen.
  if [ "$klein" -gt 20000 ] \
     && grep -q "maplibre-gl.js" public/index.html \
     && grep -q "pinsDatei" public/index.html \
     && grep -q "Alle Rechte vorbehalten" public/index.html \
     && node scripts/js-pruefen.mjs public/index.html; then
    echo "index.html verkleinert: $roh → $klein Bytes ($(( 100 - klein * 100 / roh )) % gespart)"
  else
    echo "WARNUNG: Minifizierung sah unvollständig aus ($klein Bytes) — nehme das Original."
    cp index.html public/index.html
  fi
else
  echo "WARNUNG: Minifizierung fehlgeschlagen — nehme das Original."
  cp index.html public/index.html
fi

echo "Build fertig:"
ls -la public/ | tail -n +2
