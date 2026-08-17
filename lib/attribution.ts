const attributionStorageKey = "brunova:first-touch-attribution:v1"

const utmKeys = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_term",
  "utm_content",
] as const

type UtmKey = (typeof utmKeys)[number]

export type FirstTouchAttribution = Partial<Record<UtmKey, string>> & {
  capturedAt: string
  landingPath: string
  referrer?: string
}

type StorageReader = Pick<Storage, "getItem" | "setItem">

function normalizeAttributionValue(value: string | null): string | undefined {
  const normalized = value?.trim().slice(0, 256)
  return normalized || undefined
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
