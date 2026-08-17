# Brunova Website v1 — Design Direction

**Status:** Phase 2 shell implemented for review. Homepage composition remains subject to Phase 3 approval.

## Hallmark decision

```text
Hallmark route: Custom / Bespoke
Macrostructure: Architectural Narrative
Vibe: architectural restraint, warm bone, operational precision
Genre influence: modern-minimal, without its floating-pill or generic SaaS defaults
Motion stance: motion-cut
Enrichment: semantic system-boundary diagram, deferred to Phase 3
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

No score is below 3. Re-score after the full page exists.

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
