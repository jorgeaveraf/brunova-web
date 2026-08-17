import type { Metadata } from "next"

import "@/app/core-routes.css"

import { Container } from "@/components/layout/container"
import { Heading } from "@/components/layout/section-heading"
import { ActionLink } from "@/components/ui/action-link"
import { aboutNarrative, companyModel } from "@/content/about"
import { differentiators } from "@/content/home"
import { createPageMetadata } from "@/lib/metadata"

const description =
  "Why Brunova exists, how it works and why systems engineering must stay close to real operations."

export const metadata: Metadata = createPageMetadata({
  title: "About Brunova",
  description,
  path: "/about",
})

export default function AboutPage() {
  return (
    <main className="route-page about-page" id="main-content" tabIndex={-1}>
      <header className="about-thesis">
        <Container className="about-thesis__inner">
          <Heading level={1}>Built at the operating boundary.</Heading>
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
              Architecture remains close to delivery.
            </Heading>
            <p>
              Brunova is a systems engineering company: founder-led in
              architecture, team-based in delivery and accountable to the
              operation the system must support.
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
            The discipline behind the work.
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

      <nav aria-label="Explore Brunova" className="about-next">
        <Container className="about-next__inner">
          <ActionLink href="/capabilities" variant="secondary">
            Explore capabilities
          </ActionLink>
          <ActionLink href="/work" variant="text">
            View selected work
          </ActionLink>
        </Container>
      </nav>
    </main>
  )
}
