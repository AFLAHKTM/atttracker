const fs = require('fs');
const path = require('path');

const logContent = fs.readFileSync(path.join(__dirname, 'api_log.txt'), 'utf8');

// The log contains blocks:
// URL: ...
// Data: ...

const blocks = logContent.split('URL: ');
console.log(`Total blocks: ${blocks.length}`);

for (const block of blocks) {
  if (!block.trim()) continue;
  const lines = block.split('\n');
  const url = lines[0];
  const body = lines.slice(1).join('\n');
  
  // Search for keywords
  const keywords = ['attendance', 'leave', 'ratio', 'percent', 'present', 'absent'];
  const found = keywords.some(k => block.toLowerCase().includes(k));
  if (found) {
    console.log(`URL: ${url}`);
    if (body.includes('student_attendance')) {
      console.log('Contains student_attendance data.');
    } else {
      console.log(body.substring(0, 1000));
    }
    console.log('=============================================');
  }
}
