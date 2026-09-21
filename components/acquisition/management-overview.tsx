"use client"

import { useEffect, useState } from "react"
import { acquisitionApi as api, type CycleReview } from "@/lib/acquisition-api"
import { readDiscovery } from "@/lib/acquisition-discovery-read"
import {
  candidateManagementTruth,
  marketContextCounts,
  type DiscoveryTruth,
} from "@/lib/acquisition-management-truth"
import type { Locale } from "@/lib/i18n"

const countExecuted = (
  session: NonNullable<DiscoveryTruth["routineOperatingSessions"]>[number],
) =>
  session.decisions.filter((decision) => {
    const outcome = decision.outcome
    return (
      decision.decision !== "STOP" &&
      outcome &&
      typeof outcome === "object" &&
      !Array.isArray(outcome) &&
      ("work_item_id" in outcome || "workItemId" in outcome)
    )
  }).length

export function ManagementOverview({
  cycleId,
  cycleStatus,
  locale,
  onNavigate,
}: {
  cycleId: string
  cycleStatus: string
  locale: Locale
  onNavigate: (tab: string) => void
}) {
  const es = locale === "es"
  const [review, setReview] = useState<CycleReview | null>(null)
  const [discovery, setDiscovery] = useState<DiscoveryTruth | null>(null)
  const [error, setError] = useState(false)
  useEffect(() => {
    let live = true
    Promise.all([api.cycleReview(cycleId), readDiscovery()])
      .then(([result, snapshot]) => {
        if (live) {
          setReview(result.review)
          setDiscovery(snapshot)
        }
      })
      .catch(() => {
        if (live) setError(true)
      })
    return () => {
      live = false
    }
  }, [cycleId])
  if (error)
    return (
      <section role="alert" className="acq-panel">
        {es
          ? "No se pudo verificar el estado del Cycle. Actualiza antes de decidir."
          : "Cycle state could not be verified. Refresh before deciding."}
      </section>
    )
  if (!review || !discovery)
    return (
      <p role="status">
        {es ? "Consultando estado del Cycle…" : "Loading Cycle state…"}
      </p>
    )

  const candidates = candidateManagementTruth(discovery)
  const contacted = candidates.filter((candidate) => candidate.contacted)
  const latest = discovery.routineOperatingSessions?.[0]
  const executed = latest ? countExecuted(latest) : 0
  const deferred = latest?.decisions.at(-1)?.decision === "STOP"
  const acceptedFourthWindow =
    deferred && String(latest?.local_date ?? "").startsWith("2026-09-20")
  const requests = Number(latest?.capacity.requestsUsed ?? 0)
  const markets = marketContextCounts(discovery)
  const held = latest?.status === "HELD_REVIEW"
  const wave = review.waves.at(-1)
  const technicalHalt =
    review.control?.technical_halt || review.control?.state === "STOPPED"
  const decisionNeeded =
    !!technicalHalt ||
    wave?.state === "REVIEW_REQUIRED" ||
    wave?.state === "PLANNED"
  return (
    <div className="acq-overview">
      <section className="acq-summary acq-panel">
        <div>
          <p className="acq-eyebrow">
            {es ? "Estado actual" : "Current state"}
          </p>
          <h2>
            Cycle 1 ·{" "}
            {cycleStatus === "ACTIVE"
              ? es
                ? "activo"
                : "active"
              : cycleStatus.toLocaleLowerCase()}
          </h2>
          <p>
            {held
              ? es
                ? "La última ventana cerró y la recurrencia espera revisión humana."
                : "The latest window closed; recurrence awaits Human review."
              : es
                ? "El Cycle conserva su investigación y sus límites de Management."
                : "The Cycle retains its research and Management boundaries."}
          </p>
        </div>
        <div
          className="acq-summary-metrics"
          aria-label={es ? "Estado del Cycle" : "Cycle state"}
        >
          <div>
            <strong>{discovery.totals.candidates}</strong>
            <span>{es ? "candidatas" : "candidates"}</span>
          </div>
          <div>
            <strong>
              {review.discovery?.admitted ?? discovery.totals.admitted}
            </strong>
            <span>Accounts</span>
          </div>
          <div>
            <strong>{contacted.length}</strong>
            <span>{es ? "contactadas" : "contacted"}</span>
          </div>
          <div>
            <strong>{discovery.totals.pending_work}</strong>
            <span>{es ? "trabajos pendientes" : "pending work"}</span>
          </div>
        </div>
        <p className="acq-boundary-line">
          <strong>{es ? "Recurrencia" : "Recurrence"}:</strong>{" "}
          {held ? "HOLD" : (latest?.recurrence_state ?? "—")} ·{" "}
          <strong>{es ? "Efectos comerciales" : "Commercial effects"}:</strong>{" "}
          {es ? "deshabilitados" : "disabled"}
        </p>
      </section>

      <div className="acq-overview-grid">
        <section className="acq-panel">
          <p className="acq-eyebrow">
            {es ? "Último resultado" : "Latest outcome"}
          </p>
          <h2>
            {held
              ? es
                ? "La ventana se cerró sin nueva investigación"
                : "Window closed without new research"
              : es
                ? "Última ventana"
                : "Latest window"}
          </h2>
          {latest ? (
            <>
              <p>
                {deferred
                  ? es
                    ? "El Engine decidió esperar. El trabajo restante no justificaba otra unidad de capacidad."
                    : "The Engine deferred. Remaining work did not justify another capacity unit."
                  : es
                    ? "La ejecución registrada y sus límites están disponibles en Discovery."
                    : "Recorded execution and its limits are available in Discovery."}
              </p>
              <div className="acq-inline-facts">
                <span>
                  {executed}{" "}
                  {es
                    ? "tareas de investigación ejecutadas"
                    : "research tasks executed"}
                </span>
                <span>
                  {requests} {es ? "consultas de fuente" : "source requests"}
                </span>
              </div>
              <p className="acq-muted">
                {acceptedFourthWindow && executed === 0 && requests === 0
                  ? es
                    ? "No hubo evidencia nueva de empresas. A1 aceptado; A2 no aplica porque no hubo ejecución."
                    : "No new company evidence. A1 accepted; A2 does not apply because nothing executed."
                  : es
                    ? "El detalle de evidencia está en Discovery; no se infiere calidad sólo por completar trabajo."
                    : "Evidence details are in Discovery; completing work alone does not prove information quality."}
              </p>
              <details>
                <summary>
                  {es ? "Contabilidad técnica" : "Technical accounting"}
                </summary>
                <p>
                  {es
                    ? "Las decisiones comparativas consumen un slot de decisión, no una unidad de investigación ejecutada."
                    : "Comparative decisions consume a decision slot, not an executed research unit."}{" "}
                  {es ? "Slots registrados" : "Recorded slots"}:{" "}
                  {String(latest.capacity.unitsUsed ?? 0)}.
                </p>
                <p>
                  {es ? "Estado" : "State"}: {latest.status} ·{" "}
                  {es ? "Fecha" : "Date"}: {latest.local_date}
                </p>
              </details>
            </>
          ) : (
            <p>
              {es
                ? "Todavía no hay una ventana registrada."
                : "No operating window has been recorded yet."}
            </p>
          )}
        </section>
        <section className="acq-panel">
          <p className="acq-eyebrow">
            {es ? "Qué sigue" : "What happens next"}
          </p>
          <h2>
            {decisionNeeded
              ? es
                ? "Management debe revisar"
                : "Management review required"
              : es
                ? "Aceptación del Portal pendiente"
                : "Portal acceptance pending"}
          </h2>
          <p>
            {decisionNeeded
              ? es
                ? "Revisa la decisión vigente antes de autorizar progresión."
                : "Review the current decision before authorizing progression."
              : es
                ? "La recurrencia permanece detenida. No hay una siguiente acción comercial automática ni autoridad de seguimiento."
                : "Recurrence remains held. There is no automatic next commercial action or follow-up authority."}
          </p>
          <button
            onClick={() =>
              onNavigate(decisionNeeded ? "Attention" : "Discovery")
            }
          >
            {decisionNeeded
              ? es
                ? "Ver decisión"
                : "View decision"
              : es
                ? "Ver lo descubierto"
                : "View discovery"}
          </button>
        </section>
      </div>
      <section className="acq-overview-strip">
        <div>
          <span>{es ? "Mercados explorados" : "Markets explored"}</span>
          <strong>
            MX {markets.MX} · US {markets.US} · {es ? "mixto" : "mixed"}{" "}
            {markets.ambiguous}
          </strong>
          <small>
            {es
              ? "Contexto de búsqueda, no domicilio confirmado."
              : "Search context, not confirmed domicile."}
          </small>
        </div>
        <div>
          <span>{es ? "Lo que tenemos" : "What we have"}</span>
          <strong>
            {discovery.totals.resolved}{" "}
            {es ? "identidad respaldada" : "supported identity"} ·{" "}
            {discovery.totals.unresolved} {es ? "sin resolver" : "unresolved"}
          </strong>
          <small>
            {es
              ? "La incertidumbre permanece en el pool."
              : "Uncertainty remains in the pool."}
          </small>
        </div>
        <div>
          <span>{es ? "Lo aprendido" : "What we learned"}</span>
          <strong>
            {executed === 0
              ? es
                ? "Sin nueva evidencia en la última ventana"
                : "No new evidence in the latest window"
              : es
                ? "Ver resultado por candidata"
                : "See candidate-level outcomes"}
          </strong>
          <small>
            {es
              ? "La abstención no equivale a rechazo."
              : "Deferral does not mean rejection."}
          </small>
        </div>
      </section>
      {contacted.length > 0 && (
        <section className="acq-panel acq-contact-strip">
          <h2>{es ? "Contacto en espera" : "Contact waiting"}</h2>
          {contacted.map((candidate) => (
            <p key={candidate.id}>
              <strong>{candidate.name}</strong> ·{" "}
              {es
                ? "un mensaje enviado; esperando respuesta"
                : "one message sent; waiting for reply"}{" "}
              · {es ? "seguimiento" : "follow-up"}:{" "}
              <strong>
                {candidate.followUpAuthority === "NONE"
                  ? es
                    ? "sin autorización"
                    : "not authorized"
                  : es
                    ? "requiere autorización exacta"
                    : "requires exact authorization"}
              </strong>
            </p>
          ))}
        </section>
      )}
    </div>
  )
}
