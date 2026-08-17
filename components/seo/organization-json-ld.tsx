import { getSiteUrl } from "@/lib/env"
import { createOrganizationStructuredData } from "@/lib/seo"

export function OrganizationJsonLd() {
  const structuredData = createOrganizationStructuredData(getSiteUrl())

  return (
    <script
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(structuredData).replaceAll("<", "\\u003c"),
      }}
      type="application/ld+json"
    />
  )
}
