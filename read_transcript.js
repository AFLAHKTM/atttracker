const fs = require('fs');
const readline = require('readline');
const path = require('path');

const logPath = 'C:\\Users\\HP\\.gemini\\antigravity\\brain\\0a11583e-07dd-48ec-a0bc-5edb9deca04c\\.system_generated\\logs\\transcript.jsonl';

const rl = readline.createInterface({
  input: fs.createReadStream(logPath),
  output: process.stdout,
  terminal: false
});

rl.on('line', (line) => {
  if (line.includes('student_attendance') || line.includes('attendance') || line.includes('percentage') || line.includes('leave')) {
    try {
      const obj = JSON.parse(line);
      console.log(`Step ${obj.step_index} (${obj.source}, ${obj.type}):`);
      // Print truncated content or keys
      if (obj.content) {
        console.log(`  Content snippet: ${obj.content.substring(0, 300).replace(/\n/g, ' ')}...`);
      }
      if (obj.tool_calls) {
        console.log(`  Tool calls:`, JSON.stringify(obj.tool_calls));
      }
    } catch (e) {
      // ignore
    }
  }
});
