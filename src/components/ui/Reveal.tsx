"use client";

import { useEffect, useRef, useState, type ElementType, type ReactNode } from "react";

interface RevealProps {
  children: ReactNode;
  /** retard en ms, pour décaler les éléments d'une même rangée */
  delay?: number;
  className?: string;
  as?: ElementType;
  /** proportion visible avant déclenchement */
  threshold?: number;
}

/**
 * Apparition au défilement. Un seul IntersectionObserver par élément, retiré
 * dès qu'il a joué : pas de listener de scroll, pas de re-rendu continu.
 */
export function Reveal({
  children,
  delay = 0,
  className = "",
  as: Tag = "div",
  threshold = 0.12,
}: RevealProps) {
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    // au-dessus de la ligne de flottaison : on affiche sans attendre
    if (node.getBoundingClientRect().top < window.innerHeight * 0.9) {
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold, rootMargin: "0px 0px -8% 0px" },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [threshold]);

  return (
    <Tag
      ref={ref}
      className={`reveal ${visible ? "is-visible" : ""} ${className}`}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </Tag>
  );
}
