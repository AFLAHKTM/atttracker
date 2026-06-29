const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjb2xsZWN0aW9uSWQiOiJfcGJfdXNlcnNfYXV0aF8iLCJleHAiOjE3ODMzNTM1MzEsImlkIjoiOXpqdzRiNGtzcjM5NGM0IiwicmVmcmVzaGFibGUiOnRydWUsInR5cGUiOiJhdXRoIn0.BK1-xV7JKW5NJeWVBKpYGkgbqrSI2-WVsCIWxaRs_P4';
const backend = 'https://mkis-erp-backend.76545689.xyz';

async function check() {
  try {
    const url = `${backend}/api/collections/attendance_events/records?perPage=5`;
    const res = await fetch(url, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    console.log(`Status: ${res.status} ${res.statusText}`);
    if (res.ok) {
      const data = await res.json();
      console.log('Total items:', data.totalItems);
      if (data.items.length > 0) {
        console.log('Sample item structure:', JSON.stringify(data.items[0], null, 2));
      }
    }
  } catch (e) {
    console.log('Error:', e.message);
  }
}

check();
