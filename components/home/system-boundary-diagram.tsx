export function SystemBoundaryDiagram() {
  return (
    <figure className="system-diagram">
      <ol
        aria-label="From fragmented inputs to a reliable operating system"
        className="system-diagram__mobile"
      >
        <li>
          <strong>Fragmented inputs</strong>
          <span>Processes · Data · Automations · People</span>
        </li>
        <li>
          <strong>Unclear handoffs</strong>
          <span>Manual movement · Missing state</span>
        </li>
        <li>
          <strong>Defined boundary</strong>
          <span>Process · Trusted data · Decisions · Ownership</span>
        </li>
        <li>
          <strong>Reliable operation</strong>
          <span>Controlled · Operable · Scalable</span>
        </li>
      </ol>
      <svg
        aria-labelledby="system-diagram-title system-diagram-description"
        className="system-diagram__svg"
        role="img"
        viewBox="0 0 720 480"
      >
        <title id="system-diagram-title">
          From fragmented operations to a reliable operating system
        </title>
        <desc id="system-diagram-description">
          Separate processes, data and automations cross unclear manual
          handoffs. Brunova defines a system boundary that connects process,
          trusted state, decisions and ownership into a controlled operational
          flow.
        </desc>

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
          Fragmented inputs
        </text>
        <text className="system-diagram__group-label" x="286" y="24">
          Defined system boundary
        </text>
        <text className="system-diagram__group-label" x="586" y="24">
          Reliable operation
        </text>

        <g className="system-diagram__input">
          <rect height="64" width="136" x="18" y="70" />
          <text x="34" y="108">
            Processes
          </text>
        </g>
        <g className="system-diagram__input">
          <rect height="64" width="136" x="18" y="170" />
          <text x="34" y="208">
            Data
          </text>
        </g>
        <g className="system-diagram__input">
          <rect height="64" width="136" x="18" y="270" />
          <text x="34" y="308">
            Automations
          </text>
        </g>
        <g className="system-diagram__input system-diagram__input--offset">
          <rect height="64" width="136" x="18" y="370" />
          <text x="34" y="408">
            People
          </text>
        </g>

        <g className="system-diagram__handoffs">
          <path d="M154 102H224" markerEnd="url(#diagram-arrow)" />
          <path d="M154 202H224" markerEnd="url(#diagram-arrow)" />
          <path d="M154 302H224" markerEnd="url(#diagram-arrow)" />
          <path d="M154 402H224" markerEnd="url(#diagram-arrow)" />
          <line x1="224" x2="224" y1="86" y2="418" />
          <text x="210" y="238" textAnchor="end">
            manual handoffs
          </text>
          <text x="210" y="258" textAnchor="end">
            unclear state
          </text>
        </g>

        <g className="system-diagram__boundary">
          <rect height="384" width="276" x="270" y="50" />
          <text className="system-diagram__boundary-title" x="290" y="84">
            Operating system
          </text>

          <g className="system-diagram__layer">
            <line x1="290" x2="526" y1="120" y2="120" />
            <text x="290" y="151">
              Process
            </text>
            <text
              className="system-diagram__layer-note"
              x="526"
              y="151"
              textAnchor="end"
            >
              known states
            </text>
          </g>
          <g className="system-diagram__layer">
            <line x1="290" x2="526" y1="184" y2="184" />
            <text x="290" y="215">
              Trusted data
            </text>
            <text
              className="system-diagram__layer-note"
              x="526"
              y="215"
              textAnchor="end"
            >
              shared meaning
            </text>
          </g>
          <g className="system-diagram__layer">
            <line x1="290" x2="526" y1="248" y2="248" />
            <text x="290" y="279">
              Decisions
            </text>
            <text
              className="system-diagram__layer-note"
              x="526"
              y="279"
              textAnchor="end"
            >
              governed paths
            </text>
          </g>
          <g className="system-diagram__layer">
            <line x1="290" x2="526" y1="312" y2="312" />
            <text x="290" y="343">
              Ownership
            </text>
            <text
              className="system-diagram__layer-note"
              x="526"
              y="343"
              textAnchor="end"
            >
              explicit control
            </text>
          </g>

          <path
            className="system-diagram__controlled-flow"
            d="M290 386H516"
            markerEnd="url(#diagram-arrow)"
          />
          <text className="system-diagram__flow-label" x="290" y="411">
            controlled operational flow
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
            Reliable
          </text>
          <text x="602" y="239">
            operations
          </text>
          <line x1="602" x2="684" y1="260" y2="260" />
          <text className="system-diagram__output-note" x="602" y="282">
            operable
          </text>
          <text className="system-diagram__output-note" x="602" y="301">
            scalable
          </text>
        </g>
      </svg>
      <figcaption>
        Brunova makes boundaries, state, decisions and ownership explicit before
        implementation tools are selected.
      </figcaption>
    </figure>
  )
}
