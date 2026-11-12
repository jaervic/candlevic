import { test, expect } from "@playwright/test";

test.beforeEach(async ({ context }) => {
  await context.addInitScript(() => {
    localStorage.setItem("candlevic:onboarded:v1", "1");
  });
});

test("cambia a Sepia y persiste tras recargar", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Ajustes de lectura" }).first().click();
  await page.getByRole("button", { name: "Sepia" }).click();
  await page.getByRole("button", { name: "Cerrar ajustes" }).click();

  await expect(page.locator("html")).toHaveAttribute("data-theme", "sepia");

  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "sepia");
});
