import { launchBrowser } from "./LaunchBrowser";

export async function getPicWithBrowser(url: string): Promise<Buffer | null> {

  let retVal = null

  const {page, browser} = await launchBrowser(false)

  await page.goto(url)

  await new Promise(r => setTimeout(r, 5000));

  // Wait for the element to be visible
  await page.waitForSelector('body > div.js-rootresizer__contents.layout-with-border-radius > div.layout__area--center > div.chart-container.single-visible.top-full-width-chart.active'); // or use a more specific selector if necessary

  // Select the element
  const element = await page.$('body > div.js-rootresizer__contents.layout-with-border-radius > div.layout__area--center > div.chart-container.single-visible.top-full-width-chart.active');

  if (element) {
    // Get the element's bounding box (position and size)
    const boundingBox = await element.boundingBox();
    
    if (boundingBox) {
      const x = boundingBox.x + boundingBox.width / 2;  // Center of the element
      const y = boundingBox.y + boundingBox.height / 2; // Center of the element

      // Move the mouse to the center of the element
      await page.mouse.move(x, y);

      //await page.mouse.click(x,y)

      // Press and hold the 'Ctrl' key
      //await page.keyboard.down('Control');

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

      //await page.mouse.down()
      //await page.mouse.drag({x,y}, {x:x+300,y:0})
      //await page.mouse.up();

      // Press and hold the 'Ctrl' key
      //await page.keyboard.up('Control');

      await new Promise(r => setTimeout(r, 3000));
      
      // Simulate pressing Ctrl + Shift + S
      await page.keyboard.down('Control');
      await page.keyboard.down('Shift');
      await page.keyboard.press('S');
      await page.keyboard.up('Shift');
      await page.keyboard.up('Control');
      console.log('Screenshot saved pic');
      await new Promise(r => setTimeout(r, 2000));


      // Access the image from the clipboard using Clipboard API in the browser context
      const imageData = await page.evaluate(async () => {
        const clipboardItems = await navigator.clipboard.read();
        const blob = await clipboardItems[0].getType('image/png'); // Or another image format if needed
        return new Promise((resolve) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result); // Base64 string
          reader.readAsDataURL(blob);
        });
      });

      // Type assertion to handle 'unknown' type
      if (typeof imageData === 'string') {
        // Convert Base64 image to Buffer
        const base64Data = imageData.split(',')[1];
        const imageBuffer = Buffer.from(base64Data, 'base64');
        retVal = imageBuffer;

        // Send the image via Telegram using Grammy
        //await bot.api.sendPhoto('<CHAT_ID>', { source: imageBuffer }); // Replace with actual chat ID

        //console.log('Image sent to Telegram!');
      } else {
          console.error('Failed to retrieve image data from clipboard');
      }



    } else {
      console.log('Element has no bounding box!');
    }
  } else {
    console.log('Element not found!');
  }



  // Close the browser
  await browser.close();
  return retVal



};