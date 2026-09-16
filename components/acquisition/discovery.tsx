"use client"
import { useEffect, useState } from "react"
import { acquisitionApi as api } from "@/lib/acquisition-api"
import type { Locale } from "@/lib/i18n"

export function DiscoverySection({
  locale,
  cycleId,
}: {
  locale: Locale
  cycleId?: string
}) {
  const [stopReason, setStopReason] = useState<string | null>(null)
  const [reviewFailed, setReviewFailed] = useState(false)
  useEffect(() => {
    let live = true
    if (cycleId)
      api
        .cycleReview(cycleId)
        .then((review) => {
          if (live)
            setStopReason(review.review.control?.discovery_stop_reason ?? null)
        })
        .catch(() => {
          if (live) setReviewFailed(true)
        })
    return () => {
      live = false
    }
  }, [cycleId])
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
  const plans = (data?.workAllocation ?? []).filter(
    (plan) => !cycleId || plan.cycle_id === cycleId,
  )
  const currentPlan = plans.find((plan) => plan.status === "AWAITING_MANAGEMENT") ?? plans[0]
  const currentExecution = (data?.workExecution ?? []).find(
    (execution) => execution.plan_id === currentPlan?.id,
  )
  const calibration = (data?.commercialCalibration ?? []).filter(
    (review) => !cycleId || review.cycle_id === cycleId,
  )
  const authenticated = (data?.authenticatedResearch ?? []).filter(
    (run) => !cycleId || run.cycle_id === cycleId,
  )[0]
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
              : stopReason
                ? es
                  ? "Exploración pausada para revisión. La evidencia y las candidatas se conservan."
                  : "Discovery paused for review. Evidence and candidates are preserved."
                : reviewFailed
                  ? es
                    ? "No se pudo verificar si la exploración está pausada."
                    : "Discovery pause status could not be verified."
                  : data.state === "WORK_PENDING"
                    ? es
                      ? "Hay búsquedas o planificación pendientes."
                      : "Search or planning work is pending."
                    : es
                      ? "Esperando la siguiente oportunidad autorizada de exploración."
                      : "Waiting for the next authorized discovery opportunity."}
      </p>
      {stopReason && (
        <details>
          <summary>{es ? "Motivo de la pausa" : "Pause reason"}</summary>
          <p>{stopReason}</p>
        </details>
      )}
      <p>
        {es
          ? "Una candidata no es todavía una oportunidad calificada. Conservamos organizaciones e incógnitas antes de decidir qué merece investigación."
          : "A candidate is not yet a qualified opportunity. Organizations and unknowns are retained before deciding what warrants research."}
      </p>
      {data && (
        <>
          {currentPlan && (
            <section aria-label={es ? "Trabajo de hoy y siguiente" : "Today and next work"}>
              <h3>{es ? "Trabajo de hoy y siguiente" : "Today and next work"}</h3>
              <p>
                <strong>
                  {currentPlan.status === "AWAITING_MANAGEMENT"
                    ? es
                      ? "Esperando a Management"
                      : "Awaiting Management"
                    : currentPlan.status === "APPROVED"
                      ? es
                        ? "Aprobado / en ejecución"
                        : "Approved / executing"
                      : currentPlan.status === "COMPLETED"
                        ? es
                          ? "Ejecutado y reconsiderado"
                          : "Executed and reconsidered"
                    : es
                      ? "Plan expirado o reemplazado"
                      : "Plan expired or superseded"}
                </strong>{" "}
                · {es ? "vence" : "expires"}: {date(currentPlan.expires_at)}
              </p>
              <p>{currentPlan.rationale}</p>
              <p className="acq-muted">
                {es
                  ? "Discovery amplio permanece pausado porque ya existe inventario por resolver. Compañía, empleo y social son dimensiones de evidencia, no puntos que se suman. Ningún elemento concede ejecución autónoma."
                  : "Broad Discovery remains paused because existing inventory still has resolvable uncertainty. Company, Job and Social are evidence dimensions, not additive points. No item grants autonomous execution."}
              </p>
              <ol>
                {currentPlan.items.map((item) => {
                  const execution = currentExecution?.items.find((value) => value.position === item.position)
                  return <li key={`${currentPlan.id}-${item.position}`}>
                    <h4>{item.workClass.replaceAll("_", " ")}</h4>
                    <p>
                      {es ? "Dimensión elegida" : "Selected dimension"}: {execution?.selectedDimension ?? item.dimension ?? "—"} · {es ? "objetivo" : "target"}: {item.candidateId ?? item.accountId ?? "—"}
                    </p>
                    <p><strong>{es ? "Por qué ahora:" : "Why now:"}</strong> {execution?.reason ?? item.reason}</p>
                    <p><strong>{es ? "Qué podría cambiar la decisión:" : "What could change the decision:"}</strong> {execution?.expectedInformationGain ?? item.expectedInformationGain}</p>
                    <p><strong>{es ? "Criterio de agotamiento:" : "Exhaustion condition:"}</strong> {execution?.stopCondition ?? item.stopCondition}</p>
                    <p className="acq-muted">
                      {es ? "Presupuesto" : "Budget"}: {execution?.budget?.maxRequests ?? item.budget.maxRequests} {es ? "lecturas" : "reads"} / {execution?.budget?.maxMinutes ?? item.budget.maxMinutes} min
                    </p>
                    {execution?.outcome && <>
                      <p><strong>{es ? "Aprendimos:" : "Learned:"}</strong> {execution.outcome.evidenceSummary}</p>
                      <p><strong>{es ? "Cambio:" : "Change:"}</strong> {execution.outcome.worthinessBefore} → {execution.outcome.worthinessAfter} · {execution.outcome.hypothesisChange}</p>
                      <p><strong>{es ? "Sigue desconocido:" : "Still unknown:"}</strong> {execution.outcome.unknownAfter}</p>
                      <p><strong>{es ? "Siguiente acción legítima:" : "Next legitimate action:"}</strong> {execution.outcome.nextAction}</p>
                    </>}
                  </li>
                })}
              </ol>
            </section>
          )}
          {data.conversationPolicy && (
            <p className="acq-muted">
              {es
                ? `Conversation-worthiness v${data.conversationPolicy.version} está integrada junto a Cycle v${data.conversationPolicy.base_policy_version}; no cambia admisión ni autoriza outreach.`
                : `Conversation-worthiness v${data.conversationPolicy.version} is integrated beside Cycle v${data.conversationPolicy.base_policy_version}; it changes neither admission nor outreach authority.`}
            </p>
          )}
          {calibration.length > 0 && (
            <details>
              <summary>{es ? "Calibración comercial de candidatas" : "Candidate commercial calibration"}</summary>
              <p>
                {es
                  ? "El estado estricto del Engine y el valor de conversar se muestran por separado. Una conversación serviría para aprender; no confirma necesidad interna ni autoriza outreach."
                  : "Strict Engine state and conversation-worthiness are shown separately. A conversation would be for learning; it does not confirm internal need or authorize outreach."}
              </p>
              <ul>
                {calibration.map((review) => (
                  <li key={`${review.calibration_id}-${review.candidate_id}`}>
                    <strong>{review.name ?? review.candidate_id}</strong> · {review.market} · {review.conversation_worthiness}
                    <p>{review.current_engine_state} · {review.strict_result} · internal need: UNKNOWN</p>
                    <p>{review.reason}</p>
                    <p><strong>{es ? "Falsificador:" : "Falsifier:"}</strong> {review.material_falsifier}</p>
                    <p><strong>{es ? "Aprendizaje buscado:" : "Learning goal:"}</strong> {review.outreach_learning_goal}</p>
                  </li>
                ))}
              </ul>
            </details>
          )}
          {authenticated && (
            <details>
              <summary>{es ? "Prueba de investigación autenticada" : "Authenticated research proof"}</summary>
              <p>{authenticated.surface} · {authenticated.profile} · {authenticated.status}</p>
              <p className="acq-muted">
                {es
                  ? "Prueba de capacidad de lectura solamente; no es evidencia sobre una candidata y no realizó acciones sociales."
                  : "Read-capability proof only; it is not candidate evidence and performed no social actions."}
              </p>
            </details>
          )}
          {(data.reviewBatches ?? [])
            .filter((b) => !cycleId || b.cycle_id === cycleId)
            .map((b) => (
              <section
                key={b.id}
                aria-label={es ? "Revisión del lote" : "Batch review"}
              >
                <h3>{es ? "Lote de exploración" : "Discovery batch"}</h3>
                <p>
                  {b.state === "OPEN"
                    ? es
                      ? "En exploración acotada"
                      : "Bounded discovery in progress"
                    : es
                      ? "Requiere revisión de Management"
                      : "Management review required"}
                </p>
                <p>
                  {es ? "Candidatas nuevas" : "New candidates"}:{" "}
                  {b.new_candidates} / {b.maximum_new}.{" "}
                  {es
                    ? "Candidatas anteriores conservadas"
                    : "Previous candidates retained"}
                  : {b.retained_baseline_count}.
                </p>
                <p>{b.direction}</p>
                {b.stop_reason && <p>{b.stop_reason}</p>}
                <p className="acq-muted">
                  {es
                    ? "El límite del lote no es una cuota de calificación. Una admisión a Account inicia investigación, no outreach. El siguiente lote requiere otra decisión explícita."
                    : "The batch ceiling is not a qualification quota. Account admission starts research, not outreach. Another batch requires a new explicit decision."}
                </p>
                <ul>
                  {(data.batchCandidates ?? [])
                    .filter((c) => c.batch_id === b.id)
                    .map((c) => (
                      <li key={c.candidate_id}>
                        <strong>{c.name}</strong> · {identity(c.identity_state)}{" "}
                        ·{" "}
                        {c.account_id
                          ? es
                            ? "Account en investigación"
                            : "Account under research"
                          : es
                            ? "Candidata conservada"
                            : "Retained candidate"}{" "}
                        · {es ? "Mercado de la búsqueda" : "Search market"}: {c.market_context ?? "—"} · {c.source}
                        {c.found_because && <p>{es ? "Señal de búsqueda, aún por corroborar: " : "Search lead, still requiring corroboration: "}{c.found_because}</p>}
                        {c.investigation_summary && <p>{c.investigation_summary}</p>}
                        <p>{c.reviewed_next_action ?? (es ? "Siguiente paso: revisión acotada de identidad y señal; no se ha autorizado outreach." : "Next: bounded identity and signal review; outreach is not authorized.")}</p>
                        <p className="acq-muted">{c.research_outcome ?? (es ? "Sin resultado de investigación de Account" : "No Account research outcome")}</p>
                      </li>
                    ))}
                </ul>
              </section>
            ))}
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
              ? "México y Estados Unidos se exploran sin cuotas. El mercado de la búsqueda no confirma el domicilio de la organización. La cobertura visible no representa todo el mercado. El horario instalado y la última actividad están en Trabajo y salud."
              : "Mexico and the United States are explored without quotas. Search market does not establish an organization's domicile. Visible coverage is not the whole market. The installed schedule and latest activity are in Work / Health."}
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
                    · {es ? "Mercados de búsqueda" : "Search markets"}: {(c.market_contexts ?? []).join(" / ")} ·{" "}
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
                  {data.journeys
                    ?.filter((j) => j.candidate_id === c.id)
                    .map((j) => (
                      <details key={j.candidate_id}>
                        <summary>
                          {es
                            ? "Recorrido de investigación"
                            : "Discovery journey"}
                        </summary>
                        <p>
                          {es ? "Estado actual: " : "Current state: "}
                          {identity(c.identity_state)}.
                          {c.admissions === 0 &&
                            (es
                              ? " Sin admisión a Account ni investigación posterior. Revisión de Management antes de decidir otro paso; no se ha descartado por falta de evidencia."
                              : " No Account admission or downstream research. Management review precedes another step; missing evidence is not dismissal.")}
                        </p>
                        {(j.executions ?? []).map((execution) => (
                          <section key={execution.workItemId}>
                            <h5>
                              {es
                                ? "Investigación ejecutada por el Engine"
                                : "Engine investigation work"}
                            </h5>
                            <p>{execution.direction}</p>
                            <p>
                              {execution.status === "COMPLETED"
                                ? es
                                  ? "Trabajo completado"
                                  : "Work completed"
                                : es
                                  ? "Trabajo pendiente o en revisión"
                                  : "Work pending or under review"}{" "}
                              · {execution.requests ?? 0}{" "}
                              {es ? "lecturas intentadas" : "attempted reads"}
                            </p>
                            <p>
                              {execution.accountId
                                ? es
                                  ? "Admitida como Account"
                                  : "Admitted as Account"
                                : es
                                  ? "Sin admisión: consulta la decisión y evidencia."
                                  : "Not admitted: inspect decision and evidence."}
                            </p>
                            <details>
                              <summary>
                                {es
                                  ? "Evidencia, reconciliación y decisión"
                                  : "Evidence, reconciliation and decision"}
                              </summary>
                              <pre
                                style={{
                                  whiteSpace: "pre-wrap",
                                  overflowWrap: "anywhere",
                                }}
                              >
                                {JSON.stringify(
                                  {
                                    workItem: execution.workItemId,
                                    actor: execution.actorType,
                                    evidence: execution.evidence,
                                    decision: execution.decision,
                                    admission: execution.admission,
                                  },
                                  null,
                                  2,
                                )}
                              </pre>
                            </details>
                          </section>
                        ))}
                        <h5>
                          {es
                            ? "Origen y motivo de búsqueda"
                            : "Origin and search rationale"}
                        </h5>
                        {j.origins.map((o, i) => (
                          <div key={i}>
                            <p>
                              {o.source} · {o.jobTitle ?? o.sourceEntity}
                            </p>
                            <p>{o.hypothesis}</p>
                            <p>{o.reason}</p>
                            <details>
                              <summary>
                                {es
                                  ? "Búsqueda e intentos originales"
                                  : "Original search and attempts"}
                              </summary>
                              <pre
                                style={{
                                  whiteSpace: "pre-wrap",
                                  overflowWrap: "anywhere",
                                }}
                              >
                                {JSON.stringify(
                                  {
                                    search: o.search,
                                    attempts: o.attempts,
                                    requests: o.requests,
                                    status: o.runStatus,
                                  },
                                  null,
                                  2,
                                )}
                              </pre>
                            </details>
                          </div>
                        ))}
                        <h5>
                          {es
                            ? "Registros históricos de Management"
                            : "Historical Management records"}
                        </h5>
                        {!j.investigations.length && (
                          <p>
                            {es
                              ? "No hay investigación adicional registrada."
                              : "No further investigation recorded."}
                          </p>
                        )}
                        {j.investigations.map((v, i) => (
                          <div key={i}>
                            <p className="acq-muted">{date(v.recordedAt)}</p>
                            <p>{v.summary}</p>
                            <p>
                              <strong>
                                {es
                                  ? "Acción propuesta entonces:"
                                  : "Action proposed at that time:"}
                              </strong>{" "}
                              {v.nextAction}
                            </p>
                            <ul>
                              {v.limitations.map((l, k) => (
                                <li key={k}>{l}</li>
                              ))}
                            </ul>
                            <details>
                              <summary>
                                {es
                                  ? "Fuentes, intentos y procedencia"
                                  : "Sources, attempts and provenance"}
                              </summary>
                              <p>
                                {v.actorType} · {v.actorId} ·{" "}
                                {date(v.recordedAt)}
                              </p>
                              <p>
                                {es
                                  ? "Observaciones registradas por Management; no equivalen a verificación automática de identidad."
                                  : "Management-recorded observations are not automatic identity verification."}
                              </p>
                              <ul>
                                {v.attempts.map((a, k) => (
                                  <li key={k}>
                                    <p>
                                      {a.mechanism} · {a.outcome} ·{" "}
                                      {date(a.observedAt)}
                                    </p>
                                    {a.uri?.startsWith("https://") && (
                                      <a
                                        href={a.uri}
                                        target="_blank"
                                        rel="noreferrer"
                                      >
                                        {a.uri}
                                      </a>
                                    )}
                                    <p>{a.query}</p>
                                    <p>{a.finding}</p>
                                  </li>
                                ))}
                              </ul>
                            </details>
                          </div>
                        ))}
                        <details>
                          <summary>
                            {es
                              ? "Historial de decisiones y política"
                              : "Decision and policy history"}
                          </summary>
                          <pre
                            style={{
                              whiteSpace: "pre-wrap",
                              overflowWrap: "anywhere",
                            }}
                          >
                            {JSON.stringify(j.decisions, null, 2)}
                          </pre>
                        </details>
                      </details>
                    ))}
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
                  {p.management_direction && (
                    <details>
                      <summary>{es ? "Dirección y autoridad" : "Direction and authority"}</summary>
                      <p>{p.management_direction}</p>
                      <p>{es ? "Dirección solicitada por: " : "Direction requested by: "}{p.direction_actor_type === "PANCRACIO_GATEWAY" ? "Pancracio" : "Management"}</p>
                      <p>{es ? "Ejecución bajo el objetivo permanente autorizado del Cycle; no implica que el Human haya redactado esta dirección." : "Execution uses the authorized standing Cycle objective; this does not imply the Human authored this direction."}</p>
                    </details>
                  )}
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
