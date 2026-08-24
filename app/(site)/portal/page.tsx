import type { Metadata } from "next"
import { PortalPageView } from "@/components/pages/portal-page"
import { createPageMetadata } from "@/lib/metadata"
export const dynamic = "force-dynamic"
export function generateMetadata(): Metadata {
  return createPageMetadata({
    title: "Brunova Client Portal",
    description:
      "A dedicated workspace for active client systems, project context and operational access.",
    path: "/portal",
    noIndex: true,
  })
}
export default function Page() {
  return <PortalPageView locale="en" />
}
