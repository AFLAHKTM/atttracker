const fs = require('fs');
const path = require('path');

const logContent = fs.readFileSync(path.join(__dirname, 'api_log.txt'), 'utf8');

console.log('Includes student_attendance:', logContent.includes('student_attendance'));
console.log('Includes attendance:', logContent.includes('attendance'));
console.log('Includes leave:', logContent.includes('leave'));

// Print all lines containing api/collections
const lines = logContent.split('\n');
for (const line of lines) {
  if (line.includes('api/collections')) {
    console.log(line);
  }
}
