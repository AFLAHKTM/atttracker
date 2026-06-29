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
  
  const apiUrls = [];
  page.on('response', async (response) => {
    try {
      const url = response.url();
      if (url.includes('/api/')) {
        apiUrls.push(url);
        // Try reading it
        try {
          const text = await response.text();
          const json = JSON.parse(text);
          fs.appendFileSync(path.join(__dirname, 'api_log.txt'), `URL: ${url}\nData: ${JSON.stringify(json, null, 2)}\n\n`);
        } catch (err) {
          fs.appendFileSync(path.join(__dirname, 'api_log.txt'), `URL: ${url}\nError reading body: ${err.message}\n\n`);
        }
      }
    } catch (e) {
      // Ignore outer errors
    }
  });

  try {
    console.log('1. Navigating to login...');
    await page.goto('https://mkis-erp.76545689.xyz/dashboard', { waitUntil: 'networkidle2' });

    console.log('2. Logging in...');
    await page.type('#identity', '2613248');
    await page.type('#password', 'AFLUkt@123');
    await Promise.all([
      page.click('button[type="submit"]'),
      page.waitForNavigation({ waitUntil: 'networkidle2' })
    ]);
    console.log('Logged in! URL:', page.url());

    // Wait for the main page to render fully
    await new Promise(resolve => setTimeout(resolve, 8000));
    
    // Dump dashboard text
    const dashboardText = await page.evaluate(() => document.body.innerText);
    fs.writeFileSync(path.join(__dirname, 'dashboard_text.txt'), dashboardText);
    console.log('Dashboard text dumped.');

    // Find links in navigation
    const navLinks = await page.evaluate(() => {
      const links = [];
      document.querySelectorAll('a').forEach(a => {
        links.push({ text: a.innerText.trim(), href: a.getAttribute('href') });
      });
      return links;
    });
    console.log('Navigation links found:', navLinks);

    // Let's visit Leave page
    const leaveLink = navLinks.find(l => l.text.toLowerCase().includes('leave'));
    if (leaveLink && leaveLink.href) {
      const fullUrl = new URL(leaveLink.href, 'https://mkis-erp.76545689.xyz').href;
      console.log(`Navigating to Leave page: ${fullUrl}`);
      await page.goto(fullUrl, { waitUntil: 'networkidle2' });
      await new Promise(resolve => setTimeout(resolve, 5000));
      const leaveText = await page.evaluate(() => document.body.innerText);
      fs.writeFileSync(path.join(__dirname, 'leave_text.txt'), leaveText);
      await page.screenshot({ path: path.join(__dirname, 'leave.png'), fullPage: true });
      console.log('Leave page text and screenshot saved.');
    } else {
      console.log('No Leave link found in navigation');
    }

    // Let's visit Profile page
    const profileLink = navLinks.find(l => l.text.toLowerCase().includes('profile') || l.text.toLowerCase().includes('my profile'));
    if (profileLink && profileLink.href) {
      const fullUrl = new URL(profileLink.href, 'https://mkis-erp.76545689.xyz').href;
      console.log(`Navigating to Profile page: ${fullUrl}`);
      await page.goto(fullUrl, { waitUntil: 'networkidle2' });
      await new Promise(resolve => setTimeout(resolve, 5000));
      const profileText = await page.evaluate(() => document.body.innerText);
      fs.writeFileSync(path.join(__dirname, 'profile_text.txt'), profileText);
      await page.screenshot({ path: path.join(__dirname, 'profile.png'), fullPage: true });
      console.log('Profile page text and screenshot saved.');
    } else {
      console.log('No Profile link found in navigation');
    }

  } catch (error) {
    console.error('Unhandled error during script execution:', error);
  } finally {
    console.log('Closing browser...');
    await browser.close();
    console.log('Done!');
  }
})();
