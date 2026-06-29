const fs = require('fs');
const path = require('path');

const content = fs.readFileSync(path.join(__dirname, 'js_assets', 'home-B6FA3nRr.js'), 'utf8');

// Find the definition of the function vs
const term = 'function vs';
let pos = content.indexOf(term);
if (pos !== -1) {
  console.log(`=== Found function vs at index ${pos} ===`);
  console.log(content.substring(pos, pos + 2500).replace(/\n/g, ' '));
} else {
  // Let's search for "vs(" or "vs ="
  const otherTerms = ['vs(', 'const vs =', 'let vs ='];
  for (const t of otherTerms) {
    pos = content.indexOf(t);
    if (pos !== -1) {
      console.log(`=== Found ${t} at index ${pos} ===`);
      console.log(content.substring(pos, pos + 1000).replace(/\n/g, ' '));
      break;
    }
  }
}
