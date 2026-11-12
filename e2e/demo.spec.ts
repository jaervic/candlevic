import { test, expect } from "@playwright/test";

test.beforeEach(async ({ context }) => {
  await context.addInitScript(() => {
    localStorage.setItem("candlevic:onboarded:v1", "1");
  });
});

test("compra en el simulador y guarda la operación", async ({ page }) => {
  await page.goto("/demo");

  const qty = page.getByLabel(/Cantidad/);
  await expect(qty).toBeVisible({ timeout: 15_000 });
  await qty.fill("0.01");

  const buy = page.getByRole("button", { name: /Comprar BTC/ });
  await expect(buy).toBeEnabled({ timeout: 15_000 });
  await buy.click();

  await expect(page.getByText(/Compra simulada/)).toBeVisible();

  const state = await page.evaluate(() => {
    const raw = localStorage.getItem("candlevic:demo:v1");
    return raw ? (JSON.parse(raw).state as { trades: unknown[] }) : null;
  });
  expect(state?.trades.length).toBe(1);
});
