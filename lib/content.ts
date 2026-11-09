import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { z } from "zod";
import { MODULES, type ModuleId, moduleIndex } from "@/content/modulos";

const CONTENT_DIR = path.join(process.cwd(), "content");

const baseSchema = z.object({
  title: z.string(),
  summary: z.string().default(""),
  minutes: z.number().default(4),
  level: z.enum(["principiante", "intermedio", "avanzado"]).default("principiante"),
  tags: z.array(z.string()).default([]),
});

const lessonSchema = baseSchema.extend({
  module: z.string(),
  order: z.number().default(1),
  objectives: z.array(z.string()).default([]),
  dataset: z.string().optional(),
  related: z.array(z.string()).default([]),
});

const docSchema = baseSchema.extend({
  kind: z.enum(["caso", "evidencia", "explicador"]).default("explicador"),
  date: z.string().optional(),
  source: z.string().optional(),
  related: z.array(z.string()).default([]),
  keywords: z.array(z.string()).default([]),
});

export type LessonMeta = z.infer<typeof lessonSchema> & {
  slug: string;
  module: ModuleId;
};

export type DocMeta = z.infer<typeof docSchema> & { slug: string };

export type Lesson = { meta: LessonMeta; content: string };
export type Doc = { meta: DocMeta; content: string };

function readDir(dir: string) {
  const full = path.join(CONTENT_DIR, dir);
  if (!fs.existsSync(full)) return [];
  return fs
    .readdirSync(full)
    .filter((f) => f.endsWith(".mdx") || f.endsWith(".md"))
    .map((file) => {
      const raw = fs.readFileSync(path.join(full, file), "utf8");
      const parsed = matter(raw);
      return {
        slug: file.replace(/\.mdx?$/, ""),
        data: parsed.data,
        content: parsed.content,
      };
    });
}

let lessonsCache: Lesson[] | null = null;

export function getLessons(): Lesson[] {
  if (lessonsCache) return lessonsCache;

  const lessons = readDir("lecciones").map(({ slug, data, content }) => {
    const parsed = lessonSchema.safeParse(data);
    if (!parsed.success) {
      throw new Error(
        `Frontmatter inválido en la lección "${slug}": ${parsed.error.message}`,
      );
    }
    return {
      meta: { ...parsed.data, slug, module: parsed.data.module as ModuleId },
      content,
    };
  });

  lessons.sort((a, b) => {
    const moduleDiff = moduleIndex(a.meta.module) - moduleIndex(b.meta.module);
    if (moduleDiff !== 0) return moduleDiff;
    return a.meta.order - b.meta.order;
  });

  lessonsCache = lessons;
  return lessons;
}

export function getLesson(slug: string): Lesson | undefined {
  return getLessons().find((l) => l.meta.slug === slug);
}

export function getLessonNeighbours(slug: string) {
  const lessons = getLessons();
  const index = lessons.findIndex((l) => l.meta.slug === slug);
  return {
    prev: index > 0 ? lessons[index - 1] : null,
    next: index >= 0 && index < lessons.length - 1 ? lessons[index + 1] : null,
    index,
    total: lessons.length,
  };
}

export type ModuleWithLessons = {
  module: (typeof MODULES)[number];
  lessons: Lesson[];
};

export function getModulesWithLessons(): ModuleWithLessons[] {
  const lessons = getLessons();
  return MODULES.map((module) => ({
    module,
    lessons: lessons.filter((l) => l.meta.module === module.id),
  }));
}

export function getDocs(dir: "estudios" | "radar"): Doc[] {
  return readDir(dir)
    .map(({ slug, data, content }) => {
      const parsed = docSchema.safeParse(data);
      if (!parsed.success) {
        throw new Error(
          `Frontmatter inválido en "${dir}/${slug}": ${parsed.error.message}`,
        );
      }
      return { meta: { ...parsed.data, slug }, content };
    })
    .sort((a, b) => {
      if (a.meta.date && b.meta.date) {
        return b.meta.date.localeCompare(a.meta.date);
      }
      return a.meta.title.localeCompare(b.meta.title);
    });
}

export function getDoc(dir: "estudios" | "radar", slug: string) {
  return getDocs(dir).find((d) => d.meta.slug === slug);
}

export function getAllSlugs(dir: "lecciones" | "estudios" | "radar") {
  return readDir(dir).map((d) => d.slug);
}
