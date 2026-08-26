const ITEMS = [
  "Livraison 58 wilayas",
  "Paiement à la livraison",
  "Échange sous 48 h",
  "Stock limité — une paire par pointure",
  "Sélection contrôlée à l’unité",
];

/** Bandeau défilant. Le contenu est dupliqué pour boucler sans coupure ;
 *  la copie est masquée aux lecteurs d'écran. */
export function Marquee() {
  return (
    <section
      className="relative overflow-hidden border-y border-line bg-ink-2/60 py-3.5"
      aria-label="Nos engagements"
    >
      <div
        className="flex w-max animate-[marquee_38s_linear_infinite] gap-10
          motion-reduce:animate-none"
      >
        {[0, 1].map((copy) => (
          <ul
            key={copy}
            className="flex shrink-0 items-center gap-10"
            aria-hidden={copy === 1}
          >
            {ITEMS.map((item) => (
              <li
                key={item}
                className="flex items-center gap-10 text-[0.6875rem] font-semibold
                  tracking-[0.2em] whitespace-nowrap uppercase text-fg-3"
              >
                {item}
                <span className="size-1 rounded-full bg-accent-2" aria-hidden="true" />
              </li>
            ))}
          </ul>
        ))}
      </div>

      {/* estompage des bords */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 left-0 w-20
          bg-gradient-to-r from-ink to-transparent"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 right-0 w-20
          bg-gradient-to-l from-ink to-transparent"
      />
    </section>
  );
}
