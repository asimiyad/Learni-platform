# Design System: Learni

**Framework combo:** Awesome Claude Design (DESIGN.md format) + Taste Skill v2 (dial inference) + Impeccable (anti-pattern enforcement) + Stitch M3 (semantic tokens) + Emil Kowalski (micro-interaction physics)

---

## Configuration Dials

| Dial | Level | Rationale |
|------|-------|-----------|
| **Creativity** | `7` | Expressive layouts with strong typographic contrast, but restrained enough for K-12 clarity |
| **Density** | `4` | Balanced — generous whitespace for readability, not gallery-airy |
| **Variance** | `7` | Asymmetric bento grids, split-screen heroes, no two sections identical |
| **Motion** | `6` | Spring-physics micro-interactions, staggered reveals, perpetual loops on live data |

---

## 1. Visual Theme & Atmosphere

A premium K-12 learning platform that feels more like a modern game UI than a school app. Warm deep teal (`#00555A`) anchors a confident, grounded primary system. Mint (`#C3FDB8`) provides a fresh, energetic accent — like sunlight through leaves. The palette is tropical-meets-academic: serious enough for teachers, playful enough for students. Layouts are asymmetric but structured. Every interaction has a tactile, physical feel (spring press, cascade reveals). No generic shadcn/ui defaults.

## 2. Color Palette & Roles

### Primary: Deep Teal
- **Primary** (`#00555A`) — Primary buttons, active nav, key interactive elements
- **On Primary** (`#FFFFFF`) — Text/icon on primary surfaces
- **Primary Container** (`#C3FDB8`) — Light mint container for cards, banners, secondary emphasis
- **On Primary Container** (`#001F1F`) — Dark text on primary container
- **Inverse Primary** (`#9EE7E0`) — Primary on dark surfaces
- **Primary Fixed** (`#C3FDB8`) — Fixed variant for persistent elements
- **Primary Fixed Dim** (`#9EE7E0`) — Dimmed variant for hover/active states

### Accent: Fresh Mint
- **Accent** (`#C3FDB8`) — Badge dots, success states, highlight borders, secondary CTAs
- **On Accent** (`#003D3D`) — Text on accent surfaces
- **Accent Container** (`#00555A`) — Deep teal container for accent backgrounds
- **On Accent Container** (`#C3FDB8`) — Light text on accent containers

### Surfaces (Warm Neutral)
- **Surface** (`#F5F5F0`) — Main background — warm off-white with subtle green tint
- **Surface Dim** (`#E6E6E0`) — Dimmed surface, secondary backgrounds
- **Surface Bright** (`#FFFFFF`) — Cards, containers, elevated surfaces
- **Surface Container Lowest** (`#FFFFFF`) — Highest-elevation surfaces
- **Surface Container Low** (`#F5F5F0`) — Default container
- **Surface Container** (`#E6E6E0`) — Mid container
- **Surface Container High** (`#D6D6D0`) — Input backgrounds, subtle dividers
- **Surface Container Highest** (`#C6C6C0`) — Disabled states, pressed states
- **On Surface** (`#1A1A1E`) — Primary text — off-black, never pure black
- **On Surface Variant** (`#5A5A5E`) — Secondary text, descriptions, metadata
- **Outline** (`#1A1A1E`) — Borders, dividers, structural lines
- **Outline Variant** (`#1A1A1E` at 50%) — Subtle borders, disabled borders

### Feedback
- **Error** (`#BA1A1A`) — Error states, destructive actions
- **On Error** (`#FFFFFF`) — Text on error surfaces
- **Error Container** (`#FFDAD6`) — Error message backgrounds
- **Success** (`#2ECC71`) — Success states, completion badges
- **Warning** (`#F59E0B`) — Warning states

### Shadows
- **Shadow Sm** — `0 1px 2px 0 rgba(26,26,30,0.04)`
- **Shadow Md** — `0 4px 6px -1px rgba(26,26,30,0.06), 0 2px 4px -2px rgba(26,26,30,0.05)`
- **Shadow Lg** — `0 10px 15px -3px rgba(26,26,30,0.08), 0 4px 6px -4px rgba(26,26,30,0.05)`
- **Shadow Xl** — `0 20px 25px -5px rgba(26,26,30,0.1), 0 8px 10px -6px rgba(26,26,30,0.05)`

### Banned Colors
- Pure Black (`#000000`) — always use Off-Black `#1A1A1E`
- Purple/Violet neon gradients — the "AI Purple" aesthetic
- Academic Blue — replaced by Deep Teal
- Oversaturated accents above 80% saturation
- Mixed warm/cool gray systems

## 3. Typography Rules

- **Display/Headings:** `Outfit` (`--font-heading`) — Track-tight (`-0.02em to -0.04em`), weight-driven hierarchy (600-900), `clamp()` fluid scale
- **Body:** `Geist Sans` (`--font-geist-sans`) — Weight 400-500, relaxed leading (`1.6`), 65ch max-width
- **Mono:** `Geist Mono` — For code blocks, timestamps, metadata, dense numbers
- **Scale:** `clamp(2.25rem, 5vw, 3.75rem)` for display heads. Body at `1rem`. Labels at `0.75rem-0.875rem`

### Hierarchy
- Headlines through weight + size contrast (≥1.25 ratio between steps), never through all-caps
- `text-wrap: balance` on h1-h3, `text-wrap: pretty` on prose
- Display heading max: `clamp()` max ≤ 6rem (~96px). No shouting

### Banned Fonts
- `Inter` — banned for premium contexts
- Generic serif fonts (`Times New Roman`, `Georgia`, `Garamond`, `Palatino`) — always banned in dashboards and software UIs
- System font stacks as primary — use Geist/Outfit exclusively

## 4. Component Stylings

### Buttons
- Flat surfaces, no outer glow. Primary: Deep Teal fill with white text. Secondary: ghost/outline with Deep Teal border
- Active state: `scale(0.97)` — tactile push via `.press` class
- Hover: subtle background shift, never glow
- Minimum 44px tap target on mobile

### Cards
- White fill (`--surface-container-lowest`), `--radius-lg` (0.5rem), whisper border
- Shadow on hover via `.card-base` — translateY(-2px), shadow-md
- Used only when elevation communicates hierarchy
- High-density layouts: replace cards with border-top dividers

### Inputs/Forms
- Label above input, helper text optional, error text below in Error red
- Focus ring in Deep Teal, 2px offset
- No floating labels
- Standard 0.5rem gap between label-input-error stack

### Navigation
- Sleek, sticky header. Desktop: horizontal with generous spacing
- Mobile: slide-in overlay or hamburger
- Current route: Deep Teal underline or fill

### Loaders
- Skeletal shimmer matching exact layout dimensions (`skeleton-shimmer` class)
- Never circular spinners

### Empty States
- Composed illustration or icon + guidance text
- Never just "No data found"

### Badges
- Round pills. Gamification badges: mint accent for earned, Outline Variant for locked
- Badge shimmer effect on hover

## 5. Layout Principles

- **Grid-First:** CSS Grid for 2D layouts, Flexbox for 1D
- **Containment:** `max-width: 1280px`, centered. Padding: `1rem` mobile, `2rem` tablet, `4rem` desktop
- **Full-Height:** `min-h-[100dvh]` — never `h-screen` (iOS Safari)
- **Bento Grids:** Asymmetric layouts for feature sections — 2fr 1fr, 3-column with hero span, etc.
- **"3 equal cards"** pattern is BANNED. Use zig-zag, bento, or horizontal scroll instead
- **No overlapping elements** — every element in its own spatial zone

### Responsive
- Mobile-first collapse below 768px: all multi-column → single column
- No horizontal scroll on mobile
- Headlines scale via `clamp()`. Body text minimum 14px
- Touch targets minimum 44px, full-width buttons on mobile
- Section gaps: `clamp(3rem, 8vw, 6rem)`

## 6. Hero Section (For Landing/Marketing Pages)

- **Asymmetric Structure:** Centered heroes banned at variance > 4. Use split-screen, left-aligned + visual, or asymmetric whitespace
- **CTA Restraint:** Maximum one primary CTA. No secondary "Learn more" links
- **No filler text:** "Scroll to explore", bouncing chevrons, scroll arrows — all banned
- **No overlapping:** Text never overlaps images. Clean spatial separation

## 7. Motion & Interaction (Emil Kowalski Philosophy)

- **Easing:** `var(--ease-out)`: `cubic-bezier(0.23, 1, 0.32, 1)` — premium, weighty feel
- **Press:** `.press` class — `scale(0.97)` on `:active` with 160ms ease-out
- **Stagger:** `.stagger-enter` — `fadeInUp` 300ms ease-out, `calc(var(--index) * 80ms)` cascade delay
- **Hover Lift:** `.hover-lift` — `translateY(-2px)` on hover (touch-gated via `@media (hover: hover) and (pointer: fine)`)
- **Link Underline:** `.link-underline` — slide-in underline on hover
- **Reduced Motion:** All animations gated via `prefers-reduced-motion` — zero-duration fallback
- **Performance:** Animate only `transform` and `opacity`. Never `top`, `left`, `width`, `height`

## 8. Anti-Patterns (Banned — enforced by Impeccable)

- No emojis in UI, code, or alt text
- No `Inter` font — use Geist/Outfit exclusively
- No generic serif fonts
- No pure black (`#000000`) — use `#1A1A1E`
- No neon outer glows
- No gradient text (`background-clip: text`) — use solid color
- No glassmorphism as default
- No 3-column equal card grids
- No centered hero sections (high variance)
- No "Scroll to explore", bouncing chevrons, scroll arrows
- No generic names ("John Doe", "Acme") or fake round numbers
- No AI copywriting clichés ("Elevate", "Seamless", "Unleash", "Next-Gen")
- No side-stripe borders (left/right colored accent borders)
- No numbered section markers (01/02/03) as default scaffolding
- No tiny uppercase tracked eyebrow above every section
- No `z-index: 999` — use semantic scale
- No `h-screen` — always `min-h-[100dvh]`
- No circular loading spinners — skeletal shimmer only
- No nested cards — cards inside cards are always wrong
- No broken Unsplash links — use picsum.photos or SVG

## 9. Icon Strategy

- **Primary:** `lucide-react` (already installed, works with Next.js RSC)
- **Fallback:** `@phosphor-icons/react` via `src/components/ui/phosphor-icon.tsx` client wrapper
- **Import pattern:** `import { IconName } from "lucide-react"` for server components; `import { PhosphorIcon, PI } from "@/components/ui/phosphor-icon"` with `icon={PhosphorIconName}` for phosphor icons
- Phosphor wrapper uses `'use client'` directive to prevent "createContext is not a function" in RSC
- Both libraries included in `next.config.ts` `transpilePackages`
