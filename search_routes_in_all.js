const fs = require('fs');
const path = require('path');

const destDir = path.join(__dirname, 'js_assets');
const files = fs.readdirSync(destDir);

const terms = ['dashboard/leave', 'leave/request', 'revaluations/my', 'settings/change-password'];

for (const file of files) {
  const content = fs.readFileSync(path.join(destDir, file), 'utf8');
  for (const term of terms) {
    if (content.toLowerCase().includes(term.toLowerCase())) {
      console.log(`File: ${file} CONTAINS "${term}"`);
      const idx = content.toLowerCase().indexOf(term.toLowerCase());
      console.log(`  Snippet: ${content.substring(Math.max(0, idx - 80), Math.min(content.length, idx + 120)).replace(/\n/g, ' ')}`);
    }
  }
}
