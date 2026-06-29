const fs = require('fs');
const path = require('path');

const content = fs.readFileSync(path.join(__dirname, 'all_responses.txt'), 'utf8');
const regex = /collectionName":"([^"]+)"/g;
let match;
const collections = new Set();

while ((match = regex.exec(content)) !== null) {
  collections.add(match[1]);
}

console.log('Collections found in all_responses.txt:', Array.from(collections));
