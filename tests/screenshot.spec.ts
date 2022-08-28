import { test, Page, expect } from '@playwright/test';

const url = "https://www.ceneo.pl/";
const savePath = "./screenshots/";

test.describe('Submission Screenshots:', async () => {
  test.setTimeout(90000);

  test('0.0 - Homepage', async({page, browserName}) => {
    await takeScreenshot(page, {
      urlPath: '',
      testName: 'homepage',
      browserName: browserName,
      hardWait: 0,
    });
  });

  test('1.0 - Category', async({page, browserName}) => {
    await takeScreenshot(page, {
      urlPath: '/Komputery',
      testName: 'categoryKomputery',
      browserName: browserName,
      hardWait: 3000,
    });
  });

  test('2.0 - Product', async({page, browserName}) => {
    await takeScreenshot(page, {
      urlPath: '/99105003',
      testName: 'productPopular',
      browserName: browserName,
      hardWait: 0,
    });
  });
});

interface ScreenshotInfo {
  urlPath: string;
  testName: string;
  browserName: string;
  hardWait: number;
}

async function takeScreenshot(page: Page, info: ScreenshotInfo) {
  await page.goto(url + info.urlPath);
  await scrollFullPage(page);
  await closeCookie(page);
  
  await page.waitForLoadState('networkidle');
  await waitForLazyLoadedContent(page);
  await makeHardWait(info.hardWait);
  
  var label = `${info.testName}-${info.browserName}-${Date.now().toString()}`;
  await page.screenshot({
    path: `${savePath}${label}.png`,
    fullPage: true,
  });
}

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

async function waitForLazyLoadedContent(page: Page) {
  var lazyloadedContent = page.locator("xpath=//*[contains(@class,'lazyloaded')]");
  for (let i = 0; i < await lazyloadedContent.count(); ++i)
    await expect(lazyloadedContent.nth(i)).toBeVisible();
}

async function makeHardWait(milliseconds: number) {
  await new Promise(f => setTimeout(f, milliseconds));
}