import { getDocs, getLessons } from "./content";
import type { SearchItem } from "./search-types";
import { GLOSSARY, GLOSSARY_CATEGORIES } from "@/content/glosario";
import { BOOKS } from "@/content/biblioteca";
import { MODULE_MAP } from "@/content/modulos";
import { STRATEGIES } from "@/content/estrategias";

export function buildSearchIndex(): SearchItem[] {
  const items: SearchItem[] = [];

  for (const lesson of getLessons()) {
    const module = MODULE_MAP[lesson.meta.module];
    items.push({
      id: `leccion:${lesson.meta.slug}`,
      type: "leccion",
      title: lesson.meta.title,
      subtitle: module?.title,
      summary: lesson.meta.summary,
      href: `/aprender/${lesson.meta.slug}`,
      keywords: [
        ...lesson.meta.tags,
        ...lesson.meta.objectives,
        module?.title ?? "",
        lesson.meta.level,
      ].filter(Boolean),
    });
  }

  for (const term of GLOSSARY) {
    const category =
      GLOSSARY_CATEGORIES.find((c) => c.id === term.category)?.label ?? "";
    items.push({
      id: `glosario:${term.term}`,
      type: "glosario",
      title: term.term,
      subtitle: category,
      summary: term.definition,
      href: `/aprender/glosario?q=${encodeURIComponent(term.term)}`,
      keywords: [...(term.aliases ?? []), category].filter(Boolean),
    });
  }

  for (const strategy of STRATEGIES) {
    items.push({
      id: `estrategia:${strategy.slug}`,
      type: "estrategia",
      title: strategy.name,
      subtitle: `${strategy.familyLabel} · ${strategy.difficulty}`,
      summary: strategy.summary,
      href: `/aprender/estrategias/${strategy.slug}`,
      keywords: [
        strategy.familyLabel,
        strategy.difficulty,
        strategy.horizon,
        ...strategy.context,
        ...strategy.related,
      ],
    });
  }

  for (const book of BOOKS) {
    items.push({
      id: `libro:${book.slug}`,
      type: "libro",
      title: book.title,
      subtitle: `${book.author} · ${book.year}`,
      summary: book.idea,
      href: `/aprender/biblioteca/${book.slug}`,
      keywords: [book.author, ...book.keys, ...book.modules].filter(Boolean),
    });
  }

  for (const doc of getDocs("estudios")) {
    items.push({
      id: `estudio:${doc.meta.slug}`,
      type: "estudio",
      title: doc.meta.title,
      subtitle:
        doc.meta.kind === "caso" ? "Caso histórico" : "Evidencia científica",
      summary: doc.meta.summary,
      href: `/aprender/estudios/${doc.meta.slug}`,
      keywords: [...(doc.meta.source ? [doc.meta.source] : []), ...doc.meta.tags],
    });
  }

  for (const doc of getDocs("radar")) {
    items.push({
      id: `explicador:${doc.meta.slug}`,
      type: "explicador",
      title: doc.meta.title,
      subtitle: doc.meta.tags.join(" · "),
      summary: doc.meta.summary,
      href: `/radar/${doc.meta.slug}`,
      keywords: [...doc.meta.keywords, ...doc.meta.tags],
    });
  }

  const pages: Omit<SearchItem, "id" | "type">[] = [
    {
      title: "Laboratorio",
      summary: "Practica con gráficos, indicadores y replay de velas.",
      href: "/lab",
      keywords: ["gráficos", "indicadores", "replay", "práctica"],
    },
    {
      title: "Radar de mercado",
      summary: "Noticias, eventos y explicadores con contexto.",
      href: "/radar",
      keywords: ["noticias", "eventos", "mercado"],
    },
    {
      title: "Progreso",
      summary: "Tu avance, logros, dominio y respaldo.",
      href: "/progreso",
      keywords: ["progreso", "logros", "respaldo", "código"],
    },
    {
      title: "Backtesting didáctico",
      summary: "Compara comprar y mantener, cruce de medias y DCA.",
      href: "/lab/backtest",
      keywords: ["backtest", "estrategias", "dca", "medias", "equity"],
    },
    {
      title: "Trading demo",
      summary: "Practica con 10.000 $ virtuales, sin órdenes reales.",
      href: "/demo",
      keywords: ["demo", "simulador", "paper trading", "cartera", "práctica"],
    },
    {
      title: "¿Qué trader eres?",
      summary: "Test de perfil con plan de 30 días.",
      href: "/test",
      keywords: ["test", "perfil", "estilo"],
    },
    {
      title: "Biblioteca",
      summary: "Fichas de los libros clave del trading.",
      href: "/aprender/biblioteca",
      keywords: ["libros", "biblioteca"],
    },
    {
      title: "Glosario",
      summary: "Términos explicados sin jerga.",
      href: "/aprender/glosario",
      keywords: ["glosario", "términos"],
    },
    {
      title: "Sobre Candlevic",
      summary: "Qué es, cómo se crea el contenido y por qué es independiente.",
      href: "/sobre",
      keywords: ["sobre", "proyecto", "editorial", "contacto"],
    },
    {
      title: "Privacidad",
      summary: "Qué datos se guardan y cómo borrarlos.",
      href: "/privacidad",
      keywords: ["privacidad", "datos", "localstorage", "respaldo"],
    },
    {
      title: "Términos de uso",
      summary: "Condiciones, riesgo y responsabilidad.",
      href: "/terminos",
      keywords: ["términos", "legal", "riesgo", "responsabilidad"],
    },
    {
      title: "Accesibilidad",
      summary: "Temas, teclado, movimiento reducido y gráficos accesibles.",
      href: "/accesibilidad",
      keywords: ["accesibilidad", "wcag", "teclado", "daltónico"],
    },
    {
      title: "Fuentes y atribuciones",
      summary: "Datos, medios, libros, estudios y licencias.",
      href: "/fuentes",
      keywords: ["fuentes", "datos", "licencias", "atribución"],
    },
    {
      title: "Estudios",
      summary: "Casos históricos y evidencia científica.",
      href: "/aprender/estudios",
      keywords: ["casos", "evidencia", "estudios"],
    },
  ];

  for (const page of pages) {
    items.push({ ...page, id: `pagina:${page.href}`, type: "pagina" });
  }

  return items;
}
