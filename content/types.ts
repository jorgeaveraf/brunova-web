import type { AnalyticsEventName } from "@/lib/analytics/events"

export type SitePath = "/" | `/${string}`

export type NavigationItem = {
  label: string
  href: SitePath
  analyticsEvent?: AnalyticsEventName
}

export type SiteConfig = {
  name: string
  description: string
  descriptor: string
  primaryAction: NavigationItem
}

export type Capability = {
  slug: string
  index: string
  name: string
  shortDescription: string
  outcomes: readonly string[]
  relatedWork: readonly string[]
}

export type ProcessStage = {
  index: string
  verb: string
  name: string
  description: string
  timeline: string
}

export type WorkCase = {
  slug: string
  homepageTitle: string
  title: string
  summary: string
  capabilitySignals: readonly string[]
  publicationStatus: "approved-summary"
  detailStatus: "publication-review-required"
}

export type HomepageSymptom = {
  name: string
  consequence: string
}

export type OperationalIntelligenceElement = {
  name: string
  role: string
}

export type Differentiator = {
  title: string
  description: string
}
