# Product

## Register

product

## Users

Three real roles, all Algerian:

- **Students** browsing for a private tutor, a group course, a live event, or an on-demand track. Often on mobile at night after school/work; sometimes on desktop for longer research and comparison. Job: find a trustworthy teacher for a specific subject (bac prep, IELTS, guitare, dev, math), compare prices and availability, book a session, and pay safely.
- **Teachers** running a small teaching practice. On desktop when publishing courses and managing revenue; on mobile for messages, incoming requests, and calendar. Job: publish clear listings, get discovered, accept the right requests, hold sessions, get paid.
- **Studios / small agencies** (deferred — visible in the type system, folded into a teacher tab for now). A studio owner who runs a shared roster of teachers under one brand.

Context of use: pre-traction marketplace. Every screen must earn trust without leaning on fake reviews, fake counts, or "trusted by" logos. French UI (AR pending). Wilayas across Algeria. Prices in DA with a thin space (`12 000 DA`), tabular figures everywhere.

## Product Purpose

Darso is an education marketplace where students book teachers, courses and live events. It exists because Algeria has a large private-tutoring market that runs on WhatsApp and word-of-mouth — opaque prices, no verified identity, no dispute recourse, no receipt. Darso replaces that with a listing + booking + escrow layer.

Success looks like: a student can find a teacher in a subject / wilaya they care about, see a real price and a real availability window, book, message, and pay safely; a teacher can publish, get discovered, and get paid without inventing a website. The visible mechanics — verified profiles, funds held until session confirmed, dispute arbitration, progressive revenue-share — are the product, not marketing garnish.

## Brand Personality

Three words: **professional, precise, trustworthy.**

Voice: direct, warm, formal (`vous`). Marketplace-grade, not startup-cute. Never marketing-flowery. Never "révolutionnaire" / "10x" / "leader du marché" / "communauté grandissante." Voice is Upwork-precise applied to Algerian education: specific verbs, tabular numbers, hairline dividers, real content.

Emotional goals: a student should feel *in control* (I can see what I'm paying for, when it happens, and what happens if it doesn't). A teacher should feel *taken seriously* (this is where I run my practice, not a hobby side-hustle). Both should feel Darso earned the transaction, rather than performing modernity.

## Anti-references

Explicit, from `design-system/MASTER.md` §15 — kept here so future work sees the same list:

- No purple → pink → blue gradient hero orbs. Solid `--primary` panel with a single accent SVG only.
- No centered narrow marketing pages with 5 identical alternating sections. Use asymmetry, edge-bleed carousels, variable column counts per section.
- No emoji-as-icons. Lucide only, 1.75px stroke, consistent 16 / 18 / 20 / 24 sizes.
- No glowing gradient CTA buttons. Flat `--accent`, darkening on hover.
- No stock photos of diverse teams pointing at laptops. Line-art SVGs, geometric brand illustrations, or abstract shapes; real people only with consent when we have them.
- No `shadow-2xl` and 24px+ radii. Radius cap 12, shadow cap `e3` for sticky rails.
- No fake activity feeds, no fake counters, no fake testimonials, no grayscale "trusted by" logo bar. Pre-traction — replace with a founders note or omit.
- No rainbow-tinted glassmorphism. Flat surfaces, real hairlines, real elevation.
- No same-radius same-color cards stacked identically all the way down a page. Vary density across sections; mix carousel / grid / banner.

Additional aesthetic anti-references (industry-adjacent): Coursera / Udemy pastel course-card grids; Preply's rating-heavy teacher cards that lean on inflated star averages; the Duolingo mascot / gamified glow band. Darso is closer to Upwork applied to Algerian tutoring: dense but calm, information-rich, no cartoon.

## Design Principles

1. **Earn every claim.** Ratings show only when reviewCount ≥ 1. Revenue charts render only with ≥ 2 real data points. Counts derive from real mock data, never from decoration. Empty states are honest and actionable, never sad-face illustrations.
2. **Marketplace precision beats decoration.** Hairline dividers, tabular numbers, tight radii, restrained ink-tinted shadows. Every visual accent is Darso committing to a fact (`--accent` on the active step, on the CTA, on the focus ring); it isn't sprinkled.
3. **Mobile is a design, not a scale-down.** Marketing carousels, filter bottom sheet, sticky booking CTA with safe-area padding, bottom tab bar for authenticated shells. Rethink per surface — never stack 6 category tiles vertically.
4. **The verb is the interface.** Verb + object on every button (`Réserver un cours`, `Publier ma demande`, `Confirmer le paiement`). No "OK", no "Envoyer" alone. If a button can't state what will happen, the flow is wrong.
5. **Trust is built with mechanics, not adjectives.** Escrow, verification, dispute arbitration are surfaced structurally: a chip on the profile, a step in checkout, a section on `/trust`. We describe what the product literally does; we don't ask users to trust because we said "world-class."

## Accessibility & Inclusion

- WCAG AA floor across the app. Body text ≥ 4.5:1 against its background (this is a known failure point in the existing UI — `--ink-3` on colored backgrounds, muted-gray on tinted surfaces — flagged for the audit / polish loop).
- Touch targets ≥ 44px on mobile (buttons currently `h-11` on mobile primary paths; kebab rows using `size="sm"` at 36px need review).
- Focus-visible ring on every interactive element via `--shadow-focus`. Tab order must match visual order.
- Escape closes every dialog. `aria-live=polite` for form errors and toasts.
- `prefers-reduced-motion: reduce` collapses grid stagger, live-dot pulse, marquee, and modal scale to opacity-only or none.
- French `lang="fr"` on `<html>`. Arabic (`ar`) messages exist; RTL is deferred but token names are RTL-safe (no `left` / `right` in structural utilities).
- Numeric formatting: `font-variant-numeric: tabular-nums` on prices, counts, timers, IDs. Thin space in DA prices.
- No colour-only state. Success / warning / danger always paired with an icon and text label.
- iOS input zoom lock: 16px minimum on form inputs.
