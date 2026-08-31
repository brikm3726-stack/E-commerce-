# EcomDZ — Thème Shopify Online Store 2.0

Thème Shopify complet (Liquid + JSON templates + section groups), prêt à être
connecté à une boutique via **Shopify admin → Thèmes → Ajouter → Connecter depuis
GitHub**, sur la branche **`shopify-theme`**.

> Cette branche contient **uniquement le thème, à la racine**.
> La branche `main` conserve l'ancien site Next.js (STEP UP / EcomDZ) intact.

## Structure

```
assets/            theme.css, theme.js, visuels produits (.webp)
config/            settings_schema.json, settings_data.json
layout/            theme.liquid, password.liquid
locales/           fr.default.json, en.json + *.schema.json
sections/          header/footer (+ groups), hero, category-grid, marquee,
                   featured-collection, image-with-text, rich-text, newsletter,
                   contact-form, et tous les main-* (product, collection, cart,
                   search, page, blog, article, list-collections, 404, password)
snippets/          product-card, price, icon, pagination
templates/         index, product, collection, list-collections, page,
                   page.contact, cart, search, blog, article, 404, password,
                   gift_card, customers/*
```

## Correspondance avec l'ancien site React

| Composant `src/` (Next.js)        | Devient (Shopify)                          |
| --------------------------------- | ----------------------------------------- |
| `components/home/Hero`            | `sections/hero.liquid`                     |
| `components/home/CategoryGrid`    | `sections/category-grid.liquid`            |
| bandeau défilant                  | `sections/marquee.liquid` + announcement   |
| `components/product/ProductGrid`  | `sections/featured-collection.liquid`      |
| `components/product/ProductCard`  | `snippets/product-card.liquid`             |
| `ProductPurchase` / `SizeSelector`| `sections/main-product.liquid` (blocs)     |
| `components/cart/CartDrawer`      | tiroir panier dans `header.liquid` + `theme.js` |
| `Navbar` / `Footer` / `MobileMenu`| `sections/header.liquid`, `sections/footer.liquid` |
| `app/globals.css`                 | `assets/theme.css` (variables pilotées par l'éditeur) |
| `data/site.ts`                    | `config/settings_schema.json` (couleurs, contact, réseaux) |
| catalogue `data/products.ts`      | produits Shopify natifs (à créer dans l'admin) |

Points forts produit : metafield `custom.highlights` (liste de lignes).
Badge : `custom.badge`. Note : `reviews.rating` / `reviews.rating_count`.

## Développement local (optionnel)

```bash
npm i -g @shopify/cli
shopify theme dev --store votre-boutique.myshopify.com
shopify theme check
```
