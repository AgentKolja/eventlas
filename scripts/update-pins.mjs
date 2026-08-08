// Eventlas Auto-Update v3 — läuft täglich per GitHub Action.
// Quellen: 1) feste Pins aus pins.json (fest:true — Fotospots, Ernte, Beispiele: bleiben immer),
//          2) Kulturkalender-JSON-API der Stadt (api.kulturkalender-aachen.de, CORS *),
//          3) Claude mit Websuche — bekommt dabei gezielt die Spielstätten aus venues.json,
//             damit Konzerte & Co. aus Häusern mit wechselndem Programm zuverlässig auftauchen.
// Schema: typ event|angebot|hilfe|spot · tags[] · quelle · link · hot · hinzu · saison{von,bis} · fest
// Sicherheitsnetz: bei ungültiger Antwort bricht das Skript ab, ohne die alte pins.json zu zerstören.
//
// NEUE STADT AUFSCHALTEN: In venues.json unter "staedte" einen Eintrag anlegen (Name, bbox,
// Spielstätten mit Koordinaten) und das Skript mit STADT=<schluessel> starten. Nichts im Code ändern.

import { writeFileSync, readFileSync, existsSync } from "fs";

const API_KEY = process.env.ANTHROPIC_API_KEY;
if (!API_KEY) {
  console.error("ANTHROPIC_API_KEY fehlt (GitHub Secret nicht gesetzt).");
  process.exit(1);
}

const heute = new Date().toISOString().slice(0, 10);
const heuteDate = new Date(heute + "T00:00:00Z");
const TYPEN = new Set(["event", "angebot", "hilfe", "spot"]);

/* ---------- Stadt + Spielstätten laden (venues.json) ---------- */
const STADT_KEY = process.env.STADT || "aachen";
let STADT = { name: "Aachen", bbox: { lngMin: 5.85, lngMax: 6.35, latMin: 50.6, latMax: 51.1 }, venues: [] };
if (existsSync("venues.json")) {
  try {
    const v = JSON.parse(readFileSync("venues.json", "utf8"));
    if (v.staedte && v.staedte[STADT_KEY]) STADT = { ...STADT, ...v.staedte[STADT_KEY] };
    else console.error(`Warnung: Stadt "${STADT_KEY}" fehlt in venues.json — nutze Vorgaben.`);
  } catch (e) {
    console.error("venues.json unlesbar, nutze Vorgaben:", e.message);
  }
}
const BBOX = STADT.bbox;
const VENUES = (STADT.venues || []).filter(v =>
  typeof v.lng === "number" && typeof v.lat === "number" && v.name);
console.log(`Stadt: ${STADT.name} (${STADT_KEY}), ${VENUES.length} Spielstätten hinterlegt.`);

/* Koordinaten-Snapping: Nennt ein recherchierter Pin eine bekannte Spielstätte, setzen wir die
   hinterlegten (geprüften) Koordinaten ein. Das eliminiert geratene Positionen — die häufigste
   Fehlerquelle bei LLM-Recherche — und hält alle Events eines Hauses exakt am selben Punkt. */
function snapAufVenue(p) {
  const heu = ((p.titel || "") + " " + (p.meta || "") + " " + (p.text || "")).toLowerCase();
  const treffer = VENUES.find(v =>
    (v.aliase || [v.name]).concat(v.name).some(a => a && heu.includes(String(a).toLowerCase())));
  if (!treffer) return p;
  const weitAb = Math.abs((p.lng ?? treffer.lng) - treffer.lng) > 0.02 ||
                 Math.abs((p.lat ?? treffer.lat) - treffer.lat) > 0.02;
  if (weitAb) console.log(`Koordinate korrigiert: "${p.titel}" → ${treffer.name}`);
  return { ...p, lng: treffer.lng, lat: treffer.lat,
    tags: [...new Set([...(p.tags || []), ...(treffer.tags || [])])].slice(0, 5) };
}

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

/* ---------- 2) Kulturkalender-API ----------
   Welche Häuser die API liefert, steht in venues.json: jede Spielstätte mit "muster"
   (Regex als Text) wird darüber zugeordnet. Fehlt die Datei, greift die Notliste unten. */
const KULTUR_HAEUSER = VENUES.filter(v => v.muster)
  .map(v => { try { return { ...v, re: new RegExp(v.muster, "i") }; } catch (e) { return null; } })
  .filter(Boolean);
if (!KULTUR_HAEUSER.length) {
  [ { muster: "suermondt", lng: 6.0905, lat: 50.7712, name: "Suermondt-Ludwig-Museum" },
    { muster: "ludwig\\s*forum", lng: 6.0949, lat: 50.7823, name: "Ludwig Forum" },
    { muster: "charlemagne", lng: 6.0836, lat: 50.7757, name: "Centre Charlemagne" },
    { muster: "kurhaus", lng: 6.0870, lat: 50.7776, name: "Altes Kurhaus" },
    { muster: "couven", lng: 6.0849, lat: 50.7761, name: "Couven Museum" },
    { muster: "theater", lng: 6.0855, lat: 50.7737, name: "Theater Aachen" },
    { muster: "zeitungsmuseum", lng: 6.0824, lat: 50.7758, name: "Zeitungsmuseum" },
  ].forEach(v => KULTUR_HAEUSER.push({ ...v, re: new RegExp(v.muster, "i") }));
}
async function kulturPins() {
  if (!STADT.kulturApi) return [];          // nur Städte mit passender API
  try {
    const res = await fetch(STADT.kulturApi, {
      headers: { "user-agent": "eventlas (Pin-Update, 1x taeglich)" },
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
      const venue = KULTUR_HAEUSER.find(v => v.re.test(venueName));
      if (!venue) continue; // ohne Koordinaten kein Pin
      pins.push({
        id: "kk-" + slug(venue.name) + "-" + slug(titel) + "-" + start,
        typ: "event",
        titel: String(titel).slice(0, 90),
        text: ("Im " + venue.name + ". " + (e.main_cat ? "Kategorie: " + e.main_cat + "." : "")).trim(),
        lng: venue.lng, lat: venue.lat,
        start, ...(ende && ende !== start ? { ende } : {}),
        meta: venue.name,
        tags: [...new Set(["kultur", ...(venue.tags || [])])].slice(0, 5),
        ...(e.url ? { link: String(e.url), quelle: String(e.url) } : { quelle: venue.programm || STADT.kulturApi }),
      });
    }
    console.log(`Kulturkalender-API: ${pins.length} Pins übernommen.`);
    return pins;
  } catch (e) {
    console.error("Kulturkalender-API nicht erreichbar (übersprungen):", e.message);
    return [];
  }
}

/* ---------- 2b) Konzert-Quellen ----------
   Der Kulturkalender kennt nur Museen — Clubkonzerte fehlten dadurch komplett.
   Diese beiden Quellen schließen die Lücke, ohne LLM und ohne Browser:
   a) rausgegangen.de Kategorie "Konzerte und Musik" (robots.txt erlaubt Crawling
      ausdrücklich, Crawl-Delay 10 s wird eingehalten; Venue + Datum stehen bereits
      in der Kachel, Detailseiten müssen also nicht abgerufen werden),
   b) der Bigcartel-Ticketshop des Musikbunkers als echtes JSON.
   Beide liefern keine Koordinaten — die kommen über snapAufVenue() aus venues.json. */

const MONATE_KURZ = { jan:1, feb:2, "mär":3, mar:3, mrz:3, apr:4, mai:5, jun:6, jul:7,
  aug:8, sep:9, okt:10, "nov":11, dez:12 };

// Tag/Monat ohne Jahr → nächstes passendes Datum ab heute (löst den Jahreswechsel)
function datumAusTagMonat(tag, monat) {
  const jetzt = heuteDate;
  let jahr = jetzt.getUTCFullYear();
  let d = new Date(Date.UTC(jahr, monat - 1, tag));
  if ((jetzt - d) / 864e5 > 30) d = new Date(Date.UTC(jahr + 1, monat - 1, tag));
  return d.toISOString().slice(0, 10);
}

function entHtml(s) {
  return String(s).replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"').replace(/&#39;|&#x27;/g, "'").replace(/&nbsp;/g, " ")
    .replace(/&auml;/g, "ä").replace(/&ouml;/g, "ö").replace(/&uuml;/g, "ü")
    .replace(/&szlig;/g, "ß").replace(/&Auml;/g, "Ä").replace(/&Ouml;/g, "Ö").replace(/&Uuml;/g, "Ü")
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(+n))
    .replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

async function rausgegangenKonzerte() {
  if (!STADT.konzertQuelle) return [];
  const pins = [];
  for (const seite of [1, 2]) {
    const url = STADT.konzertQuelle + (seite > 1 ? "?page=" + seite : "");
    try {
      if (seite > 1) await new Promise(r => setTimeout(r, 10000));   // Crawl-Delay respektieren
      const res = await fetch(url, { headers: {
        "user-agent": "EventlasBot/1.0 (nichtkommerzielle Stadtkarte; +https://eventlas.netlify.app)",
        "accept": "text/html",
      }});
      if (!res.ok) { console.error("rausgegangen:", res.status, "- übersprungen"); break; }
      const html = await res.text();

      // Jede Kachel beginnt mit event-tile-link und endet vor der nächsten
      const kacheln = html.split('data-testid="event-tile-link"').slice(1);
      for (const k of kacheln) {
        const href    = (k.match(/href="([^"]+)"/) || [])[1];
        const titel   = entHtml((k.match(/data-testid="event-tile-name"[^>]*>([\s\S]*?)<\/span>/) || [])[1] || "");
        const ort     = entHtml((k.match(/data-testid="event-tile-location"[^>]*>([\s\S]*?)<\/p>/) || [])[1] || "");
        const zeitRoh = entHtml((k.match(/data-testid="event-tile-datetime"[^>]*>([\s\S]*?)<\/p>/) || [])[1] || "");
        if (!titel || !ort || !zeitRoh) continue;

        // "Fr, 14. Aug | 20:00"
        const m = zeitRoh.match(/(\d{1,2})\.\s*([A-Za-zÄÖÜäöü]{3,})\s*\|?\s*(\d{1,2}:\d{2})?/);
        if (!m) continue;
        const monat = MONATE_KURZ[m[2].slice(0, 3).toLowerCase()];
        if (!monat) continue;
        const start = datumAusTagMonat(parseInt(m[1], 10), monat);
        const uhr = m[3] || "";

        pins.push({
          typ: "event",
          titel,
          text: "Konzert in " + ort.replace(/\s+e\.?\s?V\.?$/i, "") + (uhr ? ", Beginn " + uhr + " Uhr." : "."),
          lng: 0, lat: 0,                                  // wird von snapAufVenue gesetzt
          start,
          meta: ort.replace(/\s+e\.?\s?V\.?$/i, "") + (uhr ? " · " + uhr : ""),
          tags: ["musik"],
          quelle: href ? "https://rausgegangen.de" + href : STADT.konzertQuelle,
          link: href ? "https://rausgegangen.de" + href : undefined,
        });
      }
    } catch (e) {
      console.error("rausgegangen nicht erreichbar (übersprungen):", e.message);
      break;
    }
  }
  console.log(`rausgegangen: ${pins.length} Konzerte gefunden.`);
  return pins;
}

async function musikbunkerKonzerte() {
  if (!STADT.bigcartelShop) return [];
  try {
    const res = await fetch(`https://api.bigcartel.com/${STADT.bigcartelShop}/products.json`, {
      headers: { "user-agent": "EventlasBot/1.0 (nichtkommerzielle Stadtkarte)" },
    });
    if (!res.ok) { console.error("Bigcartel:", res.status, "- übersprungen"); return []; }
    const liste = await res.json();
    const pins = [];
    for (const prod of (Array.isArray(liste) ? liste : [])) {
      const name = String(prod.name || "");
      // Format: "SOEN // 13.08.2026"
      const m = name.match(/^(.*?)\s*\/\/\s*(\d{1,2})\.(\d{1,2})\.(\d{4})/);
      if (!m) continue;
      const start = `${m[4]}-${String(m[3]).padStart(2, "0")}-${String(m[2]).padStart(2, "0")}`;
      if (new Date(start + "T00:00:00Z") < heuteDate) continue;        // vergangene Shows bleiben im Shop stehen
      const ausverkauft = String(prod.status || "").toLowerCase().includes("sold");
      pins.push({
        typ: "event",
        titel: m[1].trim(),
        text: "Konzert im Musikbunker." + (ausverkauft ? " Ausverkauft." : ""),
        lng: 0, lat: 0,
        start,
        meta: "Musikbunker" + (ausverkauft ? " · ausverkauft" : ""),
        tags: ["musik"],
        quelle: prod.url ? `https://${STADT.bigcartelShop}.bigcartel.com${prod.url}` : "https://mubu.ac",
        link: prod.url ? `https://${STADT.bigcartelShop}.bigcartel.com${prod.url}` : undefined,
      });
    }
    console.log(`Musikbunker-Shop: ${pins.length} Konzerte gefunden.`);
    return pins;
  } catch (e) {
    console.error("Bigcartel nicht erreichbar (übersprungen):", e.message);
    return [];
  }
}

/* Tribe-Events-API (WordPress-Plugin "The Events Calendar"): sauberes JSON mit Venue-Namen.
   aachen-kalender.de deckt damit sogar Kneipen ohne eigene Website ab (Schlüsselloch, Café Kittel). */
async function tribePins() {
  const quellen = STADT.tribeApis || [];
  if (!quellen.length) return [];
  const bis = new Date(heuteDate); bis.setDate(bis.getDate() + 45);
  const alle = [];
  for (const basis of quellen) {
    try {
      const url = `${basis}?start_date=${heute}&end_date=${bis.toISOString().slice(0, 10)}&per_page=50`;
      const res = await fetch(url, { headers: {
        "user-agent": "EventlasBot/1.0 (nichtkommerzielle Stadtkarte; +https://eventlas.netlify.app)",
        "accept": "application/json",
      }});
      if (!res.ok) { console.error("Tribe", basis, res.status, "- übersprungen"); continue; }
      const daten = await res.json();
      for (const e of (daten.events || [])) {
        const titel = entHtml(e.title || "");
        const start = String(e.start_date || "").slice(0, 10);
        if (!titel || !/^\d{4}-\d{2}-\d{2}$/.test(start)) continue;
        const ende = String(e.end_date || "").slice(0, 10);
        const ort = entHtml(e.venue?.venue || e.venue?.name || "");
        const uhr = String(e.start_date || "").slice(11, 16);
        const kategorien = (e.categories || []).map(c => String(c.name || "").toLowerCase()).join(" ");
        const tags = ["kultur"];
        if (/konzert|musik|jazz|rock|pop|band|klassik/.test(kategorien + " " + titel.toLowerCase())) tags.unshift("musik");
        if (/party|disco|dj|tanz/.test(kategorien + " " + titel.toLowerCase())) tags.push("party");
        alle.push({
          typ: "event",
          titel: titel.slice(0, 90),
          text: (ort ? "In " + ort + "." : "Veranstaltung in " + STADT.name + ".") +
                (uhr && uhr !== "00:00" ? " Beginn " + uhr + " Uhr." : ""),
          lng: 0, lat: 0,                              // kommt aus snapAufVenue
          start,
          ...(ende && ende !== start ? { ende } : {}),
          meta: [ort, uhr && uhr !== "00:00" ? uhr : ""].filter(Boolean).join(" · "),
          tags: [...new Set(tags)].slice(0, 4),
          quelle: e.url || basis,
          ...(e.url ? { link: e.url } : {}),
        });
      }
    } catch (err) {
      console.error("Tribe-API nicht erreichbar:", basis, err.message);
    }
  }
  console.log(`Tribe-APIs: ${alle.length} Termine gefunden.`);
  return alle;
}

/* ---------- 3) Claude mit Websuche ---------- */
const venueBlock = VENUES.length
  ? `
SPIELSTÄTTEN MIT WECHSELNDEM PROGRAMM — diese bitte GEZIELT prüfen (wichtigster Teil des Auftrags):
${VENUES.map(v => `- ${v.name}${v.art ? " (" + v.art + ")" : ""}: ${v.programm || "Programm per Websuche finden"}`).join("\n")}
Suche für jede Spielstätte nach den nächsten Terminen (z. B. "${VENUES[0].name} Programm").
Schreibe bei diesen Events den Namen der Spielstätte in "meta" — die Koordinaten setzen wir selbst ein.
Bis zu 3 Termine pro Spielstätte; findest du für eine nichts Belegbares, überspringe sie kommentarlos.
`
  : "";

const SYSTEM = `Du recherchierst aktuelle, öffentliche Veranstaltungen und kostenlose Angebote in ${STADT.name}, Deutschland,
für die Karten-App "Eventlas". Heutiges Datum: ${heute}.

Nutze web_search, um echte, aktuelle Informationen zu finden:
- KONZERTE und Musikveranstaltungen (höchste Priorität — hier fehlt der App am meisten)
- Wochenmärkte, Flohmärkte, Stadtfeste, Sport-Heimspiele, Kultur- und Kinderveranstaltungen
- Nur Events, die HEUTE oder in den nächsten 45 Tagen stattfinden oder wiederkehrend sind (wdh)
- KEINE Geschäfte/Läden/Museen als Dauer-Pins (nur konkrete datierte Veranstaltungen)
- KEINE Inhalte von Kleinanzeigen.de oder nebenan.de (rechtlich nicht zulässig)
- KEINE erfundenen Fakten; bei Unsicherheit Eintrag weglassen statt raten
- Jeder Pin braucht "quelle" (Beleg-URL der Recherche)
${venueBlock}
Antworte AUSSCHLIESSLICH mit validem JSON, keine Erklärung, kein Markdown, kein Codeblock-Zaun:
{"pins":[
  {"typ":"event","titel":"...","text":"max 2 Sätze Deutsch","lng":6.xxx,"lat":50.xxx,"meta":"Spielstätte, Uhrzeit",
   "tags":["musik"|"party"|"kultur"|"fest"|"flohmarkt"|"essen"|"sport"|"kinder"|"ernte"],
   "quelle":"https://...","link":"https://..." (optional),
   "start":"JJJJ-MM-TT" (optional),"ende":"JJJJ-MM-TT" (optional),"wdh":"mo|di|mi|do|fr|sa|so, kommagetrennt" (optional)}
]}
Zu "wdh": nur für dauerhaft wöchentliche Termine (Wochenmarkt, Trödel). Eine Konzertreihe mit festen
Daten bekommt EINZELNE Pins mit "start" — niemals "wdh" mit Enddatum kombinieren.
Es gibt GENAU diese neun Themen — keine anderen erfinden. Gratis-Eintritt gehört in "meta"
(z. B. "Klangbrücke · 20 Uhr · frei"), nicht in die Tags; "Fotospot", "Hilfe" und "Verschenken"
ergeben sich aus "typ" und brauchen kein Tag. Wochenmärkte bekommen "essen".
Koordinaten müssen echte Orte in ${STADT.name} sein (lng ${BBOX.lngMin}–${BBOX.lngMax}, lat ${BBOX.latMin}–${BBOX.latMax}).
20-30 Pins insgesamt, davon möglichst viele Konzerte. Texte sachlich, keine Übernahme fremder Formulierungen.

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
  const [kultur, konzerte, bunker, tribe, recherche] = await Promise.all([
    kulturPins(), rausgegangenKonzerte(), musikbunkerKonzerte(), tribePins(), claudePins(bekannt),
  ]);

  // Kultur-API behält ihre deterministische id, verliert aber fest/hot;
  // alle übrigen Quellen verlieren zusätzlich die id (wird aus Titel+Datum neu gebildet).
  const kulturSicher = kultur.map(p => { const q = entschaerfe(p); q.id = p.id; return q; });
  const konzertPins = [...konzerte, ...bunker, ...tribe].map(entschaerfe).map(snapAufVenue)
    .filter(p => p.lng !== 0 && p.lat !== 0);      // ohne bekannte Spielstätte kein Pin
  const ohneOrt = konzerte.length + bunker.length + tribe.length - konzertPins.length;
  if (ohneOrt > 0) console.log(`${ohneOrt} Konzert(e) ohne bekannte Spielstätte verworfen — fehlende Venues in venues.json ergänzen.`);

  const neuGueltig = [...kulturSicher, ...konzertPins, ...recherche.map(entschaerfe).map(snapAufVenue)]
    .filter(valide).map(normiere);
  console.log(`Quellen — Recherche: ${recherche.length}, Kultur-API: ${kultur.length}, Konzerte: ${konzertPins.length}. Valide gesamt: ${neuGueltig.length}.`);

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
  const musik = final.filter(p => (p.tags || []).includes("musik")).length;
  console.log(`OK: ${final.length} Pins geschrieben (${feste.length} feste, ${musik} mit Musik-Tag, Stand ${heute}).`);
  if (VENUES.length && musik < 3) {
    console.log("Hinweis: wenige Musik-Pins — Programmseiten in venues.json prüfen (evtl. Umzug/Schließung).");
  }
}

main().catch(e => {
  console.error("Unerwarteter Fehler, breche ab, alte pins.json bleibt:", e);
  process.exit(1);
});
