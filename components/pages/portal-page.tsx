import "@/app/core-routes.css"

import { Container } from "@/components/layout/container"
import { RouteContext } from "@/components/layout/route-context"
import { Heading } from "@/components/layout/section-heading"
import { getPortalUrl } from "@/lib/env"
import type { Locale } from "@/lib/i18n"

export function PortalPageView({ locale }: { locale: Locale }) {
  const portalUrl = getPortalUrl()
  const es = locale === "es"
  const portalDescription = es
    ? "Un espacio dedicado para sistemas de clientes activos, contexto de entrega y acceso operativo."
    : "A dedicated workspace for active client systems, delivery context and operational access."

  return (
    <main className="route-page portal-page" id="main-content" tabIndex={-1}>
      <RouteContext
        ariaLabel={es ? "Contexto de página" : "Page context"}
        items={[
          { href: es ? "/es" : "/", label: "Brunova" },
          { label: "Portal" },
        ]}
      />
      <Container className="portal-threshold">
        <div className="portal-threshold__identity">
          <p>
            {es ? "Límite de sistemas de clientes" : "Client systems boundary"}
          </p>
          <Heading level={1}>
            {es ? "Portal de Clientes Brunova" : "Brunova Client Portal"}
          </Heading>
          <p>{portalDescription}</p>
        </div>
        <div className="portal-threshold__access">
          {portalUrl ? (
            <>
              <p>
                {es
                  ? "El acceso al portal está disponible para clientes activos."
                  : "Portal access is available to active clients."}
              </p>
              <a
                className="action-link action-link--primary"
                href={portalUrl.href}
                rel="noreferrer"
                target="_blank"
              >
                {es ? "Abrir portal de clientes" : "Open client portal"}
              </a>
            </>
          ) : (
            <p>
              {es
                ? "El acceso al portal está disponible para clientes activos."
                : "Portal access is available to active clients."}
            </p>
          )}
        </div>
      </Container>
    </main>
  )
}
