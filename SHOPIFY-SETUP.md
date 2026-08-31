# Connecter le landing `/offre` à Shopify

Le landing **reste hébergé sur GitHub Pages** et garde **exactement** son
design. Shopify devient le backend : produits, variantes, prix, stock,
panier, **checkout sécurisé**, commande, paiement, notifications.

```
Landing /offre (GitHub Pages)
   │  Storefront API  (jeton public, lecture produit + création panier)
   ▼
Panier Shopify ──▶ checkout.shopify.com  ──▶  Commande dans l'admin Shopify
                     (paiement réel)          + notifications + stock -1
```

Méthode : **Shopify Storefront API + Cart API** — la méthode officielle pour un
storefront externe / headless. Aucun jeton Admin, aucun secret dans le code.

---

## 1. Analyse du projet (déjà faite)

| Élément | Constat |
| --- | --- |
| Framework | **Next.js 15** (App Router) + React 19 + TypeScript, **`output: "export"`** (statique) |
| Déploiement | GitHub Actions `.github/workflows/deploy-pages.yml` → GitHub Pages sous `/E-commerce-/` |
| Page concernée | `src/app/offre/page.tsx` → `src/components/landing/OrderLanding.tsx` |
| Bouton « Acheter » | `<button type="submit">اشتري الآن</button>` dans le `<form onSubmit={submit}>` de `OrderLanding.tsx` |
| Produits / prix / tailles / images | catalogue local `src/data/products.ts` (3 coloris, pointures, prix) + visuels `public/` |

**Modifs faites (minimales, design intact) :**

| Fichier | Changement |
| --- | --- |
| `src/lib/shopify.ts` | **nouveau** — client Storefront API (produit, variantes, création panier + `checkoutUrl`) |
| `src/components/landing/OrderLanding.tsx` | le bouton crée un panier Shopify et redirige vers le checkout **quand Shopify est configuré** ; sinon comportement inchangé. Ajout d'un sélecteur **quantité** (visible seulement en mode Shopify), état « جاري التحويل إلى الدفع الآمن… », messages d'erreur / produit indisponible, prix + pointures dispo tirés de Shopify |
| `.github/workflows/deploy-pages.yml` | passe les variables `NEXT_PUBLIC_SHOPIFY_*` au build |
| `.env.example` | **nouveau** — liste des variables |

> Sans variables Shopify configurées, **rien ne change** : le landing garde son
> tunnel actuel (formulaire + e-mail + WhatsApp).

---

## 2. Créer le produit Shopify

Admin Shopify → **Produits → Ajouter un produit**

- Titre, **Prix**, une ou plusieurs photos
- **Option** : `المقاس` → valeurs `39, 40, 41, 42, 43, 44` (celles que tu vends)
- **Inventaire** : coche *Suivre la quantité* et mets le stock réel par pointure
  → le landing barrera les pointures épuisées et bornera la quantité
- *Moteur de recherche* → **Modifier** → descripteur d'URL = `offre`
  (c'est le **handle** ; il ira dans la variable ci-dessous)

> Le plus simple : **un seul produit** avec la seule option `المقاس`.
> Si tu veux vendre les 3 coloris séparément, crée 3 produits et renseigne les
> 3 variables `NEXT_PUBLIC_SHOPIFY_HANDLE_NAVY / _WHITE / _BLACK`.

---

## 3. Obtenir le jeton Storefront (public)

Admin Shopify → **Paramètres → Applications et canaux de vente → Développer des apps**
→ **Créer une app** → nom `Landing offre`

1. Onglet **Configuration de l'API Storefront** → *Configurer*
2. Coche au minimum :
   - `unauthenticated_read_product_listings` (lire les produits)
   - `unauthenticated_write_checkouts` / `unauthenticated_read_checkouts` (créer le panier)
   - `unauthenticated_read_product_inventory` (stock réel — optionnel)
3. **Enregistrer** → **Installer l'app**
4. Onglet **Identifiants API** → copie le **jeton d'accès API Storefront**
   (une longue chaîne ; c'est celle-là, PAS le jeton Admin)

> Ce jeton est **public par conception**. Il ne permet que la lecture produit et
> la création de paniers. Il finira dans le JS du site, c'est normal et sans
> risque. Le jeton **Admin** ne doit JAMAIS être utilisé ici.

---

## 4. Configurer les variables

### En local (dev)

```bash
cp .env.example .env.local
# puis édite .env.local
npm run dev        # http://localhost:3000/offre
```

`.env.local` est déjà ignoré par Git (`.gitignore`).

### En production (GitHub Pages)

GitHub → dépôt `E-commerce-` → **Settings → Secrets and variables → Actions**
→ onglet **Variables** → **New repository variable**, une par une :

| Nom | Valeur |
| --- | --- |
| `NEXT_PUBLIC_SHOPIFY_DOMAIN` | `ecomdz-store.myshopify.com` |
| `NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN` | le jeton de l'étape 3 |
| `NEXT_PUBLIC_SHOPIFY_PRODUCT_HANDLE` | `offre` |
| `NEXT_PUBLIC_SHOPIFY_API_VERSION` | `2024-10` |
| `NEXT_PUBLIC_SHOPIFY_HANDLE_NAVY` | *(vide, ou le handle du coloris)* |
| `NEXT_PUBLIC_SHOPIFY_HANDLE_WHITE` | *(vide)* |
| `NEXT_PUBLIC_SHOPIFY_HANDLE_BLACK` | *(vide)* |

> On utilise **Variables** (et non Secrets) : ces valeurs sont publiques une
> fois le site construit. Aucun secret Shopify n'existe dans ce projet.

---

## 5. Déployer

```bash
git add .
git commit -m "Connexion Shopify Storefront sur /offre"
git push origin main
```

L'action **« Déployer sur GitHub Pages »** se relance seule à chaque push sur
`main` (onglet **Actions** pour suivre). Résultat sur
`https://brikm3726-stack.github.io/E-commerce-/offre/`.

Pour forcer un redéploiement après avoir changé une variable :
**Actions → Déployer sur GitHub Pages → Run workflow**.

---

## 6. Activer les paiements et les notifications

- **Paiements** : Admin → Paramètres → **Paiements** → active un fournisseur
  (Shopify Payments / carte) **et/ou** *Paiement à la livraison* (méthode manuelle).
- **Notifications** : Admin → Paramètres → **Notifications** →
  *Notifications de commande du personnel* → ajoute ton e-mail.
  Installe aussi l'**app mobile Shopify** → notification push à chaque commande.
- **Stock** : géré automatiquement par Shopify dès que la commande est payée.

---

## 7. Comment ça se comporte

Quand le client tape **« اشتري الآن »** :

1. Le landing valide la pointure + la quantité (+ les champs existants).
2. `src/lib/shopify.ts` appelle `cartCreate` (Storefront API) avec la variante,
   la quantité, et les coordonnées saisies (note + attributs → visibles sur la
   commande dans l'admin).
3. Le bouton passe en **« جاري التحويل إلى الدفع الآمن… »**.
4. Redirection vers le **checkout Shopify** (`cart.checkoutUrl`).
5. Le client paie normalement → **commande créée dans l'admin**, **notifications
   envoyées**, **stock décrémenté** — comme une commande classique.

Gestion des erreurs :

| Cas | Comportement |
| --- | --- |
| Produit indisponible | message `هذا المنتج غير متوفر حاليا`, bouton désactivé |
| Pointure épuisée | pointure barrée et non cliquable (stock Shopify réel) |
| Pointure choisie sans variante | `هذا المقاس غير متوفر، اختر مقاسا آخر` |
| Réseau / API en échec | `تعذّر إتمام الطلب… حاول مرة أخرى`, bouton réactivé |

---

## 8. Vérification « aucun secret »

```bash
# aucun jeton Admin, aucune clé secrète dans le code
grep -rIn "shpat_\|shpss_\|shpca_\|Admin API\|X-Shopify-Access-Token" src/ && echo "⚠️ trouvé" || echo "OK : aucun secret Admin"
```

- `src/lib/shopify.ts` n'utilise que `X-Shopify-Storefront-Access-Token` (public).
- Le jeton vient d'une **variable d'environnement**, jamais codé en dur.
- `.env.local` est git-ignoré ; `.env.example` ne contient aucune valeur réelle.
