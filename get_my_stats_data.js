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
  
  page.on('response', async (response) => {
    const url = response.url();
    const status = response.status();
    if (url.includes('.data') || url.includes('stats')) {
      try {
        const text = await response.text();
        fs.appendFileSync(path.join(__dirname, 'stats_responses.txt'), `URL: ${url}\nStatus: ${status}\nBody: ${text}\n\n`);
      } catch (err) {
        fs.appendFileSync(path.join(__dirname, 'stats_responses.txt'), `URL: ${url}\nStatus: ${status}\nError: ${err.message}\n\n`);
      }
    }
  });

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

    console.log('Navigating to /dashboard/my-stats...');
    await page.goto('https://mkis-erp.76545689.xyz/dashboard/my-stats', { waitUntil: 'networkidle2' });
    await new Promise(resolve => setTimeout(resolve, 8000));
    
    console.log('Current URL is:', page.url());
    const text = await page.evaluate(() => document.body.innerText);
    console.log('Page text length:', text.length);

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await browser.close();
  }
})();
