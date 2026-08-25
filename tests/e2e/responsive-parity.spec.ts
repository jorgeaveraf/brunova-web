import { expect, test } from "@playwright/test"

import { workCases } from "@/content/work"

const homepageOrder = [
  "home-hero",
  "home-category",
  "home-problem",
  "operational-intelligence",
  "home-capabilities",
  "architecture-hinge",
  "selected-work",
  "home-process",
] as const

const mobileVisuals = [
  "hero-operating-model-mobile",
  "operational-intelligence-loop-mobile",
  "architecture-boundary-mobile",
] as const

test("mobile homepage preserves canonical order and uses derived vector assets", async ({
  page,
}) => {
  for (const locale of [
    { path: "/", suffix: ".svg" },
    { path: "/es", suffix: "-es.svg" },
  ]) {
    await page.setViewportSize({ width: 390, height: 844 })
    await page.goto(locale.path)

    const order = await page
      .locator("main > *")
      .evaluateAll((sections) =>
        sections.map((section) =>
          Array.from(section.classList).find((name) =>
            [
              "home-hero",
              "home-category",
              "home-problem",
              "operational-intelligence",
              "home-capabilities",
              "architecture-hinge",
              "selected-work",
              "home-process",
            ].includes(name),
          ),
        ),
      )
    expect(order).toEqual(homepageOrder)
    await expect(page.locator(".home-visual__mobile")).toHaveCount(0)

    const sources = await page
      .locator(".home-visual__media source")
      .evaluateAll((elements) =>
        elements.map((source) => source.getAttribute("srcset") ?? ""),
      )
    expect(sources).toHaveLength(3)
    mobileVisuals.forEach((visual, index) => {
      expect(sources[index]).toContain(`${visual}${locale.suffix}`)
    })
  }
})

test("tablet and desktop use the canonical homepage SVGs", async ({ page }) => {
  for (const width of [768, 1024, 1280, 1440]) {
    await page.setViewportSize({ width, height: 900 })
    await page.goto("/")
    const sources = await page
      .locator(".home-visual__asset")
      .evaluateAll((images) =>
        images.map((image) => image.getAttribute("src") ?? ""),
      )
    expect(sources).toHaveLength(3)
    expect(sources.every((source) => !source.includes("-mobile"))).toBe(true)
  }
})

test("touch users receive selected-system context without hover", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto("/")
  await expect(page.locator(".selected-proof__reveal")).toHaveCount(3)
  for (const reveal of await page.locator(".selected-proof__reveal").all()) {
    await expect(reveal).toBeVisible()
  }
})

test("mobile dossiers preserve executive order before technical depth", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 })

  for (const work of workCases) {
    await page.goto(`/work/${work.slug}`)
    const geometry = await page.evaluate(() => {
      const context = document.querySelector(".case-evidence__context")
      const system = document.querySelector(".case-evidence__system")
      const outcome = document.querySelector(".case-evidence__capability")
      const technical = document.querySelector(".case-technical")
      const rail = document.querySelector(".case-dossier__index")
      if (!context || !system || !outcome || !technical || !rail)
        throw new Error("Dossier hierarchy is incomplete")
      return {
        context: context.getBoundingClientRect().top,
        system: system.getBoundingClientRect().top,
        outcome: outcome.getBoundingClientRect().top,
        technical: technical.getBoundingClientRect().top,
        railHeight: rail.getBoundingClientRect().height,
        overflow: document.documentElement.scrollWidth - window.innerWidth,
      }
    })

    expect(geometry.context).toBeLessThan(geometry.system)
    expect(geometry.system).toBeLessThan(geometry.outcome)
    expect(geometry.outcome).toBeLessThan(geometry.technical)
    expect(geometry.railHeight).toBeLessThan(620)
    expect(geometry.overflow).toBeLessThanOrEqual(0)
  }
})

test("mobile preferences live in the accessible menu instead of covering content", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto("/")

  await expect(page.locator(".site-utilities--shell")).toBeHidden()
  await expect(page.locator(".home-visual--hero")).toBeVisible()
  const menu = page.getByRole("button", { name: "Menu" })
  await menu.click()
  const dialog = page.getByRole("dialog", { name: "Navigation" })
  await expect(dialog).toBeVisible()
  await expect(dialog.getByRole("button", { name: "Appearance" })).toBeVisible()
  await expect(dialog.getByRole("button", { name: "Language" })).toBeVisible()
  await expect(dialog.getByRole("link", { name: "Systems" })).toBeVisible()
})

test("forbidden feedback-loop wording has no public source occurrence", async ({
  page,
}) => {
  const forbidden = [
    ["The operational state", "returns to the model."].join(" "),
    ["El estado operativo", "vuelve al modelo."].join(" "),
  ]
  const sources = [
    "/",
    "/es",
    "/brand/visuals/operational-intelligence-loop.svg",
    "/brand/visuals/operational-intelligence-loop-es.svg",
    "/brand/visuals/operational-intelligence-loop-mobile.svg",
    "/brand/visuals/operational-intelligence-loop-mobile-es.svg",
  ]

  for (const source of sources) {
    const content = await (await page.request.get(source)).text()
    forbidden.forEach((sentence) => expect(content).not.toContain(sentence))
  }
})
