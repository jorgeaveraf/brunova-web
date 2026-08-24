import type { ProcessStage } from "@/content/types"

export const processStages = [
  {
    index: "01",
    verb: "Discover",
    name: "Systems Discovery",
    description:
      "We turn an unclear operational situation into a defined system problem.",
    timeline: "1–2 weeks",
    problemSolved:
      "The system problem, boundary and source of failure are unclear.",
    entryKnowledge:
      "The operation and the consequences of its current behavior are known.",
    establishes: [
      "Evidence about the current operation",
      "A defensible problem and system boundary",
      "A recommended next step",
    ],
    nextStep: "A defined problem can move into an Architecture Blueprint.",
  },
  {
    index: "02",
    verb: "Design",
    name: "Architecture Blueprint",
    description:
      "We turn a known problem into a build-ready operating and technical design.",
    timeline: "2–4 weeks",
    problemSolved:
      "The problem is understood, but the system is not yet defined well enough to build.",
    entryKnowledge:
      "The problem and desired boundary are known through Discovery or prior work.",
    establishes: [
      "A build-ready system boundary",
      "Technical and operational design decisions",
      "A defined implementation path",
    ],
    nextStep: "A defined architecture can move into an Implementation Sprint.",
  },
  {
    index: "03",
    verb: "Build",
    name: "Implementation Sprint",
    description: "We build and operationalize a defined system capability.",
    timeline: "4–8 weeks per defined scope",
    problemSolved:
      "A defined capability must become an operable production system.",
    entryKnowledge:
      "Architecture, scope and operational governance are defined.",
    establishes: [
      "The agreed production capability",
      "Operational governance and handoff",
      "The controls required by the defined scope",
    ],
    nextStep:
      "The system can transfer to its operating team or continue into Managed Evolution.",
  },
  {
    index: "04",
    verb: "Evolve",
    name: "Managed Evolution",
    description:
      "We improve the reliability, architecture and capability of important production systems.",
    timeline: "Ongoing monthly engagement",
    problemSolved:
      "A production system must evolve as operating conditions and risks change.",
    entryKnowledge:
      "A production system exists and its team can identify the current pressure.",
    establishes: [
      "A continuing improvement boundary",
      "Prioritized reliability and architecture work",
      "Operational context close to the work",
    ],
    nextStep:
      "Evolution continues while the system remains critical and the work remains useful.",
  },
] as const satisfies readonly ProcessStage[]
