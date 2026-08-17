import type { Metadata } from "next"

import { AnalyticsLink } from "@/components/analytics/analytics-link"
import { Container } from "@/components/layout/container"
import { Heading } from "@/components/layout/section-heading"
import { ActionLink } from "@/components/ui/action-link"
import { capabilities } from "@/content/capabilities"
import { getWorkCase } from "@/content/work"
import { createPageMetadata } from "@/lib/metadata"

const description =
  "Five connected systems-engineering capabilities for complex operations: architecture, data, financial automation, process engineering and modernization."

export const metadata: Metadata = createPageMetadata({
  title: "Systems engineering capabilities",
  description,
  path: "/capabilities",
})

export default function CapabilitiesPage() {
  return (
    <main className="route-page capability-page" id="main-content">
      <header className="route-intro capability-intro">
        <Container className="capability-intro__inner">
          <Heading level={1}>Capabilities that combine into systems.</Heading>
          <div className="route-intro__lede">
            <p>
              Brunova brings architecture, data, automation and process work
              into one operating boundary. The five capabilities are connected
              responsibilities—not isolated service lines.
            </p>
            <p>
              The right combination depends on where the operation is losing
              trust, control or the ability to evolve.
            </p>
          </div>
        </Container>
      </header>

      <Container className="capability-field">
        <nav aria-label="Capability sections" className="capability-field__map">
          <p>One system, five responsibilities</p>
          <ol>
            {capabilities.map((capability) => (
              <li key={capability.slug}>
                <a href={`#${capability.slug}`}>
                  <span>{capability.index}</span>
                  {capability.navigationLabel}
                </a>
              </li>
            ))}
          </ol>
        </nav>

        <div className="capability-field__details">
          {capabilities.map((capability) => {
            const relatedWork = capability.relatedWork
              .map(getWorkCase)
              .filter((work): work is NonNullable<typeof work> => Boolean(work))

            return (
              <article
                className="capability-spread"
                id={capability.slug}
                key={capability.slug}
              >
                <div className="capability-spread__title">
                  <span>{capability.index}</span>
                  <Heading level={2}>{capability.name}</Heading>
                  <p>{capability.shortDescription}</p>
                </div>

                <div className="capability-spread__problem">
                  <Heading level={3}>The class of problem</Heading>
                  <p>{capability.problemClass}</p>
                </div>

                <div className="capability-spread__approach">
                  <Heading level={3}>How Brunova approaches it</Heading>
                  <p>{capability.approach}</p>
                </div>

                <div className="capability-spread__outcomes">
                  <Heading level={3}>Typical system outcomes</Heading>
                  <ul>
                    {capability.outcomes.map((outcome) => (
                      <li key={outcome}>{outcome}</li>
                    ))}
                  </ul>
                </div>

                <div className="capability-spread__concerns">
                  <Heading level={3}>Operational concerns</Heading>
                  <ul>
                    {capability.operationalConcerns.map((concern) => (
                      <li key={concern}>{concern}</li>
                    ))}
                  </ul>
                </div>

                <div className="capability-spread__work">
                  <Heading level={3}>Related selected work</Heading>
                  <ul>
                    {relatedWork.map((work) => (
                      <li key={work.slug}>
                        <span>{work.homepageTitle}</span>
                        <ActionLink href={`/work/${work.slug}`} variant="text">
                          View system
                        </ActionLink>
                      </li>
                    ))}
                  </ul>
                </div>
              </article>
            )
          })}
        </div>
      </Container>

      <section aria-labelledby="capability-next" className="route-cta">
        <Container className="route-cta__inner">
          <div>
            <Heading id="capability-next" level={2}>
              Start with the operation, not a service label.
            </Heading>
            <p>
              Brunova can identify the combination of capabilities the system
              actually requires.
            </p>
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
