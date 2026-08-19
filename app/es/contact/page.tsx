import type { Metadata } from "next"
import { ContactPageView } from "@/components/pages/contact-page"
import { createPageMetadata } from "@/lib/metadata"
export const metadata: Metadata = createPageMetadata({
  title: "Iniciar una conversación",
  description:
    "Cuéntele a Brunova qué operación se está volviendo difícil de ejecutar y dónde aparece la fricción.",
  path: "/contact",
  locale: "es",
})
export default function Page() {
  return <ContactPageView locale="es" />
}
