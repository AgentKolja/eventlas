#!/usr/bin/env bash
# Netlify-Build: kopiert die öffentlichen Dateien nach public/, verschleiert und verkleinert die App.
#
# Warum ein eigenes Skript statt einer Zeile in netlify.toml: Weder Verschleierung noch
# Minifizierung dürfen die Seite unter irgendeinen Umständen offline nehmen. Beide laufen
# deshalb mit Prüfung und fallen im Zweifel auf die vorherige Stufe zurück — lieber 173 KB
# lesbaren Code ausliefern als eine kaputte Seite. Der Rest des Builds bricht dagegen hart
# ab, wenn etwas fehlt.
set -euo pipefail

mkdir -p public/schriften public/bilder
cp pins.json orte.json manifest.json sw.js flyer.html public/
cp og.png icon-192.png icon-512.png public/
cp schriften/*.woff2 public/schriften/
cp bilder/*.jpg public/bilder/

# Erste und wichtigste Nagelprobe: Lässt sich das JavaScript überhaupt lesen? Ein einziges
# schiefes Anführungszeichen im deutschen Text macht die ganze Datei unparsbar und die App
# zeigt nur noch eine leere Karte — genau das ist am 14.08. passiert. Findet die Prüfung
# einen Syntaxfehler, bricht der Build absichtlich hart ab: Eine Seite, die gar nicht
# startet, darf nicht live gehen.
#
# Fehlt dagegen node selbst, ist das ein Problem der Bauumgebung und kein Codefehler. Dann
# nur warnen und weitermachen — sonst friert ein Umgebungsfehler die Seite auf ewig auf dem
# alten Stand ein, und man sucht den Fehler tagelang im eigenen Code.
if command -v node >/dev/null 2>&1; then
  node scripts/js-pruefen.mjs index.html
else
  echo "WARNUNG: node nicht gefunden — JavaScript-Prüfung übersprungen."
fi

# Quelltext verschleiern, damit er im Browser nicht mehr 1:1 les- und kopierbar ist
# (Variablennamen weg, Texte als Base64-Tabelle). Gleiche Vorsicht wie bei der Minifizierung
# weiter unten: Jeder Fehlschlag — Werkzeug nicht ladbar, Ergebnis unvollständig, kein gültiges
# JavaScript mehr — fällt stumm auf den unverschleierten Quelltext zurück. Verschleierung ist
# ein Nice-to-have, eine laufende Seite ist Pflicht.
quelle=index.html
if command -v node >/dev/null 2>&1; then
  if node scripts/js-extrahieren.mjs index.html _rohcode.js \
     && npx --yes javascript-obfuscator@4 _rohcode.js --output _verschleiert.js \
           --compact true \
           --identifier-names-generator hexadecimal \
           --rename-globals false \
           --string-array true \
           --string-array-encoding base64 \
           --string-array-threshold 0.75 \
           --control-flow-flattening false \
           --dead-code-injection false \
           --self-defending false \
           --debug-protection false 2>/dev/null \
     && node scripts/js-einsetzen.mjs index.html _verschleiert.js _obfuskiert.html \
     && grep -q "maplibre-gl.js" _obfuskiert.html \
     && grep -q "pinsDatei" _obfuskiert.html \
     && grep -q "Alle Rechte vorbehalten" _obfuskiert.html \
     && node scripts/js-pruefen.mjs _obfuskiert.html; then
    quelle=_obfuskiert.html
    echo "JavaScript verschleiert."
  else
    echo "WARNUNG: Verschleierung fehlgeschlagen oder unvollständig — nehme den Klartext-Quellcode."
  fi
else
  echo "WARNUNG: node nicht gefunden — Verschleierung übersprungen."
fi

roh=$(wc -c < "$quelle")

# Kommentare bleiben absichtlich erhalten: Der Copyright-Hinweis oben in der Datei soll
# lesbar bleiben, und die erklärenden Kommentare kosten nach der Komprimierung durch den
# Server kaum etwas. Verkleinert wird, was wirklich Platz frisst — Leerraum, CSS und JS.
if npx --yes html-minifier-terser@7 \
      --collapse-whitespace --conservative-collapse \
      --minify-css true --minify-js true \
      -o public/index.html "$quelle" 2>/dev/null; then

  klein=$(wc -c < public/index.html)
  # Drei Nagelproben: Ist überhaupt etwas herausgekommen, stehen die Stellen noch drin, ohne
  # die die App nicht startet, und ist das Ergebnis noch gültiges JavaScript? Ein Minifizierer,
  # der still die Hälfte verschluckt, fällt sonst erst dem Besucher auf. Hier wird nicht
  # abgebrochen, sondern auf das geprüfte Original zurückgefallen.
  if [ "$klein" -gt 20000 ] \
     && grep -q "maplibre-gl.js" public/index.html \
     && grep -q "pinsDatei" public/index.html \
     && grep -q "Alle Rechte vorbehalten" public/index.html \
     && { ! command -v node >/dev/null 2>&1 || node scripts/js-pruefen.mjs public/index.html; }; then
    echo "index.html verkleinert: $roh → $klein Bytes ($(( 100 - klein * 100 / roh )) % gespart)"
  else
    echo "WARNUNG: Minifizierung sah unvollständig aus ($klein Bytes) — nehme das Original."
    cp "$quelle" public/index.html
  fi
else
  echo "WARNUNG: Minifizierung fehlgeschlagen — nehme das Original."
  cp "$quelle" public/index.html
fi

# Was steht eigentlich gerade live? Ohne diese Datei ließ sich das nur raten — man vergleicht
# Dateigrößen und sucht nach Codeschnipseln, um herauszufinden, ob ein Deploy angekommen ist.
# Netlify reicht Commit und Zeitpunkt als Umgebungsvariablen herein.
cat > public/version.json <<VERSION
{
  "commit": "${COMMIT_REF:-unbekannt}",
  "gebaut": "$(date -u +%Y-%m-%dT%H:%M:%SZ)",
  "zweig": "${BRANCH:-unbekannt}",
  "hinweis": "Zeigt, welcher Stand gerade ausgeliefert wird. Erzeugt von bauen.sh bei jedem Deploy."
}
VERSION

echo "Build fertig:"
ls -la public/ | tail -n +2
