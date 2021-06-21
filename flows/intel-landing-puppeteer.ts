import { exec, ExecProps, Stats, Result } from "@browserstorm/runtime";
import { Page } from "puppeteer";

async function onReady(page: Page, { data }: ExecProps) {
  const start = Date.now();

  /**
   * set 1 min timeout
   */
  page.setDefaultTimeout(60 * 1000);

  await page.goto(process.env.URL || "", {
    waitUntil: "networkidle0",
  });

  await page.click(
    `div[c-ipal0featuredofferingstabs_ipal0featuredofferingstabs]:nth-child(${Math.ceil(
      Math.random() * 5
    )}) a[c-ipalink_ipalink]`
  );

  await page.waitForTimeout(5000);

  return {
    completed: Date.now() - start,
  };
}

exec(
  onReady,
  {
    local: {
      headless: false,
      envVars: {
        URL: "https://marketplace.intel.com/s/?language=en_US",
      },
      profile: [
        {
          browsers: 1,
          duration: 10 * 1000 * 60,
          rampDuration: 0,
        },
      ],
    },
  },
  (err, stats: Stats, result: Result) =>
    console.log(stats, result.data || result.error)
);
