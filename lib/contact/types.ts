export const contactResponseCodes = [
  "VALIDATION_ERROR",
  "RATE_LIMITED",
  "REQUEST_REJECTED",
  "SERVICE_UNAVAILABLE",
  "INTERNAL_ERROR",
] as const

export type ContactResponseCode = (typeof contactResponseCodes)[number]

export type ContactFieldErrors = Readonly<Record<string, readonly string[]>>

export type ContactResponse =
  | { ok: true }
  | {
      ok: false
      code: ContactResponseCode
      message: string
      fieldErrors?: ContactFieldErrors
    }

export type ContactUtm = {
  source: string | null
  medium: string | null
  campaign: string | null
  term: string | null
  content: string | null
}

export type ContactFirstTouch = {
  referrerHost: string | null
  landingPath: string
  landingLocale: "en" | "es"
  sourceCategory:
    | "campaign"
    | "organic_search"
    | "ai_referral"
    | "referral"
    | "direct"
    | "unknown"
  sourceName: "google" | "bing" | "chatgpt" | "other" | null
}

export type ContactEnvelope = {
  request_id: string
  idempotency_key: string
  source: "brunova_website"
  form: "contact_v2"
  submitted_at: string
  locale?: "en" | "es"
  name: string
  email: string
  company: string
  role: string
  problem_category: string
  problem_description: string
  page_path: "/contact" | "/es/contact"
  first_touch: {
    referrer_host: string | null
    landing_path: string
    landing_locale: "en" | "es"
    source_category: ContactFirstTouch["sourceCategory"]
    source_name: ContactFirstTouch["sourceName"]
  }
  utm: ContactUtm
}
