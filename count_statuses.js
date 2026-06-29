const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjb2xsZWN0aW9uSWQiOiJfcGJfdXNlcnNfYXV0aF8iLCJleHAiOjE3ODMzNTM1MzEsImlkIjoiOXpqdzRiNGtzcjM5NGM0IiwicmVmcmVzaGFibGUiOnRydWUsInR5cGUiOiJhdXRoIn0.BK1-xV7JKW5NJeWVBKpYGkgbqrSI2-WVsCIWxaRs_P4';
const backend = 'https://mkis-erp-backend.76545689.xyz';
const studentId = '8x34qv9003642zt';

async function check() {
  try {
    const url = `${backend}/api/collections/attendance_records/records?filter=student%3D%27${studentId}%27&perPage=500`;
    const res = await fetch(url, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (res.ok) {
      const data = await res.json();
      const counts = {};
      data.items.forEach(item => {
        const s = item.status;
        counts[s] = (counts[s] || 0) + 1;
      });
      console.log('Status Counts:', counts);
    }
  } catch (e) {
    console.log('Error:', e.message);
  }
}

check();
