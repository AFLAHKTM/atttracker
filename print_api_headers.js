const fs = require('fs');
const path = require('path');

const logContent = fs.readFileSync(path.join(__dirname, 'api_log.txt'), 'utf8');
const blocks = logContent.split('URL: ');

for (const block of blocks) {
  if (block.includes('Authorization')) {
    console.log('--- Found Authorization header block ---');
    // print first 5 lines of the block
    console.log(block.split('\n').slice(0, 8).join('\n'));
    console.log('----------------------------------------');
    break;
  }
}
