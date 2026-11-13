import { test, expect } from "@playwright/test";

test.beforeEach(async ({ context }) => {
  await context.addInitScript(() => {
    localStorage.setItem("candlevic:onboarded:v1", "1");
  });
});

test("filtra estrategias y abre una ficha con su backtest", async ({ page }) => {
  await page.goto("/aprender/estrategias");

  await expect(
    page.getByRole("heading", { name: "Estrategias", exact: true }),
  ).toBeVisible();

  await page.getByRole("button", { name: "Tendencia", exact: true }).click();
  await expect(
    page.locator('a[href="/aprender/estrategias/cruce-de-medias"]').first(),
  ).toBeVisible();
  await expect(
    page.locator('a[href="/aprender/estrategias/ruptura-donchian"]'),
  ).toHaveCount(0);

  await page
    .locator('a[href="/aprender/estrategias/cruce-de-medias"]')
    .first()
    .click();
  await expect(
    page.getByRole("heading", { name: "Cruce de medias", exact: true }),
  ).toBeVisible();
  await expect(page.getByText("Compruébalo")).toBeVisible();
  await expect(page.locator('a[href*="/lab/backtest"]')).toHaveCount(1);
});

test("el enlace profundo carga el backtest con la estrategia elegida", async ({
  page,
}) => {
  await page.goto("/lab/backtest?strategy=donchian&dataset=btc-1d");

  await expect(
    page.getByRole("button", { name: "Ruptura Donchian 20/10" }),
  ).toHaveAttribute("aria-pressed", "true", { timeout: 15_000 });
  await expect(page.locator("tbody tr")).toHaveCount(2, { timeout: 15_000 });
  await expect(
    page.getByRole("columnheader", { name: "vs. hold" }),
  ).toBeVisible();
  await expect(page.getByText(/Muestra corta|Parámetros de las estrategias/).first()).toBeVisible();
});
