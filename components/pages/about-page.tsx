import "@/app/core-routes.css"

import { Container } from "@/components/layout/container"
import { Heading } from "@/components/layout/section-heading"
import { ActionLink } from "@/components/ui/action-link"
import { localizedContent } from "@/content/locales"
import { localizedPath, type Locale } from "@/lib/i18n"

export function AboutPageView({ locale }: { locale: Locale }) {
  const { aboutNarrative, companyModel, differentiators } =
    localizedContent[locale]
  const es = locale === "es"
  return (
    <main className="route-page about-page" id="main-content" tabIndex={-1}>
      <header className="about-thesis">
        <Container className="about-thesis__inner">
          <Heading level={1}>
            {es
              ? "Construida en el límite operativo."
              : "Built at the operating boundary."}
          </Heading>
          <div className="about-thesis__narrative">
            <p>{aboutNarrative.observation}</p>
            <p>{aboutNarrative.boundary}</p>
          </div>
        </Container>
      </header>

      <section aria-labelledby="company-model-title" className="company-model">
        <Container className="company-model__inner">
          <div className="company-model__statement">
            <Heading id="company-model-title" level={2}>
              {es
                ? "La arquitectura permanece cerca de la entrega."
                : "Architecture remains close to delivery."}
            </Heading>
            <p>
              {es
                ? "Brunova es una empresa de ingeniería de sistemas: dirigida por el fundador en arquitectura, basada en equipos para la entrega y responsable ante la operación que el sistema debe sostener."
                : "Brunova is a systems engineering company: founder-led in architecture, team-based in delivery and accountable to the operation the system must support."}
            </p>
          </div>
          <div className="company-model__facets">
            {companyModel.map((facet) => (
              <article key={facet.title}>
                <Heading level={3}>{facet.title}</Heading>
                <p>{facet.description}</p>
              </article>
            ))}
          </div>
        </Container>
      </section>

      <section
        aria-labelledby="company-principles-title"
        className="about-principles"
      >
        <Container className="about-principles__inner">
          <Heading id="company-principles-title" level={2}>
            {es
              ? "La disciplina detrás del trabajo."
              : "The discipline behind the work."}
          </Heading>
          <div className="about-principles__statements">
            {differentiators.map((principle) => (
              <blockquote key={principle.title}>
                <p>{principle.description}</p>
                <cite>{principle.title}</cite>
              </blockquote>
            ))}
          </div>
        </Container>
      </section>

      <nav
        aria-label={es ? "Explorar Brunova" : "Explore Brunova"}
        className="about-next"
      >
        <Container className="about-next__inner">
          <ActionLink
            href={localizedPath(locale, "/capabilities")}
            variant="secondary"
          >
            {es ? "Explorar capacidades" : "Explore capabilities"}
          </ActionLink>
          <ActionLink href={localizedPath(locale, "/work")} variant="text">
            {es ? "Ver proyectos seleccionados" : "View selected work"}
          </ActionLink>
        </Container>
      </nav>
    </main>
  )
}
