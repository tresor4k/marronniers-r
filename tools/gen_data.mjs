// Génère data/marronniers.R et data/marronniers_secteurs.R depuis le fichier de données du
// site (source unique). Ne jamais modifier ces deux fichiers à la main.
// Les fichiers produits sont en ASCII : tout caractère accentué est écrit en \uXXXX,
// que R lit comme une chaîne UTF-8 quelle que soit la locale.
//
// Usage : node tools/gen_data.mjs [chemin/vers/marronniers-2026-2027.ts]
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
export const DEFAULT_TS = resolve(
  ROOT,
  "../../Lescreavores/site2/nouveau-site/src/data/tool-content/marronniers-2026-2027.ts",
);
export const DATA = resolve(ROOT, "data/marronniers.R");
export const DATA_SECTEURS = resolve(ROOT, "data/marronniers_secteurs.R");
export const FIELDS = ["date", "dateFin", "libelle", "type", "secteurs", "source", "angle"];
// Nom de colonne R de chaque champ.
export const COLS = { date: "date", dateFin: "date_fin", libelle: "libelle", type: "type", secteurs: "secteurs", source: "source", angle: "angle" };

function literal(src, marker) {
  const start = src.indexOf(marker);
  if (start < 0) throw new Error(`marker not found: ${marker}`);
  const open = src.indexOf("[", start + marker.length - 1);
  const close = src.indexOf("\n];", open);
  if (open < 0 || close < 0) throw new Error(`array not found after ${marker}`);
  return new Function(`return ${src.slice(open, close + 2)};`)();
}

export function parse(tsPath = DEFAULT_TS) {
  const src = readFileSync(tsPath, "utf-8");
  const entries = literal(src, "export const MARRONNIERS_2026_2027: Marronnier[] =");
  const sectors = literal(src, "export const MARRONNIER_SECTEURS: { id: string; label: string }[] =");
  const rows = (src.match(/^\s*\{ date: "/gm) || []).length;
  if (entries.length !== rows) throw new Error(`parsed ${entries.length} entries, ${rows} rows in file`);
  for (const e of entries) {
    if (Object.keys(e).join() !== FIELDS.join()) throw new Error(`unexpected fields: ${Object.keys(e).join()}`);
    for (const k of FIELDS) if (typeof e[k] !== "string") throw new Error(`non string ${k}`);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(e.date) || !/^\d{4}-\d{2}-\d{2}$/.test(e.dateFin) || e.dateFin < e.date)
      throw new Error(`bad dates: ${e.date} ${e.dateFin}`);
  }
  return { entries, sectors };
}

// Ordre attendu : date de début, ex aequo dans l'ordre de la source (sort est stable).
export const sortByDate = (entries) =>
  entries.map((e, i) => ({ e, i })).sort((a, b) => (a.e.date < b.e.date ? -1 : a.e.date > b.e.date ? 1 : a.i - b.i)).map((x) => x.e);

// Chaîne R en ASCII, avec des échappements que R et JSON lisent tous deux (\" \\ \uXXXX).
function r(s) {
  if (/[\u0000-\u001f\ud800-\udfff]/.test(s)) throw new Error(`unsupported character in ${JSON.stringify(s)}`);
  return JSON.stringify(s).replace(/[\u007f-￿]/g, (c) => "\\u" + c.charCodeAt(0).toString(16).padStart(4, "0"));
}
const vec = (xs) => `c(${xs.map(r).join(", ")})`;

function generate(tsPath) {
  const { entries, sectors } = parse(tsPath);
  const sorted = sortByDate(entries);
  const head = "# GENERE par tools/gen_data.mjs depuis marronniers-2026-2027.ts (Les Creavores). Ne pas modifier.";
  const cols = FIELDS.map((k) => {
    const v = vec(sorted.map((e) => e[k]));
    return `  ${COLS[k]} = ${k === "date" || k === "dateFin" ? `as.Date(${v})` : v}`;
  });
  writeFileSync(DATA, [head, "marronniers <- data.frame(", cols.join(",\n") + ",", "  stringsAsFactors = FALSE", ")", ""].join("\n"), "utf-8");
  writeFileSync(DATA_SECTEURS, [head, "marronniers_secteurs <- data.frame(",
    `  id = ${vec(sectors.map((s) => s.id))},`, `  label = ${vec(sectors.map((s) => s.label))},`,
    "  stringsAsFactors = FALSE", ")", ""].join("\n"), "utf-8");
  console.log(`${entries.length} entries, ${sectors.length} sectors -> ${DATA}, ${DATA_SECTEURS}`);
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) generate(process.argv[2] || DEFAULT_TS);
