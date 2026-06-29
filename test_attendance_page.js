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
    console.log('Logging in...');
    await page.goto('https://mkis-erp.76545689.xyz/dashboard', { waitUntil: 'networkidle2' });
    await page.waitForSelector('#identity');

    await page.type('#identity', '2613248');
    await page.type('#password', 'AFLUkt@123');
    await Promise.all([
      page.click('button[type="submit"]'),
      page.waitForNavigation({ waitUntil: 'networkidle2' })
    ]);

    await new Promise(resolve => setTimeout(resolve, 5000));

    console.log('Navigating to /dashboard/attendance ...');
    await page.goto('https://mkis-erp.76545689.xyz/dashboard/attendance', { waitUntil: 'networkidle2' });
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    console.log('Current URL:', page.url());
    const html = await page.content();
    fs.writeFileSync(path.join(__dirname, 'attendance_page.html'), html);
    const text = await page.evaluate(() => document.body.innerText);
    fs.writeFileSync(path.join(__dirname, 'attendance_page_text.txt'), text);
    console.log('Saved attendance page text and HTML');

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await browser.close();
  }
})();
