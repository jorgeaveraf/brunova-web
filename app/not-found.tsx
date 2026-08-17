import type { Metadata } from "next"
import Link from "next/link"

import { BrunovaLogo } from "@/components/brand/brunova-logo"

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false, follow: false },
}

export default function NotFound() {
  return (
    <main className="system-state">
      <BrunovaLogo location="header" />
      <p className="system-state__code">404</p>
      <h1>Page not found.</h1>
      <p>The requested Brunova page is not available.</p>
      <Link href="/">Return to Brunova</Link>
    </main>
  )
}
