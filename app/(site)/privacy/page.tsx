import type { Metadata } from "next"

import { Container } from "@/components/layout/container"
import { Heading } from "@/components/layout/section-heading"
import { privacyContent } from "@/content/privacy"
import { createPageMetadata } from "@/lib/metadata"

const description =
  "How the Brunova Website v1 handles first-touch attribution, planned contact information, analytics and downstream processing."

export const metadata: Metadata = createPageMetadata({
  title: "Privacy",
  description,
  path: "/privacy",
})

export default function PrivacyPage() {
  return (
    <main className="route-page privacy-page" id="main-content">
      <header className="privacy-intro">
        <Container className="privacy-intro__inner">
          <div>
            <p>{privacyContent.updatedLabel}</p>
            <Heading level={1}>Privacy</Heading>
          </div>
          <p>{privacyContent.introduction}</p>
        </Container>
      </header>

      <Container className="privacy-document">
        <aside
          aria-label="Privacy sections"
          className="privacy-document__index"
        >
          <p>On this page</p>
          <ol>
            {privacyContent.sections.map((section) => (
              <li key={section.id}>
                <a href={`#${section.id}`}>{section.title}</a>
              </li>
            ))}
          </ol>
        </aside>

        <div className="privacy-document__body">
          {privacyContent.sections.map((section) => (
            <section id={section.id} key={section.id}>
              <Heading level={2}>{section.title}</Heading>
              {section.paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </section>
          ))}
        </div>
      </Container>
    </main>
  )
}
