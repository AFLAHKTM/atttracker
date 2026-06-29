const fs = require('fs');
const readline = require('readline');
const path = require('path');

const logPath = 'C:\\Users\\HP\\.gemini\\antigravity\\brain\\0a11583e-07dd-48ec-a0bc-5edb9deca04c\\..\\logs\\transcript.jsonl';
// Wait, path to logs in the structure:
// <appDataDir>\brain\<conversation-id>\.system_generated\logs\transcript.jsonl
const realLogPath = 'C:\\Users\\HP\\.gemini\\antigravity\\brain\\0a11583e-07dd-48ec-a0bc-5edb9deca04c\\.system_generated\\logs\\transcript.jsonl';

const rl = readline.createInterface({
  input: fs.createReadStream(realLogPath),
  output: process.stdout,
  terminal: false
});

rl.on('line', (line) => {
  try {
    const obj = JSON.parse(line);
    if (obj.step_index === 490 || obj.step_index === 494) {
      console.log(`=== Step ${obj.step_index} ===`);
      console.log(JSON.stringify(obj, null, 2));
      console.log('=======================');
    }
  } catch (e) {
    // ignore
  }
});
