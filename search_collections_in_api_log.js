const fs = require('fs');
const path = require('path');

const logContent = fs.readFileSync(path.join(__dirname, 'api_log.txt'), 'utf8');
const regex = /\/api\/collections\/([^\/]+)\/records/g;
let match;
const collections = new Set();

while ((match = regex.exec(logContent)) !== null) {
  collections.add(match[1]);
}

console.log('Collections found in api_log.txt:', Array.from(collections));
