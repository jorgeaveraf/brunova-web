export const privacyContent = {
  reviewStatus: "legal-human-review-required-before-production",
  updatedLabel: "Privacy notice",
  introduction:
    "This notice describes how the Brunova website handles contact information, first-touch attribution and the current analytics configuration.",
  sections: [
    {
      id: "contact-information",
      title: "Contact information",
      paragraphs: [
        "The contact form collects your name, work email, company, role, problem category and the description you provide about an operational problem.",
        "Brunova uses this information to review the context, determine an appropriate next step and follow up on the conversation.",
      ],
    },
    {
      id: "attribution",
      title: "First-touch attribution",
      paragraphs: [
        "The website stores a first-touch record in browser sessionStorage for the current session. It contains the landing path and language, capture time, a referring hostname when available, a limited source classification and any source, medium, campaign, term and content UTM values supplied in the landing URL.",
        "The site does not retain the full referring URL or its query string. The first-touch fields and available UTM values are included with a contact submission so Brunova can understand which discovery sources produce conversations.",
      ],
    },
    {
      id: "processing",
      title: "Contact processing boundary",
      paragraphs: [
        "The browser sends the contact form to Brunova’s server. The server validates and limits the submission before forwarding only the accepted contact fields, limited first-touch fields and available UTM values to Brunova’s private server-side operational workflow.",
        "That workflow supports internal review and operational follow-up. The website does not send the honeypot field, form timing information, raw network address or browser fingerprint into that workflow.",
      ],
    },
    {
      id: "analytics",
      title: "Analytics and advertising",
      paragraphs: [
        "The current website uses a no-operation analytics adapter. No analytics provider or analytics cookie is active.",
        "The current website does not include advertising trackers. Because no cookie-based analytics is active, no cookie banner is shown.",
      ],
    },
  ],
} as const
