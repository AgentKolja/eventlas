// Eventlas Auto-Update: ruft Claude mit Websuche auf, recherchiert aktuelle Aachen-Events
// und schreibt pins.json. Bricht bei ungültiger Antwort ab, ohne die alte Datei zu zerstören.

import { writeFileSync, readFileSync, existsSync } from "fs";

const API_KEY = process.env.ANTHROPIC_API_KEY;
if (!API_KEY) {
  console.error("ANTHROPIC_API_KEY fehlt (GitHub Secret nicht gesetzt).");
  process.exit(1);
}

const heute = new Date().toISOString().slice(0, 10);

const SYSTEM = `Du recherchierst aktuelle, öffentliche Veranstaltungen und Fundorte in Aachen, Deutschland,
für die Karten-App "Eventlas". Heutiges Datum: ${heute}.

Nutze web_search, um echte, aktuelle Informationen zu finden:
- Wochenmärkte, Flohmärkte, Stadtfeste, Konzerte, Sport-Heimspiele (Alemannia Aachen), Kulturveranstaltungen
- Öffentliche kostenlose Ernte-Fundorte (mundraub.org, Suche "mundraub Aachen")
- Nur Events, die HEUTE oder in den nächsten 30 Tagen stattfinden oder wiederkehrend sind
- KEINE Geschäfte/Läden, KEINE erfundenen Fakten, KEINE Inhalte von Kleinanzeigen.de oder nebenan.de (rechtlich nicht zulässig)
- Bei Unsicherheit: Eintrag weglassen statt raten

Antworte AUSSCHLIESSLICH mit validem JSON, keine Erklärung, kein Markdown, kein Codeblock-Zaun:
{"stand":"${heute}","pins":[
  {"typ":"event","titel":"...","text":"...","lng":6.xxx,"lat":50.xxx,"meta":"...","link":"https://...",
   "start":"JJJJ-MM-TT" (optional),"ende":"JJJJ-MM-TT" (optional),"wdh":"mo|di|mi|do|fr|sa|so, kommagetrennt" (optional)}
]}
typ ist "event" oder "angebot" (für Ernte-Fundorte/kostenlose Orte). Koordinaten müssen echte Aachener Orte sein.
15-25 Pins insgesamt. Texte auf Deutsch, sachlich, max. 2 Sätze.`;

async function main() {
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-api-key": API_KEY,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-6",
      max_tokens: 8000,
      system: SYSTEM,
      messages: [{ role: "user", content: "Recherchiere jetzt und liefere das JSON." }],
      tools: [{ type: "web_search_20250305", name: "web_search" }],
    }),
  });

  if (!res.ok) {
    console.error("API-Fehler:", res.status, await res.text());
    process.exit(1);
  }

  const data = await res.json();
  const textBlocks = (data.content || []).filter(b => b.type === "text").map(b => b.text);
  const raw = textBlocks.join("\n").trim();

  // Robust extrahieren: erstes { bis letztes }
  const start = raw.indexOf("{");
  const end = raw.lastIndexOf("}");
  if (start === -1 || end === -1) {
    console.error("Keine JSON-Struktur in der Antwort gefunden. Breche ab, alte pins.json bleibt.");
    console.error(raw.slice(0, 500));
    process.exit(1);
  }

  let parsed;
  try {
    parsed = JSON.parse(raw.slice(start, end + 1));
  } catch (e) {
    console.error("JSON ungültig, breche ab, alte pins.json bleibt:", e.message);
    process.exit(1);
  }

  if (!parsed.pins || !Array.isArray(parsed.pins) || parsed.pins.length < 5) {
    console.error("Zu wenige/keine Pins in der Antwort, breche ab, alte pins.json bleibt.");
    process.exit(1);
  }

  // Grundvalidierung jedes Pins
  const gueltig = parsed.pins.filter(p =>
    p.typ && p.titel && p.text &&
    typeof p.lng === "number" && typeof p.lat === "number" &&
    p.lng > 5.5 && p.lng < 6.6 && p.lat > 50.5 && p.lat < 51.0 // grobe Aachen-Region
  );

  if (gueltig.length < 5) {
    console.error("Zu wenige valide Pins nach Prüfung, breche ab, alte pins.json bleibt.");
    process.exit(1);
  }

  const output = { stand: heute, pins: gueltig };
  writeFileSync("pins.json", JSON.stringify(output, null, 1) + "\n");
  console.log(`OK: ${gueltig.length} Pins geschrieben (Stand ${heute}).`);
}

main().catch(e => {
  console.error("Unerwarteter Fehler, breche ab, alte pins.json bleibt:", e);
  process.exit(1);
});
