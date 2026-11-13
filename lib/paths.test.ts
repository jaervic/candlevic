import { describe, expect, it } from "vitest";
import { getLessons } from "./content";
import { LEARNING_PATHS, getLearningPath } from "../content/rutas";

const lessonSlugs = new Set(getLessons().map((lesson) => lesson.meta.slug));

describe("rutas guiadas", () => {
  it("tiene slugs únicos", () => {
    const slugs = LEARNING_PATHS.map((path) => path.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it("solo referencia lecciones que existen", () => {
    for (const path of LEARNING_PATHS) {
      for (const slug of path.lessons) {
        expect(lessonSlugs.has(slug), `${path.slug} → ${slug}`).toBe(true);
      }
    }
  });

  it("no repite lecciones dentro de una ruta", () => {
    for (const path of LEARNING_PATHS) {
      expect(new Set(path.lessons).size).toBe(path.lessons.length);
    }
  });

  it("tiene al menos cinco pasos por ruta", () => {
    for (const path of LEARNING_PATHS) {
      expect(path.lessons.length).toBeGreaterThanOrEqual(5);
    }
  });

  it("resuelve una ruta por slug", () => {
    expect(getLearningPath("riesgo")?.name).toBe("Gestión de riesgo");
    expect(getLearningPath("no-existe")).toBeUndefined();
  });
});
