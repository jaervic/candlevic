import { test, expect } from "@playwright/test";

test.beforeEach(async ({ context }) => {
  await context.addInitScript(() => {
    localStorage.setItem("candlevic:onboarded:v1", "1");
  });
});

test("protege una posición, la vende y conserva la estrategia", async ({
  page,
}) => {
  await page.goto("/demo");

  const qty = page.getByLabel(/Cantidad/);
  await expect(qty).toBeVisible({ timeout: 15_000 });
  await qty.fill("0.01");
  await page.getByLabel(/Estrategia/).selectOption("cruce-de-medias");
  await page.getByRole("button", { name: /Comprar BTC/ }).click();
  await expect(page.getByText(/Compra simulada/)).toBeVisible();

  await page.getByLabel("Stop loss").fill("1000");
  await page.getByLabel("Objetivo").fill("1000000");
  await page.getByRole("button", { name: "Guardar protección" }).click();
  await expect(page.getByText(/Protección guardada/)).toBeVisible();

  const positionState = await page.evaluate(() => {
    const raw = localStorage.getItem("candlevic:demo:v1");
    return raw
      ? (JSON.parse(raw).state as {
          positions: Record<string, { stop?: number; target?: number }>;
        })
      : null;
  });
  expect(positionState?.positions.BTCUSDT.stop).toBe(1000);
  expect(positionState?.positions.BTCUSDT.target).toBe(1_000_000);

  await page.getByRole("button", { name: "Vender", exact: true }).click();
  await page.getByLabel(/Cantidad/).fill("0.01");
  await page.getByRole("button", { name: /Vender BTC/ }).click();
  await expect(page.getByText(/Venta simulada/)).toBeVisible();

  await expect(
    page.getByRole("heading", { name: "P&L por estrategia" }),
  ).toBeVisible();

  const tradeState = await page.evaluate(() => {
    const raw = localStorage.getItem("candlevic:demo:v1");
    return raw
      ? (JSON.parse(raw).state as { trades: { strategy?: string }[] })
      : null;
  });
  expect(tradeState?.trades[0]?.strategy).toBe("cruce-de-medias");
});

test("coloca y cancela una orden límite", async ({ page }) => {
  await page.goto("/demo");

  const qty = page.getByLabel(/Cantidad/);
  await expect(qty).toBeVisible({ timeout: 15_000 });
  await page.getByRole("button", { name: "Límite", exact: true }).click();
  await page.getByLabel("Precio límite").fill("1000");
  await qty.fill("0.01");
  await page.getByRole("button", { name: "Colocar compra límite" }).click();

  await expect(page.getByText(/Orden límite colocada/)).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Órdenes pendientes" }),
  ).toBeVisible();

  const orders = await page.evaluate(() => {
    const raw = localStorage.getItem("candlevic:demo:v1");
    return raw ? (JSON.parse(raw).state.orders as unknown[]) : [];
  });
  expect(orders).toHaveLength(1);

  await page.getByRole("button", { name: "Cancelar" }).click();
  await expect(
    page.getByRole("heading", { name: "Órdenes pendientes" }),
  ).toHaveCount(0);
});

test("compra en el simulador y guarda la operación", async ({ page }) => {
  await page.goto("/demo");

  const qty = page.getByLabel(/Cantidad/);
  await expect(qty).toBeVisible({ timeout: 15_000 });
  await qty.fill("0.01");
  await page.getByLabel(/Estrategia/).selectOption("cruce-de-medias");

  const buy = page.getByRole("button", { name: /Comprar BTC/ });
  await expect(buy).toBeEnabled({ timeout: 15_000 });
  await buy.click();

  await expect(page.getByText(/Compra simulada/)).toBeVisible();

  const state = await page.evaluate(() => {
    const raw = localStorage.getItem("candlevic:demo:v1");
    return raw
      ? (JSON.parse(raw).state as { trades: { strategy?: string }[] })
      : null;
  });
  expect(state?.trades.length).toBe(1);
  expect(state?.trades[0]?.strategy).toBe("cruce-de-medias");
});
