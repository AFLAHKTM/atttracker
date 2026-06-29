const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({
    headless: true,
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    defaultViewport: { width: 1280, height: 800 }
  });

  const page = await browser.newPage();
  
  let token = null;
  let userId = null;

  page.on('response', async (response) => {
    const url = response.url();
    if (url.includes('/users/auth-refresh') || url.includes('/users/auth-with-password')) {
      try {
        const text = await response.text();
        const json = JSON.parse(text);
        token = json.token;
        userId = json.record.id;
        console.log('Captured fresh token:', token.substring(0, 30) + '...');
        console.log('Captured user ID:', userId);
      } catch (err) {
        // ignore
      }
    }
  });

  try {
    console.log('Logging in to get fresh token...');
    await page.goto('https://mkis-erp.76545689.xyz/dashboard', { waitUntil: 'networkidle2' });
    await page.waitForSelector('#identity');

    await page.type('#identity', '2613248');
    await page.type('#password', 'AFLUkt@123');
    await Promise.all([
      page.click('button[type="submit"]'),
      page.waitForNavigation({ waitUntil: 'networkidle2' })
    ]);

    await new Promise(resolve => setTimeout(resolve, 5000));

    if (token) {
      // Let's query student_attendance with student ID '8x34qv9003642zt'
      const studentId = '8x34qv9003642zt';
      const backend = 'https://mkis-erp-backend.76545689.xyz';
      
      const testUrls = [
        `${backend}/api/collections/student_attendance/records?filter=student%3D%27${studentId}%27&perPage=500&expand=lecture%2Clecture.subject`,
        `${backend}/api/collections/student_attendance/records?filter=student%3D%27${studentId}%27%26%26status%3D%27absent%27&perPage=500&expand=lecture%2Clecture.subject`,
        `${backend}/api/collections/student_attendance/records?filter=student.user.id%3D%27${userId}%27&perPage=500`
      ];

      for (const url of testUrls) {
        console.log(`\nQuerying: ${url}`);
        const res = await fetch(url, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        console.log(`Status: ${res.status} ${res.statusText}`);
        if (res.ok) {
          const data = await res.json();
          console.log(`  Items found: ${data.totalItems}`);
          if (data.items && data.items.length > 0) {
            console.log(`  Sample item status: ${data.items[0].status}`);
            if (data.items[0].expand) {
              console.log(`  Expanded keys: [${Object.keys(data.items[0].expand).join(', ')}]`);
              if (data.items[0].expand.lecture) {
                console.log(`  Lecture subject:`, data.items[0].expand.lecture.expand ? data.items[0].expand.lecture.expand.subject : 'No expand in lecture');
              }
            }
          }
        }
      }
    } else {
      console.log('Failed to capture token');
    }

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await browser.close();
  }
})();
