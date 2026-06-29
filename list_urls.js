const fs = require('fs');
const path = require('path');

const logContent = fs.readFileSync(path.join(__dirname, 'api_log.txt'), 'utf8');
const blocks = logContent.split('URL: ');

for (const block of blocks) {
  if (!block.trim()) continue;
  const lines = block.split('\n');
  console.log(lines[0]);
}
