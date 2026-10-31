# Ramzy — Personal Portfolio

A production-ready portfolio site for **Konde Ramzy Gbati** — builder, designer, and STEM educator.

Built with Next.js 14 (App Router), Tailwind CSS, Manrope, and the Resend API for contact-form email delivery.

---

## Stack

- **Framework** — Next.js 14 (App Router, TypeScript)
- **Styling** — Tailwind CSS v3 with CSS design tokens
- **Icons** — Custom inline SVG line icons
- **Fonts** — Manrope, self-hosted via `next/font/local`
- **Theme** — Light editorial palette (`#242424` ink on white)
- **Forms** — React Hook Form + client-side validation
- **Email** — Resend (server route at `app/api/contact/route.ts`)
- **Hosting** — Vercel
- **Tests** — Node's test runner + `puppeteer-core`

---

## Local development

### 1. Install dependencies

```bash
npm install
```

### 2. Set up environment variables

Copy the example file and fill in real values:

```bash
cp .env.local.example .env.local
```

| Variable              | Required | Purpose                                                                                   |
| --------------------- | -------- | ----------------------------------------------------------------------------------------- |
| `RESEND_API_KEY`      | Yes      | Resend API key — create at https://resend.com/api-keys                                    |
| `TO_EMAIL`            | Yes      | Inbox that receives contact-form messages                                                 |
| `FROM_EMAIL`          | No       | Verified Resend sender (defaults to `onboarding@resend.dev` while you're testing)         |
| `NEXT_PUBLIC_SITE_URL`| No       | Public site URL used for OpenGraph/canonical metadata                                     |

The contact form API route will return a clear `503` if `RESEND_API_KEY` or `TO_EMAIL` are missing — so the site builds and runs locally without email credentials.

### 3. Run the dev server

```bash
npm run dev
```

The site is live at [http://localhost:3000](http://localhost:3000).

### 4. Build locally

```bash
npm run build
npm run start
```

---

## Project layout

```
.
├── app/
│   ├── api/contact/route.ts     Resend email handler
│   ├── about/page.tsx           About + career timeline
│   ├── built/page.tsx           Project list
│   ├── contact/page.tsx         Email card, social links, form
│   ├── fonts/                   Self-hosted Manrope + OFL license
│   ├── learn/page.tsx           Achievements + experience list
│   ├── privacy/page.tsx         Contact form privacy note
│   ├── globals.css              Tailwind layers + design tokens
│   ├── layout.tsx               Metadata, font, dock, fixed footer
│   ├── not-found.tsx            Branded 404
│   └── page.tsx                 Home gallery
├── components/
│   └── site/                    Live shell and page components
│       ├── Dock.tsx             Fixed bottom navigation
│       ├── FixedFooter.tsx      Fixed identity/location bar
│       ├── PageIntro.tsx        Badge, headline, subtitle
│       ├── Reveal.tsx           IntersectionObserver section reveal
│       ├── GalleryGrid.tsx      Home card grid
│       ├── GalleryCard.tsx      Card image, label, arrow
│       ├── ProjectCover.tsx     Original CSS/SVG project art
│       ├── TaglineReveal.tsx    Word by word home tagline
│       ├── ListSection.tsx      Shared list column
│       ├── ListRow.tsx          Shared list row
│       ├── Timeline.tsx         About career timeline
│       ├── EmailCard.tsx        Copy-email surface
│       ├── icons.tsx            Custom inline SVG line icons
│       └── ContactForm.tsx      Working contact form
├── data/
│   └── index.ts                 All site content as typed constants
├── lib/
│   ├── projects.ts              Project link resolution
│   └── utils.ts                 Class-name helpers
├── tests/
│   ├── helpers.mjs              Shared browser harness
│   └── ui.test.mjs              Responsive, a11y, and content tests
├── scripts/capture.mjs          Screenshot capture
├── public/
│   ├── favicon.svg
│   ├── og-cover.jpg             1200x630 social preview
│   └── og-image.jpg             Original portrait
├── tailwind.config.ts
├── next.config.mjs
├── vercel.json
└── README.md
```

Root-level components from the earlier design are still in the repository but are
not mounted; the live site imports everything from `components/site`.

---

## Updating content

**All copy lives in [`data/index.ts`](./data/index.ts)** as typed TypeScript constants. Edit that file — don't touch components — and the changes flow through the whole site.

| What you want to change         | Export to edit       |
| ------------------------------- | -------------------- |
| Name, bio, email, initials      | `OWNER`              |
| Social links (GitHub, X, etc.)  | `SOCIAL_LINKS`       |
| Hero role rotation              | `ROLE_ROTATION`      |
| Skill chips                     | `SKILL_GROUPS`       |
| Project cards                   | `PROJECTS`           |
| Timeline entries                | `EXPERIENCE`         |
| Achievement cards               | `ACHIEVEMENTS`       |
| Nav links                       | `NAV_LINKS`          |

Each export is strictly typed, so TypeScript will flag missing or malformed fields before you ship.

### OG / share image

`public/og-cover.jpg` is a 1200×630 crop of the portrait. The layout includes it
in both OpenGraph and Twitter metadata, so shared links render a consistent
preview. The original portrait remains at `public/og-image.jpg`.

---

## Design QA

The visual layer is covered by browser tests against a running dev server.

```bash
# terminal 1
npm run dev

# terminal 2
npm run test:ui
```

`npm run test:ui` checks all five routes at 320, 390, 768, 1024, and 1440px for
horizontal overflow, console/page errors, accessible control names, and visible
skip-link focus. It also covers page content and the contact form.

The suite uses `puppeteer-core` with an installed Chrome or Edge. It searches
common install paths; set `CHROME_PATH` if your browser lives elsewhere:

```powershell
$env:CHROME_PATH = "C:\Program Files\Google\Chrome\Application\chrome.exe"
```

Set `BASE_URL` to test a different server (defaults to `http://localhost:3000`).

To refresh the ten review screenshots at 1440×960 and 390×844:

```bash
npm run capture
```

Captures are written to `tests/screenshots/` and are not committed.

The dev-only webpack filesystem cache is disabled in `next.config.mjs` to avoid
a Windows heap limit during long dev sessions. Production builds keep Next's
default cache.

---

## Deploying to Vercel

### Option A — GitHub integration (recommended)

1. Push this repo to GitHub.
2. Go to [vercel.com/new](https://vercel.com/new), import the repo.
3. Vercel auto-detects Next.js — no custom build settings needed.
4. In **Settings → Environment Variables**, add:
   - `RESEND_API_KEY`
   - `TO_EMAIL`
   - `FROM_EMAIL` *(optional)*
   - `NEXT_PUBLIC_SITE_URL` *(optional — set to your final domain)*
5. Click **Deploy**. Subsequent pushes to the main branch auto-deploy.

### Option B — Vercel CLI

```bash
npm i -g vercel
vercel          # first run links/creates the project
vercel --prod   # ships to production
```

Add the same env vars through `vercel env add` or the dashboard.

---

## Accessibility & performance

- Semantic landmarks (`<nav>`, `<main>`, `<section>`, `<footer>`)
- Skip-to-content link, ARIA labels on every interactive element
- Focus-visible rings on all links/buttons
- `next/font` with `display: swap`
- Motion used sparingly — the home tagline activates word by word and all animation respects `prefers-reduced-motion`
- Flat backgrounds and CSS/SVG project covers — no stock imagery
- Targets Lighthouse 90+ on Performance / Accessibility / SEO / Best Practices

---

## Scripts

| Command           | What it does                                         |
| ----------------- | ---------------------------------------------------- |
| `npm run dev`     | Start the dev server                                 |
| `npm run build`   | Production build                                     |
| `npm run start`   | Serve the production build                           |
| `npm run lint`    | Run ESLint (`next lint`)                             |
| `npm run test:ui` | Browser tests (requires the dev server)              |
| `npm run capture` | Write review screenshots to `tests/screenshots/`     |

---

## License

Personal project. Feel free to use this as a reference; swap `data/index.ts` for your own content before deploying.
