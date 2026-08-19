import type { Metadata } from "next"
import { CapabilitiesPageView } from "@/components/pages/capabilities-page"
import { createPageMetadata } from "@/lib/metadata"
export const metadata: Metadata = createPageMetadata({
  title: "Systems engineering capabilities",
  description:
    "Five connected systems-engineering capabilities for complex operations: architecture, data, financial automation, process engineering and modernization.",
  path: "/capabilities",
})
export default function Page() {
  return <CapabilitiesPageView locale="en" />
}
