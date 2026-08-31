/**
 * Connexion Shopify — Storefront API (méthode officielle pour un storefront
 * externe / headless).
 *
 * Le jeton utilisé ici est le **Storefront access token** : il est PUBLIC par
 * conception (tout site headless Shopify l'embarque dans son JS). Il n'autorise
 * QUE des opérations storefront — lire des produits, créer un panier — jamais
 * l'API Admin. Aucun secret n'est donc exposé.
 *
 * Variables (préfixe NEXT_PUBLIC_ obligatoire pour être lisibles côté
 * navigateur en export statique) :
 *   NEXT_PUBLIC_SHOPIFY_DOMAIN            ex. ecomdz-store.myshopify.com
 *   NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN  jeton Storefront (public)
 *   NEXT_PUBLIC_SHOPIFY_PRODUCT_HANDLE    handle du produit (/products/<handle>)
 *   NEXT_PUBLIC_SHOPIFY_HANDLE_NAVY|WHITE|BLACK  (optionnel) un handle par coloris
 *   NEXT_PUBLIC_SHOPIFY_API_VERSION       ex. 2024-10 (défaut)
 */

const DOMAIN = process.env.NEXT_PUBLIC_SHOPIFY_DOMAIN?.trim() ?? "";
const TOKEN = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN?.trim() ?? "";
const API_VERSION = process.env.NEXT_PUBLIC_SHOPIFY_API_VERSION?.trim() || "2024-10";
const HANDLE_DEFAULT = process.env.NEXT_PUBLIC_SHOPIFY_PRODUCT_HANDLE?.trim() ?? "";

const HANDLE_BY_SLUG: Record<string, string | undefined> = {
  "step-one-navy": process.env.NEXT_PUBLIC_SHOPIFY_HANDLE_NAVY?.trim(),
  "step-one-white": process.env.NEXT_PUBLIC_SHOPIFY_HANDLE_WHITE?.trim(),
  "step-one-black": process.env.NEXT_PUBLIC_SHOPIFY_HANDLE_BLACK?.trim(),
};

/** true seulement si le domaine et le jeton sont renseignés. */
export function shopifyConfigured(): boolean {
  return DOMAIN.length > 0 && TOKEN.length > 0;
}

/** Handle Shopify à utiliser pour un coloris donné (slug local). */
export function handleForSlug(slug: string): string {
  return HANDLE_BY_SLUG[slug] || HANDLE_DEFAULT;
}

export interface ShopifyVariant {
  id: string;
  title: string;
  available: boolean;
  /** stock réel si le jeton a le scope inventaire, sinon null */
  quantityAvailable: number | null;
  price: number;
  currency: string;
  options: { name: string; value: string }[];
}

export interface ShopifyProduct {
  id: string;
  handle: string;
  title: string;
  available: boolean;
  minPrice: number;
  currency: string;
  variants: ShopifyVariant[];
}

const ENDPOINT = () => `https://${DOMAIN}/api/${API_VERSION}/graphql.json`;

async function gql<T>(query: string, variables: Record<string, unknown>): Promise<T> {
  const res = await fetch(ENDPOINT(), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Storefront-Access-Token": TOKEN,
      Accept: "application/json",
    },
    body: JSON.stringify({ query, variables }),
  });
  if (!res.ok) {
    throw new Error(`Shopify Storefront API: HTTP ${res.status}`);
  }
  const json = (await res.json()) as { data?: T; errors?: { message: string }[] };
  if (json.errors?.length) {
    throw new Error(`Shopify Storefront API: ${json.errors.map((e) => e.message).join("; ")}`);
  }
  if (!json.data) throw new Error("Shopify Storefront API: réponse vide");
  return json.data;
}

const PRODUCT_QUERY = /* GraphQL */ `
  query ProductByHandle($handle: String!) {
    product(handle: $handle) {
      id
      handle
      title
      availableForSale
      priceRange { minVariantPrice { amount currencyCode } }
      variants(first: 100) {
        nodes {
          id
          title
          availableForSale
          quantityAvailable
          price { amount currencyCode }
          selectedOptions { name value }
        }
      }
    }
  }
`;

interface RawProduct {
  product: {
    id: string;
    handle: string;
    title: string;
    availableForSale: boolean;
    priceRange: { minVariantPrice: { amount: string; currencyCode: string } };
    variants: {
      nodes: {
        id: string;
        title: string;
        availableForSale: boolean;
        quantityAvailable: number | null;
        price: { amount: string; currencyCode: string };
        selectedOptions: { name: string; value: string }[];
      }[];
    };
  } | null;
}

/** Récupère un produit Shopify par son handle. `null` si introuvable. */
export async function fetchProduct(handle: string): Promise<ShopifyProduct | null> {
  if (!shopifyConfigured() || !handle) return null;
  const data = await gql<RawProduct>(PRODUCT_QUERY, { handle });
  const p = data.product;
  if (!p) return null;
  return {
    id: p.id,
    handle: p.handle,
    title: p.title,
    available: p.availableForSale,
    minPrice: Number(p.priceRange.minVariantPrice.amount),
    currency: p.priceRange.minVariantPrice.currencyCode,
    variants: p.variants.nodes.map((v) => ({
      id: v.id,
      title: v.title,
      available: v.availableForSale,
      quantityAvailable: v.quantityAvailable,
      price: Number(v.price.amount),
      currency: v.price.currencyCode,
      options: v.selectedOptions,
    })),
  };
}

/**
 * Trouve la variante qui correspond à une pointure (et, si fourni, à un
 * libellé de coloris). Compare sur la VALEUR des options, quel que soit le nom
 * de l'option côté Shopify (المقاس / Size / Pointure…).
 */
export function findVariant(
  product: ShopifyProduct,
  size: string,
  colorHints: string[] = [],
): ShopifyVariant | undefined {
  const norm = (s: string) => s.toLowerCase().replace(/\s+/g, "");
  const wantColor = colorHints.map(norm).filter(Boolean);

  const bySize = product.variants.filter((v) =>
    v.options.some((o) => norm(o.value) === norm(size)),
  );
  if (bySize.length <= 1) return bySize[0];

  // plusieurs variantes à cette pointure (coloris) : on affine
  const byColor = bySize.find((v) =>
    v.options.some((o) => wantColor.some((c) => norm(o.value).includes(c) || c.includes(norm(o.value)))),
  );
  return byColor ?? bySize.find((v) => v.available) ?? bySize[0];
}

export interface CartCustomer {
  firstName: string;
  lastName: string;
  phone: string;
  wilaya: string;
  commune: string;
  address: string;
  deliveryLabel: string;
}

const CART_CREATE = /* GraphQL */ `
  mutation CartCreate($input: CartInput!) {
    cartCreate(input: $input) {
      cart { id checkoutUrl }
      userErrors { field message }
    }
  }
`;

interface RawCart {
  cartCreate: {
    cart: { id: string; checkoutUrl: string } | null;
    userErrors: { field: string[] | null; message: string }[];
  };
}

/**
 * Crée un panier Shopify avec la variante + quantité choisies et renvoie
 * l'URL du checkout sécurisé Shopify. Les coordonnées saisies sur le landing
 * sont transmises (note + attributs visibles dans l'admin, et pré-remplissage
 * du checkout via buyerIdentity quand Shopify l'accepte).
 */
export async function createCartCheckout(
  variantId: string,
  quantity: number,
  customer: CartCustomer,
  extraNote = "",
): Promise<string> {
  if (!shopifyConfigured()) throw new Error("Shopify non configuré");

  const attributes = [
    { key: "الاسم", value: `${customer.firstName} ${customer.lastName}`.trim() },
    { key: "الهاتف", value: customer.phone },
    { key: "الولاية", value: customer.wilaya },
    { key: "البلدية", value: customer.commune },
    { key: "العنوان", value: customer.address },
    { key: "التوصيل", value: customer.deliveryLabel },
    { key: "المصدر", value: "Landing page /offre" },
  ].filter((a) => a.value);

  const note = [
    extraNote,
    `${customer.firstName} ${customer.lastName} — ${customer.phone}`,
    `${customer.wilaya} / ${customer.commune}`,
    customer.address,
    customer.deliveryLabel,
  ]
    .filter(Boolean)
    .join("\n");

  const lines = [{ merchandiseId: variantId, quantity }];

  const buyerIdentity = {
    phone: customer.phone || undefined,
    deliveryAddressPreferences: customer.address
      ? [
          {
            deliveryAddress: {
              firstName: customer.firstName || undefined,
              lastName: customer.lastName || undefined,
              address1: customer.address || undefined,
              city: customer.commune || undefined,
              province: customer.wilaya || undefined,
              country: "Algeria",
              phone: customer.phone || undefined,
            },
          },
        ]
      : undefined,
  };

  async function run(withBuyer: boolean): Promise<string | null> {
    const input: Record<string, unknown> = { lines, note, attributes };
    if (withBuyer) input.buyerIdentity = buyerIdentity;
    const data = await gql<RawCart>(CART_CREATE, { input });
    const { cart, userErrors } = data.cartCreate;
    if (cart?.checkoutUrl && !userErrors.length) return cart.checkoutUrl;
    if (cart?.checkoutUrl) return cart.checkoutUrl; // erreurs non bloquantes
    return null;
  }

  // 1er essai avec pré-remplissage, repli sans si Shopify le refuse
  let url: string | null = null;
  try {
    url = await run(true);
  } catch {
    url = null;
  }
  if (!url) url = await run(false);
  if (!url) throw new Error("Shopify n'a pas renvoyé d'URL de paiement");
  return url;
}
