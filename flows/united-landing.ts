import { exec } from "@browserstorm/runtime";
import { Page } from "puppeteer";

process.env.PREFER_VANILLA_PUPPETEER = "true";

async function onReady(page: Page) {
  const start = Date.now();

  await page.goto("https://united.com", { waitUntil: "networkidle0" });

  await page.waitForSelector('div[class*="bookFlightForm"]');

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
        // {
        //   browsers: 1,
        //   rampDuration: 0,
        //   duration: 5 * 1000 * 60,
        // },
        // {
        //   browsers: 4,
        //   rampDuration: 0,
        //   duration: 5 * 1000 * 60,
        // },
        // {
        //   browsers: 8,
        //   rampDuration: 0,
        //   duration: 5 * 1000 * 60,
        // },
        // {
        //   browsers: 16,
        //   rampDuration: 0,
        //   duration: 5 * 1000 * 60,
        // },
        // {
        //   browsers: 32,
        //   rampDuration: 0,
        //   duration: 5 * 1000 * 60,
        // },
        {
          browsers: 64,
          rampDuration: 0,
          duration: 5 * 1000 * 60,
        },
      ],
    },
  },
  (err, stats, result) => {
    const line = [
      stats.step?.browsers,
      "puppeteer",
      (process.memoryUsage().rss / 1024 / 1024).toFixed(2),
      result.endedAt - result.startedAt,
      result.endedAt - result.internalStartedAt,
      result.startedAt - result.internalStartedAt,
    ].join(",");

    console.log(process.pid, line);
  }
);
