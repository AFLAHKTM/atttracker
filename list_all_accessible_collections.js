const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjb2xsZWN0aW9uSWQiOiJfcGJfdXNlcnNfYXV0aF8iLCJleHAiOjE3ODMzNTM1MzEsImlkIjoiOXpqdzRiNGtzcjM5NGM0IiwicmVmcmVzaGFibGUiOnRydWUsInR5cGUiOiJhdXRoIn0.BK1-xV7JKW5NJeWVBKpYGkgbqrSI2-WVsCIWxaRs_P4';
const backend = 'https://mkis-erp-backend.76545689.xyz';

const commonNames = [
  'attendances',
  'attendance_records',
  'attendance_details',
  'student_attendance_records',
  'student_attendance_details',
  'absences',
  'absent_records',
  'absent_days',
  'student_absences',
  'student_absent_records',
  'my_attendance',
  'my_absences',
  'excuses',
  'student_excuses',
  'excuse_requests'
];

async function check() {
  for (const name of commonNames) {
    try {
      const url = `${backend}/api/collections/${name}/records`;
      const res = await fetch(url, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      console.log(`Collection "${name}": ${res.status} ${res.statusText}`);
      if (res.ok) {
        const data = await res.json();
        console.log(`  Found! Total items: ${data.totalItems}`);
      }
    } catch (e) {
      console.log(`Error checking "${name}": ${e.message}`);
    }
  }
}

check();
