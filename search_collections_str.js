const fs = require('fs');
const path = require('path');

const destDir = path.join(__dirname, 'js_assets');
const files = fs.readdirSync(destDir);

for (const file of files) {
  const content = fs.readFileSync(path.join(destDir, file), 'utf8');
  if (content.includes('/api/collections/')) {
    console.log(`File: ${file} CONTAINS "/api/collections/"`);
    const idx = content.indexOf('/api/collections/');
    console.log(`  Snippet: ${content.substring(idx - 50, idx + 150).replace(/\n/g, ' ')}`);
  }
}
