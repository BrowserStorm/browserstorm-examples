import { exec, waitForNetworkSettled } from "@browserstorm/runtime";
import { Page } from "puppeteer";

async function runFlow(page: Page) {
  await page.setDefaultTimeout(60 * 1000);

  const response = await page.goto(process.env.URL || "", {
    waitUntil: "networkidle0",
  });

  if (!response.ok()) {
    throw Error(
      "Page responded with status code " +
        response.status() +
        ": " +
        response.statusText()
    );
  }

  const selector = process.env.SELECTOR;

  if (selector) {
    await waitForNetworkSettled(page, async () => await page.click(selector));
  }
}

exec(
  runFlow,
  {
    local: {
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
  (err, stats) => console.log(stats)
);
