import { AnalyticsLink } from "@/components/analytics/analytics-link"
import { SystemBoundaryDiagram } from "@/components/home/system-boundary-diagram"
import { Container } from "@/components/layout/container"
import { Heading } from "@/components/layout/section-heading"
import { Section } from "@/components/layout/section"
import { ActionLink } from "@/components/ui/action-link"
import { localizedContent } from "@/content/locales"
import { localizedPath, type Locale } from "@/lib/i18n"

import "@/app/homepage.css"

export function HomePageView({ locale }: { locale: Locale }) {
  const {
    architectureInputs,
    capabilities,
    differentiators,
    homepage,
    homepageSymptoms,
    operationalIntelligenceElements,
    processStages,
    workCases,
  } = localizedContent[locale]
  const es = locale === "es"
  const recognitionSymptoms = [
    homepageSymptoms[0],
    homepageSymptoms[2],
    homepageSymptoms[4],
  ]
  const selectedWork = workCases.slice(0, 2)
  const processOutputs = es
    ? [
        "Evidencia y límite",
        "Diseño listo",
        "Capacidad en producción",
        "Mejora continua",
      ]
    : [
        "Evidence and boundary",
        "Build-ready design",
        "Production capability",
        "Continuing improvement",
      ]
  const processInputs = es
    ? [
        "Problema poco claro",
        "Límite conocido",
        "Diseño listo",
        "Sistema activo",
      ]
    : ["Unclear problem", "Known boundary", "Ready design", "Live system"]
  return (
    <main id="main-content" tabIndex={-1}>
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
                href={localizedPath(locale, "/contact")}
                variant="primary"
              >
                {homepage.hero.primaryAction}
              </AnalyticsLink>
              <AnalyticsLink
                eventName="cta_explore_work"
                href={localizedPath(locale, "/work")}
                variant="secondary"
              >
                {homepage.hero.secondaryAction}
              </AnalyticsLink>
            </div>
          </div>
          <SystemBoundaryDiagram locale={locale} />
        </Container>
      </Section>

      <section
        aria-label={es ? "Posicionamiento" : "Positioning"}
        className="home-category"
      >
        <Container>
          <p>{homepage.category}</p>
        </Container>
      </section>

      <Section aria-labelledby="problem-title" className="home-problem">
        <Container className="home-problem__inner">
          <div className="home-section-intro home-problem__intro">
            <Heading id="problem-title" level={2}>
              {homepage.problem.title}
            </Heading>
            <p>{homepage.problem.description}</p>
          </div>
          <div
            className="problem-shift"
            role="group"
            aria-label={
              es
                ? "De fragmentación a control operativo"
                : "From fragmentation to operational control"
            }
          >
            <ul className="problem-shift__signals">
              {recognitionSymptoms.map((symptom) => (
                <li key={symptom.name}>
                  <strong>{symptom.name}</strong>
                  <span>{symptom.consequence}</span>
                </li>
              ))}
            </ul>
            <p className="problem-shift__transition">
              {homepage.problem.transition}
            </p>
          </div>
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
          <div
            className="operational-model"
            role="group"
            aria-label={homepage.operationalIntelligence.title}
          >
            <div className="operational-model__phase operational-model__observe">
              <span>{es ? "Observar" : "Observe"}</span>
              <strong>
                {es
                  ? "Operaciones · Datos · Sistemas"
                  : "Operations · Data · Systems"}
              </strong>
            </div>
            <div className="operational-model__phase operational-model__decide">
              <span>{es ? "Decidir" : "Decide"}</span>
              <strong>
                {es ? "Inteligencia operativa" : "Operational intelligence"}
              </strong>
              <small>
                {es
                  ? "Significado · Límites · Responsabilidad"
                  : "Meaning · Boundaries · Ownership"}
              </small>
            </div>
            <div className="operational-model__phase operational-model__act">
              <span>{es ? "Actuar" : "Act"}</span>
              <strong>
                {operationalIntelligenceElements
                  .slice(3)
                  .map((element) => element.name)
                  .join(" · ")}
              </strong>
              <small>
                {es ? "Capacidades gobernadas" : "Governed capabilities"}
              </small>
            </div>
            <p className="operational-model__return">
              {es
                ? "El estado operativo regresa al modelo"
                : "Operational state returns to the model"}
            </p>
          </div>
        </Container>
      </Section>

      <Section
        aria-labelledby="capabilities-title"
        className="home-capabilities"
      >
        <Container>
          <div className="home-section-intro home-capabilities__intro">
            <Heading id="capabilities-title" level={2}>
              {es ? "Lo que construye Brunova" : "What Brunova builds"}
            </Heading>
            <p>
              {es
                ? "Cinco capacidades conectadas para operaciones que ya no pueden mejorarse una herramienta a la vez."
                : "Five connected capabilities for operations that can no longer be improved one tool at a time."}
            </p>
          </div>
          <div
            className="capability-field-preview"
            role="group"
            aria-label={es ? "Un sistema operativo" : "One operational system"}
          >
            <p className="capability-field-preview__core">
              {es ? "Un sistema operativo" : "One operational system"}
            </p>
            {capabilities.map((capability) => (
              <div
                className="capability-field-preview__item"
                key={capability.slug}
              >
                <Heading level={3}>{capability.name}</Heading>
              </div>
            ))}
          </div>
          <ActionLink
            className="home-capabilities__action"
            href={localizedPath(locale, "/capabilities")}
            variant="text"
          >
            {es ? "Explorar capacidades" : "Explore capabilities"}
          </ActionLink>
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
              {es
                ? "Ejemplos anonimizados de sistemas construidos alrededor de límites operativos reales."
                : "Anonymized system examples built around real operational boundaries."}
            </p>
          </div>
          <div className="selected-proof">
            {selectedWork.map((work, index) => (
              <article
                className={
                  index === 0
                    ? "selected-proof__lead"
                    : "selected-proof__support"
                }
                key={work.slug}
              >
                <div>
                  <p className="selected-proof__type">{work.homepageTitle}</p>
                  <Heading level={3}>{work.title}</Heading>
                  <p>{work.summary}</p>
                </div>
                <AnalyticsLink
                  eventName="case_study_opened"
                  eventProperties={{ case_slug: work.slug }}
                  href={localizedPath(locale, `/work/${work.slug}`)}
                  variant="text"
                >
                  {es ? "Ver sistema" : "View system"}
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
                {es
                  ? "Una ruta comercial pública diseñada alrededor del estado de la operación, no como un embudo fijo."
                  : "A public commercial path designed around the state of the operation—not a fixed funnel."}
              </p>
            </div>
            <aside className="home-process__entry">
              <strong>{homepage.process.entryTitle}</strong>
              <p>{homepage.process.entryDescription}</p>
            </aside>
          </div>
          <ol className="process-sequence" aria-label={homepage.process.title}>
            {processStages.map((stage, index) => (
              <li key={stage.index}>
                <span className="process-sequence__input">
                  {processInputs[index]}
                </span>
                <strong>{stage.verb}</strong>
                <span aria-hidden="true" className="process-sequence__arrow">
                  →
                </span>
                <p>{processOutputs[index]}</p>
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
            {differentiators.map((principle) => (
              <li key={principle.title}>
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
            href={localizedPath(locale, "/contact")}
            variant="primary"
          >
            {homepage.finalCta.action}
          </AnalyticsLink>
        </Container>
      </Section>
    </main>
  )
}
