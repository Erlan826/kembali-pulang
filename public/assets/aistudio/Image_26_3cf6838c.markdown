---
name: Academic Custody & Recovery System
colors:
  surface: '#faf8ff'
  surface-dim: '#d2d9f4'
  surface-bright: '#faf8ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f2f3ff'
  surface-container: '#eaedff'
  surface-container-high: '#e2e7ff'
  surface-container-highest: '#dae2fd'
  on-surface: '#131b2e'
  on-surface-variant: '#45474c'
  inverse-surface: '#283044'
  inverse-on-surface: '#eef0ff'
  outline: '#75777d'
  outline-variant: '#c5c6cd'
  surface-tint: '#545f73'
  primary: '#091426'
  on-primary: '#ffffff'
  primary-container: '#1e293b'
  on-primary-container: '#8590a6'
  inverse-primary: '#bcc7de'
  secondary: '#1d4ed8'
  on-secondary: '#ffffff'
  secondary-container: '#4069f2'
  on-secondary-container: '#fffbff'
  tertiary: '#00190e'
  on-tertiary: '#ffffff'
  tertiary-container: '#00301e'
  on-tertiary-container: '#00a472'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#d8e3fb'
  primary-fixed-dim: '#bcc7de'
  on-primary-fixed: '#111c2d'
  on-primary-fixed-variant: '#3c475a'
  secondary-fixed: '#dce1ff'
  secondary-fixed-dim: '#b7c4ff'
  on-secondary-fixed: '#001551'
  on-secondary-fixed-variant: '#0039b5'
  tertiary-fixed: '#6ffbbe'
  tertiary-fixed-dim: '#4edea3'
  on-tertiary-fixed: '#002113'
  on-tertiary-fixed-variant: '#005236'
  background: '#faf8ff'
  on-background: '#131b2e'
  surface-variant: '#dae2fd'
typography:
  headline-xl:
    fontFamily: Plus Jakarta Sans
    fontSize: 36px
    fontWeight: '700'
    lineHeight: 44px
    letterSpacing: -0.02em
  headline-xl-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 28px
    fontWeight: '700'
    lineHeight: 36px
    letterSpacing: -0.01em
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 28px
    fontWeight: '600'
    lineHeight: 36px
    letterSpacing: -0.02em
  headline-lg-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 22px
    fontWeight: '600'
    lineHeight: 30px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
    letterSpacing: -0.01em
  headline-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '600'
    lineHeight: 24px
  body-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 26px
  body-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 22px
  body-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 18px
  label-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: 0.01em
  label-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.02em
  label-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 11px
    fontWeight: '700'
    lineHeight: 14px
    letterSpacing: 0.04em
  code-num:
    fontFamily: Plus Jakarta Sans
    fontSize: 13px
    fontWeight: '500'
    lineHeight: 18px
    letterSpacing: 0.02em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
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
The design system embodies institutional authority, civic trust, and reassuring clarity. Designed for a university environment, it shifts the emotional state of a student from panic and loss to reassurance and structured resolution. 

The aesthetic is Modern Institutional: a union of systematic clarity, high functional density, and calibrated warmth. The visual language eschews decorative distractions in favor of crisp administrative order, clear status signifiers, and transparent verification workflows. High visual precision—manifested through distinct status states, tabular data alignments, and verifiable audit trails—fosters mutual trust between students, faculty coordinators, and campus security.

## Colors
The color architecture reinforces credibility, state verification, and rapid visual triage.

- **Primary & Institutional Baseline**: `#0F172A` (Slate 900) anchors deep administrative framing, active nav states, and high-emphasis typography; `#1E293B` (Slate 800) defines top bars, headers, and modal frame edges.
- **Action & Interactive Blue**: `#1D4ED8` (Blue 700) is reserved for verified status states, primary interaction buttons, search confirmations, and student SSO identity verification badges.
- **Success & Recovery**: `#10B981` (Emerald 500) and `#059669` (Emerald 600) designate safe recovery, authentic matches, resolved handovers, and positive closure.
- **Warning & In-Progress**: `#F59E0B` (Amber 500) and `#D97706` (Amber 600) govern items awaiting administrative screening, ownership evaluations, and active verification proceedings.
- **Critical / Danger**: `#EF4444` (Rose 500) and `#B91C1C` (Red 700) signal rejected claims, contradictory evidence, and security disputes.

### Semantic Status Tokens
- `status-reported`: Background `#FEF3C7` (Amber 100), Border `#FCD34D` (Amber 300), Text `#B45309` (Amber 700) — *Dilaporkan (Menunggu Verifikasi)*
- `status-verified`: Background `#EFF6FF` (Blue 50), Border `#BFDBFE` (Blue 200), Text `#1D4ED8` (Blue 700) — *Diverifikasi (Aktif Publik)*
- `status-in-progress`: Background `#FFF7ED` (Orange 50), Border `#FED7AA` (Orange 200), Text `#C2410C` (Orange 700) — *Dalam Proses Klaim*
- `status-resolved`: Background `#ECFDF5` (Emerald 50), Border `#A7F3D0` (Emerald 200), Text `#047857` (Emerald 700) — *Dikembalikan / Selesai*
- `status-rejected`: Background `#FEF2F2` (Red 50), Border `#FECACA` (Red 200), Text `#B91C1C` (Red 700) — *Ditolak / Batal*

## Typography
Plus Jakarta Sans serves as the sole typeface, bridging administrative structure with readable contemporary geometry. 

Numbers in reference tickets (e.g., `KB-2024-0891`), timestamps, and serial IDs adopt tabular figure positioning to enable flawless vertical scanning across data tables and audit lists. Headline weights stay reserved and authoritative (`600` and `700`), avoiding hyper-condensed display cuts. Labels leverage slightly wider tracking (`0.02em` to `0.04em`) when rendered in uppercase for badge chips and micro-metadata labels.

## Layout & Spacing
The layout employs an asymmetric multi-tier layout structure:

- **Admin & Coordinator View**: A fixed 260px vertical sidebar housing departmental queues, matched algorithms, and batch actions, paired with an adaptive fluid canvas (12-column grid, 24px gutters).
- **Public & Student View**: A 1280px max-width centered container with sticky top-navigation featuring university SSO identity indicators, global item lookup, and rapid-entry reporting CTA.
- **Dual Verification Views (Side-by-Side Comparison)**: Splits the container into 50/50 comparison viewports (at `>= 1024px`), aligning claimant proof photographs directly against coordinator intake photos with unified scroll locks.
- **Breakpoints**: 
  - Desktop (`>= 1280px`): Full sidebar navigation, persistent timeline drawers.
  - Laptop (`1024px - 1279px`): Collapsed icon sidebar or full top header; dual-column comparisons remain side-by-side.
  - Tablet / Mobile (`< 1024px`): Collapses to single column; comparison cards switch to tabbed segmented views ("Laporan Penemu" vs "Bukti Pengklaim").

## Elevation & Depth
Elevation utilizes crisp low-contrast outlines supplemented by restrained ambient shadows. This keeps data-dense screens utilitarian, preventing visual clutter in multi-table and multi-field panels.

- **Level 0 (Flat Canvas)**: `#F8FAFC` base surface, no shadow.
- **Level 1 (Card & Row Panels)**: `#FFFFFF` surface with a 1px border of `#E2E8F0` and subtle drop shadow `0 1px 3px 0 rgba(15, 23, 42, 0.05)`.
- **Level 2 (Interactive Floating & Hover Cards)**: 1px border of `#CBD5E1`, drop shadow `0 4px 6px -1px rgba(15, 23, 42, 0.08), 0 2px 4px -2px rgba(15, 23, 42, 0.04)`.
- **Level 3 (Modals, Handoff Confirmation Overlays, SSO Dropdowns)**: 1px border of `#94A3B8`, drop shadow `0 20px 25px -5px rgba(15, 23, 42, 0.12), 0 8px 10px -6px rgba(15, 23, 42, 0.04)`.
- **Timeline Rail Depth**: Vertical connector tracks use a 2px stroke of `#E2E8F0` overlaid with absolute status nodes with 2px white halo rings (`ring-2 ring-white`).

## Shapes
A conservative, structural roundedness level (`roundedness: 1` / 4px base, 8px lg) governs all administrative components, retaining a professional, reliable institutional silhouette.

- **Base Controls (Buttons, Inputs, Selects)**: 6px corner radius (`0.375rem`) for balanced, clean focus rings.
- **Cards, Panels, and Compare Panes**: 8px corner radius (`0.5rem`) with clean 1px borders.
- **Status Chips & SSO Identity Pills**: Fully rounded pill shapes (`9999px`) to create distinction between clickable rectangular items and passive semantic state tags.

## Components

### Status Badges & Chips
- **Pill Container**: Heights of 24px (compact) and 28px (default), padding `0 10px`, font size `label-sm` with text transformed to uppercase.
- **Dot Indicators**: 6px circular solid glyph on the left margin of the text to ensure accessibility without relying entirely on color hue.

### Side-by-Side Comparison Cards
- Two synchronized panels placed edge-to-edge with an explicit divider label ("Klaim Kepemilikan").
- Left pane (Found Record): `#F8FAFC` subtle fill with timestamp, building/room coordinate, and initial curator notes.
- Right pane (Claim Submission): `#FFFFFF` fill with claimant student credentials, detailed serial number assertions, and uploaded ownership photos.
- Verification control anchored at the bottom: "Setujui Serah Terima" (Emerald solid), "Minta Bukti Tambahan" (Amber outline), and "Tolak Klaim" (Rose outline).

### Timeline Stepper (Status Pelacakan)
- Vertical on sidebar inspect drawers; horizontal on student tracking pages.
- Nodes utilize a 32px circle:
  - Completed: Emerald fill with white checkmark icon.
  - Active: Navy outline (`#1D4ED8`) with pulsing centered blue dot.
  - Upcoming: Slate fill (`#F1F5F9`) with gray glyph.
  - Rejected: Rose fill with white 'x' icon.
- Node meta includes stage title, actor (e.g., "Satpam Gedung B", "Koordinator Kemahasiswaan"), and automated timestamp.

### SSO Student Identity Badge
- Located on public top navigation: Displays student avatar/initials, full student name, validated NIM (Student ID), and an emerald "SSO Aktif" shield icon.
- Hover opens direct links to "Barang Saya Dilaporkan" and active verification tickets.

### Data Tables & Search Filters
- **Filter Row**: Integrated global search bar with instant autocomplete, category dropdown (Elektronik, Dokumen/Kartu, Kunci, Dompet), date-range filter, and campus zone selector.
- **Tables**: Row height 52px, alternating zebra row tints (`#FFFFFF` to `#F8FAFC` on hover), right-aligned actions menu, and strict column typing.
- **Pagination & Bulk Actions**: Sticky bottom bar when items are selected (e.g., "Tandai 3 Laporan sebagai Diverifikasi").

### Form Controls & Item Image Uploader
- Inputs feature explicit labels with optional auxiliary helper text, focus state with a crisp 2px Navy ring (`#1D4ED8`), and distinct error borders with explanatory sub-labels.
- Dropzone for photographic evidence includes preview slots with watermark tags indicating date, file name, and campus server hash.