import { render, screen, fireEvent } from "@testing-library/react"
import { it, expect, vi, afterEach } from "vitest"
import { DiscoverySection } from "@/components/acquisition/discovery"
import { acquisitionApi as api } from "@/lib/acquisition-api"
afterEach(() => vi.restoreAllMocks())
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
