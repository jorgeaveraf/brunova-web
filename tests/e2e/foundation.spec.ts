import AxeBuilder from "@axe-core/playwright"
import { expect, test } from "@playwright/test"

test("foundation surface and health endpoint are operational", async ({
  page,
}) => {
  await page.goto("/")

  await expect(
    page.getByRole("heading", { name: "Architecture before tools." }),
  ).toBeVisible()
  await expect(page.getByRole("combobox", { name: "Appearance" })).toBeEnabled()

  const health = await page.request.get("/api/health")
  expect(health.status()).toBe(200)
  await expect(health.json()).resolves.toEqual({ status: "ok" })

  const accessibility = await new AxeBuilder({ page }).analyze()
  expect(accessibility.violations).toEqual([])
})

test("explicit theme preference persists", async ({ page }) => {
  await page.goto("/")
  await page.getByRole("combobox", { name: "Appearance" }).selectOption("dark")
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark")

  await page.reload()
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark")
})
