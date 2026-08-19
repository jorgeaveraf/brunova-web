import type { Metadata } from "next"
import { WorkPageView } from "@/components/pages/work-page"
import { createPageMetadata } from "@/lib/metadata"
export const metadata: Metadata = createPageMetadata({
  title: "Selected systems",
  description:
    "An anonymized portfolio of financial integration, data infrastructure, document intelligence and automation modernization systems engineered by Brunova.",
  path: "/work",
})
export default function Page() {
  return <WorkPageView locale="en" />
}
