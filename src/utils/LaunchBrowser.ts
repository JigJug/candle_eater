import puppeteer, { PuppeteerLaunchOptions } from "puppeteer-core";

export async function launchBrowser(mode: boolean) {
  let options: PuppeteerLaunchOptions;

  if (mode) {
    options = {
      headless: true,
      defaultViewport: { height: 6000, width: 1463 },
      executablePath: '/app/.cache/puppeteer/chrome-headless-shell/linux-129.0.6668.58',
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    };
  } else {
    options = {
      headless: false,
      defaultViewport: null,
      executablePath: '/app/.cache/puppeteer/chrome/linux-129.0.6668.58',
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    };
  }

  const browser = await puppeteer.launch(options);

  if (mode) console.log("Headless browser launched successfully");

  const page = await browser.newPage();

  return { page, browser };
}
