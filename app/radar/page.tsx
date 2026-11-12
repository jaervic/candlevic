import Link from "next/link";
import {
  ArrowUpRight,
  CalendarDays,
  ExternalLink,
  Info,
  Newspaper,
  ShieldAlert,
} from "lucide-react";
import { getNews, type NewsItem } from "@/lib/news";
import { getDocs } from "@/lib/content";
import { MARKET_EVENTS } from "@/content/eventos";
import { Badge } from "@/components/ui/badge";
import { relativeTime } from "@/lib/utils";

export const revalidate = 900;

export const metadata = {
  alternates: { canonical: "/radar" },
  title: "Radar de mercado",
  description:
    "Titulares de cripto, macro y acciones con contexto educativo. Sin señales ni predicciones.",
};

const TABS = [
  { id: "noticias", label: "Noticias", icon: Newspaper },
  { id: "eventos", label: "Eventos", icon: CalendarDays },
  { id: "explicadores", label: "Explicadores", icon: Info },
];

function tagTone(tag: string) {
  if (["BTC", "ETH", "SOL"].includes(tag)) return "accent" as const;
  if (["Fed", "Inflación", "Dólar"].includes(tag)) return "info" as const;
  if (["Seguridad", "Regulación"].includes(tag)) return "down" as const;
  return "default" as const;
}

function NewsCard({
  item,
  explainers,
}: {
  item: NewsItem;
  explainers: { slug: string; title: string; tags: string[]; keywords: string[] }[];
}) {
  const text = `${item.title} ${item.excerpt}`.toLowerCase();
  let match: (typeof explainers)[number] | undefined;
  let bestScore = 0;
  for (const explainer of explainers) {
    const score = explainer.keywords.reduce(
      (acc, keyword) =>
        text.includes(keyword.toLowerCase()) ? acc + keyword.length : acc,
      0,
    );
    if (score > bestScore) {
      bestScore = score;
      match = explainer;
    }
  }
  if (bestScore < 4) match = undefined;

  return (
    <article className="border-t border-line/70 px-4 py-3.5 first:border-t-0">
      <div className="flex flex-wrap items-center gap-1.5">
        <span className="text-[10px] font-medium uppercase tracking-wider text-accent">
          {item.source}
        </span>
        <span className="text-[10px] text-faint">· {relativeTime(item.publishedAt)}</span>
        {item.tags.map((tag) => (
          <Badge key={tag} tone={tagTone(tag)}>
            {tag}
          </Badge>
        ))}
      </div>

      <a
        href={item.link}
        target="_blank"
        rel="noopener noreferrer"
        className="group mt-1.5 flex items-start gap-1.5"
      >
        <h3 className="text-[13.5px] font-medium leading-snug text-fg group-hover:text-accent">
          {item.title}
        </h3>
        <ArrowUpRight className="mt-0.5 h-3.5 w-3.5 shrink-0 text-faint group-hover:text-accent" />
      </a>

      {item.excerpt && (
        <p className="mt-1 line-clamp-2 text-[11.5px] leading-relaxed text-muted">
          {item.excerpt}
        </p>
      )}

      {match && (
        <Link
          href={`/radar/${match.slug}`}
          className="mt-2 inline-flex items-center gap-1 rounded-md bg-surface-2 px-2 py-1 text-[10.5px] text-muted transition-colors hover:text-fg"
        >
          <Info className="h-3 w-3 text-info" />
          ¿Qué significa? {match.title}
        </Link>
      )}
    </article>
  );
}

export default async function RadarPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) {
  const { tab = "noticias" } = await searchParams;
  const explainers = getDocs("radar");
  const news = tab === "noticias" ? await getNews() : null;

  return (
    <div className="space-y-5">
      <header>
        <p className="text-[10px] uppercase tracking-[0.16em] text-accent">
          Contexto
        </p>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight">Radar</h1>
        <p className="mt-1 max-w-xl text-[13px] leading-relaxed text-muted">
          Lo que está pasando, con explicaciones para entenderlo. Las noticias no
          predicen el precio.
        </p>
      </header>

      <div className="flex items-start gap-2 rounded-xl border border-accent/20 bg-accent/8 p-3">
        <ShieldAlert className="mt-0.5 h-3.5 w-3.5 shrink-0 text-accent" />
        <p className="text-[11px] leading-relaxed text-muted">
          <span className="font-medium text-fg">Contexto, no señales.</span> Un
          titular no es una estrategia. Antes de operar, comprueba tu plan y tu
          riesgo.
        </p>
      </div>

      <nav className="no-scrollbar -mx-1 flex gap-1 overflow-x-auto px-1 pb-1">
        {TABS.map((t) => {
          const active = tab === t.id;
          return (
            <Link
              key={t.id}
              href={`/radar?tab=${t.id}`}
              className={
                active
                  ? "inline-flex shrink-0 items-center gap-1.5 rounded-lg bg-surface-2 px-3 py-1.5 text-[12px] font-medium text-fg"
                  : "inline-flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-1.5 text-[12px] text-muted transition-colors hover:bg-surface-2/60 hover:text-fg"
              }
            >
              <t.icon className="h-3.5 w-3.5" />
              {t.label}
            </Link>
          );
        })}
      </nav>

      {tab === "noticias" && news && (
        <section className="overflow-hidden rounded-2xl border border-line bg-surface">
          <div className="flex items-center justify-between border-b border-line px-4 py-2.5">
            <p className="text-[11px] font-medium text-muted">
              Últimos titulares
            </p>
            <p className="text-[10px] text-faint">
              Actualizado {relativeTime(news.updatedAt)}
            </p>
          </div>

          {news.degraded ? (
            <div className="px-4 py-8 text-center">
              <p className="text-[13px] text-muted">
                No se pudieron cargar las noticias ahora mismo.
              </p>
              <p className="mt-1 text-[11px] text-faint">
                Las fuentes externas no respondieron. Prueba a recargar en unos
                minutos; el resto de la app funciona sin conexión.
              </p>
            </div>
          ) : (
            news.items.map((item) => (
              <NewsCard
                key={item.id}
                item={item}
                explainers={explainers.map((e) => ({
                  slug: e.meta.slug,
                  title: e.meta.title,
                  tags: e.meta.tags,
                  keywords: e.meta.keywords,
                }))}
              />
            ))
          )}
        </section>
      )}

      {tab === "eventos" && (
        <section className="space-y-2.5">
          <div className="rounded-xl border border-line bg-surface p-3.5 text-[11.5px] leading-relaxed text-muted">
            No inventamos fechas: aquí tienes los tipos de evento que mueven el
            mercado y dónde consultar el calendario oficial de cada uno.
          </div>
          {MARKET_EVENTS.map((event) => (
            <div
              key={event.name}
              className="rounded-2xl border border-line bg-surface p-4"
            >
              <div className="flex items-start justify-between gap-2">
                <h3 className="text-[13.5px] font-medium leading-snug">
                  {event.name}
                </h3>
                <Badge tone={event.impact === "alto" ? "down" : "default"}>
                  impacto {event.impact}
                </Badge>
              </div>
              <p className="mt-0.5 text-[10.5px] uppercase tracking-wider text-faint">
                {event.cadence}
              </p>
              <p className="mt-2 text-[12px] leading-relaxed text-muted">
                {event.what}
              </p>
              <p className="mt-1.5 text-[12px] leading-relaxed text-fg/85">
                <span className="font-medium text-accent">Por qué importa: </span>
                {event.why}
              </p>
              <a
                href={event.link}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-flex items-center gap-1 text-[11px] text-muted underline-offset-4 hover:text-fg hover:underline"
              >
                Calendario oficial <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          ))}
        </section>
      )}

      {tab === "explicadores" && (
        <section className="grid gap-2.5 sm:grid-cols-2">
          {explainers.map((doc) => (
            <Link
              key={doc.meta.slug}
              href={`/radar/${doc.meta.slug}`}
              className="rounded-2xl border border-line bg-surface p-4 transition-colors hover:border-line-strong hover:bg-surface-2/60"
            >
              <div className="flex items-center gap-1.5">
                {doc.meta.tags.slice(0, 2).map((tag) => (
                  <Badge key={tag} tone="accent">
                    {tag}
                  </Badge>
                ))}
                <span className="text-[10px] text-faint">{doc.meta.minutes} min</span>
              </div>
              <p className="mt-2 text-[13.5px] font-medium leading-snug">
                {doc.meta.title}
              </p>
              <p className="mt-1 text-[11.5px] leading-relaxed text-muted">
                {doc.meta.summary}
              </p>
            </Link>
          ))}
        </section>
      )}
    </div>
  );
}
