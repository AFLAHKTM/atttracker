const fs = require('fs');
const path = require('path');

const logContent = fs.readFileSync(path.join(__dirname, 'api_log.txt'), 'utf8');

const id1 = 'e0v4uukf4bld93t';
const id2 = '9zjw4b4ksr394c4';

console.log(`id1 (${id1}) occurrences:`, (logContent.match(new RegExp(id1, 'g')) || []).length);
console.log(`id2 (${id2}) occurrences:`, (logContent.match(new RegExp(id2, 'g')) || []).length);

// Let's find blocks containing either id
const blocks = logContent.split('URL: ');
for (const block of blocks) {
  if (block.includes(id1) || block.includes(id2)) {
    const lines = block.split('\n');
    console.log('--- BLOCK START ---');
    console.log('URL:', lines[0]);
    console.log(lines.slice(1, 15).join('\n'));
    console.log('--- BLOCK END ---');
  }
}
