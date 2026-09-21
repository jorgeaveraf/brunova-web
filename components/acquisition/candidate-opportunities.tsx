import type { Locale } from "@/lib/i18n"
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
}: {
  candidate: CandidateView
  locale: Locale
  record?: string
}) {
  const es = locale === "es"
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
          {candidate.contacted
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
    </article>
  )
}

export function CandidateOpportunities({
  data,
  locale,
}: {
  data: DiscoveryTruth
  locale: Locale
}) {
  const es = locale === "es"
  const groups = candidateNameGroups(candidateManagementTruth(data))
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
        <strong>{data.totals.candidates}</strong>
      </div>
      <div className="acq-opportunity-list">
        {groups.map((group) =>
          group.length === 1 ? (
            <Opportunity
              key={group[0].id}
              candidate={group[0]}
              locale={locale}
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
