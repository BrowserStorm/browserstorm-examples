import { exec, ExecProps, Stats, Result } from "@browserstorm/runtime";
import { Page, ElementHandle } from "playwright";
import { shuffle } from "lodash";

async function onReady(page: Page, { data }: ExecProps) {
  const start = Date.now();

  /**
   * set 1 min timeout
   */
  page.setDefaultTimeout(60 * 1000);

  await page.goto(process.env.URL || "", {
    waitUntil: "networkidle",
  });

  await page.waitForSelector(
    "div[c-ipal0featuredofferingstabs_ipal0featuredofferingstabs] a[c-ipalink_ipalink]",
    { state: "visible" }
  );

  const elements = await page.$$(
    `div[c-ipal0featuredofferingstabs_ipal0featuredofferingstabs] a[c-ipalink_ipalink]`
  );

  const element = shuffle(elements)[0];

  await page.evaluate(
    (el) => el.click(),
    element as ElementHandle<HTMLElement>
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
  (err, stats: Stats, result: Result) => console.log(stats, result.data)
);
