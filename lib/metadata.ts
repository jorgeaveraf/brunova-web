import type { Metadata } from "next"

type PageMetadataInput = {
  title: string
  description: string
  path: `/${string}`
  noIndex?: boolean
  followWhenNoIndex?: boolean
}

export function createPageMetadata({
  title,
  description,
  path,
  noIndex = false,
  followWhenNoIndex = true,
}: PageMetadataInput): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      siteName: "Brunova",
      title,
      description,
      url: path,
    },
    twitter: {
      card: "summary",
      title,
      description,
    },
    ...(noIndex
      ? {
          robots: {
            index: false,
            follow: followWhenNoIndex,
          },
        }
      : {}),
  }
}
