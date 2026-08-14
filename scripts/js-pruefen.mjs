/* Prüft, ob das eingebettete JavaScript einer HTML-Datei überhaupt lesbar ist.
 *
 * Anlass: Am 14.08.2026 stand in einem deutschen Text ein gerades Anführungszeichen
 * innerhalb eines mit " begrenzten Strings — «„Heute"» statt «„Heute“». Damit war die
 * gesamte Datei unparsbar, die App zeigte nur noch eine leere Karte. Der Fehler war
 * beim Lesen praktisch unsichtbar und wäre ohne Prüfung live gegangen.
 *
 * Die Prüfung parst nur (new Function), sie führt nichts aus: Ohne Browser gäbe es weder
 * document noch maplibregl. Ein Syntaxfehler fliegt trotzdem sofort auf.
 *
 * Aufruf: node scripts/js-pruefen.mjs <datei.html> [weitere.html ...]
 */
import { readFileSync } from "node:fs";

const dateien = process.argv.slice(2);
if (!dateien.length) {
  console.error("js-pruefen: keine Datei angegeben");
  process.exit(2);
}

let fehler = 0;
for (const datei of dateien) {
  const html = readFileSync(datei, "utf8");
  // Nur die eingebetteten Blöcke ohne src — die externen holt der Browser selbst.
  const bloecke = [...html.matchAll(/<script(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/gi)]
    .map(m => m[1])
    .filter(code => code.trim());

  if (!bloecke.length) {
    console.error(`FEHLER: ${datei} enthält kein eingebettetes Skript — das kann nicht stimmen.`);
    fehler++;
    continue;
  }

  bloecke.forEach((code, i) => {
    try {
      new Function(code);
    } catch (e) {
      // Zeilennummer in der Gesamtdatei ausrechnen, damit man die Stelle direkt findet.
      const davor = html.slice(0, html.indexOf(code));
      const zeileImBlock = Number((/(\d+)/.exec(String(e.stack).split("\n")[0]) || [])[1]) || 0;
      console.error(
        `FEHLER: ${datei} — Skriptblock ${i + 1} lässt sich nicht parsen: ${e.message}\n` +
        `        Block beginnt bei Zeile ${davor.split("\n").length} der Datei.` +
        (zeileImBlock ? ` Fehler etwa ${zeileImBlock} Zeilen danach.` : "")
      );
      fehler++;
    }
  });

  if (!fehler) console.log(`JavaScript-Prüfung: ${datei} in Ordnung (${bloecke.length} Block/Blöcke).`);
}

process.exit(fehler ? 1 : 0);
