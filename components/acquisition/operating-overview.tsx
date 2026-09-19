"use client"
import { useEffect, useState } from "react"
import {
  acquisitionApi as api,
  type CycleReview,
  type CyclePoolItem,
} from "@/lib/acquisition-api"
import type { Locale } from "@/lib/i18n"
import { readinessText } from "@/lib/acquisition-readiness"
import { EngineActivity } from "./engine-activity"
import { CandidateInventory } from "./candidate-inventory"
import {
  candidateManagementTruth,
  marketContextCounts,
  type DiscoveryTruth,
} from "@/lib/acquisition-management-truth"

export function OperatingOverview({
  cycleId,
  locale,
  onNavigate,
}: {
  cycleId: string
  locale: Locale
  onNavigate: (tab: string) => void
}) {
  const es = locale === "es",
    [review, setReview] = useState<CycleReview | null>(null),
    [discovery, setDiscovery] = useState<DiscoveryTruth | null>(null),
    [failed, setFailed] = useState(false)
  useEffect(() => {
    let live = true
    Promise.all([api.cycleReview(cycleId), api.discovery()])
      .then(([r, d]) => {
        if (live) {
          setReview(r.review)
          setDiscovery(d)
        }
      })
      .catch(() => {
        if (live) setFailed(true)
      })
    return () => {
      live = false
    }
  }, [cycleId])
  if (failed)
    return (
      <p role="alert">
        {es
          ? "No se pudo verificar el progreso. Actualiza antes de decidir."
          : "Progress could not be verified. Refresh before deciding."}
      </p>
    )
  if (!review || !discovery)
    return <p>{es ? "Consultando progreso…" : "Loading progress…"}</p>
  const candidates = candidateManagementTruth(discovery)
  const markets = marketContextCounts(discovery)
  const contacted = candidates.filter((c) => c.contacted)
  const latestSession = discovery.routineOperatingSessions?.[0]
  const recordedLearning =
    typeof latestSession?.report?.learning === "string"
      ? latestSession.report.learning
      : ""
  const wave = review.waves.at(-1),
    halt =
      !!review.control?.technical_halt || review.control?.state === "STOPPED",
    needsReview = wave?.state === "REVIEW_REQUIRED",
    waveReady = wave?.state === "PLANNED",
    revalidation =
      waveReady &&
      (!wave.members?.length ||
        wave.members.some((m) => m.readinessReason !== "EXECUTABLE_CANDIDATE"))
  return (
    <>
      <section className="acq-panel">
        <h2>{es ? "Qué sigue" : "What happens next"}</h2>
        <p>
          {halt
            ? es
              ? "El Cycle está pausado. Inspecciona el motivo antes de continuar."
              : "The Cycle is paused. Inspect the issue before continuing."
            : needsReview
              ? es
                ? "La wave terminó su ventana inicial. Management debe revisar resultados."
                : "The wave completed its initial window. Management review is required."
              : revalidation
                ? es
                  ? "La wave propuesta necesita revalidación. Revisa sus condiciones pendientes; aún no se puede aprobar."
                  : "The proposed wave needs revalidation. Review its unmet requirements; it cannot be approved yet."
                : waveReady
                  ? es
                    ? "La composición está lista para revisión; aún no autoriza contacto."
                    : "The composition is ready for review; it does not authorize outreach yet."
                  : latestSession?.status === "HELD_REVIEW"
                    ? es
                      ? "La ventana terminó y la recurrencia está detenida para revisión humana. Las candidatas y la evidencia se conservan."
                      : "The window ended and recurrence is held for Human review. Candidates and evidence remain available."
                    : es
                      ? "El Engine procesa trabajo interno autorizado. La próxima wave requiere aprobación exacta."
                      : "The Engine processes authorized internal work. The next wave requires exact approval."}
        </p>
        <button
          onClick={() =>
            onNavigate(
              halt
                ? "Work / Health"
                : latestSession?.status === "HELD_REVIEW"
                  ? "Discovery"
                  : "Waves",
            )
          }
        >
          {halt
            ? es
              ? "Inspeccionar problema"
              : "Inspect issue"
            : needsReview
              ? es
                ? "Revisar resultados"
                : "Review results"
              : latestSession?.status === "HELD_REVIEW"
                ? es
                  ? "Revisar exploración"
                  : "Review discovery"
                : waveReady
                  ? es
                    ? "Revisar wave"
                    : "Review wave"
                  : es
                    ? "Ver preparación de wave"
                    : "View wave preparation"}
        </button>
      </section>
      <section
        className="acq-metrics"
        aria-label={es ? "Progreso del Cycle" : "Cycle progress"}
      >
        <div>
          <span>
            {es ? "Candidatas descubiertas" : "Discovered candidates"}
          </span>
          <strong>{discovery.totals.candidates}</strong>
        </div>
        <div>
          <span>{es ? "Accounts admitidos" : "Admitted Accounts"}</span>
          <strong>
            {review.discovery?.admitted ?? discovery.totals.admitted} /{" "}
            {review.discovery?.maximum ?? "—"}
          </strong>
        </div>
        <div>
          <span>
            {es ? "Contactadas en exploración" : "Exploratory contacts"}
          </span>
          <strong>{contacted.length}</strong>
        </div>
        {Object.values(review.pool).some((n) => n > 0) &&
          [
            ["READY_NOW", es ? "Listas ahora" : "Ready now"],
            ["RETAINED", es ? "Retenidas" : "Retained"],
            ["HOLD", es ? "Requieren revisión" : "Needs review"],
            ["REJECTED", es ? "Rechazadas" : "Rejected"],
          ].map(([key, label]) => (
            <div key={key}>
              <span>{label}</span>
              <strong>{review.pool[key!] ?? 0}</strong>
            </div>
          ))}
        {Object.values(review.pool).some((n) => n > 0) && (
          <div>
            <span>
              {es
                ? "Contactos / intentos de wave de Accounts"
                : "Account-wave contacts / attempts"}
            </span>
            <strong>
              {review.newProspects} / {review.attempts}
            </strong>
          </div>
        )}
      </section>
      <section className="acq-panel">
        <h2>{es ? "Exploración de mercado" : "Market exploration"}</h2>
        <dl>
          <div>
            <dt>
              {es ? "México · contexto de búsqueda" : "Mexico · search context"}
            </dt>
            <dd>
              {markets.MX} {es ? "candidatas" : "candidates"}
            </dd>
          </div>
          <div>
            <dt>
              {es
                ? "Estados Unidos · contexto de búsqueda"
                : "United States · search context"}
            </dt>
            <dd>
              {markets.US} {es ? "candidatas" : "candidates"}
            </dd>
          </div>
          <div>
            <dt>{es ? "Mixto o incierto" : "Mixed or uncertain"}</dt>
            <dd>{markets.ambiguous}</dd>
          </div>
        </dl>
        <p>
          {es
            ? "Poca evidencia de un mercado significa exploración limitada, no falta de oportunidad. No hay cuotas por país."
            : "Little evidence from a market means limited exploration, not lack of opportunity. There are no country quotas."}
        </p>
      </section>
      {contacted.length > 0 && (
        <section className="acq-panel">
          <h2>{es ? "Contacto y espera" : "Contact and waiting"}</h2>
          {contacted.map((c) => (
            <p key={c.id}>
              <strong>{c.name}</strong> ·{" "}
              {es
                ? "contactada; esperando respuesta"
                : "contacted; waiting for reply"}{" "}
              · {es ? "seguimiento autorizado" : "follow-up authorized"}:{" "}
              {c.followUpAuthority === "NONE"
                ? "No"
                : c.followUpAuthority
                  ? es
                    ? "sólo con autorización exacta"
                    : "only with exact authorization"
                  : es
                    ? "sin confirmar"
                    : "unconfirmed"}
            </p>
          ))}
        </section>
      )}
      <EngineActivity locale={locale} />
      <section className="acq-panel">
        <h2>{es ? "Aprendizaje y resultados" : "Learning and outcomes"}</h2>
        {recordedLearning && (
          <p>
            <strong>
              {es
                ? "Último aprendizaje registrado (idioma original)"
                : "Latest recorded learning"}
              :
            </strong>{" "}
            {recordedLearning.length > 420
              ? `${recordedLearning.slice(0, 420).replace(/\s+\S*$/, "")}…`
              : recordedLearning}
          </p>
        )}
        <p>
          {review.attempts === 0 && contacted.length === 0
            ? es
              ? "Todavía no hay resultados de contacto. La evidencia de investigación y sus límites permanecen disponibles en Oportunidades."
              : "There are no outreach outcomes yet. Research evidence and its limits remain available in Opportunities."
            : `${es ? "Contactos exploratorios registrados" : "Recorded exploratory contacts"}: ${contacted.length} · ${es ? "Respuestas" : "Responses"}: ${Object.values(review.responses).reduce((n, v) => n + v, 0)} · ${es ? "Handoffs" : "Handoffs"}: ${review.funnel?.handoffs ?? 0}`}
        </p>
        <p>
          {es
            ? "No responder no prueba falta de fit. Las conclusiones de mercado requieren interpretación de Management; los ensayos sintéticos no son aprendizaje comercial."
            : "No response does not prove non-fit. Market conclusions require Management interpretation; synthetic rehearsals are not commercial learning."}
        </p>
      </section>
    </>
  )
}

export function OpportunityPool({
  cycleId,
  locale,
  onInspect,
}: {
  cycleId: string
  locale: Locale
  onInspect: (id: string) => void
}) {
  const es = locale === "es",
    [items, setItems] = useState<CyclePoolItem[]>([]),
    [discovery, setDiscovery] = useState<DiscoveryTruth | null>(null),
    [discoveryFailed, setDiscoveryFailed] = useState(false),
    [failed, setFailed] = useState(false),
    [more, setMore] = useState(false),
    [pending, setPending] = useState(false)
  useEffect(() => {
    let live = true
    if (!cycleId) return
    api
      .discovery()
      .then((d) => {
        if (live) setDiscovery(d)
      })
      .catch(() => {
        if (live) setDiscoveryFailed(true)
      })
    api
      .cyclePool(cycleId)
      .then((r) => {
        if (live) {
          setItems(r.items)
          setMore(r.items.length === 25)
        }
      })
      .catch(() => {
        if (live) setFailed(true)
      })
    return () => {
      live = false
    }
  }, [cycleId])
  async function next() {
    setPending(true)
    try {
      const r = await api.cyclePool(cycleId, items.at(-1)?.account_id)
      setItems((old) => [...old, ...r.items])
      setMore(r.items.length === 25)
    } catch {
      setFailed(true)
    } finally {
      setPending(false)
    }
  }
  return (
    <section>
      <h2>{es ? "Oportunidades" : "Opportunities"}</h2>
      <p>
        {es
          ? "No seleccionada no significa rechazada. La evidencia y las oportunidades se conservan fuera de la wave."
          : "Not selected does not mean rejected. Evidence and opportunities remain available outside the wave."}
      </p>
      {discovery && <CandidateInventory data={discovery} locale={locale} />}
      {discoveryFailed && (
        <p role="alert">
          {es
            ? "No se pudo verificar el inventario de candidatas; el pool de Accounts no es toda la oportunidad."
            : "Candidate inventory could not be verified; the Account pool is not the whole opportunity."}
        </p>
      )}
      <h3>{es ? "Accounts admitidos" : "Admitted Accounts"}</h3>
      {failed && (
        <p role="alert">
          {es
            ? "No se pudo verificar el pool completo."
            : "The complete pool could not be verified."}
        </p>
      )}
      {!cycleId && (
        <p className="acq-empty">
          {es
            ? "Todavía no se han investigado empresas reales."
            : "No real companies have been researched yet."}
        </p>
      )}
      {[
        ["READY_NOW", es ? "Listas ahora" : "Ready now"],
        ["RETAINED", es ? "Retenidas" : "Retained"],
        ["HOLD", es ? "Requieren revisión" : "Needs review"],
        [
          "REJECTED",
          es ? "Rechazadas con evidencia" : "Evidence-supported rejection",
        ],
      ].map(([key, label]) => (
        <section className="acq-panel" key={key}>
          <h3>{label}</h3>
          {!items.some((i) => i.pool_state === key) && (
            <p>
              {es
                ? "Sin oportunidades en esta página."
                : "No opportunities on this page."}
            </p>
          )}
          <div className="acq-cards">
            {items
              .filter((i) => i.pool_state === key)
              .map((i) => (
                <article key={i.account_id}>
                  <h4>{i.display_name}</h4>
                  <p>
                    {i.country ??
                      (es ? "País sin confirmar" : "Country unconfirmed")}{" "}
                    · {i.canonical_domain}
                  </p>
                  <p>
                    {i.intervention_hypothesis ??
                      (es
                        ? "Hipótesis de intervención pendiente de evidencia."
                        : "Intervention hypothesis awaiting evidence.")}
                  </p>
                  <p>
                    {es ? "Responsable" : "Problem owner"}:{" "}
                    {i.buyer_name ??
                      i.buyer_role_hypothesis ??
                      (es ? "Sin resolver" : "Unresolved")}
                  </p>
                  <p>
                    {i.channel === "EMAIL"
                      ? es
                        ? "Email respaldado; sujeto a los gates de ejecución."
                        : "Supported email; execution gates still apply."
                      : es
                        ? "Sin canal ejecutable confirmado."
                        : "No confirmed executable channel."}
                  </p>
                  <p>{readinessText(i.readiness_reason, locale)}</p>
                  <button onClick={() => onInspect(i.account_id)}>
                    {es
                      ? "Revisar evidencia y siguiente acción"
                      : "Review evidence and next action"}
                  </button>
                </article>
              ))}
          </div>
        </section>
      ))}
      {more && (
        <button disabled={pending} onClick={() => void next()}>
          {es ? "Mostrar más oportunidades" : "Show more opportunities"}
        </button>
      )}
    </section>
  )
}

/** Management decisions only; routine queued research is not Human Attention. */
export function CycleAttention({
  cycleId,
  locale,
  onNavigate,
}: {
  cycleId: string
  locale: Locale
  onNavigate: (tab: string) => void
}) {
  const [review, setReview] = useState<CycleReview | null>(null),
    [discovery, setDiscovery] = useState<DiscoveryTruth | null>(null),
    [failed, setFailed] = useState(false)
  useEffect(() => {
    let live = true
    api
      .cycleReview(cycleId)
      .then((r) => {
        if (live) setReview(r.review)
      })
      .catch(() => {
        if (live) setFailed(true)
      })
    api
      .discovery()
      .then((d) => {
        if (live) setDiscovery(d)
      })
      .catch(() => {})
    return () => {
      live = false
    }
  }, [cycleId])
  const es = locale === "es",
    wave = review?.waves.at(-1),
    held = discovery?.routineOperatingSessions?.[0]?.status === "HELD_REVIEW",
    halt =
      review?.control?.technical_halt || review?.control?.state === "STOPPED"
  if (failed)
    return (
      <p role="alert">
        {es
          ? "No se pudo verificar la revisión del Cycle."
          : "Cycle review could not be verified."}
      </p>
    )
  if (!review)
    return <p>{es ? "Consultando decisiones…" : "Loading decisions…"}</p>
  if (
    !halt &&
    !held &&
    !["PLANNED", "REVIEW_REQUIRED"].includes(wave?.state ?? "")
  )
    return null
  return (
    <section className="acq-panel">
      <h2>
        {halt
          ? es
            ? "Cycle pausado"
            : "Cycle paused"
          : held
            ? es
              ? "Revisar ventana de operación"
              : "Review operating window"
            : wave?.state === "REVIEW_REQUIRED"
              ? es
                ? "Revisar resultados de wave"
                : "Review wave outcomes"
              : es
                ? "Revisar preparación de wave"
                : "Review wave preparation"}
      </h2>
      <p>
        {halt
          ? es
            ? "Una condición técnica o de Management impide continuar."
            : "A technical or Management condition prevents progression."
          : held
            ? es
              ? "La recurrencia está detenida. Management debe evaluar la asignación y la calidad de información antes de otra ventana."
              : "Recurrence is held. Management must assess allocation and information quality before another window."
            : es
              ? "La composición y su evidencia necesitan una decisión de Management; el scheduler no aprueba waves."
              : "Composition and evidence require a Management decision; the scheduler does not approve waves."}
      </p>
      {review.control?.technical_halt && <p>{review.control.technical_halt}</p>}
      <button onClick={() => onNavigate(held ? "Discovery" : "Waves")}>
        {es ? "Inspeccionar decisión" : "Inspect decision"}
      </button>
    </section>
  )
}
