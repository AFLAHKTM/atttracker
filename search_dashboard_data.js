const fs = require('fs');
const path = require('path');

const content = fs.readFileSync(path.join(__dirname, 'all_responses.txt'), 'utf8');
const blocks = content.split('URL: ');

for (const block of blocks) {
  if (block.includes('dashboard.data')) {
    console.log('--- Found dashboard.data block ---');
    console.log(block);
    console.log('----------------------------------');
  }
}
