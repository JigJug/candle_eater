import puppeteer, { PuppeteerLaunchOptions } from "puppeteer-core";

export async function launchBrowser() {

  let options: PuppeteerLaunchOptions;

  options = {
    headless: true,
    defaultViewport: { height: 800, width: 1200 },
    executablePath: '/app/.chrome-for-testing/chrome-linux64/chrome',
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      //'--unsafely-treat-insecure-origin-as-secure=https://www.tradingview.com',
      //'--enable-features=ClipboardAPI'
    ]
  }
  
  const browser = await puppeteer.launch(options);

  console.log("Headless browser launched successfully");

  const page = await browser.newPage();

  return { page, browser };
}
