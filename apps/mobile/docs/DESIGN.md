---
name: UniLearn Mobile
colors:
  surface: '#0b1326'
  surface-dim: '#0b1326'
  surface-bright: '#31394d'
  surface-container-lowest: '#060e20'
  surface-container-low: '#131b2e'
  surface-container: '#171f33'
  surface-container-high: '#222a3d'
  surface-container-highest: '#2d3449'
  on-surface: '#dae2fd'
  on-surface-variant: '#cbc3d7'
  inverse-surface: '#dae2fd'
  inverse-on-surface: '#283044'
  outline: '#958ea0'
  outline-variant: '#494454'
  surface-tint: '#d0bcff'
  primary: '#d0bcff'
  on-primary: '#3c0091'
  primary-container: '#a078ff'
  on-primary-container: '#340080'
  inverse-primary: '#6d3bd7'
  secondary: '#4cd7f6'
  on-secondary: '#003640'
  secondary-container: '#03b5d3'
  on-secondary-container: '#00424e'
  tertiary: '#c4c7c9'
  on-tertiary: '#2d3133'
  tertiary-container: '#8e9193'
  on-tertiary-container: '#272a2c'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#e9ddff'
  primary-fixed-dim: '#d0bcff'
  on-primary-fixed: '#23005c'
  on-primary-fixed-variant: '#5516be'
  secondary-fixed: '#acedff'
  secondary-fixed-dim: '#4cd7f6'
  on-secondary-fixed: '#001f26'
  on-secondary-fixed-variant: '#004e5c'
  tertiary-fixed: '#e0e3e5'
  tertiary-fixed-dim: '#c4c7c9'
  on-tertiary-fixed: '#191c1e'
  on-tertiary-fixed-variant: '#444749'
  background: '#0b1326'
  on-background: '#dae2fd'
  surface-variant: '#2d3449'
typography:
  display-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 40px
    fontWeight: '800'
    lineHeight: 48px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: '700'
    lineHeight: 32px
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-md:
    fontFamily: Geist
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.05em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 4px
  container-padding: 24px
  stack-gap: 16px
  section-gap: 32px
  gutter: 12px
---

## Brand & Style

This design system is built for the modern academic elite—students who require a high-performance, focused environment that feels both sophisticated and intellectually stimulating. The brand personality is **Intelligent, Cinematic, and Precise**. 

The visual style departs from flat corporate aesthetics in favor of **Dark-Mode Glassmorphism**. By utilizing deep, light-absorbing backgrounds contrasted with luminous, neon-inflected accents, the interface mimics a high-end command center. The emotional response should be one of "calm focus" and "technological empowerment," reducing cognitive load while maintaining a premium startup-quality feel.

## Colors

The palette is anchored in a **Dark-Mode-First** philosophy.
- **Base Layers:** The foundation uses `Deep Navy (#0F172A)` for primary backgrounds to ensure infinite depth, while `Charcoal (#1E293B)` is reserved for elevated cards and surfaces.
- **Accents:** `Electric Violet (#8B5CF6)` serves as the primary brand signal for high-priority actions and AI-native features. `Vibrant Cyan (#06B6D4)` is used for secondary data visualization, progress tracking, and success states.
- **Text & Contrast:** High-contrast `Off-White (#F8FAFC)` ensures maximum readability against dark backgrounds, while muted slate tones are used for secondary metadata.
- **Gradients:** Use the signature violet-to-cyan gradient sparingly for primary call-to-actions and premium feature highlights.

## Typography

The typography system balances expressive headers with utilitarian body text.
- **Headlines:** `Plus Jakarta Sans` provides a modern, geometric flair with high-energy curves. Headlines should be bold and tightly kerned to create a "cinematic" editorial feel.
- **Body:** `Inter` is selected for its exceptional legibility at small sizes, crucial for reading academic papers or long-form notes. Line heights are kept tight but readable to maintain a "compact" productivity aesthetic.
- **Labels:** `Geist` is used for technical data, mono-spaced hints, and navigation labels to evoke a sense of precision and AI-driven logic.

## Layout & Spacing

This design system utilizes a **Dynamic Fluid Grid** optimized for mobile-first interaction. 
- **The Rhythm:** Based on a 4px baseline, but utilizing "Generous" increments (16, 24, 32) to ensure the UI feels airy despite the dark color palette.
- **Margins:** A standard 24px horizontal margin provides a premium "breathable" frame for content.
- **Layout Model:** Use a 4-column grid for mobile. Elements should lean into vertical stacking with rhythmic "breathing room" between logical sections. Avoid overcrowding; the design should feel like a curated gallery of academic insights rather than a dense spreadsheet.

## Elevation & Depth

Depth is conveyed through **Atmospheric Layering** rather than traditional shadows.
- **Glassmorphism:** Secondary surfaces use a 10-20% opacity white fill with a high-intensity background blur (20px-40px). This creates a "frosted" effect that allows the deep navy background colors to bleed through.
- **Stroke/Borders:** Every card must have a subtle 1px inner border (linear-gradient: top-left white @ 15%, bottom-right white @ 5%). This "micro-edge" defines the shape against the dark background.
- **Shadows:** Use large, diffused "Ambient Glows" instead of black shadows. A soft violet or cyan outer glow (opacity 10-15%) should be applied only to the highest-level interactive elements (e.g., the primary Action Button).

## Shapes

The shape language is defined by **Large, Soft Radii**.
- **Cards & Containers:** Use a minimum of 16px (`rounded-lg`) for all main content blocks to soften the "tech" aesthetic and make it feel more approachable.
- **Buttons:** Use 12px or fully pill-shaped radii for high-priority interactive elements.
- **Form Inputs:** Consistent 12px rounding to match the button language.
- **Visual Logic:** Large radii are used to signify "containers of information," while smaller radii (4px-8px) are reserved for nested elements like tags or secondary chips.

## Components

- **Buttons:** Primary buttons use the Violet-to-Cyan gradient with high-contrast white text. Secondary buttons are "Ghost" style with a glassmorphic blur and 1px border.
- **Cards:** Must utilize the background blur effect. Headlines inside cards should be `headline-md`, and secondary information should use `label-md`.
- **AI-Native Inputs:** Search bars and AI query fields should have a persistent, very subtle cyan outer glow to indicate "active intelligence."
- **Lists:** Clean, border-less rows separated by subtle 1px dividers (opacity 10%). Use generous 16px vertical padding for list items.
- **Progress Indicators:** Use the Vibrant Cyan accent. Progress bars should be thin (4px) with rounded caps and a subtle "glow" effect on the leading edge.
- **Glass Chips:** Small, semi-transparent labels used for categories or tags. These should have a slight 1px border to ensure they don't disappear into the background.

## Parity with web (`apps/frontend`)

The UniLearn web app uses `apps/frontend/src/index.css`: **Space Grotesk** (headlines), **Inter**, **JetBrains Mono**; primary lavender `#d0bcff` matches this token set; **secondary accent differs** (web uses mint `#4edea3`, mobile tokens use cyan `#4cd7f6`). Flutter implements the YAML above as the mobile source of truth; align web later if you want identical accents.
