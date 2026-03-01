const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', error => console.log('PAGE ERROR:', error.message));
  page.on('requestfailed', request => {
    console.log('REQUEST FAILED:', request.url(), request.failure()?.errorText);
  });

  try {
    console.log("Navigating to https://fashionfreedomnetwork.vercel.app/...");
    await page.goto('https://fashionfreedomnetwork.vercel.app/', { waitUntil: 'networkidle0', timeout: 30000 });
    console.log("Navigation successful. Taking metrics...");
    const performanceTiming = JSON.parse(
      await page.evaluate(() => JSON.stringify(window.performance.timing))
    );
    console.log(performanceTiming);
  } catch (err) {
    console.error("Navigation/Execution Error:", err);
  } finally {
    await browser.close();
  }
})();
