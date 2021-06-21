import { exec } from "@browserstorm/runtime";
import { Page } from "playwright";

process.env.PREFER_VANILLA_PUPPETEER = "true";

async function onReady(page: Page) {
  const start = Date.now();

  await page.goto("https://google.com", { waitUntil: "networkidle" });

  await page.waitForSelector('input[value="Google Search"]', {
    state: "attached",
  });

  return {
    completed: Date.now() - start,
  };
}

exec(
  onReady,
  {
    local: {
      headless: true,
      profile: [
        {
          browsers: 32,
          rampDuration: 0,
          duration: 5 * 1000 * 60,
        },
      ],
    },
  },
  (err, stats, result) => {
    console.log(result);
  }
);
