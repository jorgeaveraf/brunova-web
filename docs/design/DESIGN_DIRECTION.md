# Brunova Website v1 — Design Direction

**Status:** Phase 4 core routes implemented for review. Contact conversion remains subject to Phase 5 approval.

## Hallmark decision

```text
Hallmark route: Custom / Bespoke
Macrostructure: Architectural Narrative
Vibe: architectural restraint, warm bone, operational precision
Genre influence: modern-minimal, without its floating-pill or generic SaaS defaults
Motion stance: motion-cut
Enrichment: Tier B semantic system-boundary diagram, implemented in Phase 3
```

The specification requires a recognition-first story rather than a template sequence. Marquee Hero delays explanation, Stat-Led requires unsupported metrics, Split Studio requires proof imagery that is not available, Narrative Workflow could imply a mandatory four-stage purchase path, and a Bento treatment would conflict with the anti-card direction. Architectural Narrative is therefore a deliberate bespoke structure rather than a renamed catalog preset.

The central visual move will be a restrained line-and-node system that begins as fragmented operational inputs and resolves into a legible system boundary. It must convey process, data, systems, automation, and ownership rather than act as decoration. “Architecture before tools” is the visual hinge of the eventual homepage.

## Pre-emit critique

```text
Philosophy  5/5 — architecture and recognition precede visual novelty
Hierarchy   5/5 — the specification fixes the buyer-question sequence
Execution   3/5 — foundation decisions are testable; final composition is deferred
Specificity 5/5 — palette, type, source asset, and exclusions are explicit
Restraint   5/5 — neutral palette, motion-cut, no fabricated proof
Variety     4/5 — bespoke composition avoids the dominant Hallmark/SaaS defaults
```

No score is below 3. The Phase 3 homepage critique is recorded below; the final 58-gate audit remains deferred to Phase 8.

## Approved logo source

Source: `docs/logo.png`

- SHA-256: `2cea7542237223721ae8c5af067b31128a327e29b2db3111737be942b5200463`.
- Dimensions: 1254×1254 pixels at 72 dpi.
- The filename says PNG, but the bytes are JPEG/JFIF.
- RGB, no alpha channel.
- Warm-white wordmark on a black square field.
- The wordmark occupies a horizontal band inside substantial black padding.

The source remains unchanged. The Phase 1 runtime asset is `public/brand/brunova-wordmark-dark.webp`: a 1045×295, non-transparent, lossless WebP crop retaining the source’s black background and original wordmark pixels. It may be used in either theme as a controlled black brand field. Do not invert it, trace it, remove its background, recreate it with a font, or fabricate a vector/light variant.

Missing future brand assets:

- Production vector or transparent wordmark, if the raster treatment proves limiting.
- Favicon.
- Production Open Graph artwork.

## Color system

The brand palette is achromatic in identity and warm in its neutrals:

- black / near-black,
- bone / warm white,
- warm neutral grays.

There is no chromatic brand accent. Light and dark themes are peers, with system preference as the default.

The initial focus treatment stays neutral:

- near-black focus ring on light surfaces,
- bone focus ring on dark surfaces,
- an offset surface-colored gap separates the ring from a same-tone control,
- focus appears instantly and is never animated.

Functional danger and success colors may appear only in form state, paired with text or an icon. They are not brand colors. A chromatic accessibility accent requires measured evidence that neutral treatment is materially worse and an explicit amendment to this document.

All raw OKLCH values live in root `tokens.css`. Components consume tokens only.

## Typography

- Display: Manrope variable, weights 600–700.
- Body and UI: IBM Plex Sans, weights 400–600.
- Wordmark: approved raster asset only.

Manrope echoes the approachable geometry of the wordmark without imitating it. IBM Plex Sans brings an engineering register to long-form and interface copy. Use no third family in v1.

Rules:

- headings remain roman,
- body text starts at 16px,
- display sizing follows copy length,
- page-level hierarchy uses no more than five sizes,
- running text stays within approximately 45–70 characters,
- weight and spacing create secondary hierarchy before another size is introduced.

## Grid and spacing

- Four-point spacing scale.
- Mobile-first, content-driven layout changes around 40rem, 60rem, and 90rem.
- Fluid gutters and a wide architectural grid rather than a repeated centered card column.
- `overflow-x: clip` on both root elements.
- Display text permits emergency long-word wrapping.
- Image-bearing grid tracks use `minmax(0, 1fr)`.
- Clickable labels never wrap.

Foundation smoke content is intentionally sparse. It is not the homepage design.

## Interaction and motion

Phase 1 contains only theme selection and ordinary link/control states. Motion is cut by default:

- transform and opacity only,
- no bounce, parallax, scroll choreography, or looping decoration,
- visible focus is immediate,
- `prefers-reduced-motion` removes spatial transitions.

The eventual system-boundary diagram may use one short orchestrated reveal only when it adds comprehension. Its complete meaning must remain present with animation disabled.

## Anti-generic constraints

Do not introduce:

- giant centered gradient heroes,
- purple/blue chromatic styling,
- floating pill navigation by default,
- equal icon-card grids,
- card-in-card containment,
- fake dashboards or browser chrome,
- invented metrics, clients, testimonials, or logos,
- decorative orbs, particles, or line art without semantic purpose,
- italic headings or ubiquitous section eyebrows,
- four-column SaaS footers,
- repeated rounded rectangles as the universal content shape.

## Theme and runtime behavior

Theme values are `system`, `light`, and `dark`. System is the default. Explicit choice persists locally, and prepaint initialization must prevent a visible flash. Page markup does not branch by theme; semantic tokens do.

## Deployment influence

The design system must work in a standalone Next.js container without CDN-only runtime dependencies. Fonts are fetched and self-hosted by `next/font` at build time. No design behavior depends on Vercel.

## Phase 2 shell decisions

### Header and navigation

The desktop header uses an adapted N6 two-band masthead, not a literal newspaper treatment. The first band gives the raster wordmark a controlled black brand field and places the company descriptor at the opposite edge. The second band separates primary routes from utilities with single rules and no floating container.

This adaptation was selected over N1b because the canonical wordmark-left / centered-links / CTA-right SaaS bar would reproduce the generic AI-navigation fingerprint. It was selected over N5 because a detached frosted pill conflicts with Brunova's architectural restraint. The resulting hierarchy is:

1. Brunova identity and positioning.
2. Capabilities, Process, Work and About.
3. Portal and theme as utilities.
4. Start a conversation as the only filled action.

The theme control remains visible but subordinate to Portal and the primary CTA. Navigation labels are kept on one line.

### Mobile navigation

Mobile replaces the two desktop bands with a compact brand plate and explicit `Menu` control. The menu uses a native `<dialog>` sheet with:

- first focus on Capabilities,
- native focus trapping,
- Escape dismissal,
- explicit Close control,
- backdrop dismissal,
- focus restoration to Menu,
- 44px-or-larger touch targets,
- a numbered route ledger that communicates architecture rather than decoration.

The numbered links are the only ordinal device in the shell. The temporary review surface uses one Phase 2 label; future content pages should not inherit it as a decorative eyebrow pattern.

### Footer

The footer uses the Ft2 inline-rule principle. It keeps one identity region, a single wrapping link rail, and copyright. It does not create product/company/resources/legal columns, social placeholders, office claims or a competing CTA.

### Raster logo behavior

The approved WebP remains visually sound in light and dark headers when treated as a deliberate black plate. At the current header size it renders at 172×48 pixels from a complete optimized source. On mobile it renders at 132px wide and remains legible.

The black field is visibly stronger on light surfaces and nearly disappears into dark surfaces. This is acceptable for the current implementation because the wordmark itself stays unchanged and the plate acts as a stable brand boundary. A future transparent/vector source would allow more flexible spacing, but the current raster does not materially limit the Phase 2 shell.

Measured WCAG 2.1 contrast ratios for the rendered shell are:

| Pair                        |   Light |    Dark |
| --------------------------- | ------: | ------: |
| Body text / background      | 17.33:1 | 16.50:1 |
| Muted text / background     |  7.82:1 |  7.42:1 |
| Primary action text / fill  | 16.17:1 | 15.31:1 |
| Focus ring / background     | 16.75:1 | 16.50:1 |
| Focus ring / raised surface | 17.62:1 | 15.71:1 |

These measurements keep the accessibility treatment inside Brunova's neutral palette; no chromatic focus accent is justified.

### Focused Hallmark critique

```text
Philosophy  5/5 — the shell exposes identity, routes and utilities as distinct system boundaries
Hierarchy   5/5 — one primary CTA; Portal and theme remain subordinate
Execution   4/5 — desktop/mobile and light/dark are implemented and browser-tested
Specificity 5/5 — navigation, content counts, tracking events and source status are explicit
Restraint   5/5 — no generic icons, pill nav, glass, gradients, fake proof or excessive motion
Variety     4/5 — two-band desktop, compact mobile sheet and inline footer use different rhythms
```

No focused Phase 2 axis is below 3. The shell-scoped Hallmark review passes navigation/footer fingerprint, interaction, contrast, token discipline, honest-copy, responsive and mobile-safety checks. The final 58-gate completion audit remains deferred to Phase 8 because Phase 2 intentionally contains no final homepage or hero composition.

### Theme utility refinement

The approved pre-merge refinement replaces the visible `Theme` plus native-select treatment with a quiet three-choice text rail: `System`, `Light`, and `Dark`. Native radio inputs retain semantic grouping, arrow-key navigation, focus behavior and disabled loading state. The selected option receives a single neutral underline; the control has no surrounding pill, icon, chromatic accent or spatial animation.

This treatment reads as website chrome rather than an application settings field while preserving the existing `next-themes` persistence and prepaint behavior. In the mobile menu the three options distribute evenly across the utility width; in the desktop masthead they remain compact and subordinate to Portal and the primary CTA.

## Phase 3 homepage decisions

### Narrative macrostructure

The homepage keeps the approved Custom/Bespoke Architectural Narrative rather than rotating into a catalog macrostructure. This is an explicit continuity decision: Phase 3 completes the singular system promised by the Phase 0 direction and the Phase 2 shell. The sequence is recognition-led:

1. Brunova’s role and primary action.
2. Accumulating symptoms of an operation that no longer behaves as a system.
3. Operational Intelligence as the relationship between work, data and systems.
4. Five concrete capabilities.
5. The architecture-before-tools reframe.
6. Four anonymized system examples.
7. A four-stage process with optional entry points.
8. Three operating principles.
9. One closing action.

The existing N6-adapted masthead and Ft2 footer remain unchanged. Phase 4 route bodies are not represented or simulated on the homepage.

### Hero and semantic system visual

The hero is an asymmetric editorial/system split. Approved headline, support and two actions occupy the primary reading column. The adjacent Tier B inline SVG depicts four fragmented inputs crossing manual handoffs into a defined operating boundary containing process, trusted data, decisions and ownership; a controlled flow exits as reliable operations.

The diagram contains an accessible title and description and uses only semantic labels. It has no random nodes, network wallpaper, fake product interface or invented technical stack. At widths below 40rem, the spatial SVG is replaced—not merely scaled—by a four-step semantic sequence with readable labels. The full meaning is static; no information or visual state depends on animation.

### Section composition

- Problem recognition uses an offset fault ledger. Repetition communicates accumulation without eight icon cards.
- Operational Intelligence uses a relationship definition field, making it a systems perspective rather than a product or dashboard.
- Capabilities use a five-row architectural ledger with typed Phase 2 records.
- Architecture before tools uses the foreground/background inversion as the only major visual interruption. The six examination inputs remain plain structural rails, not pills.
- Selected Work uses four editorial rows and concise anonymized records; no metrics, clients, logos or testimonials were introduced.
- Process uses a progressively offset track plus an explicit optional-entry note, so Discovery is available but not mandatory.
- Differentiators are presented as operating principles in staggered ruled rows, not a generic “Why choose us?” grid.
- The final CTA contains one primary action.

### Responsive, theme and motion decisions

The hero becomes a single-column copy-first composition below the desktop breakpoint. The system visual switches to the mobile sequence below 40rem. Ledger rows simplify before they stack, long headings retain emergency wrapping, and interactive labels remain single-line. The 1280×800 desktop composition reserves the first viewport for the complete headline, substantial support and primary action while maintaining the two-band masthead.

Light and dark modes use the same composition. The architecture hinge is deliberately inverse in each mode: near-black on bone in light mode and bone on near-black in dark mode. A dedicated neutral inverse-muted token preserves readable secondary emphasis without introducing a chromatic accent.

Motion remains cut. Phase 3 adds no animation primitive, scroll observer or runtime dependency. Existing button/control feedback and reduced-motion behavior remain the only transitions.

### Phase 3 incremental Hallmark critique

```text
Philosophy  5/5 — recognition and operating-model logic determine the composition
Hierarchy   5/5 — eight buyer questions resolve in the approved order with one final action
Execution   4/5 — semantic desktop/mobile diagrams and varied ledgers are implemented and testable
Specificity 5/5 — exact copy, typed records and operational labels are Brunova-specific
Restraint   5/5 — neutral palette, no fake proof, no decorative motion, no generic product chrome
Variety     5/5 — sections change structure by responsibility without falling into card or bento repetition
```

No incremental axis is below 3. The explicit homepage anti-pattern scan covers centered/gradient heroes, meaningless abstracts, repeated cards, fake screenshots, glows, bento, icon-per-feature treatments, unnecessary pills, invented statistics, AI-powered marketing, fake proof, repeated centered sections and excessive rounding. None is intentionally present. The final Hallmark 58-gate completion audit remains Phase 8 work.

## Phase 4 core-route decisions

### Route Atlas structure

Phase 4 extends the Custom/Bespoke Architectural Narrative with a distinct internal-page system named **Route Atlas**. The theme, N6-adapted masthead and Ft2 footer remain unchanged by explicit continuity decision; each route body instead adopts the reading model required by its content.

- `/capabilities` uses an interlocking capability field: a compact responsibility map anchors five asymmetric deep-dive spreads. Capabilities are connected parts of a system, not isolated service cards.
- `/process` uses a transfer map. Lateral entry appears before the four ordinal stages, and each stage exposes entry knowledge, the problem resolved, established conditions and the likely next state.
- `/work` uses an editorial folio: one dominant selected system establishes the portfolio, with three supporting records arranged at different scales and offsets.
- `/work/[slug]` uses a technical dossier: a restrained section index, conservative narrative, a semantic system flow, engineering decisions, defensible safeguards where available, capability relationships and related work.
- `/about` uses a company thesis: the approved observation and boundary statements carry the first composition, followed by the founder-led/team-based operating model and three Brunova principles.
- `/portal` uses a sparse access threshold. It contains no login chrome or fake account state.
- `/privacy` uses a long-document composition with a reading index and factual sections.
- `/contact` is a controlled, noindex unavailable state only. It prevents a dead route while leaving all form and API behavior to Phase 5.

No internal page copies the homepage’s ledger macrostructure. Repetition remains only where the information is genuinely ordinal or record-based.

### Work-detail publication boundary

The four public dossiers use only the titles, summaries, capability signals and system relationships already approved in source material. Every flow step is a direct restatement of those facts. The content model supports optional scaling constraints and safeguards; absent sections are omitted rather than populated with generic or invented prose.

No client names, logos, infrastructure identifiers, URLs, credentials, employment relationships, pricing, metrics or testimonials were introduced. Publication-reviewed detailed outcomes remain a future content task.

### Metadata and route states

All Phase 4 routes have typed title, description, canonical, Open Graph and Twitter summary metadata. Work-detail metadata comes from typed work records. The portal placeholder and contact availability route are `noindex`; the portal can expose one controlled HTTP(S) external action when `PORTAL_URL` exists.

The privacy model carries `legal-human-review-required-before-production` as a source-only review marker. The public page makes no jurisdictional compliance claim and documents the current no-op analytics adapter, absence of analytics cookies and advertising trackers, sessionStorage attribution behavior, and the planned server-to-n8n contact boundary.

### Responsive and accessibility behavior

The routes recompose at content-driven breakpoints rather than simply stacking desktop columns. Capability spreads collapse into ordered reading groups; process identity and stage questions move into one continuous mobile narrative; case-system flows replace horizontal arrows with vertical progression; About preserves complete-word display wrapping; Portal stays a single deliberate boundary; Privacy keeps a readable measure.

System-flow figures use a visible `figcaption` and semantic ordered list, so no architectural meaning depends on visual arrows. Focus remains neutral and immediate. Motion remains cut.

### Phase 4 incremental Hallmark critique

```text
Philosophy  5/5 — every route composition follows its operational reading job
Hierarchy   5/5 — page-level intent, evidence and next actions remain explicit
Execution   4/5 — static routes, typed records, responsive flows and metadata are browser-tested
Specificity 5/5 — capability, process, work and privacy copy remain Brunova-specific
Restraint   5/5 — no fabricated proof, fake interfaces, service-card grid or decorative motion
Variety     5/5 — seven route bodies use distinct fingerprints inside one design system
```

No incremental axis is below 3. The Phase 4 scan covers repeated page structures, duplicated homepage ledgers, generic service cards, fabricated case-study detail, badges, pills, excessive centering, gradients, glows, icon grids, unsupported metrics and clickable-label overflow. The final 58-gate completion audit remains intentionally deferred to Phase 8.
