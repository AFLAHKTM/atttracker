const fs = require('fs');
const path = require('path');

const logContent = fs.readFileSync(path.join(__dirname, 'api_log.txt'), 'utf8');
const blocks = logContent.split('URL: ');

for (const block of blocks) {
  if (block.includes('/users/auth-refresh') || block.includes('/users/auth-with-password')) {
    const dataIdx = block.indexOf('Data: ');
    if (dataIdx !== -1) {
      const jsonStr = block.substring(dataIdx + 6).trim();
      try {
        const json = JSON.parse(jsonStr);
        console.log('--- Auth Response ---');
        console.log(JSON.stringify(json, null, 2));
        console.log('---------------------');
      } catch (e) {
        console.log('Failed to parse auth json:', e.message);
      }
    }
  }
}
