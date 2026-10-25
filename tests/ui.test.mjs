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
