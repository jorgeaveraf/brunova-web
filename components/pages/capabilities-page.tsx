import "@/app/core-routes.css"

import { AnalyticsLink } from "@/components/analytics/analytics-link"
import { Container } from "@/components/layout/container"
import { RouteContext } from "@/components/layout/route-context"
import { Heading } from "@/components/layout/section-heading"
import { ActionLink } from "@/components/ui/action-link"
import { localizedContent } from "@/content/locales"
import { localizedPath, type Locale } from "@/lib/i18n"

export function CapabilitiesPageView({ locale }: { locale: Locale }) {
  const { capabilities, workCases } = localizedContent[locale]
  const getWorkCase = (slug: string) =>
    workCases.find((work) => work.slug === slug)
  const es = locale === "es"
  return (
    <main
      className="route-page capability-page"
      id="main-content"
      tabIndex={-1}
    >
      <RouteContext
        ariaLabel={es ? "Contexto de página" : "Page context"}
        items={[
          { label: es ? "Explorar" : "Explore" },
          { label: es ? "Capacidades" : "Capabilities" },
        ]}
      />
      <header className="route-intro capability-intro">
        <Container className="capability-intro__inner">
          <Heading level={1}>
            {es
              ? "Capacidades que se combinan en sistemas."
              : "Capabilities that combine into systems."}
          </Heading>
          <div className="route-intro__lede">
            <p>
              {es
                ? "Brunova reúne arquitectura, datos, automatización y procesos dentro de un solo límite operativo. Las cinco capacidades son responsabilidades conectadas, no líneas de servicio aisladas."
                : "Brunova brings architecture, data, automation and process work into one operating boundary. The five capabilities are connected responsibilities—not isolated service lines."}
            </p>
          </div>
        </Container>
      </header>

      <Container className="capability-field">
        <nav
          aria-label={es ? "Secciones de capacidades" : "Capability sections"}
          className="capability-field__map"
        >
          <p>
            {es
              ? "Un sistema, cinco responsabilidades"
              : "One system, five responsibilities"}
          </p>
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
              <details
                className="capability-spread capability-disclosure"
                id={capability.slug}
                key={capability.slug}
              >
                <summary className="capability-spread__title">
                  <span>{capability.index}</span>
                  <span className="capability-spread__summary-copy">
                    <Heading level={2}>{capability.name}</Heading>
                    <span>{capability.shortDescription}</span>
                  </span>
                  <span aria-hidden="true" className="disclosure-mark" />
                </summary>

                <div className="capability-spread__body">
                  <div className="capability-spread__problem">
                    <Heading level={3}>
                      {es ? "La clase de problema" : "The class of problem"}
                    </Heading>
                    <p>{capability.problemClass}</p>
                  </div>

                  <div className="capability-spread__approach">
                    <Heading level={3}>
                      {es
                        ? "Cómo lo aborda Brunova"
                        : "How Brunova approaches it"}
                    </Heading>
                    <p>{capability.approach}</p>
                  </div>

                  <div className="capability-spread__outcomes">
                    <Heading level={3}>
                      {es
                        ? "Resultados típicos del sistema"
                        : "Typical system outcomes"}
                    </Heading>
                    <ul>
                      {capability.outcomes.map((outcome) => (
                        <li key={outcome}>{outcome}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="capability-spread__concerns">
                    <Heading level={3}>
                      {es
                        ? "Consideraciones operativas"
                        : "Operational concerns"}
                    </Heading>
                    <ul>
                      {capability.operationalConcerns.map((concern) => (
                        <li key={concern}>{concern}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="capability-spread__work">
                    <Heading level={3}>
                      {es
                        ? "Proyectos seleccionados relacionados"
                        : "Related selected work"}
                    </Heading>
                    <ul>
                      {relatedWork.map((work) => (
                        <li key={work.slug}>
                          <span>{work.homepageTitle}</span>
                          <ActionLink
                            href={localizedPath(locale, `/work/${work.slug}`)}
                            variant="text"
                          >
                            {es ? "Ver sistema" : "View system"}
                          </ActionLink>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </details>
            )
          })}
        </div>
      </Container>

      <section aria-labelledby="capability-next" className="route-cta">
        <Container className="route-cta__inner">
          <div>
            <Heading id="capability-next" level={2}>
              {es
                ? "Empiece con la operación, no con una etiqueta de servicio."
                : "Start with the operation, not a service label."}
            </Heading>
            <p>
              {es
                ? "Brunova puede identificar la combinación de capacidades que el sistema realmente necesita."
                : "Brunova can identify the combination of capabilities the system actually requires."}
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
