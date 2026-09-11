/* Schreibt den großen eingebetteten Skriptblock einer HTML-Datei in eine eigene .js-Datei,
 * damit ein externes Werkzeug (javascript-obfuscator) ihn separat bearbeiten kann. Das externe
 * <script src="…maplibre-gl.js"> bleibt außen vor — das liefert unpkg schon fertig aus.
 *
 * Aufruf: node scripts/js-extrahieren.mjs <eingabe.html> <ausgabe.js>
 */
import { readFileSync, writeFileSync } from "node:fs";

const [eingabe, ausgabe] = process.argv.slice(2);
if (!eingabe || !ausgabe) {
  console.error("js-extrahieren: Aufruf mit <eingabe.html> <ausgabe.js>");
  process.exit(2);
}

const html = readFileSync(eingabe, "utf8");
const treffer = [...html.matchAll(/<script(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/gi)]
  .map(m => m[1])
  .filter(code => code.trim());

if (treffer.length !== 1) {
  console.error(`js-extrahieren: erwarte genau einen eingebetteten Skriptblock, gefunden: ${treffer.length}`);
  process.exit(1);
}

writeFileSync(ausgabe, treffer[0], "utf8");
