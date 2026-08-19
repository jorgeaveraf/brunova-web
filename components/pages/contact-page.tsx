import "@/app/contact.css"
import "@/app/core-routes.css"

import { ContactForm } from "@/components/contact/contact-form"
import { Container } from "@/components/layout/container"
import { Heading } from "@/components/layout/section-heading"
import type { Locale } from "@/lib/i18n"

export function ContactPageView({ locale }: { locale: Locale }) {
  const es = locale === "es"
  const expectations = es
    ? [
        {
          title: "Empiece con la operación.",
          description:
            "Indique qué se está volviendo difícil de operar y dónde aparece la fricción.",
        },
        {
          title: "Comparta lo que sabe.",
          description:
            "Los sistemas existentes, el trabajo manual recurrente y las restricciones conocidas aportan contexto útil.",
        },
        {
          title: "Déjenos definir el encuadre.",
          description:
            "Revisaremos la nota y responderemos con el siguiente paso más útil.",
        },
      ]
    : [
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
      ]
  return (
    <main className="route-page contact-page" id="main-content" tabIndex={-1}>
      <Container className="contact-studio">
        <section className="contact-studio__context">
          <div className="contact-studio__opening">
            <Heading level={1}>
              <span>{es ? "Inicie una" : "Start a"}</span>{" "}
              <span>{es ? "conversación." : "conversation."}</span>
            </Heading>
            <p>
              {es
                ? "Cuéntenos qué operación se está volviendo difícil de ejecutar, dónde aparece la fricción y qué sabe ya sobre el problema."
                : "Tell us what operation is becoming difficult to run, where the friction shows up, and what you already know about the problem."}
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
          aria-label={
            es
              ? "Formulario de conversación sobre sistemas operativos"
              : "Operational systems conversation form"
          }
          className="contact-studio__form"
        >
          <ContactForm locale={locale} />
        </section>
      </Container>
    </main>
  )
}
