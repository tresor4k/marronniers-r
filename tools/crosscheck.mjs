// Contrôle croisé : chaque champ de chaque entrée de data/marronniers.R (et, avec --dump,
// du JSON écrit par tools/dump.R depuis le paquet installé) comparé au .ts du site et au
// data.edn publié sur Clojars (zéro écart hors écart connu KNOWN_EDN). Sortie 0 seulement avec zéro écart.
// Usage : node tools/crosscheck.mjs [--dump chemin.json] [chemin/vers/fichier.ts]
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { COLS, DATA, DATA_SECTEURS, DEFAULT_TS, FIELDS, parse, sortByDate } from "./gen_data.mjs";

const EDN = resolve(DATA, "../../../lescreavores-clojars/resources/marronniers/data.edn");
const EDN_KEYS = { date: "date", dateFin: "date-fin", libelle: "libelle", type: "type", secteurs: "secteurs", source: "source", angle: "angle" };
// Écart connu et voulu avec les paquets déjà publiés (Clojars, Maven Central, Haxelib) :
// le 06/10/2026, la date de fin des vacances de Pâques en Corse a été corrigée dans le .ts
// (2027-03-25 -> 2027-04-12, la source citée dit du 25 mars au 12 avril 2027). Ce paquet
// suit le .ts corrigé ; le data.edn publié garde l'ancienne valeur jusqu'à sa prochaine version.
const KNOWN_EDN = [{ libelle: "Vacances de Pâques en Corse (jusqu'au 12 avril)", field: "dateFin", published: "2027-03-25" }];
const isKnown = (e, k, got) => KNOWN_EDN.some((x) => x.libelle === e?.libelle && x.field === k && x.published === got);
const args = process.argv.slice(2);
const d = args.indexOf("--dump");
const dump = d >= 0 ? args.splice(d, 2)[1] : null;

const ts = parse(args[0] || DEFAULT_TS);
const expected = { entries: sortByDate(ts.entries), sectors: ts.sectors };

// Fichiers data/*.R relus tels quels (pas regénérés) : une colonne par ligne, c("...", ...).
function columns(file) {
  const out = {};
  for (const l of readFileSync(file, "utf-8").split("\n")) {
    const m = l.match(/^\s+(\w+) = (?:as\.Date\()?c\((.*?)\)\)?,$/);
    if (m) out[m[1]] = JSON.parse(`[${m[2]}]`);
  }
  return out;
}
const rc = columns(DATA);
const rs = columns(DATA_SECTEURS);
const rdata = {
  entries: rc.date.map((_, i) => Object.fromEntries(FIELDS.map((k) => [k, rc[COLS[k]][i]]))),
  sectors: rs.id.map((id, i) => ({ id, label: rs.label[i] })),
};

// data.edn de Clojars (ordre de la source, donc retrié de la même façon).
const ednLines = readFileSync(EDN, "utf-8").split("\n");
const ednMap = (l) => Object.fromEntries([...l.matchAll(/:([a-z-]+) ("(?:[^"\\]|\\.)*")/g)].map((m) => [m[1], JSON.parse(m[2])]));
const edn = {
  entries: sortByDate(ednLines.filter((l) => l.includes("{:date ")).map(ednMap).map((m) => Object.fromEntries(FIELDS.map((k) => [k, m[EDN_KEYS[k]]])))),
  sectors: ednLines.filter((l) => l.includes("{:id ")).map(ednMap).map((m) => ({ id: m.id, label: m.label })),
};

function compare(name, got, allowKnown = false) {
  const diffs = [];
  const known = [];
  const n = Math.max(expected.entries.length, got.entries.length);
  for (let i = 0; i < n; i++)
    for (const k of FIELDS)
      if (expected.entries[i]?.[k] !== got.entries[i]?.[k])
        (allowKnown && isKnown(expected.entries[i], k, got.entries[i]?.[k]) ? known : diffs).push(`${name} entry ${i} ${k}: ts=${JSON.stringify(expected.entries[i]?.[k])} got=${JSON.stringify(got.entries[i]?.[k])}`);
  for (let i = 0; i < Math.max(expected.sectors.length, got.sectors.length); i++)
    for (const k of ["id", "label"]) if (expected.sectors[i]?.[k] !== got.sectors[i]?.[k]) diffs.push(`${name} sector ${i} ${k}`);
  console.log(`${name}: entries=${got.entries.length}/${expected.entries.length} fields=${n * FIELDS.length} sectors=${got.sectors.length}/${expected.sectors.length} diff=${diffs.length}${allowKnown ? ` known=${known.length}/${KNOWN_EDN.length}` : ""}`);
  known.forEach((x) => console.log("  écart connu documenté : " + x));
  diffs.slice(0, 10).forEach((x) => console.log("  " + x));
  return diffs.length;
}

let total = compare("data/marronniers.R", rdata) + compare("clojars data.edn (publié)", edn, true);
if (dump) total += compare("R installed dump", JSON.parse(readFileSync(dump, "utf-8")));
process.exit(total === 0 ? 0 : 1);
