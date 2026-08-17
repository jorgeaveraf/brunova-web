import type { WorkCase } from "@/content/types"

export const workCases = [
  {
    slug: "multi-tenant-financial-integration-platform",
    title:
      "A shared financial integration layer across multiple operating entities",
    summary:
      "A reusable accounting integration platform centralizing OAuth lifecycle, financial reads and writes, reference resolution, recurring reporting and downstream operational access.",
    capabilitySignals: [
      "Systems Architecture",
      "Financial Automation",
      "API / Integration Engineering",
      "Reliability",
    ],
    publicationStatus: "approved-summary",
    detailStatus: "publication-review-required",
  },
  {
    slug: "operational-finance-data-infrastructure",
    title:
      "Turning recurring financial reporting into shared operational infrastructure",
    summary:
      "Automated extraction and reporting pipelines connecting accounting and operational systems to a data warehouse and business-facing spreadsheets, giving non-technical teams consistent access to financial information.",
    capabilitySignals: [
      "Data Engineering",
      "Operational Intelligence",
      "Reporting Infrastructure",
      "Integration Engineering",
    ],
    publicationStatus: "approved-summary",
    detailStatus: "publication-review-required",
  },
  {
    slug: "document-intelligence-workflow",
    title: "AI-assisted document processing with control built in",
    summary:
      "A document-processing system combining classification, structured extraction, validation, human review and downstream workflow integration for operationally sensitive documents.",
    capabilitySignals: [
      "Workflow Engineering",
      "AI-enabled Systems",
      "Human-in-the-loop",
      "Reliability",
    ],
    publicationStatus: "approved-summary",
    detailStatus: "publication-review-required",
  },
  {
    slug: "fragile-automation-modernization",
    title: "From person-dependent workflows to operable systems",
    summary:
      "Modernization of automation estates by introducing clearer boundaries, observability, recovery, idempotency, deployment discipline and operational documentation without rewriting working behavior unnecessarily.",
    capabilitySignals: [
      "Modernization",
      "Systems Architecture",
      "Reliability",
      "Operational Engineering",
    ],
    publicationStatus: "approved-summary",
    detailStatus: "publication-review-required",
  },
] as const satisfies readonly WorkCase[]
