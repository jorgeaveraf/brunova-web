import { AnalyticsLink } from "@/components/analytics/analytics-link"
import { SystemBoundaryDiagram } from "@/components/home/system-boundary-diagram"
import { Container } from "@/components/layout/container"
import { Heading } from "@/components/layout/section-heading"
import { Section } from "@/components/layout/section"
import { ActionLink } from "@/components/ui/action-link"
import { capabilities } from "@/content/capabilities"
import {
  architectureInputs,
  differentiators,
  homepage,
  homepageSymptoms,
  operationalIntelligenceElements,
} from "@/content/home"
import { processStages } from "@/content/process"
import { workCases } from "@/content/work"

import "../homepage.css"

export default function Homepage() {
  return (
    <main id="main-content">
      <Section aria-labelledby="homepage-title" className="home-hero">
        <Container className="home-hero__inner">
          <div className="home-hero__copy">
            <Heading className="home-hero__title" id="homepage-title" level={1}>
              {homepage.hero.title}
            </Heading>
            <p className="home-hero__description">
              {homepage.hero.description}
            </p>
            <div className="home-hero__actions">
              <AnalyticsLink
                eventName="cta_start_conversation"
                href="/contact"
                variant="primary"
              >
                {homepage.hero.primaryAction}
              </AnalyticsLink>
              <AnalyticsLink
                eventName="cta_explore_work"
                href="/work"
                variant="secondary"
              >
                {homepage.hero.secondaryAction}
              </AnalyticsLink>
            </div>
          </div>
          <SystemBoundaryDiagram />
        </Container>
      </Section>

      <Section aria-labelledby="problem-title" className="home-problem">
        <Container className="home-problem__inner">
          <div className="home-section-intro home-problem__intro">
            <Heading id="problem-title" level={2}>
              {homepage.problem.title}
            </Heading>
            <p>{homepage.problem.description}</p>
          </div>
          <ul className="problem-ledger">
            {homepageSymptoms.map((symptom, index) => (
              <li key={symptom.name}>
                <span className="problem-ledger__index">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <strong>{symptom.name}</strong>
                <span>{symptom.consequence}</span>
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      <Section
        aria-labelledby="operational-intelligence-title"
        className="operational-intelligence"
      >
        <Container className="operational-intelligence__inner">
          <div className="operational-intelligence__statement">
            <Heading id="operational-intelligence-title" level={2}>
              {homepage.operationalIntelligence.title}
            </Heading>
            <p>{homepage.operationalIntelligence.description}</p>
          </div>
          <dl className="operational-model">
            {operationalIntelligenceElements.map((element) => (
              <div key={element.name}>
                <dt>{element.name}</dt>
                <dd>{element.role}</dd>
              </div>
            ))}
          </dl>
        </Container>
      </Section>

      <Section
        aria-labelledby="capabilities-title"
        className="home-capabilities"
      >
        <Container>
          <div className="home-section-intro home-capabilities__intro">
            <Heading id="capabilities-title" level={2}>
              What Brunova builds
            </Heading>
            <p>
              Five connected capabilities for operations that can no longer be
              improved one tool at a time.
            </p>
          </div>
          <div className="capability-ledger">
            {capabilities.map((capability) => (
              <article
                className="capability-ledger__item"
                key={capability.slug}
              >
                <span className="capability-ledger__index">
                  {capability.index}
                </span>
                <Heading level={3}>{capability.name}</Heading>
                <p>{capability.shortDescription}</p>
                <ActionLink
                  href={`/capabilities#${capability.slug}`}
                  variant="text"
                >
                  View capability
                </ActionLink>
              </article>
            ))}
          </div>
        </Container>
      </Section>

      <Section
        aria-labelledby="architecture-title"
        className="architecture-hinge"
      >
        <Container className="architecture-hinge__inner">
          <Heading id="architecture-title" level={2}>
            <span>{homepage.architecture.question}</span>{" "}
            <span>{homepage.architecture.answer}</span>
          </Heading>
          <ul className="architecture-hinge__inputs">
            {architectureInputs.map((input) => (
              <li key={input}>{input}</li>
            ))}
          </ul>
        </Container>
      </Section>

      <Section aria-labelledby="selected-work-title" className="selected-work">
        <Container>
          <div className="home-section-intro selected-work__intro">
            <Heading id="selected-work-title" level={2}>
              {homepage.workTitle}
            </Heading>
            <p>
              Anonymized examples of systems built around real operational
              boundaries, without invented proof.
            </p>
          </div>
          <div className="work-ledger">
            {workCases.map((work, index) => (
              <article className="work-ledger__item" key={work.slug}>
                <span className="work-ledger__index">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div className="work-ledger__body">
                  <Heading level={3}>{work.homepageTitle}</Heading>
                  <p>{work.summary}</p>
                  <ul
                    aria-label={`Capability signals for ${work.homepageTitle}`}
                  >
                    {work.capabilitySignals.map((signal) => (
                      <li key={signal}>{signal}</li>
                    ))}
                  </ul>
                </div>
                <AnalyticsLink
                  eventName="case_study_opened"
                  eventProperties={{ case_slug: work.slug }}
                  href={`/work/${work.slug}`}
                  variant="text"
                >
                  View system
                </AnalyticsLink>
              </article>
            ))}
          </div>
        </Container>
      </Section>

      <Section aria-labelledby="process-title" className="home-process">
        <Container className="home-process__inner">
          <div className="home-process__context">
            <div className="home-section-intro">
              <Heading id="process-title" level={2}>
                {homepage.process.title}
              </Heading>
              <p>
                A public commercial path designed around the state of the
                operation—not a fixed funnel.
              </p>
            </div>
            <aside className="home-process__entry">
              <strong>{homepage.process.entryTitle}</strong>
              <p>{homepage.process.entryDescription}</p>
            </aside>
          </div>
          <ol className="process-track">
            {processStages.map((stage) => (
              <li key={stage.index}>
                <div className="process-track__identity">
                  <span>{stage.index}</span>
                  <strong>{stage.verb}</strong>
                </div>
                <div className="process-track__body">
                  <Heading level={3}>{stage.name}</Heading>
                  <p>{stage.description}</p>
                </div>
                <p className="process-track__timeline">{stage.timeline}</p>
              </li>
            ))}
          </ol>
        </Container>
      </Section>

      <Section
        aria-labelledby="differentiators-title"
        className="home-differentiators"
      >
        <Container>
          <Heading id="differentiators-title" level={2}>
            {homepage.differentiatorsTitle}
          </Heading>
          <ol className="principles">
            {differentiators.map((principle, index) => (
              <li key={principle.title}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <Heading level={3}>{principle.title}</Heading>
                <p>{principle.description}</p>
              </li>
            ))}
          </ol>
        </Container>
      </Section>

      <Section aria-labelledby="final-cta-title" className="home-final-cta">
        <Container className="home-final-cta__inner">
          <div>
            <Heading id="final-cta-title" level={2}>
              {homepage.finalCta.title}
            </Heading>
            <p>{homepage.finalCta.description}</p>
          </div>
          <AnalyticsLink
            eventName="cta_start_conversation"
            href="/contact"
            variant="primary"
          >
            {homepage.finalCta.action}
          </AnalyticsLink>
        </Container>
      </Section>
    </main>
  )
}
