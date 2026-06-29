const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({
    headless: true,
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    defaultViewport: { width: 1280, height: 800 }
  });

  const page = await browser.newPage();
  
  let responseData = null;

  page.on('response', async (response) => {
    const url = response.url();
    if (url.includes('dashboard.data')) {
      try {
        const text = await response.text();
        responseData = JSON.parse(text);
      } catch (err) {
        // ignore
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

    // Now let's try to fetch dashboard.data for another date (e.g., June 22, 2026 - which was a Monday)
    console.log('Navigating to dashboard with date parameter: ?date=2026-06-22');
    await page.goto('https://mkis-erp.76545689.xyz/dashboard?date=2026-06-22', { waitUntil: 'networkidle2' });
    await new Promise(resolve => setTimeout(resolve, 5000));

    if (responseData) {
      console.log('Successfully captured dashboard.data for June 22!');
      // Let's print out the resolved attendance summary
      // We can use a simple script to check if there is studentAttendanceSummary
      console.log('Keys in data:', Object.keys(responseData));
      // Let's search if the string "Absent" is in responseData
      const str = JSON.stringify(responseData);
      console.log('Does it contain "Absent"?', str.includes('Absent'));
      console.log('Does it contain "Present"?', str.includes('Present'));
    } else {
      console.log('Failed to capture dashboard.data');
    }

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await browser.close();
  }
})();
