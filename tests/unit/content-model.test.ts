import { describe, expect, it } from "vitest"

import { capabilities } from "@/content/capabilities"
import { differentiators, homepage, homepageSymptoms } from "@/content/home"
import { primaryNavigation } from "@/content/navigation"
import { processStages } from "@/content/process"
import { workCases } from "@/content/work"

describe("typed public content", () => {
  it("contains the approved record counts and unique slugs", () => {
    expect(capabilities).toHaveLength(5)
    expect(processStages).toHaveLength(4)
    expect(workCases).toHaveLength(4)
    expect(homepageSymptoms).toHaveLength(8)
    expect(differentiators).toHaveLength(3)
    expect(primaryNavigation.map((item) => item.label)).toEqual([
      "Capabilities",
      "Process",
      "Work",
      "About",
    ])

    expect(new Set(capabilities.map((item) => item.slug)).size).toBe(5)
    expect(new Set(workCases.map((item) => item.slug)).size).toBe(4)
  })

  it("preserves the approved homepage content contract", () => {
    expect(homepage.hero.title).toBe(
      "Systems for operations that have outgrown their tools.",
    )
    expect(homepage.hero.primaryAction).toBe("Start a conversation")
    expect(homepage.hero.secondaryAction).toBe("Explore our work")
    expect(workCases.map((work) => work.homepageTitle)).toEqual([
      "Multi-tenant Financial Integration Platform",
      "Operational Finance Data Infrastructure",
      "Document Intelligence Workflow",
      "Fragile Automation Modernization",
    ])
    expect(differentiators.map((item) => item.title)).toEqual([
      "Architecture before tools",
      "Systems, not workflows",
      "Close to operations",
    ])
  })

  it("keeps commercial pricing out of the public records", () => {
    const publicContent = JSON.stringify({
      capabilities,
      processStages,
      workCases,
      homepage,
      homepageSymptoms,
      differentiators,
    })

    expect(publicContent).not.toContain("$999")
    expect(publicContent).not.toContain("$1,999")
    expect(publicContent.toLowerCase()).not.toContain("minimum price")
  })
})
