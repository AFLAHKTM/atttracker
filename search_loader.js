const fs = require('fs');
const path = require('path');

const content = fs.readFileSync(path.join(__dirname, 'js_assets', 'home-B6FA3nRr.js'), 'utf8');

// Search for exports or variables related to loader
const terms = ['loader', 'export', 'fetch', 'api', 'collections', 'pocketbase'];
for (const term of terms) {
  let pos = content.indexOf(term);
  if (pos !== -1) {
    console.log(`=== Term: ${term} ===`);
    let count = 0;
    while (pos !== -1) {
      count++;
      console.log(`Match ${count} at index ${pos}:`);
      console.log(content.substring(Math.max(0, pos - 100), Math.min(content.length, pos + 150)).replace(/\n/g, ' '));
      console.log('---');
      pos = content.indexOf(term, pos + 1);
    }
  }
}
