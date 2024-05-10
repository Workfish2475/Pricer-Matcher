const puppeteer = require('puppeteer');

async function getTarget() {
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: null,
  });

  const page = await browser.newPage();

  await page.goto("http://target.com/", {
    waitUntil: "domcontentloaded",
  });

  const searchSelector =
    'input[aria-label="What can we help you find? suggestions appear below"]';
  await page.waitForSelector(searchSelector);
  await page.type(searchSelector, "milk chocolate");
  await page.keyboard.press("Enter");

  await page.waitForNavigation({ waitUntil: "networkidle0" });

  const childrenHTML = await page.evaluate(() => {
    const doc = document.querySelector(".styles__StyledRowWrapper-sc-z8946b-1.kmNUvV");
    const childrenHTML = doc.querySelectorAll(".styles__StyledDiv-sc-fw90uk-0.dVmWC");
    const textContents = [];
  
    childrenHTML.forEach((item) => {
      textContents.push(item.textContent);
    });
  
    return textContents;
  });
  
  console.log(childrenHTML);
  await browser.close();
}

getTarget();