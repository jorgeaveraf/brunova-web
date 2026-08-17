import type { Metadata } from "next"

import { AnalyticsLink } from "@/components/analytics/analytics-link"
import { Container } from "@/components/layout/container"
import { Heading } from "@/components/layout/section-heading"
import { getWorkDetail } from "@/content/work-details"
import { workCases } from "@/content/work"
import { createPageMetadata } from "@/lib/metadata"

const description =
  "An anonymized portfolio of financial integration, data infrastructure, document intelligence and automation modernization systems engineered by Brunova."

export const metadata: Metadata = createPageMetadata({
  title: "Selected systems",
  description,
  path: "/work",
})

export default function WorkPage() {
  const [leadCase, ...supportingCases] = workCases

  return (
    <main className="route-page work-page" id="main-content">
      <header className="route-intro work-intro">
        <Container className="work-intro__inner">
          <Heading level={1}>Selected systems we’ve engineered.</Heading>
          <div className="route-intro__lede">
            <p>
              An anonymized portfolio of system classes built around real
              operational boundaries. The records show the work without
              inventing client proof, metrics or product interfaces.
            </p>
          </div>
        </Container>
      </header>

      <Container className="work-folio">
        <article className="work-folio__lead">
          <div className="work-folio__number">01</div>
          <div className="work-folio__lead-copy">
            <p>{leadCase.homepageTitle}</p>
            <Heading level={2}>{leadCase.title}</Heading>
            <p>{leadCase.summary}</p>
          </div>
          <ul aria-label={`Capabilities in ${leadCase.homepageTitle}`}>
            {getWorkDetail(leadCase.slug)?.capabilities.map((capability) => (
              <li key={capability.label}>
                <a href={`/capabilities#${capability.capabilitySlug}`}>
                  {capability.label}
                </a>
              </li>
            ))}
          </ul>
          <AnalyticsLink
            eventName="case_study_opened"
            eventProperties={{ case_slug: leadCase.slug }}
            href={`/work/${leadCase.slug}`}
            variant="secondary"
          >
            View system
          </AnalyticsLink>
        </article>

        <div className="work-folio__supporting">
          {supportingCases.map((work, index) => (
            <article className="work-folio__case" key={work.slug}>
              <div className="work-folio__number">
                {String(index + 2).padStart(2, "0")}
              </div>
              <p className="work-folio__label">{work.homepageTitle}</p>
              <Heading level={2}>{work.title}</Heading>
              <p>{work.summary}</p>
              <ul aria-label={`Capabilities in ${work.homepageTitle}`}>
                {getWorkDetail(work.slug)?.capabilities.map((capability) => (
                  <li key={capability.label}>
                    <a href={`/capabilities#${capability.capabilitySlug}`}>
                      {capability.label}
                    </a>
                  </li>
                ))}
              </ul>
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
    </main>
  )
}
