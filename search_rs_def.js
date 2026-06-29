const fs = require('fs');
const path = require('path');

const content = fs.readFileSync(path.join(__dirname, 'js_assets', 'chunk-GNGMS2XR-BstLPzL7.js'), 'utf8');

// Find definition of rs
// It could be: function rs(...), const rs = ... or let rs = ... or rs=...
const patterns = [
  'function rs(',
  'const rs=',
  'let rs=',
  'var rs=',
  'rs=()=>'
];

for (const p of patterns) {
  let pos = content.indexOf(p);
  if (pos !== -1) {
    console.log(`=== Pattern: ${p} ===`);
    console.log(content.substring(pos, pos + 500));
  }
}
