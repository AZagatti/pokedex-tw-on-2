import { test, expect } from "@playwright/test";

test.describe("Favorites", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("favorites page starts empty", async ({ page }) => {
    await page.goto("/favorites");
    await expect(page.locator("h1")).toContainText("Favorites");
    await expect(page.locator("p")).toContainText("No favorites");
  });

  test("adding and removing favorites", async ({ page }) => {
    await page.waitForSelector(".pokemon-grid");
    const favoriteBtn = page.locator('button[aria-label*="favorite"]').first();
    await favoriteBtn.click();

    await page.goto("/favorites");
    const favCards = page.locator(".pokemon-grid > a");
    await expect(favCards).toHaveCount(1);

    const favBtn = page.locator('button[aria-label*="favorite"]').first();
    await favBtn.click();

    await page.reload();
    const emptyMsg = page.locator("p");
    await expect(emptyMsg).toContainText("No favorites");
  });

  test("favorites persist across sessions", async ({ page, context }) => {
    await page.waitForSelector(".pokemon-grid");
    const favoriteBtn = page.locator('button[aria-label*="favorite"]').first();
    await favoriteBtn.click();

    const newPage = await context.newPage();
    await newPage.goto("/favorites");

    const favCards = newPage.locator(".pokemon-grid > a");
    await expect(favCards).toHaveCount(1);
  });

  test("navigates from favorites to detail", async ({ page }) => {
    await page.waitForSelector(".pokemon-grid");
    const favoriteBtn = page.locator('button[aria-label*="favorite"]').first();
    await favoriteBtn.click();

    await page.goto("/favorites");
    const firstCard = page.locator(".pokemon-grid > a").first();
    await firstCard.click();

    await expect(page).toHaveURL(/\/pokemon\/\d+/);
  });
});
