// Eventlas Auto-Update v2 — läuft täglich per GitHub Action.
// Quellen: 1) feste Pins aus pins.json (fest:true — Fotospots, Ernte, Beispiele: bleiben immer),
//          2) Kulturkalender-JSON-API der Stadt (api.kulturkalender-aachen.de, CORS *),
//          3) Claude mit Websuche für alles andere (Feste, Märkte, Konzerte, Sport).
// Schema: typ event|angebot|hilfe|spot · tags[] · quelle · link · hot · hinzu · saison{von,bis} · fest
// Sicherheitsnetz: bei ungültiger Antwort bricht das Skript ab, ohne die alte pins.json zu zerstören.

import { writeFileSync, readFileSync, existsSync } from "fs";

const API_KEY = process.env.ANTHROPIC_API_KEY;
if (!API_KEY) {
  console.error("ANTHROPIC_API_KEY fehlt (GitHub Secret nicht gesetzt).");
  process.exit(1);
}

const heute = new Date().toISOString().slice(0, 10);
const heuteDate = new Date(heute + "T00:00:00Z");

// Grobe Region Aachen + Umland (inkl. Selfkant, Kelmis/B, Vaals/NL)
const BBOX = { lngMin: 5.85, lngMax: 6.35, latMin: 50.6, latMax: 51.1 };
const TYPEN = new Set(["event", "angebot", "hilfe", "spot"]);

/* ---------- 1) Bestehende Pins laden ---------- */
let alte = [];
if (existsSync("pins.json")) {
  try {
    alte = JSON.parse(readFileSync("pins.json", "utf8")).pins || [];
  } catch (e) {
    console.error("Bestehende pins.json unlesbar:", e.message);
    process.exit(1);
  }
}
const feste = alte.filter(p => p.fest === true);
const alteNichtFest = alte.filter(p => p.fest !== true);
const hinzuVonId = new Map(alte.map(p => [p.id, p.hinzu]));

// 90-Tage-Pruning (Roadmap Nr. 13): abgelaufene Nicht-fest-Pins fliegen raus.
// Saison-/wdh-Pins gelten als wiederkehrend und laufen nicht ab.
function abgelaufenSeitTagen(p) {
  if (p.saison || p.wdh) return -1;
  const ende = p.ende || p.start;
  if (!ende) return -1;
  return Math.floor((heuteDate - new Date(ende + "T00:00:00Z")) / 864e5);
}
const nochAktuell = alteNichtFest.filter(p => abgelaufenSeitTagen(p) <= 90);

function slug(s) {
  return String(s).toLowerCase()
    .replace(/ä/g, "ae").replace(/ö/g, "oe").replace(/ü/g, "ue").replace(/ß/g, "ss")
    .replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 40);
}
// Ortszelle (~1 km) im Schlüssel: gleicher Titel am selben Tag an ZWEI Orten ist KEIN Duplikat
// (z. B. "Öffentliche Führung" in zwei Museen), gleiche Veranstaltung aus zwei Quellen schon.
function dedupeKey(p) {
  const zelle = (typeof p.lng === "number" && typeof p.lat === "number")
    ? p.lng.toFixed(2) + "," + p.lat.toFixed(2) : "";
  return slug(p.titel) + "|" + (p.start || p.wdh || "") + "|" + zelle;
}
// Externe Quellen (LLM-Recherche, APIs) dürfen KEINE Steuer-Flags setzen: fest macht Pins
// unlöschbar, hot hebt sie hervor, eine fremde id könnte bestehende Pins kapern —
// alles Prompt-Injection-Angriffsfläche bei web_search. Nur Daten-Felder passieren.
function entschaerfe(p) {
  const q = { ...p };
  delete q.fest; delete q.hot; delete q.id;
  return q;
}

/* ---------- 2) Kulturkalender-API (städtischer Kulturbetrieb, 7 feste Häuser) ---------- */
const VENUES = [
  { muster: /suermondt/i, lng: 6.0905, lat: 50.7712, name: "Suermondt-Ludwig-Museum" },
  { muster: /ludwig\s*forum/i, lng: 6.0949, lat: 50.7823, name: "Ludwig Forum" },
  { muster: /charlemagne/i, lng: 6.0836, lat: 50.7757, name: "Centre Charlemagne" },
  { muster: /kurhaus/i, lng: 6.0870, lat: 50.7776, name: "Altes Kurhaus" },
  { muster: /couven/i, lng: 6.0849, lat: 50.7761, name: "Couven Museum" },
  { muster: /theater/i, lng: 6.0855, lat: 50.7737, name: "Theater Aachen" },
  { muster: /zeitungsmuseum/i, lng: 6.0824, lat: 50.7758, name: "Zeitungsmuseum" },
];
async function kulturPins() {
  try {
    const res = await fetch("https://api.kulturkalender-aachen.de/events", {
      headers: { "user-agent": "eventlas-aachen (Pin-Update, 1x taeglich)" },
    });
    if (!res.ok) { console.error("Kulturkalender-API:", res.status, "- übersprungen"); return []; }
    const daten = await res.json();
    const liste = Array.isArray(daten) ? daten : (daten.events || daten.data || []);
    const limit = new Date(heuteDate); limit.setDate(limit.getDate() + 45);
    const pins = [];
    for (const e of liste) {
      const titel = e.title || e.name;
      const startRoh = e.start_date || e.start || e.date;
      if (!titel || !startRoh) continue;
      const start = String(startRoh).slice(0, 10);
      const ende = e.end_date ? String(e.end_date).slice(0, 10) : undefined;
      const s = new Date(start + "T00:00:00Z");
      if (isNaN(s) || s > limit || (ende ? new Date(ende + "T00:00:00Z") : s) < heuteDate) continue;
      const venueName = String(e.venue?.name || e.venue || e.location || "");
      const venue = VENUES.find(v => v.muster.test(venueName));
      if (!venue) continue; // ohne Koordinaten kein Pin
      pins.push({
        id: "kk-" + slug(venue.name) + "-" + slug(titel) + "-" + start,
        typ: "event",
        titel: String(titel).slice(0, 90),
        text: ("Im " + venue.name + ". " + (e.main_cat ? "Kategorie: " + e.main_cat + "." : "")).trim(),
        lng: venue.lng, lat: venue.lat,
        start, ...(ende && ende !== start ? { ende } : {}),
        meta: venue.name,
        tags: ["kultur"],
        ...(e.url ? { link: String(e.url), quelle: String(e.url) } : { quelle: "https://www.kulturkalender-aachen.de" }),
      });
    }
    console.log(`Kulturkalender-API: ${pins.length} Pins übernommen.`);
    return pins;
  } catch (e) {
    console.error("Kulturkalender-API nicht erreichbar (übersprungen):", e.message);
    return [];
  }
}

/* ---------- 3) Claude mit Websuche ---------- */
const SYSTEM = `Du recherchierst aktuelle, öffentliche Veranstaltungen und kostenlose Angebote in Aachen, Deutschland,
für die Karten-App "Eventlas". Heutiges Datum: ${heute}.

Nutze web_search, um echte, aktuelle Informationen zu finden:
- Wochenmärkte, Flohmärkte, Stadtfeste, Konzerte, Sport-Heimspiele (Alemannia Aachen), Kulturveranstaltungen, Kinderveranstaltungen
- Nur Events, die HEUTE oder in den nächsten 45 Tagen stattfinden oder wiederkehrend sind (wdh)
- KEINE Geschäfte/Läden/Museen als Dauer-Pins (nur konkrete datierte Veranstaltungen)
- KEINE Inhalte von Kleinanzeigen.de oder nebenan.de (rechtlich nicht zulässig)
- KEINE erfundenen Fakten; bei Unsicherheit Eintrag weglassen statt raten
- Jeder Pin braucht "quelle" (Beleg-URL der Recherche)

Antworte AUSSCHLIESSLICH mit validem JSON, keine Erklärung, kein Markdown, kein Codeblock-Zaun:
{"pins":[
  {"typ":"event","titel":"...","text":"max 2 Sätze Deutsch","lng":6.xxx,"lat":50.xxx,"meta":"Kurzinfo z.B. Uhrzeit/Ort",
   "tags":["flohmarkt"|"musik"|"essen"|"kinder"|"sport"|"kultur"|"fest"|"markt"|"kostenlos"|"party"],
   "quelle":"https://...","link":"https://..." (optional),
   "start":"JJJJ-MM-TT" (optional),"ende":"JJJJ-MM-TT" (optional),"wdh":"mo|di|mi|do|fr|sa|so, kommagetrennt" (optional),
   "hot":true (optional, max 3 Pins: nur gerade laufende Publikums-Highlights)}
]}
Koordinaten müssen echte Aachener Orte sein (lng ${BBOX.lngMin}–${BBOX.lngMax}, lat ${BBOX.latMin}–${BBOX.latMax}).
15-25 Pins insgesamt. Texte sachlich, keine Übernahme fremder Formulierungen.

Diese Pins existieren bereits — NICHT erneut liefern, es sei denn mit korrigierten Fakten:
`;

async function claudePins(bekannt) {
  const bekanntListe = bekannt.map(p => `- ${p.titel} (${p.start || p.wdh || "laufend"})`).join("\n");
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
      system: SYSTEM + bekanntListe,
      messages: [{ role: "user", content: "Recherchiere jetzt und liefere das JSON." }],
      tools: [{ type: "web_search_20250305", name: "web_search" }],
    }),
  });
  if (!res.ok) {
    console.error("API-Fehler:", res.status, await res.text());
    process.exit(1);
  }
  const data = await res.json();
  const raw = (data.content || []).filter(b => b.type === "text").map(b => b.text).join("\n").trim();
  const start = raw.indexOf("{");
  const end = raw.lastIndexOf("}");
  if (start === -1 || end === -1) {
    console.error("Keine JSON-Struktur in der Antwort. Breche ab, alte pins.json bleibt.");
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
  if (!parsed.pins || !Array.isArray(parsed.pins)) {
    console.error("Kein pins-Array in der Antwort, breche ab.");
    process.exit(1);
  }
  return parsed.pins;
}

/* ---------- Validierung + Merge ---------- */
function valide(p) {
  return p && p.titel && p.text && TYPEN.has(p.typ || "event") &&
    typeof p.lng === "number" && typeof p.lat === "number" &&
    p.lng > BBOX.lngMin && p.lng < BBOX.lngMax && p.lat > BBOX.latMin && p.lat < BBOX.latMax &&
    (!p.quelle || /^https?:\/\//.test(p.quelle)) && (!p.link || /^https?:\/\//.test(p.link));
}
function normiere(p) {
  return {
    id: p.id || slug(p.titel) + (p.start ? "-" + p.start : ""),
    typ: p.typ || "event",
    titel: String(p.titel).slice(0, 90),
    text: String(p.text).slice(0, 300),
    lng: p.lng, lat: p.lat,
    ...(p.start ? { start: p.start } : {}),
    ...(p.ende ? { ende: p.ende } : {}),
    ...(p.wdh ? { wdh: p.wdh } : {}),
    ...(p.saison ? { saison: p.saison } : {}),
    ...(p.meta ? { meta: String(p.meta).slice(0, 60) } : {}),
    ...(Array.isArray(p.tags) && p.tags.length ? { tags: p.tags.slice(0, 5) } : {}),
    ...(p.link ? { link: p.link } : {}),
    ...(p.quelle ? { quelle: p.quelle } : {}),
    ...(p.hot === true ? { hot: true } : {}),
    hinzu: hinzuVonId.get(p.id || slug(p.titel) + (p.start ? "-" + p.start : "")) || p.hinzu || heute,
    ...(p.fest === true ? { fest: true } : {}),
  };
}

async function main() {
  const bekannt = [...feste, ...nochAktuell];
  const [kultur, recherche] = await Promise.all([kulturPins(), claudePins(bekannt)]);

  // Kultur-API behält ihre deterministische id, verliert aber fest/hot;
  // LLM-Recherche verliert zusätzlich die id (wird aus Titel+Datum neu gebildet).
  const kulturSicher = kultur.map(p => { const q = entschaerfe(p); q.id = p.id; return q; });
  const neuGueltig = [...kulturSicher, ...recherche.map(entschaerfe)].filter(valide).map(normiere);
  console.log(`Recherche: ${recherche.length} geliefert, Kultur-API: ${kultur.length}, davon valide gesamt: ${neuGueltig.length}.`);

  // Merge: feste Pins zuerst, dann bisherige aktuelle, dann Neues — Duplikate (Titel+Datum) fliegen raus.
  const gesehen = new Set();
  const ergebnis = [];
  for (const p of [...feste.map(normiere), ...nochAktuell.map(normiere), ...neuGueltig]) {
    const k = dedupeKey(p);
    if (gesehen.has(k)) { console.log("Duplikat verworfen:", p.titel, "(" + k + ")"); continue; }
    gesehen.add(k);
    ergebnis.push(p);
  }

  // Endgültiges Pruning auf das Gesamtergebnis
  const final = ergebnis.filter(p => p.fest || abgelaufenSeitTagen(p) <= 90);

  if (final.length < Math.max(10, feste.length)) {
    console.error(`Nur ${final.length} Pins nach Merge — zu wenig, breche ab, alte pins.json bleibt.`);
    process.exit(1);
  }

  const output = {
    stand: heute,
    hinweis: "Schema: typ event|angebot|hilfe|spot · tags[] · quelle (Beleg-URL) · link (CTA) · hot (beliebt) · hinzu (Aufnahmedatum) · saison {von,bis als MM-TT, jaehrlich wiederkehrend} · fest:true = wird vom Auto-Update nie geloescht.",
    pins: final,
  };
  writeFileSync("pins.json", JSON.stringify(output, null, 1) + "\n");
  console.log(`OK: ${final.length} Pins geschrieben (${feste.length} feste, Stand ${heute}).`);
}

main().catch(e => {
  console.error("Unerwarteter Fehler, breche ab, alte pins.json bleibt:", e);
  process.exit(1);
});
