import { Page } from "puppeteer-core";
import { launchBrowser } from "./LaunchBrowser";

export async function getPicWithBrowser(url: string){

  const chartSelector = 'body > div.js-rootresizer__contents.layout-with-border-radius > div.layout__area--center > div.chart-container.single-visible.top-full-width-chart.active'

  const {page, browser} = await launchBrowser(true)

  await page.goto(url, {waitUntil: "domcontentloaded"})

  // Block certain requests to avoid loading unnecessary popups
  await page.setRequestInterception(true);
  blockRequests(page)
  await getRidOfCookiesPopup(page);

  // Wait for the element to be visible
  await page.waitForSelector(chartSelector); // or use a more specific selector if necessary

  // Select the element
  const chartelement = await page.$(chartSelector);

  if (!chartelement) return null//console.log('Element has no bounding box!');

  await page.waitForSelector(".time-axis")

  const timeaxisele = await page.$(".time-axis")

  timeaxisele?.drag({x: 300, y:0})

  await new Promise(r => setTimeout(r, 1000));

  const screenshot = await chartelement.screenshot({type:"png"})
  console.log('Screenshot saved pic ');
  await new Promise(r => setTimeout(r, 1000));

  page.removeAllListeners();

  // Close the browser
  await browser.close();

  return screenshot
};


async function getRidOfCookiesPopup(page: Page) {
  await page.waitForSelector('.content-D4RPB3ZC')

  const cookiesbutton = await page.$('.content-D4RPB3ZC')

  if (!cookiesbutton) return null

  return cookiesbutton?.click()
}


function blockRequests(page: Page) {
  page.on('request', (request) => {
    // Block certain resource types
    const blockedResources = ['image', 'stylesheet', 'font'];
    if (blockedResources.includes(request.resourceType())) {
      request.abort();
    } else {
      request.continue();
    }
  });
}