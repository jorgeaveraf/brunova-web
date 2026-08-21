import "@/app/core-routes.css"

import { AnalyticsLink } from "@/components/analytics/analytics-link"
import { Container } from "@/components/layout/container"
import { RouteContext } from "@/components/layout/route-context"
import { Heading } from "@/components/layout/section-heading"
import { localizedContent } from "@/content/locales"
import { localizedPath, type Locale } from "@/lib/i18n"

export function ProcessPageView({ locale }: { locale: Locale }) {
  const { processStages } = localizedContent[locale]
  const es = locale === "es"
  const lateralEntries = es
    ? [
        { known: "Problema conocido", enter: "Plano" },
        { known: "Arquitectura definida", enter: "Implementación" },
        {
          known: "Sistema existente en producción",
          enter: "Evolución Gestionada",
        },
      ]
    : [
        { known: "Known problem", enter: "Blueprint" },
        { known: "Defined architecture", enter: "Implementation" },
        { known: "Existing production system", enter: "Managed Evolution" },
      ]
  const stateOutputs = es
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
  return (
    <main className="route-page process-page" id="main-content" tabIndex={-1}>
      <RouteContext
        ariaLabel={es ? "Contexto de página" : "Page context"}
        items={[
          { label: es ? "Explorar" : "Explore" },
          { label: es ? "Proceso" : "Process" },
        ]}
      />
      <header className="route-intro process-intro">
        <Container className="process-intro__inner">
          <Heading level={1}>
            {es ? "Entre donde está el sistema." : "Enter where the system is."}
          </Heading>
          <div className="route-intro__lede">
            <p>
              {es
                ? "El proceso de Brunova es un conjunto de estados útiles del sistema, no un embudo fijo. El Descubrimiento está disponible cuando el problema no es claro; no es un requisito para trabajo que ya tiene un límite defendible."
                : "Brunova’s process is a set of useful system states, not a fixed funnel. Discovery is available when the problem is unclear; it is not a prerequisite for work that already has a defensible boundary."}
            </p>
          </div>
        </Container>
      </header>

      <section aria-labelledby="lateral-entry-title" className="entry-map">
        <Container className="entry-map__inner">
          <div>
            <Heading id="lateral-entry-title" level={2}>
              {es
                ? "La entrada lateral es explícita."
                : "Lateral entry is explicit."}
            </Heading>
            <p>
              {es
                ? "Comience en la etapa que corresponde con lo que ya se sabe."
                : "Begin at the stage that matches what is already known."}
            </p>
          </div>
          <dl>
            {lateralEntries.map((entry) => (
              <div key={entry.known}>
                <dt>{entry.known}</dt>
                <dd>
                  <span aria-hidden="true">→</span> {entry.enter}
                </dd>
              </div>
            ))}
          </dl>
        </Container>
      </section>

      <Container className="process-map-wrap">
        <ol
          className="process-state-map"
          aria-label={es ? "Estados del proceso" : "Process states"}
        >
          {processStages.map((stage, index) => (
            <li key={stage.index}>
              <span>{stage.index}</span>
              <strong>{stage.verb}</strong>
              <small>{stage.name}</small>
              <p>{stateOutputs[index]}</p>
            </li>
          ))}
        </ol>
      </Container>

      <Container className="process-path">
        {processStages.map((stage) => (
          <details className="process-stage" key={stage.index}>
            <summary className="process-stage__summary">
              <span>{stage.index}</span>
              <span>
                <Heading level={2}>{stage.name}</Heading>
                <small>{stage.timeline}</small>
              </span>
              <span aria-hidden="true" className="disclosure-mark" />
            </summary>
            <div className="process-stage__body">
              <p className="process-stage__description">{stage.description}</p>
              <div className="process-stage__question process-stage__problem">
                <Heading level={3}>
                  {es ? "Qué resuelve esta etapa" : "What this stage resolves"}
                </Heading>
                <p>{stage.problemSolved}</p>
              </div>
              <div className="process-stage__question process-stage__entry">
                <Heading level={3}>
                  {es
                    ? "Qué saber antes de entrar"
                    : "What to know before entering"}
                </Heading>
                <p>{stage.entryKnowledge}</p>
              </div>
              <div className="process-stage__question process-stage__establishes">
                <Heading level={3}>
                  {es ? "Qué establece Brunova" : "What Brunova establishes"}
                </Heading>
                <ul>
                  {stage.establishes.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
              <div className="process-stage__question process-stage__next">
                <Heading level={3}>
                  {es ? "Qué suele seguir" : "What typically comes next"}
                </Heading>
                <p>{stage.nextStep}</p>
              </div>
            </div>
          </details>
        ))}
      </Container>

      <section aria-labelledby="process-next" className="route-cta">
        <Container className="route-cta__inner">
          <div>
            <Heading id="process-next" level={2}>
              {es
                ? "¿No sabe qué etapa corresponde?"
                : "Not sure which stage matches?"}
            </Heading>
            <p>
              {es
                ? "Comparta la operación y lo que ya sabe."
                : "Bring the operation and what you already know."}
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
