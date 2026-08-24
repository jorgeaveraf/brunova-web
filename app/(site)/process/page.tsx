import type { Metadata } from "next"
import { ProcessPageView } from "@/components/pages/process-page"
import { createPageMetadata } from "@/lib/metadata"
export const metadata: Metadata = createPageMetadata({
  title: "How Brunova works",
  description:
    "Four system states with explicit lateral entry: Discovery, Architecture Blueprint, Implementation Sprint and Managed Evolution.",
  path: "/process",
})
export default function Page() {
  return <ProcessPageView locale="en" />
}
