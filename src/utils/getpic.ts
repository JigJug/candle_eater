import { launchBrowser } from "./LaunchBrowser";

export async function getPicWithBrowser(url: string){

  const {page, browser} = await launchBrowser(true)

  await page.goto(url)

  // Block certain requests to avoid loading unnecessary popups
  await page.setRequestInterception(true);
  page.on('request', (request) => {
      // Block certain resource types
      const blockedResources = ['image', 'stylesheet', 'font'];
      if (blockedResources.includes(request.resourceType())) {
          request.abort();
      } else {
          request.continue();
      }
  });

  await new Promise(r => setTimeout(r, 5000));


  await page.waitForSelector('.content-D4RPB3ZC')

  const cookiesbutton = await page.$('.content-D4RPB3ZC')

  if (!cookiesbutton) return null

  cookiesbutton?.click()


  // Wait for the element to be visible
  await page.waitForSelector('body > div.js-rootresizer__contents.layout-with-border-radius > div.layout__area--center > div.chart-container.single-visible.top-full-width-chart.active'); // or use a more specific selector if necessary

  // Select the element
  const element = await page.$('body > div.js-rootresizer__contents.layout-with-border-radius > div.layout__area--center > div.chart-container.single-visible.top-full-width-chart.active');



  if (!element) return null//console.log('Element has no bounding box!');
  // Get the element's bounding box (position and size)
  const boundingBox = await element.boundingBox();
      
  if (!boundingBox) return null//console.log('Element not found!');
  
  const x = boundingBox.x + boundingBox.width / 2;  // Center of the element
  const y = boundingBox.y + boundingBox.height / 2; // Center of the element

  // Move the mouse to the center of the element
  await page.mouse.move(x, y);

  //await page.mouse.click(x,y)

  // Press and hold the 'Ctrl' key
  //await page.keyboard.down('Control');

  await new Promise(r => setTimeout(r, 4000));

  // Perform double mouse scroll (scroll down twice)
  await page.mouse.wheel({ deltaY: 200 }); // Scroll downawait page.mouse.wheel({ deltaY: 200 }); // Scroll down
  await page.mouse.wheel({ deltaY: 200 }); // Scroll down
  await page.mouse.wheel({ deltaY: 200 }); // Scroll down
  await page.mouse.wheel({ deltaY: 200 }); // Scroll down
  await page.mouse.wheel({ deltaY: 200 }); // Scroll down
  await page.mouse.wheel({ deltaY: 200 }); // Scroll downawait page.mouse.wheel({ deltaY: 200 }); // Scroll down
  await page.mouse.wheel({ deltaY: 200 }); // Scroll down
  await page.mouse.wheel({ deltaY: 200 }); // Scroll down
  await page.mouse.wheel({ deltaY: 200 }); // Scroll down
  await page.mouse.wheel({ deltaY: 200 }); // Scroll down
  await page.mouse.wheel({ deltaY: 200 }); // Scroll down
  await page.mouse.wheel({ deltaY: 200 }); // Scroll down
  await page.mouse.wheel({ deltaY: 200 }); // Scroll down
  await page.mouse.wheel({ deltaY: 200 }); // Scroll down
  await page.mouse.wheel({ deltaY: 200 }); // Scroll down
  await page.mouse.wheel({ deltaY: 200 }); // Scroll down
  await page.mouse.wheel({ deltaY: 200 }); // Scroll down
  await page.mouse.wheel({ deltaY: 200 }); // Scroll down
  await page.mouse.wheel({ deltaY: 200 }); // Scroll down
  await page.mouse.wheel({ deltaY: 200 }); // Scroll down

  //await page.mouse.down()
  //await page.mouse.drag({x,y}, {x:x+300,y:0})
  //await page.mouse.up();

  // Press and hold the 'Ctrl' key
  //await page.keyboard.up('Control');

  await new Promise(r => setTimeout(r, 4000));
  
  // Simulate pressing Ctrl + Shift + S
  //await page.keyboard.down('Control');
  //await page.keyboard.down('Alt');
  //await page.keyboard.press('S');
  //await page.keyboard.up('Alt');
  //await page.keyboard.up('Control');

  const screenshot = await element.screenshot({type:"png"})
  console.log('Screenshot saved pic ');
  await new Promise(r => setTimeout(r, 1000));

  /**await page.waitForSelector("body > div.js-rootresizer__contents.layout-with-border-radius > div.layout__area--top > div > div > div:nth-child(3) > div.wrapOverflow-wXGVFOC9 > div > div > div > div > div:nth-child(16) > button.button-merBkM5y.apply-common-tooltip.accessible-merBkM5y")

  const elementSnap = await page.$("body > div.js-rootresizer__contents.layout-with-border-radius > div.layout__area--top > div > div > div:nth-child(3) > div.wrapOverflow-wXGVFOC9 > div > div > div > div > div:nth-child(16) > button.button-merBkM5y.apply-common-tooltip.accessible-merBkM5y")

  elementSnap?.click()
  await page.keyboard.press('ArrowDown'); // Move down the menu
  await page.keyboard.press('Enter'); // Select the highlighted item
  console.log('Screenshot saved pic using selector and key down');
  await new Promise(r => setTimeout(r, 10000));

  // Grant clipboard access permission
  const context = browser.defaultBrowserContext();
  await context.overridePermissions('https://www.tradingview.com', ['clipboard-read']);


  const imageData = await page.evaluate(() => {
      return navigator.clipboard.read().then(clipboardItems => {
          const clipboardItem = clipboardItems[0];
          const availableTypes = clipboardItem.types;
  
          if (!availableTypes.includes('image/png')) {
              throw new Error('Clipboard does not contain an image of type png');
          }
  
          return clipboardItem.getType('image/png').then(blob => {
              return new Promise((resolve) => {
                  const reader = new FileReader();
                  reader.onload = () => resolve(reader.result); // Base64 string
                  reader.readAsDataURL(blob);
              });
          });
      });
  });
  
  
  

  // Type assertion to handle 'unknown' type
  if (typeof imageData === 'string') {
      // Convert Base64 image to Buffer
      const base64Data = imageData.split(',')[1];
      const imageBuffer = Buffer.from(base64Data, 'base64');

      console.log(imageBuffer)

      //return imageBuffer

      // Send the image via Telegram using Grammy
      //await bot.api.sendPhoto('<CHAT_ID>', { source: imageBuffer }); // Replace with actual chat ID

      //console.log('Image sent to Telegram!');
  } else {
      console.error('Failed to retrieve image data from clipboard');
  }**/

  page.removeAllListeners();

  // Close the browser
  await browser.close();

  return screenshot



};