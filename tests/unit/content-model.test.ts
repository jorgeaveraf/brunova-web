import { describe, expect, it } from "vitest"

import { capabilities } from "@/content/capabilities"
import { primaryNavigation } from "@/content/navigation"
import { processStages } from "@/content/process"
import { workCases } from "@/content/work"

describe("typed public content", () => {
  it("contains the approved record counts and unique slugs", () => {
    expect(capabilities).toHaveLength(5)
    expect(processStages).toHaveLength(4)
    expect(workCases).toHaveLength(4)
    expect(primaryNavigation.map((item) => item.label)).toEqual([
      "Capabilities",
      "Process",
      "Work",
      "About",
    ])

    expect(new Set(capabilities.map((item) => item.slug)).size).toBe(5)
    expect(new Set(workCases.map((item) => item.slug)).size).toBe(4)
  })

  it("keeps commercial pricing out of the public records", () => {
    const publicContent = JSON.stringify({
      capabilities,
      processStages,
      workCases,
    })

    expect(publicContent).not.toContain("$999")
    expect(publicContent).not.toContain("$1,999")
    expect(publicContent.toLowerCase()).not.toContain("minimum price")
  })
})
