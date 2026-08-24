import type { Metadata } from "next"
import { ProcessPageView } from "@/components/pages/process-page"
import { createPageMetadata } from "@/lib/metadata"
export const metadata: Metadata = createPageMetadata({
  title: "Cómo trabaja Brunova",
  description:
    "Diagnóstico, diseño de arquitectura, implementación y evolución continua: Brunova empieza en la etapa que corresponde al estado real del sistema.",
  path: "/process",
  locale: "es",
})
export default function Page() {
  return <ProcessPageView locale="es" />
}
