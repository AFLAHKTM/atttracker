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
    console.log('Navigating to dashboard...');
    await page.goto('https://mkis-erp.76545689.xyz/dashboard', { waitUntil: 'networkidle2' });
    await page.waitForSelector('#identity');

    console.log('Logging in...');
    await page.type('#identity', '2613248');
    await page.type('#password', 'AFLUkt@123');
    await Promise.all([
      page.click('button[type="submit"]'),
      page.waitForNavigation({ waitUntil: 'networkidle2' })
    ]);

    await new Promise(resolve => setTimeout(resolve, 8000));

    console.log('Expanding all collapsible menu buttons...');
    // Find all collapsible buttons in sidebar and click them
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      buttons.forEach(button => {
        if (button.innerText.includes('Leave') || button.innerText.includes('Examinations') || button.innerText.includes('Settings')) {
          button.click();
        }
      });
    });

    await new Promise(resolve => setTimeout(resolve, 2000));

    // Get all links in the page after expanding
    const navLinks = await page.evaluate(() => {
      const links = [];
      document.querySelectorAll('a').forEach(a => {
        links.push({ text: a.innerText.trim(), href: a.getAttribute('href') });
      });
      return links;
    });
    console.log('Expanded navigation links:', navLinks);

    // Save the new page text and screenshot
    const expandedText = await page.evaluate(() => document.body.innerText);
    fs.writeFileSync(path.join(__dirname, 'expanded_text.txt'), expandedText);
    await page.screenshot({ path: path.join(__dirname, 'expanded.png'), fullPage: true });

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await browser.close();
  }
})();
