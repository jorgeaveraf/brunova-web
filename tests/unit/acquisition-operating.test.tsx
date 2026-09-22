import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import { it, expect, vi, afterEach } from "vitest"
import { ActivationPreflight } from "@/components/acquisition/activation-preflight"
import { OpportunityPool } from "@/components/acquisition/operating-overview"
import { CandidateOpportunities } from "@/components/acquisition/candidate-opportunities"
import { acquisitionApi as api } from "@/lib/acquisition-api"
import type { DiscoveryTruth } from "@/lib/acquisition-management-truth"
afterEach(() => vi.restoreAllMocks())
it.each(["en", "es"] as const)(
  "%s preflight is read-only and missing evidence is not healthy",
  async (locale) => {
    vi.spyOn(api, "activationPreflight").mockResolvedValue({
      ready: false,
      executable: false,
      activationAvailable: false,
      policyVersion: 3,
      observedAt: "2026-09-08T12:00:00Z",
      checks: [
        { component: "INBOUND", ready: false, reason: "PROBE_STALE" },
        { component: "DISCOVERY_MX", ready: false, reason: "PROBE_REQUIRED" },
        {
          component: "DISCOVERY_ZERO_STATE",
          ready: false,
          reason: "PROBE_REQUIRED",
        },
      ],
    })
    render(<ActivationPreflight locale={locale} />)
    expect(
      await screen.findByText(
        locale === "es"
          ? "Requiere verificación antes de activar."
          : "Verification required before activation.",
      ),
    ).toBeVisible()
    expect(
      screen.queryByRole("button", { name: /activate|activar/i }),
    ).not.toBeInTheDocument()
    expect(
      screen.getByText(/observation expired|observación vencida/),
    ).toBeVisible()
    expect(
      screen.getAllByText(
        locale === "es" ? /Discovery en México/ : /Mexico discovery/,
      ).length,
    ).toBeGreaterThan(0)
    expect(
      screen.getAllByText(
        locale === "es" ? /Discovery desde cero/ : /Zero-state discovery/,
      ).length,
    ).toBeGreaterThan(0)
  },
)
it("opportunity groups retain uncertainty and supported context without a fabricated channel", async () => {
  vi.spyOn(api, "cyclePool").mockResolvedValue({
    schemaVersion: "1",
    items: [
      {
        account_id: "synthetic",
        display_name: "SYNTHETIC Norte",
        country: "MX",
        pool_state: "RETAINED",
        readiness_reason: "NO_EXECUTABLE_CHANNEL",
        rationale: null,
        known_unknowns: ["Responsable pendiente"],
        research_version: 1,
        buyer_role_hypothesis: "Directora de Operaciones",
        intervention_hypothesis: "Hipótesis sintética de coordinación",
        channel: "NO_EXECUTABLE_CHANNEL",
      },
    ],
  })
  const inspect = vi.fn()
  render(
    <OpportunityPool cycleId="synthetic" locale="es" onInspect={inspect} />,
  )
  expect(await screen.findByText("SYNTHETIC Norte")).toBeVisible()
  expect(screen.getByText("Hipótesis sintética de coordinación")).toBeVisible()
  expect(screen.getByText("Sin canal ejecutable confirmado.")).toBeVisible()
  fireEvent.click(
    screen.getByRole("button", {
      name: "Revisar evidencia y siguiente acción",
    }),
  )
  expect(inspect).toHaveBeenCalledWith("synthetic")
})

it("archives through the governed command while preserving an explicit disabled automatic policy", async () => {
  const command = vi.spyOn(api, "candidateWorkspace").mockResolvedValue({
    status: "accepted",
    candidateId: "candidate-synthetic",
    workspaceState: "ARCHIVED",
    wakeRequired: false,
  })
  const changed = vi.fn()
  const data = {
    candidates: [
      {
        id: "candidate-synthetic",
        name: "Synthetic Operations Group",
        domain: null,
        identity_state: "UNRESOLVED",
        screen_state: "HOLD",
        reasons: [],
        missing: ["identity"],
        market_contexts: ["MX"],
        sources: ["synthetic-source"],
        sightings: 1,
        admissions: 0,
        archived: false,
      },
    ],
    journeys: [],
    workExecution: [],
    batchCandidates: [],
    routineOperatingSessions: [],
    learningWaves: [],
    firstExploratoryEffect: [],
    archivePolicy: {
      version: 1,
      enabled: false,
      terminal_retention_days: 30,
      stale_unresolved_retention_days: 180,
      definition: {},
      definition_hash: "a".repeat(64),
    },
    archiveEligibility: [],
  } as unknown as DiscoveryTruth
  render(
    <CandidateOpportunities
      data={data}
      locale="en"
      session={{
        authenticated: true,
        actor: { email: "human@brunova.mx", capabilities: ["MANAGE_CYCLE"] },
        csrfToken: "csrf",
        expiresAt: "2099-01-01T00:00:00Z",
      }}
      onChanged={changed}
    />,
  )
  fireEvent.click(screen.getByText("Archive policy"))
  expect(screen.getByText(/Policy v1 is disabled/)).toBeVisible()
  fireEvent.click(screen.getByText("Remove from active view"))
  fireEvent.change(screen.getByLabelText("Reason"), {
    target: { value: "No current workspace value; preserve evidence." },
  })
  fireEvent.click(screen.getByRole("button", { name: "Archive organization" }))
  await waitFor(() =>
    expect(command).toHaveBeenCalledWith(
      expect.any(String),
      "candidate-synthetic",
      "ARCHIVE_CANDIDATE",
      "No current workspace value; preserve evidence.",
      "csrf",
    ),
  )
  expect(changed).toHaveBeenCalledOnce()
})
