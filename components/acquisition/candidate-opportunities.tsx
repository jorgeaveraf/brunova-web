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
function localizedReason(candidate: CandidateView, es: boolean) {
  if (candidate.contacted)
    return es
      ? "Existe un contacto activo y su estado debe conservarse mientras se espera una respuesta."
      : "An active contact exists and its state must be preserved while a reply is pending."
  if (candidate.screen === "SUPPORTED_DISMISSAL")
    return es
      ? "La evidencia vigente respalda cerrar su consideración activa sin borrar el historial."
      : "Current evidence supports closing active consideration without deleting history."
  if (candidate.identity === "RESOLVED")
    return es
      ? "La identidad está respaldada, pero la oportunidad de intervención todavía necesita evidencia suficiente."
      : "Identity is supported, while the intervention opportunity still needs sufficient evidence."
  if (candidate.target)
    return es
      ? "Fue seleccionada previamente para aprendizaje acotado; aún no existe autoridad de contacto."
      : "It was previously selected for bounded learning; no outreach authority exists yet."
  return es
    ? "Una señal inicial justificó conservarla para investigación, no para contacto."
    : "An initial signal justified retaining it for research, not for outreach."
}

function localizedUnknown(candidate: CandidateView, es: boolean) {
  if (candidate.identity === "AMBIGUOUS")
    return es
      ? "Qué organización exacta corresponde al registro."
      : "Which exact organization the record represents."
  if (candidate.identity !== "RESOLVED")
    return es
      ? "La identidad exacta y si existe una intervención concreta justificable."
      : "The exact identity and whether a concrete, justified intervention exists."
  return es
    ? "Si existe un problema no resuelto, quién es responsable y si Brunova puede intervenir."
    : "Whether an unresolved problem exists, who owns it, and whether Brunova can intervene."
}

function localizedNext(candidate: CandidateView, es: boolean) {
  if (candidate.archived)
    return es
      ? "Sin acción activa; Management puede restaurarla con un motivo cuando corresponda."
      : "No active action; Management may restore it with a reason when appropriate."
  if (candidate.contacted)
    return es
      ? "Esperar una respuesta. Cualquier seguimiento requiere autoridad nueva y exacta."
      : "Wait for a reply. Any follow-up requires new, exact authority."
  if (candidate.identity === "AMBIGUOUS")
    return es
      ? "Management debe revisar la ambigüedad antes de cualquier progresión."
      : "Management must review the ambiguity before any progression."
  if (candidate.screen === "SUPPORTED_DISMISSAL")
    return es
      ? "Mantener cerrada; nueva evidencia material puede justificar reconsideración."
      : "Keep closed; materially new evidence may justify reconsideration."
  return es
    ? "Continuar sólo con investigación vigente y autorizada que pueda cambiar una decisión."
    : "Continue only with current, authorized research capable of changing a decision."
}

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
  const originalSignal =
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
        {localizedReason(candidate, es)}
      </p>
      <p className="acq-muted">
        <strong>{es ? "Aún no probado" : "Still unproven"}:</strong>{" "}
        {localizedUnknown(candidate, es)}
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
      <p className="acq-record-next">
        <span>{es ? "Siguiente paso legítimo" : "Next legitimate step"}</span>
        {localizedNext(candidate, es)}
      </p>
      {(candidate.nextAction || originalSignal || candidate.unknown) && (
        <details>
          <summary>
            {es
              ? "Texto original del Engine y evidencia"
              : "Original Engine text and evidence"}
          </summary>
          {originalSignal && (
            <p>
              <strong>{es ? "Motivo original" : "Original reason"}:</strong>{" "}
              {originalSignal}
            </p>
          )}
          {candidate.unknown && (
            <p>
              <strong>
                {es ? "Incertidumbre original" : "Original unknown"}:
              </strong>{" "}
              {candidate.unknown}
            </p>
          )}
          {candidate.nextAction && (
            <p>
              <strong>
                {es ? "Siguiente paso original" : "Original next step"}:
              </strong>{" "}
              {candidate.nextAction}
            </p>
          )}
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
