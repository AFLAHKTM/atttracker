const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjb2xsZWN0aW9uSWQiOiJfcGJfdXNlcnNfYXV0aF8iLCJleHAiOjE3ODMzNTM1MzEsImlkIjoiOXpqdzRiNGtzcjM5NGM0IiwicmVmcmVzaGFibGUiOnRydWUsInR5cGUiOiJhdXRoIn0.BK1-xV7JKW5NJeWVBKpYGkgbqrSI2-WVsCIWxaRs_P4';
const backend = 'https://mkis-erp-backend.76545689.xyz';
const studentId = '8x34qv9003642zt';

async function check() {
  try {
    const url = `${backend}/api/collections/attendance_records/records?filter=student%3D%27${studentId}%27%26%26status%3D%27Absent%27&perPage=100&expand=attendance_event,attendance_event.subject&sort=-created`;
    console.log(`Querying: ${url}`);
    const res = await fetch(url, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    console.log(`Status: ${res.status} ${res.statusText}`);
    if (res.ok) {
      const data = await res.json();
      console.log('Total absent items:', data.totalItems);
      if (data.items.length > 0) {
        console.log('First 3 absences:');
        data.items.slice(0, 3).forEach((item, idx) => {
          console.log(`[${idx + 1}] ID: ${item.id}`);
          console.log(`    Status: ${item.status}`);
          console.log(`    Created: ${item.created}`);
          if (item.expand && item.expand.attendance_event) {
            const ev = item.expand.attendance_event;
            console.log(`    Event Name: ${ev.name}`);
            console.log(`    Event Date: ${ev.date}`);
            if (ev.expand && ev.expand.subject) {
              console.log(`    Subject Name: ${ev.expand.subject.name}`);
            }
          }
        });
      }
    }
  } catch (e) {
    console.log('Error:', e.message);
  }
}

check();
