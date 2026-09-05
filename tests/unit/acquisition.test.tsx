import {
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from "@testing-library/react"
import { beforeAll, beforeEach, expect, it, vi } from "vitest"
import { AcquisitionPortal } from "@/components/acquisition/portal"
import {
  acquisitionApi as api,
  AcquisitionError,
  type Attention,
  type AccountDetail,
  type PortalSession,
} from "@/lib/acquisition-api"

const session: PortalSession = {
  authenticated: true,
  actor: {
    email: "synthetic@brunova.mx",
    capabilities: [
      "VIEW_ACQUISITION",
      "VIEW_HEALTH",
      "RECORD_ATTENTION_DISPOSITION",
    ],
  },
  csrfToken: "synthetic-csrf",
  expiresAt: "2026-09-06T00:00:00Z",
}
const item = (name = "SYNTHETIC First"): Attention => ({
  schemaVersion: "1",
  attention_id: name,
  account_id: name,
  cycle_id: "synthetic",
  displayName: name,
  domain: "account.synthetic.local",
  status: "ACTIVE",
  version: 2,
  eligible: true,
  stale: false,
  reconsideration_required: false,
  next_stage_ready: false,
  human: null,
  allowedDispositions: ["CONTINUE", "HOLD", "REJECT"],
  result: {
    tier: "HIGH",
    evidenceConfidence: "HIGH",
    hypothesisConfidence: "MEDIUM",
    recommendation: "REVIEW_ACCOUNT_PRIORITY",
    whyNow: [
      {
        assertionId: "fact",
        observedContext: "SYNTHETIC current QBO close signal",
        validAsOf: null,
      },
    ],
    hardStops: [],
    limitingFactors: ["UNKNOWNS_REMAIN_EXPLICIT"],
    supportingAssertionIds: ["fact"],
    knownUnknowns: ["Current burden is unknown"],
    materialUnknowns: [],
    policyId: "brunova-systems-account-priority",
    policyVersion: "1",
    hypothesisRefs: [
      {
        assertionId: "hypothesis",
        falsifier: "The process is already automated",
      },
    ],
  },
})
const research: AccountDetail = {
  sourceObservations: [],
  schemaVersion: "1",
  accountId: "SYNTHETIC First",
  cycleId: "synthetic",
  canonicalIdentity: {
    domain: "account.synthetic.local",
    displayName: "SYNTHETIC First",
  },
  researchOutcome: "QUALIFIED",
  stage: "RESEARCH_DECIDED",
  latestMaterialActivityAt: null,
  rationale: { summary: "Supported synthetic premise" },
  knownUnknowns: ["Current burden is unknown"],
  materialEvents: [],
  assertions: [
    {
      id: "fact",
      epistemic_status: "OBSERVED_FACT",
      statement: "SYNTHETIC observed fact",
      confidence: "HIGH",
    },
    {
      id: "hypothesis",
      epistemic_status: "WORKING_HYPOTHESIS",
      statement: "SYNTHETIC working hypothesis",
      confidence: "MEDIUM",
      falsifier: "The process is already automated",
    },
    {
      id: "unknown",
      epistemic_status: "UNKNOWN",
      statement: "SYNTHETIC unknown",
      confidence: "HIGH",
    },
  ],
}
beforeAll(() => {
  HTMLDialogElement.prototype.showModal = function () {
    this.setAttribute("open", "")
  }
  HTMLDialogElement.prototype.close = function () {
    this.removeAttribute("open")
  }
})
beforeEach(() => {
  vi.spyOn(api, "contract").mockResolvedValue({
    schemaVersion: "1",
    attentionSurfaceVersion: "3g-v1",
  })
  vi.spyOn(api, "cycles").mockResolvedValue({ items: [], nextCursor: null })
  vi.spyOn(api, "health").mockResolvedValue({
    schemaVersion: "1",
    databaseReady: true,
    realAcquisitionDataAllowed: false,
    externalEffectsMode: "disabled",
    pendingWorkCount: 0,
    oldestPendingAt: null,
  })
  vi.spyOn(api, "accounts").mockResolvedValue({ items: [], nextCursor: null })
  vi.spyOn(api, "attention").mockResolvedValue({
    schemaVersion: "1",
    items: [item()],
  })
  vi.spyOn(api, "attentionDetail").mockResolvedValue(item())
  vi.spyOn(api, "detail").mockResolvedValue(research)
  vi.spyOn(api, "counts").mockResolvedValue({
    schemaVersion: "1",
    configured: true,
    counts: {
      capacity: 5,
      prioritized_count: 25,
      active_count: 1,
      overflow_count: 14,
      eligible_unresolved_count: 19,
      candidate_count: 18,
    },
    tiers: { high: 10, medium: 9, low: 6 },
  })
  vi.spyOn(api, "work").mockResolvedValue({ items: [], nextCursor: null })
})
function populated() {
  vi.mocked(api.cycles).mockResolvedValue({
    items: [
      {
        schemaVersion: "1",
        cycleId: "synthetic",
        status: "CALIBRATION",
        policy: { id: "cycle", version: "1" },
        outcomeCounts: { qualified: 25 },
        stageCounts: { total: 25 },
      },
    ],
    nextCursor: null,
  })
}
it("shows intentional empty state and disabled gates, no fake accounts", async () => {
  render(<AcquisitionPortal session={session} />)
  expect(
    await screen.findByText("Aún no hay un ciclo de Acquisition."),
  ).toBeVisible()
  expect(screen.getByText(/REAL ACQUISITION DATA: DISABLED/)).toBeVisible()
  expect(screen.getByText(/EXTERNAL EFFECTS: DISABLED/)).toBeVisible()
  expect(screen.queryByText("SYNTHETIC First")).not.toBeInTheDocument()
})
it("401 and unavailable/loading states are explicit", async () => {
  vi.mocked(api.contract).mockRejectedValue(new AcquisitionError(401))
  render(<AcquisitionPortal session={session} />)
  expect(screen.getByText(/Actualizando estado/)).toBeVisible()
  expect(
    await screen.findByRole("button", { name: "Iniciar sesión" }),
  ).toBeVisible()
  expect(screen.getByRole("alert")).toHaveTextContent("Tu sesión terminó")
})
it("shows epistemic distinctions, confirms disposition and displays Engine refill", async () => {
  populated()
  const decide = vi.spyOn(api, "disposition").mockImplementation(async () => {
    vi.mocked(api.attention).mockResolvedValue({
      schemaVersion: "1",
      items: [item("SYNTHETIC Next")],
    })
    return {
      schemaVersion: "1",
      status: "accepted",
      nextStageReady: true,
      refill: { activated: ["next"], withdrawn: [] },
    }
  })
  render(<AcquisitionPortal session={session} />)
  fireEvent.click(
    await screen.findByRole("button", { name: "Revisar evidencia y decisión" }),
  )
  const modal = within(screen.getByRole("dialog"))
  expect(await modal.findByText("SYNTHETIC observed fact")).toBeVisible()
  expect(modal.getByText("Hipótesis de trabajo")).toBeVisible()
  expect(modal.getByText("Lo que no sabemos")).toBeVisible()
  fireEvent.click(modal.getByRole("button", { name: "CONTINUE" }))
  fireEvent.change(modal.getByLabelText("Motivo (obligatorio)"), {
    target: { value: "Synthetic review complete" },
  })
  fireEvent.click(modal.getByRole("button", { name: "Confirmar CONTINUE" }))
  expect(
    await screen.findByRole("heading", { name: "SYNTHETIC Next" }),
  ).toBeVisible()
  expect(
    screen.getByText(/siguiente cuenta elegible fue promovida/),
  ).toBeVisible()
  expect(decide).toHaveBeenCalledTimes(1)
  expect(decide.mock.calls[0]?.[0]).toMatchObject({
    expectedVersion: 2,
    disposition: "CONTINUE",
  })
})
it("409 refreshes current state without retrying with a new version", async () => {
  populated()
  const decide = vi
    .spyOn(api, "disposition")
    .mockRejectedValue(new AcquisitionError(409))
  render(<AcquisitionPortal session={session} />)
  fireEvent.click(
    await screen.findByRole("button", { name: "Revisar evidencia y decisión" }),
  )
  const modal = within(screen.getByRole("dialog"))
  fireEvent.click(await modal.findByRole("button", { name: "HOLD" }))
  fireEvent.change(modal.getByLabelText("Motivo (obligatorio)"), {
    target: { value: "Need more evidence" },
  })
  vi.mocked(api.attentionDetail).mockResolvedValue({
    ...item(),
    version: 3,
    allowedDispositions: [],
  })
  fireEvent.click(modal.getByRole("button", { name: "Confirmar HOLD" }))
  expect(
    await modal.findByText("No hay acciones permitidas en el estado actual."),
  ).toBeVisible()
  expect(decide).toHaveBeenCalledTimes(1)
  expect(
    modal.queryByRole("button", { name: "Confirmar HOLD" }),
  ).not.toBeInTheDocument()
})
it("network retry retains command ID and payload; read-only users have no decisions", async () => {
  populated()
  const decide = vi
    .spyOn(api, "disposition")
    .mockRejectedValue(new AcquisitionError(503))
  render(<AcquisitionPortal session={session} />)
  fireEvent.click(
    await screen.findByRole("button", { name: "Revisar evidencia y decisión" }),
  )
  const modal = within(screen.getByRole("dialog"))
  fireEvent.click(await modal.findByRole("button", { name: "REJECT" }))
  fireEvent.change(modal.getByLabelText("Motivo (obligatorio)"), {
    target: { value: "Synthetic not suitable" },
  })
  fireEvent.click(modal.getByRole("button", { name: "Confirmar REJECT" }))
  fireEvent.click(
    await modal.findByRole("button", { name: "Reintentar la misma decisión" }),
  )
  await waitFor(() => expect(decide).toHaveBeenCalledTimes(2))
  expect(decide.mock.calls[0]).toEqual(decide.mock.calls[1])
})
it("transport rejects incompatible contract and does not leak raw errors", async () => {
  vi.mocked(api.contract).mockRestore()
  vi.stubGlobal(
    "fetch",
    vi.fn().mockResolvedValue(
      new Response(
        JSON.stringify({
          schemaVersion: "1",
          attentionSurfaceVersion: "future",
        }),
        { status: 200 },
      ),
    ),
  )
  await expect(api.contract()).rejects.toMatchObject({ status: 502 })
  vi.unstubAllGlobals()
})
