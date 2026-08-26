# STEP UP — boutique sneakers & streetwear

Boutique e-commerce en français pour le marché algérien : catalogue, panier,
commande avec paiement à la livraison, favoris, recherche.

**Pile** : Next.js 15 (App Router) · React 19 · TypeScript · Tailwind CSS v4.
Aucune librairie d’animation : tout est en CSS + IntersectionObserver.

---

## Démarrer

```bash
npm install
npm run dev        # http://localhost:3000
```

Autres commandes :

| Commande | Effet |
| --- | --- |
| `npm run build` | build de production (28 pages statiques) |
| `npm start` | sert le build de production |
| `npm run typecheck` | vérification TypeScript |
| `npm run images` | régénère les visuels produits depuis les photos sources |

---

## Le stock réel

Le catalogue décrit **9 paires**, une seule par pointure :

| Modèle | Coloris | Pointures |
| --- | --- | --- |
| McQUENNE | Blanc / Marine | 40, 41, 42 |
| McQUENNE | Blanc intégral | 40, 41 |
| McQUENNE | Noir / Semelle blanche | 39, 40, 41, 42 |

Le site tient compte de ce stock unitaire partout : la quantité est bornée à ce
qui reste, les pointures épuisées sont barrées et non sélectionnables, et les
badges « Dernière paire » / « Plus que 2 » se calculent tout seuls.

### Vendre une paire

Ouvrez [`src/data/products.ts`](src/data/products.ts) et retirez la pointure du
tableau `sizes` (ou passez son `stock` à `0` pour la garder visible et barrée) :

```ts
sizes: [
  { size: "40", stock: 1 },
  { size: "41", stock: 0 },   // vendue : reste affichée, barrée
  // { size: "42", stock: 1 }, // supprimée : disparaît du site
],
```

Puis `npm run build`. Les badges, filtres, compteurs et le sitemap suivent.

### Ajouter un produit

1. Déposez la photo à la racine du projet (fond sombre, comme les 3 existantes).
2. Ajoutez-la dans `MODELS` de [`tools/prepare-images.py`](tools/prepare-images.py)
   avec son `slug` et le `caption_y` (hauteur à partir de laquelle couper le
   bandeau incrusté, s’il y en a un).
3. `npm run images` — génère les visuels WebP en 1x/2x + l’image Open Graph.
4. Ajoutez l’objet produit dans `PRODUCTS` de `src/data/products.ts`.

Le produit apparaît automatiquement dans la collection, les filtres, la
recherche, les nouveautés et le sitemap.

---

## Modifier les réglages courants

| Quoi | Où |
| --- | --- |
| Nom, téléphone, e-mail, WhatsApp, réseaux | `src/data/site.ts` → `SITE` |
| Frais de livraison, seuil de gratuité | `src/data/site.ts` → `SHIPPING` |
| Liens du menu | `src/data/site.ts` → `NAV_LINKS` |
| Wilayas et communes | `src/data/wilayas.ts` |
| Pages d’aide (livraison, retours, FAQ…) | `src/data/help.ts` |
| Couleurs, typo, rayons, animations | `src/app/globals.css` |
| Date de fin de la promotion (compte à rebours) | `src/data/products.ts` → `PROMO_ENDS_AT` |

Les prix sont en dinars, affichés via `formatPrice()`. Prix actuel : `1 800 DA`
(barré à `3 900 DA`), en promotion jusqu'à la date fixée dans `PROMO_ENDS_AT`.
Passé cette date, le bandeau de compte à rebours disparaît de lui-même sur la
fiche produit — pensez à repousser la date ou à retirer `oldPrice` si la
promotion doit continuer.

---

## Organisation

```
src/
  app/              routes (App Router), sitemap, robots, manifest
    produit/[slug]/ fiche produit + données structurées Schema.org
    aide/[slug]/    pages d’aide générées depuis src/data/help.ts
  components/
    layout/         navbar, footer, menu mobile
    home/           hero, catégories, éditorial, bandeau défilant
    product/        carte, grille, galerie, pointures, bloc d’achat
    collection/     en-tête de page, filtres et tri, catégorie vide
    cart/           panier latéral, page panier
    checkout/       formulaire de commande, confirmation
    search/         recherche plein écran
    ui/             boutons, prix, note, badges, accordéon, toasts
  context/          état global : panier, favoris, panneaux, toasts
  data/             catalogue, réglages, wilayas, pages d’aide
  hooks/            comportement de modale
  lib/              types, accès catalogue, formatage, commandes
tools/              génération des visuels produits
```

---

## Brancher un backend plus tard

L’architecture est déjà découpée pour ça :

- **Catalogue** — tout passe par [`src/lib/catalog.ts`](src/lib/catalog.ts).
  Remplacez le contenu de ces fonctions par des requêtes Supabase / API : les
  composants ne changent pas (rendez-les `async` et attendez-les dans les
  pages serveur).
- **Commandes** — [`src/lib/orders.ts`](src/lib/orders.ts) expose
  `submitOrder()`. Aujourd’hui la commande est confirmée côté client et
  conservée sur l’appareil ; il suffit d’y mettre un `POST`.
- **Paiements** — `PAYMENT_METHODS` dans le même fichier liste déjà CIB et
  Edahabia avec `available: false`. Passez le drapeau à `true` et branchez le
  fournisseur : l’interface de sélection existe.
- **Admin** — le catalogue étant isolé dans `src/data` derrière `src/lib`, un
  back-office peut écrire dans la même source sans toucher au front.

---

## Vérifications effectuées

- Build : 28 pages, toutes statiques — `First Load JS` partagé 103 ko.
- 51 chargements de pages (mobile 375 px, tablette 820 px, desktop 1440 px) :
  aucune erreur console, aucune requête en échec, aucun débordement horizontal,
  aucune image cassée, un `<h1>` par page.
- Parcours d’achat complet automatisé : recherche, filtres, garde-fous de
  pointure, achat direct, validation du formulaire, frais de livraison,
  confirmation, favoris — 19 vérifications, toutes passantes.
- Un seul chemin d’achat : le bouton **Acheter maintenant** (mis en avant,
  animé) ajoute au panier et envoie directement au checkout. Il n’y a plus de
  bouton « Ajouter au panier » séparé, sur aucune page.
- Les URLs inconnues renvoient un vrai 404 HTTP (pas un 404 servi en 200).
- Sans JavaScript, le contenu reste visible (les apparitions au défilement ne
  masquent rien tant que le script n’a pas pris la main).

---

© 2026 STEP UP
