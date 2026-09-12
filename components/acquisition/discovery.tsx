"use client"
import { useEffect, useState } from "react"
import { acquisitionApi as api } from "@/lib/acquisition-api"
import type { Locale } from "@/lib/i18n"

export function DiscoverySection({ locale }: { locale: Locale }) {
  const es = locale === "es",
    [data, setData] = useState<Awaited<
      ReturnType<typeof api.discovery>
    > | null>(null),
    [failed, setFailed] = useState(false)
  useEffect(() => {
    let live = true
    api
      .discovery()
      .then((value) => {
        if (live) setData(value)
      })
      .catch(() => {
        if (live) setFailed(true)
      })
    return () => {
      live = false
    }
  }, [])
  const identity = (state: string) =>
    state === "RESOLVED"
      ? es
        ? "Identidad respaldada"
        : "Supported identity"
      : state === "AMBIGUOUS"
        ? es
          ? "Identidad ambigua"
          : "Ambiguous identity"
        : es
          ? "Identidad por resolver"
          : "Identity unresolved"
  const date = (value?: string | null) =>
    value
      ? new Intl.DateTimeFormat(es ? "es-MX" : "en-US", {
          dateStyle: "medium",
          timeStyle: "short",
          timeZone: "UTC",
        }).format(new Date(value)) + " UTC"
      : es
        ? "Sin observación registrada"
        : "No observation recorded"
  return (
    <section
      className="acq-panel"
      aria-label={es ? "Exploración del mercado" : "Market discovery"}
    >
      <h2>{es ? "Exploración del mercado" : "Market discovery"}</h2>
      <p role="status">
        {failed
          ? es
            ? "No se pudo consultar Discovery. No se asume que esté detenido ni que no existan candidatas."
            : "Discovery could not be checked. Neither inactivity nor an empty pool is assumed."
          : !data
            ? es
              ? "Consultando…"
              : "Loading…"
            : data.state === "NO_ACTIVE_CYCLE"
              ? es
                ? "Sin Cycle activo. La exploración real todavía no ha comenzado."
                : "No active Cycle. Real discovery has not started."
              : data.state === "WORK_PENDING"
                ? es
                  ? "Hay búsquedas o planificación pendientes."
                  : "Search or planning work is pending."
                : es
                  ? "Esperando la siguiente oportunidad autorizada de exploración."
                  : "Waiting for the next authorized discovery opportunity."}
      </p>
      <p>
        {es
          ? "Una candidata no es todavía una oportunidad calificada. Conservamos organizaciones e incógnitas antes de decidir qué merece investigación."
          : "A candidate is not yet a qualified opportunity. Organizations and unknowns are retained before deciding what warrants research."}
      </p>
      {data && (
        <>
          <dl>
            <div>
              <dt>{es ? "Observaciones" : "Observations"}</dt>
              <dd>{data.totals.observations}</dd>
            </div>
            <div>
              <dt>{es ? "Candidatas conservadas" : "Retained candidates"}</dt>
              <dd>{data.totals.candidates}</dd>
            </div>
            <div>
              <dt>
                {es ? "Admisiones a investigación" : "Research admissions"}
              </dt>
              <dd>{data.totals.admitted}</dd>
            </div>
            <div>
              <dt>{es ? "Trabajo pendiente" : "Pending work"}</dt>
              <dd>{data.totals.pending_work}</dd>
            </div>
          </dl>
          <p className="acq-muted">
            {es
              ? "México y Estados Unidos se exploran sin cuotas. La cobertura visible no representa todo el mercado. El horario instalado y la última actividad están en Trabajo y salud."
              : "Mexico and the United States are explored without quotas. Visible coverage is not the whole market. The installed schedule and latest activity are in Work / Health."}
          </p>
          <h3>
            {es
              ? "Antes de convertirse en Account"
              : "Before Account admission"}
          </h3>
          {!data.candidates.length ? (
            <p>
              {es
                ? "Todavía no hay candidatas registradas. No necesitas proporcionar una lista de empresas para un futuro Cycle autorizado."
                : "No candidates recorded yet. A future authorized Cycle does not require a supplied company list."}
            </p>
          ) : (
            <ul>
              {data.candidates.map((c) => (
                <li key={c.id}>
                  <h4>
                    {c.name ??
                      (es
                        ? "Organización por identificar"
                        : "Organization to identify")}
                  </h4>
                  <p>
                    {c.domain ??
                      (es
                        ? "Dominio no confirmado"
                        : "Domain unconfirmed")}{" "}
                    · {(c.market_contexts ?? []).join(" / ")} ·{" "}
                    {identity(c.identity_state)}
                  </p>
                  <p>
                    {c.admissions > 0
                      ? es
                        ? "Admitida a investigación; esto no implica calificación."
                        : "Admitted to research; this does not imply qualification."
                      : c.screen_state === "SUPPORTED_DISMISSAL"
                        ? es
                          ? "Descartada con evidencia; la decisión se conserva y puede reconsiderarse con evidencia nueva."
                          : "Dismissed with evidence; the decision is retained and may be reconsidered with new evidence."
                        : c.screen_state === "INVESTIGATE"
                          ? es
                            ? "Merece investigación; aún no está admitida ni calificada."
                            : "Warrants research; not yet admitted or qualified."
                          : es
                            ? "Conservada antes de admisión. La evidencia pendiente no es un rechazo."
                            : "Retained before admission. Missing evidence is not rejection."}
                  </p>
                  <p className="acq-muted">
                    {es ? "Avistamientos" : "Sightings"}: {c.sightings} ·{" "}
                    {es ? "Primera observación" : "First seen"}:{" "}
                    {date(c.first_seen)} ·{" "}
                    {es ? "Última observación" : "Last seen"}:{" "}
                    {date(c.last_seen)}
                  </p>
                  <details>
                    <summary>
                      {es
                        ? "Evidencia pendiente y procedencia"
                        : "Missing evidence and provenance"}
                    </summary>
                    <p>{(c.sources ?? []).join(", ")}</p>
                    <ul>
                      {[...c.reasons, ...c.missing].map((reason, i) => (
                        <li key={i}>{reason}</li>
                      ))}
                    </ul>
                  </details>
                </li>
              ))}
            </ul>
          )}
          <p className="acq-muted">
            {es
              ? `Se muestran hasta ${data.displayLimits.candidates} candidatas recientes; los totales incluyen toda la memoria.`
              : `Showing up to ${data.displayLimits.candidates} recent candidates; totals cover all memory.`}
          </p>
          <h3>{es ? "Qué se está investigando" : "Search direction"}</h3>
          {!data.planning.length ? (
            <p>
              {es
                ? "Sin planificación registrada todavía."
                : "No planning recorded yet."}
            </p>
          ) : (
            <ul>
              {data.planning.map((p) => (
                <li key={p.id}>
                  <p>
                    {p.hypothesis ??
                      (es ? "Planificación pendiente" : "Planning pending")}
                  </p>
                  <p>{p.reason}</p>
                  <p>{p.coverage_gap}</p>
                  <p className="acq-muted">{date(p.created_at)}</p>
                </li>
              ))}
            </ul>
          )}
          <details>
            <summary>
              {es
                ? "Fuentes y resultados de búsquedas"
                : "Sources and search outcomes"}
            </summary>
            <p>
              {es
                ? "Una fuente sin resultados o inaccesible no demuestra que el mercado carezca de oportunidades. FDIC cubre bancos estadounidenses, no todo el mercado."
                : "An empty or inaccessible source does not prove absence of opportunity. FDIC covers US banks, not the whole market."}
            </p>
            <ul>
              {data.sources.map((s) => (
                <li key={s.id}>
                  {s.id} · {s.markets.join(" / ")} ·{" "}
                  {!s.available
                    ? es
                      ? "No disponible"
                      : "Unavailable"
                    : s.health === "NOT_EXECUTED"
                      ? es
                        ? "Sin ejecución registrada"
                        : "No execution recorded"
                      : s.health}
                  {s.next_run_at && (
                    <p className="acq-muted">
                      {es
                        ? "Disponible para una nueva búsqueda desde"
                        : "Eligible for a new search from"}
                      : {date(s.next_run_at)}.{" "}
                      {es
                        ? "Sujeto a autoridad, presupuesto y disponibilidad del Mac."
                        : "Subject to authority, budget and Mac availability."}
                    </p>
                  )}
                </li>
              ))}
            </ul>
            <ul>
              {data.missions.map((m) => (
                <li key={m.mission_id}>
                  {m.source} · {m.market} — {m.observations}{" "}
                  {es ? "observaciones" : "observations"}, {m.candidates}{" "}
                  {es ? "candidatas" : "candidates"}, {m.source_failures}{" "}
                  {es ? "fallos de fuente" : "source failures"}
                </li>
              ))}
            </ul>
          </details>
        </>
      )}
    </section>
  )
}
