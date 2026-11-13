import type { MetadataRoute } from "next";
import { getDocs, getLessons } from "@/lib/content";
import { BOOKS } from "@/content/biblioteca";
import { STRATEGIES } from "@/content/estrategias";
import { LEARNING_PATHS } from "@/content/rutas";
import { SITE_URL } from "@/lib/site";

const BASE = SITE_URL;

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = [
    "",
    "/aprender",
    "/aprender/rutas",
    "/aprender/estrategias",
    "/aprender/estudios",
    "/aprender/biblioteca",
    "/aprender/glosario",
    "/radar",
    "/lab",
    "/lab/backtest",
    "/demo",
    "/progreso",
    "/test",
    "/sobre",
    "/privacidad",
    "/terminos",
    "/accesibilidad",
    "/fuentes",
  ].map((path) => ({
    url: `${BASE}${path}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: path === "" ? 1 : 0.7,
  }));

  const lessons = getLessons().map((lesson) => ({
    url: `${BASE}/aprender/${lesson.meta.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  const paths = LEARNING_PATHS.map((path) => ({
    url: `${BASE}/aprender/rutas/${path.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.75,
  }));

  const strategies = STRATEGIES.map((strategy) => ({
    url: `${BASE}/aprender/estrategias/${strategy.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  const estudios = getDocs("estudios").map((doc) => ({
    url: `${BASE}/aprender/estudios/${doc.meta.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  const explicadores = getDocs("radar").map((doc) => ({
    url: `${BASE}/radar/${doc.meta.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  const books = BOOKS.map((book) => ({
    url: `${BASE}/aprender/biblioteca/${book.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.5,
  }));

  return [
    ...staticRoutes,
    ...lessons,
    ...paths,
    ...strategies,
    ...estudios,
    ...explicadores,
    ...books,
  ];
}
