const fs = require('fs');
const path = require('path');

const content = fs.readFileSync(path.join(__dirname, 'js_assets', 'home-B6FA3nRr.js'), 'utf8');

// Find where "Ae" is imported or defined
const terms = ['Ae(', 'useOutletContext'];
for (const term of terms) {
  let pos = content.indexOf(term);
  if (pos !== -1) {
    console.log(`=== Term: ${term} ===`);
    console.log(content.substring(Math.max(0, pos - 100), Math.min(content.length, pos + 100)));
  }
}
