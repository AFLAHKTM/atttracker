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
  
  const allUrls = [];
  page.on('response', async (response) => {
    const url = response.url();
    let status = response.status();
    allUrls.push({ url, status });
    
    // Check if it's an API call and print body if possible
    if (url.includes('76545689.xyz')) {
      try {
        const text = await response.text();
        fs.appendFileSync(path.join(__dirname, 'all_responses.txt'), `URL: ${url}\nStatus: ${status}\nBody: ${text}\n\n`);
      } catch (err) {
        fs.appendFileSync(path.join(__dirname, 'all_responses.txt'), `URL: ${url}\nStatus: ${status}\nError: ${err.message}\n\n`);
      }
    }
  });

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

    console.log('Waiting on dashboard...');
    await new Promise(resolve => setTimeout(resolve, 10000));

    console.log('Done capturing! Total responses:', allUrls.length);

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await browser.close();
  }
})();
