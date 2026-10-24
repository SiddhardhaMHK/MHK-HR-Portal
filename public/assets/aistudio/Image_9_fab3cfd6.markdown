---
name: Nexus Enterprise
colors:
  surface: '#f8f9ff'
  surface-dim: '#cbdbf5'
  surface-bright: '#f8f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#eff4ff'
  surface-container: '#e5eeff'
  surface-container-high: '#dce9ff'
  surface-container-highest: '#d3e4fe'
  on-surface: '#0b1c30'
  on-surface-variant: '#45464d'
  inverse-surface: '#213145'
  inverse-on-surface: '#eaf1ff'
  outline: '#76777d'
  outline-variant: '#c6c6cd'
  surface-tint: '#565e74'
  primary: '#000000'
  on-primary: '#ffffff'
  primary-container: '#131b2e'
  on-primary-container: '#7c839b'
  inverse-primary: '#bec6e0'
  secondary: '#712ae2'
  on-secondary: '#ffffff'
  secondary-container: '#8a4cfc'
  on-secondary-container: '#fffbff'
  tertiary: '#000000'
  on-tertiary: '#ffffff'
  tertiary-container: '#341100'
  on-tertiary-container: '#d95f00'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dae2fd'
  primary-fixed-dim: '#bec6e0'
  on-primary-fixed: '#131b2e'
  on-primary-fixed-variant: '#3f465c'
  secondary-fixed: '#eaddff'
  secondary-fixed-dim: '#d2bbff'
  on-secondary-fixed: '#25005a'
  on-secondary-fixed-variant: '#5a00c6'
  tertiary-fixed: '#ffdbca'
  tertiary-fixed-dim: '#ffb690'
  on-tertiary-fixed: '#341100'
  on-tertiary-fixed-variant: '#783200'
  background: '#f8f9ff'
  on-background: '#0b1c30'
  surface-variant: '#d3e4fe'
typography:
  headline-xl:
    fontFamily: Plus Jakarta Sans
    fontSize: 2.25rem
    fontWeight: '700'
    lineHeight: 2.75rem
    letterSpacing: -0.025em
  headline-xl-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 1.75rem
    fontWeight: '700'
    lineHeight: 2.25rem
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 1.75rem
    fontWeight: '600'
    lineHeight: 2.25rem
    letterSpacing: -0.02em
  headline-lg-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 1.5rem
    fontWeight: '600'
    lineHeight: 2rem
    letterSpacing: -0.015em
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 1.25rem
    fontWeight: '600'
    lineHeight: 1.75rem
    letterSpacing: -0.015em
  title-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 1.125rem
    fontWeight: '600'
    lineHeight: 1.5rem
  body-lg:
    fontFamily: Inter
    fontSize: 1rem
    fontWeight: '400'
    lineHeight: 1.6rem
  body-md:
    fontFamily: Inter
    fontSize: 0.875rem
    fontWeight: '400'
    lineHeight: 1.45rem
  body-sm:
    fontFamily: Inter
    fontSize: 0.75rem
    fontWeight: '400'
    lineHeight: 1.25rem
  label-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 0.875rem
    fontWeight: '600'
    lineHeight: 1.25rem
    letterSpacing: 0.01em
  label-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 0.75rem
    fontWeight: '600'
    lineHeight: 1rem
    letterSpacing: 0.02em
  label-xs:
    fontFamily: Plus Jakarta Sans
    fontSize: 0.6875rem
    fontWeight: '700'
    lineHeight: 0.875rem
    letterSpacing: 0.04em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1.5rem
  gutter-mobile: 0.75rem
  margin: 2rem
  margin-mobile: 1rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2.5rem
---

## Brand & Style

This design system establishes an authoritative yet energetic visual language tailored for high-velocity enterprise human resources and operational workflows. Drawing from the architectural structure of the multi-node network star motif in the brand mark, the aesthetic balances deep institutional trust with modern digital agility.

The interface style fuses **Corporate / Modern Precision** with **Subtle High-Tech Glass and Glow Transitions**:
- **Structured Enterprise Utility:** Crisp border boundaries, disciplined alignment, high-density readability, and modular cards convey dependability and operational clarity.
- **Node-Network Dynamic Energy:** Radiant gradient accents transitioning from electric violet to warm radiant orange punctuate primary interactions, role identifiers, metrics, and progress nodes without overwhelming core tabular and data-heavy layouts.
- **Atmospheric Depth:** Slate-tinted surfaces with micro-diffused ambient glows indicate system state, active user focus, and permission levels.
- **Target Audience:** Modern knowledge workers, cross-functional HR business partners, and system administrators managing personnel, payroll, performance cycles, and role-based access.

## Colors

The palette directly extrapolates the brand identity's foundational colors: the deep authoritative navy typography, the core violet hub of the node star, and the vibrant orange/amber endpoints.

### Roles & Palette Functions
- **Primary (`#0F172A` - Midnight Slate):** Used for primary high-contrast typography, top-level navigation shells, structural headers, high-importance action anchors, and dominant interactive elements in light mode.
- **Secondary (`#7C3AED` - Radiant Violet):** Represents system intelligence, active state selections, focus rings, employee role tiers, and key workflow actions.
- **Tertiary (`#F97316` - Solar Amber / Orange):** Provides focal contrast for high-priority operational highlights, performance badges, pending review notices, executive alerts, and gradient terminal nodes.
- **Gradient Accents:** A signature gradient token (`linear-gradient(135deg, #7C3AED 0%, #EA580C 100%)`) is reserved for primary executive metrics, elevated button states, hero welcome states, and node connection lines.
- **Neutral Palette (`#0B0F2A` to `#F8FAFC`):**
  - Canvas Background: `#F8FAFC` (Light), `#0B0F2A` (Dark)
  - Surface Raised: `#FFFFFF` (Light), `#131B38` (Dark)
  - Surface Border: `#E2E8F0` (Light), `#1E293B` (Dark)
  - Text Muted: `#64748B` (Light), `#94A3B8` (Dark)

### Role Indicators
- **Employee:** Violet tint (`#F5F3FF` background, `#7C3AED` border/text).
- **HR Specialist:** Blue-Cyan tint (`#EFF6FF` background, `#2563EB` border/text).
- **Admin / Exec:** Sunset Amber tint (`#FFF7ED` background, `#EA580C` border/text).

## Typography

The typographic hierarchy pairs **Plus Jakarta Sans** for expressive, crisp display headers and interactive labels with **Inter** for data grids, administrative logs, forms, and analytical tables.

- **Plus Jakarta Sans:** Injects geometric structure and clear contemporary character into dashboards, section headers, KPI metrics, tabs, and status pills.
- **Inter:** Provides neutral legibility and vertical rhythm across multi-row data tables, employee profiles, document trees, and nested lists.
- **Tabular Numerics:** All numerical representations in compensation, performance scores, time-tracking, and employee rosters enforce tabular lining (`font-variant-numeric: tabular-nums`) to preserve column integrity.

## Layout & Spacing

The portal layout adheres to a 12-column responsive fluid grid anchored by persistent structural navigation (collapsible 260px sidebar navigation for desktop, drawer for mobile/tablet).

### Breakpoints & Grid Composition
- **Desktop (≥ 1280px):** 12 columns, 24px (`1.5rem`) gutters, 32px (`2rem`) margins. Content spans common 4-column KPI cards, 8-column data tables, and 4-column contextual sidepanels.
- **Tablet (768px - 1279px):** 8 columns, 16px (`1rem`) gutters, 24px (`1.5rem`) margins. Layout stacks metrics into 2x2 grids and nests lateral inspection panels into overlay sheets.
- **Mobile (< 768px):** 4 columns, 12px (`0.75rem`) gutters, 16px (`1rem`) margins. Multi-column metric cards become horizontally swipeable carousels; action rows collapse into full-width tap targets.

### Spacing Principles
- Internal card padding defaults to `space-lg` (24px) for dashboard modules and `space-md` (16px) for compact data-list rows.
- Micro-pill badges and inputs employ `space-xs` and `space-sm` for tight, precise containment.

## Elevation & Depth

Visual depth combines low-contrast outlines with subtle multi-tiered ambient shadows and localized neon glow cues reflecting the star network's energy.

### Elevation Hierarchy
- **Level 0 (Flat / Canvas):** Surface color (`#F8FAFC` light / `#0B0F2A` dark) without shadows. Reserved for root layouts, canvas backdrops, and inactive table track lanes.
- **Level 1 (Card / Container):** Single-pixel perimeter border (`#E2E8F0` light / `#1E293B` dark) paired with soft ambient diffusion:
  `box-shadow: 0 1px 3px 0 rgba(15, 23, 42, 0.05), 0 1px 2px -1px rgba(15, 23, 42, 0.03)`.
- **Level 2 (Dropdowns / Flyout Panels / Hovered Cards):** 
  `box-shadow: 0 10px 15px -3px rgba(15, 23, 42, 0.08), 0 4px 6px -4px rgba(15, 23, 42, 0.04)`.
- **Level 3 (Modals / Global Dialogs):** Centered high-elevation float with heavy backdrop blur (`backdrop-filter: blur(8px)` over `#0F172A` at 40% opacity):
  `box-shadow: 0 25px 50px -12px rgba(15, 23, 42, 0.25)`.

### Accent Node Glow
Active interactive focal points (e.g., primary dynamic buttons, selected timeline milestones, pending attention badges) utilize a colored ambient halo:
`box-shadow: 0 0 16px -2px rgba(124, 58, 237, 0.25)`.

## Shapes

The design system maintains a balanced **Rounded (`2`)** geometry that complements modern enterprise software:
- **Base Components:** Inputs, standard buttons, form fields, and table rows use standard rounding (`0.5rem` / 8px).
- **Cards & Data Modules:** Surface cards, dialogs, and large metrics containers utilize `rounded-lg` (`1rem` / 16px).
- **Badges, Role Indicators, and Interactive Chips:** Adopt fully rounded micro-capsule or pill contours (`9999px`) to visually echo the node spheres of the brand symbol.
- **Avatars & Star Connectors:** Circular geometries (`50%`) with hairline borders for personnel nodes.

## Components

### Buttons
- **Primary Action:** Solid gradient background (`linear-gradient(135deg, #7C3AED 0%, #EA580C 100%)`) with white text, font weight 600, `0.5rem` border radius, and active-press micro-compression (`transform: scale(0.98)`). Hover state engages subtle glow diffusion (`0 4px 14px rgba(124, 58, 237, 0.35)`).
- **Secondary Action:** White background, 1px border (`#E2E8F0`), Midnight Slate text (`#0F172A`). Hover transitions to `#F8FAFC` background and `#7C3AED` border.
- **Ghost / Tertiary:** Transparent background, slate text (`#64748B`), with gentle slate tint (`#F1F5F9`) on hover.

### Role Indicators & Status Chips
- **Role Indicators:** Pill-shaped (`rounded-full`), padding `0.25rem 0.75rem`, uppercase tracking, font size `0.6875rem` (`label-xs`).
  - *Employee:* Light violet surface (`#F5F3FF`), violet text (`#7C3AED`), subtle border (`#DDD6FE`).
  - *HR Business Partner:* Sky surface (`#EFF6FF`), blue text (`#1D4ED8`), subtle border (`#BFDBFE`).
  - *Administrator:* Warm amber surface (`#FFF7ED`), deep orange text (`#C2410C`), subtle border (`#FFEDD5`).
- **Status Chips:** Miniature rounded markers featuring a 6px status node dot:
  - *Active:* Emerald green dot (`#10B981`) with soft glow.
  - *On Leave:* Amber dot (`#F59E0B`).
  - *Pending Action:* Violet-to-orange animated gradient pulse dot.

### Enterprise Cards
- **Base Structure:** White background (`#FFFFFF`), 1px solid border (`#E2E8F0`), 16px (`rounded-lg`) corner radius, and `space-lg` (24px) padding.
- **Header Slot:** Title set in `title-md`, paired with optional trailing micro-pill or right-aligned filter button.
- **Interactive Variant:** Elevates to Level 2 on hover with an ultra-thin 1px border transition to `#CBD5E1`.

### Data Lists & Tabular Grids
- **Header:** Sticky table header row set in `label-sm` uppercase, muted slate (`#64748B`), with border-bottom in `#E2E8F0`.
- **Row Styling:** Minimum height of 52px for high touch/click precision. Alternating states rely on clean divider lines rather than heavy zebra striping. Hover displays subtle `#F8FAFC` fill.

### Input Fields & Controls
- **Text Inputs:** Height 42px, radius 8px (`0.5rem`), border 1px (`#CBD5E1`), placeholder in `#94A3B8`. Focus state applies a crisp 1px ring in `#7C3AED` plus a soft violet focus glow.
- **Checkboxes & Radios:** 18px standard size, high-contrast violet fill on checked state with crisp white vector checkmark/dot.