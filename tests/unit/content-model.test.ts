import { describe, expect, it } from "vitest"

import { capabilities } from "@/content/capabilities"
import { aboutNarrative, companyModel } from "@/content/about"
import {
  differentiators,
  homepage,
  homepageSymptoms,
  operationalIntelligenceElements,
} from "@/content/home"
import { primaryNavigation } from "@/content/navigation"
import { processStages } from "@/content/process"
import { privacyContent } from "@/content/privacy"
import { workCases } from "@/content/work"
import { workDetails } from "@/content/work-details"

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
    expect(workDetails.map((item) => item.slug)).toEqual(
      workCases.map((item) => item.slug),
    )
  })

  it("provides Phase 4 depth without adding top-level records", () => {
    for (const capability of capabilities) {
      expect(capability.problemClass.length).toBeGreaterThan(40)
      expect(capability.approach.length).toBeGreaterThan(40)
      expect(capability.operationalConcerns.length).toBeGreaterThanOrEqual(4)
    }

    for (const stage of processStages) {
      expect(stage.problemSolved.length).toBeGreaterThan(40)
      expect(stage.entryKnowledge.length).toBeGreaterThan(40)
      expect(stage.establishes.length).toBeGreaterThanOrEqual(3)
      expect(stage.nextStep.length).toBeGreaterThan(40)
    }

    for (const detail of workDetails) {
      expect(detail.systemBoundary.steps).toHaveLength(4)
      expect(detail.engineeringDecisions.length).toBeGreaterThanOrEqual(3)
      expect(detail.capabilities.length).toBeGreaterThanOrEqual(2)
    }
  })

  it("preserves the approved company and privacy boundaries", () => {
    expect(aboutNarrative.observation).toBe(
      "Brunova was built around a simple observation: as companies grow, important operations often become collections of spreadsheets, SaaS tools, scripts and automations before anyone deliberately designs the system behind them.",
    )
    expect(aboutNarrative.boundary).toBe(
      "We work at that boundary—where process, data, software and automation meet—to turn those operations into systems that are easier to trust, operate and evolve.",
    )
    expect(companyModel).toHaveLength(4)
    expect(privacyContent.reviewStatus).toBe(
      "legal-human-review-required-before-production",
    )
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
    expect(homepageSymptoms.at(-2)?.consequence).toBe(
      "The standard process works; exceptions break it.",
    )
    expect(operationalIntelligenceElements.at(-1)?.role).toBe(
      "assists where judgment can be bounded and governed",
    )
  })

  it("keeps commercial pricing out of the public records", () => {
    const publicContent = JSON.stringify({
      capabilities,
      processStages,
      workCases,
      homepage,
      homepageSymptoms,
      differentiators,
      workDetails,
      aboutNarrative,
      companyModel,
      privacyContent,
    })

    expect(publicContent).not.toContain("$999")
    expect(publicContent).not.toContain("$1,999")
    expect(publicContent.toLowerCase()).not.toContain("minimum price")
    expect(publicContent).not.toContain("HQ")
    expect(publicContent).not.toContain("OTW")
  })
})
