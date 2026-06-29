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
  
  // Follow all navigations/redirects and capture responses
  page.on('response', async (response) => {
    const url = response.url();
    const status = response.status();
    if (url.includes('.data') || url.includes('stats')) {
      try {
        const text = await response.text();
        fs.appendFileSync(path.join(__dirname, 'stats_responses_redirect.txt'), `URL: ${url}\nStatus: ${status}\nBody: ${text}\n\n`);
      } catch (err) {
        fs.appendFileSync(path.join(__dirname, 'stats_responses_redirect.txt'), `URL: ${url}\nStatus: ${status}\nError: ${err.message}\n\n`);
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

    console.log('Navigating to /dashboard/my-stats ...');
    // Clicking the link instead of using page.goto to ensure React Router handles it without 302
    await page.evaluate(() => {
      // Find link containing my-stats or stats or view stats
      const links = Array.from(document.querySelectorAll('a'));
      const statsLink = links.find(l => l.href.includes('stats'));
      if (statsLink) {
        statsLink.click();
      } else {
        // Just navigate directly but wait for router to handle it
        window.location.href = '/dashboard/my-stats'; // wait, React Router might intercept if we navigate client-side, but let's try pushing state
      }
    });

    await new Promise(resolve => setTimeout(resolve, 8000));
    console.log('Final URL after navigation attempt 1:', page.url());
    let text = await page.evaluate(() => document.body.innerText);
    fs.writeFileSync(path.join(__dirname, 'mystats_attempt1.txt'), text);

    // If still not there, let's try direct React Router state transition if possible, 
    // or navigate via page.goto and handle any redirect.
    // Wait, the redirect was to /dashboard/my-stats?startDate=2026-06-28&endDate=2026-07-04.
    // Let's go to that URL directly!
    const targetUrl = 'https://mkis-erp.76545689.xyz/dashboard/my-stats?startDate=2026-06-28&endDate=2026-07-04';
    console.log(`Navigating directly to target URL: ${targetUrl}`);
    await page.goto(targetUrl, { waitUntil: 'networkidle2' });
    await new Promise(resolve => setTimeout(resolve, 8000));
    
    console.log('Final URL after direct goto:', page.url());
    text = await page.evaluate(() => document.body.innerText);
    fs.writeFileSync(path.join(__dirname, 'mystats_direct.txt'), text);
    await page.screenshot({ path: path.join(__dirname, 'mystats_direct.png'), fullPage: true });

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await browser.close();
  }
})();
