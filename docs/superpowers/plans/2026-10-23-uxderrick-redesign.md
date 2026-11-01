# uxderrick-style Portfolio Redesign — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild the presentation layer of Ramzy's five-page portfolio to match the reference site's white gallery, two-tier dock, fixed footer, and list-page patterns, using only Ramzy's content.

**Architecture:** Keep the existing Next.js app and data layer. Replace the page-level components with a small shared shell (`Dock`, `FixedFooter`, `PageIntro`) and reusable content primitives (`GalleryGrid`, `GalleryCard`, `ListSection`, `ListRow`). Covers become original CSS/SVG compositions. Pages stay server components; only the dock, clock, copy button, and contact form are client components.

**Tech Stack:** Next.js 14 App Router, TypeScript, Tailwind CSS 3, `lucide-react`, `next/font` Inter. Tests use Node's built-in test runner plus `puppeteer-core` driving the installed Chrome.

**Spec:** `docs/superpowers/specs/2026-10-23-uxderrick-redesign-design.md`

## Global Constraints

- Next.js 14.2.15, React 18, Tailwind 3. No new runtime dependencies.
- Content stays in `data/index.ts`. Do not hard-code project or bio copy in components.
- Palette: background `#ffffff`, ink `#242424`, body/caption `#6e6e73`, headline mute `#8e8e93`, border `#ececec`, surface `#f7f7f8`, dock `#242424`, dock-active `#3b3b3b`.
- Type: Inter; headline 32px/1.3, weight 450, tracking −0.025em on desktop and 26px on mobile; body 15px/1.5; captions 13–14px.
- Geometry: page gutter 32px desktop / 20px mobile; gallery max 1408px; text column 612px; inner headline 520px; 3/2/1 gallery columns at ≥1024 / ≥640 / below 640.
- Shell: dock 316px wide, 82px tall, radius 24px, bottom 46px; footer fixed, 64px tall, uppercase 12px/600, tracking 0.06em.
- Page top padding: Home and About `24px` mobile / `46px` desktop; Built, Learn, Contact `32px` mobile / `72px` desktop.
- Home intro spacing: pill, headline 40px below, CTA 28px below, gallery 44px below.
- No horizontal page overflow at 320, 390, 768, 1024, 1440.
- No copied reference copy, project names, screenshots, or assets. No `<img>` or external image requests in covers.
- Add `data-testid` / `data-*` hooks named exactly in the tasks; tests depend on them.
- Tests run against a dev server at `BASE_URL` (default `http://localhost:3000`). `npm run test:ui` must pass.
- Every interactive element has an accessible name and a visible `:focus-visible` outline.
- Respect `prefers-reduced-motion`; no scroll-triggered entrance animations.

## Review Focus

- **320–390px viewport:** one-column gallery, dock narrower than the screen, footer does not cover content, no horizontal scroll.
- **Long content strings:** long project names, captions, and social labels wrap or truncate without pushing arrows off-screen or widening the dock.
- **Client-side navigation:** dock active pill and `aria-current` update on route change, including back/forward.
- **Clipboard and form failure paths:** clipboard denial falls back to `mailto:`; empty form submit shows validation; API `503` shows a friendly message.
- **Keyboard and hydration:** first Tab reaches the skip link with a visible outline; the live clock renders a placeholder first and never causes a hydration error.

---

## File Structure

Create:

- `components/site/Dock.tsx` — fixed two-tier navigation.
- `components/site/FixedFooter.tsx` — fixed editorial footer.
- `components/site/Clock.tsx` — Accra time client leaf.
- `components/site/GalleryGrid.tsx` — responsive 3/2/1 grid.
- `components/site/GalleryCard.tsx` — cover + label row + arrow.
- `components/site/ListSection.tsx` — label/count header + bordered list.
- `components/site/ListRow.tsx` — reusable thumbnail/title/caption/arrow row.
- `components/site/EmailCard.tsx` — contact email card.
- `components/site/LinkList.tsx` — two-column arrow link grid.
- `components/site/Timeline.tsx` — About timeline.
- `lib/projects.ts` — project destination helper.
- `tests/ui.test.mjs`, `tests/helpers.mjs` — UI test harness.
- `scripts/capture.mjs` — viewport screenshot capture.

Modify:

- `app/layout.tsx`, `app/page.tsx`, all four subpage files.
- `app/globals.css`, `tailwind.config.ts`, `data/index.ts`, `package.json`, `.gitignore`.
- `components/site/PageIntro.tsx`, `CurrentlyAt.tsx`, `HireButton.tsx`, `ProjectCover.tsx`, `ContactForm.tsx`.

Leave legacy components (`Hero.tsx`, `Projects.tsx`, etc.) untouched.

---

### Task 1: Test harness + fixed shell

**Files:**
- Modify: `package.json`, `app/layout.tsx`, `app/globals.css`, `tailwind.config.ts`
- Create: `tests/helpers.mjs`, `tests/ui.test.mjs`, `components/site/Dock.tsx`, `components/site/FixedFooter.tsx`, `components/site/Clock.tsx`

**Interfaces:**
- Consumes: `NAV_LINKS`, `OWNER` from `@/data`.
- Produces: `<Dock />`, `<FixedFooter />`, `<Clock />`; CSS tokens `ink`, `body`, `muted`, `line`, `surface`; `data-testid="dock"` and `data-testid="site-footer"` for later tests.

- [ ] **Step 1: Install the test dependency and scripts**

Run:
```powershell
npm install -D puppeteer-core
```
Add to `package.json` scripts:
```json
"test:ui": "node --test tests/ui.test.mjs",
"capture": "node scripts/capture.mjs"
```
Add `tests/screenshots/` to `.gitignore`.

- [ ] **Step 2: Write the failing shell test**

In `tests/helpers.mjs`, export `BASE_URL`, a Chrome-path resolver, `launchBrowser()`, and `withPage(path, viewport, fn)`. Resolve Chrome from `CHROME_PATH`, then common Windows/macOS/Linux paths; fail with a clear message if none exist. Use `puppeteer.launch({ headless: "new", args: ["--no-sandbox"] })`. `withPage` must wait for network idle, attach `page.__errors = []`, and record console errors and `pageerror`s.

In `tests/ui.test.mjs`:
```js
test("shell renders the dock, footer, and live clock on every page", async () => {
  await withPage("/", { width: 1440, height: 960 }, async (page) => {
    assert.equal(await page.$$eval('[data-testid="dock"] [data-nav-item]', (els) => els.length), 5);
    const footer = await page.$eval('[data-testid="site-footer"]', (el) => el.textContent);
    assert.match(footer, /KONDE RAMZY GBATI/i);
    assert.match(footer, /ACCRA, GHANA/i);
    assert.match(footer, new RegExp(String(new Date().getFullYear())));
    await page.waitForFunction(() => /\d{1,2}:\d{2}\s?(AM|PM)/.test(document.querySelector('[data-testid="site-footer"]')?.textContent ?? ""));
    assert.equal(await page.$eval('[data-testid="dock"] a[aria-current="page"]', (el) => el.getAttribute("aria-label")), "Home");
  });
  await withPage("/about", { width: 1440, height: 960 }, async (page) => {
    assert.equal(await page.$eval('[data-testid="dock"] a[aria-current="page"]', (el) => el.getAttribute("aria-label")), "About");
    assert.equal(await page.$$eval('[data-testid="dock"] [data-nav-item]', (els) => els.length), 5);
  });
});
```

- [ ] **Step 3: Run the test and verify it fails**

Run: `npm run test:ui` (with `npm run dev` running in another terminal).
Expected: FAIL — `[data-testid="dock"]` not found.

- [ ] **Step 4: Implement the tokens and shell**

- `tailwind.config.ts`: add `ink`, `body`, `muted`, `line`, `surface` colors; keep Inter as the sans family.
- `app/globals.css`: set the palette and selection colors; add `.headline` (32px desktop, 26px mobile, weight 450, tracking −0.025em), `.headline-mute`, `.pill` (36px, 12px text, `#ececec` border), and a shared `:focus-visible` outline.
- `Dock.tsx`: client component using `usePathname`; render the top `/contact` "Leave a note ↗" link, then five links with `data-nav-item` and `aria-label`, icons `House`, `UserRound`, `BriefcaseBusiness`, `BookOpen`, `Mail`; active link gets `aria-current="page"` and the `#3b3b3b` pill. Home's active pill shows the icon only. Fixed classes per spec.
- `FixedFooter.tsx`: fixed white footer, uppercase name + tagline left, location + `<Clock />` + year right; mobile two-column layout; `data-testid="site-footer"`.
- `Clock.tsx`: client; `Intl.DateTimeFormat("en-US", { hour: "numeric", minute: "2-digit", hour12: true, timeZone: "Africa/Accra" })`; render `--:--` until mounted; update every 30s.
- `app/layout.tsx`: render `<div className="min-h-screen pb-[190px] md:pb-[140px]">{children}</div>`, `<FixedFooter />`, `<Dock />`; remove the `BottomNav` import; keep the skip link. The wrapper padding is what keeps the last content clear of the fixed footer and dock.

- [ ] **Step 5: Run tests and verify they pass**

Run: `npm run test:ui`
Expected: PASS for the shell test; no console or page errors.

- [ ] **Step 6: Commit**

```bash
git add package.json package-lock.json .gitignore app/layout.tsx app/globals.css tailwind.config.ts components/site/Dock.tsx components/site/FixedFooter.tsx components/site/Clock.tsx tests/
git commit -m "feat: add fixed dock, footer, and UI test harness"
```

---

### Task 2: Page intro, pill, and copy-email CTA

**Files:**
- Modify: `components/site/PageIntro.tsx`, `components/site/CurrentlyAt.tsx`, `components/site/HireButton.tsx`, `app/page.tsx`
- Test: `tests/ui.test.mjs`

**Interfaces:**
- Consumes: `OWNER`, `CurrentlyAt`, `HireButton`.
- Produces: `<PageIntro badge? lead mute? subtitle? width="home"|"about"|"inner">{children}</PageIntro>`; `<HireButton label? size="md"|"sm" />`.

- [ ] **Step 1: Write the failing intro test**

```js
test("home intro renders the pill, split headline, and copy-email CTA", async () => {
  await withPage("/", { width: 1440, height: 960 }, async (page) => {
    const h1 = await page.$eval("h1", (el) => el.textContent);
    assert.match(h1, /I’m Ramzy/);
    assert.match(h1, /University of Ghana/);
    assert.match(await page.$eval(".pill", (el) => el.textContent), /Currently at/);
    await page.evaluate(() => {
      window.__copied = "";
      Object.defineProperty(navigator, "clipboard", {
        configurable: true,
        value: { writeText: async (text) => { window.__copied = text; } },
      });
    });
    const button = await page.$("button");
    await button.click();
    await page.waitForFunction(() => document.querySelector("button")?.textContent?.includes("Email copied"));
    assert.equal(await page.evaluate(() => window.__copied), "konderamzy30@gmail.com");
  });
});
```

- [ ] **Step 2: Run and verify it fails**

Run: `npm run test:ui`
Expected: FAIL — headline or pill does not match the new structure.

- [ ] **Step 3: Implement**

- `PageIntro`: centered header; renders `CurrentlyAt` unless `badge` is passed; h1 with lead + `headline-mute` remainder; optional subtitle (13px, `#6e6e73`); optional children; width map `home: 640px`, `about: 600px`, `inner: 520px`.
- `CurrentlyAt`: 36px pill, 12px text, `Currently at`, 18px rounded UG mark, organization name.
- `HireButton`: keep copy/fallback behavior; `md` = `px-[18px] py-[11px] text-[13px]`, `sm` = `px-4 py-2 text-[12px]`; black pill, white text.
- Home page: `<main className="pt-6 md:pt-[46px]">`; pass `width="home"` and `<HireButton />`; leave the gallery section unchanged for now.

- [ ] **Step 4: Run tests and verify they pass**

Run: `npm run test:ui`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add components/site/PageIntro.tsx components/site/CurrentlyAt.tsx components/site/HireButton.tsx app/page.tsx tests/ui.test.mjs
git commit -m "feat: rebuild page intro and copy-email CTA"
```

---

### Task 3: Home gallery and archive data

**Files:**
- Modify: `data/index.ts`, `app/page.tsx`
- Create: `lib/projects.ts`, `components/site/GalleryGrid.tsx`, `components/site/GalleryCard.tsx`
- Test: `tests/ui.test.mjs`

**Interfaces:**
- Consumes: `PROJECTS`, `ARCHIVE`, `projectHref()`.
- Produces: `<GalleryGrid>`, `<GalleryCard href name caption external?>{cover}</GalleryCard>`; `ArchiveItemType` and `ARCHIVE: ArchiveItemType[]` with `kind: "fll" | "robofest" | "wro" | "stem" | "events"`.

- [ ] **Step 1: Write the failing gallery test**

```js
test("home renders nine cards in a responsive 3/2/1 gallery", async () => {
  for (const [width, expected] of [[1440, 3], [768, 2], [390, 1]]) {
    await withPage("/", { width, height: 900 }, async (page) => {
      assert.equal(await page.$$eval('[data-testid="gallery-card"]', (els) => els.length), 9);
      const columns = await page.$eval('[data-testid="gallery-grid"]', (el) => getComputedStyle(el).gridTemplateColumns.split(" ").length);
      assert.equal(columns, expected);
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1), true);
    });
  }
  await withPage("/", { width: 1440, height: 960 }, async (page) => {
    assert.equal(await page.$eval('a[aria-label^="TraderWise"]', (el) => el.getAttribute("href")), "https://github.com/ramzyq/traderwise");
    assert.equal(await page.$eval('a[aria-label^="Home Lab"]', (el) => el.getAttribute("href")), "/built");
    assert.equal(await page.$eval('a[aria-label^="STEM education"]', (el) => el.getAttribute("href")), "/learn");
    assert.equal(await page.$$eval('[data-testid="gallery-card"] [data-cover][aria-hidden="true"]', (els) => els.length), 9);
  });
});
```

- [ ] **Step 2: Run and verify it fails**

Run: `npm run test:ui`
Expected: FAIL — zero gallery cards.

- [ ] **Step 3: Implement**

- `data/index.ts`: add `ArchiveKind`, `ArchiveItemType`, and `ARCHIVE` with the five items and captions from the spec (`/learn` destinations).
- `lib/projects.ts`: `export function projectHref(project: ProjectType): string { return project.github ?? project.demo ?? "/built"; }`.
- `GalleryGrid`: `mx-auto grid w-full max-w-[1440px] grid-cols-1 gap-x-6 gap-y-9 px-5 sm:grid-cols-2 lg:grid-cols-3 lg:px-8`, `data-testid="gallery-grid"`.
- `GalleryCard`: link with `aria-label={`${name}. ${caption}`}`, `data-testid="gallery-card"`; cover wrapper `data-cover aria-hidden="true"` with `aspect-[1.15/1] overflow-hidden rounded-[18px] bg-surface`; inner wrapper scales to 1.015 on hover unless reduced motion; label row 12px below with 15px/500 title, 14px caption, `ArrowUpRight` at `#bbb` → ink on hover.
- Home: intro + a wrapper with `mt-11` around `<GalleryGrid>`, mapping `PROJECTS` then `ARCHIVE`; use the existing `ProjectCover` for projects and a simple gradient `ArchiveCover` placeholder for archive kinds. Remove the old rail, achievements strip, and trailing "Leave a note" link.

- [ ] **Step 4: Run tests and verify they pass**

Run: `npm run test:ui`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add data/index.ts lib/projects.ts components/site/GalleryGrid.tsx components/site/GalleryCard.tsx app/page.tsx tests/ui.test.mjs
git commit -m "feat: replace home rail with responsive archive gallery"
```

---

### Task 4: Original product and archive covers

**Files:**
- Modify: `components/site/ProjectCover.tsx`
- Create: `scripts/capture.mjs`
- Test: `tests/ui.test.mjs`

**Interfaces:**
- Consumes: `ProjectType`, `ArchiveKind`.
- Produces: `ProjectCover({ project })` and `ArchiveCover({ kind })`; all covers render inside the `data-cover` wrapper from `GalleryCard`.

- [ ] **Step 1: Write the failing cover test**

```js
test("covers are image-free, correctly proportioned, and do not overflow", async () => {
  await withPage("/", { width: 1440, height: 960 }, async (page) => {
    assert.equal(await page.$$eval('[data-testid="gallery-card"] img', (els) => els.length), 0);
    const ratios = await page.$$eval('[data-cover]', (els) => els.map((el) => {
      const r = el.getBoundingClientRect();
      return { ratio: r.width / r.height, overflow: el.scrollWidth - el.clientWidth };
    }));
    assert.equal(ratios.length, 9);
    for (const { ratio, overflow } of ratios) {
      assert.ok(Math.abs(ratio - 1.15) < 0.03, `ratio ${ratio}`);
      assert.ok(overflow <= 1, `cover overflow ${overflow}`);
    }
  });
  await withPage("/", { width: 390, height: 900 }, async (page) => {
    const overflows = await page.$$eval('[data-cover]', (els) => els.map((el) => el.scrollWidth - el.clientWidth));
    assert.ok(overflows.every((n) => n <= 1));
  });
});
```

- [ ] **Step 2: Run and verify it fails**

Run: `npm run test:ui`
Expected: FAIL — covers overflow or are missing.

- [ ] **Step 3: Implement the nine covers**

Rewrite `ProjectCover.tsx` with a shared wordmark/title treatment and one composition per card. All decorative, all text inside the cover uses `%`/`clamp()` sizing so it never clips:

- TraderWise: green field, wordmark, phone chat window, Price/Stock/Ask chips, advice bubble.
- Notely: blue/cream field, desktop notes window with sidebar and note lines.
- Home Lab: teal field, terminal window with nmap lines, network nodes.
- Makersplace: ochre field, arena blocks, small robot, team badges.
- FLL (fll): trophy, large "3rd", "FLL Nationals".
- RoboFest (robofest): medal, "8th", map/connection lines.
- WRO (wro): award object, "9th", robot silhouette.
- STEM (stem): classroom/robots, "100+", "students mentored".
- Events (events): event badges, "12+", "events".

Use inline SVG for objects where CSS shapes would be fragile. No external URLs or images.

- [ ] **Step 4: Add the screenshot capture script**

`scripts/capture.mjs` launches Chrome, visits all five routes at 1440×960 and 390×844, scrolls through each page, and writes `tests/screenshots/<page>-<width>.png`. Use the same Chrome resolver as the tests.

- [ ] **Step 5: Run tests and capture screenshots**

Run: `npm run test:ui` → PASS.
Run: `npm run capture` with the dev server running.
Expected: ten screenshots; visually inspect Home at both widths against the reference.

- [ ] **Step 6: Commit**

```bash
git add components/site/ProjectCover.tsx scripts/capture.mjs tests/ui.test.mjs
git commit -m "feat: add original product and archive cover art"
```

---

### Task 5: About page and timeline

**Files:**
- Modify: `app/about/page.tsx`
- Create: `components/site/Timeline.tsx`
- Test: `tests/ui.test.mjs`

**Interfaces:**
- Consumes: `EXPERIENCE`, `TIMELINE_YEARS`, `SKILL_GROUPS`, `OWNER`.
- Produces: `<Timeline />` with four `data-testid="timeline-bar"` elements, exactly one marked `data-current="true"`.

- [ ] **Step 1: Write the failing About test**

```js
test("about page renders the timeline, skills, and contact link", async () => {
  await withPage("/about", { width: 1440, height: 960 }, async (page) => {
    assert.match(await page.$eval("h1", (el) => el.textContent), /I build with purpose/);
    assert.equal(await page.$$eval('[data-testid="timeline-bar"]', (els) => els.length), 4);
    assert.equal(await page.$$eval('[data-testid="timeline-bar"][data-current="true"]', (els) => els.length), 1);
    assert.equal(await page.$$eval('[data-testid="skill-group"]', (els) => els.length), 5);
    assert.match(await page.$eval('[data-testid="interwebs-link"]', (el) => el.getAttribute("href")), /\/contact/);
  });
  await withPage("/about", { width: 390, height: 900 }, async (page) => {
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1), true);
  });
});
```

- [ ] **Step 2: Run and verify it fails**

Run: `npm run test:ui`
Expected: FAIL — timeline test hooks are missing.

- [ ] **Step 3: Implement**

- `Timeline`: 740px wide; 7-year label row; hairline; four bars from `EXPERIENCE` using the existing percentage helpers; University of Ghana is the dark current bar with "Now"; Makersplace is light but also "Now"; bars show organization + role; horizontal scroll container on mobile.
- About page: `<main className="pt-6 md:pt-[46px]">`; `PageIntro width="about"` with `OWNER.aboutLead` / `aboutMute`; timeline; 520px paragraph using the first two `bioLong` entries plus the four-discipline sentence; "What I work with" label + `data-testid="skill-group"` two-column groups; "Ramzy on the interwebs ↗" link with `data-testid="interwebs-link"` to `/contact`.

- [ ] **Step 4: Run tests and verify they pass**

Run: `npm run test:ui`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add app/about/page.tsx components/site/Timeline.tsx tests/ui.test.mjs
git commit -m "feat: rebuild about page with reference timeline"
```

---

### Task 6: Built page and list primitives

**Files:**
- Modify: `app/built/page.tsx`
- Create: `components/site/ListSection.tsx`, `components/site/ListRow.tsx`
- Test: `tests/ui.test.mjs`

**Interfaces:**
- Consumes: `PROJECTS`, `projectHref()`.
- Produces: `<ListSection label count? section?: string>`, `<ListRow href? title caption meta? thumbnail? arrow?>`. `ListSection` renders `data-section={section}` and `ListRow` renders `data-testid="list-row"`.

- [ ] **Step 1: Write the failing Built test**

```js
test("built page renders four linked project rows", async () => {
  await withPage("/built", { width: 1440, height: 960 }, async (page) => {
    assert.match(await page.$eval("h1", (el) => el.textContent), /Ideas I couldn’t/);
    assert.match(await page.$eval('[data-section="projects"]', (el) => el.textContent), /4 projects/);
    assert.equal(await page.$$eval('[data-testid="list-row"]', (els) => els.length), 4);
    assert.equal(await page.$$eval('[data-testid="list-row"] a[href]', (els) => els.length), 4);
    assert.equal(await page.$$eval('[data-testid="list-row"] svg', (els) => els.length >= 4), true);
  });
});
```

- [ ] **Step 2: Run and verify it fails**

Run: `npm run test:ui`
Expected: FAIL — rows or section hooks missing.

- [ ] **Step 3: Implement**

- `ListSection`: 612px column; 12px label + right-aligned count; top border; `data-section`.
- `ListRow`: `<li data-testid="list-row">` with 1px bottom border; optional 44px rounded thumbnail; 15px/500 title; 13px `#6e6e73` caption; optional 12px meta; right arrow; when `href` is present, render the contents inside a link with `href`, `aria-label`, and `group` hover (arrow nudges 2px).
- Built page: `<main className="pt-8 md:pt-[72px]">`; `PageIntro width="inner"` with badge "Built by me", headline "Ideas I couldn't leave as ideas.", subtitle "Apps, experiments, and work with students."; `ListSection label="Out in the world"` count="4 projects" section="projects"; four rows using a 44px gradient thumbnail and `projectHref`.

- [ ] **Step 4: Run tests and verify they pass**

Run: `npm run test:ui`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add app/built/page.tsx components/site/ListSection.tsx components/site/ListRow.tsx tests/ui.test.mjs
git commit -m "feat: rebuild built page with shared list primitives"
```

---

### Task 7: Learn page

**Files:**
- Modify: `app/learn/page.tsx`
- Test: `tests/ui.test.mjs`

**Interfaces:**
- Consumes: `ACHIEVEMENTS`, `EXPERIENCE`, `STATS`, `ListSection`, `ListRow`.
- Produces: two sections: `data-section="library"` with five rows and `data-section="experience"` with four rows.

- [ ] **Step 1: Write the failing Learn test**

```js
test("learn page renders the library and experience lists without dead links", async () => {
  await withPage("/learn", { width: 1440, height: 960 }, async (page) => {
    assert.equal(await page.$$eval('[data-section="library"] [data-testid="list-row"]', (els) => els.length), 5);
    assert.equal(await page.$$eval('[data-section="experience"] [data-testid="list-row"]', (els) => els.length), 4);
    assert.match(await page.$eval('[data-section="experience"]', (el) => el.textContent), /Coursework:/);
    assert.equal(await page.$$eval('a[href=""]', (els) => els.length), 0);
    assert.equal(await page.$$eval('a[href="#"]', (els) => els.length), 0);
  });
});
```

- [ ] **Step 2: Run and verify it fails**

Run: `npm run test:ui`
Expected: FAIL — the current Learn page has stats, not these sections.

- [ ] **Step 3: Implement**

- Header: badge "Learn with Ramzy", headline "Things I've learned, shared with you.", subtitle "Competitions, classrooms, and what the work taught me."
- Page: `<main className="pt-8 md:pt-[72px]">`.
- Library: 5 static rows (no arrows) — three achievements from `ACHIEVEMENTS`, plus STEM workshops (100+ students) and robotics events (12+ events). Use 44px gradient thumbnails with the achievement icon or a lucide icon.
- Experience: label "Where I spent the time"; four rows from `EXPERIENCE` with organization as title, role + period as meta, description as a 14px body line. No arrows.

- [ ] **Step 4: Run tests and verify they pass**

Run: `npm run test:ui`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add app/learn/page.tsx tests/ui.test.mjs
git commit -m "feat: rebuild learn page as library and experience lists"
```

---

### Task 8: Contact page

**Files:**
- Modify: `app/contact/page.tsx`, `components/site/ContactForm.tsx`
- Create: `components/site/EmailCard.tsx`, `components/site/LinkList.tsx`
- Test: `tests/ui.test.mjs`

**Interfaces:**
- Consumes: `OWNER`, `SOCIAL_LINKS`, `HireButton`.
- Produces: `<EmailCard />`, `<LinkList links={SOCIAL_LINKS} />`; contact form remains wired to `/api/contact`.

- [ ] **Step 1: Write the failing Contact test**

```js
test("contact page renders the email card, social grid, and working form", async () => {
  await withPage("/contact", { width: 1440, height: 960 }, async (page) => {
    assert.match(await page.$eval("h1", (el) => el.textContent), /Have something in mind/);
    assert.match(await page.textContent('[data-testid="email-card"]'), /konderamzy30@gmail\.com/);
    assert.equal(await page.$$eval('[data-testid="social-link"]', (els) => els.length), 4);
    assert.equal(await page.$$eval('form input', (els) => els.length), 3);
    assert.equal(await page.$$eval('form textarea', (els) => els.length), 1);
    await page.evaluate(() => {
      window.__copied = "";
      Object.defineProperty(navigator, "clipboard", {
        configurable: true,
        value: { writeText: async (text) => { window.__copied = text; } },
      });
    });
    await page.click('[data-testid="email-card"] button');
    await page.waitForFunction(() => document.querySelector('[data-testid="email-card"] button')?.textContent?.includes("Email copied"));
    assert.equal(await page.evaluate(() => window.__copied), "konderamzy30@gmail.com");
    await page.click('form button[type="submit"]');
    await page.waitForFunction(() => document.body.textContent.includes("Please enter your name."));
    assert.match(await page.textContent("form"), /Please enter your email\./);
  });
  await withPage("/contact", { width: 390, height: 900 }, async (page) => {
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1), true);
  });
});
```

- [ ] **Step 2: Run and verify it fails**

Run: `npm run test:ui`
Expected: FAIL — email card and social hooks missing.

- [ ] **Step 3: Implement**

- `EmailCard`: 612px max, `bg-surface`, 18px radius, centered email 15px, `HireButton size="sm" label="Copy email"`; `data-testid="email-card"`.
- `LinkList`: two-column grid, 1px top border per item, 14px label, arrow right; `data-testid="social-link"` on each anchor.
- Contact page: `<main className="pt-8 md:pt-[72px]">`; `PageIntro width="inner"` with badge "Let's talk", split headline, subtitle; `EmailCard`; "Prefer a conversation?" row with `Send a mail ↗`; "Find me online" + `LinkList`; then "Or send a note" and the restyled form.
- `ContactForm`: keep react-hook-form logic; 12px muted labels; `field` class uses surface background, 14px radius, 14px text; black submit pill; keep status messages.

- [ ] **Step 4: Run tests and verify they pass**

Run: `npm run test:ui`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add app/contact/page.tsx components/site/ContactForm.tsx components/site/EmailCard.tsx components/site/LinkList.tsx tests/ui.test.mjs
git commit -m "feat: rebuild contact page with email card and social grid"
```

---

### Task 9: Full-site QA, accessibility, and production verification

**Files:**
- Modify: `tests/ui.test.mjs`, `README.md`
- Test: `tests/ui.test.mjs`

**Interfaces:**
- Consumes: every page and shared component from Tasks 1–8.
- Produces: the final verified build; no new interfaces.

- [ ] **Step 1: Write the failing site-wide tests**

Add:
```js
const ROUTES = ["/", "/about", "/built", "/learn", "/contact"];
const WIDTHS = [320, 390, 768, 1024, 1440];

test("no page overflows horizontally at any target width", async () => {
  for (const route of ROUTES) {
    for (const width of WIDTHS) {
      await withPage(route, { width, height: 900 }, async (page) => {
        assert.equal(
          await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1),
          true,
          `${route} at ${width}px`
        );
      });
    }
  }
});

test("all pages load without console or page errors", async () => {
  for (const route of ROUTES) {
    await withPage(route, { width: 1440, height: 960 }, async (page) => {
      assert.deepEqual(page.__errors, [], route);
      assert.equal(await page.$$eval("a, button", (els) => els.filter((el) => !el.textContent.trim() && !el.getAttribute("aria-label")).length), 0);
    });
  }
});

test("keyboard focus starts at the skip link with a visible outline", async () => {
  await withPage("/", { width: 1440, height: 960 }, async (page) => {
    await page.keyboard.press("Tab");
    const focused = await page.evaluate(() => ({
      text: document.activeElement?.textContent ?? "",
      outline: getComputedStyle(document.activeElement).outlineStyle,
    }));
    assert.match(focused.text, /Skip to content/);
    assert.notEqual(focused.outline, "none");
  });
});
```
Extend `withPage` to attach `page.__errors = []` and listen for `console` errors and `pageerror`.

- [ ] **Step 2: Run and verify the new tests fail or expose issues**

Run: `npm run test:ui`
Expected: FAIL on at least one width or accessible-name check. Fix the specific layout or labels that fail; do not weaken the assertions.

- [ ] **Step 3: Run the production build and lint**

Stop the dev server, then:
```powershell
npm run build
npm run lint
```
Expected: both exit 0 with no errors. Restart `npm run dev` before the next step.

- [ ] **Step 4: Capture final screenshots and compare**

Run `npm run capture` and compare all ten captures against the live reference at the same viewports. Check specifically: gallery gutters, card radius, dock two-row layout, footer line, About timeline, list row heights, and mobile stacking.

- [ ] **Step 5: Update README**

Add a short "Design QA" section documenting `npm run test:ui` (dev server required), `CHROME_PATH`, and `npm run capture`. Do not rewrite the existing content documentation.

- [ ] **Step 6: Run the complete suite and commit**

With the dev server running:
```powershell
npm run test:ui
```
Then stop the dev server and run:
```powershell
npm run build
npm run lint
```
Expected: all pass.

```bash
git add app components data lib tests scripts README.md package.json package-lock.json .gitignore tailwind.config.ts
git commit -m "feat: complete uxderrick-style portfolio redesign"
```

---

## Self-Review Notes

- Spec coverage: shell/dock/footer (Task 1), intro (Task 2), home gallery (Task 3), covers (Task 4), About (Task 5), Built (Task 6), Learn (Task 7), Contact + form (Task 8), responsive/a11y/build (Task 9).
- Test hooks are introduced before the components that satisfy them.
- `ProjectCover` and `ArchiveCover` interfaces are stable from Task 3 through Task 4.
- The contact form is preserved and tested rather than removed.
- No project detail pages, CMS, dark mode, or new image assets are planned.
