const fs = require('fs');
const path = require('path');

const destDir = path.join(__dirname, 'js_assets');
const files = fs.readdirSync(destDir);

const terms = ['collections', 'student_attendance', 'leave', 'attendance', 'users'];

for (const file of files) {
  const content = fs.readFileSync(path.join(destDir, file), 'utf8');
  console.log(`=== File: ${file} ===`);
  for (const term of terms) {
    const indices = [];
    let pos = content.indexOf(term);
    while (pos !== -1) {
      indices.push(pos);
      pos = content.indexOf(term, pos + 1);
    }
    console.log(`Term "${term}" found ${indices.length} times`);
    if (indices.length > 0) {
      // Print first occurrence snippet
      const firstIdx = indices[0];
      const start = Math.max(0, firstIdx - 100);
      const end = Math.min(content.length, firstIdx + 100);
      console.log(`  Snippet: ${content.substring(start, end).replace(/\n/g, ' ')}`);
    }
  }
  console.log('=======================\n');
}
