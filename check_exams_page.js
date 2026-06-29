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
    if (url.includes('.data') || url.includes('exams') || url.includes('revaluations')) {
      try {
        const text = await response.text();
        fs.appendFileSync(path.join(__dirname, 'exams_responses.txt'), `URL: ${url}\nStatus: ${status}\nBody: ${text}\n\n`);
      } catch (err) {
        fs.appendFileSync(path.join(__dirname, 'exams_responses.txt'), `URL: ${url}\nStatus: ${status}\nError: ${err.message}\n\n`);
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

    console.log('Navigating to /dashboard/exams/my ...');
    await page.goto('https://mkis-erp.76545689.xyz/dashboard/exams/my', { waitUntil: 'networkidle2' });
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    console.log('Navigating to /dashboard/revaluations/my ...');
    await page.goto('https://mkis-erp.76545689.xyz/dashboard/revaluations/my', { waitUntil: 'networkidle2' });
    await new Promise(resolve => setTimeout(resolve, 5000));

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await browser.close();
  }
})();
