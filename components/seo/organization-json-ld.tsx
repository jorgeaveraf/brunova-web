import { getSiteUrl } from "@/lib/env"
import { createOrganizationStructuredData } from "@/lib/seo"
import type { Locale } from "@/lib/i18n"

export function OrganizationJsonLd({ locale }: { locale: Locale }) {
  const structuredData = createOrganizationStructuredData(getSiteUrl(), locale)

  return (
    <script
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(structuredData).replaceAll("<", "\\u003c"),
      }}
      type="application/ld+json"
    />
  )
}
