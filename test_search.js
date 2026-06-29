const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'js_assets', 'index-D7E1TsW7.js');
console.log('File path:', filePath);
console.log('Exists:', fs.existsSync(filePath));

const content = fs.readFileSync(filePath, 'utf8');
console.log('Content length:', content.length);

const terms = ['leave', 'attendance', 'revaluations', 'exams'];
for (const term of terms) {
  let count = 0;
  let idx = content.indexOf(term);
  while (idx !== -1) {
    count++;
    idx = content.indexOf(term, idx + 1);
  }
  console.log(`Term "${term}" count: ${count}`);
}
