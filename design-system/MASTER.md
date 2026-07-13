# Darso — Design System (Master)

> Single source of truth. Every page reads from here first, then applies its `pages/{name}.md` overrides if any.

**Product:** Education marketplace — students book teachers / courses / events.
**Positioning:** Professional, trustworthy, marketplace-grade. Upwork-inspired precision.
**Locale:** French only.
**Stage:** Pre-traction — no fabricated stats, testimonials, or ratings anywhere.
**Platform:** Next.js 16, React 19, Tailwind v4, Radix, next-intl.
**Theme:** Light-only (tokens named so dark is additive later).

---

## 1 · Color tokens (locked)

Use semantic tokens in components. Never hard-code hex.

### Brand
| Token | Hex | Usage |
|---|---|---|
| `--primary` | `#1C1F26` | Charcoal — brand, primary buttons, headers, footer bg |
| `--primary-dark` | `#0D0F14` | Hover / pressed on primary |
| `--primary-foreground` | `#FFFFFF` | Text on primary |
| `--accent` | `#2F6FEB` | Electric blue — CTAs, links, focus, active state |
| `--accent-hover` | `#1E58C7` | Accent hover |
| `--accent-soft` | `#DCE7FC` | Selected chip, badge fill, hint background |
| `--accent-foreground` | `#FFFFFF` | Text on accent |

### Surfaces
| Token | Hex | Usage |
|---|---|---|
| `--background` | `#FFFFFF` | Page |
| `--surface` | `#F5F6F7` | Cards on tinted section, filter rail |
| `--surface-2` | `#EBEDEF` | Deeper wells, table headers, dropdown menu |
| `--card` | `#FFFFFF` | Card body |

### Ink (text)
| Token | Hex | Usage |
|---|---|---|
| `--ink` | `#0A0B0E` | Body, headings |
| `--ink-2` | `#2D3038` | Secondary text |
| `--ink-3` | `#6A6E78` | Meta, timestamps, helper text |

### Structure
| Token | Hex | Usage |
|---|---|---|
| `--border` | `#E2E4E7` | Hairlines, input border, card border |
| `--border-strong` | `#CDD0D5` | Hover border, filter chip active, table divider |
| `--input` | `#E2E4E7` | Input border (mirror of `--border`) |
| `--ring` | `#2F6FEB` | Focus ring color |
| `--ring-soft` | `rgba(47,111,235,0.22)` | Focus halo |

### State
| Token | Hex | Usage |
|---|---|---|
| `--success` | `#2E8B6B` | Confirmed, verified, paid |
| `--success-soft` | `#DDEDE3` | Success chip fill |
| `--warning` | `#D68A2C` | Pending, needs attention |
| `--warning-soft` | `#FBEAD1` | Warning chip fill |
| `--danger` | `#D3352E` | Errors, destructive |
| `--danger-soft` | `#FADEDC` | Danger chip fill |
| `--info` | `#3A76B8` | Neutral informational |
| `--info-soft` | `#D9E6F3` | Info chip fill |

### Utility
| Token | Value | Usage |
|---|---|---|
| `--grid-line` | `rgba(10,11,14,0.06)` | Bg grids |
| `--scrim` | `rgba(10,11,14,0.55)` | Modal scrim |
| `--overlay` | `rgba(10,11,14,0.04)` | Image overlay |

---

## 2 · Typography

**Family:** Inter (variable, subset `latin` + `latin-ext`).
**Loaded via:** `next/font/google` in root layout.
**Fallback:** `ui-sans-serif, system-ui, sans-serif`.

### Type scale (rem, mobile-safe base 16)

| Token | Size | Line height | Tracking | Weight | Usage |
|---|---|---|---|---|---|
| `text-display-1` | 3.5rem (56) | 1.05 | -0.02em | 700 | Homepage hero — desktop only |
| `text-display-2` | 2.75rem (44) | 1.08 | -0.02em | 700 | Homepage hero — mobile / section hero |
| `text-h1` | 2rem (32) | 1.15 | -0.015em | 700 | Page title |
| `text-h2` | 1.5rem (24) | 1.2 | -0.01em | 600 | Section title |
| `text-h3` | 1.25rem (20) | 1.25 | -0.005em | 600 | Card title, subsection |
| `text-h4` | 1.0625rem (17) | 1.3 | 0 | 600 | Card subtitle |
| `text-body` | 1rem (16) | 1.55 | 0 | 400 | Body |
| `text-body-sm` | 0.875rem (14) | 1.5 | 0 | 400 | Secondary body |
| `text-meta` | 0.8125rem (13) | 1.4 | 0.005em | 500 | Meta, chip, badge |
| `text-caption` | 0.75rem (12) | 1.35 | 0.01em | 500 | Timestamps, tiny labels |
| `text-eyebrow` | 0.75rem (12) | 1 | 0.08em | 600 | UPPERCASE section labels |

**Numeric:** always `font-variant-numeric: tabular-nums` for prices, counts, timers.
**Never** below 14px for body on mobile. 16px minimum on inputs (iOS zoom lock).

---

## 3 · Spacing scale (4/8 rhythm)

| Token | Value |
|---|---|
| `space-1` | 4px |
| `space-2` | 8px |
| `space-3` | 12px |
| `space-4` | 16px |
| `space-5` | 20px |
| `space-6` | 24px |
| `space-8` | 32px |
| `space-10` | 40px |
| `space-12` | 48px |
| `space-16` | 64px |
| `space-20` | 80px |
| `space-24` | 96px |

### Section rhythm

| Screen | Between sections | Within section |
|---|---|---|
| Mobile (<768) | 48px | 24px |
| Tablet (768-1023) | 64px | 32px |
| Desktop (≥1024) | 96px | 40px |

---

## 4 · Radius scale (Upwork-tight)

| Token | Value | Usage |
|---|---|---|
| `--radius-xs` | 4px | Buttons, badges |
| `--radius-sm` | 6px | Inputs, small chips |
| `--radius-md` | 8px | Small cards, dropdown items |
| `--radius-lg` | 10px | Large cards, sheets |
| `--radius-xl` | 12px | Modals, hero panels |
| `--radius-full` | 9999px | Pills, avatars |

---

## 5 · Elevation / shadows

Restrained, ink-tinted, not gray-black.

| Token | Value | Usage |
|---|---|---|
| `--shadow-e0` | `none` | Flat cards |
| `--shadow-e1` | `0 1px 2px 0 rgba(10,11,14,0.04)` | Base card |
| `--shadow-e2` | `0 4px 10px -2px rgba(10,11,14,0.05), 0 2px 4px -1px rgba(10,11,14,0.04)` | Hovered card, popover |
| `--shadow-e3` | `0 12px 32px -8px rgba(10,11,14,0.12), 0 6px 14px -4px rgba(10,11,14,0.06)` | Sticky rail, sheet |
| `--shadow-e4` | `0 24px 64px -16px rgba(10,11,14,0.20), 0 12px 24px -8px rgba(10,11,14,0.10)` | Modal, dialog |
| `--shadow-focus` | `0 0 0 3px var(--ring-soft), 0 0 0 1.5px var(--ring)` | Focus ring |

**Rule:** hover promotes cards from `e1` → `e2`, never `e3`. Bigger shadows = cheaper feel.

---

## 6 · Layout & grid

### Breakpoints (locked)
| Name | Range | Cols | Gutter | Margin |
|---|---|---|---|---|
| `xs` | <480px | 4 | 12px | 16px |
| `sm` | 480–767 | 4 | 16px | 20px |
| `md` | 768–1023 | 8 | 20px | 24px |
| `lg` | 1024–1279 | 12 | 24px | 32px |
| `xl` | 1280–1535 | 12 | 24px | 40px |
| `2xl` | ≥1536 | 12 | 24px | max content 1440 centered |

**Max content widths:**
- `container-tight`: 720px (long-form article)
- `container-narrow`: 960px (marketing content)
- `container-standard`: 1200px (app pages)
- `container-wide`: 1440px (marketing sections, dashboards)

### Mobile-first thinking (not just scale-down)

Mobile ≠ narrower desktop. Rethink per surface:
- **Marketing homepage:** vertical stack + **horizontal-scroll carousels** for categories, teachers, events, testimonials. Never stack 6 category tiles vertically.
- **Browse:** filter drawer (bottom sheet on mobile), sidebar on desktop. Card grid is 1-col mobile / 2-col md / 3-col lg / 4-col xl for dense list.
- **Profile:** hero → sticky bottom CTA on mobile. Desktop → sticky right rail with CTA + booking preview.
- **Dashboard:** bottom tab bar (5 max) on mobile ≥ subgroup drawer. Sidebar on desktop.
- **Booking checkout:** step indicator top on mobile, side stepper on desktop.

---

## 7 · Navigation patterns

### Mobile (≤767)
```
┌───────────────────────────┐
│  logo   [ search ]   ☰   │  ← 56px top bar, sticky
├───────────────────────────┤
│                           │
│         page              │
│                           │
├───────────────────────────┤
│  Explorer  Cours  Réservations  Messages  Profil  │  ← 64px bottom tab (5 items, icons+labels)
└───────────────────────────┘
```
- Bottom tab visible only for authenticated app surfaces (`/browse`, `/account`, `/messages`, `/calendar`).
- Public marketing surfaces use a hamburger drawer, not tabs.
- Bottom-safe-area padded via `pb-[max(env(safe-area-inset-bottom),16px)]`.

### Desktop (≥1024)
- Sticky top nav: logo · discover dropdown · become a teacher · sign in / sign up.
- Authenticated: logo · left sidebar (student or teacher shell) · user menu top-right.
- Never both top nav and side rail active for primary nav simultaneously.

### Nav states
- Active: `--accent` underline (top nav) or `--accent-soft` fill (side nav).
- Hover: `--ink` on inactive items (bump from `--ink-2`).
- Focus-visible: 3px `--ring-soft` halo.

---

## 8 · Marketing homepage anatomy (12 sections)

Vertical order on mobile. Desktop keeps the same order — pattern is mobile-native and scales up.

### 8.1 · Sticky top bar
Component: `<SiteHeader marketing />`. Logo left, `Devenir enseignant` (secondary link), `Se connecter` (ghost btn), `Créer un compte` (accent btn). Mobile: hamburger + logo + accent CTA only.

### 8.2 · Hero with functional search
Component: `<HomeHero />`.
- Headline (real, French, benefit-driven): _« Apprenez ce qui vous fait avancer, avec des enseignants qui s'engagent. »_
- Sub: _« Trouvez un cours particulier, un atelier ou un événement en direct — payé seulement une fois la séance validée. »_
- **Functional search bar**: `[ Que voulez-vous apprendre ? ]` autocomplete on real subjects, routes to `/browse?q=`.
- **Dual-path toggle** directly beneath: `[Je veux apprendre]` ↔ `[Je veux enseigner]`. Left routes to `/browse`, right to `/teach`.
- No hero image on mobile — text + search only. Desktop: geometric brand illustration (SVG, not stock photo) on the right, single-color line art on `--surface`.
- Data source: static copy + real subject autocomplete from `mock/subjects`.

### 8.3 · Popular categories carousel
Component: `<CategoryCarousel />`.
- **Mobile:** horizontal-scroll carousel, snap points, 2.5 cards visible.
- **Desktop:** 4-col grid, no scroll.
- Cards show: category name, icon (Lucide), count if real _(else "Nouveau" chip)_.
- Real data: `mock/categories` filtered to those with ≥1 teacher listed.

### 8.4 · How it works (3 numbered steps)
Component: `<HowItWorks />`.
- **Mobile:** vertical stepper with vertical connecting line.
- **Desktop:** 3-col horizontal row with number badges.
- Steps: (1) Cherchez un enseignant ou publiez une demande. (2) Comparez, discutez, réservez. (3) Payez en sécurité après validation.
- Static copy. Neutral icons (Lucide `Search`, `MessageSquare`, `ShieldCheck`).

### 8.5 · Trust & safety
Component: `<TrustSafety />`.
- Three columns (mobile: stack; desktop: 3-col grid).
- Real mechanisms only:
  - _Paiement sécurisé_ — funds held until session confirmed.
  - _Profils vérifiés_ — teacher identity check.
  - _Litiges arbitrés_ — dispute resolution flow.
- Each with icon + 1-line explanation, links to `/trust`.

### 8.6 · Featured teachers carousel
Component: `<FeaturedTeachers />`.
- **Mobile:** horizontal-scroll carousel, 1.2 cards visible.
- **Desktop:** 4-col grid, or 3-col if we prefer larger cards.
- Real data: admin-curated `featured=true` from `mock/teachers`. Falls back to _most recently published_ if none flagged.
- **If empty:** show honest early-stage banner instead — _« Nous accueillons nos premiers enseignants. Vous voulez être parmi eux ? »_ → CTA to `/teach`.

### 8.7 · Popular subjects grid
Component: `<SubjectGrid />`.
- Grid of subject chips + brief metrics IF real (else just the chip).
- **Mobile:** 2-col grid, chip-style tiles.
- **Desktop:** 4-col grid, richer tiles.
- Real data: `mock/subjects` where listing count > 0.

### 8.8 · Upcoming events / live sessions
Component: `<UpcomingEventsStrip />`.
- **Mobile:** horizontal scroll, 1.1 cards visible.
- **Desktop:** 3-col grid.
- Real data: `mock/events` filtered `startsAt > now` limit 6.
- **Empty state:** _« Aucun événement en direct programmé. Consultez à nouveau bientôt — ou proposez-en un si vous enseignez. »_ CTA: `/teach/events/new`.

### 8.9 · For teachers — earn by teaching (CTA band)
Component: `<TeachCtaBand />`.
- Full-width dark band using `--primary` bg + `--accent` CTA.
- Copy: _« Vous enseignez ? Publiez vos cours et gérez vos réservations. »_
- Bullets (real mechanics): commission progressive, paiement sécurisé, tableau de bord.
- CTA: `Devenir enseignant` → `/teach`.

### 8.10 · Real testimonials (conditional)
Component: `<Testimonials />`.
- Render only if real testimonials exist in `mock/testimonials` (source: real reviews with `showOnHomepage=true` consent).
- **Empty state (default for now):** replace section with `<FoundersNote />` — one honest paragraph, signed by platform team, on why we built Darso and what we're committed to. No fake quotes.

### 8.11 · FAQ
Component: `<HomeFaq />`.
- 6 Q&As, Radix Accordion, real answers (payment, refunds, verification, dispute, teacher payout, mobile app).
- Static copy.

### 8.12 · Footer
Component: `<SiteFooter />`.
- 4-column on desktop / stacked collapsibles on mobile.
- Cols: Discovery (Browse, Categories, Live, Events) · Company (About, Careers, Press, Blog) · Support (Help, Contact, Trust) · Legal (Terms, Privacy, Cookies).
- Sub-row: language (single lang for now, no switcher), copyright.

---

## 9 · Card anatomy

### Teacher card
```
┌──────────────────────────────┐
│ ▲ avatar 56×56   ●status     │
│                              │
│ Nom Enseignant  [✓ Vérifié]  │  ← name + verified badge (if real verified)
│ Subject · Ville               │
│                              │
│ « Une ligne d'intro… »        │  ← 2-line clamp bio pull
│                              │
│ ─────────────────────────    │
│ 1 200 DA / h        [→ Voir] │  ← price left, arrow-link right
└──────────────────────────────┘
```
- **Densities:** `compact` (48h avatar, 1-line bio, browse grids), `standard` (56h avatar, 2-line bio, homepage), `feature` (72h avatar + banner strip + 3-line bio).
- **Rating:** rendered ONLY when reviewCount > 0. Format: `★ 4.8 · 24 avis` tabular-nums.
- **New teacher badge:** `[Nouveau]` chip when reviewCount === 0.
- **Availability chip:** _« Disponible cette semaine »_ if any free slot in next 7 days — real computation.

### Course card
```
┌──────────────────────────────┐
│ ┌────── cover 16:9 ──────┐   │
│ │                         │   │
│ └──────────────────────────┘   │
│ [Groupe · 6 places]           │  ← format + capacity badge
│ Titre du cours                │  ← 2-line clamp
│ par Nom Enseignant            │
│                              │
│ 📅 8 séances · Sam 10h        │  ← schedule real if scheduled
│ 12 000 DA          [S'inscr.] │
└──────────────────────────────┘
```

### Event card
```
┌──────────────────────────────┐
│ ┌── date badge ┐              │
│ │  SAM  12    │ live indicator│  ← live pulse if within 2h
│ │  JUIN       │               │
│ └─────────────┘               │
│ Titre événement (2 lignes)    │
│ Nom animateur                 │
│                              │
│ 18h30 · 90 min · En ligne     │
│ Gratuit           [Réserver]  │
└──────────────────────────────┘
```

**Card rules:**
- All cards use `border` + `shadow-e1`. Hover → `shadow-e2` + accent border promotion (`border-strong`), no translate.
- Focus-visible reveals full ring across the whole card.
- Tap target: whole card is `role=link` (Next `Link` wrapping); inner button (CTA) has `stopPropagation` + independent focus.
- No image = show first-letter monogram avatar with subject color (deterministic hash).

---

## 10 · Filter/sort UX

### Desktop (≥lg)
Left sidebar 264px sticky. Filters:
- Search inline at top (kept from hero).
- Filter groups collapsible: `Sujet`, `Prix`, `Format` (1-1, groupe, événement, en direct), `Disponibilité`, `Ville / En ligne`, `Note` (only shows when reviews exist), `Langue de l'enseignant`.
- Active filter chips render horizontally above the results grid, `× Effacer tout` at the end.

### Mobile
- Sticky top bar under nav: `[Trier: Pertinence ▾] [Filtres · 3]` (badge on filter button = active count).
- Tap `Filtres` → bottom sheet (Radix Dialog styled full-height sheet), scroll-locked, sticky footer with `Effacer` + `Voir 128 résultats` accent CTA.
- Same filter groups as desktop, rendered as accordions.

### Empty results
_« Aucun résultat pour vos filtres. »_
- `Effacer les filtres` (accent link) — resets state.
- `Publier une demande` (secondary) → routes to request wizard.

---

## 11 · Profile page (teacher / course / event)

### Desktop layout
```
┌───────────────────────────────────────────────────────────┐
│  Breadcrumb: Explorer › Mathématiques › Prof. Untel        │
├───────────────────────────────────────────────────────────┤
│ ┌────────────────────────────┐ ┌────────────────────────┐ │
│ │ Hero: avatar, name, badges │ │ Sticky rail:            │ │
│ │ price, headline, chips     │ │ price · CTA · rating    │ │
│ ├────────────────────────────┤ │ availability preview    │ │
│ │ Tabs: À propos · Cours ·   │ │ [Réserver un cours]     │ │
│ │       Disponibilité · Avis │ │ [Envoyer un message]    │ │
│ │                            │ │                         │ │
│ │ Long-form content          │ │                         │ │
│ └────────────────────────────┘ └────────────────────────┘ │
└───────────────────────────────────────────────────────────┘
```

### Mobile layout
```
┌───────────────────────────┐
│ ← back                    │
├───────────────────────────┤
│ avatar + name             │
│ badges                    │
│ headline                  │
├───────────────────────────┤
│ Chips row (horizontal)    │ ← subject, city, langue
├───────────────────────────┤
│ Tab bar: À propos · Cours │ ← sticky under top
│         · Dispo · Avis    │
├───────────────────────────┤
│ (tab content)             │
│  …                        │
│  …                        │
├───────────────────────────┤
│ Sticky bottom CTA:         │
│ Prix   [ Réserver un cours ]│ ← 64px, elevated, safe-area
└───────────────────────────┘
```

**Rules:**
- Sticky bottom CTA on mobile shows price + primary action only. Secondary (`Message`) accessible via kebab on that bar.
- Ratings summary only appears when reviewCount ≥ 1. Otherwise show `Nouveau sur Darso` chip.
- Reviews tab shows real reviews or an empty state — `« Ce profil n'a pas encore de retours. Soyez le premier à réserver et à donner votre avis. »`

---

## 12 · Booking / checkout — step indicator

Four steps, mirroring the actual mock flow:

1. **Détails** — session type, date, duration.
2. **Confirmation** — recap + terms.
3. **Paiement** — mock payment method select.
4. **Confirmé** — receipt view.

### Desktop
Left column: numbered vertical stepper (280px), active step accent underline. Right column: form.

### Mobile
Top: horizontal step dots + label of current step (`Étape 2 sur 4 · Confirmation`). Progress bar 4px `--surface-2` with `--accent` fill.

### Buttons
- Primary: `Continuer` accent, sticky bottom on mobile, in-content on desktop.
- Back: ghost, always visible.
- Never trap user in a step — every step has a visible back path.

### Post-booking
- Confirmed state shows: booking ID (tabular-nums), what happens next (3 lines), CTAs: `Voir dans le calendrier`, `Envoyer un message à l'enseignant`.

---

## 13 · Dashboards

### Student dashboard (`/account`)
Nav pattern:
- Mobile: bottom tab (Explorer · Cours · Réservations · Messages · Profil).
- Desktop: left sidebar 240px (Tableau de bord, Réservations, Messages, Litiges, Favoris, Paiements, Paramètres).

Content scaffold:
- **Home / Overview**: hero greeting (`Bonjour, {prénom}.`), 3 stat cards (Réservations à venir · Cours actifs · Messages non lus), upcoming sessions list, recent messages preview.
- **Empty state** for new users: `« Aucune réservation pour le moment. Explorez nos enseignants pour trouver votre premier cours. »` + primary CTA `Explorer`.

### Teacher dashboard (`/teach`)
Nav pattern: same as student but sidebar items = Tableau de bord, Cours, Événements, Réservations, Messages, Disponibilité, Revenus, Paramètres.

Content scaffold:
- **Overview**: revenue this month (tabular-nums, `0 DA` if none), pending bookings, recent messages, quick actions (`Nouveau cours`, `Nouvel événement`, `Bloquer un créneau`).
- **Empty state** for zero revenue: `« Vos revenus apparaîtront ici dès votre premier cours confirmé. »` no fake chart bars.
- Charts render only when ≥ 2 data points. Below that: numbered summary + guidance.

---

## 14 · Microcopy — French tone

- **Voice:** direct, warm, professional. Never marketing-flowery.
- **Verb-first CTAs**, never "Envoyer" alone → `Envoyer la demande`, `Réserver un cours`, `Publier ma demande`, `Confirmer le paiement`.
- **Empty states:** always factual + actionable. Never guilt-based ("Oups!") or emoji.
- **Errors:** cause + fix. `« Impossible de charger les enseignants. Vérifiez votre connexion et réessayez. »` not `« Erreur »`.
- **Success:** brief + specific. `« Réservation confirmée. »` not `« Succès ! »`.
- **Numbers:** always tabular. Format DA prices with thin space: `12 000 DA`.
- **Dates:** French locale short form: `sam. 12 juin · 18h30`.
- **Tu vs vous:** use **vous** everywhere (marketplace, formal). One exception: teacher-facing dashboard onboarding may use `tu` if it explicitly reads more human — decision per-page not global.
- **Never**: "AI-generated", "révolutionnaire", "10x", "leader du marché", "communauté grandissante" (unearned).

---

## 15 · Anti-generic-AI-aesthetic patterns to bake in

Signals of AI-default design that we must **avoid**:

1. **Purple-pink gradient hero orbs.** No. Solid `--primary` panel with single accent line-art SVG only.
2. **Center-aligned narrow marketing pages with 5 identical alternating sections.** No. Use asymmetric layouts, edge-bleed carousels, variable column counts per section.
3. **Emoji as icons.** Banned. Lucide-react only, 1.75px stroke, consistent 16 / 18 / 20 / 24 sizes.
4. **Big glowing gradient CTA buttons.** No. Flat `--accent` solid, no glow. Hover = darkening only.
5. **Stock photos of diverse teams pointing at laptops.** Banned. Custom line-art SVGs, geometric brand illustrations, or abstract shapes only. If we need photography later, real people (real teachers) with consent, never stock.
6. **`shadow-2xl` and 24px+ radii everywhere.** No. Upwork-tight radius (max 12), max shadow `e3` for sticky rails.
7. **Fake activity feeds ("Ahmed just booked!").** Banned per hard constraints.
8. **Testimonial slider with random 5-star ratings.** Banned per hard constraints. See Section 8.10 fallback.
9. **"Trusted by" bar with grayscale logos we don't have.** Banned. Omit or replace with founder note.
10. **Auto-flipping numeric counters ("500+ students!").** Banned unless real. If real: static tabular number, no animation.
11. **Rainbow-tinted glassmorphism blurred backgrounds.** No. Flat surfaces, real hairlines, real elevation.
12. **Same-radius same-color cards stacked identically down the page.** No. Vary card density between sections (compact vs feature), and mix carousel vs grid vs banner.

**Delight comes from:**
- Precise micro-interactions (hover elevation, focus rings, chip snap-in).
- Real content (real teacher intros, real schedules, real subjects).
- Consistent typographic rhythm (tabular numbers, hairline dividers, generous line-height).
- Editorial accents used sparingly: an accent-color underline, an inline chip, a well-placed dividing rule.

---

## 16 · Motion

Duration tokens:
- `--motion-fast`: 120ms
- `--motion-base`: 180ms
- `--motion-slow`: 240ms

Easing:
- `--ease-out`: `cubic-bezier(0.16, 1, 0.3, 1)` (Apple-style)
- `--ease-in-out`: `cubic-bezier(0.65, 0, 0.35, 1)`

Rules:
- Hover: 120ms `--ease-out`.
- Card enter (grid stagger): 180ms with 40ms per item stagger, max 6 items animated.
- Modal open: 200ms scale+fade from trigger direction.
- Sheet open: 240ms slide.
- Always honor `prefers-reduced-motion: reduce` — collapse to opacity-only 60ms.

---

## 17 · Iconography

- Library: **lucide-react** only.
- Sizes: 16 (inline), 18 (button-md), 20 (button-lg / nav), 24 (hero).
- Stroke: 1.75 default. 2 for hero-scale.
- Always paired with text label in nav and buttons. Icon-only allowed only with aria-label.

---

## 18 · Accessibility floor

- All text ≥ 4.5:1 vs surface. `--ink-3` on `--surface` verified (7.6:1).
- Focus ring visible on every interactive element via `--shadow-focus`.
- Touch targets ≥44px (button-md is 40 — we bump to 44 on mobile via `h-11`).
- Tab order matches visual order — enforce with logical DOM.
- Escape closes every dialog. `aria-live=polite` for form errors and toasts.
- Reduced motion collapses grid stagger and modal scale.
- French `lang="fr"` on `<html>`, no lang switch UI for now.

---

## 19 · Component variants matrix (locked)

| Component | Variants | Sizes |
|---|---|---|
| Button | primary, accent, secondary, ghost, link, danger, success, outline | sm 36 · md 40 · lg 48 · xl 56 |
| Badge | default, primary, accent, success, warning, danger, info, solid, outline, new | one size (h-6) |
| Card | flat, elevated, interactive | compact, standard, feature |
| Input | default, error, success | sm 36 · md 44 · lg 52 |
| Chip | default, active, removable | one size (h-8) |

---

## 20 · What each page-specific file overrides

Page files in `design-system/pages/` may override:
- Section rhythm.
- Card density defaults.
- Motion budget.
- CTA hierarchy.

Page files may NOT override:
- Color tokens.
- Radius scale.
- Typography scale.
- Iconography rules.
