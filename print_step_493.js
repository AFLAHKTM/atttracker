const fs = require('fs');
const readline = require('readline');

const realLogPath = 'C:\\Users\\HP\\.gemini\\antigravity\\brain\\0a11583e-07dd-48ec-a0bc-5edb9deca04c\\.system_generated\\logs\\transcript_full.jsonl';

const rl = readline.createInterface({
  input: fs.createReadStream(realLogPath),
  output: process.stdout,
  terminal: false
});

rl.on('line', (line) => {
  try {
    const obj = JSON.parse(line);
    if (obj.step_index >= 485 && obj.step_index <= 495) {
      console.log(`=== Step ${obj.step_index} ===`);
      console.log(`Source: ${obj.source}`);
      console.log(`Type: ${obj.type}`);
      if (obj.tool_calls) console.log(`Tool Calls:`, JSON.stringify(obj.tool_calls, null, 2));
      if (obj.content) console.log(`Content length: ${obj.content.length}`);
      console.log('=======================');
    }
  } catch (e) {
    // ignore
  }
});
