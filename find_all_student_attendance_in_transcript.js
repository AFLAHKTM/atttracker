const fs = require('fs');
const readline = require('readline');

const logPath = 'C:\\Users\\HP\\.gemini\\antigravity\\brain\\0a11583e-07dd-48ec-a0bc-5edb9deca04c\\.system_generated\\logs\\transcript.jsonl';

const rl = readline.createInterface({
  input: fs.createReadStream(logPath),
  output: process.stdout,
  terminal: false
});

rl.on('line', (line) => {
  if (line.includes('student_attendance')) {
    try {
      const obj = JSON.parse(line);
      console.log(`Step ${obj.step_index}: source=${obj.source}, type=${obj.type}`);
      if (obj.content && obj.content.includes('student_attendance')) {
        const idx = obj.content.indexOf('student_attendance');
        console.log(`  Content snippet: ${obj.content.substring(Math.max(0, idx - 150), Math.min(obj.content.length, idx + 150)).replace(/\n/g, ' ')}`);
      }
    } catch (e) {
      // ignore
    }
  }
});
