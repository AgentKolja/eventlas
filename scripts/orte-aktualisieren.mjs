// Eventlas: orte.json aus offenen Quellen erzeugen.
//
// Was ein Ort ist — wie man hinkommt, ob man reinkommt, was es damit auf sich hat — steht
// längst in OpenStreetMap und in der Wikipedia. Dieses Skript holt es einmal ab und legt es
// als orte.json ins Projekt. Die App fragt zur Laufzeit NICHTS nach: keine Verbindung zu
// fremden Servern beim Betrachten, kein Einwilligungsbanner, offline funktioniert es auch.
//
// Aufruf:  node scripts/orte-aktualisieren.mjs [--stadt aachen]
// Läuft selten (Haltestellen und Baudenkmäler ändern sich kaum) — monatlich reicht.
//
// Verknüpft wird über KOORDINATEN, nicht über Pin-IDs. Dadurch erbt jede neue Veranstaltung
// am selben Ort die Angaben automatisch, ohne dass jemand etwas nachträgt.

import { writeFileSync, readFileSync, existsSync } from "fs";

const STADT = (process.argv.find(a => a.startsWith("--stadt="))?.split("=")[1]) || process.env.STADT || "aachen";
const SPIEGEL = [
  "https://overpass-api.de/api/interpreter",
  "https://overpass.kumi.systems/api/interpreter",   // Ausweichserver: der Hauptserver drosselt schnell
];

const heute = new Date();
const datum = heute.getFullYear() + "-" + String(heute.getMonth() + 1).padStart(2, "0") + "-" +
              String(heute.getDate()).padStart(2, "0");

/* ---------- Hilfen ---------- */
const norm = s => (s || "").toLowerCase()
  .replace(/ä/g, "ae").replace(/ö/g, "oe").replace(/ü/g, "ue").replace(/ß/g, "ss")
  .replace(/[^a-z0-9]+/g, " ").trim();

function meter(a, b) {
  const bl = b.lat ?? b.center?.lat, bo = b.lon ?? b.center?.lon ?? b.lng;
  if (bl == null || bo == null) return Infinity;
  const R = 6371000, rad = Math.PI / 180;
  const dLat = (bl - a.lat) * rad, dLon = (bo - (a.lng ?? a.lon)) * rad;
  const x = Math.sin(dLat / 2) ** 2 + Math.cos(a.lat * rad) * Math.cos(bl * rad) * Math.sin(dLon / 2) ** 2;
  return Math.round(2 * R * Math.asin(Math.sqrt(x)));
}

// Eine Stadt oder eine Straße ist nie der gesuchte Ort — sie trägt nur zufällig einen Namen,
// der im Veranstaltungsnamen vorkommt ("Grenzlandtheater Aachen" → Stadtknoten "Aachen").
function brauchbar(e) {
  const t = e.tags || {};
  if (t.place && t.place !== "square") return false;
  if (t.highway && !t.amenity && !t.tourism && !t.leisure && !t.historic) return false;
  if (t.boundary || t.landuse === "residential") return false;
  return true;
}

const warte = ms => new Promise(r => setTimeout(r, ms));

// Overpass ist ein Gemeingut mit knappen Rechenslots: es drosselt (429) und läuft bei zu
// großen Abfragen in den Timeout (504). Deshalb zwei Server im Wechsel und zwei Durchgänge
// mit Pause — und die Abfragen unten sind bewusst klein gehalten.
async function overpass(query, was) {
  let letzterFehler;
  for (let runde = 0; runde < 2; runde++) {
    for (const url of SPIEGEL) {
      try {
        const r = await fetch(url, {
          method: "POST",
          body: "data=" + encodeURIComponent(query),
          headers: { "Content-Type": "application/x-www-form-urlencoded", "User-Agent": "Eventlas/1.0 (Aachen)" },
        });
        if (!r.ok) { letzterFehler = "HTTP " + r.status; await warte(3000); continue; }
        const j = await r.json();
        console.log(`${was}: ${j.elements.length} Objekte (${new URL(url).hostname})`);
        return j.elements;
      } catch (e) { letzterFehler = e.message; await warte(3000); }
    }
    if (runde === 0) { console.log(`${was}: ${letzterFehler} — zweiter Versuch in 20 s`); await warte(20000); }
  }
  throw new Error(`${was} fehlgeschlagen: ${letzterFehler}`);
}

/* ---------- Eingaben ---------- */
if (!existsSync("pins.json") || !existsSync("venues.json")) {
  console.error("pins.json oder venues.json fehlt — im Projektwurzelverzeichnis ausführen.");
  process.exit(1);
}
const pins = JSON.parse(readFileSync("pins.json", "utf8")).pins || [];
const venuesDatei = JSON.parse(readFileSync("venues.json", "utf8"));
const stadtDaten = venuesDatei.staedte?.[STADT];
if (!stadtDaten) { console.error(`Stadt "${STADT}" steht nicht in venues.json.`); process.exit(1); }
const venues = stadtDaten.venues || [];

// Orte statt Pins: viele Pins teilen sich einen Ort (alle Konzerte im Musikbunker).
// ~100-m-Zelle = ein Ort.
const orte = [];
const zelle = new Map();
for (const p of pins) {
  if (typeof p.lat !== "number" || typeof p.lng !== "number") continue;
  const key = p.lat.toFixed(3) + "," + p.lng.toFixed(3);
  if (!zelle.has(key)) {
    const o = { lat: +p.lat.toFixed(5), lng: +p.lng.toFixed(5), name: p.titel, _text: "" };
    zelle.set(key, o);
    orte.push(o);
  }
  zelle.get(key)._text += " " + p.titel + " " + (p.meta || "");
}
console.log(`${pins.length} Pins → ${orte.length} Orte`);

const lats = orte.map(o => o.lat), lngs = orte.map(o => o.lng);
const bbox = [Math.min(...lats) - 0.01, Math.min(...lngs) - 0.01,
              Math.max(...lats) + 0.01, Math.max(...lngs) + 0.01].map(n => n.toFixed(4)).join(",");

/* ---------- 1) Nächste Haltestelle ---------- */
const halte = await overpass(`[out:json][timeout:120];
(
  node["highway"="bus_stop"]["name"](${bbox});
  node["railway"="tram_stop"]["name"](${bbox});
);
out body;`, "Haltestellen");

for (const o of orte) {
  let beste = null, bestD = Infinity;
  for (const h of halte) { const d = meter(o, h); if (d < bestD) { bestD = d; beste = h; } }
  if (beste && bestD <= 800) o.halt = { name: beste.tags.name, m: bestD, _ids: [] };
}

// Linien stehen in OSM nicht am Haltestellen-Knoten, sondern in den Routen-Relationen.
// Haltestellen gleichen Namens (Richtungspaare, Bahnsteige) zählen als eine.
const gebraucht = new Set(orte.filter(o => o.halt).map(o => o.halt.name));
const knoten = halte.filter(h => gebraucht.has(h.tags.name));
if (knoten.length) {
  const rels = await overpass(`[out:json][timeout:180];
node(id:${knoten.map(h => h.id).join(",")})->.h;
rel(bn.h)["route"~"^(bus|tram|light_rail)$"];
out body;`, "Linien");

  const proKnoten = new Map();
  for (const rel of rels) {
    const nr = rel.tags?.ref || rel.tags?.name;
    if (!nr || !rel.members) continue;
    for (const m of rel.members) {
      if (m.type !== "node") continue;
      if (!proKnoten.has(m.ref)) proKnoten.set(m.ref, new Set());
      proKnoten.get(m.ref).add(nr);
    }
  }
  const proName = new Map();
  for (const h of knoten) {
    const s = proKnoten.get(h.id);
    if (!s) continue;
    if (!proName.has(h.tags.name)) proName.set(h.tags.name, new Set());
    s.forEach(l => proName.get(h.tags.name).add(l));
  }
  // Zahlenlinien aufsteigend, Buchstabenlinien ("X 25", "N 3") danach
  const sortiert = arr => [...arr].sort((a, b) => {
    const na = parseInt(a, 10), nb = parseInt(b, 10);
    if (!isNaN(na) && !isNaN(nb)) return na - nb || a.localeCompare(b);
    if (!isNaN(na)) return -1;
    if (!isNaN(nb)) return 1;
    return a.localeCompare(b);
  });
  for (const o of orte) {
    if (!o.halt) continue;
    const s = proName.get(o.halt.name);
    o.halt.linien = s ? sortiert([...s]).slice(0, 12) : [];
    delete o.halt._ids;
  }
}

/* ---------- 2) Der Ort selbst: Zugänglichkeit, Zeiten, Wikipedia-Bezug ---------- */
// Einzeln statt in einem Block: Alle fünf zusammen sprengen regelmäßig das Zeitlimit (504).
// Nacheinander ist jede Abfrage klein genug — und ein Ausfall kostet nur eine Kategorie.
const OBJEKT_ABFRAGEN = [
  ["Wikipedia-Orte", `nwr["wikipedia"](${bbox});`],
  ["Sehenswürdigkeiten", `nwr["tourism"~"^(museum|attraction|artwork|viewpoint|gallery|zoo)$"](${bbox});`],
  ["Kulturhäuser", `nwr["amenity"~"^(theatre|marketplace|arts_centre|community_centre|cinema|library)$"](${bbox});`],
  ["Parks & Sport", `nwr["leisure"~"^(park|garden|sports_centre|swimming_pool|stadium|nature_reserve)$"]["name"](${bbox});`],
  ["Baudenkmäler", `nwr["historic"~"^(city_gate|castle|monument|memorial|tower)$"]["name"](${bbox});`],
];
const objekte = [];
const gesehen = new Set();
for (const [was, teil] of OBJEKT_ABFRAGEN) {
  let elemente;
  try {
    elemente = await overpass(`[out:json][timeout:120];\n${teil}\nout center tags;`, was);
  } catch (e) {
    console.log(`  ${was} übersprungen: ${e.message}`);
    continue;
  }
  for (const e of elemente) {
    const key = e.type + e.id;
    if (!gesehen.has(key)) { gesehen.add(key); objekte.push(e); }
  }
  await warte(2000);                                   // Overpass Luft lassen
}
if (!objekte.length) { console.error("Keine Ortsobjekte erhalten — alte orte.json bleibt."); process.exit(1); }
console.log(`Ortsobjekte gesamt: ${objekte.length}`);

// Wörter, die nichts über den Ort aussagen — sie dürfen einen Treffer nie allein begründen.
const FUELL = new Set(["fotospot", "markt", "platz", "strasse", "haus", "aachen", "open", "air",
  "kino", "fest", "party", "konzert", "flohmarkt", "troedelmarkt", "wochenmarkt", "ernte", "beispiel"]);

const wikiTitel = new Set();
function anreichern(lat, lng, namen, maxM, ortsname, pinText = "") {
  let best = null, bestPunkte = -Infinity;
  for (const e of objekte) {
    if (!e.tags?.name || !brauchbar(e)) continue;
    const d = meter({ lat, lng }, e);
    if (d > maxM) continue;
    const n = norm(e.tags.name);
    if (n.length < 5) continue;
    const passt = namen.find(nm => nm === n || nm.includes(n) || n.includes(nm));
    if (!passt) continue;
    // Trägt der OSM-Name ein Füllwort, das im Pin nicht vorkommt, beschreibt er etwas
    // anderes am selben Ort: "Wochenmarkt Frankenberger Viertel" ist nicht die Burg
    // Frankenberg, auch wenn beide "Frankenberg" enthalten.
    if (!namen.includes(n)) {
      const fremd = n.split(" ").find(w => FUELL.has(w) && !pinText.includes(w));
      if (fremd) continue;
    }
    const punkte = passt.length * 10 - d;
    if (punkte > bestPunkte) { bestPunkte = punkte; best = e; }
  }
  if (!best) return false;
  // Ziel-Ort: der nächstgelegene bekannte Ort, sonst ein neuer
  let ziel = null, bestD = 150;
  for (const o of orte) { const d = meter({ lat, lng }, o); if (d < bestD) { bestD = d; ziel = o; } }
  if (!ziel) { ziel = { lat: +lat.toFixed(5), lng: +lng.toFixed(5), name: ortsname, _text: "" }; orte.push(ziel); }
  const t = best.tags;
  if (t.wheelchair) ziel.rolli = t.wheelchair;
  // Öffnungszeiten nur von Einrichtungen, nie von Plätzen und Parks: Am Katschhof hängen
  // sie an einem Marktstand, nicht am Platz — als "Öffnungszeiten des Ortes" wäre das falsch.
  if (t.opening_hours && (t.amenity || t.tourism || t.shop) && !t.place && !t.leisure) {
    ziel.zeiten = t.opening_hours;
  }
  if (t.website && /^https?:\/\//.test(t.website)) ziel.web = t.website;
  if (t.wikipedia?.startsWith("de:")) { ziel._wiki = t.wikipedia.slice(3); wikiTitel.add(ziel._wiki); }
  return true;
}

// Spielstätten zuerst: venues.json ist von Hand gepflegt und nennt auch Aliase — die
// zuverlässigste Namensquelle, die wir haben.
let trefferVenues = 0;
for (const ve of venues) {
  if (norm(ve.name).length < 5) continue;            // "Markt" o. Ä. fängt sonst beliebige Läden ein
  const namen = [ve.name, ...(ve.aliase || [])].map(norm).filter(n => n.length >= 4);
  if (anreichern(ve.lat, ve.lng, namen, 250, ve.name)) trefferVenues++;
}

// Dann die Orte selbst, über ihre Pin-Titel.
let trefferOrte = 0;
for (const o of orte) {
  if (o._wiki || o.rolli) continue;                  // über venues.json schon versorgt
  const text = norm((o.name + " " + o._text).replace(/^fotospot:\s*/i, ""));
  const kern = [...new Set(text.split(" "))].filter(w => w.length >= 6 && !FUELL.has(w));
  if (!kern.length) continue;
  if (anreichern(o.lat, o.lng, kern, 300, o.name, text)) trefferOrte++;
}
console.log(`Ortsbezug: ${trefferVenues} über Spielstätten, ${trefferOrte} über Pin-Titel`);

/* ---------- 3) Wikipedia-Kurzbeschreibungen ---------- */
// Ein bis zwei Sätze: genug zum Einordnen, wenig genug, dass es das Fenster nicht füllt.
function kurz(t) {
  if (!t) return "";
  const saetze = t.replace(/\s+/g, " ").match(/[^.!?]+[.!?]+/g) || [t];
  let s = saetze[0].trim();
  if (s.length < 90 && saetze[1]) s += " " + saetze[1].trim();
  return s.length > 260 ? s.slice(0, 257).replace(/\s\S*$/, "") + "…" : s;
}
const wiki = new Map();
for (const t of wikiTitel) {
  try {
    const r = await fetch("https://de.wikipedia.org/api/rest_v1/page/summary/" + encodeURIComponent(t.replace(/ /g, "_")),
      { headers: { "User-Agent": "Eventlas/1.0 (Aachen)" } });
    if (!r.ok) { console.log(`  Wikipedia "${t}": HTTP ${r.status}`); continue; }
    const j = await r.json();
    if (j.type === "disambiguation" || !j.extract) continue;    // Begriffsklärungsseiten helfen niemandem
    wiki.set(t, { text: kurz(j.extract), url: j.content_urls?.desktop?.page });
  } catch (e) { console.log(`  Wikipedia "${t}": ${e.message}`); }
}
console.log(`Wikipedia: ${wiki.size} von ${wikiTitel.size} Zusammenfassungen`);

/* ---------- 4) Schreiben ---------- */
for (const o of orte) {
  const w = o._wiki && wiki.get(o._wiki);
  if (w) {
    o.wiki = { titel: o._wiki, text: w.text, url: w.url };
    o.name = o._wiki.replace(/\s*\([^)]*\)\s*$/, "");     // "Burg Frankenberg (Aachen)" → "Burg Frankenberg"
  }
  o.name = String(o.name).replace(/^Fotospot:\s*/i, "");
  delete o._text; delete o._wiki;
}
orte.sort((a, b) => a.name.localeCompare(b.name, "de"));

const brauchbareOrte = orte.filter(o => o.halt || o.wiki || o.rolli || o.zeiten);
if (brauchbareOrte.length < 5) {
  console.error(`Nur ${brauchbareOrte.length} Orte mit Inhalt — zu wenig, alte orte.json bleibt.`);
  process.exit(1);
}

writeFileSync("orte.json", JSON.stringify({
  stand: datum,
  hinweis: "Ortsinformationen, einmal recherchiert statt bei jedem Aufruf abgefragt — so entsteht beim Betrachten der Karte keine Verbindung zu fremden Servern. Zuordnung ueber Koordinaten-Naehe (bis 150 m), gilt daher auch fuer neue Veranstaltungen am selben Ort. Erneuern: node scripts/orte-aktualisieren.mjs",
  quellen: {
    haltestellen_und_orte: "OpenStreetMap-Mitwirkende, ODbL 1.0 — https://www.openstreetmap.org/copyright",
    beschreibungen: "Wikipedia (deutschsprachig), CC BY-SA 4.0 — Artikel jeweils unter wiki.url verlinkt",
  },
  felder: "lat/lng · name · halt {name, m (Luftlinie), linien[]} · rolli (yes|limited|no) · zeiten (OSM opening_hours) · web · wiki {titel, text, url}",
  orte: brauchbareOrte,
}, null, 1) + "\n");

console.log(`OK: ${brauchbareOrte.length} Orte geschrieben ` +
  `(${brauchbareOrte.filter(o => o.halt).length} mit Haltestelle, ` +
  `${brauchbareOrte.filter(o => o.wiki).length} mit Beschreibung, ` +
  `${brauchbareOrte.filter(o => o.rolli).length} mit Barrierefreiheit, Stand ${datum}).`);
