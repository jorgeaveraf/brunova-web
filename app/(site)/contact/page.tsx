import type { Metadata } from "next"

import { Container } from "@/components/layout/container"
import { Heading } from "@/components/layout/section-heading"
import { ActionLink } from "@/components/ui/action-link"
import { createPageMetadata } from "@/lib/metadata"

export const metadata: Metadata = createPageMetadata({
  title: "Start a conversation",
  description: "The Brunova contact route is not available in this release.",
  path: "/contact",
  noIndex: true,
})

export default function ContactAvailabilityPage() {
  return (
    <main className="route-page availability-page" id="main-content">
      <Container className="availability-state">
        <p>Contact route</p>
        <Heading level={1}>Conversation intake is not available yet.</Heading>
        <p>
          Explore the systems Brunova has engineered while this route remains
          unavailable.
        </p>
        <ActionLink href="/work" variant="primary">
          View selected work
        </ActionLink>
      </Container>
    </main>
  )
}
