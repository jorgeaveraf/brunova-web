import type { Capability } from "@/content/types"

export const capabilities = [
  {
    slug: "systems-architecture-internal-platforms",
    index: "01",
    name: "Systems Architecture & Internal Platforms",
    navigationLabel: "Architecture",
    shortDescription:
      "We design system boundaries, services, operating models and internal platforms around critical business operations.",
    problemClass:
      "Critical operations have grown without a shared boundary or clear ownership.",
    approach:
      "We define the operating model, services and platform around the operation.",
    operationalConcerns: [
      "System boundaries",
      "Service ownership",
      "Maintainability",
    ],
    outcomes: [
      "Reusable internal services",
      "Internal platforms",
      "Clearer architecture",
    ],
    relatedWork: ["multi-tenant-financial-integration-platform"],
  },
  {
    slug: "data-integration-engineering",
    index: "02",
    name: "Data & Integration Engineering",
    navigationLabel: "Data & integration",
    shortDescription:
      "We connect APIs, databases, SaaS platforms, warehouses and operational data flows with explicit semantics and ownership.",
    problemClass:
      "Distributed data lacks consistent meaning, movement and ownership.",
    approach:
      "We define data semantics and ownership before connecting sources inside a controlled boundary.",
    operationalConcerns: [
      "Source ownership",
      "Reference resolution",
      "Synchronization and recovery",
    ],
    outcomes: [
      "Reliable synchronization",
      "Data pipelines",
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
    navigationLabel: "Financial automation",
    shortDescription:
      "We build controlled automation for critical financial and operational workflows, including accounting integrations, reconciliation, reporting, AR/AP and inventory-related operations.",
    problemClass:
      "Critical financial work depends on manual handoffs and disconnected automations.",
    approach:
      "We engineer rules, reconciliation, exceptions and ownership into one controlled system.",
    operationalConcerns: [
      "Reconciliation",
      "Exception handling",
      "Operational ownership",
    ],
    outcomes: [
      "Controlled financial workflows",
      "Reconciliation infrastructure",
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
    navigationLabel: "Process engineering",
    shortDescription:
      "We redesign the process before automating it: states, owners, approvals, exceptions, human review and escalation.",
    problemClass:
      "A process loses control when ownership changes, exceptions appear or judgment is required.",
    approach:
      "We define states, ownership, approvals, exceptions and human review before automating.",
    operationalConcerns: [
      "State and handoffs",
      "Approvals and escalation",
      "Exception paths",
    ],
    outcomes: [
      "Clearer handoffs",
      "Explicit state",
      "Automation that survives real-world exceptions",
    ],
    relatedWork: ["document-intelligence-workflow"],
  },
  {
    slug: "modernization-fragile-automations",
    index: "05",
    name: "Modernization of Fragile Automations",
    navigationLabel: "Automation modernization",
    shortDescription:
      "We take automations that already work but are brittle, opaque or person-dependent and move them toward stronger architecture and operations.",
    problemClass:
      "Useful automations are brittle, opaque or dependent on one person.",
    approach:
      "We preserve working behavior while adding the controls required to operate and evolve it.",
    operationalConcerns: [
      "Observability",
      "Recovery and idempotency",
      "Deployment discipline",
    ],
    outcomes: ["Observability", "Recovery", "Maintainability"],
    relatedWork: ["fragile-automation-modernization"],
  },
] as const satisfies readonly Capability[]
