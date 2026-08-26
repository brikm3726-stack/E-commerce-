"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Expand, X, ZoomIn } from "lucide-react";
import type { ProductImage } from "@/lib/types";

interface ProductGalleryProps {
  images: ProductImage[];
  productName: string;
}

export function ProductGallery({ images, productName }: ProductGalleryProps) {
  const [index, setIndex] = useState(0);
  const [zoomed, setZoomed] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const [origin, setOrigin] = useState("50% 50%");
  const stageRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef<number | null>(null);

  const image = images[index];
  const go = (next: number) => setIndex((next + images.length) % images.length);

  // navigation clavier en plein écran
  useEffect(() => {
    if (!fullscreen) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setFullscreen(false);
      if (event.key === "ArrowRight") go(index + 1);
      if (event.key === "ArrowLeft") go(index - 1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fullscreen, index, images.length]);

  // le zoom suit le pointeur
  const handleMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!zoomed) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;
    setOrigin(`${x}% ${y}%`);
  };

  // balayage tactile
  const handleTouchStart = (event: React.TouchEvent) => {
    touchStartX.current = event.touches[0].clientX;
  };

  const handleTouchEnd = (event: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const delta = event.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(delta) > 45) go(delta < 0 ? index + 1 : index - 1);
    touchStartX.current = null;
  };

  return (
    <>
      <div className="flex flex-col-reverse gap-3 lg:flex-row">
        {/* -------------------------------------------------- miniatures */}
        <div
          className="no-scrollbar flex gap-2.5 overflow-x-auto lg:w-20 lg:shrink-0
            lg:flex-col lg:overflow-visible"
          role="tablist"
          aria-label="Vues du produit"
        >
          {images.map((thumb, i) => (
            <button
              key={thumb.src}
              type="button"
              role="tab"
              aria-selected={i === index}
              aria-label={`Vue ${i + 1} sur ${images.length}`}
              onClick={() => setIndex(i)}
              className={`surface-2 relative aspect-square w-16 shrink-0 overflow-hidden
                rounded-md transition-all duration-300 lg:w-full ${
                  i === index
                    ? "border-accent-2 opacity-100"
                    : "opacity-60 hover:opacity-100"
                }`}
            >
              <Image
                src={thumb.src}
                alt=""
                fill
                sizes="80px"
                className="object-cover"
              />
            </button>
          ))}
        </div>

        {/* ------------------------------------------------ vue principale */}
        <div className="min-w-0 flex-1">
          <div
            ref={stageRef}
            onMouseMove={handleMove}
            onMouseLeave={() => setZoomed(false)}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            className="surface group relative aspect-4/5 overflow-hidden rounded-lg"
          >
            <Image
              key={image.src}
              src={image.src2x ?? image.src}
              alt={image.alt}
              fill
              priority
              sizes="(max-width: 1024px) 92vw, 42vw"
              className="anim-fade-in object-cover transition-transform duration-500
                ease-[cubic-bezier(0.22,1,0.36,1)]"
              style={{
                transform: zoomed ? "scale(2.1)" : "scale(1)",
                transformOrigin: origin,
              }}
            />

            {/* actions */}
            <div className="absolute right-3 top-3 flex flex-col gap-2">
              <button
                type="button"
                onClick={() => setZoomed((z) => !z)}
                aria-label={zoomed ? "Désactiver le zoom" : "Activer le zoom"}
                aria-pressed={zoomed}
                className={`hidden size-9 place-items-center rounded-md border
                  backdrop-blur-md transition-all duration-300 lg:grid ${
                    zoomed
                      ? "border-accent-line bg-accent-soft text-accent-2"
                      : "border-line bg-ink/70 text-fg-2 hover:text-fg"
                  }`}
              >
                <ZoomIn size={15} />
              </button>

              <button
                type="button"
                onClick={() => setFullscreen(true)}
                aria-label="Afficher en plein écran"
                className="grid size-9 place-items-center rounded-md border border-line
                  bg-ink/70 text-fg-2 backdrop-blur-md transition-all duration-300 hover:text-fg"
              >
                <Expand size={15} />
              </button>
            </div>

            {/* flèches */}
            {images.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={() => go(index - 1)}
                  aria-label="Vue précédente"
                  className="absolute left-3 top-1/2 grid size-9 -translate-y-1/2
                    place-items-center rounded-md border border-line bg-ink/70 text-fg-2
                    opacity-0 backdrop-blur-md transition-all duration-300
                    group-hover:opacity-100 hover:text-fg max-lg:opacity-100"
                >
                  <ChevronLeft size={17} />
                </button>
                <button
                  type="button"
                  onClick={() => go(index + 1)}
                  aria-label="Vue suivante"
                  className="absolute right-3 top-1/2 grid size-9 -translate-y-1/2
                    place-items-center rounded-md border border-line bg-ink/70 text-fg-2
                    opacity-0 backdrop-blur-md transition-all duration-300
                    group-hover:opacity-100 hover:text-fg max-lg:opacity-100 lg:hidden"
                >
                  <ChevronRight size={17} />
                </button>
              </>
            )}

            {/* pagination */}
            <div className="absolute inset-x-0 bottom-3 flex justify-center gap-1.5 lg:hidden">
              {images.map((dot, i) => (
                <span
                  key={dot.src}
                  className={`h-1 rounded-full transition-all duration-300 ${
                    i === index ? "w-5 bg-accent-2" : "w-1 bg-white/25"
                  }`}
                />
              ))}
            </div>
          </div>

          <p className="mt-2 hidden text-center text-[0.6875rem] text-fg-3 lg:block">
            Survolez avec le zoom activé pour agrandir · cliquez pour le plein écran
          </p>
        </div>
      </div>

      {/* ------------------------------------------------------ plein écran */}
      {fullscreen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`${productName} — plein écran`}
          className="anim-fade-in fixed inset-0 z-[95] flex flex-col bg-ink/97 backdrop-blur-xl"
        >
          <div className="flex h-16 shrink-0 items-center justify-between px-5">
            <span className="text-xs text-fg-3">
              {index + 1} / {images.length}
            </span>
            <button
              type="button"
              onClick={() => setFullscreen(false)}
              aria-label="Fermer le plein écran"
              className="grid size-10 place-items-center rounded-md text-fg-2
                transition-colors hover:bg-white/5 hover:text-fg"
            >
              <X size={20} />
            </button>
          </div>

          <div
            className="relative flex-1"
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            <Image
              key={`fs-${image.src}`}
              src={image.src2x ?? image.src}
              alt={image.alt}
              fill
              sizes="100vw"
              className="anim-scale-in object-contain p-4"
            />

            {images.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={() => go(index - 1)}
                  aria-label="Vue précédente"
                  className="absolute left-4 top-1/2 grid size-11 -translate-y-1/2
                    place-items-center rounded-md border border-line bg-ink/70
                    text-fg-2 backdrop-blur-md transition-colors hover:text-fg"
                >
                  <ChevronLeft size={20} />
                </button>
                <button
                  type="button"
                  onClick={() => go(index + 1)}
                  aria-label="Vue suivante"
                  className="absolute right-4 top-1/2 grid size-11 -translate-y-1/2
                    place-items-center rounded-md border border-line bg-ink/70
                    text-fg-2 backdrop-blur-md transition-colors hover:text-fg"
                >
                  <ChevronRight size={20} />
                </button>
              </>
            )}
          </div>

          <div className="no-scrollbar flex shrink-0 justify-center gap-2 overflow-x-auto p-4">
            {images.map((thumb, i) => (
              <button
                key={thumb.src}
                type="button"
                onClick={() => setIndex(i)}
                aria-label={`Vue ${i + 1}`}
                className={`surface-2 relative size-14 shrink-0 overflow-hidden rounded-md
                  transition-opacity ${i === index ? "border-accent-2" : "opacity-50"}`}
              >
                <Image src={thumb.src} alt="" fill sizes="56px" className="object-cover" />
              </button>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
