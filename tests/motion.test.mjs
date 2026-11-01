import test, { after } from "node:test";
import assert from "node:assert/strict";
import { closeBrowser, withPage } from "./helpers.mjs";

after(async () => {
  await closeBrowser();
});

async function animationName(page, selector) {
  return page.$eval(selector, (el) => getComputedStyle(el).animationName);
}

async function animationDurations(page, selector) {
  return page.$eval(selector, (el) =>
    getComputedStyle(el).animationDuration
      .split(",")
      .map((value) => Number.parseFloat(value))
  );
}

test("shell adds route entry, progress, and drifting light", async () => {
  await withPage("/", { width: 1440, height: 960 }, async (page) => {
    assert.match(
      await animationName(page, "[data-page-transition]"),
      /page-enter/
    );
    assert.match(await animationName(page, '[data-testid="dock"]'), /dock-in/);
    assert.notEqual(await animationName(page, ".ambient-orb-a"), "none");
    assert.notEqual(await animationName(page, ".ambient-orb-b"), "none");
    assert.notEqual(await animationName(page, ".ambient-orb-c"), "none");

    const dockIcon = await animationName(page, '[data-nav-item="/"] svg');
    assert.match(dockIcon, /icon-pop/);
    const toggleIcon = await animationName(
      page,
      '[data-testid="theme-toggle"] svg'
    );
    assert.match(toggleIcon, /icon-pop/);

    assert.equal(
      await page.$$eval('[data-testid="scroll-progress"]', (els) => els.length),
      1
    );
    const before = await page.$eval(
      '[data-testid="scroll-progress"]',
      (el) => getComputedStyle(el).transform
    );
    await page.evaluate(() =>
      window.scrollTo({
        top: document.body.scrollHeight * 0.5,
        behavior: "instant",
      })
    );
    await page.waitForFunction(() => {
      const el = document.querySelector('[data-testid="scroll-progress"]');
      if (!el) return false;
      return (
        getComputedStyle(el).transform !== "matrix(0, 0, 0, 1, 0, 0)" &&
        Number(getComputedStyle(el).opacity) > 0
      );
    });
    const afterScroll = await page.$eval(
      '[data-testid="scroll-progress"]',
      (el) => getComputedStyle(el).transform
    );
    assert.notEqual(afterScroll, before);
    assert.notEqual(afterScroll, "none");

    assert.deepEqual(page.__errors, []);
  });
});

test("hero, gallery, and tagline respond with playful motion", async () => {
  await withPage("/", { width: 1440, height: 960 }, async (page) => {
    assert.match(await animationName(page, "h1"), /rise-in/);
    assert.ok(
      (await page.$$eval(".hero-spark", (els) => els.length)) >= 3,
      "hero should have decorative sparks"
    );

    // The gallery now sits below the exploded-view section, so bring it into
    // view and let its scroll reveal fire before checking card motion.
    await page.$eval("[data-gallery-item]", (el) =>
      el.scrollIntoView({ block: "start", behavior: "instant" })
    );
    await page.waitForFunction(
      () =>
        document
          .querySelector("[data-gallery-item]")
          ?.closest("[data-reveal]")
          ?.getAttribute("data-shown") === "true"
    );
    const cardAnimation = await animationName(page, "[data-gallery-item]");
    assert.match(cardAnimation, /card-in/);
    const delays = await page.$$eval("[data-gallery-item]", (els) =>
      els.slice(0, 3).map((el) => getComputedStyle(el).animationDelay)
    );
    assert.notEqual(delays[0], delays[2]);

    const box = await page.$eval('[data-testid="gallery-card"]', (el) => {
      const rect = el.getBoundingClientRect();
      return {
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2,
      };
    });
    await page.mouse.move(box.x, box.y);
    await page.waitForFunction(
      () =>
        document.querySelector('[data-testid="gallery-card"]')?.dataset
          .tilting === "true"
    );
    const tilt = await page.$eval('[data-testid="gallery-card"]', (el) => ({
      x: el.style.getPropertyValue("--tilt-x"),
      y: el.style.getPropertyValue("--tilt-y"),
    }));
    assert.notEqual(tilt.x, "");
    assert.notEqual(tilt.y, "");

    await page.mouse.move(4, 4);
    await page.waitForFunction(
      () =>
        !document
          .querySelector('[data-testid="gallery-card"]')
          ?.hasAttribute("data-tilting")
    );

    await page.evaluate(() =>
      window.scrollTo({
        top: document.body.scrollHeight,
        behavior: "instant",
      })
    );
    await page.waitForFunction(() => {
      const el = document.querySelector('[data-word][data-active="true"]');
      return el && Number(getComputedStyle(el).opacity) >= 0.99;
    });
    const activeWord = await page.$eval(
      '[data-word][data-active="true"]',
      (el) => ({
        transform: getComputedStyle(el).transform,
        opacity: getComputedStyle(el).opacity,
      })
    );
    assert.notEqual(activeWord.transform, "none");
    assert.ok(Number(activeWord.opacity) >= 0.99);
    assert.deepEqual(page.__errors, []);
  });
});

test("timeline and list rows animate into place with stagger", async () => {
  await withPage("/about", { width: 1440, height: 960 }, async (page) => {
    const bars = await page.$$eval('[data-testid="timeline-bar"]', (els) =>
      els.map((el) => getComputedStyle(el).animationName)
    );
    assert.equal(bars.length, 4);
    assert.ok(bars.every((name) => /bar-grow/.test(name)));
    assert.equal(
      await page.$$eval('[data-testid="timeline-now-dot"]', (els) => els.length),
      1
    );
    const barDelays = await page.$$eval(
      '[data-testid="timeline-bar"]',
      (els) => els.map((el) => getComputedStyle(el).animationDelay)
    );
    assert.notEqual(barDelays[0], barDelays[2]);
    assert.deepEqual(page.__errors, []);
  });

  await withPage("/built", { width: 1440, height: 960 }, async (page) => {
    const rows = await page.$$eval('[data-testid="list-row"]', (els) =>
      els.map((el) => ({
        animation: getComputedStyle(el).animationName,
        delay: getComputedStyle(el).animationDelay,
      }))
    );
    assert.equal(rows.length, 4);
    assert.ok(rows.every(({ animation }) => /row-in/.test(animation)));
    assert.notEqual(rows[0].delay, rows[2].delay);
    assert.deepEqual(page.__errors, []);
  });
});

test("reduced motion removes movement and keeps content visible", async () => {
  await withPage("/", { width: 1440, height: 960 }, async (page) => {
    await page.emulateMediaFeatures([
      { name: "prefers-reduced-motion", value: "reduce" },
    ]);
    await page.reload({ waitUntil: "networkidle2", timeout: 120_000 });
    await page.waitForSelector("[data-gallery-item]");

    const cardDurations = await animationDurations(page, "[data-gallery-item]");
    assert.ok(
      cardDurations.every((duration) => duration < 0.001),
      `card durations: ${cardDurations.join(", ")}`
    );
    const headingDurations = await animationDurations(page, "h1");
    assert.ok(headingDurations.every((duration) => duration < 0.001));

    const state = await page.evaluate(() => ({
      cardOpacity: getComputedStyle(
        document.querySelector("[data-gallery-item]")
      ).opacity,
      headingOpacity: getComputedStyle(document.querySelector("h1")).opacity,
    }));
    assert.equal(state.cardOpacity, "1");
    assert.equal(state.headingOpacity, "1");

    const box = await page.$eval('[data-testid="gallery-card"]', (el) => {
      const rect = el.getBoundingClientRect();
      return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
    });
    await page.mouse.move(box.x, box.y);
    await new Promise((resolve) => setTimeout(resolve, 250));
    assert.equal(
      await page.$eval('[data-testid="gallery-card"]', (el) =>
        el.hasAttribute("data-tilting")
      ),
      false
    );
    assert.deepEqual(page.__errors, []);
  });
});

test("copy and form controls animate their state changes", async () => {
  await withPage("/", { width: 1440, height: 960 }, async (page) => {
    assert.ok(
      (await page.$$eval(".btn-shine", (els) => els.length)) >= 1,
      "copy button should use the shine treatment"
    );
    await page.evaluate(() => {
      Object.defineProperty(navigator, "clipboard", {
        configurable: true,
        value: { writeText: async () => {} },
      });
    });
    await page.click("button");
    await page.waitForSelector("[data-confetti] .confetti-piece");
    assert.ok(
      (await page.$$eval("[data-confetti] .confetti-piece", (els) => els.length)) >=
        8
    );
    assert.deepEqual(page.__errors, []);
  });

  await withPage("/contact", { width: 1440, height: 960 }, async (page) => {
    assert.ok(
      (await page.$$eval("form .btn-shine", (els) => els.length)) >= 1,
      "submit button should use the shine treatment"
    );
    await page.click('form button[type="submit"]');
    await page.waitForSelector('[role="alert"]');
    assert.match(
      await page.$eval('[role="alert"]', (el) =>
        getComputedStyle(el).animationName
      ),
      /shake-in/
    );
    assert.deepEqual(page.__errors, []);
  });
});

test("tech layer: backdrop, scramble headline, and exploded view", async () => {
  await withPage("/", { width: 1440, height: 960 }, async (page) => {
    assert.equal(
      await page.$$eval('[data-testid="tech-backdrop"] canvas', (els) => els.length),
      1
    );
    assert.notEqual(await animationName(page, ".tech-scan"), "none");

    // Boot screen is skipped under automation; scramble resolves to real text.
    assert.equal(
      await page.evaluate(() => document.documentElement.dataset.boot ?? null),
      null
    );
    await page.waitForFunction(() => {
      const visible = document.querySelector("h1 [data-scramble]");
      return visible?.textContent?.includes("I’m Ramzy");
    });
    assert.match(
      await page.$eval("h1 .sr-only", (el) => el.textContent),
      /I’m Ramzy/
    );

    const stage = '[data-testid="exploded-stack"] .xs-stage';
    await page.$eval(stage, (el) => el.scrollIntoView({ block: "center" }));
    assert.equal(await page.$eval(stage, (el) => el.dataset.open), "false");
    await page.click('[data-testid="exploded-stack"] button[aria-pressed]');
    assert.equal(await page.$eval(stage, (el) => el.dataset.open), "true");

    const before = await page.$eval(stage, (el) => el.style.getPropertyValue("--rz"));
    const box = await page.$eval(stage, (el) => {
      const r = el.getBoundingClientRect();
      return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
    });
    await page.mouse.move(box.x, box.y);
    await page.mouse.down();
    await page.mouse.move(box.x + 120, box.y, { steps: 8 });
    await page.mouse.up();
    await page.waitForFunction(
      (selector, prev) =>
        document.querySelector(selector)?.style.getPropertyValue("--rz") !== prev,
      {},
      stage,
      before
    );
    assert.deepEqual(page.__errors, []);
  });
});
