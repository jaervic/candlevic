"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowDown,
  ArrowUp,
  BookOpen,
  CornerDownLeft,
  FileText,
  GraduationCap,
  Library,
  Loader2,
  Radio,
  Search,
  X,
} from "lucide-react";
import { useUI } from "@/lib/ui";
import {
  TYPE_LABELS,
  type SearchItem,
  type SearchType,
} from "@/lib/search-types";
import { searchItems } from "@/lib/search-utils";
import { cn } from "@/lib/utils";
import { track } from "@/lib/analytics";

const TYPE_ICONS: Record<SearchType, typeof Search> = {
  leccion: FileText,
  glosario: BookOpen,
  libro: Library,
  estudio: GraduationCap,
  explicador: Radio,
  pagina: Search,
};

const SUGGESTIONS = ["soporte", "RSI", "riesgo", "halving", "Murphy", "LUNA"];

function highlight(text: string, query: string) {
  const q = query.trim();
  if (!q) return text;
  const escaped = q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const parts = text.split(new RegExp(`(${escaped})`, "ig"));
  return parts.map((part, index) =>
    part.toLowerCase() === q.toLowerCase() ? (
      <mark key={index} className="rounded bg-accent/25 px-0.5 text-fg">
        {part}
      </mark>
    ) : (
      part
    ),
  );
}

export function SearchDialog() {
  const open = useUI((s) => s.searchOpen);
  const openSearch = useUI((s) => s.openSearch);
  const close = useUI((s) => s.closeSearch);
  const router = useRouter();

  const [query, setQuery] = useState("");
  const [items, setItems] = useState<SearchItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [active, setActive] = useState(0);

  const indexRef = useRef<SearchItem[] | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const results = useMemo(() => searchItems(items, query), [items, query]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        openSearch();
      }
      if (event.key === "Escape" && open) close();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, openSearch, close]);

  useEffect(() => {
    if (!open) return;
    setQuery("");
    setActive(0);
    setError(null);
    track("search_open");
    const timer = window.setTimeout(() => inputRef.current?.focus(), 40);

    if (indexRef.current) {
      setItems(indexRef.current);
    } else {
      setLoading(true);
      fetch("/api/search-index")
        .then((res) => {
          if (!res.ok) throw new Error("bad response");
          return res.json() as Promise<{ items: SearchItem[] }>;
        })
        .then((data) => {
          indexRef.current = data.items;
          setItems(data.items);
        })
        .catch(() =>
          setError("No se pudo cargar el buscador. Inténtalo de nuevo."),
        )
        .finally(() => setLoading(false));
    }

    return () => window.clearTimeout(timer);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    setActive(0);
  }, [query]);

  useEffect(() => {
    if (active >= results.length) {
      setActive(Math.max(0, results.length - 1));
    }
  }, [results.length, active]);

  if (!open) return null;

  function go(item?: SearchItem) {
    if (!item) return;
    track("search_result", { query, href: item.href });
    close();
    router.push(item.href);
  }

  function onInputKey(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      if (results.length > 0) {
        setActive((value) => Math.min(value + 1, results.length - 1));
      }
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActive((value) => Math.max(value - 1, 0));
    } else if (event.key === "Enter") {
      event.preventDefault();
      go(results[active]);
    }
  }

  return (
    <div
      className="fixed inset-0 z-[70] flex items-start justify-center bg-black/60 backdrop-blur-sm sm:p-6 sm:pt-24"
      onClick={close}
      role="presentation"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Buscar en Candlevic"
        className="flex h-[100dvh] w-full max-w-xl flex-col overflow-hidden border-line bg-surface shadow-2xl sm:h-auto sm:max-h-[70dvh] sm:rounded-2xl sm:border"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-center gap-2 border-b border-line px-4 py-3">
          <Search className="h-4 w-4 shrink-0 text-faint" />
          <input
            ref={inputRef}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            onKeyDown={onInputKey}
            placeholder="Busca lecciones, términos, libros…"
            className="h-8 flex-1 bg-transparent text-[14px] text-fg outline-none placeholder:text-faint"
            role="combobox"
            aria-autocomplete="list"
            aria-expanded={results.length > 0}
            aria-controls="search-results"
            aria-activedescendant={
              results[active] ? `search-option-${active}` : undefined
            }
          />
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin text-faint" />
          ) : query ? (
            <button
              type="button"
              onClick={() => setQuery("")}
              className="rounded-lg p-1.5 text-faint hover:bg-surface-2 hover:text-fg"
              aria-label="Limpiar búsqueda"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          ) : (
            <kbd className="hidden rounded border border-line px-1.5 py-0.5 text-[10px] text-faint sm:inline">
              esc
            </kbd>
          )}
        </div>

        <div
          id="search-results"
          role="listbox"
          className="flex-1 overflow-y-auto p-2 sm:max-h-[50dvh]"
        >
          {loading && (
            <div className="space-y-2 p-2">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="h-14 animate-pulse rounded-xl bg-surface-2"
                />
              ))}
            </div>
          )}

          {!loading && error && (
            <p className="px-3 py-8 text-center text-[12px] text-muted">
              {error}
            </p>
          )}

          {!loading && !error && !query.trim() && (
            <div className="p-3">
              <p className="text-[10px] uppercase tracking-wider text-faint">
                Prueba con
              </p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {SUGGESTIONS.map((suggestion) => (
                  <button
                    key={suggestion}
                    type="button"
                    onClick={() => setQuery(suggestion)}
                    className="rounded-full border border-line bg-surface-2/60 px-2.5 py-1 text-[11px] text-muted transition-colors hover:border-line-strong hover:text-fg"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
              <p className="mt-4 text-[11px] leading-relaxed text-faint">
                Busca en lecciones, glosario, libros, estudios, explicadores y
                páginas. También puedes usar{" "}
                <kbd className="rounded border border-line px-1">⌘K</kbd>.
              </p>
            </div>
          )}

          {!loading &&
            !error &&
            query.trim() &&
            results.length === 0 && (
              <p className="px-3 py-8 text-center text-[12px] text-muted">
                Sin resultados para “{query}”. Prueba con otra palabra.
              </p>
            )}

          {results.map((item, index) => {
            const Icon = TYPE_ICONS[item.type];
            return (
              <button
                key={item.id}
                id={`search-option-${index}`}
                type="button"
                role="option"
                aria-selected={index === active}
                onMouseEnter={() => setActive(index)}
                onClick={() => go(item)}
                className={cn(
                  "flex w-full items-start gap-3 rounded-xl px-3 py-2.5 text-left transition-colors",
                  index === active
                    ? "bg-surface-2"
                    : "hover:bg-surface-2/60",
                )}
              >
                <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-line bg-surface-2 text-muted">
                  <Icon className="h-3.5 w-3.5" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="flex items-center gap-2">
                    <span className="truncate text-[13px] font-medium">
                      {highlight(item.title, query)}
                    </span>
                    <span className="shrink-0 rounded-full border border-line px-1.5 py-0.5 text-[9px] text-faint">
                      {TYPE_LABELS[item.type]}
                    </span>
                  </span>
                  {item.subtitle && (
                    <span className="mt-0.5 block truncate text-[10.5px] text-faint">
                      {item.subtitle}
                    </span>
                  )}
                  <span className="mt-0.5 line-clamp-1 block text-[11px] text-muted">
                    {item.summary}
                  </span>
                </span>
              </button>
            );
          })}
        </div>

        <div className="hidden items-center gap-3 border-t border-line px-4 py-2 text-[10px] text-faint sm:flex">
          <span className="inline-flex items-center gap-1">
            <ArrowUp className="h-3 w-3" />
            <ArrowDown className="h-3 w-3" /> navegar
          </span>
          <span className="inline-flex items-center gap-1">
            <CornerDownLeft className="h-3 w-3" /> abrir
          </span>
          <span>esc cerrar</span>
          <span className="ml-auto">⌘K</span>
        </div>
      </div>
    </div>
  );
}
