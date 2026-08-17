"use client"

import { BrunovaLogo } from "@/components/brand/brunova-logo"

export default function ErrorPage({ reset }: { reset: () => void }) {
  return (
    <main className="system-state">
      <BrunovaLogo location="header" />
      <p className="system-state__code">Page interrupted</p>
      <h1>This page could not finish loading.</h1>
      <p>Try the page once more.</p>
      <button onClick={reset} type="button">
        Try again
      </button>
    </main>
  )
}
