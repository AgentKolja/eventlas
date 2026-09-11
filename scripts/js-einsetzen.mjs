/* Setzt eine (verschleierte) .js-Datei wieder als eingebetteten Skriptblock in eine HTML-Datei
 * ein — das Gegenstück zu js-extrahieren.mjs.
 *
 * Aufruf: node scripts/js-einsetzen.mjs <original.html> <neuer-code.js> <ausgabe.html>
 */
import { readFileSync, writeFileSync } from "node:fs";

const [original, neuerCode, ausgabe] = process.argv.slice(2);
if (!original || !neuerCode || !ausgabe) {
  console.error("js-einsetzen: Aufruf mit <original.html> <neuer-code.js> <ausgabe.html>");
  process.exit(2);
}

const html = readFileSync(original, "utf8");
const code = readFileSync(neuerCode, "utf8");

const regex = /(<script(?![^>]*\bsrc=)[^>]*>)([\s\S]*?)(<\/script>)/i;
if (!regex.test(html)) {
  console.error("js-einsetzen: kein eingebetteter Skriptblock in der Originaldatei gefunden");
  process.exit(1);
}

// Ersetzung über eine Funktion statt eines Musters: $-Zeichen im verschleierten Code (z. B. aus
// Base64-Strings) würden sonst von String.replace als Platzhalter ($&, $1, …) fehlinterpretiert.
const ergebnis = html.replace(regex, (_ganz, anfang, _alt, ende) => anfang + code + ende);
writeFileSync(ausgabe, ergebnis, "utf8");
