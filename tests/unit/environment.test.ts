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
})
