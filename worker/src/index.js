/**
 * Pont commande → Shopify.
 *
 * Le site /offre est statique (GitHub Pages) : il ne peut pas parler à l'API
 * Admin de Shopify sans exposer le jeton. Ce Worker Cloudflare reçoit la
 * commande depuis le navigateur du client et crée une vraie commande dans
 * Shopify (paiement à la livraison, statut « en attente »).
 *
 * Variables d'environnement (Cloudflare → Settings → Variables) :
 *   SHOPIFY_STORE        ex. ma-boutique.myshopify.com
 *   SHOPIFY_ADMIN_TOKEN  jeton d'accès Admin API d'une app personnalisée
 *                        (scopes : write_orders, read_orders)
 *   ALLOWED_ORIGIN       ex. https://brikm3726-stack.github.io  (défaut : *)
 *   SHOPIFY_API_VERSION  optionnel, défaut 2024-10
 */

const json = (data, status, origin) =>
  new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": origin,
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
      "Cache-Control": "no-store",
    },
  });

export default {
  async fetch(request, env) {
    const allowed = env.ALLOWED_ORIGIN || "*";

    if (request.method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers: {
          "Access-Control-Allow-Origin": allowed,
          "Access-Control-Allow-Methods": "POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type",
          "Access-Control-Max-Age": "86400",
        },
      });
    }

    if (request.method !== "POST") return json({ error: "method_not_allowed" }, 405, allowed);

    if (!env.SHOPIFY_STORE || !env.SHOPIFY_ADMIN_TOKEN) {
      return json({ error: "not_configured" }, 500, allowed);
    }

    let body;
    try {
      body = await request.json();
    } catch {
      return json({ error: "bad_json" }, 400, allowed);
    }

    const c = body.customer || {};
    const lines = Array.isArray(body.lines) ? body.lines : [];
    if (!c.phone || lines.length === 0) {
      return json({ error: "missing_fields" }, 422, allowed);
    }

    const name = [c.firstName, c.lastName].filter(Boolean).join(" ").trim() || "Client";
    const isHome = body.delivery === "domicile";

    const line_items = lines.map((l) => ({
      title: [l.name, l.variant, l.size ? "مقاس " + l.size : null]
        .filter(Boolean)
        .join(" — "),
      price: String(l.price != null ? l.price : 0),
      quantity: Number(l.quantity) || 1,
      requires_shipping: true,
      taxable: false,
    }));

    const address = {
      first_name: c.firstName || name,
      last_name: c.lastName || "",
      address1: c.address || c.commune || "",
      city: c.commune || "",
      province: c.wilaya || "",
      country: "Algeria",
      phone: c.phone,
    };

    const noteParts = [
      body.reference ? "Réf : " + body.reference : null,
      body.source ? "Source : " + body.source : null,
      "Wilaya : " + (c.wilaya || "—"),
      "Commune : " + (c.commune || "—"),
      "Adresse : " + (c.address || "—"),
      "Livraison : " + (isHome ? "À domicile" : "Bureau / stopdesk"),
      "Paiement : à la livraison",
    ].filter(Boolean);

    const order = {
      order: {
        line_items,
        customer: { first_name: c.firstName || name, last_name: c.lastName || "", phone: c.phone },
        shipping_address: address,
        billing_address: address,
        financial_status: "pending",
        currency: body.currency || "DZD",
        note: noteParts.join("\n"),
        note_attributes: [
          { name: "Origine", value: body.source || "Page pub arabe" },
          { name: "Wilaya", value: c.wilaya || "" },
          { name: "Commune", value: c.commune || "" },
          { name: "Mode livraison", value: isHome ? "domicile" : "bureau" },
        ],
        tags: ["COD", "Facebook Ads", body.source || "Page pub arabe"].join(", "),
        send_receipt: false,
        send_fulfillment_receipt: false,
        inventory_behaviour: "bypass",
      },
    };

    if (body.shipping != null) {
      order.order.shipping_lines = [
        {
          title: isHome ? "التوصيل للمنزل" : "التوصيل لمكتب NOEST",
          price: String(body.shipping),
          code: isHome ? "HOME" : "STOPDESK",
        },
      ];
    }

    const version = env.SHOPIFY_API_VERSION || "2024-10";
    const url = `https://${env.SHOPIFY_STORE}/admin/api/${version}/orders.json`;

    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Access-Token": env.SHOPIFY_ADMIN_TOKEN,
      },
      body: JSON.stringify(order),
    });

    const text = await res.text();
    if (!res.ok) {
      return json({ error: "shopify_rejected", status: res.status, detail: text.slice(0, 800) }, 502, allowed);
    }

    let created = {};
    try {
      created = JSON.parse(text).order || {};
    } catch {}

    return json({ ok: true, order_id: created.id || null, order_number: created.name || null }, 201, allowed);
  },
};
