import type { Metadata } from "next"
import { AboutPageView } from "@/components/pages/about-page"
import { createPageMetadata } from "@/lib/metadata"

export const metadata: Metadata = createPageMetadata({
  title: "About Brunova",
  description:
    "Why Brunova exists, how it works and why systems engineering must stay close to real operations.",
  path: "/about",
  locale: "en",
})
export default function AboutPage() {
  return <AboutPageView locale="en" />
}
