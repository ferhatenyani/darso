# Design Direction — Darso v2 (projectone-inspired)

Reference: [projectone.website](https://www.projectone.website/) — captured 2026-08-28, screenshots at `c:\tmp\dribbble-scout\shots-projectone\`.

This is a proposed new visual direction for the Darso marketing surfaces (landing page and future adjacent pages). It replaces the current charcoal + electric-blue system on `design-system/MASTER.md` §1 for marketing pages only — product UI (app shells, dashboards, checkout) inherits the same tokens where relevant but stays density-precise.

**Nothing in this document is implemented yet. Approve tokens first, then anatomy, then we ship.**

---

## 1 · Committed decisions (from Q&A, 2026-08-28)

| # | Question | Decision |
|---|---|---|
| 1 | Background | Warm cream (like projectone) |
| 2 | Accent color | Acid lime-green (like projectone) |
| 3 | Typography direction | Heavier display + Inter body |
| 4 | Specific display font | General Sans (free, Fontshare) |
| 5 | Button radius | 12px rounded rectangle |
| 6 | Button icon | Attached dark circle with arrow on the right |
| 7 | Section framing | Each section is a large rounded card container |
| 8 | Density | Spacious (like projectone) |
| 9 | Personality | Selective — tilted "polaroid" hero cards + occasional handwritten annotations |

---

## 2 · Proposed tokens — approve or tweak

### 2.1 · Color

```
--bg              #F2F1EB   warm cream body background
--surface         #FFFFFF   card / section-tile interior
--surface-2       #ECEBE4   subtle recess (inputs, muted rows)

--ink             #0A0B0E   headlines, primary text
--ink-2           #2D3038   secondary text
--ink-3           #6A6E78   meta, captions, placeholders

--accent          #C5F82A   acid lime-green — the ONE loud accent
--accent-ink      #0A0B0E   text on lime (must be dark for contrast)
--accent-soft     #E9FBAF   very light lime for tinted backgrounds (used sparingly)

--dark-panel      #0A0B0E   near-black used for inverted sections and CTA fills
--dark-panel-ink  #FFFFFF   text on dark panels

--border          #DDDCD4   hairline on cream
--border-strong   #C6C4B8   stronger hairline for card containers on cream
--input-border    #C6C4B8   form field borders
```

**Anti-choices (deliberate rejections):**
- No electric blue anywhere on marketing pages. Blue is retired from this surface. Product UI can still use it for structural trust moments (booking confirmations, verified badges).
- No gradients. Lime is used flat.
- No second bright accent. Lime alone carries all attention.

### 2.2 · Typography

```
--font-display    "General Sans", ui-sans-serif, system-ui, sans-serif
--font-body       "Inter", ui-sans-serif, system-ui, sans-serif
```

- **General Sans** loaded from Fontshare (free commercial license). Weights needed: 500 (Medium), 600 (Semibold), 700 (Bold). Self-host via `@font-face` in `globals.css` for performance.
- **Cabinet Grotesk** is retired from marketing surfaces. Files stay in `public/fonts/` for now in case any legacy screen still uses it.
- Inter body stays as-is.

**Display scale (spacious):**

| Token | Size (desktop) | Size (mobile) | Weight | Line | Tracking |
|---|---|---|---|---|---|
| display-hero  | 88 px | 52 px | 700 | 0.95 | -0.035em |
| display-1     | 64 px | 40 px | 700 | 1.02 | -0.030em |
| display-2     | 48 px | 34 px | 700 | 1.05 | -0.025em |
| display-3     | 36 px | 28 px | 600 | 1.10 | -0.020em |
| headline      | 22 px | 20 px | 600 | 1.25 | -0.015em |
| body-lg       | 18 px | 17 px | 400 | 1.55 | 0        |
| body          | 16 px | 15 px | 400 | 1.55 | 0        |
| meta          | 13 px | 13 px | 500 | 1.4  | 0.01em   |

`text-wrap: balance` on all display sizes.

### 2.3 · Radius

```
--radius-xs       4px    tiny (chips, inline pills only)
--radius-sm       8px    inputs, small badges
--radius-md       12px   BUTTONS (locked, projectone-match)
--radius-lg       16px   small cards, inline panels
--radius-xl       24px   card containers inside sections
--radius-2xl      32px   SECTION-LEVEL rounded containers (locked)
```

### 2.4 · Elevation

```
--shadow-e0   none
--shadow-e1   0 1px 2px rgba(10,11,14,0.05)
--shadow-e2   0 6px 16px -4px rgba(10,11,14,0.08), 0 2px 4px rgba(10,11,14,0.04)
--shadow-e3   0 18px 40px -12px rgba(10,11,14,0.12), 0 8px 16px -6px rgba(10,11,14,0.06)
```

Section-level rounded containers use `e2` on cream. Dark inverted sections use `e0` (no shadow, contrast alone).

### 2.5 · Spacing (spacious rhythm)

Section vertical rhythm (between adjacent sections):
- Mobile: 80 px
- Tablet: 112 px
- Desktop: 160 px

Section container internal padding:
- Mobile: `px-6 py-16` (24 / 64)
- Tablet: `px-10 py-24` (40 / 96)
- Desktop: `px-16 py-32` (64 / 128)

### 2.6 · Motion

Unchanged from current system: `--motion-fast: 120ms`, `--motion-slow: 240ms`, `--ease-out: cubic-bezier(0.16, 1, 0.3, 1)`. Reduced-motion collapses to opacity-only 60ms.

---

## 3 · Interaction anatomy

### 3.1 · Primary CTA (the signature button)

```
┌─────────────────────────────────────┐
│  Réserver un cours          ● →     │
└─────────────────────────────────────┘
   ^ lime bg,       ^ dark circle w/ arrow
     dark text        (attached at right,
     700 weight       inside the button)
     radius 12px
```

- Height: 56px desktop, 52px mobile
- Padding: 24px left, 8px right (circle sits inside the right padding)
- Circle: 40px diameter, `--dark-panel` fill, white arrow (`ArrowUpRight` at 16px, stroke 2.2)
- Hover: lime shifts to a slightly deeper lime (`#B5E520`), circle stays. 150ms.
- Focus: `--shadow-focus` ring outside the button.

### 3.2 · Secondary CTA

- Same shape and dimensions as primary
- Fill: `--dark-panel`, text white
- Circle at right: white background, dark arrow (inverted)
- Used for the second CTA in dual-CTA blocks ("View pricing", "Voir la commission")

### 3.3 · Section container

Every marketing section renders as a rounded tile:

```
┌────────────────────────────────────────────────┐  <- 32px radius container
│                                                │     bg: white OR ink-dark OR lime
│    Content lives inside                        │     shadow: e2 (on light bg)
│                                                │
└────────────────────────────────────────────────┘
     ↕ 160px (desktop) gap of cream visible
┌────────────────────────────────────────────────┐
│    Next section                                │
└────────────────────────────────────────────────┘
```

Container background rotates section-to-section for rhythm:
- Light tile: `--surface` (#FFFFFF)
- Dark tile: `--dark-panel` (near-black)
- Lime tile: `--accent` (used sparingly — FAQ or one high-emphasis section, matches projectone's FAQ)

No section spans edge-to-edge. Cream body always visible between tiles.

---

## 4 · Personality rules

### 4.1 · Tilted "polaroid" hero cards — WHERE allowed
- Homepage hero ONLY. Three or four teacher/session cards tilted at ±2° to ±6° around the central hero copy.
- Each card is a real product surface (a teacher profile snippet or a session card), not decorative imagery.
- Never on other sections. Never on internal pages.

### 4.2 · Handwritten annotations — WHERE allowed
- Maximum TWO annotations across the entire homepage.
- Reserved for trust-mechanic call-outs (e.g. "→ fonds bloqués" pointing at the payment field on the hero card, or "← payé sous 48 h" pointing at the payout chip).
- SVG hand-drawn (not a script font). Ink color, ~14px, slight rotation.
- Zero annotations on any page other than the homepage.

### 4.3 · What we DO NOT adopt from projectone
- Money-back guarantee stamp with tick icon (projectone's "100% Money-Back Guarantee" trust badge). Darso's trust story is escrow + arbitration, not a marketing badge.
- "One Plan. One Site. Done Right." style aphoristic subheaders. Darso voice = specific verbs, not aphorisms.
- The comparison table pattern ("The Smarter Way to Get Online"). Won't use a competitor-battle format on a two-sided marketplace.

---

## 5 · Migration impact on existing tokens

If approved, this direction requires changes to:

- `src/app/globals.css` — every `@theme inline` and `:root` block. Full palette + radius + shadow overhaul.
- `design-system/MASTER.md` — new §1a "Marketing surface tokens" that overrides §1 for marketing routes only.
- `public/fonts/` — add General Sans woff2 files (5-6 weights).
- `src/app/[locale]/layout.tsx` — swap Cabinet Grotesk font loader for General Sans.
- Every existing marketing component under `src/components/marketing/` — palette + button component + section wrapper all need updates.

Estimated scope: 12-16 component edits + tokens + fonts. Non-trivial but self-contained to the marketing folder.

---

## 6 · Open decisions (before implementation)

Not asked yet — flag for a next round of questions:

1. Exact lime green hex — is `#C5F82A` right, or do you want a slightly greener (`#B8FF00`) / more yellow (`#DFFA2E`) / muted (`#B0E42A`) variant? Should propose 3 swatches.
2. Exact cream hex — `#F2F1EB` is projectone's. Slightly warmer (`#F5F2E8`) or slightly cooler (`#F0F0EC`) alternates?
3. Dark panel color — pure `#0A0B0E` (near-black) or keep Darso's charcoal `#1C1F26`?
4. Icon library — stay on Lucide (currently) or explore something more editorial? Lucide's default is fine for the projectone aesthetic; no change recommended unless you want to swap.
5. Should the whole SITE adopt this direction, or only the homepage? (Product UI, dashboards, checkout have different rules — I recommend keeping them on the current system.)

---

## 7 · Next steps

1. **You approve or tweak the tokens in §2.** Nothing implemented until you sign off.
2. Answer the §6 open decisions (or defer them to defaults).
3. Then we redesign the student/teacher section using this new token set. That becomes the pilot for the whole marketing surface.
4. Once one section proves the direction, we cascade across the other 9 marketing sections.
