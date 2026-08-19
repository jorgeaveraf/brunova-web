import type { Locale } from "@/lib/i18n"

const diagramCopy = {
  en: {
    mobileLabel: "From fragmented inputs to a reliable operating system",
    mobile: [
      ["Fragmented inputs", "Processes · Data · Automations · People"],
      ["Unclear handoffs", "Manual movement · Missing state"],
      ["Defined boundary", "Process · Trusted data · Decisions · Ownership"],
      ["Reliable operation", "Controlled · Operable · Scalable"],
    ],
    title: "From fragmented operations to a reliable operating system",
    description:
      "Separate processes, data and automations cross unclear manual handoffs. Brunova defines a system boundary that connects process, trusted state, decisions and ownership into a controlled operational flow.",
    groups: [
      "Fragmented inputs",
      "Defined system boundary",
      "Reliable operation",
    ],
    inputs: ["Processes", "Data", "Automations", "People"],
    handoffs: ["manual handoffs", "unclear state"],
    operatingSystem: "Operating system",
    layers: [
      ["Process", "known states"],
      ["Trusted data", "shared meaning"],
      ["Decisions", "governed paths"],
      ["Ownership", "explicit control"],
    ],
    flow: "controlled operational flow",
    output: ["Reliable", "operations", "operable", "scalable"],
    caption:
      "Brunova makes boundaries, state, decisions and ownership explicit before implementation tools are selected.",
  },
  es: {
    mobileLabel: "De entradas fragmentadas a un sistema operativo confiable",
    mobile: [
      [
        "Entradas fragmentadas",
        "Procesos · Datos · Automatizaciones · Personas",
      ],
      ["Relevos poco claros", "Movimiento manual · Estado ausente"],
      [
        "Límite definido",
        "Proceso · Datos confiables · Decisiones · Responsabilidad",
      ],
      ["Operación confiable", "Controlada · Operable · Escalable"],
    ],
    title: "De operaciones fragmentadas a un sistema operativo confiable",
    description:
      "Procesos, datos y automatizaciones separados atraviesan relevos manuales poco claros. Brunova define un límite de sistema que conecta proceso, estado confiable, decisiones y responsabilidad en un flujo operativo controlado.",
    groups: [
      "Entradas fragmentadas",
      "Límite de sistema definido",
      "Operación confiable",
    ],
    inputs: ["Procesos", "Datos", "Automatizaciones", "Personas"],
    handoffs: ["relevos manuales", "estado poco claro"],
    operatingSystem: "Sistema operativo",
    layers: [
      ["Proceso", "estados conocidos"],
      ["Datos confiables", "significado compartido"],
      ["Decisiones", "rutas gobernadas"],
      ["Responsabilidad", "control explícito"],
    ],
    flow: "flujo operativo controlado",
    output: ["Operaciones", "confiables", "operables", "escalables"],
    caption:
      "Brunova hace explícitos los límites, el estado, las decisiones y la responsabilidad antes de seleccionar herramientas de implementación.",
  },
} as const

export function SystemBoundaryDiagram({ locale }: { locale: Locale }) {
  const copy = diagramCopy[locale]
  return (
    <figure className="system-diagram" data-locale={locale}>
      <ol aria-label={copy.mobileLabel} className="system-diagram__mobile">
        {copy.mobile.map(([title, detail]) => (
          <li key={title}>
            <strong>{title}</strong>
            <span>{detail}</span>
          </li>
        ))}
      </ol>
      <svg
        aria-labelledby="system-diagram-title system-diagram-description"
        className="system-diagram__svg"
        role="img"
        viewBox="0 0 720 480"
      >
        <title id="system-diagram-title">{copy.title}</title>
        <desc id="system-diagram-description">{copy.description}</desc>

        <defs>
          <marker
            id="diagram-arrow"
            markerHeight="8"
            markerWidth="8"
            orient="auto"
            refX="7"
            refY="4"
          >
            <path className="system-diagram__arrowhead" d="M0 0L8 4L0 8Z" />
          </marker>
        </defs>

        <text className="system-diagram__group-label" x="18" y="24">
          {copy.groups[0]}
        </text>
        <text className="system-diagram__group-label" x="286" y="24">
          {copy.groups[1]}
        </text>
        <text className="system-diagram__group-label" x="586" y="24">
          {copy.groups[2]}
        </text>

        <g className="system-diagram__input">
          <rect height="64" width="136" x="18" y="70" />
          <text x="34" y="108">
            {copy.inputs[0]}
          </text>
        </g>
        <g className="system-diagram__input">
          <rect height="64" width="136" x="18" y="170" />
          <text x="34" y="208">
            {copy.inputs[1]}
          </text>
        </g>
        <g className="system-diagram__input">
          <rect height="64" width="136" x="18" y="270" />
          <text x="34" y="308">
            {copy.inputs[2]}
          </text>
        </g>
        <g className="system-diagram__input system-diagram__input--offset">
          <rect height="64" width="136" x="18" y="370" />
          <text x="34" y="408">
            {copy.inputs[3]}
          </text>
        </g>

        <g className="system-diagram__handoffs">
          <path d="M154 102H224" markerEnd="url(#diagram-arrow)" />
          <path d="M154 202H224" markerEnd="url(#diagram-arrow)" />
          <path d="M154 302H224" markerEnd="url(#diagram-arrow)" />
          <path d="M154 402H224" markerEnd="url(#diagram-arrow)" />
          <line x1="224" x2="224" y1="86" y2="418" />
          <text x="210" y="238" textAnchor="end">
            {copy.handoffs[0]}
          </text>
          <text x="210" y="258" textAnchor="end">
            {copy.handoffs[1]}
          </text>
        </g>

        <g className="system-diagram__boundary">
          <rect height="384" width="276" x="270" y="50" />
          <text className="system-diagram__boundary-title" x="290" y="84">
            {copy.operatingSystem}
          </text>

          <g className="system-diagram__layer">
            <line x1="290" x2="526" y1="120" y2="120" />
            <text x="290" y="151">
              {copy.layers[0][0]}
            </text>
            <text
              className="system-diagram__layer-note"
              x="526"
              y="151"
              textAnchor="end"
            >
              {copy.layers[0][1]}
            </text>
          </g>
          <g className="system-diagram__layer">
            <line x1="290" x2="526" y1="184" y2="184" />
            <text x="290" y="215">
              {copy.layers[1][0]}
            </text>
            <text
              className="system-diagram__layer-note"
              x="526"
              y="215"
              textAnchor="end"
            >
              {copy.layers[1][1]}
            </text>
          </g>
          <g className="system-diagram__layer">
            <line x1="290" x2="526" y1="248" y2="248" />
            <text x="290" y="279">
              {copy.layers[2][0]}
            </text>
            <text
              className="system-diagram__layer-note"
              x="526"
              y="279"
              textAnchor="end"
            >
              {copy.layers[2][1]}
            </text>
          </g>
          <g className="system-diagram__layer">
            <line x1="290" x2="526" y1="312" y2="312" />
            <text x="290" y="343">
              {copy.layers[3][0]}
            </text>
            <text
              className="system-diagram__layer-note"
              x="526"
              y="343"
              textAnchor="end"
            >
              {copy.layers[3][1]}
            </text>
          </g>

          <path
            className="system-diagram__controlled-flow"
            d="M290 386H516"
            markerEnd="url(#diagram-arrow)"
          />
          <text className="system-diagram__flow-label" x="290" y="411">
            {copy.flow}
          </text>
        </g>

        <path
          className="system-diagram__output-line"
          d="M546 242H584"
          markerEnd="url(#diagram-arrow)"
        />
        <g className="system-diagram__output">
          <rect height="132" width="118" x="584" y="176" />
          <text x="602" y="216">
            {copy.output[0]}
          </text>
          <text x="602" y="239">
            {copy.output[1]}
          </text>
          <line x1="602" x2="684" y1="260" y2="260" />
          <text className="system-diagram__output-note" x="602" y="282">
            {copy.output[2]}
          </text>
          <text className="system-diagram__output-note" x="602" y="301">
            {copy.output[3]}
          </text>
        </g>
      </svg>
      <figcaption>{copy.caption}</figcaption>
    </figure>
  )
}
