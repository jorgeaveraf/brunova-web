import type { Metadata } from "next"
import { IBM_Plex_Sans, Manrope } from "next/font/google"
import type { PropsWithChildren } from "react"

import { OrganizationJsonLd } from "@/components/seo/organization-json-ld"
import { ThemeProvider } from "@/components/theme/theme-provider"
import { getSiteUrl, isSeoIndexingEnabled } from "@/lib/env"

import "./globals.css"

const displayFont = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "optional",
})

const bodyFont = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-ibm-plex-sans",
  display: "optional",
})

const siteUrl = getSiteUrl()
const title = "Brunova — Systems Engineering & Operational Intelligence"
const description =
  "Brunova designs and builds reliable systems that connect data, automation, software and AI for complex business operations."

export const metadata: Metadata = {
  metadataBase: siteUrl,
  title: {
    default: title,
    template: "%s — Brunova",
  },
  description,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: "Brunova",
    title,
    description,
    url: "/",
  },
  twitter: {
    card: "summary",
    title,
    description,
  },
  robots: isSeoIndexingEnabled()
    ? { index: true, follow: true }
    : { index: false, follow: false, noarchive: true },
}

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${displayFont.variable} ${bodyFont.variable}`}>
        <OrganizationJsonLd />
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  )
}
