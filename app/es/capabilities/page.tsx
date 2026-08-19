import type { Metadata } from "next"
import { CapabilitiesPageView } from "@/components/pages/capabilities-page"
import { createPageMetadata } from "@/lib/metadata"
export const metadata: Metadata = createPageMetadata({
  title: "Capacidades de ingeniería de sistemas",
  description:
    "Cinco capacidades conectadas para operaciones complejas: arquitectura, datos, automatización financiera, ingeniería de procesos y modernización.",
  path: "/capabilities",
  locale: "es",
})
export default function Page() {
  return <CapabilitiesPageView locale="es" />
}
