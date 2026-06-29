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
  
  // Listen to all network responses
  const apiResponses = [];
  page.on('response', async (response) => {
    const url = response.url();
    if (url.includes('/api/collections/')) {
      try {
        const text = await response.text();
        const json = JSON.parse(text);
        apiResponses.push({ url, data: json });
      } catch (e) {
        // Not JSON or error reading
      }
    }
  });

  try {
    console.log('Navigating to login...');
    await page.goto('https://mkis-erp.76545689.xyz/dashboard', { waitUntil: 'networkidle2' });
    await page.waitForSelector('#identity');

    console.log('Logging in...');
    await page.type('#identity', '2613248');
    await page.type('#password', 'AFLUkt@123');
    await Promise.all([
      page.click('button[type="submit"]'),
      page.waitForNavigation({ waitUntil: 'networkidle2' })
    ]);

    console.log('Logged in successfully!');
    await new Promise(resolve => setTimeout(resolve, 5000));

    // Let's print out what API responses we captured so far
    console.log('Captured PocketBase API responses on Dashboard:');
    for (const res of apiResponses) {
      console.log(`URL: ${res.url}`);
      console.log(JSON.stringify(res.data, null, 2).substring(0, 1000));
      console.log('---');
    }

    // Now let's try to navigate to /dashboard/leave/request
    console.log('Navigating to /dashboard/leave/request...');
    await page.goto('https://mkis-erp.76545689.xyz/dashboard/leave/request', { waitUntil: 'networkidle2' });
    await new Promise(resolve => setTimeout(resolve, 3000));
    const leaveText = await page.evaluate(() => document.body.innerText);
    fs.writeFileSync(path.join(__dirname, 'leave_text.txt'), leaveText, 'utf8');
    await page.screenshot({ path: path.join(__dirname, 'leave.png'), fullPage: true });

    // Let's try /dashboard/profile
    console.log('Navigating to /dashboard/profile...');
    await page.goto('https://mkis-erp.76545689.xyz/dashboard/profile', { waitUntil: 'networkidle2' });
    await new Promise(resolve => setTimeout(resolve, 3000));
    const profileText = await page.evaluate(() => document.body.innerText);
    fs.writeFileSync(path.join(__dirname, 'profile_text.txt'), profileText, 'utf8');
    await page.screenshot({ path: path.join(__dirname, 'profile.png'), fullPage: true });

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await browser.close();
  }
})();
