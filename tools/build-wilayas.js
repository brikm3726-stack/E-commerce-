/**
 * EcomDZ — génération de src/data/wilayas.ts.
 *
 * Télécharge le découpage administratif algérien et écrit les 58 wilayas avec
 * la totalité de leurs communes (1541), triées par ordre alphabétique : une
 * liste de 67 entrées ne se parcourt pas si elle est en désordre.
 *
 * Les noms de wilayas déjà présents dans le fichier sont CONSERVÉS, seules les
 * communes sont remplacées, rapprochées par code. Deux orthographes diffèrent
 * du jeu de données (57 El M'Ghair, 58 El Meniaa) et ces noms apparaissent
 * déjà dans les commandes passées : on ne les change pas.
 *
 * Lancer :  node tools/build-wilayas.js
 */
const fs = require("fs");
const path = require("path");
const https = require("https");

const SOURCE =
  "https://raw.githubusercontent.com/othmanus/algeria-cities/master/json/algeria_cities.json";

const TARGET = path.join(path.dirname(__dirname), "src", "data", "wilayas.ts");

const EXPECTED_WILAYAS = 58;
const EXPECTED_COMMUNES = 1541;

function download(url) {
  return new Promise((resolve, reject) => {
    https
      .get(url, { headers: { "User-Agent": "node" } }, (res) => {
        if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          res.resume();
          return resolve(download(res.headers.location));
        }
        if (res.statusCode !== 200) {
          res.resume();
          return reject(new Error(`HTTP ${res.statusCode} sur ${url}`));
        }
        let body = "";
        res.setEncoding("utf8");
        res.on("data", (c) => (body += c));
        res.on("end", () => resolve(body));
      })
      .on("error", reject);
  });
}

const escape = (s) => s.replace(/\\/g, "\\\\").replace(/"/g, '\\"');

async function run() {
  const rows = JSON.parse(await download(SOURCE));

  const communesByCode = new Map();
  for (const row of rows) {
    if (!communesByCode.has(row.wilaya_code)) communesByCode.set(row.wilaya_code, new Set());
    communesByCode.get(row.wilaya_code).add(row.commune_name_ascii.trim());
  }

  // on relit nos propres noms dans le fichier existant
  const current = fs.readFileSync(TARGET, "utf8");
  const ours = [...current.matchAll(/code: "(\d{2})",\s*\n?\s*name: "([^"]+)"/g)].map((m) => ({
    code: m[1],
    name: m[2],
  }));

  if (ours.length !== EXPECTED_WILAYAS) {
    throw new Error(`${EXPECTED_WILAYAS} wilayas attendues dans le fichier, ${ours.length} lues`);
  }

  let total = 0;
  const entries = ours.map((wilaya) => {
    const communes = [...(communesByCode.get(wilaya.code) ?? [])].sort((a, b) =>
      a.localeCompare(b, "fr"),
    );
    if (communes.length === 0) {
      throw new Error(`aucune commune pour ${wilaya.code} ${wilaya.name}`);
    }
    total += communes.length;
    const list = communes.map((c) => `"${escape(c)}"`).join(", ");
    return `  {\n    code: "${wilaya.code}",\n    name: "${escape(wilaya.name)}",\n    communes: [${list}],\n  },`;
  });

  if (total !== EXPECTED_COMMUNES) {
    throw new Error(`${EXPECTED_COMMUNES} communes attendues, ${total} obtenues`);
  }

  fs.writeFileSync(
    TARGET,
    `/** Les 58 wilayas et la totalité de leurs communes (${total} au total),
 *  triées par ordre alphabétique pour être trouvables dans une liste longue.
 *
 *  Source : othmanus/algeria-cities (découpage administratif officiel).
 *  Régénérable : node tools/build-wilayas.js
 *
 *  Les noms de wilayas sont ceux du site, pas ceux du jeu de données : ils
 *  apparaissent déjà dans les commandes passées. */

export interface Wilaya {
  code: string;
  name: string;
  communes: string[];
}

export const WILAYAS: Wilaya[] = [
${entries.join("\n")}
];

export function communesOf(wilayaName: string): string[] {
  return WILAYAS.find((w) => w.name === wilayaName)?.communes ?? [];
}
`,
  );

  console.log(`${ours.length} wilayas, ${total} communes écrites dans src/data/wilayas.ts`);
}

run().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
