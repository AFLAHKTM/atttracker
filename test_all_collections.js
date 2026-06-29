const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjb2xsZWN0aW9uSWQiOiJfcGJfdXNlcnNfYXV0aF8iLCJleHAiOjE3ODMzNTM1MzEsImlkIjoiOXpqdzRiNGtzcjM5NGM0IiwicmVmcmVzaGFibGUiOnRydWUsInR5cGUiOiJhdXRoIn0.BK1-xV7JKW5NJeWVBKpYGkgbqrSI2-WVsCIWxaRs_P4';
const backend = 'https://mkis-erp-backend.76545689.xyz';

const colls = [
  'lectures',
  'subjects',
  'teachers',
  'classrooms',
  'student_groups',
  'batches',
  'semesters',
  'attendance_events'
];

async function check() {
  for (const coll of colls) {
    try {
      const url = `${backend}/api/collections/${coll}/records?perPage=10`;
      const res = await fetch(url, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      console.log(`Collection "${coll}" status: ${res.status} ${res.statusText}`);
      if (res.ok) {
        const data = await res.json();
        console.log(`  Items count: ${data.totalItems}`);
      }
    } catch (e) {
      console.log(`Collection "${coll}" Error: ${e.message}`);
    }
  }
}

check();
