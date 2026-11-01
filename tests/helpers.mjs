import fs from "node:fs";
import puppeteer from "puppeteer-core";

export const BASE_URL = process.env.BASE_URL ?? "http://localhost:3000";

const CHROME_CANDIDATES = [
  process.env.CHROME_PATH,
  "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
  "C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe",
  "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  "/usr/bin/google-chrome",
  "/usr/bin/chromium",
  "/usr/bin/chromium-browser",
].filter(Boolean);

export function resolveChrome() {
  const found = CHROME_CANDIDATES.find((candidate) => fs.existsSync(candidate));
  if (!found) {
    throw new Error(
      "No Chrome or Edge binary found. Set CHROME_PATH to a Chromium-based browser executable."
    );
  }
  return found;
}

export async function launchBrowser() {
  return puppeteer.launch({
    executablePath: resolveChrome(),
    headless: "new",
    args: ["--no-sandbox", "--disable-gpu", "--hide-scrollbars"],
  });
}

let sharedBrowser = null;

async function getBrowser() {
  if (!sharedBrowser || !sharedBrowser.connected) {
    sharedBrowser = await launchBrowser();
  }
  return sharedBrowser;
}

export async function closeBrowser() {
  if (sharedBrowser) {
    const browser = sharedBrowser;
    sharedBrowser = null;
    await browser.close().catch(() => {});
  }
}

export async function withPage(
  pathname,
  viewport,
  fn,
  { expectStatus, colorScheme } = {}
) {
  const browser = await getBrowser();
  const page = await browser.newPage();
  page.__errors = [];
  page.on("console", (message) => {
    if (message.type() === "error") page.__errors.push(message.text());
  });
  page.on("pageerror", (error) => page.__errors.push(String(error)));

  await page.setViewport(viewport);
  if (colorScheme) {
    await page.emulateMediaFeatures([
      { name: "prefers-color-scheme", value: colorScheme },
    ]);
  }
  try {
    const response = await page.goto(`${BASE_URL}${pathname}`, {
      waitUntil: "networkidle2",
      timeout: 120_000,
    });
    const status = response?.status() ?? 0;
    if (expectStatus) {
      if (status !== expectStatus) {
        throw new Error(
          `Expected ${expectStatus} from ${BASE_URL}${pathname}, got ${status}`
        );
      }
    } else if (!response || !response.ok()) {
      throw new Error(`Failed to load ${BASE_URL}${pathname} (${status})`);
    }
    await page
      .waitForFunction(() => document.documentElement.dataset.hydrated === "true", {
        timeout: 60_000,
      })
      .catch(() => {});
    await new Promise((resolve) => setTimeout(resolve, 400));
    return await fn(page);
  } finally {
    await page.close();
  }
}
