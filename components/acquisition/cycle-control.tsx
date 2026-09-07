"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import {
  acquisitionApi as api,
  type CyclePolicyDefinition,
  type CycleReview,
  type CyclePoolItem,
  type PortalSession,
} from "@/lib/acquisition-api"
import type { Locale } from "@/lib/i18n"

/** Transient presentation only. All decisions, versions and accounting are Engine projections. */
export function CycleControlSection({
  cycleId,
  session,
  locale,
}: {
  cycleId: string
  session: PortalSession
  locale: Locale
}) {
  const es = locale === "es"
  const [policy, setPolicy] = useState<CyclePolicyDefinition | null>(null),
    [review, setReview] = useState<CycleReview | null>(null)
  const [error, setError] = useState(false),
    [pending, setPending] = useState(false),
    [reason, setReason] = useState("")
  const retry = useRef<{ key: string; id: string } | null>(null)
  const [pool, setPool] = useState<CyclePoolItem[]>([])
  const [hasNext, setHasNext] = useState(false)
  const load = useCallback(async () => {
    setError(false)
    try {
      const definition = await api.cyclePolicy()
      setPolicy(definition)
      setReview(cycleId ? (await api.cycleReview(cycleId)).review : null)
      const page = cycleId ? (await api.cyclePool(cycleId)).items : []
      setPool(page)
      setHasNext(page.length === 25)
    } catch {
      setError(true)
      setReview(null)
      setPool([])
    }
  }, [cycleId])
  useEffect(() => {
    let cancelled = false
    queueMicrotask(() => {
      if (!cancelled) void load()
    })
    return () => {
      cancelled = true
    }
  }, [load])
  const names: Record<string, string> = es
    ? {
        READY_NOW: "Listas ahora",
        RETAINED: "Retenidas",
        HOLD: "En revisión",
        REJECTED: "Rechazadas con evidencia",
        PLANNED: "Compuesta, sin aprobación",
        APPROVED: "Aprobada",
        REVIEW_REQUIRED: "Revisión requerida",
        COMPLETE: "Completa",
        STOPPED: "Detenida",
        CONFIGURED: "Configurada",
      }
    : {
        READY_NOW: "Ready now",
        RETAINED: "Retained",
        HOLD: "On hold",
        REJECTED: "Evidence-supported rejection",
        PLANNED: "Composed, not approved",
        APPROVED: "Approved",
        REVIEW_REQUIRED: "Review required",
        COMPLETE: "Complete",
        STOPPED: "Stopped",
        CONFIGURED: "Configured",
      }
  const current = review?.waves.at(-1)
  async function decide(decision: "CONTINUE" | "ADJUST" | "STOP") {
    if (!review?.control || !current || pending || !reason.trim()) return
    const body = {
      cycleId,
      operation: "REVIEW_WAVE",
      expectedVersion: review.control.version,
      waveId: current.id,
      decision,
      reason: reason.trim(),
    }
    const key = JSON.stringify(body)
    if (retry.current?.key !== key)
      retry.current = { key, id: crypto.randomUUID() }
    setPending(true)
    try {
      await api.cycleCommand(retry.current.id, body, session.csrfToken)
      retry.current = null
      setReason("")
      await load()
    } catch {
      await load()
      setError(true)
    } finally {
      setPending(false)
    }
  }
  return (
    <section
      className="acq-cycle"
      aria-label={es ? "Control del Cycle" : "Cycle control"}
    >
      <h2>
        {es
          ? "Cycle 1 · Configuración y control"
          : "Cycle 1 · Configuration and control"}
      </h2>
      {error && (
        <p>
          {es
            ? "No se pudo verificar el estado actual. Actualiza antes de decidir."
            : "Current state could not be verified. Refresh before deciding."}
        </p>
      )}
      {!policy && !error && (
        <p>
          {es
            ? "Consultando la política del Engine…"
            : "Loading Engine policy…"}
        </p>
      )}
      {policy && (
        <>
          <p>
            {policy.policy.policyId} / {policy.policy.policyVersion} ·{" "}
            {names[policy.policy.configurationState] ??
              policy.policy.configurationState}
          </p>
          <p>
            {policy.readyForRehearsal
              ? es
                ? "Lista para ensayo; no activa."
                : "Ready for rehearsal; not active."
              : es
                ? "Validación de implementación pendiente; no activa."
                : "Implementation validation pending; not active."}
          </p>
          <p>
            {es ? "Discovery máximo" : "Maximum discovery"}:{" "}
            {policy.policy.limits.researchUniverse} ·{" "}
            {es ? "Prospectos nuevos máximo" : "Maximum new prospects"}:{" "}
            {policy.policy.limits.outboundApproved} · {es ? "Waves" : "Waves"}:{" "}
            {policy.policy.limits.waveCount} × {policy.policy.limits.waveSize}
          </p>
          <p>
            {es
              ? "México y Estados Unidos: exploración en ambos mercados, sin cuotas de calidad."
              : "Mexico and United States: explore both markets, without qualification quotas."}
          </p>
          <p>
            {es
              ? "Email listo pero deshabilitado. Sin activación desde esta pantalla."
              : "Email ready but disabled. No activation from this screen."}
          </p>
        </>
      )}
      {review && (
        <>
          <div className="acq-metrics">
            {["READY_NOW", "RETAINED", "HOLD", "REJECTED"].map((state) => (
              <div key={state}>
                <span>{names[state]}</span>
                <strong>{review.pool[state] ?? 0}</strong>
              </div>
            ))}
          </div>
          <p>
            {es
              ? "Prospectos nuevos / intentos / intentos hoy UTC"
              : "New prospects / attempts / attempts today UTC"}
            : {review.newProspects} / {review.attempts} / {review.attemptsToday}
          </p>
          <details>
            <summary>
              {es
                ? "Oportunidades y explicación"
                : "Opportunity pool and explanation"}
            </summary>
            <ul>
              {pool.map((item) => (
                <li key={item.account_id}>
                  <strong>{item.display_name}</strong> ·{" "}
                  {names[item.pool_state] ?? item.pool_state}
                  <p>{item.readiness_reason}</p>
                  <p>
                    {typeof item.rationale?.summary === "string"
                      ? item.rationale.summary
                      : ""}
                  </p>
                  {item.known_unknowns?.length ? (
                    <p>
                      {es ? "Desconocido: " : "Unknown: "}
                      {item.known_unknowns.join(" · ")}
                    </p>
                  ) : null}
                </li>
              ))}
            </ul>
            {hasNext && (
              <button
                disabled={pending}
                onClick={async () => {
                  setPending(true)
                  try {
                    const page = (
                      await api.cyclePool(cycleId, pool.at(-1)?.account_id)
                    ).items
                    setPool(page)
                    setHasNext(page.length === 25)
                  } catch {
                    setError(true)
                  } finally {
                    setPending(false)
                  }
                }}
              >
                {es ? "Siguiente página" : "Next page"}
              </button>
            )}
          </details>
          <ul>
            {review.markets.map((m) => (
              <li key={m.country ?? "unknown"}>
                {m.country ?? (es ? "País desconocido" : "Country unknown")}:{" "}
                {m.discovered} {es ? "descubiertas;" : "discovered;"}{" "}
                {m.qualified} {es ? "calificadas" : "qualified"}
              </li>
            ))}
          </ul>
          <p>
            {es
              ? "La cobertura de ambos mercados requiere revisión; pocas observaciones no prueban falta de oportunidad."
              : "Both-market coverage requires review; few observations do not establish lack of opportunity."}
          </p>
          {review.control?.technical_halt && (
            <p role="alert">
              {es ? "Alto técnico:" : "Technical halt:"}{" "}
              {review.control.technical_halt}
            </p>
          )}
          {review.control?.discovery_stop_reason && (
            <p>
              {es ? "Discovery detenido:" : "Discovery stopped:"}{" "}
              {review.control.discovery_stop_reason}
            </p>
          )}
          {current ? (
            <p>
              Wave {current.number}: {names[current.state] ?? current.state} ·{" "}
              {current.composition.length}{" "}
              {es ? "prospectos seleccionados" : "selected prospects"}
            </p>
          ) : (
            <p>{es ? "Sin wave compuesta." : "No wave composed."}</p>
          )}
          <p>
            {es
              ? "Sin respuesta no significa fracaso. CONTINUE o ADJUST no aprueban automáticamente la siguiente wave."
              : "No response is not failure. CONTINUE or ADJUST does not automatically approve the next wave."}
          </p>
          <details>
            <summary>
              {es
                ? "Resultados y composición · detalle"
                : "Outcomes and composition · detail"}
            </summary>
            <pre>
              {JSON.stringify(
                {
                  waves: review.waves,
                  responses: review.responses,
                  quality: review.quality,
                },
                null,
                2,
              )}
            </pre>
          </details>
          {current &&
            ["APPROVED", "REVIEW_REQUIRED"].includes(current.state) &&
            session.actor.capabilities.includes("MANAGE_CYCLE") && (
              <fieldset disabled={pending || error}>
                <legend>
                  {es ? "Revisión de Management" : "Management review"}
                </legend>
                <label>
                  {es
                    ? "Razón basada en evidencia"
                    : "Evidence-grounded reason"}
                  <textarea
                    value={reason}
                    maxLength={1000}
                    onChange={(e) => setReason(e.target.value)}
                  />
                </label>
                {(["CONTINUE", "ADJUST", "STOP"] as const).map((d) => (
                  <button
                    key={d}
                    disabled={!reason.trim()}
                    onClick={() => void decide(d)}
                  >
                    {es
                      ? {
                          CONTINUE: "Continuar",
                          ADJUST: "Ajustar",
                          STOP: "Detener",
                        }[d]
                      : {
                          CONTINUE: "Continue",
                          ADJUST: "Adjust",
                          STOP: "Stop",
                        }[d]}
                  </button>
                ))}
              </fieldset>
            )}
        </>
      )}
      <button disabled={pending} onClick={() => void load()}>
        {es ? "Actualizar control del Cycle" : "Refresh Cycle control"}
      </button>
    </section>
  )
}
