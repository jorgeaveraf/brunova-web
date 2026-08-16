import Link from "next/link"

export default function NotFound() {
  return (
    <main className="system-state">
      <p className="system-state__code">404</p>
      <h1>Page not found.</h1>
      <p>The requested page is not available.</p>
      <Link href="/">Return to Brunova</Link>
    </main>
  )
}
