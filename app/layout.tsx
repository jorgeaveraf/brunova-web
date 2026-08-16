import type { Metadata } from "next"
import { IBM_Plex_Sans, Manrope } from "next/font/google"
import type { PropsWithChildren } from "react"

import { ThemeProvider } from "@/components/theme/theme-provider"
import { getSiteUrl } from "@/lib/env"

import "./globals.css"

const displayFont = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
})

const bodyFont = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-ibm-plex-sans",
  display: "swap",
})

export const metadata: Metadata = {
  metadataBase: getSiteUrl(),
  title: {
    default: "Brunova — Systems Engineering & Operational Intelligence",
    template: "%s — Brunova",
  },
  description:
    "Brunova designs and builds reliable systems that connect data, automation, software and AI for complex business operations.",
}

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${displayFont.variable} ${bodyFont.variable}`}>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  )
}
