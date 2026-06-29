const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjb2xsZWN0aW9uSWQiOiJfcGJfdXNlcnNfYXV0aF8iLCJleHAiOjE3ODMzNTM1MzEsImlkIjoiOXpqdzRiNGtzcjM5NGM0IiwicmVmcmVzaGFibGUiOnRydWUsInR5cGUiOiJhdXRoIn0.BK1-xV7JKW5NJeWVBKpYGkgbqrSI2-WVsCIWxaRs_P4';
const backend = 'https://mkis-erp-backend.76545689.xyz';
const studentId = '8x34qv9003642zt';
const userId = '9zjw4b4ksr394c4';

async function check() {
  const filters = [
    `student='${studentId}'`,
    `student='${userId}'`,
    `student='${studentId}'%26%26date%3D'2026-06-29'`,
    `student='${userId}'%26%26date%3D'2026-06-29'`,
    `student.user.id='${userId}'`
  ];

  for (const filter of filters) {
    try {
      const url = `${backend}/api/collections/student_attendance/records?filter=${filter}`;
      console.log(`Querying: ${url}`);
      const res = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      console.log(`Status: ${res.status} ${res.statusText}`);
      if (res.ok) {
        const data = await res.json();
        console.log(`  Items: ${data.totalItems}`);
        if (data.items && data.items.length > 0) {
          console.log(`  Sample item keys: [${Object.keys(data.items[0]).join(', ')}]`);
        }
      }
    } catch (e) {
      console.log(`Error: ${e.message}`);
    }
  }
}

check();
