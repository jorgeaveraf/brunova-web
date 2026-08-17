import Link from "next/link"

import { AnalyticsLink } from "@/components/analytics/analytics-link"
import { BrunovaLogo } from "@/components/brand/brunova-logo"
import { Container } from "@/components/layout/container"
import { MobileNavigation } from "@/components/layout/mobile-navigation"
import { ThemeControl } from "@/components/theme/theme-control"
import { primaryNavigation, portalNavigation } from "@/content/navigation"
import { siteConfig } from "@/content/site"

export function SiteHeader() {
  return (
    <header className="site-header">
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>
      <Container className="site-header__identity">
        <BrunovaLogo location="header" />
        <p>{siteConfig.descriptor}</p>
      </Container>

      <Container className="site-header__bar">
        <div className="site-header__mobile-brand">
          <BrunovaLogo location="header" />
        </div>
        <nav aria-label="Primary navigation" className="desktop-navigation">
          <ul className="desktop-navigation__links">
            {primaryNavigation.map((item) => (
              <li key={item.href}>
                <Link href={item.href}>{item.label}</Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="site-header__utilities">
          <AnalyticsLink
            eventName={portalNavigation.analyticsEvent}
            href={portalNavigation.href}
            variant="utility"
          >
            {portalNavigation.label}
          </AnalyticsLink>
          <ThemeControl compact />
          <AnalyticsLink
            eventName={siteConfig.primaryAction.analyticsEvent}
            href={siteConfig.primaryAction.href}
            variant="primary"
          >
            {siteConfig.primaryAction.label}
          </AnalyticsLink>
        </div>

        <MobileNavigation
          portalItem={portalNavigation}
          primaryAction={siteConfig.primaryAction}
          primaryItems={primaryNavigation}
        />
      </Container>
    </header>
  )
}
