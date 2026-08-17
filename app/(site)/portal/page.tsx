import type { Metadata } from "next"

import { Container } from "@/components/layout/container"
import { Heading } from "@/components/layout/section-heading"
import { createPageMetadata } from "@/lib/metadata"
import { getPortalUrl } from "@/lib/env"

const portalDescription =
  "A dedicated workspace for active client systems, delivery context and operational access."

export const dynamic = "force-dynamic"

export function generateMetadata(): Metadata {
  const portalUrl = getPortalUrl()

  return createPageMetadata({
    title: "Brunova Client Portal",
    description: portalDescription,
    path: "/portal",
    noIndex: !portalUrl,
  })
}

export default function PortalPage() {
  const portalUrl = getPortalUrl()

  return (
    <main className="route-page portal-page" id="main-content">
      <Container className="portal-threshold">
        <div className="portal-threshold__identity">
          <p>Client systems boundary</p>
          <Heading level={1}>Brunova Client Portal</Heading>
          <p>{portalDescription}</p>
        </div>
        <div className="portal-threshold__access">
          {portalUrl ? (
            <>
              <p>Portal access is available to active clients.</p>
              <a
                className="action-link action-link--primary"
                href={portalUrl.href}
                rel="noreferrer"
                target="_blank"
              >
                Open client portal
              </a>
            </>
          ) : (
            <p>Portal access is available to active clients.</p>
          )}
        </div>
      </Container>
    </main>
  )
}
