const puppeteer = require('puppeteer');

// Reconstruct JSAN turbostream
function resolveTurbostream(json) {
  if (!json || !Array.isArray(json)) return json;
  function resolve(val) {
    if (val === null || val === undefined) return val;
    if (typeof val === 'number') return val;
    if (Array.isArray(val)) {
      return val.map(item => {
        if (typeof item === 'number' && item >= 0 && item < json.length) return resolve(json[item]);
        return resolve(item);
      });
    }
    if (typeof val === 'object') {
      const obj = {};
      for (const key of Object.keys(val)) {
        if (key.startsWith('_')) {
          const refKeyIdx = parseInt(key.substring(1));
          const refValIdx = val[key];
          const realKey = json[refKeyIdx];
          let realVal = null;
          if (typeof refValIdx === 'number' && refValIdx >= 0 && refValIdx < json.length) {
            realVal = resolve(json[refValIdx]);
          } else if (refValIdx === -5) {
            realVal = undefined;
          } else {
            realVal = resolve(refValIdx);
          }
          obj[realKey] = realVal;
        } else {
          obj[key] = resolve(val[key]);
        }
      }
      return obj;
    }
    return val;
  }
  const resolvedData = {};
  for (let i = 0; i < json.length; i++) {
    if (typeof json[i] === 'string' && !json[i].startsWith('_')) {
      const val = json[i+1];
      if (val !== undefined) {
        resolvedData[json[i]] = resolve(val);
      }
    }
  }
  return resolvedData;
}

(async () => {
  const browser = await puppeteer.launch({
    headless: true,
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
  });

  const page = await browser.newPage();

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

    // Get cookies
    const cookies = await page.cookies();
    const cookieHeader = cookies.map(c => `${c.name}=${c.value}`).join('; ');
    console.log('Cookie Header:', cookieHeader);

    // Let's test fetch for June 22
    const dateStr = '2026-06-22';
    const url = `https://mkis-erp.76545689.xyz/dashboard.data?date=${dateStr}`;
    console.log(`Fetching: ${url}`);
    
    const res = await fetch(url, {
      headers: {
        'Cookie': cookieHeader
      }
    });
    console.log('Status:', res.status, res.statusText);
    
    if (res.ok) {
      const text = await res.text();
      const json = JSON.parse(text);
      const resolved = resolveTurbostream(json);
      console.log('Resolved studentAttendanceSummary for June 22:');
      console.log(JSON.stringify(resolved.studentAttendanceSummary, null, 2));
    }

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await browser.close();
  }
})();
