const fs = require('fs');
const path = require('path');

const content = fs.readFileSync(path.join(__dirname, 'js_assets', 'home-B6FA3nRr.js'), 'utf8');

// Find all occurrences of "Ae" or imports at the beginning of the file
console.log('First 1000 characters:');
console.log(content.substring(0, 1000));

console.log('\nSearch for definition of Ae:');
const regex = /const\s+Ae\s*=|import\s*\{[^}]*Ae[^}]*\}\s*from/g;
let match;
while ((match = regex.exec(content)) !== null) {
  console.log('Match found at index:', match.index);
  console.log(content.substring(match.index - 50, match.index + 150));
}
