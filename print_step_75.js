const fs = require('fs');
const readline = require('readline');

const logPath = 'C:\\Users\\HP\\.gemini\\antigravity\\brain\\0a11583e-07dd-48ec-a0bc-5edb9deca04c\\.system_generated\\logs\\transcript_full.jsonl';

const rl = readline.createInterface({
  input: fs.createReadStream(logPath),
  output: process.stdout,
  terminal: false
});

rl.on('line', (line) => {
  try {
    const obj = JSON.parse(line);
    if (obj.step_index === 75) {
      console.log('=== Step 75 Full Content ===');
      console.log(obj.content);
      console.log('============================');
    }
  } catch (e) {
    // ignore
  }
});
