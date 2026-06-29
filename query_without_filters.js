const fs = require('fs');
const path = require('path');

const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjb2xsZWN0aW9uSWQiOiJfcGJfdXNlcnNfYXV0aF8iLCJleHAiOjE3ODMzNTM1MzEsImlkIjoiOXpqdzRiNGtzcjM5NGM0IiwicmVmcmVzaGFibGUiOnRydWUsInR5cGUiOiJhdXRoIn0.BK1-xV7JKW5NJeWVBKpYGkgbqrSI2-WVsCIWxaRs_P4';
const backend = 'https://mkis-erp-backend.76545689.xyz';

const collections = [
  'student_attendance',
  'attendance',
  'leave_requests',
  'leaves',
  'student_leaves',
  'leave_applications'
];

async function check() {
  for (const coll of collections) {
    try {
      const url = `${backend}/api/collections/${coll}/records?perPage=100`;
      const res = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      console.log(`Collection "${coll}" status: ${res.status} ${res.statusText}`);
      if (res.ok) {
        const data = await res.json();
        console.log(`  Items count: ${data.totalItems}`);
        if (data.items && data.items.length > 0) {
          console.log(`  First item keys: [${Object.keys(data.items[0]).join(', ')}]`);
          // Print first item values
          console.log(`  First item sample:`, JSON.stringify(data.items[0], null, 2));
        }
      }
    } catch (e) {
      console.log(`Collection "${coll}" Error: ${e.message}`);
    }
  }
}

check();
