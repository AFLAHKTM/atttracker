const fs = require('fs');
const path = require('path');

const content = fs.readFileSync(path.join(__dirname, 'js_assets', 'home-B6FA3nRr.js'), 'utf8');

const term = 'function vs';
let pos = content.indexOf(term);
if (pos !== -1) {
  console.log(`=== Rest of function vs ===`);
  console.log(content.substring(pos + 4800, pos + 7800).replace(/\n/g, ' '));
}
