# Ramzy Portfolio — uxderrick-style redesign

**Date:** 2026-10-23
**Status:** Proposed — awaiting approval
**Owner:** Konde Ramzy Gbati

## Intent

Bring the whole portfolio — home, about, built, learn, contact, and the shared
shell — up to the visual and structural quality of
[uxderrick.com](https://www.uxderrick.com). The goal is the *look and feel*: a
quiet white canvas, a wide three-column project gallery, a compact two-tier dark
dock, and a fixed editorial footer line. All content remains Ramzy's; none of
Derrick's copy, project names, or assets are reused.

The existing site already has the same information architecture (centered intro,
"Currently at" pill, cards, dark dock, five pages), which makes this a rebuild of
the presentation layer rather than a new site.

## Goals

- Match the reference's layout system across all five pages.
- Make the home gallery full-width, three columns on desktop, one column on
  mobile — no horizontal scrolling or clipped cards.
- Recreate the two-row dark dock (guest link + icon navigation) and the fixed
  uppercase footer with live Accra time.
- Restyle About, Built, Learn, and Contact to the reference's row/list/card
  patterns.
- Raise the cover art from simple CSS shapes to richer, self-contained product
  mockup covers.
- Keep the working Next.js setup, contact API, metadata, and Vercel deployment.

## Non-goals

- No project case-study pages (`/works/[slug]`). Gallery cards link to an
  existing external project URL when one exists, otherwise to `/built`.
- No CMS, blog, guestbook, dark mode, or new backend features.
- No new photography, AI-generated images, or downloaded assets.
- No copying of the reference's copy, projects, screenshots, or code.

## Anti-goals

- A horizontal card rail, clipped cards, or horizontal page scroll on any
  breakpoint.
- A "close enough" color-only restyle that leaves the old rail and text dock.
- Fabricated case studies or screenshots.
- Heavy entrance animations, parallax, or motion that competes with the work.

## Constraints

- Next.js 14 App Router, TypeScript, Tailwind CSS 3, Framer Motion and
  `lucide-react` already installed.
- Content lives in `data/index.ts`; do not move it into components.
- Contact form posts to `app/api/contact/route.ts` and must keep working.
- Inter is already loaded through `next/font`; no new font dependency needed.
- The reference is proprietary; reproduce the design language with original
  markup and Ramzy's content.
- The page outlines below are exhaustive for the new structure. Sections not
  listed are intentionally consolidated; existing copy is preserved in the
  places called out under About and Learn rather than silently dropped.

## Approaches considered

| # | Approach | Trade-off | Decision |
|---|----------|-----------|----------|
| A | Port the layout system into the existing Next.js app | Keeps SEO, API, routes, and deployment; requires rebuilding the visual components | **Chosen** |
| B | Rebuild as a static React/Vite clone | Closest to the reference's implementation, but throws away working Next.js infrastructure | Rejected |
| C | Keep current rail/dock and restyle only | Fastest, but keeps the exact problems being fixed | Rejected |

## Design system

All measurements below are taken from the reference at a 1440×960 viewport.

### Tokens

| Token | Value | Use |
|-------|-------|-----|
| `--background` | `#ffffff` | page |
| `--foreground` | `#242424` | headings, primary text |
| `--body` | `#6e6e73` | paragraphs |
| `--muted` | `#6e6e73` | secondary captions |
| `--soft` | `#999999` | decorative arrows only (never meaningful text) |
| `--border` | `#ececec` | pills, dividers |
| `--surface` | `#f7f7f8` | card/image fallback, contact card, fields |
| `--dock` | `#242424` | dock background |
| `--dock-active` | `#3b3b3b` | active nav pill |

### Type

- Family: Inter everywhere.
- Headline: 32px / 41.6px (1.3), weight 450, letter-spacing −0.8px
  (−0.025em), color `#242424`; muted continuation `#8e8e93` (large-text
  contrast 3.26:1, passes AA at 32px).
- Headline widths: 640px home, 600px about, 520px inner pages.
- Mobile headline: 26px / 1.32, tracking −0.02em.
- Body: 15px / 22.5px. Paragraph copy: 14px / 24px, color `#6e6e73`.
- Section label: 12px, `#6e6e73`.
- Card title: 15px, weight 500. Card caption: 14px, `#6e6e73`.
- List row title: 15px, weight 500. List caption: 13px, `#6e6e73`.
- Footer/dock guest text: uppercase, 12px, weight 600, letter-spacing 0.06em,
  color `rgba(0,0,0,0.65)`.
- All text uses `font-feature-settings: "ss01" 1, "cv11" 1`.

### Pills

- Height 36px, padding 8px 13px, radius 999px, 1px `#ececec` border, 12px text,
  color `#555`, white background. A leading 16px mark/logo may sit inside.

### Shell geometry

- Main scrolls with the page; dock and footer are fixed.
- Main top padding: 46px home/about, 72px list pages.
- Main bottom padding: 140px desktop, 190px mobile (clears dock + footer).
- Page gutter: 32px desktop, 20px mobile.
- Gallery max width: 1408px (32px gutter each side at 1440).
- Text/list column: 612px. Inner headline column: 520px. About timeline: 740px.
- Grid: 3 columns, 24px column gap, 36px row gap.
- Card image aspect ratio: 1.15 / 1. Desktop ≈ 439×381. Radius 18px.
- Card label row: 12px top margin.

### Fixed footer

- Full-width white bar, 64px tall, 22px horizontal padding, 10px bottom padding.
- 12px uppercase weight 600, tracking 0.06em, `rgba(0,0,0,0.65)`.
- Left: `KONDE RAMZY GBATI` + `BUILDER · DESIGNER · EDUCATOR`, 35px gap.
- Right: `ACCRA, GHANA` + live time (12-hour, e.g. `3:05 PM`) + year, 35px gap.
- Upward white glow (`box-shadow: 0 -10px 24px 12px #fff`) so gallery cards fade
  cleanly behind it.
- Mobile: two columns (identity left, place/time/year right), 10px text, ~88px
  tall, dock sits above it.

### Fixed dock

- 316px wide, 82px tall, radius 24px, `#242424`, 5px padding, bottom 46px,
  horizontally centered.
- Inset highlight plus soft shadow:
  `inset 0 1px 0 rgba(255,255,255,.03), 0 8px 24px rgba(0,0,0,.125), 0 2px 6px rgba(0,0,0,.08)`.
- Top row: 32px tall link "Leave a note ↗" → `/contact`, 11px, white/85.
- Divider: 1px white/10 between rows.
- Bottom row: five icon links in order Home, About, Built, Learn, Contact.
  Icons: `House`, `UserRound`, `BriefcaseBusiness`, `BookOpen`, `Mail`.
- Inactive: white/55 icon, hover white/85. Active: `#3b3b3b` pill with 1px
  white/6 border, white icon and label; Home's active pill shows icon only (as in
  the reference). Labels use 13px.
- Mobile: width `calc(100% - 32px)` capped at 358px, bottom 96px, icons evenly
  spaced; active label may truncate but never widens the dock beyond the screen.

## Shared components

- `SiteShell` (in `app/layout.tsx`): renders `children`, `FixedFooter`,
  `Dock`, and the skip link.
- `PageIntro`: pill/badge, headline with lead + muted remainder, optional
  subtitle, optional CTA. Handles the three width variants.
- `GalleryGrid` + `GalleryCard`: responsive 3/2/1-column grid and the card
  label row.
- `Dock`: client component for active route styling.
- `FixedFooter`: server-rendered structure with a small client `Clock` child.
- `Clock`: updates every 30 seconds in `Africa/Accra`, 12-hour format, renders a
  stable placeholder until mounted to avoid hydration mismatch.
- `HireButton`: retain copy-email behavior with the reference's black pill
  styling.
- `EmailCard`: contact card with email and copy button.
- `LinkList`: the 2-column social links with arrows used on Contact.

## Page designs

### Home

1. `Currently at University of Ghana` pill.
2. Headline: "I'm Ramzy, a builder, designer, and STEM educator." (ink) +
   "Currently studying Information Technology at the University of Ghana."
   (muted).
3. `Hire Ramzy` copy-email button.
4. Full-width gallery of nine cards, 44px below the button. No section heading —
   the reference lets the work lead.

Gallery order (projects first, then archive):

| # | Card | Cover direction | Links to |
|---|------|-----------------|----------|
| 1 | TraderWise — Advice for market traders | Green cover, wordmark, phone chat mockup with price/stock chips | GitHub |
| 2 | Notely — A calmer place to write | Blue/cream cover, desktop notes window with sidebar | GitHub |
| 3 | Home Lab — Practice, not theory | Teal cover, terminal window with nmap output and network nodes | `/built` |
| 4 | Makersplace — From kits to competition | Warm ochre cover, robot arena blocks and team badges | `/built` |
| 5 | Best Engineering Design — FLL Nationals, 3rd place | Trophy/medal object, large "3rd" | `/learn` |
| 6 | RoboFest International — 8th place | Medal with map/connection lines | `/learn` |
| 7 | World Robot Olympiad — 9th place | Award object with robot silhouette | `/learn` |
| 8 | STEM education — 100+ students mentored | Classroom/robots illustration and count | `/learn` |
| 9 | Robotics events — 12+ coached, judged, facilitated | Event badges and count | `/learn` |

Covers are original HTML/CSS/SVG compositions, not images. They should feel like
editorial product shots: layered UI windows, soft shadows, a large wordmark, and
one clear focal object. Each cover is decorative (`aria-hidden`) while the card
link carries the accessible name.

### About

- `Currently at` pill, headline "I build with purpose:" + muted continuation.
- Timeline, 740px wide: 2021–2027 year row, hairline, bars.
  - University of Ghana: dark current bar, 2025→2027, "Now".
  - Makersplace: light bar, 2025→2027, "Now".
  - Pioneer Robotics Club: light bar, 2023→2024.
  - Achimota School: light bar, 2021→2024.
  - Bars show organization and role; mobile scrolls the timeline horizontally
    inside its own container rather than clipping the page.
- Centered paragraph using the first two bio paragraphs, 520px, 14px/24px.
- "What I work with" section below the first viewport: label + two-column list
  of skill groups (title + items joined by `·`), matching the reference's muted
  label treatment.
- A single inline link "Ramzy on the interwebs ↗" → `/contact`.
- Content preservation: the "four disciplines" figure is kept in the paragraph;
  the social list is consolidated onto Contact (and remains one click away via
  the inline link), so About stays as quiet as the reference.

### Built

- Pill "Built by me", headline "Ideas I couldn't leave as ideas." (two lines),
  subtitle "Apps, experiments, and work with students."
- Label row: "Out in the world" / "4 projects".
- Four rows: 44px rounded thumbnail (mini cover gradient + icon), name, one-line
  descriptor, arrow at right. Row height 84px, 1px top border, hover darkens the
  arrow and nudges it 2px.
- Rows link to GitHub where available, otherwise `/contact`.

### Learn

- Pill "Learn with Ramzy", headline "Things I've learned, shared with you.",
  subtitle "Competitions, classrooms, and what the work taught me."
- Label row: "The library" / "5 entries".
- Rows with 44px gradient thumbnail + icon:
  - Best Engineering Design — FLL Nationals · 3rd place
  - RoboFest International — International placement · 8th place
  - World Robot Olympiad — WRO · 9th place
  - STEM workshops — 100+ students mentored
  - Robotics competitions — 12+ events coached or judged
- Static rows (no arrow) because no destination URLs exist; the visual rhythm is
  preserved without dead links.
- Below "The library", a second list heading "Where I spent the time" preserves
  the four experience entries and their descriptions. It uses the same row
  treatment, with role + period on one line, organization as the title, and the
  description as a 14px body line. This keeps existing copy that the reference-
  style library alone would have dropped.
- The four STATS numbers are preserved across the site: 3 international
  placements and 12+ events appear in the library rows, 100+ students appears in
  the STEM row, and the four-discipline breadth is stated in the About paragraph.

### Contact

- Pill "Let's talk", headline "Have something in mind?" + "I'd love to hear it."
- Subtitle: "A product to shape, a problem to untangle, or an idea worth
  exploring. Tell me what you're thinking."
- 612px light-surface email card, 18px radius, centered email (15px) and black
  `Copy email` pill.
- "Prefer a conversation?" row with `Send a mail ↗` (mailto).
- "Find me online" two-column grid: GitHub, LinkedIn, X, Email. Each row has a
  1px top border and an arrow on the right.
- Below the social grid, keep the existing contact form under "Or send a note",
  styled to match: 12px muted labels, surface fields with 14px radius, black
  submit pill. This is a deliberate addition to preserve working functionality;
  the reference itself has no form.

## Responsive behaviour

- `≥1024px`: 3-column gallery, 316px dock, one-line footer.
- `640–1023px`: 2-column gallery, full text widths, dock 316px.
- `<640px`: 1-column gallery, 20px gutters, 26px headline, stacked footer
  (identity left, place/time/year right), dock above footer.
- About timeline scrolls within its own container on narrow screens; no page
  horizontal overflow anywhere.
- Test at 1440, 1280, 1024, 768, 390, and 320px.

## Motion and interaction

- Cover scale `1.015` on card hover, 320ms `cubic-bezier(.2,.8,.2,1)`.
- Arrow color transitions from `#bbb` to `#242424`; no layout shift.
- Dock active pill fades/slides in 200ms.
- Copy-email shows "Email copied" + check for 1.8s.
- All motion is CSS-based and disabled under `prefers-reduced-motion: reduce`.

## Accessibility

- One `<main>` per page, `<nav aria-label="Main navigation">`, skip link.
- `aria-current="page"` on the active dock item.
- Visible focus rings (2px ink offset) on all links and buttons.
- Card covers marked `aria-hidden`; link labels include project name and tagline.
- Footer time includes `<time>` and an accessible label.
- Color contrast: `#6e6e73` on white is 5.08:1 and passes AA for normal text.
  `#8e8e93` is used only for the 32px muted headline (3.26:1, AA large-text
  threshold 3:1). `#999` is used only for decorative arrows. No AA exceptions
  are claimed or needed.
- No motion-only information.

## Performance

- Only one client component in the shell (`Dock`) plus the existing form and
  clock; pages stay server components.
- Covers are CSS/SVG, no image requests, no layout shift; reserve aspect ratio.
- No new dependencies.

## Implementation surface

Modify:

- `app/layout.tsx` — fonts, shell, skip link, footer, dock
- `app/page.tsx` — new gallery
- `app/about/page.tsx`, `app/built/page.tsx`, `app/learn/page.tsx`,
  `app/contact/page.tsx`
- `app/globals.css` — tokens and shared classes
- `tailwind.config.ts` — colors, fonts, shadows if needed
- `data/index.ts` — only additive fields required for covers/archive cards;
  existing exports keep their shapes where possible

Add/rewrite under `components/site/`:

- `PageIntro.tsx`, `GalleryGrid.tsx`, `GalleryCard.tsx`, `Dock.tsx`,
  `FixedFooter.tsx`, `Clock.tsx`, `EmailCard.tsx`, `LinkList.tsx`,
  `ProjectCover.tsx` (new original covers)
- `CurrentlyAt.tsx`, `HireButton.tsx` restyled

No deletion of unrelated legacy components (`Hero.tsx`, `Projects.tsx`, etc.);
they are already unused and out of scope.

## Verification

1. `npm run build` and `npm run lint` pass.
2. Side-by-side screenshots at 1440×960 and 390×844 against the live
   reference site for all five pages (the reference is a client-rendered app;
   no captures are stored in the repo). Re-measure only where content lengths
   make the reference spacing impossible to copy directly.
3. No horizontal overflow at any tested width.
4. Keyboard-only walkthrough of dock, cards, copy button, form; focus visible.
5. Contact form still reaches `/api/contact` (503 without env vars is expected).
6. Clock shows Accra time and does not trigger a hydration warning.
7. Lighthouse Performance/Accessibility/Best Practices/SEO ≥ 90 on Home.

## Decisions left to the builder

- Exact cover composition per card, within the directions above.
- Whether to keep the timeline horizontally scrollable or compress bars on very
  narrow screens.
- Micro-spacing within ±2px of the reference where content lengths differ.
- Whether the Learn rows without destinations keep a right-side spacer or a
  muted dot.
