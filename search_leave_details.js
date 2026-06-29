const fs = require('fs');
const path = require('path');

const content = fs.readFileSync(path.join(__dirname, 'all_responses.txt'), 'utf8');

// Find studentOverallLeaveDetails and print 2000 characters after it
const term = 'studentOverallLeaveDetails';
let pos = content.indexOf(term);
while (pos !== -1) {
  console.log(`=== Found ${term} at index ${pos} ===`);
  console.log(content.substring(pos, pos + 2000).replace(/\n/g, ' '));
  console.log('----------------------------------\n');
  pos = content.indexOf(term, pos + 1);
}
