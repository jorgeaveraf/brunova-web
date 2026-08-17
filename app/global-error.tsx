"use client"

import { BrunovaLogo } from "@/components/brand/brunova-logo"

export default function GlobalError({ reset }: { reset: () => void }) {
  return (
    <html lang="en">
      <body>
        <main className="system-state">
          <BrunovaLogo location="header" />
          <p className="system-state__code">Site interrupted</p>
          <h1>The site could not finish loading.</h1>
          <p>Try loading Brunova once more.</p>
          <button onClick={reset} type="button">
            Reload
          </button>
        </main>
      </body>
    </html>
  )
}
