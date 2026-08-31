# Pont commande `/offre` → Shopify

Petit Worker Cloudflare (gratuit) qui reçoit une commande depuis la page
statique `/offre` et crée une **vraie commande dans Shopify** (paiement à la
livraison, statut *en attente de paiement*).

```
navigateur (/offre)  ──POST JSON──▶  Worker Cloudflare  ──Admin API──▶  Shopify → Commandes
```

## 1. Créer l'app personnalisée Shopify (jeton Admin)

1. Admin Shopify → **Paramètres → Applications et canaux de vente → Développer des apps**
2. **Créer une app** → nom : `Pont commande site`
3. Onglet **Configuration de l'API Admin** → *Scopes* : coche
   `write_orders` et `read_orders` → Enregistrer
4. Onglet **Accès aux données client protégées** → demande l'accès à
   *Nom, e-mail, téléphone, adresse* (obligatoire pour créer une commande avec
   les coordonnées du client) → justification : « création des commandes
   passées sur notre page de vente »
5. **Installer l'app** → copie le **jeton d'accès Admin API** (`shpat_…`).
   ⚠️ Il ne s'affiche qu'une fois.

## 2. Déployer le Worker

```bash
cd worker
npm install
npx wrangler login          # ouvre le navigateur, connexion Cloudflare
npx wrangler deploy
```

Tu obtiens une URL du type
`https://ecomdz-shopify-order.TON-COMPTE.workers.dev`.

## 3. Renseigner les variables (dans Cloudflare, pas dans Git)

Cloudflare → **Workers & Pages → ecomdz-shopify-order → Settings → Variables and Secrets** :

| Nom | Type | Valeur |
| --- | --- | --- |
| `SHOPIFY_STORE` | Text | `ma-boutique.myshopify.com` |
| `SHOPIFY_ADMIN_TOKEN` | **Secret** | `shpat_…` (étape 1) |
| `ALLOWED_ORIGIN` | Text | `https://brikm3726-stack.github.io` |
| `SHOPIFY_API_VERSION` | Text | `2024-10` |

Redeploie après ajout : `npx wrangler deploy`.

## 4. Brancher le site

Dans [`src/data/site.ts`](../src/data/site.ts), colle l'URL du Worker :

```ts
export const SHOPIFY_ORDER_ENDPOINT = "https://ecomdz-shopify-order.TON-COMPTE.workers.dev";
```

`git commit` + `git push` sur `main` → GitHub Pages redéploie `/offre`.
Tant que cette constante est vide, le site fonctionne exactement comme avant
(e-mail Web3Forms uniquement).

## 5. Tester

1. Ouvre `https://brikm3726-stack.github.io/E-commerce-/offre/`
2. Passe une commande de test
3. **Shopify → Commandes** : la commande apparaît, taguée `COD, Facebook Ads`,
   avec wilaya / commune / adresse dans la note.

## Notes

- La commande est créée avec des **lignes libres** (titre + prix), elle ne
  décrémente pas l'inventaire Shopify. Pour lier à un vrai produit Shopify,
  ajoute `variant_id` dans le payload (`src/lib/shopify-order.ts`).
- L'e-mail Web3Forms continue de partir en parallèle : double filet de sécurité.
- Coût : 0 € (Cloudflare Workers offre 100 000 requêtes/jour).
