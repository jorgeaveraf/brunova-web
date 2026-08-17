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
      "Critical operations have grown across local tools and decisions without a shared system boundary, service model or clear ownership.",
    approach:
      "Brunova starts with the operation—its data, decisions, failure paths and owners—then defines the boundaries, services and internal platform needed to support it.",
    operationalConcerns: [
      "System boundaries",
      "Service ownership",
      "Key-person dependency",
      "Maintainability as the operation changes",
    ],
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
    navigationLabel: "Data & integration",
    shortDescription:
      "We connect APIs, databases, SaaS platforms, warehouses and operational data flows with explicit semantics and ownership.",
    problemClass:
      "Operational data is distributed across systems, but its meaning, movement and ownership are not reliable enough for shared use.",
    approach:
      "Brunova defines the semantics and ownership of each flow before connecting APIs, databases, SaaS platforms and warehouses into a controlled integration boundary.",
    operationalConcerns: [
      "Source ownership",
      "Reference resolution",
      "Synchronization and recovery",
      "Reporting trust",
    ],
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
    navigationLabel: "Financial automation",
    shortDescription:
      "We build controlled automation for critical financial and operational workflows, including accounting integrations, reconciliation, reporting, AR/AP and inventory-related operations.",
    problemClass:
      "Important financial and operational work depends on manual handoffs or loosely connected automations across accounting, reporting and inventory-related processes.",
    approach:
      "Brunova engineers the system around operational rules, reconciliation, exceptions and ownership. The work supports financial operations; it is not accounting advice or an accounting service.",
    operationalConcerns: [
      "Reconciliation",
      "Exception handling",
      "Operational ownership",
      "Reporting continuity",
    ],
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
    navigationLabel: "Process engineering",
    shortDescription:
      "We redesign the process before automating it: states, owners, approvals, exceptions, human review and escalation.",
    problemClass:
      "A process works in its standard path but loses control when ownership changes, exceptions appear or judgment is required.",
    approach:
      "Brunova makes states, owners, approvals, exceptions, human review and escalation explicit before choosing what should be automated.",
    operationalConcerns: [
      "State and handoffs",
      "Approvals and escalation",
      "Exception paths",
      "Human review",
    ],
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
    navigationLabel: "Automation modernization",
    shortDescription:
      "We take automations that already work but are brittle, opaque or person-dependent and move them toward stronger architecture and operations.",
    problemClass:
      "Existing automations deliver useful behavior, but they are brittle, opaque, difficult to recover or dependent on one person.",
    approach:
      "Brunova preserves working behavior where possible while introducing clearer boundaries, observability, recovery, idempotency, deployment discipline and documentation.",
    operationalConcerns: [
      "Observability",
      "Recovery and idempotency",
      "Deployment discipline",
      "Documentation and ownership",
    ],
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
