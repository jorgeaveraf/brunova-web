import type { Locale } from "@/lib/i18n"

const attributionStorageKey = "brunova:first-touch-attribution:v2"

const utmKeys = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_term",
  "utm_content",
] as const

type UtmKey = (typeof utmKeys)[number]

export type ContactAttribution = {
  firstTouch: {
    referrerHost: string | null
    landingPath: string
    landingLocale: Locale
    sourceCategory: AttributionSourceCategory
    sourceName: AttributionSourceName
  }
  utm: {
    source: string | null
    medium: string | null
    campaign: string | null
    term: string | null
    content: string | null
  }
}

export type FirstTouchAttribution = Partial<Record<UtmKey, string>> & {
  capturedAt: string
  firstLandingPath: string
  firstLandingLocale: Locale
  firstReferrerHost: string | null
  sourceCategory: AttributionSourceCategory
  sourceName: AttributionSourceName
}

export const attributionSourceCategories = [
  "campaign",
  "organic_search",
  "ai_referral",
  "referral",
  "direct",
  "unknown",
] as const

export type AttributionSourceCategory =
  (typeof attributionSourceCategories)[number]

export const attributionSourceNames = [
  "google",
  "bing",
  "chatgpt",
  "other",
] as const

export type AttributionSourceName =
  (typeof attributionSourceNames)[number] | null

type StorageReader = Pick<Storage, "getItem" | "setItem">

function normalizeAttributionValue(value: unknown): string | undefined {
  const normalized = typeof value === "string" ? value.trim().slice(0, 200) : ""
  return normalized || undefined
}

export function contactAttributionFromStorage(
  storage: Pick<Storage, "getItem">,
  fallback: { landingPath: string; locale: Locale },
): ContactAttribution {
  const attribution = readFirstTouchAttribution(storage)

  const readValue = (key: UtmKey) =>
    normalizeAttributionValue(attribution?.[key] ?? null) ?? null

  return {
    firstTouch: {
      referrerHost: attribution?.firstReferrerHost ?? null,
      landingPath:
        normalizeLandingPath(attribution?.firstLandingPath) ??
        fallback.landingPath,
      landingLocale: attribution?.firstLandingLocale ?? fallback.locale,
      sourceCategory: attribution?.sourceCategory ?? "direct",
      sourceName: attribution?.sourceName ?? null,
    },
    utm: {
      source: readValue("utm_source"),
      medium: readValue("utm_medium"),
      campaign: readValue("utm_campaign"),
      term: readValue("utm_term"),
      content: readValue("utm_content"),
    },
  }
}

export function readFirstTouchAttribution(
  storage: Pick<Storage, "getItem">,
): FirstTouchAttribution | null {
  try {
    const stored = storage.getItem(attributionStorageKey)
    return stored ? (JSON.parse(stored) as FirstTouchAttribution) : null
  } catch {
    return null
  }
}

export function captureFirstTouchAttribution({
  search,
  landingPath,
  referrer,
  currentHost,
  storage,
  now = () => new Date(),
}: {
  search: string
  landingPath: string
  referrer: string
  currentHost: string
  storage: StorageReader
  now?: () => Date
}): FirstTouchAttribution | null {
  const existing = readFirstTouchAttribution(storage)
  if (existing) return existing

  const parameters = new URLSearchParams(search)
  const utmValues = Object.fromEntries(
    utmKeys.flatMap((key) => {
      const value = normalizeAttributionValue(parameters.get(key))
      return value ? [[key, value]] : []
    }),
  ) as Partial<Record<UtmKey, string>>

  const firstReferrerHost = referrerHost(referrer)
  const source = classifyAttributionSource({
    hasCampaign: Object.keys(utmValues).length > 0,
    referrer,
    referrerHost: firstReferrerHost,
    currentHost,
  })
  const firstLandingPath = normalizeLandingPath(landingPath) ?? "/"

  const attribution: FirstTouchAttribution = {
    ...utmValues,
    capturedAt: now().toISOString(),
    firstLandingPath,
    firstLandingLocale:
      firstLandingPath === "/es" || firstLandingPath.startsWith("/es/")
        ? "es"
        : "en",
    firstReferrerHost,
    sourceCategory: source.category,
    sourceName: source.name,
  }

  try {
    storage.setItem(attributionStorageKey, JSON.stringify(attribution))
  } catch {
    return attribution
  }

  return attribution
}

function normalizeLandingPath(value: unknown): string | undefined {
  const normalized = normalizeAttributionValue(value)
  if (!normalized?.startsWith("/")) return undefined

  return normalized.split(/[?#]/, 1)[0] || "/"
}

function referrerHost(referrer: string): string | null {
  if (!referrer.trim()) return null

  try {
    return new URL(referrer).hostname.toLowerCase().slice(0, 253) || null
  } catch {
    return null
  }
}

function isGoogleHost(host: string) {
  return /(^|\.)google\.[a-z.]+$/i.test(host)
}

function classifyAttributionSource({
  hasCampaign,
  referrer,
  referrerHost: host,
  currentHost,
}: {
  hasCampaign: boolean
  referrer: string
  referrerHost: string | null
  currentHost: string
}): {
  category: AttributionSourceCategory
  name: AttributionSourceName
} {
  if (hasCampaign) return { category: "campaign", name: null }
  if (!referrer.trim()) return { category: "direct", name: null }
  if (!host) return { category: "unknown", name: null }
  if (host === currentHost.toLowerCase()) {
    return { category: "direct", name: null }
  }
  if (isGoogleHost(host)) {
    return { category: "organic_search", name: "google" }
  }
  if (host === "bing.com" || host.endsWith(".bing.com")) {
    return { category: "organic_search", name: "bing" }
  }
  if (host === "chatgpt.com" || host.endsWith(".chatgpt.com")) {
    return { category: "ai_referral", name: "chatgpt" }
  }

  return { category: "referral", name: "other" }
}

export { attributionStorageKey }
