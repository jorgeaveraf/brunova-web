import "@/app/core-routes.css"

import { AnalyticsLink } from "@/components/analytics/analytics-link"
import { Container } from "@/components/layout/container"
import { Heading } from "@/components/layout/section-heading"
import { localizedContent } from "@/content/locales"
import { localizedPath, type Locale } from "@/lib/i18n"

export function WorkPageView({ locale }: { locale: Locale }) {
  const { workCases, workDetails } = localizedContent[locale]
  const getWorkDetail = (slug: string) =>
    workDetails.find((detail) => detail.slug === slug)
  const es = locale === "es"
  const [leadCase, ...supportingCases] = workCases

  return (
    <main className="route-page work-page" id="main-content" tabIndex={-1}>
      <header className="route-intro work-intro">
        <Container className="work-intro__inner">
          <Heading level={1}>
            {es
              ? "Sistemas seleccionados que hemos desarrollado."
              : "Selected systems we’ve engineered."}
          </Heading>
          <div className="route-intro__lede">
            <p>
              {es
                ? "Un portafolio anonimizado de clases de sistemas construidos alrededor de límites operativos reales. Los expedientes muestran el trabajo sin inventar testimonios, métricas ni interfaces de producto."
                : "An anonymized portfolio of system classes built around real operational boundaries. The records show the work without inventing client proof, metrics or product interfaces."}
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
          <ul
            aria-label={`${es ? "Capacidades en" : "Capabilities in"} ${leadCase.homepageTitle}`}
          >
            {getWorkDetail(leadCase.slug)?.capabilities.map((capability) => (
              <li key={capability.label}>
                <a
                  href={`${localizedPath(locale, "/capabilities")}#${capability.capabilitySlug}`}
                >
                  {capability.label}
                </a>
              </li>
            ))}
          </ul>
          <AnalyticsLink
            eventName="case_study_opened"
            eventProperties={{ case_slug: leadCase.slug }}
            href={localizedPath(locale, `/work/${leadCase.slug}`)}
            variant="secondary"
          >
            {es ? "Ver sistema" : "View system"}
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
              <ul
                aria-label={`${es ? "Capacidades en" : "Capabilities in"} ${work.homepageTitle}`}
              >
                {getWorkDetail(work.slug)?.capabilities.map((capability) => (
                  <li key={capability.label}>
                    <a
                      href={`${localizedPath(locale, "/capabilities")}#${capability.capabilitySlug}`}
                    >
                      {capability.label}
                    </a>
                  </li>
                ))}
              </ul>
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
    </main>
  )
}
