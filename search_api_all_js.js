const fs = require('fs');
const path = require('path');

const destDir = path.join(__dirname, 'js_assets');
const files = fs.readdirSync(destDir);

for (const file of files) {
  const content = fs.readFileSync(path.join(destDir, file), 'utf8');
  const term = '/api/';
  let pos = content.toLowerCase().indexOf(term);
  if (pos !== -1) {
    console.log(`File: ${file} CONTAINS "/api/"`);
    let count = 0;
    while (pos !== -1) {
      count++;
      console.log(`  Match ${count} at index ${pos}:`);
      console.log(`    Snippet: ${content.substring(Math.max(0, pos - 50), Math.min(content.length, pos + 150)).replace(/\n/g, ' ')}`);
      pos = content.toLowerCase().indexOf(term, pos + 1);
    }
  }
}
