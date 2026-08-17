import type { WorkDetail } from "@/content/types"

export const workDetails = [
  {
    slug: "multi-tenant-financial-integration-platform",
    context:
      "Multiple operating entities needed a shared way to reach accounting operations and recurring financial information.",
    operationalProblem:
      "Authentication lifecycle, financial reads and writes, reference resolution and reporting belonged to one operational boundary, but each concern needed consistent handling across entities.",
    systemApproach:
      "A reusable accounting integration platform centralized OAuth lifecycle, financial reads and writes, reference resolution, recurring reporting and downstream operational access.",
    systemBoundary: {
      summary:
        "Operating entities enter one controlled integration boundary before financial operations and reporting become available downstream.",
      steps: [
        {
          label: "Operating entities",
          role: "Multiple entities requiring consistent accounting access",
        },
        {
          label: "Connection lifecycle",
          role: "Centralized OAuth and reference resolution",
        },
        {
          label: "Financial operations",
          role: "Reads, writes and recurring reporting",
        },
        {
          label: "Operational access",
          role: "Reusable downstream access to the shared layer",
        },
      ],
    },
    engineeringDecisions: [
      "Centralize connection lifecycle and reference resolution in a shared layer.",
      "Support both financial reads and writes inside the same defined boundary.",
      "Make recurring reporting and downstream operational access consumers of the reusable platform.",
    ],
    outcome:
      "A shared financial integration layer designed for reuse across multiple operating entities.",
    capabilities: [
      {
        label: "Systems Architecture",
        capabilitySlug: "systems-architecture-internal-platforms",
      },
      {
        label: "Financial Automation",
        capabilitySlug: "financial-operational-automation",
      },
      {
        label: "API / Integration Engineering",
        capabilitySlug: "data-integration-engineering",
      },
    ],
  },
  {
    slug: "operational-finance-data-infrastructure",
    context:
      "Recurring financial reporting depended on information held across accounting and operational systems, while non-technical teams needed consistent business-facing access.",
    operationalProblem:
      "The source systems, reporting pipeline and spreadsheet access needed to behave as shared operational infrastructure rather than separate reporting tasks.",
    systemApproach:
      "Automated extraction and reporting pipelines connected accounting and operational systems to a data warehouse and business-facing spreadsheets.",
    systemBoundary: {
      summary:
        "Source data moves through a shared reporting boundary before it reaches the business-facing spreadsheet layer.",
      steps: [
        {
          label: "Source systems",
          role: "Accounting and operational information",
        },
        {
          label: "Extraction pipeline",
          role: "Automated movement from operational sources",
        },
        {
          label: "Data warehouse",
          role: "Shared reporting foundation",
        },
        {
          label: "Business access",
          role: "Consistent information in familiar spreadsheets",
        },
      ],
    },
    engineeringDecisions: [
      "Connect accounting and operational sources through one reporting pipeline.",
      "Use the warehouse as shared infrastructure rather than a final user interface.",
      "Preserve business-facing spreadsheet access for non-technical teams.",
    ],
    outcome:
      "A reporting path that gives non-technical teams consistent access to recurring financial information.",
    capabilities: [
      {
        label: "Data Engineering",
        capabilitySlug: "data-integration-engineering",
      },
      {
        label: "Financial Automation",
        capabilitySlug: "financial-operational-automation",
      },
      {
        label: "Systems Architecture",
        capabilitySlug: "systems-architecture-internal-platforms",
      },
    ],
  },
  {
    slug: "document-intelligence-workflow",
    context:
      "Operationally sensitive documents needed structured processing without removing the controls that human judgment requires.",
    operationalProblem:
      "Classification and extraction alone were not enough; the workflow also needed validation, human review and a controlled downstream handoff.",
    systemApproach:
      "A document-processing system combined classification, structured extraction, validation, human review and downstream workflow integration.",
    systemBoundary: {
      summary:
        "Automation prepares structured information, while validation and human review remain explicit gates before downstream use.",
      steps: [
        {
          label: "Document intake",
          role: "Operationally sensitive source documents",
        },
        {
          label: "Classification + extraction",
          role: "AI-assisted structured processing",
        },
        {
          label: "Validation + review",
          role: "Control boundary with human judgment",
        },
        {
          label: "Downstream workflow",
          role: "Reviewed information enters the operating process",
        },
      ],
    },
    engineeringDecisions: [
      "Separate classification and structured extraction from validation.",
      "Keep human review inside the system boundary rather than treating it as an exception outside the workflow.",
      "Integrate reviewed outputs with the downstream operational process.",
    ],
    safeguards: [
      "Structured validation before downstream use",
      "Human review for operationally sensitive documents",
      "A defined handoff into the downstream workflow",
    ],
    outcome:
      "A controlled document-intelligence workflow in which AI assists while judgment remains bounded and governed.",
    capabilities: [
      {
        label: "Workflow Engineering",
        capabilitySlug: "workflow-process-engineering",
      },
      {
        label: "Systems Architecture",
        capabilitySlug: "systems-architecture-internal-platforms",
      },
    ],
  },
  {
    slug: "fragile-automation-modernization",
    context:
      "An existing automation estate delivered useful behavior but had become brittle, opaque and dependent on individual knowledge.",
    operationalProblem:
      "The operating risk came from unclear boundaries, weak observability and recovery, and insufficient deployment and operational documentation.",
    scalingConstraint:
      "Working behavior did not justify an unnecessary rewrite, but the surrounding operating model was not strong enough for continued change.",
    systemApproach:
      "The modernization introduced clearer boundaries, observability, recovery, idempotency, deployment discipline and operational documentation while preserving working behavior where possible.",
    systemBoundary: {
      summary:
        "The useful automation remains, while an explicit operating boundary is added around failure, recovery, deployment and ownership.",
      steps: [
        {
          label: "Working behavior",
          role: "Existing automation worth preserving",
        },
        {
          label: "Clear boundaries",
          role: "Defined responsibilities and ownership",
        },
        {
          label: "Operability controls",
          role: "Observability, recovery and idempotency",
        },
        {
          label: "Managed system",
          role: "Disciplined deployment and operational documentation",
        },
      ],
    },
    engineeringDecisions: [
      "Preserve working behavior instead of rewriting it without cause.",
      "Introduce clearer system boundaries before extending capability.",
      "Treat deployment discipline and documentation as part of the system.",
    ],
    safeguards: [
      "Observability",
      "Recovery",
      "Idempotency",
      "Operational documentation",
    ],
    outcome:
      "A more operable automation estate with clearer ownership and stronger maintainability.",
    capabilities: [
      {
        label: "Modernization",
        capabilitySlug: "modernization-fragile-automations",
      },
      {
        label: "Systems Architecture",
        capabilitySlug: "systems-architecture-internal-platforms",
      },
    ],
  },
] as const satisfies readonly WorkDetail[]

export function getWorkDetail(slug: string): WorkDetail | undefined {
  return workDetails.find((detail) => detail.slug === slug)
}
