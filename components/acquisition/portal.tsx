"use client"

import { useCallback, useEffect, useRef, useState } from "react"
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

const labels: Record<string, string> = {
  REVIEW_ACCOUNT_PRIORITY: "Revisar la prioridad de la cuenta",
  WAIT_FOR_SUPPORTED_READINESS: "Esperar evidencia vigente y sustentada",
  UNKNOWNS_REMAIN_EXPLICIT: "Persisten incógnitas explícitas",
  EXPLICIT_MATERIAL_UNKNOWN:
    "Existe una incógnita material que bloquea el avance",
  UNRESOLVED_CONFLICT_OR_STALE:
    "La evidencia está desactualizada o en conflicto",
  BELOW_ATTENTION_EVIDENCE_STANDARD:
    "La evidencia no alcanza el estándar de Attention",
  SUPPORTED_BUT_MODERATE_CONFIDENCE:
    "Premisa sustentada con confianza moderada",
  HYPOTHESIS_NOT_CURRENTLY_SUPPORTED: "La hipótesis no tiene soporte vigente",
}
const humanize = (text: string) => labels[text] ?? text.replaceAll("_", " ")
const when = (date: string | null) =>
  date ? new Date(date).toLocaleString("es-MX") : "Sin actividad"
const epistemic: Record<string, string> = {
  OBSERVED_FACT: "Lo que sabemos · Hechos observados",
  SUPPORTED_INFERENCE: "Lo que respalda la evidencia · Inferencias",
  WORKING_HYPOTHESIS: "Hipótesis de trabajo",
  UNKNOWN: "Lo que no sabemos",
  CONFLICT_OR_STALE: "Evidencia stale / en conflicto",
}
function Lines({
  values,
  empty = "Sin factores adicionales registrados.",
}: {
  values: string[]
  empty?: string
}) {
  return values.length ? (
    <ul>
      {values.map((v, i) => (
        <li key={i}>{humanize(v)}</li>
      ))}
    </ul>
  ) : (
    <p className="acq-muted">{empty}</p>
  )
}
function Meaning({ item }: { item: Attention }) {
  const r = item.result
  return (
    <>
      <div className="acq-badges">
        <span>Prioridad {r.tier}</span>
        <span>Evidencia {r.evidenceConfidence}</span>
        <span>{humanize(item.status)}</span>
        {item.stale && <span>Revisión desactualizada</span>}
      </div>
      <h3>Por qué ahora · soporte observado</h3>
      <Lines
        values={r.whyNow.map(
          (w) => `${w.observedContext} · ${when(w.validAsOf)}`,
        )}
        empty="No hay un fundamento vigente registrado."
      />
      <p className="acq-muted">Recomendación: {humanize(r.recommendation)}</p>
      <h3>Qué limita la confianza</h3>
      <Lines values={[...r.hardStops, ...r.limitingFactors]} />
      <h3>Qué falta saber</h3>
      <Lines values={r.knownUnknowns} />
      <h3>Unknowns materiales</h3>
      <Lines
        values={r.materialUnknowns}
        empty="Ningún bloqueo material explícito registrado."
      />
    </>
  )
}
export function AcquisitionPortal({ session }: { session: PortalSession }) {
  const [cycles, setCycles] = useState<Cycle[]>([]),
    [cycleId, setCycleId] = useState("")
  const [tab, setTab] = useState("Attention"),
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
      if (run === generation.current) setLoading(false)
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
        `Decisión confirmada: ${choice}. ${receipt.refill.activated.length ? "La siguiente cuenta elegible fue promovida según la política vigente." : "Sin nuevas promociones. La capacidad es un máximo, no una cuota."}`,
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
    <main id="main-content" className="acq" lang="es">
      <header className="acq-heading">
        <div>
          <p className="acq-kicker">Portal / Acquisition</p>
          <h1>Atención con fundamento.</h1>
          <p>Brunova Acquisition Engine · Observa, revisa y decide.</p>
        </div>
        <div className="acq-actions">
          <button onClick={() => void refresh()} disabled={loading || pending}>
            Actualizar
          </button>
          <button
            onClick={async () => {
              try {
                await api.logout(session.csrfToken)
                window.location.assign("/portal")
              } catch {
                setError(new AcquisitionError(503))
              }
            }}
          >
            Cerrar sesión
          </button>
        </div>
      </header>
      {error && (
        <div role="alert" className="acq-alert">
          {error.message}
          {error.status === 401 && (
            <button
              onClick={() =>
                window.location.assign("/api/acquisition/v1/auth/login")
              }
            >
              Iniciar sesión
            </button>
          )}
        </div>
      )}
      {notice && (
        <p role="status" className="acq-notice">
          {notice}
        </p>
      )}
      {loading && <p role="status">Actualizando estado del Engine…</p>}
      <div className="acq-cycle">
        <label>
          Ciclo{" "}
          <select
            value={cycleId}
            disabled={!cycles.length || pending}
            onChange={(e) => {
              setCycleId(e.target.value)
              setCursor("")
              setWorkCursor("")
            }}
          >
            {!cycles.length && <option value="">Sin ciclo</option>}
            {cycles.map((c) => (
              <option key={c.cycleId} value={c.cycleId}>
                {c.cycleId} · {c.status}
              </option>
            ))}
          </select>
        </label>
        {cycle && (
          <p>
            {cycle.status} · {cycle.policy.id} / {cycle.policy.version}
          </p>
        )}
      </div>
      <section className="acq-metrics" aria-label="Resumen">
        <div>
          <span>Qualified</span>
          <strong>{cycle?.outcomeCounts.qualified ?? "—"}</strong>
        </div>
        <div>
          <span>Priorizadas</span>
          <strong>{counts?.counts?.prioritized_count ?? "—"}</strong>
        </div>
        <div>
          <span>Atención activa</span>
          <strong>{counts?.counts?.active_count ?? "—"}</strong>
        </div>
        <div>
          <span>Overflow</span>
          <strong>{counts?.counts?.overflow_count ?? "—"}</strong>
        </div>
        <div>
          <span>Trabajo pendiente · global</span>
          <strong>{health?.pendingWorkCount ?? "—"}</strong>
        </div>
        <div>
          <span>Base de datos</span>
          <strong>
            {health
              ? health.databaseReady
                ? "Disponible"
                : "No disponible"
              : "—"}
          </strong>
        </div>
      </section>
      {health && (
        <p className="acq-safety">
          REAL ACQUISITION DATA:{" "}
          {health.realAcquisitionDataAllowed ? "ENABLED" : "DISABLED"}{" "}
          <span>
            EXTERNAL EFFECTS: {health.externalEffectsMode.toUpperCase()}
          </span>
          <small>
            Estado de seguridad intencional. No hay controles de activación.
          </small>
        </p>
      )}
      <nav className="acq-tabs" aria-label="Secciones de Acquisition">
        {["Attention", "Ciclo", "Accounts", "Work / Health"].map((name) => (
          <button
            key={name}
            aria-current={tab === name ? "page" : undefined}
            onClick={() => setTab(name)}
          >
            {name === "Attention" ? "Necesita tu atención" : name}
          </button>
        ))}
      </nav>
      {!loading && !cycles.length && !error && (
        <section className="acq-empty">
          <h2>Aún no hay un ciclo de Acquisition.</h2>
          <p>
            El Engine está preparado; no se ha iniciado investigación real. Aquí
            aparecerá el contexto de un ciclo autorizado.
          </p>
        </section>
      )}
      {tab === "Attention" && (
        <section>
          <div className="acq-section-heading">
            <h2>Necesita tu atención</h2>
            <p>
              {counts?.counts
                ? `Máximo ${counts.counts.capacity} activas · ${counts.counts.eligible_unresolved_count} elegibles pendientes`
                : "Sin capacidad configurada"}
            </p>
          </div>
          {!active.length && !loading && (
            <div className="acq-empty">
              <h3>No hay decisiones pendientes.</h3>
              <p>
                Solo aparecerán cuentas que cumplan el estándar vigente. Los
                espacios libres no son un error.
              </p>
            </div>
          )}
          <div className="acq-cards">
            {active.map((item) => (
              <article key={item.attention_id}>
                <h2>{item.displayName}</h2>
                <p className="acq-muted">{item.domain}</p>
                <Meaning item={item} />
                <button
                  disabled={pending}
                  onClick={() => void inspect(item.account_id, item)}
                >
                  Revisar evidencia y decisión
                </button>
              </article>
            ))}
          </div>
        </section>
      )}
      {tab === "Ciclo" && (
        <section className="acq-panel">
          <h2>Estado del ciclo</h2>
          {cycle ? (
            <>
              <h3>Investigación</h3>
              <dl>
                {Object.entries(cycle.outcomeCounts).map(([label, n]) => (
                  <div key={label}>
                    <dt>{humanize(label)}</dt>
                    <dd>{n}</dd>
                  </div>
                ))}
              </dl>
              <h3>Prioridad</h3>
              {counts?.configured ? (
                <>
                  <dl>
                    {Object.entries(counts.tiers).map(([label, n]) => (
                      <div key={label}>
                        <dt>{label.toUpperCase()}</dt>
                        <dd>{n}</dd>
                      </div>
                    ))}
                  </dl>
                  <p>
                    Pool candidato: {counts.counts?.candidate_count}. Overflow:{" "}
                    {counts.counts?.overflow_count}.
                  </p>
                </>
              ) : (
                <p>Aún no hay pool priorizado.</p>
              )}
            </>
          ) : (
            <p>No hay un ciclo configurado.</p>
          )}
        </section>
      )}
      {tab === "Accounts" && (
        <section>
          <h2>Accounts</h2>
          <label>
            Resultado de investigación{" "}
            <select
              value={outcome}
              onChange={(e) => {
                setOutcome(e.target.value)
                setCursor("")
              }}
            >
              <option value="">Todos</option>
              {["QUALIFIED", "HOLD", "REJECTED"].map((o) => (
                <option key={o}>{o}</option>
              ))}
            </select>
          </label>
          {!accounts.length && !loading && (
            <p className="acq-empty">
              No hay cuentas para este ciclo o filtro.
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
                    <p>{a.researchOutcome ?? a.stage}</p>
                    <p>
                      {att
                        ? `${att.result.tier} · ${att.status}${att.stale ? " · Desactualizado" : ""}`
                        : "Sin prioridad / Attention"}
                    </p>
                    <small>{when(a.latestMaterialActivityAt)}</small>
                  </div>
                  <button
                    onClick={() => void inspect(a.accountId, att ?? null)}
                  >
                    Inspeccionar cuenta
                  </button>
                </article>
              )
            })}
          </div>
          <div className="acq-actions">
            <button disabled={!cursor} onClick={() => setCursor("")}>
              Primera página
            </button>
            <button disabled={!next} onClick={() => setCursor(next ?? "")}>
              Siguiente página
            </button>
          </div>
          <p className="acq-muted">
            Solicitar investigación no está habilitado en esta superficie de
            preactivación.
          </p>
        </section>
      )}
      {tab === "Work / Health" && (
        <section className="acq-panel">
          <h2>Work / Health</h2>
          <label>
            Estado del trabajo
            <select
              value={workState}
              onChange={(e) => {
                setWorkState(e.target.value)
                setWorkCursor("")
              }}
            >
              <option value="">Todos</option>
              {[
                "QUEUED",
                "WORKING",
                "COMPLETED",
                "BLOCKED",
                "FAILED",
                "CANCELLED",
              ].map((state) => (
                <option key={state}>{state}</option>
              ))}
            </select>
          </label>
          <p>Observabilidad; las colas no se editan desde el Portal.</p>
          {health && (
            <p>
              Trabajo pendiente más antiguo: {when(health.oldestPendingAt)}.
            </p>
          )}
          {!work.length && !loading && (
            <p className="acq-empty">
              No hay trabajo registrado. El Engine no tiene tareas para este
              ciclo.
            </p>
          )}
          {work.map((w) => (
            <article className="acq-work" key={w.workItemId}>
              <h3>{humanize(w.workType)}</h3>
              <p>
                {w.state} · Intentos {w.attemptCount}/{w.maxAttempts} ·
                Disponible {when(w.availableAt)}
              </p>
              <details>
                <summary>Detalles técnicos</summary>
                <p>{w.workItemId}</p>
                <p>Correlación: {w.correlationId ?? "No registrada"}</p>
              </details>
            </article>
          ))}
          <button disabled={!workCursor} onClick={() => setWorkCursor("")}>
            Primera página de trabajo
          </button>
          <button
            disabled={!workNext}
            onClick={() => setWorkCursor(workNext ?? "")}
          >
            Más trabajo
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
            Cerrar detalle
          </button>
        </div>
        <h2 id="acq-detail-title">
          {detail?.canonicalIdentity.displayName ??
            selected?.displayName ??
            "Detalle de cuenta"}
        </h2>
        {detailLoading && <p role="status">Cargando evidencia…</p>}
        {error && <p role="alert">{error.message}</p>}
        {selected && <Meaning item={selected} />}
        {detail && (
          <>
            <h3>Razón de investigación</h3>
            <p>{detail.rationale?.summary ?? "Sin rationale registrado."}</p>
            <h3>Fuentes registradas</h3>
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
                <h3>{title}</h3>
                {detail.assertions
                  .filter((a) => a.epistemic_status === kind)
                  .map((a) => (
                    <div key={a.id}>
                      <p>{a.statement}</p>
                      <small>Confianza: {a.confidence}</small>
                      {a.falsifier && <p>Falsificador: {a.falsifier}</p>}
                    </div>
                  ))}
                {!detail.assertions.some(
                  (a) => a.epistemic_status === kind,
                ) && (
                  <p className="acq-muted">Sin registros en esta categoría.</p>
                )}
              </section>
            ))}
            <details>
              <summary>Actividad y política</summary>
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
            <h3>Decisión Human registrada</h3>
            <p>
              {selected.human.decision} · {selected.human.reason}
            </p>
            <p>{selected.human.notes}</p>
            <p>{when(selected.human.decidedAt)}</p>
          </section>
        )}
        {selected?.reconsideration_required && (
          <p>
            El Engine requiere reconsideración explícita. La decisión anterior
            se conserva.
          </p>
        )}
        {canDecide && !detailLoading && detail && selected && (
          <section className="acq-decision">
            <h3>Decisión Human</h3>
            {!selected.allowedDispositions.length && (
              <p>No hay acciones permitidas en el estado actual.</p>
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
                  {d}
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
                <h4>Confirmar {choice}</h4>
                <p>
                  {choice === "CONTINUE"
                    ? "Registra la decisión para la etapa posterior. No ejecuta investigación de personas ni mensajes."
                    : choice === "HOLD"
                      ? "Retira el ítem de Attention hasta una reconsideración gobernada."
                      : "Resuelve el ítem para este ciclo. No volverá por refill automático."}
                </p>
                <label>
                  Motivo (obligatorio)
                  <textarea
                    required
                    maxLength={1000}
                    disabled={pending || hasCommand}
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                  />
                </label>
                <label>
                  Notas opcionales
                  <textarea
                    maxLength={2000}
                    disabled={pending || hasCommand}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                  />
                </label>
                <button type="submit" disabled={pending || !reason.trim()}>
                  {pending
                    ? "Confirmando…"
                    : hasCommand
                      ? "Reintentar la misma decisión"
                      : `Confirmar ${choice}`}
                </button>
              </form>
            )}
          </section>
        )}
      </dialog>
    </main>
  )
}
