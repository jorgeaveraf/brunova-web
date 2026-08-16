"use client"

export default function ErrorPage({ reset }: { reset: () => void }) {
  return (
    <main className="system-state">
      <p className="system-state__code">Error</p>
      <h1>Something interrupted this page.</h1>
      <p>Please try the request again.</p>
      <button onClick={reset} type="button">
        Try again
      </button>
    </main>
  )
}
