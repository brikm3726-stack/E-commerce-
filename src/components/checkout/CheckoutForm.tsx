"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { ArrowRight, Building2, Home, Loader2, Lock, ShoppingBag } from "lucide-react";
import { useStore } from "@/context/StoreProvider";
import { communesOf, WILAYAS } from "@/data/wilayas";
import { formatPrice, isValidPhone, normalizePhone } from "@/lib/format";
import { notifyOrder } from "@/lib/notify";
import { sendToHub } from "@/lib/hub";
import { PAYMENT_METHODS, submitOrder } from "@/lib/orders";
import { HUB_LANDING_ID_SITE, SHIPPING } from "@/data/site";
import type { DeliveryMode, OrderCustomer, PaymentMethod } from "@/lib/types";

type FormState = OrderCustomer;
type Errors = Partial<Record<keyof FormState, string>>;

const EMPTY: FormState = {
  firstName: "",
  lastName: "",
  phone: "",
  wilaya: "",
  commune: "",
  address: "",
  note: "",
};

export function CheckoutForm() {
  const router = useRouter();
  const { cart, hydrated, subtotal, shippingFor, clearCart, saveOrder } = useStore();

  const [form, setForm] = useState<FormState>(EMPTY);
  const [errors, setErrors] = useState<Errors>({});
  const [delivery, setDelivery] = useState<DeliveryMode>("domicile");
  const [payment, setPayment] = useState<PaymentMethod>("cod");
  const [submitting, setSubmitting] = useState(false);

  const communes = useMemo(() => communesOf(form.wilaya), [form.wilaya]);
  const shipping = shippingFor(delivery);
  const total = subtotal + shipping;

  const update = (field: keyof FormState, value: string) => {
    setForm((current) => ({
      ...current,
      [field]: value,
      // changer de wilaya invalide la commune choisie
      ...(field === "wilaya" ? { commune: "" } : {}),
    }));
    setErrors((current) => ({ ...current, [field]: undefined }));
  };

  const validate = (): boolean => {
    const next: Errors = {};

    if (form.firstName.trim().length < 2) next.firstName = "Indiquez votre prénom.";
    if (form.lastName.trim().length < 2) next.lastName = "Indiquez votre nom.";
    if (!isValidPhone(form.phone))
      next.phone = "Numéro invalide. Format attendu : 0555 12 34 56.";
    if (!form.wilaya) next.wilaya = "Choisissez votre wilaya.";
    if (!form.commune) next.commune = "Choisissez votre commune.";
    if (delivery === "domicile" && form.address.trim().length < 8)
      next.address = "Indiquez une adresse complète (rue, quartier, repère).";

    setErrors(next);

    if (Object.keys(next).length > 0) {
      const first = document.querySelector<HTMLElement>("[data-error='true']");
      first?.scrollIntoView({ behavior: "smooth", block: "center" });
      first?.focus({ preventScroll: true });
      return false;
    }
    return true;
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (submitting || cart.length === 0) return;
    if (!validate()) return;

    setSubmitting(true);
    try {
      const order = await submitOrder({
        customer: { ...form, phone: normalizePhone(form.phone) },
        delivery,
        payment,
        lines: cart,
        subtotal,
        shipping,
      });
      // L'e-mail part en arrière-plan : `keepalive` fait survivre la requête
      // au changement de page qui suit immédiatement.
      void notifyOrder(order, "Site");

      // Et vers le hub central, qui l'enregistre en base. Landing distincte de
      // celle de la publicité : c'est ce qui permet de comparer, dans le
      // dashboard, ce que rapporte le site et ce que rapporte la campagne.
      void sendToHub(order, "Site", HUB_LANDING_ID_SITE);

      saveOrder(order);
      clearCart();
      router.push("/commande/confirmation");
    } catch {
      setSubmitting(false);
      setErrors({ phone: "L’envoi a échoué. Réessayez ou appelez-nous." });
    }
  };

  /* ------------------------------------------------------------ états --- */

  if (!hydrated) {
    return (
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_22rem]">
        <div className="skeleton h-[36rem] rounded-xl" />
        <div className="skeleton h-80 rounded-xl" />
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="surface rounded-xl px-6 py-20 text-center">
        <div className="mx-auto mb-6 grid size-16 place-items-center rounded-full border border-line bg-black/[0.035]">
          <ShoppingBag size={24} className="text-fg-3" />
        </div>
        <h2 className="display mb-3 text-2xl">Aucun article à commander</h2>
        <p className="mx-auto mb-8 max-w-sm text-sm text-fg-2">
          Ajoutez au moins une paire à votre panier pour passer commande.
        </p>
        <Link href="/sneakers" className="btn btn-primary">
          Voir la collection
          <ArrowRight size={15} />
        </Link>
      </div>
    );
  }

  const fieldClass = (field: keyof FormState) =>
    `field ${errors[field] ? "field-error" : ""}`;

  return (
    <form onSubmit={handleSubmit} noValidate className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_22rem] lg:gap-10">
      <div className="space-y-8">
        {/* =========================================== coordonnées ======== */}
        <section className="surface rounded-xl p-6 md:p-7" aria-labelledby="coordonnees">
          <h2 id="coordonnees" className="font-display text-base font-bold uppercase">
            <span className="mr-2 text-accent-2">01</span> Vos coordonnées
          </h2>

          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="firstName" className="eyebrow mb-2 block">
                Prénom *
              </label>
              <input
                id="firstName"
                name="firstName"
                autoComplete="given-name"
                value={form.firstName}
                onChange={(e) => update("firstName", e.target.value)}
                data-error={!!errors.firstName}
                aria-invalid={!!errors.firstName}
                aria-describedby={errors.firstName ? "err-firstName" : undefined}
                className={fieldClass("firstName")}
                placeholder="Yanis"
              />
              {errors.firstName && (
                <p id="err-firstName" role="alert" className="mt-1.5 text-xs text-[color:var(--color-danger)]">
                  {errors.firstName}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="lastName" className="eyebrow mb-2 block">
                Nom *
              </label>
              <input
                id="lastName"
                name="lastName"
                autoComplete="family-name"
                value={form.lastName}
                onChange={(e) => update("lastName", e.target.value)}
                data-error={!!errors.lastName}
                aria-invalid={!!errors.lastName}
                aria-describedby={errors.lastName ? "err-lastName" : undefined}
                className={fieldClass("lastName")}
                placeholder="Belkacem"
              />
              {errors.lastName && (
                <p id="err-lastName" role="alert" className="mt-1.5 text-xs text-[color:var(--color-danger)]">
                  {errors.lastName}
                </p>
              )}
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="phone" className="eyebrow mb-2 block">
                Téléphone *
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                value={form.phone}
                onChange={(e) => update("phone", e.target.value)}
                data-error={!!errors.phone}
                aria-invalid={!!errors.phone}
                aria-describedby={errors.phone ? "err-phone" : "hint-phone"}
                className={fieldClass("phone")}
                placeholder="0555 12 34 56"
              />
              {errors.phone ? (
                <p id="err-phone" role="alert" className="mt-1.5 text-xs text-[color:var(--color-danger)]">
                  {errors.phone}
                </p>
              ) : (
                <p id="hint-phone" className="mt-1.5 text-xs text-fg-3">
                  Nous vous appelons pour confirmer la commande avant expédition.
                </p>
              )}
            </div>
          </div>
        </section>

        {/* ============================================== livraison ======== */}
        <section className="surface rounded-xl p-6 md:p-7" aria-labelledby="livraison">
          <h2 id="livraison" className="font-display text-base font-bold uppercase">
            <span className="mr-2 text-accent-2">02</span> Livraison
          </h2>

          {/* mode */}
          <div
            role="radiogroup"
            aria-label="Mode de livraison"
            className="mt-5 grid gap-3 sm:grid-cols-2"
          >
            {(
              [
                {
                  id: "domicile" as const,
                  icon: Home,
                  label: "À domicile",
                  detail: `Livré chez vous · ${formatPrice(SHIPPING.domicile)}`,
                },
                {
                  id: "bureau" as const,
                  icon: Building2,
                  label: "Bureau du transporteur",
                  detail: `Retrait au point relais · ${formatPrice(SHIPPING.bureau)}`,
                },
              ]
            ).map((option) => (
              <button
                key={option.id}
                type="button"
                role="radio"
                aria-checked={delivery === option.id}
                onClick={() => setDelivery(option.id)}
                className={`flex items-start gap-3 rounded-lg border p-4 text-left
                  transition-all duration-300 ${
                    delivery === option.id
                      ? "border-accent bg-accent-soft"
                      : "border-line hover:border-line-strong hover:bg-black/[0.035]"
                  }`}
              >
                <option.icon
                  size={18}
                  className={delivery === option.id ? "text-accent-2" : "text-fg-3"}
                />
                <span>
                  <span className="block text-[0.875rem] font-semibold">{option.label}</span>
                  <span className="block text-xs text-fg-2">{option.detail}</span>
                </span>
              </button>
            ))}
          </div>

          {/* adresse */}
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="wilaya" className="eyebrow mb-2 block">
                Wilaya *
              </label>
              <select
                id="wilaya"
                name="wilaya"
                autoComplete="address-level1"
                value={form.wilaya}
                onChange={(e) => update("wilaya", e.target.value)}
                data-error={!!errors.wilaya}
                aria-invalid={!!errors.wilaya}
                className={fieldClass("wilaya")}
              >
                <option value="">Choisir une wilaya…</option>
                {WILAYAS.map((wilaya) => (
                  <option key={wilaya.code} value={wilaya.name}>
                    {wilaya.code} — {wilaya.name}
                  </option>
                ))}
              </select>
              {errors.wilaya && (
                <p role="alert" className="mt-1.5 text-xs text-[color:var(--color-danger)]">
                  {errors.wilaya}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="commune" className="eyebrow mb-2 block">
                Commune *
              </label>
              <select
                id="commune"
                name="commune"
                autoComplete="address-level2"
                value={form.commune}
                onChange={(e) => update("commune", e.target.value)}
                disabled={!form.wilaya}
                data-error={!!errors.commune}
                aria-invalid={!!errors.commune}
                className={`${fieldClass("commune")} disabled:opacity-45`}
              >
                <option value="">
                  {form.wilaya ? "Choisir une commune…" : "Choisissez d’abord la wilaya"}
                </option>
                {communes.map((commune) => (
                  <option key={commune} value={commune}>
                    {commune}
                  </option>
                ))}
              </select>
              {errors.commune && (
                <p role="alert" className="mt-1.5 text-xs text-[color:var(--color-danger)]">
                  {errors.commune}
                </p>
              )}
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="address" className="eyebrow mb-2 block">
                Adresse {delivery === "domicile" ? "*" : "(facultative)"}
              </label>
              <input
                id="address"
                name="address"
                autoComplete="street-address"
                value={form.address}
                onChange={(e) => update("address", e.target.value)}
                data-error={!!errors.address}
                aria-invalid={!!errors.address}
                className={fieldClass("address")}
                placeholder="Rue, quartier, numéro, point de repère"
              />
              {errors.address && (
                <p role="alert" className="mt-1.5 text-xs text-[color:var(--color-danger)]">
                  {errors.address}
                </p>
              )}
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="note" className="eyebrow mb-2 block">
                Note pour le livreur (facultatif)
              </label>
              <textarea
                id="note"
                name="note"
                rows={3}
                value={form.note}
                onChange={(e) => update("note", e.target.value)}
                className="field h-auto resize-none py-3"
                placeholder="Horaire de disponibilité, étage, immeuble…"
              />
            </div>
          </div>
        </section>

        {/* =============================================== paiement ======== */}
        <section className="surface rounded-xl p-6 md:p-7" aria-labelledby="paiement">
          <h2 id="paiement" className="font-display text-base font-bold uppercase">
            <span className="mr-2 text-accent-2">03</span> Paiement
          </h2>

          <div role="radiogroup" aria-label="Moyen de paiement" className="mt-5 space-y-3">
            {PAYMENT_METHODS.map((method) => (
              <button
                key={method.id}
                type="button"
                role="radio"
                aria-checked={payment === method.id}
                disabled={!method.available}
                onClick={() => method.available && setPayment(method.id)}
                className={`flex w-full items-start gap-3.5 rounded-lg border p-4 text-left
                  transition-all duration-300 ${
                    payment === method.id
                      ? "border-accent bg-accent-soft"
                      : method.available
                        ? "border-line hover:border-line-strong hover:bg-black/[0.035]"
                        : "cursor-not-allowed border-line opacity-45"
                  }`}
              >
                <span
                  className={`mt-0.5 grid size-4.5 shrink-0 place-items-center rounded-full border
                    ${payment === method.id ? "border-accent-2" : "border-line-strong"}`}
                  aria-hidden="true"
                >
                  {payment === method.id && (
                    <span className="size-2 rounded-full bg-accent-2" />
                  )}
                </span>

                <span className="min-w-0">
                  <span className="flex flex-wrap items-center gap-2">
                    <span className="text-[0.875rem] font-semibold">{method.label}</span>
                    {!method.available && <span className="badge">Bientôt</span>}
                  </span>
                  <span className="mt-0.5 block text-xs leading-relaxed text-fg-2">
                    {method.description}
                  </span>
                </span>
              </button>
            ))}
          </div>
        </section>
      </div>

      {/* ============================================= récapitulatif ======= */}
      <aside className="lg:sticky lg:top-24 lg:self-start">
        <div className="surface rounded-xl p-6">
          <h2 className="font-display text-base font-bold uppercase">Votre commande</h2>

          <ul className="mt-5 space-y-3.5">
            {cart.map((line) => (
              <li key={`${line.productId}:${line.size}`} className="flex gap-3">
                <div className="surface-2 relative size-14 shrink-0 overflow-hidden rounded-md">
                  <Image
                    src={line.image}
                    alt=""
                    fill
                    sizes="56px"
                    className="object-contain p-1"
                  />
                  <span
                    className="absolute -right-1 -top-1 grid size-5 place-items-center
                      rounded-full bg-accent text-[0.625rem] font-bold text-[#1b1710]"
                  >
                    {line.quantity}
                  </span>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[0.8125rem] font-semibold">{line.name}</p>
                  <p className="truncate text-xs text-fg-2">{line.colorName}</p>
                  <p className="text-xs text-fg-3">Pointure {line.size}</p>
                </div>
                <span className="shrink-0 text-[0.8125rem] font-semibold">
                  {formatPrice(line.price * line.quantity)}
                </span>
              </li>
            ))}
          </ul>

          <div className="rule my-5" />

          <dl className="space-y-2.5 text-sm">
            <div className="flex justify-between">
              <dt className="text-fg-2">Sous-total</dt>
              <dd>{formatPrice(subtotal)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-fg-2">
                Livraison {delivery === "domicile" ? "à domicile" : "au bureau"}
              </dt>
              <dd className={shipping === 0 ? "text-[color:var(--color-success)]" : ""}>
                {shipping === 0 ? "Offerte" : formatPrice(shipping)}
              </dd>
            </div>
          </dl>

          <div className="rule my-5" />

          <div className="flex items-baseline justify-between">
            <span className="font-display text-sm font-bold uppercase">Total</span>
            <span className="font-display text-2xl font-bold">{formatPrice(total)}</span>
          </div>

          <button type="submit" disabled={submitting} className="btn btn-primary mt-6 w-full">
            {submitting ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Envoi en cours…
              </>
            ) : (
              <>
                Confirmer la commande
                <ArrowRight size={15} />
              </>
            )}
          </button>

          <p className="mt-3 flex items-start gap-2 text-xs text-fg-3">
            <Lock size={13} className="mt-0.5 shrink-0" />
            Aucun paiement en ligne : vous réglez {formatPrice(total)} à la réception.
          </p>
        </div>
      </aside>
    </form>
  );
}
