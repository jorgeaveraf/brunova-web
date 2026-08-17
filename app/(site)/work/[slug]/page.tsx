import type { Metadata } from "next"
import { notFound } from "next/navigation"

import "@/app/core-routes.css"

import { AnalyticsLink } from "@/components/analytics/analytics-link"
import { Container } from "@/components/layout/container"
import { Heading } from "@/components/layout/section-heading"
import { SystemFlow } from "@/components/work/system-flow"
import { getWorkCase, workCases } from "@/content/work"
import { getWorkDetail } from "@/content/work-details"
import { createPageMetadata } from "@/lib/metadata"

type WorkDetailPageProps = {
  params: Promise<{ slug: string }>
}

export const dynamicParams = false

export function generateStaticParams() {
  return workCases.map((work) => ({ slug: work.slug }))
}

export async function generateMetadata({
  params,
}: WorkDetailPageProps): Promise<Metadata> {
  const { slug } = await params
  const work = getWorkCase(slug)

  if (!work) {
    return createPageMetadata({
      title: "System not found",
      description: "The requested Brunova selected-work record is unavailable.",
      path: `/work/${slug}`,
      noIndex: true,
      followWhenNoIndex: false,
    })
  }

  return createPageMetadata({
    title: work.title,
    description: work.summary,
    path: `/work/${work.slug}`,
  })
}

export default async function WorkDetailPage({ params }: WorkDetailPageProps) {
  const { slug } = await params
  const work = getWorkCase(slug)
  const detail = getWorkDetail(slug)

  if (!work || !detail) notFound()

  const relatedWork = workCases
    .filter((candidate) => candidate.slug !== work.slug)
    .filter((candidate) =>
      getWorkDetail(candidate.slug)?.capabilities.some((candidateCapability) =>
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
            <p>Anonymized system record</p>
            <Heading level={1}>{work.title}</Heading>
          </div>
          <p className="case-intro__summary">{work.summary}</p>
        </Container>
      </header>

      <Container className="case-dossier">
        <aside className="case-dossier__index" aria-label="Case study sections">
          <p>{work.homepageTitle}</p>
          <ul>
            <li>
              <a href="#context">Context</a>
            </li>
            <li>
              <a href="#system-boundary">System boundary</a>
            </li>
            <li>
              <a href="#decisions">Engineering decisions</a>
            </li>
            <li>
              <a href="#outcome">Outcome</a>
            </li>
          </ul>
        </aside>

        <div className="case-dossier__body">
          <section
            id="context"
            className="case-narrative case-narrative--context"
          >
            <div>
              <Heading level={2}>Context</Heading>
              <p>{detail.context}</p>
            </div>
            <div>
              <Heading level={2}>Operational problem</Heading>
              <p>{detail.operationalProblem}</p>
            </div>
            {detail.scalingConstraint ? (
              <div>
                <Heading level={2}>
                  Why the previous approach stopped scaling
                </Heading>
                <p>{detail.scalingConstraint}</p>
              </div>
            ) : null}
          </section>

          <section className="case-narrative case-narrative--approach">
            <Heading level={2}>System approach</Heading>
            <p>{detail.systemApproach}</p>
          </section>

          <section id="system-boundary" className="case-boundary">
            <Heading level={2}>Architecture / system boundary</Heading>
            <SystemFlow
              description={detail.systemBoundary.summary}
              id={`flow-${work.slug}`}
              steps={detail.systemBoundary.steps}
            />
          </section>

          <section id="decisions" className="case-decisions">
            <div>
              <Heading level={2}>Key engineering decisions</Heading>
              <ul>
                {detail.engineeringDecisions.map((decision) => (
                  <li key={decision}>{decision}</li>
                ))}
              </ul>
            </div>
            {detail.safeguards ? (
              <div>
                <Heading level={2}>Operational safeguards</Heading>
                <ul>
                  {detail.safeguards.map((safeguard) => (
                    <li key={safeguard}>{safeguard}</li>
                  ))}
                </ul>
              </div>
            ) : null}
          </section>

          <section id="outcome" className="case-outcome">
            <Heading level={2}>Outcome</Heading>
            <p>{detail.outcome}</p>
            <div className="case-outcome__capabilities">
              <Heading level={3}>Capabilities involved</Heading>
              <ul>
                {detail.capabilities.map((capability) => (
                  <li key={capability.label}>
                    <a href={`/capabilities#${capability.capabilitySlug}`}>
                      {capability.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          {relatedWork.length > 0 ? (
            <section className="case-related">
              <Heading level={2}>Related work</Heading>
              <ul>
                {relatedWork.map((related) => (
                  <li key={related.slug}>
                    <span>{related.homepageTitle}</span>
                    <AnalyticsLink
                      eventName="case_study_opened"
                      eventProperties={{ case_slug: related.slug }}
                      href={`/work/${related.slug}`}
                      variant="text"
                    >
                      View system
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
              Recognize a similar system boundary?
            </Heading>
            <p>Start with the operation and the pressure around it.</p>
          </div>
          <AnalyticsLink
            eventName="cta_start_conversation"
            href="/contact"
            variant="primary"
          >
            Start a conversation
          </AnalyticsLink>
        </Container>
      </section>
    </main>
  )
}
