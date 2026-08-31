---
name: Modern Neo-Humanist
colors:
  surface: '#f9f9f9'
  surface-dim: '#dadada'
  surface-bright: '#f9f9f9'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f3f3f3'
  surface-container: '#eeeeee'
  surface-container-high: '#e8e8e8'
  surface-container-highest: '#e2e2e2'
  on-surface: '#1a1c1c'
  on-surface-variant: '#4c4546'
  inverse-surface: '#2f3131'
  inverse-on-surface: '#f1f1f1'
  outline: '#7e7576'
  outline-variant: '#cfc4c5'
  surface-tint: '#5e5e5e'
  primary: '#000000'
  on-primary: '#ffffff'
  primary-container: '#1b1b1b'
  on-primary-container: '#848484'
  inverse-primary: '#c6c6c6'
  secondary: '#7f5700'
  on-secondary: '#ffffff'
  secondary-container: '#feb316'
  on-secondary-container: '#6a4800'
  tertiary: '#000000'
  on-tertiary: '#ffffff'
  tertiary-container: '#001c39'
  on-tertiary-container: '#3e86d7'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#e2e2e2'
  primary-fixed-dim: '#c6c6c6'
  on-primary-fixed: '#1b1b1b'
  on-primary-fixed-variant: '#474747'
  secondary-fixed: '#ffdead'
  secondary-fixed-dim: '#ffba3b'
  on-secondary-fixed: '#281900'
  on-secondary-fixed-variant: '#604100'
  tertiary-fixed: '#d4e3ff'
  tertiary-fixed-dim: '#a4c9ff'
  on-tertiary-fixed: '#001c39'
  on-tertiary-fixed-variant: '#004883'
  background: '#f9f9f9'
  on-background: '#1a1c1c'
  surface-variant: '#e2e2e2'
typography:
  display-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 56px
    fontWeight: '800'
    lineHeight: '1.1'
    letterSpacing: -0.04em
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 32px
    fontWeight: '700'
    lineHeight: '1.2'
    letterSpacing: -0.02em
  headline-lg-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 28px
    fontWeight: '700'
    lineHeight: '1.2'
  title-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 20px
    fontWeight: '600'
    lineHeight: '1.4'
  body-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '400'
    lineHeight: '1.5'
  label-caps:
    fontFamily: Plus Jakarta Sans
    fontSize: 12px
    fontWeight: '700'
    lineHeight: '1.2'
    letterSpacing: 0.1em
rounded:
  sm: 0.5rem
  DEFAULT: 1rem
  md: 1.5rem
  lg: 2rem
  xl: 3rem
  full: 9999px
spacing:
  unit: 8px
  container-padding: 64px
  gutter: 24px
  margin-sm: 16px
  margin-md: 32px
  margin-lg: 64px
---

## Brand & Style

This design system is built on a foundation of **Neo-Minimalism** with a playful, human touch. It balances high-contrast, professional structure with organic, "super-ellipse" shapes and handwritten-inspired annotations. The aesthetic is clean and spacious, using a primarily monochromatic base to allow specific functional accents to pop.

The brand personality is **modern, transparent, and approachable**. It seeks to evoke a sense of clarity and ease, reducing complex educational or financial concepts into simple, visual metaphors. The use of large, bold typography paired with generous whitespace communicates confidence, while the hand-drawn elements add warmth and personality.

## Colors

The color strategy uses high-contrast functional roles. The palette is dominated by a crisp White and a deep, solid Black to ensure maximum legibility and a premium "editorial" feel.

- **Primary (Black):** Used for primary text, main actions, and structural borders.
- **Surface (Neutral):** A soft, off-white background used for large container areas to reduce eye strain and provide subtle depth against pure white backgrounds.
- **Teacher Accent (Secondary/Yellow-Orange):** Reserved for elements related to teaching, earning, and "the source" of value.
- **Student Accent (Tertiary/Blue):** Reserved for elements related to learning, receiving, and student-focused actions.

## Typography

The typography system is bold and geometric, utilizing **Plus Jakarta Sans** for its contemporary feel and excellent readability. 

Headlines use a heavy weight and tight letter-spacing to create a strong visual anchor. A specific "label-caps" style is used for eyebrows and metadata, providing a structured contrast to the organic shapes of the UI. For emphasized text within headlines, a "highlight" style is used—either through the accent colors or a solid black background with white text, mimicking a marker stroke.

## Layout & Spacing

The layout follows a **fluid-grid philosophy** within defined super-ellipse containers. The primary content is housed in large, nested "islands" that use massive corner radii to create a friendly, modern silhouette.

- **Desktop:** A 12-column grid with wide 64px outer margins. Content is often centered or split into asymmetric blocks to maintain visual interest.
- **Mobile:** A single-column stack with 20px side margins. The large corner radii of containers should be reduced slightly (to 24px) to preserve screen real estate.
- **Rhythm:** Spacing follows an 8px incremental scale, with a preference for "Airy" layouts (large 64px+ gaps between major sections).

## Elevation & Depth

Depth is achieved through **Tonal Layering** rather than traditional shadows. 

1.  **Level 0 (Base):** Pure White (#FFFFFF).
2.  **Level 1 (Containers):** Soft Neutral (#F7F7F7) with high-radius corners.
3.  **Level 2 (Interactive):** Elements like buttons or navigation bars use a thin 1px solid black border or a high-contrast black fill to sit "above" the surface.

Shadows are used sparingly and should be **ultra-diffused and subtle** (e.g., `0px 10px 30px rgba(0,0,0,0.04)`), primarily to lift the main navigation or floating action buttons.

## Shapes

The defining characteristic of this design system is the **Super-Ellipse**. 

- **Containers:** Use `rounded-xl` (1.5rem / 24px) or custom ultra-large radii (up to 80px) for section wrappers to create a "bubble" effect.
- **Buttons & Inputs:** Use "Pill-shaped" (rounded-full) geometry to maximize the friendly, approachable aesthetic.
- **Accents:** Handwritten-style arrows and circular highlights should have a variable stroke width to look authentically hand-drawn, contrasting with the mathematical precision of the UI shapes.

## Components

### Buttons
- **Primary:** Solid black fill, white text, pill-shaped.
- **Secondary:** White fill, 1px solid black border, black text, pill-shaped.
- **Ghost:** No background or border, bold text with an optional underline or icon.

### Cards & Containers
Containers should use the neutral surface color with large radii. When nesting, ensure the inner container radius is smaller than the outer to maintain concentricity.

### Chips & Indicators
Small pill-shaped tags used for categorization. For functional roles (Teacher/Student), include a small colored dot (Secondary/Tertiary color) next to the label.

### Input Fields
Pill-shaped with a light neutral background and a subtle border that darkens on focus. Typography inside inputs should be `body-lg`.

### Handwritten Annotations
Use thin, organic vector lines for arrows and callouts. These should always be black and appear as if sketched over the interface to point out key features or data points.