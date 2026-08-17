import { describe, expect, it } from "vitest"

import { workCases } from "@/content/work"
import {
  createOrganizationStructuredData,
  createRobots,
  createSitemap,
  getSitemapPaths,
  routeIndexingPolicy,
} from "@/lib/seo"

const productionUrl = new URL("https://brunova.example")

describe("technical SEO contracts", () => {
  it("builds the sitemap from approved routes and typed work slugs", () => {
    const paths = getSitemapPaths()
    const sitemap = createSitemap(productionUrl)

    expect(paths).toContain("/")
    expect(paths).toContain("/privacy")
    expect(paths).not.toContain("/portal")
    expect(paths).not.toContain("/api/health")
    expect(paths.filter((path) => path.startsWith("/work/"))).toEqual(
      workCases.map((work) => `/work/${work.slug}`),
    )
    expect(sitemap.map(({ url }) => url)).toEqual(
      paths.map((path) => new URL(path, productionUrl).href),
    )
  })

  it("allows production crawling while excluding runtime boundaries", () => {
    const robots = createRobots({
      indexingEnabled: true,
      siteUrl: productionUrl,
    })

    expect(robots).toEqual({
      rules: {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/portal"],
      },
      sitemap: "https://brunova.example/sitemap.xml",
      host: "https://brunova.example",
    })
  })

  it("disallows crawling by default outside canonical production", () => {
    const robots = createRobots({
      indexingEnabled: false,
      siteUrl: new URL("http://localhost:3000"),
    })

    expect(robots.rules).toEqual({ userAgent: "*", disallow: "/" })
    expect(robots.sitemap).toBe("http://localhost:3000/sitemap.xml")
    expect(robots).not.toHaveProperty("host")
  })

  it("records privacy as public and the portal as noindex", () => {
    expect(
      routeIndexingPolicy.find(({ path }) => path === "/privacy"),
    ).toMatchObject({ index: true, follow: true, sitemap: true })
    expect(
      routeIndexingPolicy.find(({ path }) => path === "/portal"),
    ).toMatchObject({ index: false, follow: true, sitemap: false })
  })

  it("emits only verified Organization fields", () => {
    const structuredData = createOrganizationStructuredData(productionUrl)

    expect(structuredData).toEqual({
      "@context": "https://schema.org",
      "@type": "Organization",
      name: "Brunova",
      url: "https://brunova.example",
      description:
        "Brunova is a systems engineering consultancy that designs and builds reliable systems connecting data, automation, software and AI for complex business operations.",
    })
    expect(structuredData).not.toHaveProperty("address")
    expect(structuredData).not.toHaveProperty("telephone")
    expect(structuredData).not.toHaveProperty("sameAs")
  })
})
