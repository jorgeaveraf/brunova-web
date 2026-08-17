import { afterEach, describe, expect, it, vi } from "vitest"

describe("server environment", () => {
  afterEach(() => {
    vi.unstubAllEnvs()
    vi.resetModules()
  })

  it("returns a controlled HTTP portal destination", async () => {
    vi.stubEnv("PORTAL_URL", "https://portal.example.test/client")
    const { getPortalUrl } = await import("@/lib/env")

    expect(getPortalUrl()?.href).toBe("https://portal.example.test/client")
  })

  it("rejects a non-HTTP portal protocol", async () => {
    vi.stubEnv("PORTAL_URL", "ftp://portal.example.test/client")
    const { getPortalUrl } = await import("@/lib/env")

    expect(() => getPortalUrl()).toThrow("Expected an HTTP or HTTPS URL")
  })

  it("requires an origin-only canonical SITE_URL", async () => {
    const { parseServerEnvironment } = await import("@/lib/env")

    expect(() =>
      parseServerEnvironment({
        NODE_ENV: "production",
        SITE_URL: "https://brunova.example/site?preview=true",
      }),
    ).toThrow("SITE_URL must contain only the canonical site origin")
  })

  it("requires HTTPS for non-loopback production URLs", async () => {
    const { parseServerEnvironment } = await import("@/lib/env")

    expect(() =>
      parseServerEnvironment({
        NODE_ENV: "production",
        SITE_URL: "http://brunova.example",
      }),
    ).toThrow("Production SITE_URL must use HTTPS")
    expect(
      parseServerEnvironment({
        NODE_ENV: "production",
        SITE_URL: "http://localhost:3000",
      }).SITE_URL,
    ).toBe("http://localhost:3000")
  })

  it("allows indexing only for a canonical non-loopback HTTPS URL", async () => {
    const { parseServerEnvironment } = await import("@/lib/env")

    expect(() =>
      parseServerEnvironment({
        NODE_ENV: "production",
        SITE_URL: "http://localhost:3000",
        SEO_INDEXING_ENABLED: "true",
      }),
    ).toThrow("SEO_INDEXING_ENABLED requires")
    expect(
      parseServerEnvironment({
        NODE_ENV: "production",
        SITE_URL: "https://brunova.example",
        SEO_INDEXING_ENABLED: "true",
      }).SEO_INDEXING_ENABLED,
    ).toBe(true)
  })

  it("rejects insecure external production portal URLs", async () => {
    const { parseServerEnvironment } = await import("@/lib/env")

    expect(() =>
      parseServerEnvironment({
        NODE_ENV: "production",
        SITE_URL: "https://brunova.example",
        PORTAL_URL: "http://portal.example.test/client",
      }),
    ).toThrow("Production PORTAL_URL must use HTTPS")
  })

  it("rejects insecure external production webhook URLs", async () => {
    const { parseServerEnvironment } = await import("@/lib/env")

    expect(() =>
      parseServerEnvironment({
        NODE_ENV: "production",
        SITE_URL: "https://brunova.example",
        N8N_CONTACT_WEBHOOK_URL: "http://automation.example.test/contact",
      }),
    ).toThrow("Production N8N_CONTACT_WEBHOOK_URL must use HTTPS")
  })
})
