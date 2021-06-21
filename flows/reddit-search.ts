import { exec } from "@browserstorm/runtime";
import { Page } from "puppeteer";
import faker from "faker";

async function runFlow(page: Page) {
  await page.setDefaultTimeout(60 * 1000);

  await page.goto("https://old.reddit.com/", { waitUntil: "networkidle0" });

  await page.type('form[role="search"] input[name="q"]', faker.random.word());
  await page.click('form[role="search"] input[type="submit"]');

  await page.waitForNavigation({ waitUntil: "networkidle0" });
}

exec(
  runFlow,
  {
    local: {
      headless: false,
      profile: [
        {
          browsers: 1,
          duration: 10 * 1000 * 60,
          rampDuration: 0,
        },
      ],
    },
  },
  (err, stats) => console.log(stats)
);
