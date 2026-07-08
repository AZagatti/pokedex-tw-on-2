import { test, expect } from "@playwright/test";

test.describe("Homepage", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("displays page title and subtitle", async ({ page }) => {
    await expect(page.locator("h1")).toContainText("Pokédex");
    await expect(page.locator(".page-subtitle")).toContainText(
      "Discover all Pokémon species"
    );
  });

  test("loads pokemon cards", async ({ page }) => {
    await page.waitForSelector(".pokemon-grid");
    const cards = page.locator(".pokemon-grid > a");
    await expect(cards).toHaveCount(20, { timeout: 10_000 });
  });

  test("navigates to pokemon detail", async ({ page }) => {
    await page.waitForSelector(".pokemon-grid");
    const firstCard = page.locator(".pokemon-grid > a").first();
    await firstCard.click();
    await expect(page).toHaveURL(/\/pokemon\/\d+/);
  });

  test("search filters pokemon", async ({ page }) => {
    await page.waitForSelector('input[type="search"]');
    const searchInput = page.locator('input[type="search"]');
    await searchInput.fill("pika");
    await page.waitForTimeout(500);

    const cards = page.locator(".pokemon-grid > a");
    const count = await cards.count();
    expect(count).toBeGreaterThan(0);
  });

  test("generation filter works", async ({ page }) => {
    await page.waitForSelector("select");
    const select = page.locator("select").first();
    await select.selectOption("1");
    await page.waitForTimeout(500);

    const cards = page.locator(".pokemon-grid > a");
    const count = await cards.count();
    expect(count).toBeGreaterThan(0);
    expect(count).toBeLessThanOrEqual(151);
  });

  test("toggles favorite on card", async ({ page }) => {
    await page.waitForSelector(".pokemon-grid");
    const favoriteBtn = page.locator('button[aria-label*="favorite"]').first();
    await favoriteBtn.click();

    const favNav = page.locator('nav a[href="/favorites"]');
    await favNav.click();
    await expect(page).toHaveURL("/favorites");

    const favCards = page.locator(".pokemon-grid > a");
    await expect(favCards).toHaveCount(1);
  });

  test("theme toggle works", async ({ page }) => {
    const themeBtn = page.locator('button[aria-label*="theme"]');
    await themeBtn.click();

    const html = page.locator("html");
    const hasClass = await html.evaluate((el) => el.classList.contains("dark"));
    expect(hasClass).toBeTruthy();
  });

  test("infinite scroll loads more pokemon", async ({ page }) => {
    await page.waitForSelector(".pokemon-grid");
    const initialCount = await page.locator(".pokemon-grid > a").count();

    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(2000);

    const newCount = await page.locator(".pokemon-grid > a").count();
    expect(newCount).toBeGreaterThan(initialCount);
  });
});
