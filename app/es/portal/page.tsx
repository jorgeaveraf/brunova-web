import type { Metadata } from "next"
import { PortalPageView } from "@/components/pages/portal-page"
import { createPageMetadata } from "@/lib/metadata"
export const dynamic = "force-dynamic"
export function generateMetadata(): Metadata {
  return createPageMetadata({
    title: "Portal de Clientes Brunova",
    description:
      "Un espacio dedicado para sistemas de clientes activos, contexto de proyectos y acceso operativo.",
    path: "/portal",
    locale: "es",
    noIndex: true,
  })
}
export default function Page() {
  return <PortalPageView locale="es" />
}
