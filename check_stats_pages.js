const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

(async () => {
  const browser = await puppeteer.launch({
    headless: true,
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    defaultViewport: { width: 1280, height: 800 }
  });

  const page = await browser.newPage();

  try {
    console.log('Navigating and logging in...');
    await page.goto('https://mkis-erp.76545689.xyz/dashboard', { waitUntil: 'networkidle2' });
    await page.waitForSelector('#identity');

    await page.type('#identity', '2613248');
    await page.type('#password', 'AFLUkt@123');
    await Promise.all([
      page.click('button[type="submit"]'),
      page.waitForNavigation({ waitUntil: 'networkidle2' })
    ]);

    await new Promise(resolve => setTimeout(resolve, 8000));

    // Let's try to navigate to /dashboard/my-stats
    console.log('Navigating to /dashboard/my-stats...');
    await page.goto('https://mkis-erp.76545689.xyz/dashboard/my-stats', { waitUntil: 'networkidle2' });
    await new Promise(resolve => setTimeout(resolve, 3000));
    const mystatsText = await page.evaluate(() => document.body.innerText);
    fs.writeFileSync(path.join(__dirname, 'mystats_text.txt'), mystatsText);
    await page.screenshot({ path: path.join(__dirname, 'mystats.png'), fullPage: true });
    console.log('Saved my-stats text and screenshot');

    // Let's try to navigate to /dashboard/campus-stats
    console.log('Navigating to /dashboard/campus-stats...');
    await page.goto('https://mkis-erp.76545689.xyz/dashboard/campus-stats', { waitUntil: 'networkidle2' });
    await new Promise(resolve => setTimeout(resolve, 3000));
    const campusstatsText = await page.evaluate(() => document.body.innerText);
    fs.writeFileSync(path.join(__dirname, 'campusstats_text.txt'), campusstatsText);
    await page.screenshot({ path: path.join(__dirname, 'campusstats.png'), fullPage: true });
    console.log('Saved campus-stats text and screenshot');

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await browser.close();
  }
})();
