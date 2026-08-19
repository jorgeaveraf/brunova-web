import type { Metadata } from "next"
import { ProcessPageView } from "@/components/pages/process-page"
import { createPageMetadata } from "@/lib/metadata"
export const metadata: Metadata = createPageMetadata({
  title: "Cómo trabaja Brunova",
  description:
    "Las cuatro etapas de colaboración de Brunova —Descubrimiento, Plano, Implementación y Evolución Gestionada— con puntos explícitos de entrada lateral.",
  path: "/process",
  locale: "es",
})
export default function Page() {
  return <ProcessPageView locale="es" />
}
