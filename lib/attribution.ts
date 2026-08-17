const attributionStorageKey = "brunova:first-touch-attribution:v1"

const utmKeys = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_term",
  "utm_content",
] as const

type UtmKey = (typeof utmKeys)[number]

export type ContactAttribution = {
  source: string | null
  medium: string | null
  campaign: string | null
  term: string | null
  content: string | null
}

export type FirstTouchAttribution = Partial<Record<UtmKey, string>> & {
  capturedAt: string
  landingPath: string
  referrer?: string
}

type StorageReader = Pick<Storage, "getItem" | "setItem">

function normalizeAttributionValue(value: unknown): string | undefined {
  const normalized = typeof value === "string" ? value.trim().slice(0, 200) : ""
  return normalized || undefined
}

export function contactAttributionFromStorage(
  storage: Pick<Storage, "getItem">,
): ContactAttribution {
  const attribution = readFirstTouchAttribution(storage)

  const readValue = (key: UtmKey) =>
    normalizeAttributionValue(attribution?.[key] ?? null) ?? null

  return {
    source: readValue("utm_source"),
    medium: readValue("utm_medium"),
    campaign: readValue("utm_campaign"),
    term: readValue("utm_term"),
    content: readValue("utm_content"),
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
  storage,
  now = () => new Date(),
}: {
  search: string
  landingPath: string
  referrer: string
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

  if (Object.keys(utmValues).length === 0) return null

  const attribution: FirstTouchAttribution = {
    ...utmValues,
    capturedAt: now().toISOString(),
    landingPath,
    ...(normalizeAttributionValue(referrer)
      ? { referrer: normalizeAttributionValue(referrer) }
      : {}),
  }

  try {
    storage.setItem(attributionStorageKey, JSON.stringify(attribution))
  } catch {
    return attribution
  }

  return attribution
}

export { attributionStorageKey }
