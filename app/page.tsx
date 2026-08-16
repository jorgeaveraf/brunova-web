import Image from "next/image"

import { ThemeControl } from "@/components/theme/theme-control"

export default function FoundationPage() {
  return (
    <main className="foundation-shell">
      <section className="foundation-panel" aria-labelledby="foundation-title">
        <Image
          alt="Brunova"
          className="foundation-logo"
          height={295}
          priority
          src="/brand/brunova-wordmark-dark.webp"
          width={1045}
        />
        <div className="foundation-copy">
          <p className="foundation-status">BR-017 · Foundation</p>
          <h1 id="foundation-title">Architecture before tools.</h1>
          <p>
            The Brunova website foundation is running. Public navigation,
            content routes, and the production homepage begin only after Phase 2
            approval.
          </p>
        </div>
        <ThemeControl />
      </section>
    </main>
  )
}
