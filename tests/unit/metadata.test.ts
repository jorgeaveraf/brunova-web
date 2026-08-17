import { describe, expect, it } from "vitest"

import { createPageMetadata } from "@/lib/metadata"

describe("page metadata", () => {
  it("sets canonical, Open Graph, and social metadata", () => {
    const metadata = createPageMetadata({
      title: "Selected systems",
      description: "An anonymized portfolio.",
      path: "/work",
    })

    expect(metadata.alternates).toEqual({ canonical: "/work" })
    expect(metadata.openGraph).toMatchObject({
      type: "website",
      title: "Selected systems",
      url: "/work",
    })
    expect(metadata.twitter).toMatchObject({
      card: "summary",
      title: "Selected systems",
    })
  })

  it("supports intentional noindex route boundaries", () => {
    const metadata = createPageMetadata({
      title: "Portal",
      description: "Controlled access.",
      path: "/portal",
      noIndex: true,
    })

    expect(metadata.robots).toEqual({ index: false, follow: false })
  })
})
