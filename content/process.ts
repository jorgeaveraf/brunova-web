import type { ProcessStage } from "@/content/types"

export const processStages = [
  {
    index: "01",
    verb: "Discover",
    name: "Systems Discovery",
    description:
      "We turn an unclear operational problem into a clear system problem with evidence, boundaries and a recommended next step.",
    timeline: "1–2 weeks",
    problemSolved:
      "The operation matters, but the actual system problem, its boundary and the source of failure are still unclear.",
    entryKnowledge:
      "You can identify the operation and the consequences of its current behavior; a complete technical diagnosis is not required.",
    establishes: [
      "Evidence about the current operation",
      "A defensible problem and system boundary",
      "A recommended next step",
    ],
    nextStep:
      "A known system problem can move into an Architecture Blueprint when a build-ready design is needed.",
  },
  {
    index: "02",
    verb: "Design",
    name: "Architecture Blueprint",
    description:
      "We turn a known operational problem into a build-ready technical and operational design.",
    timeline: "2–4 weeks",
    problemSolved:
      "The problem is understood, but the technical and operational design is not yet precise enough to build responsibly.",
    entryKnowledge:
      "The operational problem and desired boundary are known, whether through Discovery or prior internal work.",
    establishes: [
      "A build-ready system boundary",
      "Technical and operational design decisions",
      "A defined implementation path",
    ],
    nextStep:
      "A defined architecture can move into an Implementation Sprint with Brunova or an appropriate delivery team.",
  },
  {
    index: "03",
    verb: "Build",
    name: "Implementation Sprint",
    description:
      "We build and operationalize a defined production system capability.",
    timeline: "4–8 weeks per defined scope",
    problemSolved:
      "A defined capability needs to become a production system that can be operated, not only a technical deliverable.",
    entryKnowledge:
      "The architecture, scope and operational responsibility are defined before implementation begins.",
    establishes: [
      "The agreed production capability",
      "Operational ownership and handoff",
      "The controls required by the defined scope",
    ],
    nextStep:
      "The system can transition to its operating owner or continue into Managed Evolution when ongoing proximity is valuable.",
  },
  {
    index: "04",
    verb: "Evolve",
    name: "Managed Evolution",
    description:
      "We stay close to important production systems, continuously improving reliability, architecture and capability as the business changes.",
    timeline: "Ongoing monthly engagement",
    problemSolved:
      "An important production system must keep improving as operating conditions, risks and business needs change.",
    entryKnowledge:
      "A production system already exists and its current owners can identify the reliability or capability pressure around it.",
    establishes: [
      "A continuing improvement boundary",
      "Prioritized reliability and architecture work",
      "Operational context that remains close to delivery",
    ],
    nextStep:
      "Evolution continues for as long as the system remains important and the engagement remains useful.",
  },
] as const satisfies readonly ProcessStage[]
