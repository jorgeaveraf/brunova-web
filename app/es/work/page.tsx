import type { Metadata } from "next"
import { WorkPageView } from "@/components/pages/work-page"
import { createPageMetadata } from "@/lib/metadata"
export const metadata: Metadata = createPageMetadata({
  title: "Sistemas seleccionados",
  description:
    "Un portafolio anonimizado de sistemas de integración financiera, infraestructura de datos, inteligencia documental y modernización de automatizaciones desarrollados por Brunova.",
  path: "/work",
  locale: "es",
})
export default function Page() {
  return <WorkPageView locale="es" />
}
