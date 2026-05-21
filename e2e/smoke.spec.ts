import { expect, test } from "@playwright/test";

test.describe("Marketplace smoke", () => {
  test("homepage renders without crashing", async ({ page }) => {
    const response = await page.goto("/", { waitUntil: "domcontentloaded" });
    expect(response, "navigation should return a response").not.toBeNull();
    expect(response?.ok(), "homepage should respond with a 2xx status").toBe(
      true,
    );

    await expect(page).toHaveTitle(/.+/);
    await expect(page.locator("body")).toBeVisible();
  });

  test("not-found page is reachable", async ({ page }) => {
    const response = await page.goto("/__definitely-not-a-real-route__", {
      waitUntil: "domcontentloaded",
    });

    expect(response, "navigation should return a response").not.toBeNull();
    expect(response?.status()).toBe(404);

    await expect(
      page.getByRole("heading", { name: /404/i }).first(),
    ).toBeVisible();
  });
});
