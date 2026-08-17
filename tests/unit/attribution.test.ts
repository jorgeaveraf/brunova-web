import { describe, expect, it } from "vitest"

import {
  attributionStorageKey,
  captureFirstTouchAttribution,
} from "@/lib/attribution"

function createMemoryStorage() {
  const values = new Map<string, string>()

  return {
    getItem: (key: string) => values.get(key) ?? null,
    setItem: (key: string, value: string) => values.set(key, value),
  }
}

describe("first-touch attribution", () => {
  it("captures UTM values once and preserves the original touch", () => {
    const storage = createMemoryStorage()
    const firstTouch = captureFirstTouchAttribution({
      search: "?utm_source=brief&utm_medium=referral&utm_campaign=br-017",
      landingPath: "/?utm_source=brief",
      referrer: "https://example.com/source",
      storage,
      now: () => new Date("2026-08-16T12:00:00.000Z"),
    })
    const repeatedTouch = captureFirstTouchAttribution({
      search: "?utm_source=changed",
      landingPath: "/work",
      referrer: "",
      storage,
    })

    expect(firstTouch).toMatchObject({
      utm_source: "brief",
      utm_medium: "referral",
      utm_campaign: "br-017",
      capturedAt: "2026-08-16T12:00:00.000Z",
    })
    expect(repeatedTouch).toEqual(firstTouch)
    expect(storage.getItem(attributionStorageKey)).not.toBeNull()
  })

  it("does not create attribution without UTM parameters", () => {
    const storage = createMemoryStorage()

    expect(
      captureFirstTouchAttribution({
        search: "?ref=internal",
        landingPath: "/",
        referrer: "",
        storage,
      }),
    ).toBeNull()
  })
})
