import AxeBuilder from "@axe-core/playwright"
import { expect, test } from "@playwright/test"

const indexRoutes = [
  { path: "/capabilities", heading: "Capabilities that combine into systems." },
  { path: "/process", heading: "Enter where the system is." },
  { path: "/work", heading: "Selected systems we’ve engineered." },
  { path: "/about", heading: "Built at the operating boundary." },
  { path: "/portal", heading: "Brunova Client Portal" },
  { path: "/privacy", heading: "Privacy" },
] as const

const workRoutes = [
  {
    slug: "multi-tenant-financial-integration-platform",
    heading:
      "A shared financial integration layer across multiple operating entities",
  },
  {
    slug: "operational-finance-data-infrastructure",
    heading:
      "Turning recurring financial reporting into shared operational infrastructure",
  },
  {
    slug: "document-intelligence-workflow",
    heading: "AI-assisted document processing with control built in",
  },
  {
    slug: "fragile-automation-modernization",
    heading: "From person-dependent workflows to operable systems",
  },
] as const

test("core routes expose their approved content contracts", async ({
  page,
}) => {
  for (const route of indexRoutes) {
    const response = await page.goto(route.path)
    expect(response?.status()).toBe(200)
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(
      route.heading,
    )
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      "href",
      new RegExp(`${route.path}$`),
    )
    await expect(page.locator('meta[property="og:title"]')).toHaveCount(1)
    await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute(
      "content",
      "summary",
    )
  }

  await page.goto("/capabilities")
  await expect(page.locator(".capability-spread")).toHaveCount(5)

  await page.goto("/process")
  await expect(page.locator(".process-stage")).toHaveCount(4)
  await expect(page.getByText("Known problem", { exact: true })).toBeVisible()
  await expect(
    page.getByText("Defined architecture", { exact: true }),
  ).toBeVisible()
  await expect(
    page.getByText("Existing production system", { exact: true }),
  ).toBeVisible()

  await page.goto("/work")
  await expect(page.locator(".work-folio article")).toHaveCount(4)

  await page.goto("/portal")
  await expect(
    page.getByText("Portal access is available to active clients."),
  ).toBeVisible()
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
    "content",
    /noindex/,
  )

  await page.goto("/contact")
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "Start a conversation.",
  )
  await expect(page.locator("form")).toHaveCount(1)
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
    "href",
    /\/contact$/,
  )
  await expect(page.locator('meta[name="robots"]')).toHaveCount(0)
})

test("all four typed work routes render conservative dossiers", async ({
  page,
}) => {
  for (const work of workRoutes) {
    const response = await page.goto(`/work/${work.slug}`)
    expect(response?.status()).toBe(200)
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(
      work.heading,
    )
    await expect(page.locator(".system-flow li")).toHaveCount(4)
    await expect(
      page.getByRole("heading", { name: "Key engineering decisions" }),
    ).toBeVisible()
  }
})

test("an unknown work slug returns the branded not-found state", async ({
  page,
}) => {
  const response = await page.goto("/work/not-an-approved-system")
  expect(response?.status()).toBe(404)
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "Page not found.",
  )
  await expect(
    page.getByRole("link", { name: "Return to Brunova" }),
  ).toHaveAttribute("href", "/")
})

for (const theme of ["light", "dark"] as const) {
  for (const path of [
    "/capabilities",
    "/process",
    "/work/document-intelligence-workflow",
    "/about",
    "/portal",
    "/privacy",
  ]) {
    test(`${path} has no detectable accessibility violations in ${theme} mode`, async ({
      page,
    }) => {
      await page.setViewportSize({ width: 1280, height: 900 })
      await page.addInitScript((selectedTheme) => {
        window.localStorage.setItem("brunova-theme", selectedTheme)
      }, theme)
      await page.goto(path)
      await expect(page.locator("html")).toHaveAttribute("data-theme", theme)

      const accessibility = await new AxeBuilder({ page }).analyze()
      expect(accessibility.violations).toEqual([])
    })
  }
}

for (const width of [320, 375, 390, 414, 768, 1024, 1280, 1440, 1920]) {
  test(`Phase 4 routes recompose without overflow at ${width}px`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 900 })
    const paths = [
      ...indexRoutes.map((route) => route.path),
      "/work/document-intelligence-workflow",
      "/contact",
    ]

    for (const path of paths) {
      await page.goto(path)
      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth - window.innerWidth,
      )
      expect(overflow, `${path} overflow at ${width}px`).toBeLessThanOrEqual(0)
    }
  })
}

test("representative routes preserve focus and 400-percent-equivalent reflow", async ({
  page,
}) => {
  await page.setViewportSize({ width: 320, height: 900 })

  for (const path of [
    "/capabilities",
    "/process",
    "/work/document-intelligence-workflow",
    "/about",
    "/portal",
    "/privacy",
  ]) {
    await page.goto(path)
    const firstMainLink = page.getByRole("main").getByRole("link").first()
    if ((await firstMainLink.count()) > 0) {
      await firstMainLink.focus()
      await expect(firstMainLink).toBeFocused()
      expect(
        await firstMainLink.evaluate(
          (element) => window.getComputedStyle(element).outlineStyle,
        ),
      ).not.toBe("none")
    }

    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - window.innerWidth,
    )
    expect(overflow).toBeLessThanOrEqual(0)
  }
})
