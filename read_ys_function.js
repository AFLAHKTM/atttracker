const fs = require('fs');
const path = require('path');

const content = fs.readFileSync(path.join(__dirname, 'js_assets', 'home-B6FA3nRr.js'), 'utf8');

// Find function ys definition
const terms = ['function ys', 'const ys =', 'let ys ='];
for (const t of terms) {
  const pos = content.indexOf(t);
  if (pos !== -1) {
    console.log(`=== Found ${t} ===`);
    console.log(content.substring(pos, pos + 2500).replace(/\n/g, ' '));
    break;
  }
}
