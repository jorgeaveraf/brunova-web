"use client"

export default function GlobalError({ reset }: { reset: () => void }) {
  return (
    <html lang="en">
      <body>
        <main className="system-state">
          <p className="system-state__code">Error</p>
          <h1>The site could not finish loading.</h1>
          <p>Please try once more.</p>
          <button onClick={reset} type="button">
            Reload
          </button>
        </main>
      </body>
    </html>
  )
}
