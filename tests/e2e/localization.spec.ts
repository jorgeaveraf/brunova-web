import AxeBuilder from "@axe-core/playwright"
import { expect, test } from "@playwright/test"

import { esWorkCases } from "@/content/es"

const spanishRoutes = [
  {
    path: "/es",
    heading: "Sistemas para operaciones que ya superaron sus herramientas.",
  },
  {
    path: "/es/capabilities",
    heading: "Capacidades que se combinan en sistemas.",
  },
  { path: "/es/process", heading: "Entre donde está el sistema." },
  {
    path: "/es/work",
    heading: "Sistemas seleccionados que hemos desarrollado.",
  },
  ...esWorkCases.map((work) => ({
    path: `/es/work/${work.slug}`,
    heading: work.title,
  })),
  { path: "/es/about", heading: "Construida en el límite operativo." },
  { path: "/es/contact", heading: "Inicie una conversación." },
  { path: "/es/portal", heading: "Portal de Clientes Brunova" },
  { path: "/es/privacy", heading: "Privacidad" },
] as const

test("every Spanish public route is server-localized with complete metadata", async ({
  page,
}) => {
  for (const route of spanishRoutes) {
    const response = await page.goto(route.path)
    expect(response?.status(), route.path).toBe(200)
    await expect(page.locator("html")).toHaveAttribute("lang", "es")
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(
      route.heading,
    )
    await expect(
      page.getByRole("navigation", { name: "Navegación principal" }),
    ).toBeVisible()
    await expect(page.getByRole("contentinfo")).toContainText(
      "Ingeniería de Sistemas",
    )
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      "href",
      new RegExp(`${route.path}$`),
    )
    await expect(page.locator('link[hreflang="en"]')).toHaveCount(1)
    await expect(page.locator('link[hreflang="es"]')).toHaveCount(1)

    const visibleText = await page.locator("body").innerText()
    expect(visibleText, route.path).not.toMatch(
      /Skip to content|Primary navigation|Start a conversation|View system|Footer navigation/,
    )
  }
})

test("language utility preserves the equivalent path and only persists explicit choice", async ({
  page,
}) => {
  await page.goto(`/work/${esWorkCases[0].slug}`)
  expect(
    await page.evaluate(() => localStorage.getItem("brunova-locale")),
  ).toBeNull()

  await page.getByRole("button", { name: "Language" }).click()
  await page.getByText("ES — Español", { exact: true }).click()
  await page.waitForURL(`/es/work/${esWorkCases[0].slug}`)
  await expect(page.locator("html")).toHaveAttribute("lang", "es")
  expect(
    await page.evaluate(() => localStorage.getItem("brunova-locale")),
  ).toBe("es")

  await page.getByRole("button", { name: "Idioma" }).click()
  await page.getByText("EN — English", { exact: true }).click()
  await page.waitForURL(`/work/${esWorkCases[0].slug}`)
  await expect(page.locator("html")).toHaveAttribute("lang", "en")
})

test("appearance and language utilities are independent, dismissible and accessible", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto("/")

  const appearance = page.getByRole("button", { name: "Appearance" })
  await appearance.click()
  await expect(page.getByRole("group", { name: "Appearance" })).toBeVisible()
  await page.getByText("Dark", { exact: true }).click()
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark")
  await page.keyboard.press("Escape")
  await expect(appearance).toBeFocused()

  const language = page.getByRole("button", { name: "Language" })
  await language.click()
  await expect(page.getByRole("group", { name: "Language" })).toBeVisible()
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([])
  await page.mouse.click(300, 300)
  await expect(page.getByRole("group", { name: "Language" })).toHaveCount(0)
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark")
})

for (const theme of ["system", "light", "dark"] as const) {
  for (const locale of ["en", "es"] as const) {
    test(`${theme} appearance renders with ${locale.toUpperCase()} content`, async ({
      page,
    }) => {
      await page.addInitScript(
        (selectedTheme) => localStorage.setItem("brunova-theme", selectedTheme),
        theme,
      )
      await page.goto(locale === "es" ? "/es" : "/")
      await expect(page.locator("html")).toHaveAttribute("lang", locale)
      if (theme !== "system")
        await expect(page.locator("html")).toHaveAttribute("data-theme", theme)
      await expect(
        page.getByRole("button", {
          name: locale === "es" ? "Idioma" : "Language",
        }),
      ).toContainText(locale.toUpperCase())
    })
  }
}

test("Spanish contact keeps machine enums stable and adds locale to the API envelope", async ({
  page,
}) => {
  let requestBody: Record<string, unknown> = {}
  await page.route("**/api/contact", async (route) => {
    requestBody = route.request().postDataJSON() as Record<string, unknown>
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ ok: true }),
    })
  })
  await page.goto("/es/contact")
  await page.getByLabel("Nombre").fill("Ada Lovelace")
  await page.getByLabel("Correo de trabajo").fill("ada@example.com")
  await page.getByLabel("Empresa").fill("Analytical Engines")
  await page.getByLabel("Puesto").fill("Directora de Operaciones")
  await page
    .getByLabel("Categoría del problema")
    .selectOption("fragmented_systems")
  await page
    .getByLabel("Descripción del problema")
    .fill(
      "Nuestros datos operativos están fragmentados entre sistemas y relevos manuales.",
    )
  await page.getByRole("button", { name: "Enviar contexto" }).click()
  await expect(
    page.getByRole("heading", { name: "Gracias. Recibimos su mensaje." }),
  ).toBeVisible()
  expect(requestBody).toMatchObject({
    locale: "es",
    pagePath: "/es/contact",
    problemCategory: "fragmented_systems",
  })
})

test("Spanish unknown routes use the localized noindex state", async ({
  page,
}) => {
  const response = await page.goto("/es/ruta-inexistente")
  expect(response?.status()).toBe(404)
  await expect(page.locator("html")).toHaveAttribute("lang", "es")
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "Página no encontrada.",
  )
  const robots = await page
    .locator('meta[name="robots"]')
    .evaluateAll((elements) =>
      elements.map((element) => element.getAttribute("content") ?? ""),
    )
  expect(robots.every((content) => content.includes("noindex"))).toBe(true)
})
