import { render, screen, fireEvent } from "@testing-library/react"
import { it, expect, vi, afterEach } from "vitest"
import { ActivationPreflight } from "@/components/acquisition/activation-preflight"
import { OpportunityPool } from "@/components/acquisition/operating-overview"
import { acquisitionApi as api } from "@/lib/acquisition-api"
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
