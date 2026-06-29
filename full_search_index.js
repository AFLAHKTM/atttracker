const fs = require('fs');
const path = require('path');

const content = fs.readFileSync(path.join(__dirname, 'js_assets', 'index-D7E1TsW7.js'), 'utf8');

const queries = ['leave', 'attendance', 'exam', 'revaluation', 'history', 'request'];

for (const q of queries) {
  const regex = new RegExp(q, 'gi');
  let match;
  const positions = [];
  while ((match = regex.exec(content)) !== null) {
    positions.push(match.index);
  }
  console.log(`Query "${q}" found: ${positions.length} times`);
  if (positions.length > 0) {
    console.log(`  Positions: ${positions.slice(0, 5).join(', ')}`);
    // print snippet around first position
    const first = positions[0];
    console.log(`  Snippet: ${content.substring(Math.max(0, first - 50), Math.min(content.length, first + 150)).replace(/\n/g, ' ')}`);
  }
}
