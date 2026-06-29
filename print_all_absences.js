const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjb2xsZWN0aW9uSWQiOiJfcGJfdXNlcnNfYXV0aF8iLCJleHAiOjE3ODMzNTM1MzEsImlkIjoiOXpqdzRiNGtzcjM5NGM0IiwicmVmcmVzaGFibGUiOnRydWUsInR5cGUiOiJhdXRoIn0.BK1-xV7JKW5NJeWVBKpYGkgbqrSI2-WVsCIWxaRs_P4';
const backend = 'https://mkis-erp-backend.76545689.xyz';
const studentId = '8x34qv9003642zt';

async function check() {
  try {
    const url = `${backend}/api/collections/attendance_records/records?filter=student%3D%27${studentId}%27%26%26status%3D%27Absent%27&perPage=100&expand=attendance_event,attendance_event.subject&sort=-created`;
    const res = await fetch(url, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (res.ok) {
      const data = await res.json();
      console.log(`Total absent items: ${data.totalItems}`);
      data.items.forEach((item, idx) => {
        const ev = item.expand ? item.expand.attendance_event : null;
        const subject = ev && ev.expand ? ev.expand.subject : null;
        console.log(`[${idx + 1}] ID: ${item.id} | Status: ${item.status}`);
        console.log(`    Date: ${ev ? ev.date : 'Unknown'}`);
        console.log(`    Event: ${ev ? ev.name : 'Unknown'}`);
        console.log(`    Subject: ${subject ? subject.name : 'None'}`);
        console.log('---');
      });
    }
  } catch (e) {
    console.log('Error:', e.message);
  }
}

check();
