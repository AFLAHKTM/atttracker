const fs = require('fs');
const path = require('path');

const content = fs.readFileSync(path.join(__dirname, 'js_assets', 'index-D7E1TsW7.js'), 'utf8');

// Find the definition of the loaders: k, P, S, y, L, M
// They are typically defined as: const k = ... or function k(...)
const loaders = ['k', 'P', 'S', 'y', 'L', 'M'];

for (const loader of loaders) {
  // Let's use regex to find where they are defined as functions or variables
  const regexes = [
    new RegExp(`const\\s+${loader}\\s*=`, 'g'),
    new RegExp(`function\\s+${loader}\\s*\\(`, 'g'),
    new RegExp(`let\\s+${loader}\\s*=`, 'g'),
    new RegExp(`var\\s+${loader}\\s*=`, 'g'),
    new RegExp(`,${loader}\\s*=`, 'g')
  ];

  console.log(`=== Loader: ${loader} ===`);
  for (const regex of regexes) {
    let match;
    while ((match = regex.exec(content)) !== null) {
      console.log(`Match at index ${match.index}:`);
      console.log(content.substring(match.index - 50, match.index + 150).replace(/\n/g, ' '));
    }
  }
}
