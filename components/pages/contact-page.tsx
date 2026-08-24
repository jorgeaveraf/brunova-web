import "@/app/contact.css"
import "@/app/core-routes.css"

import { ContactForm } from "@/components/contact/contact-form"
import { Container } from "@/components/layout/container"
import { RouteContext } from "@/components/layout/route-context"
import { Heading } from "@/components/layout/section-heading"
import type { Locale } from "@/lib/i18n"

export function ContactPageView({ locale }: { locale: Locale }) {
  const es = locale === "es"
  const expectations = es
    ? [
        {
          title: "Describa la operación.",
          description:
            "Señale qué cuesta ejecutar hoy y dónde aparece la fricción.",
        },
        {
          title: "Comparta el contexto disponible.",
          description:
            "Los sistemas actuales, las tareas manuales recurrentes y las restricciones conocidas son un buen punto de partida.",
        },
        {
          title: "Nosotros definimos el siguiente paso.",
          description:
            "Revisamos el caso y respondemos con una recomendación concreta.",
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
      <RouteContext
        ariaLabel={es ? "Contexto de página" : "Page context"}
        items={[
          { href: es ? "/es" : "/", label: "Brunova" },
          { label: es ? "Contacto" : "Contact" },
        ]}
      />
      <Container className="contact-studio">
        <section className="contact-studio__context">
          <div className="contact-studio__opening">
            <Heading level={1}>
              <span>{es ? "Hablemos de su" : "Start a"}</span>{" "}
              <span>{es ? "operación." : "conversation."}</span>
            </Heading>
            <p>
              {es
                ? "Cuéntenos qué se ha vuelto difícil de ejecutar, dónde aparece la fricción y qué información tiene hasta ahora."
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
              ? "Formulario de consulta sobre sistemas operacionales"
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
