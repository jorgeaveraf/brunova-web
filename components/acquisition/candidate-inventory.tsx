import type { Locale } from "@/lib/i18n"
import {
  candidateManagementTruth,
  marketContextCounts,
  type DiscoveryTruth,
} from "@/lib/acquisition-management-truth"

const excerpt = (value: string, limit: number) =>
  value.length <= limit
    ? value
    : `${value.slice(0, limit).replace(/\s+\S*$/, "")}…`

export function CandidateInventory({
  data,
  locale,
  compact = false,
}: {
  data: DiscoveryTruth
  locale: Locale
  compact?: boolean
}) {
  const es = locale === "es",
    candidates = candidateManagementTruth(data),
    markets = marketContextCounts(data)
  const status = (candidate: (typeof candidates)[number]) =>
    candidate.contacted && candidate.contactState === "AWAITING_RESPONSE"
      ? es
        ? "Conservada · Contactada · Esperando respuesta"
        : "Retained · Contacted · Waiting for reply"
      : candidate.screen === "SUPPORTED_DISMISSAL"
        ? es
          ? "Descartada con evidencia · Reconsiderable"
          : "Evidence-supported dismissal · Reconsiderable"
        : candidate.worthiness?.startsWith("WEAK")
          ? es
            ? "Débil por ahora · Conservada"
            : "Weak for now · Retained"
          : candidate.screen === "HOLD"
            ? es
              ? "Conservada · Investigación pendiente"
              : "Retained · Research pending"
            : es
              ? "En investigación"
              : "Under investigation"
  return (
    <section
      aria-label={es ? "Inventario de candidatas" : "Candidate inventory"}
    >
      <h3>
        {es ? "Organizaciones en evaluación" : "Organizations under evaluation"}
      </h3>
      <p>
        {data.totals.candidates}{" "}
        {es ? "candidatas conservadas" : "retained candidates"} ·{" "}
        {data.totals.admitted} Accounts · {data.totals.observations}{" "}
        {es ? "observaciones" : "observations"}
      </p>
      <p>
        {es ? "Contexto de búsqueda" : "Search context"}: México {markets.MX} ·
        Estados Unidos {markets.US} ·{" "}
        {es ? "mixto o incierto" : "mixed or uncertain"} {markets.ambiguous}.{" "}
        {es
          ? "El mercado de búsqueda no confirma domicilio."
          : "Search context does not establish domicile."}
      </p>
      <p>
        {es ? "Identidad respaldada" : "Supported identity"}:{" "}
        {data.totals.resolved} · {es ? "Por resolver" : "Unresolved"}:{" "}
        {data.totals.unresolved}.{" "}
        {es
          ? "Una candidata todavía no es un Account calificado."
          : "A candidate is not yet a qualified Account."}
      </p>
      <div className="acq-cards">
        {candidates.map((candidate) => (
          <article key={candidate.id} className="acq-panel">
            <h4>{candidate.name}</h4>
            <p>
              <strong>{status(candidate)}</strong>
            </p>
            <p>
              {es ? "Mercado de búsqueda" : "Search market"}:{" "}
              {candidate.searchMarkets.join(" / ") ||
                (es ? "sin confirmar" : "unconfirmed")}{" "}
              ·{" "}
              {candidate.identity === "RESOLVED"
                ? es
                  ? "Identidad respaldada"
                  : "Identity supported"
                : es
                  ? "Identidad pendiente"
                  : "Identity pending"}
            </p>
            <p>
              {es ? "Evidencia por dimensión" : "Evidence by dimension"}:{" "}
              {(["COMPANY", "JOB", "SOCIAL"] as const)
                .map(
                  (d) =>
                    `${d === "COMPANY" ? (es ? "Empresa" : "Company") : d === "JOB" ? (es ? "Vacantes" : "Jobs") : es ? "Social" : "Social"}: ${candidate.coverage.includes(d) ? (es ? "observada" : "observed") : es ? "sin trabajo confirmado" : "no confirmed work"}`,
                )
                .join(" · ")}
            </p>
            {!compact && candidate.target?.why && (
              <p>
                <strong>
                  {es ? "Por qué se consideró" : "Why considered"}:
                </strong>{" "}
                {excerpt(candidate.target.why, 220)}
              </p>
            )}
            {!compact &&
              !candidate.target?.why &&
              candidate.sourceHypothesis && (
                <p>
                  <strong>
                    {es
                      ? "Señal investigada, no confirmada"
                      : "Signal investigated, not confirmed"}
                    :
                  </strong>{" "}
                  {excerpt(candidate.sourceHypothesis, 160)}
                </p>
              )}
            {candidate.known && (
              <p>
                <strong>{es ? "Qué sabemos" : "What we know"}:</strong>{" "}
                {excerpt(candidate.known, compact ? 180 : 240)}
              </p>
            )}
            {!compact && candidate.lastWorkQuality && (
              <p>
                <strong>
                  {es
                    ? "Calidad de la última investigación"
                    : "Latest research quality"}
                  :
                </strong>{" "}
                {candidate.lastWorkQuality === "JUSTIFIED"
                  ? es
                    ? "Justificada"
                    : "Justified"
                  : candidate.lastWorkQuality === "QUESTIONABLE"
                    ? es
                      ? "Cuestionable"
                      : "Questionable"
                    : candidate.lastWorkQuality === "WASTED"
                      ? es
                        ? "Sin valor proporcional"
                        : "Not proportionate"
                      : es
                        ? "Bloqueada"
                        : "Blocked"}
              </p>
            )}
            {!compact && (
              <>
                <p>
                  <strong>{es ? "Qué falta" : "What remains unknown"}:</strong>{" "}
                  {excerpt(candidate.unknown, 180) ||
                    (candidate.missingCodes.length
                      ? es
                        ? "Falta corroborar identidad, intervención o responsable del problema."
                        : "Identity, intervention or problem ownership still needs corroboration."
                      : es
                        ? "Sin incógnita explícita registrada."
                        : "No explicit unresolved question recorded.")}
                </p>
                <p>
                  <strong>
                    {es
                      ? "Siguiente acción legítima"
                      : "Next legitimate action"}
                    :
                  </strong>{" "}
                  {excerpt(candidate.nextAction, 200) ||
                    (es
                      ? "Revisar evidencia antes de progresar"
                      : "Review evidence before progression")}
                </p>
                {candidate.contacted && (
                  <p>
                    {es
                      ? "Próxima revisión elegible"
                      : "Next review eligibility"}
                    :{" "}
                    {candidate.nextReviewAt
                      ? new Intl.DateTimeFormat(es ? "es-MX" : "en-US", {
                          dateStyle: "medium",
                          timeStyle: "short",
                          timeZone: "America/Mexico_City",
                        }).format(new Date(candidate.nextReviewAt))
                      : "—"}{" "}
                    · Follow-up: {candidate.followUpAuthority ?? "NONE"}
                  </p>
                )}
                <details>
                  <summary>
                    {es
                      ? "Evidencia, procedencia y recorrido"
                      : "Evidence, provenance and journey"}
                  </summary>
                  {candidate.discoveryReason && (
                    <p>
                      <strong>
                        {es
                          ? "Motivo original de búsqueda"
                          : "Original search rationale"}
                        :
                      </strong>{" "}
                      {candidate.discoveryReason}
                    </p>
                  )}
                  {candidate.sourceHypothesis && (
                    <p>
                      <strong>
                        {es
                          ? "Hipótesis de fuente, aún no demostrada"
                          : "Source hypothesis, not yet proved"}
                        :
                      </strong>{" "}
                      {candidate.sourceHypothesis}
                    </p>
                  )}
                  {candidate.known.length > 240 && (
                    <p>
                      <strong>
                        {es ? "Investigación completa" : "Full research"}:
                      </strong>{" "}
                      {candidate.known}
                    </p>
                  )}
                  {candidate.unknown.length > 180 && (
                    <p>
                      <strong>
                        {es ? "Incógnitas completas" : "Full unknowns"}:
                      </strong>{" "}
                      {candidate.unknown}
                    </p>
                  )}
                  {candidate.nextAction.length > 200 && (
                    <p>
                      <strong>
                        {es ? "Siguiente acción completa" : "Full next action"}:
                      </strong>{" "}
                      {candidate.nextAction}
                    </p>
                  )}
                  <p>
                    {es ? "Fuentes" : "Sources"}:{" "}
                    {candidate.sources.join(", ") || "—"} ·{" "}
                    {es ? "Avistamientos" : "Sightings"}: {candidate.sightings}
                  </p>
                  <p>
                    {es ? "Última acción registrada" : "Last recorded action"}:{" "}
                    {candidate.lastAction ?? "—"}
                  </p>
                  <p>{candidate.missingCodes.join(" · ")}</p>
                </details>
              </>
            )}
          </article>
        ))}
      </div>
      {data.totals.candidates > candidates.length && (
        <p>
          {es
            ? "Se muestran las candidatas más recientes; el total incluye toda la memoria."
            : "Showing recent candidates; the total covers all memory."}
        </p>
      )}
    </section>
  )
}
