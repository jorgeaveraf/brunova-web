import type { ProcessStage } from "@/content/types"

export const processStages = [
  {
    index: "01",
    verb: "Discover",
    name: "Systems Discovery",
    description:
      "We turn an unclear operational problem into a clear system problem with evidence, boundaries and a recommended next step.",
    timeline: "1–2 weeks",
  },
  {
    index: "02",
    verb: "Design",
    name: "Architecture Blueprint",
    description:
      "We turn a known operational problem into a build-ready technical and operational design.",
    timeline: "2–4 weeks",
  },
  {
    index: "03",
    verb: "Build",
    name: "Implementation Sprint",
    description:
      "We build and operationalize a defined production system capability.",
    timeline: "4–8 weeks per defined scope",
  },
  {
    index: "04",
    verb: "Evolve",
    name: "Managed Evolution",
    description:
      "We stay close to important production systems, continuously improving reliability, architecture and capability as the business changes.",
    timeline: "Ongoing monthly engagement",
  },
] as const satisfies readonly ProcessStage[]
