const fs = require('fs');
const readline = require('readline');

const realLogPath = 'C:\\Users\\HP\\.gemini\\antigravity\\brain\\0a11583e-07dd-48ec-a0bc-5edb9deca04c\\.system_generated\\logs\\transcript.jsonl';

const rl = readline.createInterface({
  input: fs.createReadStream(realLogPath),
  output: process.stdout,
  terminal: false
});

rl.on('line', (line) => {
  try {
    const obj = JSON.parse(line);
    if (obj.step_index >= 70 && obj.step_index <= 74) {
      console.log(`=== Step ${obj.step_index} ===`);
      console.log(JSON.stringify(obj, null, 2));
      console.log('=======================');
    }
  } catch (e) {
    // ignore
  }
});
