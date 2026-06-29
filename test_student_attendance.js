const fs = require('fs');
const path = require('path');

const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjb2xsZWN0aW9uSWQiOiJfcGJfdXNlcnNfYXV0aF8iLCJleHAiOjE3ODMzNTM1MzEsImlkIjoiOXpqdzRiNGtzcjM5NGM0IiwicmVmcmVzaGFibGUiOnRydWUsInR5cGUiOiJhdXRoIn0.BK1-xV7JKW5NJeWVBKpYGkgbqrSI2-WVsCIWxaRs_P4';
const backend = 'https://mkis-erp-backend.76545689.xyz';
const studentId = '8x34qv9003642zt';

async function check() {
  const urls = [
    // 1. With correct student ID filter
    `${backend}/api/collections/student_attendance/records?filter=student%3D%27${studentId}%27&perPage=500`,
    // 2. Try with expand
    `${backend}/api/collections/student_attendance/records?filter=student%3D%27${studentId}%27&expand=lecture&perPage=500`,
    // 3. Try another collection name like "attendances"
    `${backend}/api/collections/attendances/records?filter=student%3D%27${studentId}%27&perPage=500`
  ];

  for (const url of urls) {
    try {
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
