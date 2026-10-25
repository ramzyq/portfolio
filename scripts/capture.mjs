import fs from "node:fs";
import path from "node:path";
import { BASE_URL, launchBrowser } from "../tests/helpers.mjs";

const ROUTES = [
  { path: "/", name: "home" },
  { path: "/about", name: "about" },
  { path: "/built", name: "built" },
  { path: "/learn", name: "learn" },
  { path: "/contact", name: "contact" },
];

const VIEWPORTS = [
  { width: 1440, height: 960 },
  { width: 390, height: 844 },
];

const outputDir = path.resolve("tests/screenshots");
fs.mkdirSync(outputDir, { recursive: true });

const browser = await launchBrowser();

try {
  for (const route of ROUTES) {
    for (const viewport of VIEWPORTS) {
      const page = await browser.newPage();
      await page.setViewport(viewport);
      await page.goto(`${BASE_URL}${route.path}`, {
        waitUntil: "networkidle2",
        timeout: 120_000,
      });

      await page.waitForFunction(() =>
        /\d{1,2}:\d{2}\s?(AM|PM)/.test(document.body.textContent ?? "")
      );

      await page.evaluate(async () => {
        const distance = window.innerHeight;
        for (let y = 0; y < document.body.scrollHeight; y += distance) {
          window.scrollTo(0, y);
          await new Promise((resolve) => window.setTimeout(resolve, 80));
        }
        window.scrollTo(0, 0);
        await new Promise((resolve) => window.setTimeout(resolve, 300));
      });

      const file = path.join(outputDir, `${route.name}-${viewport.width}.png`);
      await page.screenshot({ path: file });
      await page.close();
      console.log(`captured ${path.relative(process.cwd(), file)}`);
    }
  }
} finally {
  await browser.close();
}
