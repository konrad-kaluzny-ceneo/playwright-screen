import { test, Page } from '@playwright/test';

const url = "https://www.ceneo.pl/";
const savePath = "./screenshots/";
async function takeScreenshot(page: Page, label: string) {   
  await scrollFullPage(page);
  await closeCookie(page);
  await page.waitForLoadState('networkidle');
  await page.screenshot({
    path: `${savePath}${label}.png`,
    fullPage: true,
  });
}

test.describe('Submission Screenshots:', async () => {
  test.setTimeout(90000);

  test('0.0 - Homepage', async({page, browserName}) => {
    await page.goto(url);
    await takeScreenshot(page, `homepage-${browserName}`);
  });

  test('1.0 - Category', async({page, browserName}) => {
    await page.goto(url + "/Komputery");
    await takeScreenshot(page, `category-${browserName}`);
  });

  test('2.0 - Product', async({page, browserName}) => {
    await page.goto(url + "/99105003");
    await takeScreenshot(page, `product-${browserName}`);
  });
});

async function scrollFullPage(page: Page) {
  await page.evaluate(async () => {
      await new Promise<void>(resolve => {
      let totalHeight = 0;
      const distance = 100;
      const timer = setInterval(() => {
          const scrollHeight = document.body.scrollHeight;
          window.scrollBy(0, distance);
          totalHeight += distance;
          
          if (totalHeight >= scrollHeight){
              clearInterval(timer);
              resolve();
          }
      }, 100);
      });
  });
}

async function closeCookie(page: Page) {
  var locator = 'button:has-text("AKCEPTUJĘ")';
  if(await page.isVisible(locator))
      await page.locator(locator)?.click();
}