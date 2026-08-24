import type { Metadata } from "next"
import { AboutPageView } from "@/components/pages/about-page"
import { createPageMetadata } from "@/lib/metadata"

export const metadata: Metadata = createPageMetadata({
  title: "Sobre Brunova",
  description:
    "Por qué existe Brunova, cómo trabaja y por qué la ingeniería de sistemas debe mantenerse conectada con la operación real.",
  path: "/about",
  locale: "es",
})
export default function AboutPage() {
  return <AboutPageView locale="es" />
}
