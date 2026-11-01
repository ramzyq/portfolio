import test, { after } from "node:test";
import assert from "node:assert/strict";
import { closeBrowser, withPage } from "./helpers.mjs";

after(async () => {
  await closeBrowser();
});

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function run(page, command) {
  await page.type(".terminal__input", command);
  await page.keyboard.press("Enter");
  await wait(80);
}

async function lastLine(page) {
  return page.$$eval(".terminal__line", (els) => els.at(-1)?.textContent ?? "");
}

test("terminal opens with ` and the dock button, runs commands, and accepts flags", async () => {
  await withPage("/", { width: 1440, height: 960 }, async (page) => {
    await page.evaluate(() => localStorage.removeItem("krg-flags"));
    const terminal = '[data-testid="terminal"]';
    assert.equal(await page.$eval(terminal, (el) => el.dataset.open), "false");
    assert.equal(await page.$eval(terminal, (el) => el.hasAttribute("inert")), true);

    await page.keyboard.press("`");
    await page.waitForFunction((s) => document.querySelector(s)?.dataset.open === "true", {}, terminal);
    await page.waitForFunction(() => document.activeElement?.classList.contains("terminal__input"));

    await run(page, "whoami");
    assert.match(await page.$eval(".terminal__body", (el) => el.textContent), /Konde Ramzy Gbati/);

    await run(page, "nonsense");
    assert.match(await lastLine(page), /command not found/);

    await run(page, "ls -a");
    assert.match(await lastLine(page), /\.vault_key/);

    await run(page, "submit KRG{nope}");
    assert.match(await lastLine(page), /invalid flag/);

    const html = await page.content();
    const sourceFlag = html.match(/KRG\{[^}]+\}/)?.[0];
    assert.ok(sourceFlag, "source flag should be in the HTML");
    await run(page, `submit ${sourceFlag}`);
    assert.match(await lastLine(page), /flag accepted: Source reader \(1\/6\)/);

    await run(page, "cd vault");
    assert.match(await lastLine(page), /permission denied/);

    await page.waitForSelector('[data-testid="ctf-tracker"]');
    assert.match(await page.$eval('[data-testid="ctf-tracker"]', (el) => el.textContent), /1\/6/);
    assert.match(await page.$eval('[data-testid="toaster"]', (el) => el.textContent), /Flag captured/);

    await page.keyboard.press("Escape");
    await page.waitForFunction((s) => document.querySelector(s)?.dataset.open === "false", {}, terminal);

    await page.click('[data-testid="terminal-button"]');
    await page.waitForFunction((s) => document.querySelector(s)?.dataset.open === "true", {}, terminal);
    assert.deepEqual(page.__errors, []);
  });
});

test("enclave puzzle denies wrong shifts and awards a flag when cracked", async () => {
  await withPage("/", { width: 1440, height: 960 }, async (page) => {
    await page.evaluate(() => localStorage.removeItem("krg-flags"));
    await page.$eval('[data-testid="exploded-stack"]', (el) => el.scrollIntoView({ block: "center" }));
    await page.click('[data-testid="exploded-stack"] button[aria-pressed]');
    await wait(1300);

    // Click a visible part of the enclave plate.
    const point = await page.evaluate(() => {
      const art = document.querySelector('[data-layer="enclave"] .xs-art');
      const r = art.getBoundingClientRect();
      for (let y = r.bottom - 4; y > r.top; y -= 6) {
        for (let x = r.left; x < r.right; x += 6) {
          const hit = document.elementFromPoint(x, y);
          if (hit?.closest('[data-layer="enclave"]')) return { x, y };
        }
      }
      return null;
    });
    assert.ok(point, "enclave plate should be clickable somewhere");
    await page.mouse.click(point.x, point.y);
    await page.waitForSelector(".puzzle__card");

    await page.click(".puzzle__unlock");
    await page.waitForSelector('.puzzle__card[data-state="denied"]');
    for (let i = 0; i < 7; i++) await page.keyboard.press("ArrowRight");
    await page.click(".puzzle__unlock");
    await page.waitForSelector('.puzzle__card[data-state="open"]');
    assert.deepEqual(
      await page.evaluate(() => JSON.parse(localStorage.getItem("krg-flags"))),
      ["enclave"]
    );
    assert.deepEqual(page.__errors, []);
  });
});

test("robot patrols on desktop and gives up a flag after five pokes", async () => {
  await withPage("/", { width: 1440, height: 960 }, async (page) => {
    await page.evaluate(() => localStorage.removeItem("krg-flags"));
    await page.waitForSelector('[data-testid="robot"]');
    const x1 = await page.$eval('[data-testid="robot"]', (el) => el.style.getPropertyValue("--robot-x"));
    await wait(500);
    const x2 = await page.$eval('[data-testid="robot"]', (el) => el.style.getPropertyValue("--robot-x"));
    assert.notEqual(x1, x2, "robot should be walking");
    for (let i = 0; i < 5; i++) await page.click(".robot__body");
    await page.waitForFunction(() => localStorage.getItem("krg-flags")?.includes("robot"));
  });

  await withPage("/", { width: 390, height: 844 }, async (page) => {
    assert.equal(await page.$('[data-testid="robot"]'), null, "no robot on phones");
  });
});

test("konami code triggers matrix mode and a flag", async () => {
  await withPage("/", { width: 1440, height: 960 }, async (page) => {
    await page.evaluate(() => localStorage.removeItem("krg-flags"));
    for (const key of ["ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown", "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight", "b", "a"]) {
      await page.keyboard.press(key);
    }
    assert.equal(await page.evaluate(() => document.documentElement.dataset.matrix), "on");
    await page.waitForFunction(() => localStorage.getItem("krg-flags")?.includes("konami"));
  });
});

test("vault is locked until all flags are found, then issues a certificate", async () => {
  await withPage("/vault", { width: 1440, height: 960 }, async (page) => {
    await page.evaluate(() => localStorage.removeItem("krg-flags"));
    await page.reload({ waitUntil: "networkidle2" });
    await page.waitForSelector('[data-testid="vault-locked"]');
    await page.evaluate(() =>
      localStorage.setItem(
        "krg-flags",
        JSON.stringify(["source", "console", "terminal", "enclave", "konami", "robot"])
      )
    );
    await page.reload({ waitUntil: "networkidle2" });
    await page.waitForSelector('[data-testid="vault-open"]');
    await page.type('[data-testid="vault-open"] input', "Ada");
    assert.match(await page.$eval('[data-testid="certificate"]', (el) => el.textContent), /Ada/);
    await page.evaluate(() => localStorage.removeItem("krg-flags"));
    assert.deepEqual(page.__errors, []);
  });
});

test("404 keeps its copy and adds the firewall game", async () => {
  await withPage(
    "/definitely-missing",
    { width: 1440, height: 960 },
    async (page) => {
      await page.click('[data-testid="firewall-game"] .firewall__overlay button');
      await page.waitForSelector('.firewall__cell[data-hot="true"]', { timeout: 4000 });
      await page.click('.firewall__cell[data-hot="true"]');
      await page.waitForFunction(() =>
        /BLOCKED\s*1/.test(document.querySelector('[data-testid="firewall-game"]')?.textContent ?? "")
      );
    },
    { expectStatus: 404 }
  );
});

test("gallery cards carry a decrypt overlay and the HUD tracks scroll", async () => {
  await withPage("/", { width: 1440, height: 960 }, async (page) => {
    assert.equal(
      await page.$$eval('[data-testid="gallery-card"] .decrypt', (els) => els.length),
      9
    );
    await page.evaluate(() => window.scrollTo({ top: document.body.scrollHeight, behavior: "instant" }));
    await page.waitForFunction(() =>
      /100%/.test(document.querySelector('[data-testid="system-hud"]')?.textContent ?? "")
    );
  });
});
