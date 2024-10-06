import { Page } from "puppeteer-core";
import { launchBrowser } from "./LaunchBrowser";

export async function getPicWithBrowser(url: string){

  const chartSelector = '.chart-widget'

  const {page, browser} = await launchBrowser()

  console.log(url)

  await page.goto(url, {waitUntil: "networkidle2"})

  // Block certain requests to avoid loading unnecessary popups
  await page.setRequestInterception(true);
  blockRequests(page)
  await stupidSignupPopup(page)
  await getRidOfCookiesPopup(page);

  await page.waitForSelector(chartSelector);

  const chartelement = await page.$(chartSelector);

  if (!chartelement) {browser.close(); return null}

  await page.waitForSelector(".time-axis")

  const timeaxisele = await page.$(".time-axis")

  timeaxisele?.drag({x: 300, y:0})

  await new Promise(r => setTimeout(r, 3000));

  const screenshot = await chartelement.screenshot({type:"png"})
  console.log('Screenshot saved pic ');
  await new Promise(r => setTimeout(r, 1000));

  page.removeAllListeners();

  // Close the browser
  await browser.close();

  return screenshot
};


async function getRidOfCookiesPopup(page: Page) {
  try {
    await page.waitForSelector('.content-D4RPB3ZC', {timeout: 5000})
    const cookiesbutton = await page.$('.content-D4RPB3ZC')
    cookiesbutton?.click()
  } catch (error) {
    console.log("couldnt find cookie popup - skipping")
  }

}

async function stupidSignupPopup(page: Page){
  try {
    //stupid signup popup
    await page.waitForSelector(".closeButton-wH0t6WRN", {timeout: 5000})
    const shittySignUpCunt = await page.$(".closeButton-wH0t6WRN")
    shittySignUpCunt?.click()
  } catch (error) {
    console.log("couldnt find signuppopup - skipping")
  }

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