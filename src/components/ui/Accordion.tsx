"use client";

import { useState, type ReactNode } from "react";
import { Plus } from "lucide-react";

interface AccordionItem {
  title: string;
  content: ReactNode;
}

/** Accordéon simple : un seul volet ouvert à la fois. */
export function Accordion({
  items,
  defaultOpen = null,
  className = "",
}: {
  items: AccordionItem[];
  defaultOpen?: number | null;
  className?: string;
}) {
  const [open, setOpen] = useState<number | null>(defaultOpen);

  return (
    <div className={`divide-y divide-line border-y border-line ${className}`}>
      {items.map((item, index) => {
        const expanded = open === index;
        return (
          <div key={item.title}>
            <h3>
              <button
                type="button"
                onClick={() => setOpen(expanded ? null : index)}
                aria-expanded={expanded}
                className="flex w-full items-center justify-between gap-4 py-4 text-left
                  text-[0.9375rem] font-semibold transition-colors hover:text-accent-2"
              >
                {item.title}
                <Plus
                  size={16}
                  className={`shrink-0 text-fg-3 transition-transform duration-400
                    ease-[cubic-bezier(0.22,1,0.36,1)] ${expanded ? "rotate-45" : ""}`}
                />
              </button>
            </h3>

            <div
              className="grid transition-[grid-template-rows] duration-400
                ease-[cubic-bezier(0.22,1,0.36,1)]"
              style={{ gridTemplateRows: expanded ? "1fr" : "0fr" }}
            >
              <div className="overflow-hidden">
                <div className="pb-5 text-[0.8125rem] leading-relaxed text-fg-2">
                  {item.content}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
