import { test, expect, type Page } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const PAGES = [
  "/",
  "/aprender",
  "/aprender/que-es-invertir",
  "/aprender/estrategias",
  "/lab",
  "/demo",
  "/progreso",
  "/radar",
];

async function seriousViolations(page: Page) {
  const results = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
    .analyze();
  return results.violations.filter(
    (violation) =>
      violation.impact === "serious" || violation.impact === "critical",
  );
}

test.beforeEach(async ({ context }) => {
  await context.addInitScript(() => {
    localStorage.setItem("candlevic:onboarded:v1", "1");
    localStorage.setItem(
      "candlevic:prefs:v1",
      JSON.stringify({
        state: {
          theme: "papel",
          readingSize: null,
          readingLeading: 1.75,
          readingWidth: 66,
          ambient: "off",
          motion: "reduced",
          colorBlind: false,
        },
        version: 1,
      }),
    );
  });
});

test("las rutas principales no tienen violaciones graves", async ({ page }) => {
  for (const path of PAGES) {
    await page.goto(path);
    await page.waitForTimeout(250);
    const violations = await seriousViolations(page);
    expect(
      violations.map((violation) => `${violation.id} (${path})`),
      `Violaciones en ${path}`,
    ).toEqual([]);
  }
});

test("el tema noche tampoco tiene violaciones graves", async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem(
      "candlevic:prefs:v1",
      JSON.stringify({
        state: {
          theme: "noche",
          readingSize: null,
          readingLeading: 1.75,
          readingWidth: 66,
          ambient: "off",
          motion: "reduced",
          colorBlind: false,
        },
        version: 1,
      }),
    );
  });

  for (const path of ["/", "/aprender/que-es-invertir", "/demo", "/progreso"]) {
    await page.goto(path);
    await page.waitForTimeout(250);
    const violations = await seriousViolations(page);
    expect(
      violations.map((violation) => `${violation.id} (${path})`),
      `Violaciones en ${path}`,
    ).toEqual([]);
  }
});

test("los diálogos no tienen violaciones graves", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Buscar" }).click();
  await page.getByPlaceholder(/Busca lecciones/).fill("riesgo");
  await page.waitForTimeout(300);
  expect(await seriousViolations(page)).toEqual([]);

  await page.keyboard.press("Escape");
  await page.getByRole("button", { name: "Ajustes de lectura" }).click();
  await page.waitForTimeout(250);
  expect(await seriousViolations(page)).toEqual([]);

  await page.keyboard.press("Escape");
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/aprender/que-es-invertir");
  await page.getByRole("button", { name: "Contenido de la lección" }).click();
  await page.waitForTimeout(250);
  expect(await seriousViolations(page)).toEqual([]);
});

test("el buscador atrapa el foco y lo devuelve al cerrar", async ({ page }) => {
  await page.goto("/");
  const trigger = page.getByRole("button", { name: "Buscar" });
  await trigger.click();
  const dialog = page.getByRole("dialog", { name: "Buscar en Candlevic" });
  await expect(dialog).toBeVisible();

  for (let index = 0; index < 15; index++) {
    await page.keyboard.press("Tab");
    const inside = await page.evaluate(() => {
      const panel = document.querySelector('[aria-label="Buscar en Candlevic"]');
      return panel ? panel.contains(document.activeElement) : false;
    });
    expect(inside).toBe(true);
  }

  await page.keyboard.press("Escape");
  await expect(dialog).toHaveCount(0);
  await expect(trigger).toBeFocused();
});

test("el onboarding atrapa el foco y se cierra con Escape", async ({
  page,
}) => {
  await page.addInitScript(() => localStorage.removeItem("candlevic:onboarded:v1"));
  await page.goto("/");

  const dialog = page.getByRole("dialog", { name: /Bienvenida|Aprende trading/i });
  await expect(dialog).toBeVisible();

  for (let index = 0; index < 12; index++) {
    await page.keyboard.press("Tab");
    const inside = await page.evaluate(() => {
      const panel = document.querySelector('[aria-labelledby="onboarding-title"]');
      return panel ? panel.contains(document.activeElement) : false;
    });
    expect(inside).toBe(true);
  }

  await page.keyboard.press("Escape");
  await expect(dialog).toHaveCount(0);
});

test("el índice de lección atrapa el foco en móvil", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/aprender/que-es-invertir");
  await page.getByRole("button", { name: "Contenido de la lección" }).click();

  const dialog = page.getByRole("dialog", { name: "Índice de la lección" });
  await expect(dialog).toBeVisible();

  for (let index = 0; index < 12; index++) {
    await page.keyboard.press("Tab");
    const inside = await page.evaluate(() => {
      const panel = document.querySelector('[role="dialog"][aria-label="Índice de la lección"]');
      return panel ? panel.contains(document.activeElement) : false;
    });
    expect(inside).toBe(true);
  }

  await page.keyboard.press("Escape");
  await expect(dialog).toHaveCount(0);
});
