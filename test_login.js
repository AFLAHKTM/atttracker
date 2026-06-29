const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

(async () => {
  const browser = await puppeteer.launch({
    headless: true, // Run headless now
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    defaultViewport: { width: 1280, height: 800 }
  });

  const page = await browser.newPage();
  
  try {
    console.log('Navigating to dashboard...');
    await page.goto('https://mkis-erp.76545689.xyz/dashboard', { waitUntil: 'networkidle2' });

    console.log('Waiting for login form...');
    await page.waitForSelector('#identity');

    console.log('Entering credentials...');
    await page.type('#identity', '2613248');
    await page.type('#password', 'AFLUkt@123');

    console.log('Clicking login button...');
    await Promise.all([
      page.click('button[type="submit"]'),
      page.waitForNavigation({ waitUntil: 'networkidle2' })
    ]);

    console.log('Logged in! URL is now:', page.url());

    // Wait a bit to let client-side React code load and render the dashboard data
    await new Promise(resolve => setTimeout(resolve, 8000));

    // Save screenshot
    const screenshotPath = path.join(__dirname, 'dashboard.png');
    await page.screenshot({ path: screenshotPath, fullPage: true });
    console.log('Screenshot saved to:', screenshotPath);

    // Let's dump all text on the page
    const textContent = await page.evaluate(() => document.body.innerText);
    const textPath = path.join(__dirname, 'page_text.txt');
    fs.writeFileSync(textPath, textContent, 'utf8');
    console.log('Page text saved to:', textPath);
    console.log('Sample of page text:', textContent.substring(0, 1000));

    // Also get the page HTML for deeper structure analysis if needed
    const htmlContent = await page.content();
    const htmlPath = path.join(__dirname, 'page_html.html');
    fs.writeFileSync(htmlPath, htmlContent, 'utf8');
    console.log('HTML saved to:', htmlPath);

  } catch (error) {
    console.error('Error during execution:', error);
  } finally {
    await browser.close();
  }
})();
