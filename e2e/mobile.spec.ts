import { test, expect } from "@playwright/test";

test.use({
  viewport: { width: 320, height: 700 },
  isMobile: true,
  hasTouch: true,
  deviceScaleFactor: 2,
});

test.beforeEach(async ({ context }) => {
  await context.addInitScript(() => {
    localStorage.setItem("candlevic:onboarded:v1", "1");
  });
});

async function horizontalOverflow(page: import("@playwright/test").Page) {
  return page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
  );
}

test("la home cabe a 320 px y la cabecera no se corta", async ({ page }) => {
  await page.goto("/");

  const settings = page.getByRole("button", { name: "Ajustes de lectura" });
  await expect(settings).toBeVisible();
  const box = await settings.boundingBox();
  expect(box).not.toBeNull();
  expect((box?.x ?? 0) + (box?.width ?? 0)).toBeLessThanOrEqual(321);
  expect(await horizontalOverflow(page)).toBeLessThanOrEqual(1);

  await page.goto("/aprender");
  expect(await horizontalOverflow(page)).toBeLessThanOrEqual(1);
});

test("las pestañas de Aprender se ven completas sin scroll horizontal", async ({
  page,
}) => {
  await page.goto("/aprender");

  const tabs = page.locator('nav[aria-label="Secciones de Aprender"] a');
  await expect(tabs).toHaveCount(6);

  for (let index = 0; index < 6; index++) {
    const tab = tabs.nth(index);
    await expect(tab).toBeVisible();
    const box = await tab.boundingBox();
    expect(box).not.toBeNull();
    expect(box?.x ?? 0).toBeGreaterThanOrEqual(-1);
    expect((box?.x ?? 0) + (box?.width ?? 0)).toBeLessThanOrEqual(321);
  }

  await expect(
    page.getByRole("link", { name: "Biblioteca", exact: true }),
  ).toBeVisible();
});

test("la home sigue cabiendo a 390 px", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");

  expect(await horizontalOverflow(page)).toBeLessThanOrEqual(1);
  await expect(
    page.getByRole("button", { name: "Ajustes de lectura" }),
  ).toBeVisible();
});
