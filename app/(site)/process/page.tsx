import type { Metadata } from "next"
import { ProcessPageView } from "@/components/pages/process-page"
import { createPageMetadata } from "@/lib/metadata"
export const metadata: Metadata = createPageMetadata({
  title: "How Brunova works",
  description:
    "Brunova’s four engagement stages—Discovery, Blueprint, Implementation and Managed Evolution—with explicit lateral entry points.",
  path: "/process",
})
export default function Page() {
  return <ProcessPageView locale="en" />
}
