import { Container } from "@/components/layout/container"
import { Heading } from "@/components/layout/section-heading"
import { Section } from "@/components/layout/section"

export default function SiteShellReviewPage() {
  return (
    <main id="main-content">
      <Section aria-labelledby="shell-review-title" className="shell-review">
        <Container className="shell-review__inner">
          <div className="shell-review__heading">
            <p>Phase 2 · Global shell</p>
            <Heading id="shell-review-title" level={1}>
              Global shell ready for review.
            </Heading>
          </div>

          <div className="shell-review__notes">
            <p>
              This temporary surface exists to review navigation, theme, brand
              treatment, spacing and responsive behavior. It is not the Brunova
              homepage.
            </p>
            <dl>
              <div>
                <dt>Included</dt>
                <dd>Site shell, typed content and client boundaries</dd>
              </div>
              <div>
                <dt>Deferred</dt>
                <dd>Homepage narrative and public content routes</dd>
              </div>
              <div>
                <dt>Next gate</dt>
                <dd>Visual and architectural approval for Phase 3</dd>
              </div>
            </dl>
          </div>
        </Container>
      </Section>
    </main>
  )
}
