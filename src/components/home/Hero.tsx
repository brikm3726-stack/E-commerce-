"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ArrowRight, ShieldCheck, Truck } from "lucide-react";
import { formatPrice } from "@/lib/format";
import type { Product } from "@/lib/types";

/** Rotation automatique entre les coloris, coupée dès la première interaction. */
const ROTATE_MS = 5500;

export function Hero({ products }: { products: Product[] }) {
  const [active, setActive] = useState(0);
  const [locked, setLocked] = useState(false);
  const stageRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef(0);

  const product = products[active] ?? products[0];

  // animation d'ouverture : présente rapidement les 3 paires au chargement,
  // avant de se stabiliser sur la première.
  useEffect(() => {
    if (products.length < 2) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const sequence = [1, 2, 0];
    let step = 0;
    const id = window.setInterval(() => {
      setActive(sequence[step]);
      step += 1;
      if (step >= sequence.length) window.clearInterval(id);
    }, 620);

    return () => window.clearInterval(id);
    // volontairement vide : ne doit jouer qu'une fois, au montage
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // défilement lent des coloris
  useEffect(() => {
    if (locked || products.length < 2) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = window.setInterval(
      () => setActive((i) => (i + 1) % products.length),
      ROTATE_MS,
    );
    return () => window.clearInterval(id);
  }, [locked, products.length]);

  // parallaxe très légère à la souris (pointeur fin uniquement)
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const onMove = (event: MouseEvent) => {
      cancelAnimationFrame(frameRef.current);
      frameRef.current = requestAnimationFrame(() => {
        const rect = stage.getBoundingClientRect();
        const x = (event.clientX - rect.left) / rect.width - 0.5;
        const y = (event.clientY - rect.top) / rect.height - 0.5;
        stage.style.setProperty("--tilt-x", `${(-y * 7).toFixed(2)}deg`);
        stage.style.setProperty("--tilt-y", `${(x * 9).toFixed(2)}deg`);
        stage.style.setProperty("--shift-x", `${(x * 14).toFixed(1)}px`);
      });
    };

    const onLeave = () => {
      cancelAnimationFrame(frameRef.current);
      stage.style.setProperty("--tilt-x", "0deg");
      stage.style.setProperty("--tilt-y", "0deg");
      stage.style.setProperty("--shift-x", "0px");
    };

    stage.addEventListener("mousemove", onMove);
    stage.addEventListener("mouseleave", onLeave);
    return () => {
      cancelAnimationFrame(frameRef.current);
      stage.removeEventListener("mousemove", onMove);
      stage.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  const pick = (index: number) => {
    setActive(index);
    setLocked(true);
  };

  return (
    <section className="relative overflow-hidden" aria-label="Nouvelle collection">
      {/* trame de fond très discrète */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.16]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.045) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.045) 1px, transparent 1px)",
          backgroundSize: "84px 84px",
          maskImage: "radial-gradient(70% 60% at 50% 30%, #000 30%, transparent 100%)",
          WebkitMaskImage:
            "radial-gradient(70% 60% at 50% 30%, #000 30%, transparent 100%)",
        }}
      />

      <div className="container-page relative">
        <div className="grid items-center gap-6 pt-6 pb-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.08fr)] lg:gap-8 lg:pt-10 lg:pb-24">
          {/* ================================================= visuel ===== */}
          <div className="order-1 lg:order-2">
            <div
              ref={stageRef}
              className="relative mx-auto aspect-square w-full max-w-[36rem]"
              style={{ perspective: "1200px" }}
            >
              {/* halo bleu */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-[8%] rounded-full"
                style={{
                  background:
                    "radial-gradient(circle at 50% 45%, rgba(22,119,255,0.30), rgba(22,119,255,0.08) 42%, transparent 68%)",
                  filter: "blur(38px)",
                }}
              />

              {/* cercle de scène */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-[6%] rounded-full border border-white/6"
              />
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-[17%] rounded-full border border-white/4"
              />

              {/* la paire */}
              <div
                className="anim-float absolute inset-0"
                style={{
                  transform:
                    "rotateX(var(--tilt-x,0deg)) rotateY(var(--tilt-y,0deg)) translateX(var(--shift-x,0px))",
                  transformStyle: "preserve-3d",
                  transition: "transform 0.5s cubic-bezier(0.22,1,0.36,1)",
                }}
              >
                {products.map((item, index) => (
                  <Image
                    key={item.id}
                    src={item.cutout.src2x ?? item.cutout.src}
                    alt={index === active ? item.cutout.alt : ""}
                    fill
                    sizes="(max-width: 1024px) 92vw, 44vw"
                    priority={index === 0}
                    className={`object-contain transition-all duration-[900ms]
                      ease-[cubic-bezier(0.22,1,0.36,1)] ${
                        index === active
                          ? "scale-100 opacity-100"
                          : "pointer-events-none scale-[0.94] opacity-0"
                      }`}
                    style={{
                      filter: "drop-shadow(0 42px 60px rgba(0,0,0,0.85))",
                    }}
                  />
                ))}
              </div>

              {/* ombre au sol */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute bottom-[10%] left-1/2 h-6 w-[58%]
                  -translate-x-1/2 rounded-[50%] bg-black/70 blur-2xl"
              />

              {/* pastille flottante */}
              <div
                className="absolute right-1 top-6 hidden animate-[fade-up_0.8s_var(--ease-out-soft)_both]
                  sm:block lg:right-2 lg:top-10"
                style={{ animationDelay: "0.5s" }}
              >
                <div className="glass-panel rounded-lg border border-line px-3.5 py-2.5">
                  <p className="text-[0.5625rem] font-bold tracking-[0.16em] uppercase text-accent-2">
                    Premium quality
                  </p>
                  <p className="mt-0.5 text-[0.6875rem] text-fg-2">Cuir · semelle gomme</p>
                </div>
              </div>

              {/* prix flottant */}
              <div
                className="absolute bottom-8 left-0 hidden animate-[fade-up_0.8s_var(--ease-out-soft)_both]
                  sm:block lg:bottom-12"
                style={{ animationDelay: "0.68s" }}
              >
                <div className="glass-panel rounded-lg border border-line px-3.5 py-2.5">
                  <p className="text-[0.5625rem] font-bold tracking-[0.16em] uppercase text-fg-3">
                    À partir de
                  </p>
                  <p className="font-display text-base font-bold">
                    {formatPrice(product.price)}
                  </p>
                </div>
              </div>
            </div>

            {/* sélecteur de coloris */}
            <div className="mt-2 flex items-center justify-center gap-3">
              {products.map((item, index) => {
                const color = item.colors.find((c) => c.name === item.colorName);
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => pick(index)}
                    aria-label={`Voir le coloris ${item.colorName}`}
                    aria-pressed={index === active}
                    className={`group relative grid size-9 place-items-center rounded-full
                      border transition-all duration-300 ${
                        index === active
                          ? "border-accent-2 bg-accent-soft"
                          : "border-line hover:border-line-strong"
                      }`}
                  >
                    <span
                      className="size-4 rounded-full border border-white/20"
                      style={{
                        background: color?.accentHex
                          ? `linear-gradient(135deg, ${color.hex} 55%, ${color.accentHex} 55%)`
                          : color?.hex,
                      }}
                    />
                  </button>
                );
              })}
              <span className="ml-1 text-xs text-fg-3">{product.colorName}</span>
            </div>
          </div>

          {/* ================================================= texte ====== */}
          <div className="order-2 text-center lg:order-1 lg:text-left">
            <div
              className="anim-fade-up inline-flex items-center gap-2 rounded-full border
                border-accent-line bg-accent-soft px-3 py-1.5"
            >
              <span className="relative flex size-1.5">
                <span className="absolute inline-flex size-full animate-[pulse-ring_2.4s_ease-out_infinite] rounded-full bg-accent-2" />
                <span className="relative inline-flex size-1.5 rounded-full bg-accent-2" />
              </span>
              <span className="text-[0.625rem] font-bold tracking-[0.18em] uppercase text-accent-2">
                Nouveauté
              </span>
            </div>

            <h1
              className="display anim-fade-up mt-5 text-[clamp(2.5rem,8.4vw,4.7rem)]"
              style={{ animationDelay: "0.08s" }}
            >
              L’élégance
              <br />
              {/* insecable : « au » ne doit jamais rester seul en bout de ligne */}
              <span className="whitespace-nowrap">
                au{" "}
                <span className="bg-gradient-to-r from-accent-2 to-accent bg-clip-text text-transparent">
                  quotidien
                </span>
              </span>
            </h1>

            <p
              className="anim-fade-up mx-auto mt-5 max-w-md text-[0.9375rem] leading-relaxed
                text-fg-2 lg:mx-0 lg:text-base"
              style={{ animationDelay: "0.16s" }}
            >
              Des sneakers et vêtements pensés pour votre style, votre confort et votre
              quotidien.
            </p>

            <div
              className="anim-fade-up mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center lg:justify-start"
              style={{ animationDelay: "0.24s" }}
            >
              <Link href="/sneakers" className="btn btn-primary">
                Découvrir la collection
                <ArrowRight size={15} />
              </Link>
              <Link href="/nouveautes" className="btn btn-secondary">
                Voir les nouveautés
              </Link>
            </div>

            <ul
              className="anim-fade-up mt-9 flex flex-wrap justify-center gap-x-6 gap-y-3
                text-xs text-fg-2 lg:justify-start"
              style={{ animationDelay: "0.32s" }}
            >
              <li className="flex items-center gap-2">
                <Truck size={15} className="text-accent-2" />
                Livraison 58 wilayas
              </li>
              <li className="flex items-center gap-2">
                <ShieldCheck size={15} className="text-accent-2" />
                Paiement à la livraison
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
