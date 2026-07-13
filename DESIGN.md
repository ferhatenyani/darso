# Design

The visual system lives in [`design-system/MASTER.md`](./design-system/MASTER.md). Impeccable and any downstream work should read that file as the DESIGN.md canonical source; it uses a per-section format compatible with the Stitch DESIGN.md shape.

## Pointer summary

- **§1 Color tokens** — Brand (charcoal `#1C1F26` primary, electric blue `#2F6FEB` accent), surface / ink / structure / state families, all locked hex values. Light-only, tokens named so dark is additive.
- **§2 Typography** — Inter variable (locked; user-confirmed we keep Inter and skip the "default AI Inter" flag), 11-step scale from display-1 (56/1.05/-0.02em/700) to eyebrow (12/1/0.08em/600).
- **§3 Spacing** — 4/8 rhythm, `space-1` (4) → `space-24` (96), with responsive section rhythm (48 mobile / 64 tablet / 96 desktop between sections).
- **§4 Radius** — Upwork-tight: `xs` 4 → `xl` 12 → `full`. Max radius 12 for real surfaces; `2xl` (16) reserved for edge cases only.
- **§5 Elevation** — `e0` (flat) → `e4` (modal). Ink-tinted shadows, no gray-black. Hover promotes `e1 → e2` only.
- **§6 Layout & grid** — 6-breakpoint system (xs / sm / md / lg / xl / 2xl) with 4/8/12-col ranges; `container-{tight,narrow,standard,wide}` (720 / 960 / 1200 / 1440).
- **§7 Nav patterns** — Mobile: 56px sticky top + 64px bottom tab (authenticated only). Desktop: sticky top nav or app shell sidebar, never both.
- **§8 Marketing homepage anatomy** — 10 real sections in a fixed order (see [src/app/[locale]/page.tsx](src/app/[locale]/page.tsx)).
- **§9 Card anatomy** — Teacher / Course / Event card specs, densities (compact / standard / feature), rating-visible-when-real rule.
- **§10 Filter/sort UX** — Desktop sidebar 264px sticky; mobile bottom sheet.
- **§11 Profile page**, **§12 Booking / checkout**, **§13 Dashboards** — layout specs per surface.
- **§14 Microcopy** — French tone rules, `vous` default, verb + object CTAs, tabular numbers.
- **§15 Anti-generic-AI-aesthetic** — 12 explicit bans (mirrors [`PRODUCT.md`](./PRODUCT.md) Anti-references).
- **§16 Motion** — `--motion-fast` 120ms → `--motion-slow` 240ms, `--ease-out` cubic-bezier(0.16, 1, 0.3, 1), reduced-motion collapses to opacity-only 60ms.
- **§17 Iconography** — lucide-react only, 1.75 stroke, size ramp 16 / 18 / 20 / 24.
- **§18 Accessibility floor** — WCAG AA, `≥44px` touch targets, focus ring, tab order enforced.
- **§19 Component variants matrix** — Button (8 variants × 4 sizes), Badge, Card, Input, Chip.
- **§20 Override boundary** — Page-specific files may override rhythm / density / motion / CTA hierarchy; may not override color / radius / type scale / iconography.

## Token layer

CSS tokens live in [`src/app/globals.css`](src/app/globals.css) under `@theme inline { … }`, mirroring the MASTER.md tables. Reach for tokens; never hard-code hex.

## Component library

Radix primitives + shadcn-style wrappers in [`src/components/ui/`](src/components/ui/). Marketing components in [`src/components/marketing/`](src/components/marketing/). App shells: student in [`src/components/student/`](src/components/student/), teacher in [`src/components/teacher/`](src/components/teacher/), shared app UI in [`src/components/app/`](src/components/app/).
