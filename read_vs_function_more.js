const fs = require('fs');
const path = require('path');

const content = fs.readFileSync(path.join(__dirname, 'js_assets', 'home-B6FA3nRr.js'), 'utf8');

// Find the definition of the function vs and read more
const term = 'function vs';
let pos = content.indexOf(term);
if (pos !== -1) {
  console.log(`=== Read more from function vs ===`);
  console.log(content.substring(pos + 2300, pos + 4800).replace(/\n/g, ' '));
}
