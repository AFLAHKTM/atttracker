const fs = require('fs');
const path = require('path');

const userId = '9zjw4b4ksr394c4';
const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjb2xsZWN0aW9uSWQiOiJfcGJfdXNlcnNfYXV0aF8iLCJleHAiOjE3ODMzNTM1MzEsImlkIjoiOXpqdzRiNGtzcjM5NGM0IiwicmVmcmVzaGFibGUiOnRydWUsInR5cGUiOiJhdXRoIn0.BK1-xV7JKW5NJeWVBKpYGkgbqrSI2-WVsCIWxaRs_P4';

const backends = [
  'https://mkis-erp.76545689.xyz',
  'https://mkis-erp-backend.76545689.xyz'
];

async function check() {
  for (const backend of backends) {
    console.log(`\n=== Testing Backend: ${backend} ===`);
    
    // Test auth-refresh to make sure token is valid there
    try {
      const authRes = await fetch(`${backend}/api/collections/users/auth-refresh`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      console.log(`Auth Refresh Status: ${authRes.status} ${authRes.statusText}`);
    } catch (e) {
      console.log(`Auth Refresh Error: ${e.message}`);
    }

    // Try student_attendance
    try {
      const url = `${backend}/api/collections/student_attendance/records?filter=student%3D%27${userId}%27&perPage=500`;
      const res = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      console.log(`student_attendance status: ${res.status} ${res.statusText}`);
      if (res.ok) {
        const data = await res.json();
        console.log(`student_attendance items: ${data.totalItems}`);
      }
    } catch (e) {
      console.log(`student_attendance Error: ${e.message}`);
    }

    // Try leave_requests
    try {
      const url = `${backend}/api/collections/leave_requests/records?filter=student%3D%27${userId}%27&perPage=500`;
      const res = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      console.log(`leave_requests status: ${res.status} ${res.statusText}`);
      if (res.ok) {
        const data = await res.json();
        console.log(`leave_requests items: ${data.totalItems}`);
      }
    } catch (e) {
      console.log(`leave_requests Error: ${e.message}`);
    }
  }
}

check();
