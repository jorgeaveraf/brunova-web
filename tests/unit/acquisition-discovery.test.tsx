import { render, screen, fireEvent } from "@testing-library/react"
import { it, expect, vi, afterEach } from "vitest"
import { DiscoverySection } from "@/components/acquisition/discovery"
import { acquisitionApi as api } from "@/lib/acquisition-api"
import axe from "axe-core"
afterEach(() => vi.restoreAllMocks())
it("authoritative Discovery pause overrides a waiting projection without deleting candidates", async () => {
  vi.spyOn(api, "discovery").mockResolvedValue({ ...empty, state: "WAITING" })
  vi.spyOn(api, "cycleReview").mockResolvedValue({
    schemaVersion: "1",
    review: { control: { discovery_stop_reason: "Synthetic identity review" } },
  } as Awaited<ReturnType<typeof api.cycleReview>>)
  render(<DiscoverySection locale="en" cycleId="synthetic" />)
  expect(await screen.findByText(/Discovery paused for review/)).toBeVisible()
  expect(
    screen.queryByText(/Waiting for the next authorized/),
  ).not.toBeInTheDocument()
})
const empty: Awaited<ReturnType<typeof api.discovery>> = {
  schemaVersion: "1",
  state: "NO_ACTIVE_CYCLE",
  totals: {
    observations: 0,
    candidates: 0,
    resolved: 0,
    ambiguous: 0,
    unresolved: 0,
    held: 0,
    admitted: 0,
    pending_work: 0,
  },
  sources: [],
  candidates: [],
  planning: [],
  missions: [],
  displayLimits: { missions: 50, candidates: 50, planning: 20 },
}
it("shows source reasoning and recorded investigation without promoting identity", async () => {
  vi.spyOn(api, "discovery").mockResolvedValue({
    ...empty,
    candidates: [
      {
        id: "test",
        name: "SYNTHETIC Atlas",
        domain: null,
        identity_state: "UNRESOLVED",
        screen_state: "HOLD",
        reasons: [],
        missing: [],
        market_contexts: ["MX"],
        sources: [],
        sightings: 1,
        admissions: 0,
      },
    ],
    journeys: [
      {
        candidate_id: "test",
        origins: [
          {
            source: "synthetic",
            search: { term: "bounded" },
            hypothesis: "Synthetic change hypothesis",
            reason: "Synthetic source rationale",
            sourceEntity: "synthetic:1",
            jobTitle: null,
            attempts: [],
            requests: 1,
            runStatus: "SUCCESS",
          },
        ],
        decisions: [],
        investigations: [
          {
            summary: "Synthetic identity needs corroboration",
            nextAction: "Inspect primary identity evidence",
            actorType: "PANCRACIO_GATEWAY",
            actorId: "pancracio:gateway",
            recordedAt: "2026-09-13T00:00:00Z",
            attempts: [],
            limitations: ["Not verified"],
          },
        ],
      },
    ],
  })
  render(<DiscoverySection locale="en" />)
  fireEvent.click(await screen.findByText("Discovery journey"))
  expect(
    screen.getByText("Synthetic identity needs corroboration"),
  ).toBeVisible()
  expect(screen.getByText("Inspect primary identity evidence")).toBeVisible()
  expect(screen.getByText(/Identity unresolved/)).toBeVisible()
})
it.each(["es", "en"] as const)(
  "%s Discovery is useful before an Account exists and cannot activate",
  async (locale) => {
    vi.spyOn(api, "discovery").mockResolvedValue(empty)
    render(<DiscoverySection locale={locale} />)
    expect(
      await screen.findByText(
        locale === "es"
          ? "Sin Cycle activo. La exploración real todavía no ha comenzado."
          : "No active Cycle. Real discovery has not started.",
      ),
    ).toBeVisible()
    expect(
      screen.queryByRole("button", { name: /activar|activate/i }),
    ).not.toBeInTheDocument()
    const accessibility = await axe.run(document.body, {
      runOnly: { type: "tag", values: ["wcag2a", "wcag2aa"] },
      // jsdom has no rendering engine; contrast is checked in visual QA.
      rules: { "color-contrast": { enabled: false } },
    })
    expect(accessibility.violations).toEqual([])
  },
)
it("pre-Account ambiguity is retained, not presented as qualification or a false rejection", async () => {
  vi.spyOn(api, "discovery").mockResolvedValue({
    ...empty,
    state: "WORK_PENDING",
    totals: {
      ...empty.totals,
      candidates: 1,
      ambiguous: 1,
      held: 1,
      pending_work: 1,
    },
    candidates: [
      {
        id: "synthetic",
        name: "SYNTHETIC Taller Norte",
        domain: null,
        identity_state: "AMBIGUOUS",
        screen_state: "HOLD",
        reasons: ["DOMAIN_CLAIM_CONFLICT"],
        missing: ["FIRST_PARTY_IDENTITY"],
        market_contexts: ["MX"],
        sources: ["denue-directory"],
        sightings: 2,
        admissions: 0,
      },
    ],
  })
  render(<DiscoverySection locale="es" />)
  expect(await screen.findByText("SYNTHETIC Taller Norte")).toBeVisible()
  expect(screen.getByText(/Conservada antes de admisión/)).toBeVisible()
  fireEvent.click(screen.getByText("Evidencia pendiente y procedencia"))
  expect(screen.getByText("FIRST_PARTY_IDENTITY")).toBeVisible()
})
it("failed read is not an empty/healthy Discovery projection", async () => {
  vi.spyOn(api, "discovery").mockRejectedValue(Error("unavailable"))
  render(<DiscoverySection locale="en" />)
  expect(
    await screen.findByText(/Neither inactivity nor an empty pool is assumed/),
  ).toBeVisible()
  expect(
    screen.queryByText("No active Cycle. Real discovery has not started."),
  ).not.toBeInTheDocument()
})
it("supported dismissal is not mislabeled as missing-evidence retention", async () => {
  vi.spyOn(api, "discovery").mockResolvedValue({
    ...empty,
    candidates: [
      {
        id: "synthetic-dismissal",
        name: "SYNTHETIC Scope Example",
        domain: null,
        identity_state: "RESOLVED",
        screen_state: "SUPPORTED_DISMISSAL",
        reasons: ["SUPPORTED_SCOPE_INCOMPATIBILITY"],
        missing: [],
        market_contexts: ["US"],
        sources: ["synthetic-source"],
        sightings: 1,
        admissions: 0,
        first_seen: "2026-09-12T12:00:00Z",
        last_seen: "2026-09-12T12:00:00Z",
      },
    ],
  })
  render(<DiscoverySection locale="en" />)
  expect(await screen.findByText(/Dismissed with evidence/)).toBeVisible()
  expect(
    screen.queryByText(/Retained before admission/),
  ).not.toBeInTheDocument()
  expect(screen.getByText(/Sightings: 1/)).toHaveTextContent("UTC")
})
