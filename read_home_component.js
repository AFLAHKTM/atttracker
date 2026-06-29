const fs = require('fs');
const path = require('path');

const content = fs.readFileSync(path.join(__dirname, 'js_assets', 'home-B6FA3nRr.js'), 'utf8');

// Let's find occurrences of key variables:
// - "studentOverallLeaveDetails"
// - "attendance"
// - "totals"
// - "onLeave"

const terms = ['studentOverallLeaveDetails', 'attendance', 'onLeave', 'totals', 'leave', 'percent'];
for (const term of terms) {
  let pos = content.indexOf(term);
  if (pos !== -1) {
    console.log(`=== Term: ${term} ===`);
    let count = 0;
    while (pos !== -1) {
      count++;
      console.log(`Match ${count} at index ${pos}:`);
      console.log(content.substring(Math.max(0, pos - 120), Math.min(content.length, pos + 180)).replace(/\n/g, ' '));
      console.log('---');
      pos = content.indexOf(term, pos + 1);
    }
  }
}
