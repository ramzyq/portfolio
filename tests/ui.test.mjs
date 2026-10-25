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
