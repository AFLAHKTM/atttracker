const fs = require('fs');
const path = require('path');

const logPath = 'C:\\Users\\HP\\.gemini\\antigravity\\brain\\0a11583e-07dd-48ec-a0bc-5edb9deca04c\\.system_generated\\tasks\\task-72.log';
if (fs.existsSync(logPath)) {
  console.log('=== Task 72 Log Contents ===');
  console.log(fs.readFileSync(logPath, 'utf8'));
  console.log('============================');
} else {
  console.log('Task 72 log not found.');
}
