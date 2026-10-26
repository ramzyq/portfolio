import test from "node:test";
import assert from "node:assert/strict";
import { withPage } from "./helpers.mjs";

test("shell renders the dock, footer, and live clock on every page", async () => {
  await withPage("/", { width: 1440, height: 960 }, async (page) => {
    assert.equal(
      await page.$$eval('[data-testid="dock"] [data-nav-item]', (els) => els.length),
      5
    );
    const footer = await page.$eval('[data-testid="site-footer"]', (el) => el.textContent);
    assert.match(footer, /KONDE RAMZY GBATI/i);
    assert.match(footer, /ACCRA, GHANA/i);
    assert.match(footer, new RegExp(String(new Date().getFullYear())));
    await page.waitForFunction(() =>
      /\d{1,2}:\d{2}\s?(AM|PM)/.test(
        document.querySelector('[data-testid="site-footer"]')?.textContent ?? ""
      )
    );
    assert.equal(
      await page.$eval('[data-testid="dock"] a[aria-current="page"]', (el) =>
        el.getAttribute("aria-label")
      ),
      "Home"
    );
    assert.deepEqual(page.__errors, []);
  });

  await withPage("/about", { width: 1440, height: 960 }, async (page) => {
    assert.equal(
      await page.$eval('[data-testid="dock"] a[aria-current="page"]', (el) =>
        el.getAttribute("aria-label")
      ),
      "About"
    );
    assert.equal(
      await page.$$eval('[data-testid="dock"] [data-nav-item]', (els) => els.length),
      5
    );
    assert.deepEqual(page.__errors, []);
  });
});

test("home intro renders the pill, split headline, and copy-email CTA", async () => {
  await withPage("/", { width: 1440, height: 960 }, async (page) => {
    const h1 = await page.$eval("h1", (el) => el.textContent);
    assert.match(h1, /I’m Ramzy/);
    assert.match(h1, /University of Ghana/);
    assert.match(await page.$eval(".pill", (el) => el.textContent), /Currently at/);
    assert.equal(await page.$eval("main", (el) => getComputedStyle(el).paddingTop), "46px");
    assert.equal(await page.$eval("header", (el) => getComputedStyle(el).maxWidth), "640px");
    assert.equal(await page.$eval("h1", (el) => getComputedStyle(el).fontSize), "32px");
    await page.evaluate(() => {
      window.__copied = "";
      Object.defineProperty(navigator, "clipboard", {
        configurable: true,
        value: {
          writeText: async (text) => {
            window.__copied = text;
          },
        },
      });
    });
    const button = await page.$("button");
    await button.click();
    await page.waitForFunction(() =>
      document.querySelector("button")?.textContent?.includes("Email copied")
    );
    assert.equal(await page.evaluate(() => window.__copied), "konderamzy30@gmail.com");
  });

  await withPage("/", { width: 390, height: 900 }, async (page) => {
    assert.equal(await page.$eval("h1", (el) => getComputedStyle(el).fontSize), "26px");
    assert.equal(await page.$eval("main", (el) => getComputedStyle(el).paddingTop), "24px");
  });
});

test("home renders nine cards in a responsive 3/2/1 gallery", async () => {
  for (const [width, expected] of [
    [1440, 3],
    [768, 2],
    [390, 1],
  ]) {
    await withPage("/", { width, height: 900 }, async (page) => {
      assert.equal(
        await page.$$eval('[data-testid="gallery-card"]', (els) => els.length),
        9
      );
      const columns = await page.$eval('[data-testid="gallery-grid"]', (el) =>
        getComputedStyle(el).gridTemplateColumns.split(" ").length
      );
      assert.equal(columns, expected);
      assert.equal(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= window.innerWidth + 1
        ),
        true
      );
    });
  }
  await withPage("/", { width: 1440, height: 960 }, async (page) => {
    assert.equal(
      await page.$eval('a[aria-label^="TraderWise"]', (el) => el.getAttribute("href")),
      "https://github.com/ramzyq/traderwise"
    );
    assert.equal(
      await page.$eval('a[aria-label^="Home Lab"]', (el) => el.getAttribute("href")),
      "/built"
    );
    assert.equal(
      await page.$eval('a[aria-label^="STEM education"]', (el) => el.getAttribute("href")),
      "/learn"
    );
    assert.equal(
      await page.$$eval(
        '[data-testid="gallery-card"] [data-cover][aria-hidden="true"]',
        (els) => els.length
      ),
      9
    );
  });
});

test("covers are image-free, correctly proportioned, and do not overflow", async () => {
  await withPage("/", { width: 1440, height: 960 }, async (page) => {
    assert.equal(await page.$$eval('[data-testid="gallery-card"] img', (els) => els.length), 0);
    const covers = await page.$$eval('[data-cover]', (els) =>
      els.map((el) => {
        const r = el.getBoundingClientRect();
        return {
          ratio: r.width / r.height,
          overflowX: el.scrollWidth - el.clientWidth,
          overflowY: el.scrollHeight - el.clientHeight,
        };
      })
    );
    assert.equal(covers.length, 9);
    for (const { ratio, overflowX, overflowY } of covers) {
      assert.ok(Math.abs(ratio - 1.15) < 0.03, `ratio ${ratio}`);
      assert.ok(overflowX <= 1, `cover horizontal overflow ${overflowX}`);
      assert.ok(overflowY <= 1, `cover vertical overflow ${overflowY}`);
    }
  });
  await withPage("/", { width: 390, height: 900 }, async (page) => {
    const coverStates = await page.$$eval('[data-cover]', (els) =>
      els.map((el) => ({
        overflowX: el.scrollWidth - el.clientWidth,
        overflowY: el.scrollHeight - el.clientHeight,
      }))
    );
    assert.ok(coverStates.every(({ overflowX }) => overflowX <= 1));
    assert.ok(coverStates.every(({ overflowY }) => overflowY <= 1));
  });
});

test("about page renders the timeline, skills, and contact link", async () => {
  await withPage("/about", { width: 1440, height: 960 }, async (page) => {
    assert.match(await page.$eval("h1", (el) => el.textContent), /I build with purpose/);
    assert.equal(
      await page.$$eval('[data-testid="timeline-bar"]', (els) => els.length),
      4
    );
    assert.equal(
      await page.$$eval(
        '[data-testid="timeline-bar"][data-current="true"]',
        (els) => els.length
      ),
      1
    );
    assert.equal(
      await page.$$eval('[data-testid="skill-group"]', (els) => els.length),
      5
    );
    assert.match(
      await page.$eval('[data-testid="interwebs-link"]', (el) =>
        el.getAttribute("href")
      ),
      /\/contact/
    );
  });
  await withPage("/about", { width: 390, height: 900 }, async (page) => {
    assert.equal(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= window.innerWidth + 1
      ),
      true
    );
  });
});

test("built page renders four linked project rows", async () => {
  await withPage("/built", { width: 1440, height: 960 }, async (page) => {
    assert.match(await page.$eval("h1", (el) => el.textContent), /Ideas I couldn’t/);
    assert.match(
      await page.$eval('[data-section="projects"]', (el) => el.textContent),
      /4 projects/
    );
    assert.equal(
      await page.$$eval('[data-testid="list-row"]', (els) => els.length),
      4
    );
    assert.equal(
      await page.$$eval('[data-testid="list-row"] a[href]', (els) => els.length),
      4
    );
    assert.equal(
      await page.$$eval('[data-testid="list-row"] svg', (els) => els.length >= 4),
      true
    );
  });
});

test("learn page renders the library and experience lists without dead links", async () => {
  await withPage("/learn", { width: 1440, height: 960 }, async (page) => {
    assert.equal(
      await page.$$eval(
        '[data-section="library"] [data-testid="list-row"]',
        (els) => els.length
      ),
      5
    );
    assert.equal(
      await page.$$eval(
        '[data-section="experience"] [data-testid="list-row"]',
        (els) => els.length
      ),
      4
    );
    assert.match(
      await page.$eval('[data-section="experience"]', (el) => el.textContent),
      /Coursework:/
    );
    assert.equal(await page.$$eval('a[href=""]', (els) => els.length), 0);
    assert.equal(await page.$$eval('a[href="#"]', (els) => els.length), 0);
  });
});
