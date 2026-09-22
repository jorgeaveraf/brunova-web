"use client"

import { useMemo, useState } from "react"
import type { Locale } from "@/lib/i18n"
import {
  acquisitionApi as api,
  type PortalSession,
} from "@/lib/acquisition-api"
import {
  candidateManagementTruth,
  candidateNameGroups,
  type DiscoveryTruth,
} from "@/lib/acquisition-management-truth"

type CandidateView = ReturnType<typeof candidateManagementTruth>[number]
const quality = (value: string, es: boolean) =>
  ({
    JUSTIFIED: es ? "justificada" : "justified",
    QUESTIONABLE: es ? "cuestionable" : "questionable",
    WASTED: es ? "sin valor proporcional" : "not proportionate",
    BLOCKED: es ? "bloqueada" : "blocked",
  })[value] ?? value.toLocaleLowerCase()
const short = (value: string, limit = 140) =>
  value.length <= limit
    ? value
    : `${value.slice(0, limit).replace(/\s+\S*$/, "")}…`

function Opportunity({
  candidate,
  locale,
  record,
  session,
  onChanged,
}: {
  candidate: CandidateView
  locale: Locale
  record?: string
  session?: PortalSession
  onChanged?: () => void
}) {
  const es = locale === "es"
  const [reason, setReason] = useState("")
  const [pending, setPending] = useState(false)
  const [error, setError] = useState(false)
  const signal =
    candidate.target?.why ||
    (candidate.lastWorkQuality === "JUSTIFIED" ? candidate.known : "") ||
    candidate.sourceHypothesis ||
    candidate.discoveryReason ||
    candidate.known
  return (
    <article className="acq-opportunity-row">
      <div className="acq-record-head">
        <div>
          {record && <span className="acq-eyebrow">{record}</span>}
          <h3>{candidate.name}</h3>
        </div>
        <span className="acq-state">
          {candidate.archived
            ? es
              ? "Archivada"
              : "Archived"
            : candidate.contacted
              ? es
                ? "Contactada · En espera"
                : "Contacted · Waiting"
              : candidate.screen === "SUPPORTED_DISMISSAL"
                ? es
                  ? "Descarte respaldado"
                  : "Supported dismissal"
                : es
                  ? "Conservada"
                  : "Retained"}
        </span>
      </div>
      <p>
        <strong>
          {es
            ? "Por qué sigue en consideración"
            : "Why it remains in consideration"}
        </strong>
        <br />
        {short(
          signal ||
            (es
              ? "Señal inicial pendiente de corroboración."
              : "Initial signal awaiting corroboration."),
        )}
      </p>
      <p className="acq-muted">
        <strong>{es ? "Aún no probado" : "Still unproven"}:</strong>{" "}
        {short(
          candidate.unknown ||
            (es
              ? "Identidad, intervención o responsable."
              : "Identity, intervention or problem owner."),
        )}
      </p>
      <p className="acq-opportunity-foot">
        {candidate.searchMarkets.length
          ? candidate.searchMarkets.join(" / ")
          : es
            ? "Contexto de búsqueda sin confirmar"
            : "Search context unconfirmed"}{" "}
        ·{" "}
        {candidate.identity === "RESOLVED"
          ? es
            ? "Identidad respaldada"
            : "Identity supported"
          : es
            ? "Identidad pendiente"
            : "Identity unresolved"}{" "}
        ·{" "}
        {candidate.lastWorkQuality
          ? `${es ? "Investigación" : "Research"}: ${quality(candidate.lastWorkQuality, es)}`
          : es
            ? "Investigación pendiente"
            : "Research pending"}{" "}
        ·{" "}
        {candidate.contacted
          ? es
            ? "seguimiento sin autorización"
            : "follow-up not authorized"
          : es
            ? "sin acción comercial autorizada"
            : "no authorized commercial action"}
      </p>
      <p className="acq-record-next">
        <span>{es ? "Management" : "Management"}</span>
        {candidate.identity === "AMBIGUOUS"
          ? es
            ? "Debe resolver la ambigüedad de identidad."
            : "Must resolve the identity ambiguity."
          : candidate.archived
            ? es
              ? "Ninguna decisión pendiente; puede restaurarse con motivo."
              : "No pending decision; it can be restored with a reason."
            : candidate.contacted
              ? es
                ? "Ninguna acción mientras espera; cualquier seguimiento requiere autoridad nueva."
                : "No action while waiting; any follow-up requires new authority."
              : es
                ? "No requiere decisión ahora; el Engine sólo puede continuar trabajo ya autorizado."
                : "No decision required now; the Engine may only continue already-authorized work."}
      </p>
      <p className="acq-record-next">
        <span>{es ? "Etapa" : "Stage"}</span>
        {candidate.archived
          ? es
            ? "Fuera del espacio activo; historia conservada"
            : "Outside active workspace; history preserved"
          : candidate.contacted
            ? es
              ? "Contactada · esperando"
              : "Contacted · waiting"
            : candidate.identity === "AMBIGUOUS"
              ? es
                ? "Requiere revisión de identidad"
                : "Identity review required"
              : candidate.screen === "SUPPORTED_DISMISSAL"
                ? es
                  ? "Cerrada con soporte"
                  : "Closed with support"
                : candidate.lastAction
                  ? es
                    ? "Investigando"
                    : "Researching"
                  : es
                    ? "Descubierta"
                    : "Discovered"}
      </p>
      {candidate.nextAction && (
        <p className="acq-record-next">
          <span>{es ? "Siguiente paso legítimo" : "Next legitimate step"}</span>
          {short(candidate.nextAction)}
        </p>
      )}
      {candidate.nextAction && (
        <details>
          <summary>
            {es ? "Siguiente paso y evidencia" : "Next step and evidence"}
          </summary>
          <p>{candidate.nextAction}</p>
          {candidate.known && (
            <p>
              <strong>{es ? "Observado" : "Observed"}:</strong>{" "}
              {candidate.known}
            </p>
          )}
        </details>
      )}
      {session?.actor.capabilities.includes("MANAGE_CYCLE") && onChanged && (
        <details>
          <summary>
            {candidate.archived
              ? es
                ? "Restaurar"
                : "Restore"
              : es
                ? "Quitar de la vista activa"
                : "Remove from active view"}
          </summary>
          <p className="acq-muted">
            {candidate.archived
              ? es
                ? "La restauración devuelve la organización al espacio activo sin borrar el historial."
                : "Restoring returns the organization to the active workspace without deleting history."
              : es
                ? "Archivar no rechaza, elimina ni fusiona la organización. Conserva toda la evidencia."
                : "Archiving does not reject, delete, or merge the organization. All evidence remains."}
          </p>
          <label>
            {es ? "Motivo" : "Reason"}
            <textarea
              value={reason}
              onChange={(event) => setReason(event.target.value)}
              maxLength={1000}
            />
          </label>
          <button
            disabled={pending || reason.trim().length < 10}
            onClick={async () => {
              setPending(true)
              setError(false)
              try {
                await api.candidateWorkspace(
                  crypto.randomUUID(),
                  candidate.id,
                  candidate.archived
                    ? "RESTORE_CANDIDATE"
                    : "ARCHIVE_CANDIDATE",
                  reason.trim(),
                  session.csrfToken,
                )
                onChanged()
              } catch {
                setError(true)
                setPending(false)
              }
            }}
          >
            {pending
              ? es
                ? "Guardando…"
                : "Saving…"
              : candidate.archived
                ? es
                  ? "Restaurar organización"
                  : "Restore organization"
                : es
                  ? "Archivar organización"
                  : "Archive organization"}
          </button>
          {error && (
            <p role="alert">
              {es
                ? "No se pudo cambiar la vista activa."
                : "The active-view state could not be changed."}
            </p>
          )}
        </details>
      )}
    </article>
  )
}

export function CandidateOpportunities({
  data,
  locale,
  session,
  onChanged,
}: {
  data: DiscoveryTruth
  locale: Locale
  session?: PortalSession
  onChanged?: () => void
}) {
  const es = locale === "es"
  const [showArchived, setShowArchived] = useState(false)
  const candidates = useMemo(() => candidateManagementTruth(data), [data])
  const visible = candidates.filter((candidate) =>
    showArchived ? candidate.archived : !candidate.archived,
  )
  const groups = candidateNameGroups(visible)
  const archivedCount = candidates.filter(
    (candidate) => candidate.archived,
  ).length
  return (
    <section aria-label={es ? "Pool de oportunidades" : "Opportunity pool"}>
      <div className="acq-section-heading">
        <div>
          <h3>
            {es
              ? "Organizaciones conservadas para consideración"
              : "Organizations retained for consideration"}
          </h3>
          <p className="acq-muted">
            {es
              ? "Antes de admitir un Account, una Candidate puede seguir siendo valiosa sin estar lista para contacto."
              : "Before Account admission, a Candidate can remain valuable without being ready for contact."}
          </p>
        </div>
        <strong>{visible.length}</strong>
      </div>
      <button onClick={() => setShowArchived((value) => !value)}>
        {showArchived
          ? es
            ? "Ver espacio activo"
            : "View active workspace"
          : `${es ? "Ver archivadas" : "View archived"} (${archivedCount})`}
      </button>
      {data.archivePolicy && (
        <details>
          <summary>{es ? "Política de archivo" : "Archive policy"}</summary>
          <p>
            {data.archivePolicy.enabled
              ? es
                ? `Política v${data.archivePolicy.version} habilitada. Sólo ${data.archiveEligibility?.length ?? 0} organizaciones terminales cumplen hoy sus reglas; esperar o estar en HOLD no basta.`
                : `Policy v${data.archivePolicy.version} is enabled. Only ${data.archiveEligibility?.length ?? 0} terminal organizations currently meet its rules; waiting or HOLD is insufficient.`
              : es
                ? `Política v${data.archivePolicy.version} deshabilitada. No se archivará automáticamente ninguna organización.`
                : `Policy v${data.archivePolicy.version} is disabled. No organization will be archived automatically.`}
          </p>
        </details>
      )}
      {!groups.length && (
        <p className="acq-empty">
          {showArchived
            ? es
              ? "No hay organizaciones archivadas."
              : "No archived organizations."
            : es
              ? "No hay organizaciones en el espacio activo."
              : "No organizations in the active workspace."}
        </p>
      )}
      <div className="acq-opportunity-list">
        {groups.map((group) =>
          group.length === 1 ? (
            <Opportunity
              key={group[0].id}
              candidate={group[0]}
              locale={locale}
              session={session}
              onChanged={onChanged}
            />
          ) : (
            <section className="acq-same-name" key={group[0].id}>
              <h3>
                {group[0].name} — {group.length}{" "}
                {es ? "registros sin resolver" : "unresolved records"}
              </h3>
              <p className="acq-muted">
                {es
                  ? "Mismo nombre; identidades no fusionadas."
                  : "Same name; identities are not merged."}
              </p>
              {group.map((candidate, index) => (
                <Opportunity
                  key={candidate.id}
                  candidate={candidate}
                  locale={locale}
                  session={session}
                  onChanged={onChanged}
                  record={`${es ? "Registro" : "Record"} ${String.fromCharCode(65 + index)}`}
                />
              ))}
            </section>
          ),
        )}
      </div>
    </section>
  )
}
