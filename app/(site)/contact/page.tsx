import type { Metadata } from "next"

import { ContactForm } from "@/components/contact/contact-form"
import { Container } from "@/components/layout/container"
import { Heading } from "@/components/layout/section-heading"
import { createPageMetadata } from "@/lib/metadata"

export const metadata: Metadata = createPageMetadata({
  title: "Start a conversation",
  description:
    "Tell Brunova what operation is becoming difficult to run and where the friction shows up.",
  path: "/contact",
})

const expectations = [
  {
    title: "Start with the operation.",
    description:
      "Name what is becoming difficult to run and where the friction appears.",
  },
  {
    title: "Share what you know.",
    description:
      "Existing systems, recurring manual work and known constraints are useful context.",
  },
  {
    title: "Leave the framing to us.",
    description:
      "We’ll review the note and respond with the most useful next step.",
  },
] as const

export default function ContactPage() {
  return (
    <main className="route-page contact-page" id="main-content">
      <Container className="contact-studio">
        <section className="contact-studio__context">
          <div className="contact-studio__opening">
            <Heading level={1}>
              <span>Start a</span> <span>conversation.</span>
            </Heading>
            <p>
              Tell us what operation is becoming difficult to run, where the
              friction shows up, and what you already know about the problem.
            </p>
          </div>

          <ol className="contact-expectations">
            {expectations.map((expectation) => (
              <li key={expectation.title}>
                <strong>{expectation.title}</strong>
                <p>{expectation.description}</p>
              </li>
            ))}
          </ol>
        </section>

        <section
          aria-label="Operational systems conversation form"
          className="contact-studio__form"
        >
          <ContactForm />
        </section>
      </Container>
    </main>
  )
}
