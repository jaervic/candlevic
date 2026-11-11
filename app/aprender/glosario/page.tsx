"use client";

import { useEffect, useMemo, useState } from "react";
import { Search } from "lucide-react";
import {
  GLOSSARY,
  GLOSSARY_CATEGORIES,
  type GlossaryCategory,
} from "@/content/glosario";
import { LearnTabs } from "@/components/learn/learn-tabs";

export default function GlosarioPage() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<GlossaryCategory | "todas">("todas");

  useEffect(() => {
    const value = new URLSearchParams(window.location.search).get("q");
    if (value) setQuery(value);
  }, []);

  const results = useMemo(() => {
    const q = query
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .trim();

    return GLOSSARY.filter((term) => {
      if (category !== "todas" && term.category !== category) return false;
      if (!q) return true;
      const haystack = `${term.term} ${term.definition} ${(term.aliases ?? []).join(" ")}`
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");
      return haystack.includes(q);
    }).sort((a, b) => a.term.localeCompare(b.term, "es"));
  }, [query, category]);

  return (
    <div className="space-y-5">
      <header>
        <p className="text-[10px] uppercase tracking-[0.16em] text-accent">
          Aprender
        </p>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight">Glosario</h1>
        <p className="mt-1 max-w-xl text-[13px] leading-relaxed text-muted">
          {GLOSSARY.length} términos explicados sin jerga innecesaria.
        </p>
      </header>

      <LearnTabs active="/aprender/glosario" />

      <div className="sticky top-14 z-20 space-y-2 bg-bg/90 py-2 backdrop-blur">
        <label className="flex items-center gap-2 rounded-xl border border-line bg-surface px-3">
          <Search className="h-4 w-4 text-faint" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar: soporte, RSI, funding…"
            className="h-10 w-full bg-transparent text-[13px] text-fg outline-none placeholder:text-faint"
            aria-label="Buscar en el glosario"
          />
        </label>

        <div className="no-scrollbar flex gap-1.5 overflow-x-auto pb-1">
          <button
            onClick={() => setCategory("todas")}
            className={`shrink-0 rounded-full border px-2.5 py-1 text-[11px] transition-colors ${
              category === "todas"
                ? "border-accent/30 bg-accent/10 text-accent"
                : "border-line bg-surface text-muted hover:text-fg"
            }`}
          >
            Todas
          </button>
          {GLOSSARY_CATEGORIES.map((c) => (
            <button
              key={c.id}
              onClick={() => setCategory(c.id)}
              className={`shrink-0 rounded-full border px-2.5 py-1 text-[11px] transition-colors ${
                category === c.id
                  ? "border-accent/30 bg-accent/10 text-accent"
                  : "border-line bg-surface text-muted hover:text-fg"
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-line bg-surface">
        {results.length === 0 && (
          <p className="px-4 py-6 text-center text-[12px] text-faint">
            No hay resultados para “{query}”.
          </p>
        )}
        {results.map((term, i) => (
          <div
            key={term.term}
            className={`px-4 py-3 ${i > 0 ? "border-t border-line/70" : ""}`}
          >
            <div className="flex items-baseline justify-between gap-2">
              <h2 className="text-[13.5px] font-semibold">{term.term}</h2>
              <span className="shrink-0 text-[9px] uppercase tracking-wider text-faint">
                {GLOSSARY_CATEGORIES.find((c) => c.id === term.category)?.label}
              </span>
            </div>
            <p className="mt-1 text-[12.5px] leading-relaxed text-muted">
              {term.definition}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
