import { test, expect } from "@playwright/test";

test.beforeEach(async ({ context }) => {
  await context.addInitScript(() => {
    localStorage.setItem("candlevic:onboarded:v1", "1");
  });
});

test("completa una lección y persiste el progreso", async ({ page }) => {
  await page.goto("/aprender/velas");
  await page.getByRole("button", { name: /Completar/ }).click();
  await expect(page.getByRole("button", { name: /Completada/ })).toBeVisible();

  await page.reload();
  await expect(page.getByRole("button", { name: /Completada/ })).toBeVisible();
});

test("busca y abre una lección con el atajo", async ({ page }) => {
  await page.goto("/");
  await page.keyboard.press("Control+k");

  const input = page.getByRole("combobox");
  await expect(input).toBeVisible();
  await input.fill("soporte y resistencia");

  await expect(page.getByRole("option").first()).toBeVisible({
    timeout: 10_000,
  });
  await page.keyboard.press("Enter");

  await expect(page).toHaveURL(/\/aprender\/soporte-resistencia/);
});
