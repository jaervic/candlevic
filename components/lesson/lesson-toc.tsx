"use client";

import { useEffect, useRef, useState } from "react";
import { List, X } from "lucide-react";
import type { Heading } from "@/lib/content";
import { useUI } from "@/lib/ui";
import { cn } from "@/lib/utils";

export function LessonToc({ headings }: { headings: Heading[] }) {
  const tocOpen = useUI((s) => s.tocOpen);
  const closeToc = useUI((s) => s.closeToc);
  const closeRef = useRef<HTMLButtonElement>(null);
  const [active, setActive] = useState(headings[0]?.id ?? "");

  useEffect(() => {
    if (headings.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort(
            (a, b) =>
              a.boundingClientRect.top - b.boundingClientRect.top,
          );
        if (visible.length > 0) setActive(visible[0].target.id);
      },
      { rootMargin: "-88px 0px -62% 0px", threshold: 0 },
    );

    for (const heading of headings) {
      const element = document.getElementById(heading.id);
      if (element) observer.observe(element);
    }

    return () => observer.disconnect();
  }, [headings]);

  useEffect(() => {
    if (!tocOpen) return;
    const timer = window.setTimeout(() => closeRef.current?.focus(), 40);
    document.body.style.overflow = "hidden";
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeToc();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [tocOpen, closeToc]);

  if (headings.length === 0) return null;

  function go(id: string) {
    closeToc();
    window.setTimeout(() => {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "start" });
        window.history.replaceState(null, "", `#${id}`);
      }
    }, 60);
  }

  return (
    <>
      <aside className="sticky top-20 hidden max-h-[calc(100dvh-6rem)] overflow-y-auto pr-2 lg:block">
        <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-faint">
          En esta lección
        </p>
        <nav aria-label="Contenido de la lección">
          <ul className="border-l border-line">
            {headings.map((heading) => (
              <li key={heading.id}>
                <a
                  href={`#${heading.id}`}
                  onClick={(event) => {
                    event.preventDefault();
                    go(heading.id);
                  }}
                  className={cn(
                    "block border-l-2 py-1.5 text-[11.5px] leading-snug transition-colors",
                    heading.level === 2 ? "pl-3" : "pl-5",
                    active === heading.id
                      ? "border-accent text-fg"
                      : "border-transparent text-muted hover:text-fg",
                  )}
                >
                  {heading.text}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      {tocOpen && (
        <div
          className="fixed inset-0 z-[60] flex items-end justify-center bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={closeToc}
          role="presentation"
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Contenido de la lección"
            className="animate-fade-up max-h-[80dvh] w-full overflow-y-auto rounded-t-3xl border border-line bg-surface p-5 shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mb-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <List className="h-4 w-4 text-accent" />
                <h2 className="text-sm font-semibold">En esta lección</h2>
              </div>
              <button
                ref={closeRef}
                type="button"
                onClick={closeToc}
                aria-label="Cerrar contenido"
                className="rounded-lg p-2 text-muted transition-colors hover:bg-surface-2 hover:text-fg"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <ul className="space-y-1">
              {headings.map((heading) => (
                <li key={heading.id}>
                  <button
                    type="button"
                    onClick={() => go(heading.id)}
                    className={cn(
                      "w-full rounded-lg px-2 py-2 text-left text-[13px] leading-snug transition-colors hover:bg-surface-2",
                      heading.level === 3 && "pl-6",
                      active === heading.id
                        ? "bg-accent/10 text-accent"
                        : "text-fg/90",
                    )}
                  >
                    {heading.text}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </>
  );
}
