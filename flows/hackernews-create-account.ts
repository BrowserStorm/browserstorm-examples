import {
  exec,
  ExecProps,
  setup,
  SetupOptions,
  SetupProps,
} from "@browserstorm/runtime";
import { Page, LaunchOptions } from "puppeteer";
import faker from "faker";

setup(async (options: SetupOptions<LaunchOptions>, { data }: SetupProps) => {
  // const ip = await data.get<{ public: string }>("proxies", {
  //   reuse: "immediate",
  // });

  options.launchOptions.args.push(`--proxy-server=socks5://127.0.0.1:9050`);

  return options;
});

async function onReady(page: Page, { data }: ExecProps) {
  /**
   * set 1 min timeout
   */
  page.setDefaultTimeout(60 * 1000);

  await page.goto("https://news.ycombinator.com/", {
    waitUntil: "networkidle0",
  });

  await Promise.all([
    page.click('a[href="login?goto=news"]'),
    page.waitForNavigation({ waitUntil: "networkidle0" }),
  ]);

  const username = faker.random.word();
  const password = faker.random.alphaNumeric(10);

  await page.type('form:nth-of-type(2) input[name="acct"]', username);
  await page.type('form:nth-of-type(2) input[name="pw"]', password);

  await Promise.all([
    page.click('form:nth-of-type(2) input[type="submit"]'),
    page.waitForNavigation({ waitUntil: "networkidle0" }),
  ]);

  const element = await page.waitForSelector("#me");
  const id = element?.getProperty("textContent");

  if (!id) {
    throw Error("Could not find id");
  }

  return {
    id,
    username,
    password,
  };
}

exec(
  onReady,
  {
    local: {
      headless: false,
      data: {
        proxies: () => "https://www.browserstorm.com/api/proxy/all",
      },
      profile: [
        {
          browsers: 1,
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
