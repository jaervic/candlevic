import { test, expect } from "@playwright/test";

test.beforeEach(async ({ context }) => {
  await context.addInitScript(() => {
    localStorage.setItem("candlevic:onboarded:v1", "1");
  });
});

test("muestra las rutas guiadas y abre la primera lección", async ({ page }) => {
  await page.goto("/aprender/rutas");

  await expect(
    page.getByRole("heading", { name: "Rutas guiadas", exact: true }),
  ).toBeVisible();
  await expect(page.locator("article")).toHaveCount(4);

  await page
    .locator('a[href="/aprender/rutas/desde-cero"]')
    .first()
    .click();

  await expect(
    page.getByRole("heading", { name: "Empieza desde cero", exact: true }),
  ).toBeVisible();
  await expect(page.locator("ol li")).toHaveCount(9);
  await expect(page.getByRole("link", { name: /Empezar/ }).first()).toBeVisible();

  await page.getByRole("link", { name: /Empezar/ }).first().click();
  await expect(
    page.getByRole("heading", {
      name: "¿Invertir, especular o apostar?",
      exact: true,
    }),
  ).toBeVisible();
});

test("la pestaña Rutas aparece en Aprender", async ({ page }) => {
  await page.goto("/aprender");
  await expect(page.getByRole("link", { name: "Rutas", exact: true })).toHaveAttribute(
    "href",
    "/aprender/rutas",
  );
});
