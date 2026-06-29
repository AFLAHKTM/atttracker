const fs = require('fs');
const path = require('path');

const content = fs.readFileSync(path.join(__dirname, 'js_assets', 'index-D7E1TsW7.js'), 'utf8');

// Let's print out all occurrences of "dashboard/" or routes definitions
// We can search for the word "dashboard" or "leave" and print the surrounding characters to see the full route structures.
const terms = ['dashboard/leave', 'attendance', 'leave/attendance', 'leave/history'];

for (const term of terms) {
  let index = content.indexOf(term);
  if (index !== -1) {
    console.log(`=== Term: ${term} ===`);
    let pos = index;
    while (pos !== -1) {
      console.log(`At index ${pos}:`);
      console.log(content.substring(Math.max(0, pos - 150), Math.min(content.length, pos + 150)));
      console.log('---');
      pos = content.indexOf(term, pos + 1);
    }
    console.log('=======================\n');
  }
}
