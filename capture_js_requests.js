const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({
    headless: true,
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    defaultViewport: { width: 1280, height: 800 }
  });

  const page = await browser.newPage();
  
  const jsRequests = [];
  page.on('request', (req) => {
    const url = req.url();
    if (url.endsWith('.js') || url.includes('/assets/')) {
      jsRequests.push(url);
    }
  });

  try {
    console.log('Navigating to login...');
    await page.goto('https://mkis-erp.76545689.xyz/dashboard', { waitUntil: 'networkidle2' });
    
    console.log('Logging in...');
    await page.type('#identity', '2613248');
    await page.type('#password', 'AFLUkt@123');
    await Promise.all([
      page.click('button[type="submit"]'),
      page.waitForNavigation({ waitUntil: 'networkidle2' })
    ]);

    await new Promise(resolve => setTimeout(resolve, 8000));

    console.log('Expanding menus...');
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      buttons.forEach(button => {
        if (button.innerText.includes('Leave') || button.innerText.includes('Examinations') || button.innerText.includes('Settings')) {
          button.click();
        }
      });
    });

    await new Promise(resolve => setTimeout(resolve, 3000));

    console.log('All JS/Asset requests captured during session:');
    console.log(jsRequests);

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await browser.close();
  }
})();
