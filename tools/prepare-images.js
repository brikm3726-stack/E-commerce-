/**
 * EcomDZ — préparation des visuels produits.
 *
 * Source : un dossier par coloris à la racine du projet, fourni par le client.
 * Chaque dossier contient une photo « miniature … » (la vignette du modèle,
 * affichée sur les cartes et en premier sur la fiche) et des photos de mise en
 * situation qui composent la galerie.
 *
 * Sortie : public/products/<slug>-cut.webp    vignette (cartes, panier, favoris)
 *          public/products/<slug>-<n>.webp    galerie, dans l'ordre du tableau
 *          public/products/<slug>-og.webp     1200x630 pour le partage
 * Chaque visuel sort en 1x et 2x, sauf l'OG.
 *
 * Les photos sont de vraies photos (fonds variés) : on ne détoure plus rien,
 * on recadre simplement en 4:5, ratio unique de toutes les vignettes du site.
 *
 * Lancer :  node tools/prepare-images.js
 */
const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

const ROOT = path.dirname(__dirname);
const OUT = path.join(ROOT, "public", "products");

/** Un dossier par coloris. `folder` doit correspondre exactement au nom sur
 *  le disque (attention aux espaces doubles). */
const MODELS = [
  { folder: "Blanc  Marine", slug: "step-one-navy" },
  { folder: "Blanc intégral", slug: "step-one-white" },
  { folder: "Noir  Semelle blanche", slug: "step-one-black" },
];

/** 4:5 pour les vignettes et la galerie, 1.91:1 pour l'Open Graph. */
const CARD_RATIO = 4 / 5;
const CARD_WIDTHS = [800, 1600];
const OG = { width: 1200, height: 630 };

/** Recadre au ratio demandé sans jamais déformer, sujet centré. */
const frame = (file, width, ratio) =>
  sharp(file)
    .rotate() // respecte l'orientation EXIF
    .resize({
      width,
      height: Math.round(width / ratio),
      fit: "cover",
      position: "attention", // garde la chaussure dans le cadre
    });

async function run() {
  fs.mkdirSync(OUT, { recursive: true });

  // on repart d'un dossier propre : les anciens visuels générés depuis
  // MC 1/2/3.jpg n'ont plus de source et ne doivent pas rester derrière
  for (const f of fs.readdirSync(OUT)) fs.unlinkSync(path.join(OUT, f));

  const manifest = [];

  for (const model of MODELS) {
    const dir = path.join(ROOT, model.folder);
    if (!fs.existsSync(dir)) throw new Error(`Dossier introuvable : ${model.folder}`);

    const files = fs
      .readdirSync(dir)
      .filter((f) => /\.(jpe?g|png|webp)$/i.test(f));

    const thumb = files.find((f) => /^miniature/i.test(f));
    if (!thumb) throw new Error(`Pas de photo « miniature … » dans ${model.folder}`);

    // la miniature ouvre la galerie, les autres suivent
    const ordered = [thumb, ...files.filter((f) => f !== thumb).sort()];

    // --- vignette ------------------------------------------------------
    for (const [i, w] of CARD_WIDTHS.entries()) {
      await frame(path.join(dir, thumb), w, CARD_RATIO)
        .webp({ quality: 86 })
        .toFile(path.join(OUT, `${model.slug}-cut${i ? "@2x" : ""}.webp`));
    }

    // --- galerie -------------------------------------------------------
    for (const [n, file] of ordered.entries()) {
      for (const [i, w] of CARD_WIDTHS.entries()) {
        await frame(path.join(dir, file), w, CARD_RATIO)
          .webp({ quality: 86 })
          .toFile(path.join(OUT, `${model.slug}-${n + 1}${i ? "@2x" : ""}.webp`));
      }
    }

    // --- Open Graph ----------------------------------------------------
    await sharp(path.join(dir, thumb))
      .rotate()
      .resize({ ...OG, fit: "cover", position: "attention" })
      .webp({ quality: 88 })
      .toFile(path.join(OUT, `${model.slug}-og.webp`));

    manifest.push({ slug: model.slug, images: ordered.length, source: model.folder });
    console.log(
      `${model.slug.padEnd(16)} vignette + ${ordered.length} photos  (${model.folder})`,
    );
  }

  console.log(
    `\n${fs.readdirSync(OUT).length} fichiers écrits dans public/products/`,
  );
  console.log("Pense à refléter le nombre de photos dans src/data/products.ts :");
  for (const m of manifest) console.log(`  ${m.slug} → ${m.images}`);
}

run().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
