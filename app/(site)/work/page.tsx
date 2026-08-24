import type { Metadata } from "next"
import { WorkPageView } from "@/components/pages/work-page"
import { createPageMetadata } from "@/lib/metadata"
export const metadata: Metadata = createPageMetadata({
  title: "Selected operational systems designed and built by Brunova",
  description:
    "A selection of systems Brunova has designed and built to solve complex operational problems.",
  path: "/work",
})
export default function Page() {
  return <WorkPageView locale="en" />
}
