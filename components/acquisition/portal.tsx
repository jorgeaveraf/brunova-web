"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { CrmBoundarySection } from "./crm-boundary"
import { CycleControlSection } from "./cycle-control"
import { PolicySettings } from "./policy-settings"
import { EngineActivity } from "./engine-activity"
import { ActivationPreflight } from "./activation-preflight"
import { DiscoverySection } from "./discovery"
import { OutreachState } from "./outreach-state"
import { DiscoveryHealth } from "./discovery-health"
import {
  OperatingOverview,
  OpportunityPool,
  CycleAttention,
} from "./operating-overview"
import { EvidenceDimensions } from "./evidence-dimensions"
import { ProblemOwner } from "./problem-owner"
import {
  acquisitionText,
  acquisitionErrorText,
  acquisitionCode,
  type AcquisitionCopyKey,
} from "@/content/acquisition-locale"
import { localizedPath, type Locale } from "@/lib/i18n"
import {
  acquisitionApi as api,
  AcquisitionError,
  type PortalSession,
  type Cycle,
  type Account,
  type AccountDetail,
  type Attention,
  type Counts,
  type Health,
  type Work,
  type Disposition,
  type DispositionInput,
} from "@/lib/acquisition-api"

function copyFor(locale: Locale) {
  const t = (key: AcquisitionCopyKey) => acquisitionText(locale, key)
  return {
    t,
    humanize: (code: string) => acquisitionCode(locale, code),
    when: (date: string | null) =>
      date
        ? new Date(date).toLocaleString(locale === "es" ? "es-MX" : "en-US")
        : t("Sin actividad"),
  }
}
const epistemic: Record<string, AcquisitionCopyKey> = {
  OBSERVED_FACT: "Lo que sabemos · Hechos observados",
  SUPPORTED_INFERENCE: "Lo que respalda la evidencia · Inferencias",
  WORKING_HYPOTHESIS: "Hipótesis de trabajo",
  UNKNOWN: "Lo que no sabemos",
  CONFLICT_OR_STALE: "Evidencia desactualizada / en conflicto",
}
function Lines({
  values,
  empty,
  locale,
  coded = false,
}: {
  values: string[]
  empty?: string
  locale: Locale
  coded?: boolean
}) {
  const { t, humanize } = copyFor(locale)
  return values.length ? (
    <ul>
      {values.map((v, i) => (
        <li key={i}>{coded ? humanize(v) : v}</li>
      ))}
    </ul>
  ) : (
    <p className="acq-muted">
      {empty ?? t("Sin factores adicionales registrados.")}
    </p>
  )
}
function Meaning({ item, locale }: { item: Attention; locale: Locale }) {
  const { t, humanize, when } = copyFor(locale)
  const r = item.result
  return (
    <>
      <div className="acq-badges">
        <span>
          {t("Prioridad")} {humanize(r.tier)}
        </span>
        <span>
          {t("Evidencia")} {humanize(r.evidenceConfidence)}
        </span>
        <span>{humanize(item.status)}</span>
        {item.stale && <span>{t("Revisión desactualizada")}</span>}
      </div>
      <h3>{t("Por qué ahora · soporte observado")}</h3>
      <Lines
        locale={locale}
        values={r.whyNow.map(
          (w) => `${w.observedContext} · ${when(w.validAsOf)}`,
        )}
        empty={t("No hay un fundamento vigente registrado.")}
      />
      <p className="acq-muted">
        {t("Recomendación:")} {humanize(r.recommendation)}
      </p>
      <h3>{t("Qué limita la confianza")}</h3>
      <Lines
        locale={locale}
        coded
        values={[...r.hardStops, ...r.limitingFactors]}
      />
      <h3>{t("Qué falta saber")}</h3>
      <Lines locale={locale} values={r.knownUnknowns} />
      <h3>{t("Incógnitas materiales")}</h3>
      <Lines
        locale={locale}
        values={r.materialUnknowns}
        empty={t("Ningún bloqueo material explícito registrado.")}
      />
    </>
  )
}
export function AcquisitionPortal({
  session,
  locale,
}: {
  session: PortalSession
  locale: Locale
}) {
  const { t, humanize, when } = copyFor(locale)
  const [cycles, setCycles] = useState<Cycle[]>([]),
    [cycleId, setCycleId] = useState("")
  const [tab, setTab] = useState("Overview"),
    [outcome, setOutcome] = useState(""),
    [cursor, setCursor] = useState("")
  const [accounts, setAccounts] = useState<Account[]>([]),
    [next, setNext] = useState<string | null>(null)
  const [active, setActive] = useState<Attention[]>([]),
    [all, setAll] = useState<Attention[]>([]),
    [counts, setCounts] = useState<Counts | null>(null)
  const [health, setHealth] = useState<Health | null>(null),
    [work, setWork] = useState<Work[]>([]),
    [workCursor, setWorkCursor] = useState(""),
    [workState, setWorkState] = useState(""),
    [workNext, setWorkNext] = useState<string | null>(null)
  const [loading, setLoading] = useState(true),
    [error, setError] = useState<AcquisitionError | null>(null),
    [notice, setNotice] = useState("")
  const [detail, setDetail] = useState<AccountDetail | null>(null),
    [selected, setSelected] = useState<Attention | null>(null),
    [detailLoading, setDetailLoading] = useState(false)
  const [choice, setChoice] = useState<Disposition | null>(null),
    [reason, setReason] = useState(""),
    [notes, setNotes] = useState(""),
    [pending, setPending] = useState(false)
  const [hasCommand, setHasCommand] = useState(false)
  const [projectionRevision, setProjectionRevision] = useState(0)
  const command = useRef<DispositionInput | null>(null),
    generation = useRef(0),
    lock = useRef(false),
    dialog = useRef<HTMLDialogElement>(null)
  const canDecide = session.actor.capabilities.includes(
    "RECORD_ATTENTION_DISPOSITION",
  )
  const cycle = cycles.find((c) => c.cycleId === cycleId)
  const refresh = useCallback(async () => {
    const run = ++generation.current
    setLoading(true)
    setError(null)
    try {
      await api.contract()
      const [cs, hs] = await Promise.all([
        api.cycles(),
        session.actor.capabilities.includes("VIEW_HEALTH")
          ? api.health()
          : Promise.resolve(null),
      ])
      if (run !== generation.current) return
      setCycles(cs.items)
      setHealth(hs)
      const current = cycleId || cs.items[0]?.cycleId || ""
      if (current !== cycleId) {
        setCycleId(current)
        return
      }
      if (current) {
        const [as, ats, everyone, totals, ws] = await Promise.all([
          api.accounts(current, outcome, cursor),
          api.attention(current, true),
          api.attention(current, false),
          api.counts(current),
          api.work(current, workCursor, workState),
        ])
        if (run !== generation.current) return
        setAccounts(as.items)
        setNext(as.nextCursor)
        setActive(ats.items)
        setAll(everyone.items)
        setCounts(totals)
        setWork(ws.items)
        setWorkNext(ws.nextCursor)
      } else {
        setAccounts([])
        setActive([])
        setAll([])
        setCounts(null)
        setWork([])
      }
    } catch (e) {
      if (run === generation.current)
        setError(e instanceof AcquisitionError ? e : new AcquisitionError(503))
    } finally {
      if (run === generation.current) {
        setLoading(false)
        setProjectionRevision((v) => v + 1)
      }
    }
  }, [
    cycleId,
    outcome,
    cursor,
    workCursor,
    workState,
    session.actor.capabilities,
  ])
  useEffect(() => {
    let cancelled = false
    queueMicrotask(() => {
      if (!cancelled) void refresh()
    })
    return () => {
      cancelled = true
    }
  }, [refresh])
  async function inspect(accountId: string, attention: Attention | null) {
    setDetail(null)
    setSelected(attention)
    setChoice(null)
    setReason("")
    setNotes("")
    command.current = null
    setHasCommand(false)
    setDetailLoading(true)
    dialog.current?.showModal()
    try {
      const [research, latest] = await Promise.all([
        api.detail(cycleId, accountId),
        attention
          ? api.attentionDetail(attention.attention_id)
          : Promise.resolve(null),
      ])
      setDetail(research)
      setSelected(latest)
    } catch (e) {
      setError(e instanceof AcquisitionError ? e : new AcquisitionError(503))
    } finally {
      setDetailLoading(false)
    }
  }
  async function decide() {
    if (!selected || !choice || !reason.trim() || lock.current) return
    lock.current = true
    setPending(true)
    setError(null)
    command.current ??= {
      schemaVersion: "1",
      commandId: crypto.randomUUID(),
      attentionId: selected.attention_id,
      expectedVersion: selected.version,
      disposition: choice,
      reason: reason.trim(),
      notes,
    }
    setHasCommand(true)
    try {
      const receipt = await api.disposition(command.current, session.csrfToken)
      setNotice(
        `${t("Decisión confirmada:")} ${humanize(choice)}. ${receipt.refill.activated.length ? t("La siguiente cuenta elegible fue promovida según la política vigente.") : t("Sin nuevas promociones. La capacidad es un máximo, no una cuota.")}`,
      )
      command.current = null
      setHasCommand(false)
      setChoice(null)
      dialog.current?.close()
      await refresh()
    } catch (e) {
      const failure =
        e instanceof AcquisitionError ? e : new AcquisitionError(503)
      setError(failure)
      if (failure.status === 409) {
        command.current = null
        setHasCommand(false)
        setChoice(null)
        setSelected(
          await api.attentionDetail(selected.attention_id).catch(() => null),
        )
        setDetail(
          await api.detail(cycleId, selected.account_id).catch(() => null),
        )
        await refresh()
        setError(failure)
      }
    } finally {
      setPending(false)
      lock.current = false
    }
  }
  return (
    <main id="main-content" className="acq" lang={locale}>
      <header className="acq-heading">
        <div>
          <p className="acq-kicker">{t("Portal / Adquisición")}</p>
          <h1>Acquisition</h1>
          <p>{t("Brunova Acquisition Engine · Observa, revisa y decide.")}</p>
        </div>
        <div className="acq-actions">
          <button onClick={() => void refresh()} disabled={loading || pending}>
            {t("Actualizar")}
          </button>
          <button
            onClick={async () => {
              try {
                await api.logout(session.csrfToken)
                window.location.assign(localizedPath(locale, "/portal"))
              } catch {
                setError(new AcquisitionError(503))
              }
            }}
          >
            {t("Cerrar sesión")}
          </button>
        </div>
      </header>
      {error && (
        <div role="alert" className="acq-alert">
          {acquisitionErrorText(locale, error.status)}
          {error.status === 401 && (
            <button
              onClick={() =>
                window.location.assign(`/portal/login?locale=${locale}`)
              }
            >
              {t("Iniciar sesión")}
            </button>
          )}
        </div>
      )}
      {notice && (
        <p role="status" className="acq-notice">
          {notice}
        </p>
      )}
      {loading && <p role="status">{t("Actualizando estado del Engine…")}</p>}
      <div className="acq-cycle">
        <label>
          {t("Ciclo")}{" "}
          <select
            value={cycleId}
            disabled={!cycles.length || pending}
            onChange={(e) => {
              setCycleId(e.target.value)
              setCursor("")
              setWorkCursor("")
            }}
          >
            {!cycles.length && <option value="">{t("Sin ciclo")}</option>}
            {cycles.map((c) => (
              <option key={c.cycleId} value={c.cycleId}>
                {c.cycleId.startsWith("synthetic-")
                  ? locale === "es"
                    ? "Ensayo sintético"
                    : "Synthetic rehearsal"
                  : c.policy.id === "brunova-systems-cycle-1"
                    ? "Cycle 1"
                    : "Cycle"}{" "}
                · {humanize(c.status)}
              </option>
            ))}
          </select>
        </label>
        {cycle && (
          <details>
            <summary>
              {locale === "es"
                ? "Identidad y política del Cycle"
                : "Cycle identity and policy"}
            </summary>
            <p>
              {cycle.cycleId} · {cycle.policy.id} / {cycle.policy.version}
            </p>
          </details>
        )}
      </div>
      <nav className="acq-tabs" aria-label={t("Secciones de Adquisición")}>
        {[
          ["Overview", locale === "es" ? "Resumen" : "Overview"],
          ["Discovery", locale === "es" ? "Exploración" : "Discovery"],
          ["Accounts", locale === "es" ? "Oportunidades" : "Opportunities"],
          ["Waves", "Waves"],
          ["Attention", t("Necesita tu atención")],
          ["Settings", locale === "es" ? "Configuración" : "Settings"],
          [
            "Work / Health",
            locale === "es" ? "Trabajo y salud" : "Work / Health",
          ],
        ].map(([key, label]) => (
          <button
            key={key}
            aria-current={tab === key ? "page" : undefined}
            onClick={() => setTab(key!)}
          >
            {label}
          </button>
        ))}
      </nav>
      {tab === "Settings" && (
        <PolicySettings
          key={projectionRevision}
          locale={locale}
          session={session}
          cycleId={cycleId}
        />
      )}
      {tab === "Discovery" && (
        <DiscoverySection
          key={cycleId}
          locale={locale}
          cycleId={cycleId}
          session={session}
        />
      )}
      {tab === "Work / Health" && (
        <EngineActivity key={projectionRevision} locale={locale} />
      )}
      {tab === "Work / Health" && cycle && (
        <DiscoveryHealth key={projectionRevision} locale={locale} />
      )}
      {tab === "Work / Health" && !cycle && (
        <ActivationPreflight key={projectionRevision} locale={locale} />
      )}
      {tab === "Overview" && cycle && (
        <OperatingOverview
          key={`${cycleId}:${projectionRevision}`}
          cycleId={cycleId}
          locale={locale}
          onNavigate={setTab}
        />
      )}
      {tab === "Accounts" && (
        <OpportunityPool
          key={`${cycleId}:${projectionRevision}`}
          cycleId={cycleId}
          locale={locale}
          onInspect={(id) => void inspect(id, null)}
        />
      )}
      {tab === "Waves" && (
        <OutreachState
          key={`${cycleId}:${projectionRevision}`}
          locale={locale}
        />
      )}
      {tab === "Waves" && (
        <CycleControlSection
          key={`${cycleId}:${projectionRevision}`}
          cycleId={cycleId}
          session={session}
          locale={locale}
          onInspect={(accountId) => void inspect(accountId, null)}
        />
      )}
      {tab === "Work / Health" && cycle && (
        <section className="acq-metrics" aria-label={t("Resumen")}>
          <div>
            <span>{t("Calificadas")}</span>
            <strong>{cycle?.outcomeCounts.qualified ?? "—"}</strong>
          </div>
          <div>
            <span>{t("Priorizadas")}</span>
            <strong>{counts?.counts?.prioritized_count ?? "—"}</strong>
          </div>
          <div>
            <span>{t("Atención activa")}</span>
            <strong>{counts?.counts?.active_count ?? "—"}</strong>
          </div>
          <div>
            <span>{t("En espera de capacidad")}</span>
            <strong>{counts?.counts?.overflow_count ?? "—"}</strong>
          </div>
          <div>
            <span>{t("Trabajo pendiente · global")}</span>
            <strong>{health?.pendingWorkCount ?? "—"}</strong>
          </div>
          <div>
            <span>{t("Base de datos")}</span>
            <strong>
              {health
                ? health.databaseReady
                  ? t("Disponible")
                  : t("No disponible")
                : "—"}
            </strong>
          </div>
        </section>
      )}
      {health && (tab === "Overview" || tab === "Work / Health") && (
        <p className="acq-safety">
          {t("DATOS REALES DE ADQUISICIÓN:")}{" "}
          {t(
            health.realAcquisitionDataAllowed
              ? "HABILITADOS"
              : "DESHABILITADOS",
          )}{" "}
          <span>
            {t("EFECTOS EXTERNOS:")}{" "}
            {health.externalEffectsMode === "disabled"
              ? t("DESHABILITADOS")
              : health.externalEffectsMode}
          </span>
          <small>
            {t(
              "Estado de seguridad intencional. No hay controles de activación.",
            )}
          </small>
        </p>
      )}
      {tab === "Overview" && !loading && !cycles.length && !error && (
        <section className="acq-empty">
          <h2>{t("Aún no hay un ciclo de Adquisición.")}</h2>
          <p>
            {t(
              "El Engine está preparado; no se ha iniciado investigación real. Aquí aparecerá el contexto de un ciclo autorizado.",
            )}
          </p>
          <p>
            {locale === "es"
              ? "Cycle 1 está configurado. Primero se autorizará Discovery e investigación reales; después, Management revisará la primera wave antes de cualquier contacto."
              : "Cycle 1 is configured. Real discovery and research will be authorized first; Management then reviews the first wave before any outreach."}
          </p>
          <button onClick={() => setTab("Settings")}>
            {locale === "es"
              ? "Revisar configuración del Cycle"
              : "Review Cycle settings"}
          </button>
          <ActivationPreflight key={projectionRevision} locale={locale} />
          <h3>
            {locale === "es" ? "Aprendizaje de mercado" : "Market learning"}
          </h3>
          <p>
            {locale === "es"
              ? "Comenzará cuando Cycle 1 se inicie. Los ensayos sintéticos no son evidencia del mercado."
              : "Begins when Cycle 1 starts. Synthetic rehearsals are not market evidence."}
          </p>
        </section>
      )}
      {tab === "Attention" && (
        <section>
          {cycleId && (
            <CycleAttention
              key={projectionRevision}
              cycleId={cycleId}
              locale={locale}
              onNavigate={setTab}
            />
          )}
          <div className="acq-section-heading">
            <h2>{t("Necesita tu atención")}</h2>
            <p>
              {counts?.counts
                ? `${t("Máximo")} ${counts.counts.capacity} ${t("activas")} · ${counts.counts.eligible_unresolved_count} ${t("elegibles pendientes")}`
                : t("Sin capacidad configurada")}
            </p>
          </div>
          {!active.length && !loading && (
            <div className="acq-empty">
              <h3>
                {locale === "es"
                  ? "No hay decisiones individuales de cuenta pendientes."
                  : "No individual Account decisions are pending."}
              </h3>
              <p>
                {t(
                  "Solo aparecerán cuentas que cumplan el estándar vigente. Los espacios libres no son un error.",
                )}
              </p>
            </div>
          )}
          <div className="acq-cards">
            {active.map((item) => (
              <article key={item.attention_id}>
                <h2>{item.displayName}</h2>
                <p className="acq-muted">{item.domain}</p>
                <Meaning locale={locale} item={item} />
                <button
                  disabled={pending}
                  onClick={() => void inspect(item.account_id, item)}
                >
                  {t("Revisar evidencia y decisión")}
                </button>
              </article>
            ))}
          </div>
        </section>
      )}
      {tab === "Work / Health" && cycle && (
        <section className="acq-panel">
          <h2>{t("Estado del ciclo")}</h2>
          {cycle ? (
            <>
              <h3>{t("Investigación")}</h3>
              <dl>
                {Object.entries(cycle.outcomeCounts).map(([label, n]) => (
                  <div key={label}>
                    <dt>{humanize(label)}</dt>
                    <dd>{n}</dd>
                  </div>
                ))}
              </dl>
              <h3>{t("Prioridad")}</h3>
              {counts?.configured ? (
                <>
                  <dl>
                    {Object.entries(counts.tiers).map(([label, n]) => (
                      <div key={label}>
                        <dt>{humanize(label)}</dt>
                        <dd>{n}</dd>
                      </div>
                    ))}
                  </dl>
                  <p>
                    {t("Grupo candidato:")} {counts.counts?.candidate_count}.{" "}
                    {t("En espera de capacidad")}:{" "}
                    {counts.counts?.overflow_count}.
                  </p>
                </>
              ) : (
                <p>{t("Aún no hay pool priorizado.")}</p>
              )}
            </>
          ) : (
            <p>{t("No hay un ciclo configurado.")}</p>
          )}
        </section>
      )}
      {tab === "Work / Health" && (
        <section>
          <h2>{t("Cuentas")}</h2>
          <label>
            {t("Resultado de investigación")}{" "}
            <select
              value={outcome}
              onChange={(e) => {
                setOutcome(e.target.value)
                setCursor("")
              }}
            >
              <option value="">{t("Todos")}</option>
              {["QUALIFIED", "HOLD", "REJECTED"].map((o) => (
                <option key={o} value={o}>
                  {humanize(o)}
                </option>
              ))}
            </select>
          </label>
          {!accounts.length && !loading && (
            <p className="acq-empty">
              {t("No hay cuentas para este ciclo o filtro.")}
            </p>
          )}
          <div className="acq-account-list">
            {accounts.map((a) => {
              const att = all.find((i) => i.account_id === a.accountId)
              return (
                <article key={a.accountId}>
                  <div>
                    <h3>{a.canonicalIdentity.displayName}</h3>
                    <p>{a.canonicalIdentity.domain}</p>
                  </div>
                  <div>
                    <p>{humanize(a.researchOutcome ?? a.stage)}</p>
                    <p>
                      {att
                        ? `${humanize(att.result.tier)} · ${humanize(att.status)}${att.stale ? ` · ${t("Desactualizado")}` : ""}`
                        : t("Sin prioridad / atención")}
                    </p>
                    <small>{when(a.latestMaterialActivityAt)}</small>
                  </div>
                  <button
                    onClick={() => void inspect(a.accountId, att ?? null)}
                  >
                    {t("Inspeccionar cuenta")}
                  </button>
                </article>
              )
            })}
          </div>
          <div className="acq-actions">
            <button disabled={!cursor} onClick={() => setCursor("")}>
              {t("Primera página")}
            </button>
            <button disabled={!next} onClick={() => setCursor(next ?? "")}>
              {t("Siguiente página")}
            </button>
          </div>
          <p className="acq-muted">
            {t(
              "Solicitar investigación no está habilitado en esta superficie de preactivación.",
            )}
          </p>
        </section>
      )}
      {tab === "Work / Health" && (
        <section className="acq-panel">
          <h2>Work / Health</h2>
          <label>
            {t("Estado del trabajo")}
            <select
              value={workState}
              onChange={(e) => {
                setWorkState(e.target.value)
                setWorkCursor("")
              }}
            >
              <option value="">{t("Todos")}</option>
              {[
                "QUEUED",
                "WORKING",
                "COMPLETED",
                "BLOCKED",
                "FAILED",
                "CANCELLED",
              ].map((state) => (
                <option key={state} value={state}>
                  {humanize(state)}
                </option>
              ))}
            </select>
          </label>
          <p>{t("Observabilidad; las colas no se editan desde el Portal.")}</p>
          {health && (
            <p>
              {t("Trabajo pendiente más antiguo:")}
              {when(health.oldestPendingAt)}.
            </p>
          )}
          {!work.length && !loading && (
            <p className="acq-empty">
              {t(
                "No hay trabajo registrado. El Engine no tiene tareas para este ciclo.",
              )}
            </p>
          )}
          {work.map((w) => (
            <article className="acq-work" key={w.workItemId}>
              <h3>{humanize(w.workType)}</h3>
              <p>
                {humanize(w.state)} · {t("Intentos")} {w.attemptCount}/
                {w.maxAttempts} · {t("Disponible")} {when(w.availableAt)}
              </p>
              <details>
                <summary>{t("Detalles técnicos")}</summary>
                <p>{w.workItemId}</p>
                <p>
                  {t("Correlación:")} {w.correlationId ?? t("No registrada")}
                </p>
              </details>
            </article>
          ))}
          <button disabled={!workCursor} onClick={() => setWorkCursor("")}>
            {t("Primera página de trabajo")}
          </button>
          <button
            disabled={!workNext}
            onClick={() => setWorkCursor(workNext ?? "")}
          >
            {t("Más trabajo")}
          </button>
        </section>
      )}
      <dialog
        ref={dialog}
        className="acq-dialog"
        aria-labelledby="acq-detail-title"
        onCancel={(e) => {
          if (pending) e.preventDefault()
        }}
      >
        <div className="acq-actions">
          <button disabled={pending} onClick={() => dialog.current?.close()}>
            {t("Cerrar detalle")}
          </button>
        </div>
        <h2 id="acq-detail-title">
          {detail?.canonicalIdentity.displayName ??
            selected?.displayName ??
            t("Detalle de cuenta")}
        </h2>
        {detailLoading && <p role="status">{t("Cargando evidencia…")}</p>}
        {error && (
          <p role="alert">{acquisitionErrorText(locale, error.status)}</p>
        )}
        {selected && <Meaning locale={locale} item={selected} />}
        {detail && (
          <>
            <EvidenceDimensions
              assertions={detail.assertions}
              locale={locale}
            />
            <ProblemOwner
              key={detail.accountId}
              cycleId={cycleId}
              accountId={detail.accountId}
              roleHypothesis={detail.researchDecision?.buyer_role_hypothesis}
              locale={locale}
            />
            <CrmBoundarySection
              key={detail.accountId}
              cycleId={cycleId}
              accountId={detail.accountId}
              session={session}
              locale={locale}
            />
            <h3>{t("Razón de investigación")}</h3>
            <p>
              {detail.rationale?.summary ?? t("Sin justificación registrada.")}
            </p>
            <h3>{t("Fuentes registradas")}</h3>
            <ul>
              {detail.sourceObservations.map((source) => (
                <li key={source.id}>
                  {/^https?:\/\//.test(source.canonical_uri) ? (
                    <a
                      href={source.canonical_uri}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {source.canonical_uri}
                    </a>
                  ) : (
                    source.canonical_uri
                  )}{" "}
                  · {when(source.observed_at)}
                </li>
              ))}
            </ul>
            {Object.entries(epistemic).map(([kind, title]) => (
              <section className="acq-evidence" key={kind}>
                <h3>{t(title)}</h3>
                {detail.assertions
                  .filter((a) => a.epistemic_status === kind)
                  .map((a) => (
                    <div key={a.id}>
                      <p>{a.statement}</p>
                      <small>
                        {t("Confianza:")} {humanize(a.confidence)}
                      </small>
                      {a.falsifier && (
                        <p>
                          {t("Falsificador:")} {a.falsifier}
                        </p>
                      )}
                    </div>
                  ))}
                {!detail.assertions.some(
                  (a) => a.epistemic_status === kind,
                ) && (
                  <p className="acq-muted">
                    {t("Sin registros en esta categoría.")}
                  </p>
                )}
              </section>
            ))}
            <details>
              <summary>{t("Actividad y política")}</summary>
              {selected && (
                <p>
                  {selected.result.policyId} / {selected.result.policyVersion}
                </p>
              )}
              {detail.materialEvents.map((e, i) => (
                <p key={i}>
                  {humanize(e.event_type)} · {when(e.occurred_at)}
                </p>
              ))}
            </details>
          </>
        )}
        {selected?.human && (
          <section>
            <h3>{t("Decisión Humana registrada")}</h3>
            <p>
              {humanize(selected.human.decision)} · {selected.human.reason}
            </p>
            <p>{selected.human.notes}</p>
            <p>{when(selected.human.decidedAt)}</p>
          </section>
        )}
        {selected?.reconsideration_required && (
          <p>
            {t(
              "El Engine requiere reconsideración explícita. La decisión anterior se conserva.",
            )}
          </p>
        )}
        {canDecide && !detailLoading && detail && selected && (
          <section className="acq-decision">
            <h3>{t("Decisión Humana")}</h3>
            {!selected.allowedDispositions.length && (
              <p>{t("No hay acciones permitidas en el estado actual.")}</p>
            )}
            <div className="acq-actions">
              {selected.allowedDispositions.map((d) => (
                <button
                  disabled={pending || hasCommand}
                  key={d}
                  onClick={() => {
                    setChoice(d)
                    setReason("")
                    setNotes("")
                  }}
                >
                  {humanize(d)}
                </button>
              ))}
            </div>
            {choice && (
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  void decide()
                }}
              >
                <h4>
                  {t("Confirmar")} {humanize(choice)}
                </h4>
                <p>
                  {choice === "CONTINUE"
                    ? t(
                        "Registra la decisión para la etapa posterior. No ejecuta investigación de personas ni mensajes.",
                      )
                    : choice === "HOLD"
                      ? t(
                          "Retira el ítem de atención hasta una reconsideración gobernada.",
                        )
                      : t(
                          "Resuelve el ítem para este ciclo. No volverá por refill automático.",
                        )}
                </p>
                <label>
                  {t("Motivo (obligatorio)")}
                  <textarea
                    required
                    maxLength={1000}
                    disabled={pending || hasCommand}
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                  />
                </label>
                <label>
                  {t("Notas opcionales")}
                  <textarea
                    maxLength={2000}
                    disabled={pending || hasCommand}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                  />
                </label>
                <button type="submit" disabled={pending || !reason.trim()}>
                  {pending
                    ? t("Confirmando…")
                    : hasCommand
                      ? t("Reintentar la misma decisión")
                      : `${t("Confirmar")} ${humanize(choice)}`}
                </button>
              </form>
            )}
          </section>
        )}
      </dialog>
    </main>
  )
}
