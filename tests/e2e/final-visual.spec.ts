import { expect, test } from "@playwright/test"

import { workCases } from "@/content/work"

const completeRoutes = [
  "/",
  "/capabilities",
  "/process",
  "/work",
  ...workCases.map((work) => `/work/${work.slug}`),
  "/about",
  "/contact",
  "/portal",
  "/privacy",
  "/phase-8-not-found",
] as const

for (const width of [320, 375, 414, 768]) {
  test(`final visual surfaces satisfy Hallmark mobile gates at ${width}px`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 1000 })

    for (const route of completeRoutes) {
      await page.goto(route)

      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth - window.innerWidth,
        ),
        `${route} horizontal overflow`,
      ).toBeLessThanOrEqual(0)

      const unsafeDisplayHeadings = await page
        .locator("h1, h2, h3, h4, h5, h6")
        .evaluateAll((headings) =>
          headings
            .filter((heading) => {
              const style = getComputedStyle(heading)
              return (
                heading.getBoundingClientRect().width > 0 &&
                Number.parseFloat(style.fontSize) >= 24 &&
                (style.minWidth !== "0px" || style.overflowWrap !== "anywhere")
              )
            })
            .map((heading) => heading.textContent?.trim()),
        )
      expect(unsafeDisplayHeadings, `${route} display wrapping`).toEqual([])

      const wrappedAffordances = await page
        .locator("a, button, [role='button']")
        .evaluateAll((elements) =>
          elements
            .filter((element) => {
              const style = getComputedStyle(element)
              const text = element.textContent?.trim() ?? ""
              return (
                text.length > 0 &&
                style.display !== "none" &&
                element.getBoundingClientRect().width > 0 &&
                style.whiteSpace !== "nowrap"
              )
            })
            .map((element) => element.textContent?.trim()),
        )
      expect(wrappedAffordances, `${route} clickable wrapping`).toEqual([])

      const unlabeledVisuals = await page
        .locator("main svg")
        .evaluateAll(
          (elements) =>
            elements.filter(
              (element) =>
                element.getBoundingClientRect().width > 0 &&
                !element.hasAttribute("aria-label") &&
                !element.hasAttribute("aria-labelledby") &&
                element.getAttribute("aria-hidden") !== "true",
            ).length,
        )
      expect(unlabeledVisuals, `${route} SVG semantics`).toBe(0)
    }
  })
}

test("homepage hero remains a complete deliberate 1280 by 800 composition", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1280, height: 800 })
  await page.goto("/")

  const geometry = await page.evaluate(() => {
    const inner = document.querySelector<HTMLElement>(".home-hero__inner")
    const actions = document.querySelector<HTMLElement>(".home-hero__actions")
    const visual = document.querySelector<SVGElement>(".system-diagram__svg")
    if (!inner || !actions || !visual) throw new Error("Hero is incomplete")
    const style = getComputedStyle(inner)
    return {
      actionsBottom: actions.getBoundingClientRect().bottom,
      visualBottom: visual.getBoundingClientRect().bottom,
      paddingTop: Number.parseFloat(style.paddingTop),
      paddingBottom: Number.parseFloat(style.paddingBottom),
    }
  })

  expect(geometry.actionsBottom).toBeLessThanOrEqual(800)
  expect(geometry.visualBottom).toBeLessThanOrEqual(800)
  expect(geometry.paddingBottom).toBeGreaterThanOrEqual(
    geometry.paddingTop * 1.3,
  )
})

test("brand plates remain wired and visible in both themes", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 1000 })

  for (const theme of ["light", "dark"] as const) {
    await page.goto("/")
    await page.evaluate((selectedTheme) => {
      localStorage.setItem("brunova-theme", selectedTheme)
    }, theme)
    await page.reload()
    await expect(page.locator("html")).toHaveAttribute("data-theme", theme)
    const visibleLogos = page.locator(".brunova-logo img:visible")
    await expect(visibleLogos).toHaveCount(2)
    for (const logo of await visibleLogos.all()) {
      await expect(logo).toBeVisible()
      await expect(logo).toHaveAttribute("src", /brunova-wordmark-dark\.webp/)
      await expect(logo).toHaveAttribute("width", "1045")
      await expect(logo).toHaveAttribute("height", "295")
    }
  }
})
