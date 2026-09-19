import type { Locale } from "@/lib/i18n"
import {
  candidateManagementTruth,
  marketContextCounts,
  type DiscoveryTruth,
} from "@/lib/acquisition-management-truth"

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
            {!compact && candidate.discoveryReason && (
              <p>
                <strong>{es ? "Por qué apareció" : "Why it appeared"}:</strong>{" "}
                {candidate.discoveryReason}
              </p>
            )}
            {!compact && candidate.target?.why && (
              <p>
                <strong>
                  {es ? "Por qué se consideró" : "Why considered"}:
                </strong>{" "}
                {candidate.target.why}
              </p>
            )}
            {candidate.known && (
              <p>
                <strong>{es ? "Qué sabemos" : "What we know"}:</strong>{" "}
                {compact ? candidate.known.slice(0, 240) : candidate.known}
              </p>
            )}
            {!compact && candidate.sourceHypothesis && (
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
            {!compact && (
              <>
                <p>
                  <strong>{es ? "Qué falta" : "What remains unknown"}:</strong>{" "}
                  {candidate.unknown ||
                    (es ? "Sin síntesis reciente" : "No recent synthesis")}
                </p>
                <p>
                  <strong>
                    {es
                      ? "Siguiente acción legítima"
                      : "Next legitimate action"}
                    :
                  </strong>{" "}
                  {candidate.nextAction ||
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
                    {es ? "Procedencia y recorrido" : "Provenance and journey"}
                  </summary>
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
