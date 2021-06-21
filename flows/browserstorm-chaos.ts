import { exec, ExecProps } from "@browserstorm/runtime";
import { Page } from "puppeteer";

process.env.PREFER_VANILLA_PUPPETEER = "true";

async function onReady(page: Page, { data }: ExecProps) {
  /**
   * set 1 min timeout
   */
  page.setDefaultTimeout(60 * 1000);

  /**
   * get email + password from DataProvider
   */
  const { email, password } = await data.get<{
    email: string;
    password: string;
  }>("credentials");

  await page.goto("https://google.com", { waitUntil: "networkidle0" });

  await page.waitForSelector('input[value="Google Search"]');

  await page.goto("https://chaos.browserstorm.com/", {
    waitUntil: "networkidle0",
  });

  await page.type('input[name="email"]', email);
  await page.type('input[name="password"]', password);

  await page.click("button");

  await page.waitForSelector("#accessToken");

  const accessTokenElement = await page.$("#accessToken");

  if (accessTokenElement) {
    const accessToken = await page.evaluate(
      (el) => el.textContent,
      accessTokenElement
    );

    return {
      accessToken,
    };
  }

  throw Error("Could not find access token");
}

exec(
  onReady,
  {
    local: {
      headless: true,
      data: {
        credentials: () => "http://chaos.browserstorm.com/credentials.json",
      },
      profile: [
        {
          browsers: 5,
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
