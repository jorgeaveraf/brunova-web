import Link from "next/link"

import { AnalyticsLink } from "@/components/analytics/analytics-link"
import { BrunovaLogo } from "@/components/brand/brunova-logo"
import { Container } from "@/components/layout/container"
import { footerNavigation } from "@/content/navigation"
import { siteConfig } from "@/content/site"

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <Container className="site-footer__inner">
        <div className="site-footer__identity">
          <BrunovaLogo location="footer" />
          <p>{siteConfig.descriptor}</p>
        </div>

        <nav aria-label="Footer navigation">
          <ul className="site-footer__links">
            {footerNavigation.map((item) => (
              <li key={item.href}>
                {"analyticsEvent" in item && item.analyticsEvent ? (
                  <AnalyticsLink
                    eventName={item.analyticsEvent}
                    href={item.href}
                    variant="text"
                  >
                    {item.label}
                  </AnalyticsLink>
                ) : (
                  <Link href={item.href}>{item.label}</Link>
                )}
              </li>
            ))}
          </ul>
        </nav>

        <p className="site-footer__copyright">
          © {new Date().getFullYear()} Brunova
        </p>
      </Container>
    </footer>
  )
}
