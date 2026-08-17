import AxeBuilder from "@axe-core/playwright"
import { expect, test } from "@playwright/test"

test("site shell and health endpoint are operational", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 })
  await page.goto("/")

  await expect(
    page.getByRole("heading", {
      name: "Systems for operations that have outgrown their tools.",
    }),
  ).toBeVisible()
  await expect(
    page.getByRole("navigation", { name: "Primary navigation" }),
  ).toBeVisible()
  await expect(
    page.getByRole("link", { name: "Capabilities" }).first(),
  ).toHaveAttribute("href", "/capabilities")
  await expect(
    page.getByRole("link", { name: "Start a conversation" }).first(),
  ).toHaveAttribute("href", "/contact")
  const themeControl = page
    .getByRole("group", { name: "Theme" })
    .filter({ visible: true })
  await expect(
    themeControl.getByRole("radio", { name: "System" }),
  ).toBeEnabled()

  const health = await page.request.get("/api/health")
  expect(health.status()).toBe(200)
  await expect(health.json()).resolves.toEqual({ status: "ok" })

  const accessibility = await new AxeBuilder({ page }).analyze()
  expect(accessibility.violations).toEqual([])
})

test("explicit theme preference persists", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 })
  await page.goto("/")
  const themeControl = page
    .getByRole("group", { name: "Theme" })
    .filter({ visible: true })
  await themeControl.getByText("Dark", { exact: true }).click()
  const darkOption = themeControl.getByRole("radio", { name: "Dark" })
  await expect(darkOption).toBeChecked()
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark")

  await darkOption.focus()
  await page.keyboard.press("ArrowLeft")
  await expect(themeControl.getByRole("radio", { name: "Light" })).toBeChecked()
  await page.keyboard.press("ArrowRight")
  await expect(darkOption).toBeChecked()

  await page.reload()
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark")
})

test("mobile navigation manages focus, Escape, explicit close, and backdrop", async ({
  page,
}) => {
  await page.setViewportSize({ width: 768, height: 900 })
  await page.goto("/")

  const trigger = page.getByRole("button", { name: "Menu" })
  await trigger.click()
  const dialog = page.getByRole("dialog", { name: "Navigation" })
  await expect(dialog).toBeVisible()
  await expect(dialog.getByRole("link", { name: "Capabilities" })).toBeFocused()

  const openAccessibility = await new AxeBuilder({ page }).analyze()
  expect(openAccessibility.violations).toEqual([])

  await page.keyboard.press("Escape")
  await expect(
    page.getByRole("dialog", { name: "Navigation" }),
  ).not.toBeVisible()
  await expect(trigger).toBeFocused()

  await trigger.click()
  await page.getByRole("button", { name: "Close" }).click()
  await expect(trigger).toBeFocused()

  await trigger.click()
  await page.mouse.click(40, 450)
  await expect(
    page.getByRole("dialog", { name: "Navigation" }),
  ).not.toBeVisible()
})

for (const width of [320, 375, 390, 414, 768, 960, 1024, 1280, 1440, 1920]) {
  test(`shell has no horizontal overflow at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 })
    await page.goto("/")

    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - window.innerWidth,
    )
    expect(overflow).toBeLessThanOrEqual(0)

    if (width <= 768) {
      await page.getByRole("button", { name: "Menu" }).click()
      await expect(
        page.getByRole("dialog", { name: "Navigation" }),
      ).toBeVisible()
      const menuOverflow = await page.evaluate(
        () => document.documentElement.scrollWidth - window.innerWidth,
      )
      expect(menuOverflow).toBeLessThanOrEqual(0)
    }
  })
}

test("first-touch UTM attribution persists for the session", async ({
  page,
}) => {
  await page.goto("/?utm_source=architecture-review&utm_medium=referral")

  await expect
    .poll(() =>
      page.evaluate(() =>
        window.sessionStorage.getItem("brunova:first-touch-attribution:v1"),
      ),
    )
    .toContain('"utm_source":"architecture-review"')

  const firstTouch = await page.evaluate(() =>
    window.sessionStorage.getItem("brunova:first-touch-attribution:v1"),
  )
  expect(firstTouch).toContain('"utm_source":"architecture-review"')

  await page.goto("/?utm_source=replacement")
  const preservedTouch = await page.evaluate(() =>
    window.sessionStorage.getItem("brunova:first-touch-attribution:v1"),
  )
  expect(preservedTouch).toBe(firstTouch)
})
