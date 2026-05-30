---
name: UniLearn Mobile
colors:
  background: '#131315'
  surface: '#131315'
  surface-low: '#1b1b1d'
  surface-high: '#2a2a2c'
  surface-highest: '#353437'
  on-surface: '#e5e1e4'
  on-surface-variant: '#cac4d0'
  primary: '#d0bcff'
  on-primary: '#37265e'
  secondary: '#4edea3'
  on-secondary: '#072317'
  border: 'rgba(73, 69, 79, 0.35)'
  outline-variant: 'rgba(73, 69, 79, 0.15)'
  ring: '#d0bcff'
typography:
  headline:
    fontFamily: Space Grotesk
    fontWeight: '600-700'
  body:
    fontFamily: Inter
    fontSize: 14px-16px
  eyebrow:
    fontFamily: JetBrains Mono
    fontSize: 10px
    fontWeight: '500'
    letterSpacing: 0.2em
    textTransform: uppercase
rounded:
  sm: 0.25rem
  md: 0.5rem
  lg: 0.75rem
  xl: 0.875rem
  full: 9999px
spacing:
  unit: 4px
  container-padding: 24px
  stack-gap: 16px
  section-gap: 32px
  gutter: 12px
---

## Brand & Style

Mobile mirrors the UniLearn web app ([`apps/frontend/src/index.css`](../../frontend/src/index.css)): **shadcn/ui + Linear-inspired**, dark-mode first, minimal, and high-performance. The personality is **Precise, Flat, and Technical** — not cinematic or glass-heavy.

Depth comes from **surface elevation tiers** and **1px borders**, not blur, glow, or gradient fills.

## Colors

Charcoal neutral stack (aligned with web `.theme-dark`):

- **Background / surface:** `#131315`
- **Card / surface-low:** `#1B1B1D`
- **Muted / surface-high:** `#2A2A2C` (inputs, secondary buttons)
- **Accent / surface-highest:** `#353437` (hover, elevated chips)
- **Primary:** `#D0BCFF` (lavender brand)
- **On-primary:** `#37265E` (button label on primary fill)
- **Secondary:** `#4EDEA3` (mint accent — status, links, highlights)
- **Foreground:** `#E5E1E4`
- **Muted text:** `#CAC4D0`
- **Border:** `rgba(73, 69, 79, 0.35)`
- **Outline-variant:** `rgba(73, 69, 79, 0.15)`

## Typography

- **Headlines:** Space Grotesk — semibold, tight tracking
- **Body:** Inter — 14–16px, relaxed line height
- **Eyebrows / labels:** JetBrains Mono — 10px, uppercase, `letter-spacing: 0.2em`

## Layout & Spacing

4px baseline; generous section gaps (16px stack, 32px section, 24px horizontal padding). Mobile uses a single-column stack; avoid overcrowding.

## Elevation & Depth

- **No default glassmorphism.** Reserve subtle blur only for future AI accent panels (web `.glass-ai`).
- **Cards:** flat `surface-low` + 1px `outline-variant` border, 12px radius, elevation 0.
- **Shadows:** black ambient only on modals/overlays (`0 20px 40px rgba(0,0,0,0.65)`), not colored glows.

## Shapes

| Token | px | Usage |
|-------|-----|-------|
| `sm` | 4 | buttons, inputs, badges, nav |
| `md` | 8 | small chips |
| `lg` | 12 | cards, panels |
| `xl` | 14–16 | hero blocks (sparingly) |
| `full` | pill | avatars, progress caps |

## Components

- **Primary button:** solid `#D0BCFF`, text `#37265E`, `rounded-sm`, no gradient
- **Secondary button:** `surface-high` fill, `on-surface` text
- **Ghost button:** transparent, hover `surface-low`
- **Inputs:** `surface-high` fill, `rounded-sm`, mono uppercase label, primary focus ring @ 50%
- **Cards:** bordered flat surfaces; section titles may use mono eyebrow above Space Grotesk title
- **Progress:** thin bars (4–8px), mint or primary fill, rounded caps

## Flutter shadcn mapping

| shadcn / web | Flutter |
|--------------|---------|
| `bg-card` + `border` | `Container(color: surfaceContainerLow, border: Border.all(...))` |
| `Button variant=primary` | `GradientCtaButton` (solid primary) / `FilledButton` |
| `Button variant=secondary` | `surfaceContainerHigh` background |
| `Button variant=ghost` | transparent + `surfaceContainerLow` on press |
| `rounded-sm` | `AppRadii.sm` (4px) |
| `ring-1 ring-brand` | `focusedBorder` primary @ 50% |
| `font-mono uppercase tracking` | `AppTypography.eyebrow()` |

## Parity with web

Source of truth: [`apps/frontend/src/index.css`](../../frontend/src/index.css). Mobile tokens in [`lib/theme/color_tokens.dart`](../lib/theme/color_tokens.dart) must stay in sync with web CSS variables (`--background`, `--card`, `--primary`, `--secondary`, etc.).

Implemented in Flutter via Material 3 `ColorScheme` + `UniLearnThemeExtension` (borders, focus ring, ambient shadow only — no gradient/glow defaults).
