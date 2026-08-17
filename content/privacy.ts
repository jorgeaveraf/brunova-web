export const privacyContent = {
  reviewStatus: "legal-human-review-required-before-production",
  updatedLabel: "Privacy notice",
  introduction:
    "This notice describes the data handling currently present on the Brunova website and the contact workflow that will apply when contact submission becomes available.",
  sections: [
    {
      id: "contact-information",
      title: "Contact information",
      paragraphs: [
        "When the contact form is implemented, it is expected to collect your name, work email, company, role, problem category and problem description.",
        "The contact workflow is not active in the current release. No contact submission is accepted by this website yet.",
      ],
    },
    {
      id: "attribution",
      title: "First-touch attribution",
      paragraphs: [
        "If a landing URL contains UTM parameters, the website stores the first source, medium, campaign, term and content values in browser sessionStorage together with the landing path, capture time and available referrer.",
        "That record remains in the current browser session and is not sent to an analytics provider in the current release.",
      ],
    },
    {
      id: "processing",
      title: "Contact processing boundary",
      paragraphs: [
        "When contact submission is implemented, the browser will send the form to Brunova’s server endpoint. The server will validate and sanitize the submission before forwarding it to a private n8n webhook for operational follow-up.",
        "Any downstream lead, notification, email, spreadsheet or customer-relationship workflow will depend on the production n8n configuration and must be reviewed before that contact path is enabled.",
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
