import { notFound } from "next/navigation"

import "@/app/core-routes.css"

import { AnalyticsLink } from "@/components/analytics/analytics-link"
import { Container } from "@/components/layout/container"
import { Heading } from "@/components/layout/section-heading"
import { SystemFlow } from "@/components/work/system-flow"
import { localizedContent } from "@/content/locales"
import type { WorkDetail } from "@/content/types"
import { localizedPath, type Locale } from "@/lib/i18n"

export function WorkDetailPageView({
  locale,
  slug,
}: {
  locale: Locale
  slug: string
}) {
  const { workCases, workDetails } = localizedContent[locale]
  const work = workCases.find((candidate) => candidate.slug === slug)
  const detail = workDetails.find((candidate) => candidate.slug === slug) as
    WorkDetail | undefined
  const es = locale === "es"

  if (!work || !detail) notFound()

  const relatedWork = workCases
    .filter((candidate) => candidate.slug !== work.slug)
    .filter((candidate) =>
      workDetails
        .find((item) => item.slug === candidate.slug)
        ?.capabilities.some((candidateCapability) =>
          detail.capabilities.some(
            (capability) =>
              capability.capabilitySlug === candidateCapability.capabilitySlug,
          ),
        ),
    )
    .slice(0, 2)

  return (
    <main className="route-page case-page" id="main-content" tabIndex={-1}>
      <header className="case-intro">
        <Container className="case-intro__inner">
          <div className="case-intro__identity">
            <p>
              {es
                ? "Expediente de sistema anonimizado"
                : "Anonymized system record"}
            </p>
            <Heading level={1}>{work.title}</Heading>
          </div>
          <p className="case-intro__summary">{work.summary}</p>
        </Container>
      </header>

      <Container className="case-dossier">
        <aside
          className="case-dossier__index"
          aria-label={es ? "Secciones del expediente" : "Case study sections"}
        >
          <p>{work.homepageTitle}</p>
          <ul>
            <li>
              <a href="#context">{es ? "Contexto" : "Context"}</a>
            </li>
            <li>
              <a href="#system-boundary">
                {es ? "Límite del sistema" : "System boundary"}
              </a>
            </li>
            <li>
              <a href="#decisions">
                {es ? "Decisiones de ingeniería" : "Engineering decisions"}
              </a>
            </li>
            <li>
              <a href="#outcome">{es ? "Resultado" : "Outcome"}</a>
            </li>
          </ul>
        </aside>

        <div className="case-dossier__body">
          <section
            id="context"
            className="case-narrative case-narrative--context"
          >
            <div>
              <Heading level={2}>{es ? "Contexto" : "Context"}</Heading>
              <p>{detail.context}</p>
            </div>
            <div>
              <Heading level={2}>
                {es ? "Problema operativo" : "Operational problem"}
              </Heading>
              <p>{detail.operationalProblem}</p>
            </div>
            {detail.scalingConstraint ? (
              <div>
                <Heading level={2}>
                  {es
                    ? "Por qué el enfoque anterior dejó de escalar"
                    : "Why the previous approach stopped scaling"}
                </Heading>
                <p>{detail.scalingConstraint}</p>
              </div>
            ) : null}
          </section>

          <section className="case-narrative case-narrative--approach">
            <Heading level={2}>
              {es ? "Enfoque del sistema" : "System approach"}
            </Heading>
            <p>{detail.systemApproach}</p>
          </section>

          <section id="system-boundary" className="case-boundary">
            <Heading level={2}>
              {es
                ? "Arquitectura / límite del sistema"
                : "Architecture / system boundary"}
            </Heading>
            <SystemFlow
              description={detail.systemBoundary.summary}
              id={`flow-${work.slug}`}
              steps={detail.systemBoundary.steps}
            />
          </section>

          <section id="decisions" className="case-decisions">
            <div>
              <Heading level={2}>
                {es
                  ? "Decisiones clave de ingeniería"
                  : "Key engineering decisions"}
              </Heading>
              <ul>
                {detail.engineeringDecisions.map((decision) => (
                  <li key={decision}>{decision}</li>
                ))}
              </ul>
            </div>
            {detail.safeguards ? (
              <div>
                <Heading level={2}>
                  {es ? "Salvaguardas operativas" : "Operational safeguards"}
                </Heading>
                <ul>
                  {detail.safeguards.map((safeguard) => (
                    <li key={safeguard}>{safeguard}</li>
                  ))}
                </ul>
              </div>
            ) : null}
          </section>

          <section id="outcome" className="case-outcome">
            <Heading level={2}>{es ? "Resultado" : "Outcome"}</Heading>
            <p>{detail.outcome}</p>
            <div className="case-outcome__capabilities">
              <Heading level={3}>
                {es ? "Capacidades involucradas" : "Capabilities involved"}
              </Heading>
              <ul>
                {detail.capabilities.map((capability) => (
                  <li key={capability.label}>
                    <a
                      href={`${localizedPath(locale, "/capabilities")}#${capability.capabilitySlug}`}
                    >
                      {capability.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          {relatedWork.length > 0 ? (
            <section className="case-related">
              <Heading level={2}>
                {es ? "Proyectos relacionados" : "Related work"}
              </Heading>
              <ul>
                {relatedWork.map((related) => (
                  <li key={related.slug}>
                    <span>{related.homepageTitle}</span>
                    <AnalyticsLink
                      eventName="case_study_opened"
                      eventProperties={{ case_slug: related.slug }}
                      href={localizedPath(locale, `/work/${related.slug}`)}
                      variant="text"
                    >
                      {es ? "Ver sistema" : "View system"}
                    </AnalyticsLink>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}
        </div>
      </Container>

      <section aria-labelledby="case-next" className="route-cta">
        <Container className="route-cta__inner">
          <div>
            <Heading id="case-next" level={2}>
              {es
                ? "¿Reconoce un límite de sistema similar?"
                : "Recognize a similar system boundary?"}
            </Heading>
            <p>
              {es
                ? "Comience con la operación y la presión que la rodea."
                : "Start with the operation and the pressure around it."}
            </p>
          </div>
          <AnalyticsLink
            eventName="cta_start_conversation"
            href={localizedPath(locale, "/contact")}
            variant="primary"
          >
            {es ? "Iniciar una conversación" : "Start a conversation"}
          </AnalyticsLink>
        </Container>
      </section>
    </main>
  )
}
