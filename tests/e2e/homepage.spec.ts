import AxeBuilder from "@axe-core/playwright"
import { expect, test } from "@playwright/test"

const narrativeHeadings = [
  "When operations become systems problems.",
  "Operational intelligence is what happens when process, data and systems stop living separately.",
  "What Brunova builds",
  "We don’t start with “What should we automate?” We start with “How should this operation work?”",
  "Selected systems we’ve engineered",
  "How Brunova works",
  "Principles we operate by",
  "Have an operation that has outgrown the way it was built?",
]

test("homepage follows the approved narrative and record counts", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 1000 })
  await page.goto("/")

  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "Systems for operations that have outgrown their tools.",
  )

  const levelTwoHeadings = await page
    .getByRole("heading", { level: 2 })
    .allTextContents()
  expect(levelTwoHeadings.map((heading) => heading.trim())).toEqual(
    narrativeHeadings,
  )

  await expect(page.locator(".capability-ledger__item")).toHaveCount(5)
  await expect(page.locator(".work-ledger__item")).toHaveCount(4)
  await expect(page.locator(".process-track > li")).toHaveCount(4)
  await expect(page.locator(".principles > li")).toHaveCount(3)
  await expect(
    page.getByRole("img", {
      name: "From fragmented operations to a reliable operating system",
    }),
  ).toBeVisible()
})

test("the essential hero content fits the 1280 by 800 fold", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1280, height: 800 })
  await page.goto("/")

  const identity = page.locator(".site-header__identity")
  const title = page.getByRole("heading", { level: 1 })
  const description = page.locator(".home-hero__description")
  const primaryAction = page
    .getByRole("main")
    .getByRole("link", { name: "Start a conversation" })
    .first()

  await expect(identity).toBeVisible()
  await expect(title).toBeVisible()
  await expect(description).toBeVisible()
  await expect(primaryAction).toBeVisible()

  for (const locator of [title, description, primaryAction]) {
    const box = await locator.boundingBox()
    expect(box).not.toBeNull()
    expect((box?.y ?? 0) + (box?.height ?? 0)).toBeLessThanOrEqual(800)
  }
})

for (const state of [
  { name: "desktop light", width: 1440, height: 1000, theme: "light" },
  { name: "desktop dark", width: 1440, height: 1000, theme: "dark" },
  { name: "mobile light", width: 390, height: 844, theme: "light" },
  { name: "mobile dark", width: 390, height: 844, theme: "dark" },
] as const) {
  test(`homepage has no detectable accessibility violations in ${state.name}`, async ({
    page,
  }) => {
    await page.setViewportSize({ width: state.width, height: state.height })
    await page.addInitScript((theme) => {
      window.localStorage.setItem("brunova-theme", theme)
    }, state.theme)
    await page.goto("/")

    await expect(page.locator("html")).toHaveAttribute(
      "data-theme",
      state.theme,
    )
    const accessibility = await new AxeBuilder({ page }).analyze()
    expect(accessibility.violations).toEqual([])
  })
}

test("mobile uses the readable system sequence and honors reduced motion", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" })
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto("/")

  await expect(
    page.getByRole("list", {
      name: "From fragmented inputs to a reliable operating system",
    }),
  ).toBeVisible()
  await expect(page.locator(".system-diagram__svg")).not.toBeVisible()

  const primaryAction = page
    .getByRole("main")
    .getByRole("link", { name: "Start a conversation" })
    .first()
  await primaryAction.focus()
  await expect(primaryAction).toBeFocused()
  expect(
    await primaryAction.evaluate(
      (element) => window.getComputedStyle(element).outlineStyle,
    ),
  ).not.toBe("none")

  const animations = await page.evaluate(
    () =>
      document
        .getAnimations()
        .filter((animation) => animation.playState === "running").length,
  )
  expect(animations).toBe(0)
})
