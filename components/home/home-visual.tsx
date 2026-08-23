import type { Locale } from "@/lib/i18n"
import Image from "next/image"

type HomeVisualKind =
  "hero" | "operational-intelligence" | "architecture-boundary"

type VisualCopy = {
  alt: string
  caption?: string
  mobileLabel: string
  mobile: readonly (readonly [string, string])[]
}

const visualCopy: Record<Locale, Record<HomeVisualKind, VisualCopy>> = {
  en: {
    hero: {
      alt: "From fragmented operations to a reliable operating system",
      mobileLabel: "From fragmented operation to reliable operation",
      mobile: [
        ["Fragmented operation", "Work · Data · Systems"],
        ["Defined boundary", "State · Decisions · Ownership"],
        ["Reliable operation", "Controlled · Operable · Scalable"],
      ],
    },
    "operational-intelligence": {
      alt: "Operational intelligence control loop: observe, decide and act",
      caption:
        "Operational state returns to the model. Automation, software and AI remain governed capabilities—not the center of the system.",
      mobileLabel: "Operational intelligence control loop",
      mobile: [
        ["Observe", "Operations · Data · Systems"],
        ["Decide", "Meaning · Boundaries · Ownership"],
        ["Act", "Automation · Software · AI"],
      ],
    },
    "architecture-boundary": {
      alt: "Architecture before tools: from external context to operational capability",
      mobileLabel: "Architecture before tools",
      mobile: [
        ["External context", "Inputs and operating conditions"],
        ["Defined system boundary", "Process · Data · Decisions · Ownership"],
        ["Operational capability", "Automation · Software · AI"],
      ],
    },
  },
  es: {
    hero: {
      alt: "De operaciones fragmentadas a un sistema operativo confiable",
      mobileLabel: "De operación fragmentada a operación confiable",
      mobile: [
        ["Operación fragmentada", "Trabajo · Datos · Sistemas"],
        ["Límite definido", "Estado · Decisiones · Responsabilidad"],
        ["Operación confiable", "Controlada · Operable · Escalable"],
      ],
    },
    "operational-intelligence": {
      alt: "Ciclo de inteligencia operacional: observar, decidir y actuar",
      caption:
        "El estado operativo regresa al modelo. Automatización, software e IA permanecen como capacidades gobernadas, no como el centro del sistema.",
      mobileLabel: "Ciclo de control de inteligencia operacional",
      mobile: [
        ["Observar", "Operaciones · Datos · Sistemas"],
        ["Decidir", "Significado · Límites · Responsabilidad"],
        ["Actuar", "Automatización · Software · IA"],
      ],
    },
    "architecture-boundary": {
      alt: "Arquitectura antes que herramientas: del contexto externo a la capacidad operacional",
      mobileLabel: "Arquitectura antes que herramientas",
      mobile: [
        ["Contexto externo", "Entradas y condiciones operativas"],
        [
          "Límite del sistema",
          "Proceso · Datos · Decisiones · Responsabilidad",
        ],
        ["Capacidad operacional", "Automatización · Software · IA"],
      ],
    },
  },
}

const visualDimensions: Record<HomeVisualKind, readonly [number, number]> = {
  hero: [1440, 420],
  "operational-intelligence": [960, 480],
  "architecture-boundary": [720, 520],
}

const visualFile: Record<HomeVisualKind, string> = {
  hero: "hero-operating-model",
  "operational-intelligence": "operational-intelligence-loop",
  "architecture-boundary": "architecture-boundary",
}

export function HomeVisual({
  kind,
  locale,
  priority = false,
}: {
  kind: HomeVisualKind
  locale: Locale
  priority?: boolean
}) {
  const copy = visualCopy[locale][kind]
  const [width, height] = visualDimensions[kind]
  const localeSuffix = locale === "es" ? "-es" : ""
  const src = `/brand/visuals/${visualFile[kind]}${localeSuffix}.svg`

  return (
    <figure
      className={`home-visual home-visual--${kind}`}
      data-locale={locale}
      data-visual={kind}
    >
      <Image
        alt={copy.alt}
        className="home-visual__asset"
        decoding="async"
        fetchPriority={priority ? "high" : "auto"}
        height={height}
        loading={priority ? "eager" : "lazy"}
        src={src}
        unoptimized
        width={width}
      />
      <ol aria-label={copy.mobileLabel} className="home-visual__mobile">
        {copy.mobile.map(([title, detail]) => (
          <li key={title}>
            <strong>{title}</strong>
            <span>{detail}</span>
          </li>
        ))}
      </ol>
      {copy.caption ? <figcaption>{copy.caption}</figcaption> : null}
    </figure>
  )
}
