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
      if (obj.step_index < 200) {
        console.log(`=== Step ${obj.step_index} (${obj.source}, ${obj.type}) ===`);
        if (obj.content) {
          console.log(`Content: ${obj.content.substring(0, 1000)}`);
        }
        if (obj.tool_calls) {
          console.log(`Tool Calls:`, JSON.stringify(obj.tool_calls, null, 2));
        }
      }
    } catch (e) {
      // ignore
    }
  }
});
