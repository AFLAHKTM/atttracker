const fs = require('fs');
const path = require('path');

const destDir = path.join(__dirname, 'js_assets');
const files = fs.readdirSync(destDir);

const terms = ['leave', 'attendance', 'exam', 'revaluation', 'history', 'request'];

for (const file of files) {
  const content = fs.readFileSync(path.join(destDir, file), 'utf8');
  const found = [];
  for (const term of terms) {
    if (content.toLowerCase().includes(term.toLowerCase())) {
      found.push(term);
    }
  }
  if (found.length > 0) {
    console.log(`File: ${file} CONTAINS: ${found.join(', ')}`);
    const firstTerm = found[0];
    const idx = content.toLowerCase().indexOf(firstTerm.toLowerCase());
    console.log(`  Snippet for "${firstTerm}": ${content.substring(Math.max(0, idx - 50), Math.min(content.length, idx + 150)).replace(/\n/g, ' ')}`);
  }
}
