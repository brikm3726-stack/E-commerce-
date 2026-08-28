"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import {
  BadgeCheck,
  Check,
  Headphones,
  Loader2,
  MessageCircle,
  RotateCcw,
  ShieldCheck,
  Truck,
} from "lucide-react";
import { WILAYAS } from "@/data/wilayas";
import { SITE } from "@/data/site";
import { noestRate } from "@/data/shipping-noest";
import { isValidPhone, normalizePhone, orderReference } from "@/lib/format";
import { notifyOrder, type NotifyResult } from "@/lib/notify";
import type { Order, Product } from "@/lib/types";

/**
 * Page d'atterrissage arabe pour les campagnes Facebook Ads (Algérie).
 *
 * Tout est pensé pour une seule chose : commander en moins d'une minute, au
 * pouce, sur un téléphone. Le formulaire est donc en haut de page, le choix du
 * coloris et de la pointure se fait en tapant sur une image ou une pastille, et
 * aucune navigation ne permet de sortir de la page.
 *
 * Les noms de produits et de coloris restent en français : c'est ainsi que le
 * client les nomme dans ses publicités.
 */

/**
 * Prix en dinars, en chiffres occidentaux — ceux qu utilisent les Algeriens.
 *
 * Le nombre est isole dans un `<bdi>` : sans cela l algorithme bidirectionnel
 * coupe « 3 900 » autour de l espace et l affiche « 900 3 » au milieu du texte
 * arabe. Le separateur de milliers est insecable, pour la meme raison.
 */
function Dzd({ value }: { value: number }) {
  const digits = value.toLocaleString("fr-DZ").replace(/[\s, ]/g, "\u00a0");
  return (
    <>
      <bdi>{digits}</bdi> دج
    </>
  );
}

/** Meme montant en texte brut, pour le message WhatsApp. */
const dzdText = (value: number) => `${value} دج`;

/**
 * Maquette publicitaire par coloris. Elle change quand le client change de
 * couleur dans l'etape 1 : la chaussure qu'il voit en haut est celle qu'il
 * commande.
 *
 * Les trois fichiers partagent le meme gabarit, bouton peint compris, d'ou
 * une seule zone cliquable pour les trois (voir PAINTED_CTA).
 */
const HERO_BY_SLUG: Record<string, string> = {
  "step-one-navy": "/offre-hero-step-one-navy.webp",
  "step-one-white": "/offre-hero-step-one-white.webp",
  "step-one-black": "/offre-hero-step-one-black.webp",
};

/** Bouton « اطلب الآن » peint dans les maquettes, en % de l'image. */
const PAINTED_CTA = { left: "39%", top: "90.5%", width: "22%", height: "6.5%" };

const DELIVERY = [
  {
    id: "domicile" as const,
    label: "التوصيل للمنزل",
    detail: "نجيبولك الطلبية لباب دارك",
  },
  {
    id: "bureau" as const,
    label: "التوصيل لمكتب NOEST",
    detail: "تروح تحوّسها من أقرب مكتب",
  },
];

const GUARANTEES = [
  { icon: Truck, title: "التوصيل لـ 55 ولاية", detail: "مع NOEST Express" },
  { icon: ShieldCheck, title: "الدفع عند الاستلام", detail: "ما تخلّص حتى توصلك" },
  { icon: RotateCcw, title: "تبديل خلال 48 ساعة", detail: "إذا المقاس ما جاكش" },
  { icon: BadgeCheck, title: "سلعة مراقبة", detail: "نتأكدو من كل زوج قبل الإرسال" },
];

const FAQ = [
  {
    q: "كيفاش نخلّص؟",
    a: "الدفع عند الاستلام. تخلّص عون التوصيل كي توصلك الطلبية في يدك، ما تخلّص والو قبل.",
  },
  {
    q: "شحال يدوم التوصيل؟",
    a: "من 48 إلى 72 ساعة حسب الولاية. نتصلو بيك بالهاتف قبل ما نرسلو باش نأكدو معاك.",
  },
  {
    q: "وإذا المقاس ما جانيش؟",
    a: "تبدلو خلال 48 ساعة. كليمي علينا و نرتّبو معاك.",
  },
  {
    q: "واش من مقاس ناخذ؟",
    a: "الصباط يجي عادي، خوذ مقاسك المعتاد. إذا كنت متردد خوذ المقاس اللي فوق.",
  },
];

type FormErrors = Partial<
  Record<"size" | "name" | "phone" | "wilaya" | "commune" | "address", string>
>;

export function OrderLanding({ products }: { products: Product[] }) {
  const [slug, setSlug] = useState(products[0]?.slug ?? "");
  const [size, setSize] = useState("");
  const [delivery, setDelivery] = useState<"domicile" | "bureau">("domicile");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [wilaya, setWilaya] = useState("");
  const [commune, setCommune] = useState("");
  const [address, setAddress] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});
  const [sending, setSending] = useState(false);
  const [order, setOrder] = useState<Order | null>(null);
  /** `null` tant que l'envoi de l'e-mail est en cours. */
  const [notified, setNotified] = useState<NotifyResult | null>(null);

  const product = products.find((p) => p.slug === slug) ?? products[0];
  const selected = useMemo(() => WILAYAS.find((w) => w.name === wilaya), [wilaya]);
  const communes = selected?.communes ?? [];
  const wilayaCode = selected?.code ?? "";

  // Le tarif NOEST depend de la wilaya : tant qu'elle n'est pas choisie, on
  // n'affiche aucun prix de livraison plutot qu'un montant qui changera.
  const rate = wilayaCode ? noestRate(wilayaCode) : null;
  const covered = !wilayaCode || rate !== null;
  const shipping = rate ? (delivery === "domicile" ? rate.domicile : rate.stopdesk) : 0;
  const total = product.price + shipping;
  const inStock = product.sizes.filter((s) => s.stock > 0).length;

  /** Descend jusqu'a la premiere etape du formulaire. */
  const scrollToForm = () =>
    document
      .querySelector('[data-field="size"]')
      ?.scrollIntoView({ behavior: "smooth", block: "center" });

  /** Changer de coloris peut invalider la pointure choisie. */
  const pickColor = (next: string) => {
    setSlug(next);
    const stillThere = products
      .find((p) => p.slug === next)
      ?.sizes.some((s) => s.size === size && s.stock > 0);
    if (!stillThere) setSize("");
  };

  const pickWilaya = (next: string) => {
    setWilaya(next);
    setCommune("");
  };

  const validate = (): FormErrors => {
    const next: FormErrors = {};
    if (!size) next.size = "اختر المقاس من فضلك";
    if (name.trim().length < 3) next.name = "اكتب اسمك و لقبك";
    if (!isValidPhone(phone)) next.phone = "رقم غير صحيح. مثال : 0555 12 34 56";
    if (!wilaya) next.wilaya = "اختر الولاية";
    else if (!rate) next.wilaya = "للأسف NOEST ما توصلش لهذه الولاية";
    if (!commune) next.commune = "اختر البلدية";
    if (delivery === "domicile" && address.trim().length < 6)
      next.address = "اكتب العنوان بالتفصيل";
    return next;
  };

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    const found = validate();
    setErrors(found);

    if (Object.keys(found).length > 0) {
      // ramène l'utilisateur sur le premier champ fautif
      document
        .querySelector<HTMLElement>(`[data-field="${Object.keys(found)[0]}"]`)
        ?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }

    setSending(true);
    const [firstName, ...rest] = name.trim().split(/\s+/);

    const built: Order = {
      reference: orderReference(),
      createdAt: new Date().toISOString(),
      customer: {
        firstName,
        lastName: rest.join(" "),
        phone: normalizePhone(phone),
        wilaya,
        commune,
        address: address.trim() || commune,
      },
      delivery,
      payment: "cod",
      lines: [
        {
          productId: product.id,
          slug: product.slug,
          name: product.name,
          subtitle: product.subtitle,
          colorName: product.colorName,
          size,
          price: product.price,
          quantity: 1,
          image: product.cutout.src,
          maxQuantity: 1,
        },
      ],
      subtotal: product.price,
      shipping,
      total,
    };

    // L'e-mail part en arrière-plan : on n'attend PAS le réseau pour afficher
    // la confirmation. Faire patienter quelqu'un devant un écran figé, sur un
    // tunnel Facebook Ads, c'est la commande perdue.
    void notifyOrder(built, "Page pub arabe").then(setNotified);

    // court délai, juste pour que le bouton montre son état de chargement
    await new Promise((r) => setTimeout(r, 500));
    setSending(false);
    setOrder(built);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  /** Récapitulatif arabe, prêt à être envoyé sur WhatsApp. */
  const whatsappLink = (o: Order) => {
    const text = [
      `طلبية جديدة — ${o.reference}`,
      `${o.customer.firstName} ${o.customer.lastName} — ${o.customer.phone}`,
      `${o.customer.wilaya} / ${o.customer.commune}`,
      o.delivery === "domicile"
        ? `التوصيل للمنزل (NOEST) — ${o.customer.address}`
        : "التوصيل لمكتب NOEST",
      `المنتج : ${product.name} ${product.colorName} — مقاس ${size}`,
      `المجموع : ${dzdText(total)} (الدفع عند الاستلام)`,
    ].join("\n");
    return `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(text)}`;
  };

  // ======================================================== confirmation ===
  if (order) {
    return (
      <div
        dir="rtl"
        lang="ar"
        className="font-arabic min-h-dvh bg-ink px-5 py-14 text-center"
      >
        <div className="mx-auto max-w-md">
          <div className="mx-auto grid size-16 place-items-center rounded-full bg-accent">
            <Check size={32} className="text-[#1b1710]" />
          </div>

          <h1 className="mt-6 text-2xl font-black">تم تسجيل طلبك</h1>

          <p className="mt-3 leading-relaxed text-fg-2">
            نتصلو بيك في أقرب وقت على الرقم{" "}
            <span className="font-bold text-fg">{order.customer.phone}</span> باش
            نأكدو الطلبية قبل الإرسال.
          </p>

          <div className="mt-6 rounded-2xl border border-line bg-card p-5 text-start">
            <p className="text-xs text-fg-3">رقم الطلب</p>
            <p className="font-bold" dir="ltr">
              {order.reference}
            </p>

            <div className="mt-4 space-y-1.5 border-t border-line pt-4 text-sm">
              <p>
                <span className="text-fg-2">المنتج :</span> {product.name}{" "}
                {product.colorName}
              </p>
              <p>
                <span className="text-fg-2">المقاس :</span> {size}
              </p>
              <p>
                <span className="text-fg-2">المجموع :</span>{" "}
                <span className="font-bold"><Dzd value={order.total} /></span> — الدفع عند
                الاستلام
              </p>
            </div>
          </div>

          {/* Si l'e-mail n'est pas parti, WhatsApp devient le seul chemin
              jusqu'à nous : on le dit clairement au lieu de laisser croire
              que la commande est bien arrivée. */}
          {notified === "failed" && (
            <p className="mt-6 rounded-2xl border border-accent-line bg-accent-soft p-3.5 text-sm font-bold">
              الأنترنت تقطع أثناء الإرسال. من فضلك أكد طلبك على واتساب باش ما
              تروحش الطلبية.
            </p>
          )}

          <a
            href={whatsappLink(order)}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 flex h-14 items-center justify-center gap-2 rounded-2xl
              bg-[#25D366] text-base font-black text-white"
          >
            <MessageCircle size={20} />
            أكد الطلب على واتساب
          </a>

          <p className="mt-4 text-xs text-fg-3">
            {notified === "failed"
              ? "الطلبية توصلنا كي تبعثها على واتساب."
              : "تأكيد الطلب على واتساب يسرّع الإرسال، لكنه غير إجباري."}
          </p>
        </div>
      </div>
    );
  }

  // ============================================================== la page ===
  return (
    <div dir="rtl" lang="ar" className="font-arabic bg-ink pb-28 lg:pb-0">
      {/* ------------------------------------------------------------ hero */}
      {/* La maquette publicitaire fournie par le client, posée telle quelle :
          elle porte deja le logo, le titre, le prix et la reduction. Rien
          n'est redessine par-dessus. Le bouton peint en bas est double d'un
          lien invisible, cale en %, qui descend au formulaire. */}
      <header className="relative">
        <Image
          key={product.slug}
          src={HERO_BY_SLUG[product.slug] ?? HERO_BY_SLUG["step-one-navy"]}
          alt={`صباط ${product.name} ${product.colorName} بـ 1800 دج — الدفع عند الاستلام`}
          width={900}
          height={900}
          priority
          sizes="(max-width: 640px) 100vw, 640px"
          className="anim-fade-in block w-full"
        />

        <button
          type="button"
          onClick={scrollToForm}
          aria-label="اطلب الآن"
          className="absolute rounded-full transition-colors duration-300 hover:bg-white/15"
          style={PAINTED_CTA}
        />
      </header>

      <div className="mx-auto max-w-lg px-5">
        {/* --------------------------------------------------- le formulaire */}
        <form onSubmit={submit} noValidate className="-mt-4">
          <div className="rounded-3xl border border-line bg-card p-5 shadow-lg">
            {/* ------------------------------------------------ 1. coloris */}
            <Step n={1} title="اختر اللون" />

            <div className="mt-3 grid grid-cols-3 gap-2.5">
              {products.map((item) => {
                const active = item.slug === product.slug;
                return (
                  <button
                    key={item.slug}
                    type="button"
                    onClick={() => pickColor(item.slug)}
                    aria-pressed={active}
                    className={`overflow-hidden rounded-2xl border-2 text-center transition-all
                      ${active ? "border-accent shadow-md" : "border-line opacity-75"}`}
                  >
                    <span className="relative block aspect-square">
                      <Image
                        src={item.cutout.src}
                        alt={item.colorName}
                        fill
                        sizes="33vw"
                        className="object-cover"
                      />
                      {active && (
                        <span className="absolute inset-x-0 bottom-0 grid h-6 place-items-center bg-accent">
                          <Check size={14} className="text-[#1b1710]" />
                        </span>
                      )}
                    </span>
                    <span
                      dir="ltr"
                      className="block px-1 py-1.5 text-[0.62rem] leading-tight font-semibold"
                    >
                      {item.colorName}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* ------------------------------------------------ 2. pointure */}
            <div data-field="size" className="mt-6">
              <Step n={2} title="اختر المقاس" />
              <p className="mt-1 text-xs text-fg-3">
                باقي {inStock} {inStock > 1 ? "مقاسات" : "مقاس"} فقط في هذا اللون
              </p>

              <div className="mt-3 flex flex-wrap gap-2">
                {product.sizes.map((s) => {
                  const out = s.stock === 0;
                  const active = s.size === size;
                  return (
                    <button
                      key={s.size}
                      type="button"
                      disabled={out}
                      onClick={() => setSize(s.size)}
                      aria-pressed={active}
                      className={`h-12 min-w-14 rounded-xl border-2 text-base font-bold transition-all
                        ${
                          out
                            ? "cursor-not-allowed border-line text-fg-3 line-through opacity-50"
                            : active
                              ? "border-accent bg-accent text-[#1b1710]"
                              : "border-line-strong hover:border-accent-line"
                        }`}
                    >
                      {s.size}
                    </button>
                  );
                })}
              </div>
              <FieldError message={errors.size} />
            </div>

            {/* ------------------------------------------- 3. coordonnées */}
            <div className="mt-6">
              <Step n={3} title="معلوماتك" />

              <div className="mt-3 space-y-3">
                <div data-field="name">
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="الاسم و اللقب"
                    autoComplete="name"
                    className={`field h-13 text-base ${errors.name ? "field-error" : ""}`}
                  />
                  <FieldError message={errors.name} />
                </div>

                <div data-field="phone">
                  <input
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="رقم الهاتف"
                    type="tel"
                    inputMode="tel"
                    autoComplete="tel"
                    dir="ltr"
                    className={`field h-13 text-base ${errors.phone ? "field-error" : ""}`}
                  />
                  <FieldError message={errors.phone} />
                </div>

                <div data-field="wilaya">
                  <select
                    value={wilaya}
                    onChange={(e) => pickWilaya(e.target.value)}
                    className={`field h-13 text-base ${errors.wilaya ? "field-error" : ""}`}
                  >
                    <option value="">الولاية</option>
                    {WILAYAS.map((w) => (
                      <option key={w.code} value={w.name}>
                        {w.code} — {w.name}
                      </option>
                    ))}
                  </select>
                  <FieldError message={errors.wilaya} />
                </div>

                <div data-field="commune">
                  <select
                    value={commune}
                    onChange={(e) => setCommune(e.target.value)}
                    disabled={!wilaya}
                    className={`field h-13 text-base disabled:opacity-50
                      ${errors.commune ? "field-error" : ""}`}
                  >
                    <option value="">{wilaya ? "البلدية" : "اختر الولاية أولاً"}</option>
                    {communes.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                  <FieldError message={errors.commune} />
                </div>
              </div>
            </div>

            {/* -------------------------------------------- 4. livraison */}
            <div className="mt-6">
              <Step n={4} title="طريقة التوصيل" />

              {/* Le client doit savoir qui va sonner à sa porte. */}
              <div className="mt-3 flex items-center gap-3 rounded-2xl border border-line bg-white p-3">
                <Image
                  src="/noest-logo.webp"
                  alt="NOEST Express"
                  width={360}
                  height={471}
                  className="h-11 w-auto shrink-0"
                />
                <p className="text-[0.78rem] leading-snug text-fg-2">
                  التوصيل مع <span className="font-bold text-fg">NOEST Express</span> —
                  السعر يتبدل حسب الولاية.
                </p>
              </div>

              {!wilayaCode && (
                <p className="mt-3 rounded-xl bg-ink-2 p-3 text-center text-[0.8rem] font-semibold text-fg-2">
                  اختر ولايتك فوق باش يبان سعر التوصيل
                </p>
              )}

              {wilayaCode && !covered && (
                <p className="mt-3 rounded-xl border border-accent-line bg-accent-soft p-3 text-center text-[0.8rem] font-bold">
                  للأسف NOEST ما توصلش لولاية {wilaya}. كليمي علينا على واتساب و
                  نلقاو حل.
                </p>
              )}

              {rate && (
                <div className="mt-3 grid grid-cols-2 gap-2.5">
                  {DELIVERY.map((option) => {
                    const active = option.id === delivery;
                    const price = option.id === "domicile" ? rate.domicile : rate.stopdesk;
                    return (
                      <button
                        key={option.id}
                        type="button"
                        onClick={() => setDelivery(option.id)}
                        aria-pressed={active}
                        className={`rounded-2xl border-2 p-3 text-start transition-all
                          ${active ? "border-accent bg-accent-soft" : "border-line"}`}
                      >
                        <span className="block text-sm font-bold">{option.label}</span>
                        <span className="mt-0.5 block text-[0.7rem] text-fg-2">
                          {option.detail}
                        </span>
                        <span className="mt-1.5 block text-sm font-black text-accent-2">
                          <Dzd value={price} />
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}

              {rate && delivery === "domicile" && (
                <div data-field="address" className="mt-3">
                  <textarea
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="العنوان بالتفصيل (الحي، الشارع، رقم العمارة…)"
                    rows={2}
                    className={`field h-auto py-3 text-base ${errors.address ? "field-error" : ""}`}
                  />
                  <FieldError message={errors.address} />
                </div>
              )}
            </div>

            {/* ------------------------------------------------ récapitulatif */}
            <div className="mt-6 rounded-2xl bg-ink-2 p-4 text-sm">
              <Row label="السعر" value={<Dzd value={product.price} />} />
              <Row
                label="التوصيل"
                value={rate ? <Dzd value={shipping} /> : <span className="text-fg-3">—</span>}
              />
              <div className="mt-2 flex items-center justify-between border-t border-line pt-2">
                <span className="font-bold">المجموع</span>
                <span className="text-lg font-black text-accent-2">
                  {rate ? <Dzd value={total} /> : <span className="text-fg-3">—</span>}
                </span>
              </div>
            </div>

            <button type="submit" disabled={sending} className="btn-cta mt-4 w-full">
              {sending ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  جاري الإرسال…
                </>
              ) : (
                "اشتري الآن"
              )}
            </button>

            <p className="mt-3 text-center text-xs text-fg-3">
              ما تخلّص والو دروك — الدفع كي توصلك الطلبية
            </p>
          </div>
        </form>

        {/* ------------------------------------------------------- garanties */}
        <ul className="mt-8 grid grid-cols-2 gap-2.5">
          {GUARANTEES.map((g) => (
            <li key={g.title} className="rounded-2xl border border-line bg-card p-3.5">
              <g.icon size={20} className="text-accent-2" />
              <p className="mt-2 text-[0.8rem] font-bold">{g.title}</p>
              <p className="mt-0.5 text-[0.7rem] text-fg-2">{g.detail}</p>
            </li>
          ))}
        </ul>

        {/* --------------------------------------------------------- photos */}
        <section className="mt-10">
          <h2 className="text-lg font-black">صور المنتج</h2>
          <div className="mt-3 grid grid-cols-2 gap-2.5">
            {product.images.slice(0, 4).map((img) => (
              <div
                key={img.src}
                className="relative aspect-4/5 overflow-hidden rounded-2xl border border-line"
              >
                <Image
                  src={img.src}
                  alt={img.alt}
                  fill
                  sizes="(max-width: 640px) 46vw, 240px"
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        </section>

        {/* ------------------------------------------------------------ FAQ */}
        <section className="mt-10">
          <h2 className="text-lg font-black">أسئلة يطرحها الزبائن</h2>
          <div className="mt-3 space-y-2.5">
            {FAQ.map((item) => (
              <details
                key={item.q}
                className="rounded-2xl border border-line bg-card p-4 [&_summary]:cursor-pointer"
              >
                <summary className="text-sm font-bold">{item.q}</summary>
                <p className="mt-2 text-[0.8rem] leading-relaxed text-fg-2">{item.a}</p>
              </details>
            ))}
          </div>
        </section>

        {/* ----------------------------------------------------------- aide */}
        <a
          href={`tel:${SITE.phone.replace(/\s/g, "")}`}
          className="mt-8 flex items-center justify-center gap-2 rounded-2xl border
            border-line bg-card p-4 text-sm font-bold"
        >
          <Headphones size={18} className="text-accent-2" />
          عندك سؤال ؟ كليمي علينا&nbsp;
          <span dir="ltr">{SITE.phone}</span>
        </a>

        <p className="mt-8 pb-4 text-center text-xs text-fg-3">
          © 2026 EcomDZ — التوصيل لكل ولايات الوطن
        </p>
      </div>

      {/* ------------------------------- barre fixe : le prix suit le pouce */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-card/95 p-3 backdrop-blur-md lg:hidden">
        <div className="mx-auto flex max-w-lg items-center gap-3">
          <div className="shrink-0">
            <p className="text-[0.65rem] text-fg-3">
              {rate ? "المجموع" : "السعر"}
            </p>
            <p className="text-base font-black leading-none">
              <Dzd value={rate ? total : product.price} />
            </p>
          </div>
          <button
            type="button"
            onClick={scrollToForm}
            className="btn btn-primary h-12 flex-1"
          >
            اطلب الآن
          </button>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------ fragments --- */

function Step({ n, title }: { n: number; title: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className="grid size-6 place-items-center rounded-full bg-accent text-xs font-black text-[#1b1710]">
        {n}
      </span>
      <h2 className="text-base font-black">{title}</h2>
    </div>
  );
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between py-0.5">
      <span className="text-fg-2">{label}</span>
      <span className="font-semibold">{value}</span>
    </div>
  );
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <p role="alert" className="mt-1.5 text-xs font-semibold text-[color:var(--color-danger)]">
      {message}
    </p>
  );
}
