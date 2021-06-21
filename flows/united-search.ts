import { exec, ExecProps } from "@browserstorm/runtime";
import { Page } from "puppeteer";
import dayjs from "dayjs";

async function onReady(page: Page, { data }: ExecProps) {
  /**
   * set 1 min timeout
   */
  page.setDefaultTimeout(120 * 1000);

  await page.goto("https://www.united.com/en/us/", {
    waitUntil: "networkidle2",
  });

  const {
    Airport: { ShortName: origin },
  } = await data.get<{
    Airport: { ShortName: string };
  }>("airports");

  const {
    Airport: { ShortName: dest },
  } = await data.get<{
    Airport: { ShortName: string };
  }>("airports");

  await page.click("#bookFlightDestinationInput", { clickCount: 3 });
  await page.type("#bookFlightDestinationInput", origin);

  await page.click("#bookFlightOriginInput", { clickCount: 3 });
  await page.type("#bookFlightOriginInput", dest);

  const start = dayjs().add(Math.round(Math.random() * 5), "days");
  const end = dayjs(start).add(Math.round(Math.random() * 45), "days");

  await page.click("#DepartDate", { clickCount: 3 });
  await page.type("#DepartDate", start.format("MMM DD"));

  await page.click("#ReturnDate", { clickCount: 3 });
  await page.type("#ReturnDate", end.format("MMM DD"));

  await page.click("button[type='submit']");

  await Promise.race([
    page.waitForSelector('div[class*="app-components-Shopping-FareWheelCard"]'),
    page.waitForSelector('div[class*="app-components-Shopping-PriceCard"]'),
    page.waitForSelector('div[class*="app-components-Shopping-NoFlights"]'),
  ]);
}

exec(
  onReady,
  {
    local: {
      headless: true,
      data: {
        airports: () =>
          "https://gist.githubusercontent.com/contributors-attention/8aefe8d0807cd1c307c7a64ca81dac05/raw/airports.json",
      },
      profile: [
        {
          browsers: 12,
          duration: 10 * 1000 * 60,
        },
      ],
    },
  },
  (err, stats, result) =>
    console.log(
      stats,
      result.isError && result.error
        ? JSON.parse(result.error).message
        : result.data
    )
);
