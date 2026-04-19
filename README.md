# Ramzy — Personal Portfolio

A production-ready portfolio site for **Konde Ramzy Gbati** — builder, designer, and STEM educator.

Built with Next.js 14 (App Router), Tailwind CSS, Framer Motion, and the Resend API for contact-form email delivery.

---

## Stack

- **Framework** — Next.js 14 (App Router, TypeScript)
- **Styling** — Tailwind CSS v3 with a custom accent palette
- **Animations** — Framer Motion
- **Icons** — Lucide React
- **Fonts** — Inter (body) + Outfit (headings), via `next/font`
- **Theme** — `next-themes` (dark default, light toggle)
- **Forms** — React Hook Form + client-side validation
- **Email** — Resend (server route at `app/api/contact/route.ts`)
- **Hosting** — Vercel

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
│   ├── globals.css              Tailwind layers + design tokens
│   ├── layout.tsx               Metadata, fonts, theme provider
│   └── page.tsx                 Home page (composes every section)
├── components/
│   ├── About.tsx
│   ├── Achievements.tsx
│   ├── Contact.tsx
│   ├── Experience.tsx
│   ├── Footer.tsx
│   ├── Hero.tsx
│   ├── Navbar.tsx
│   ├── Projects.tsx
│   ├── SectionHeading.tsx
│   ├── ThemeProvider.tsx
│   └── ThemeToggle.tsx
├── data/
│   └── index.ts                 All site content as typed constants
├── lib/
│   └── utils.ts
├── public/
│   ├── favicon.svg
│   └── OG-IMAGE-PLACEHOLDER.md  Drop a 1200×630 `og-image.png` here
├── tailwind.config.ts
├── next.config.ts
├── vercel.json
└── README.md
```

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

`app/layout.tsx` references `/og-image.png` (1200 × 630). Drop your PNG into [`public/og-image.png`](./public) and delete the placeholder note.

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
- Motion used sparingly — no layout-shifting entrance animations
- Targets Lighthouse 90+ on Performance / Accessibility / SEO / Best Practices

---

## Scripts

| Command          | What it does                      |
| ---------------- | --------------------------------- |
| `npm run dev`    | Start the dev server              |
| `npm run build`  | Production build                  |
| `npm run start`  | Serve the production build        |
| `npm run lint`   | Run ESLint (`next lint`)          |

---

## License

Personal project. Feel free to use this as a reference; swap `data/index.ts` for your own content before deploying.
