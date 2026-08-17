import type { PropsWithChildren } from "react"

import { AttributionCapture } from "@/components/analytics/attribution-capture"
import { SiteFooter } from "@/components/layout/site-footer"
import { SiteHeader } from "@/components/layout/site-header"

import "../site-shell.css"
import "../core-routes.css"
import "../contact.css"

export default function SiteLayout({ children }: PropsWithChildren) {
  return (
    <>
      <AttributionCapture />
      <SiteHeader />
      <div className="site-shell__content">{children}</div>
      <SiteFooter />
    </>
  )
}
