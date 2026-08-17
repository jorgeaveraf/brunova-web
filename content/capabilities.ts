import type { Capability } from "@/content/types"

export const capabilities = [
  {
    slug: "systems-architecture-internal-platforms",
    index: "01",
    name: "Systems Architecture & Internal Platforms",
    shortDescription:
      "We design system boundaries, services, operating models and internal platforms around critical business operations.",
    outcomes: [
      "Reusable internal services",
      "Internal platforms",
      "Maintainable system ownership",
      "Reduced key-person dependency",
      "Clearer architecture",
    ],
    relatedWork: ["multi-tenant-financial-integration-platform"],
  },
  {
    slug: "data-integration-engineering",
    index: "02",
    name: "Data & Integration Engineering",
    shortDescription:
      "We connect APIs, databases, SaaS platforms, warehouses and operational data flows with explicit semantics and ownership.",
    outcomes: [
      "Reliable synchronization",
      "Data pipelines",
      "Warehouses",
      "Shared integration services",
      "Trustworthy reporting foundations",
    ],
    relatedWork: [
      "multi-tenant-financial-integration-platform",
      "operational-finance-data-infrastructure",
    ],
  },
  {
    slug: "financial-operational-automation",
    index: "03",
    name: "Financial & Operational Automation",
    shortDescription:
      "We build controlled automation for critical financial and operational workflows, including accounting integrations, reconciliation, reporting, AR/AP and inventory-related operations.",
    outcomes: [
      "Controlled financial workflows",
      "Reconciliation infrastructure",
      "Operational reporting",
      "Reliable accounting integrations",
    ],
    relatedWork: [
      "multi-tenant-financial-integration-platform",
      "operational-finance-data-infrastructure",
    ],
  },
  {
    slug: "workflow-process-engineering",
    index: "04",
    name: "Workflow / Process Engineering",
    shortDescription:
      "We redesign the process before automating it: states, owners, approvals, exceptions, human review and escalation.",
    outcomes: [
      "Clearer handoffs",
      "Explicit state",
      "Fewer hidden manual steps",
      "Automation that survives real-world exceptions",
    ],
    relatedWork: ["document-intelligence-workflow"],
  },
  {
    slug: "modernization-fragile-automations",
    index: "05",
    name: "Modernization of Fragile Automations",
    shortDescription:
      "We take automations that already work but are brittle, opaque or person-dependent and move them toward stronger architecture and operations.",
    outcomes: [
      "Observability",
      "Recovery",
      "Idempotency",
      "Documentation",
      "Maintainability",
      "Clearer ownership",
    ],
    relatedWork: ["fragile-automation-modernization"],
  },
] as const satisfies readonly Capability[]
