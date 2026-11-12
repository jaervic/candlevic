import type { MetadataRoute } from "next";
import { getDocs, getLessons } from "@/lib/content";
import { BOOKS } from "@/content/biblioteca";

const BASE = "https://candlevic.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = [
    "",
    "/aprender",
    "/aprender/estudios",
    "/aprender/biblioteca",
    "/aprender/glosario",
    "/radar",
    "/lab",
    "/lab/backtest",
    "/demo",
    "/progreso",
    "/test",
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

  return [...staticRoutes, ...lessons, ...estudios, ...explicadores, ...books];
}
