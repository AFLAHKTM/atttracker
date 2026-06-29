const fs = require('fs');
const readline = require('readline');

const realLogPath = 'C:\\Users\\HP\\.gemini\\antigravity\\brain\\0a11583e-07dd-48ec-a0bc-5edb9deca04c\\.system_generated\\logs\\transcript_full.jsonl';

const rl = readline.createInterface({
  input: fs.createReadStream(realLogPath),
  output: process.stdout,
  terminal: false
});

rl.on('line', (line) => {
  if (line.includes('e0v4uukf4bld93t')) {
    try {
      const obj = JSON.parse(line);
      console.log(`Step ${obj.step_index}: source=${obj.source}, type=${obj.type}`);
      // find index of e0v4uukf4bld93t
      const idx = line.indexOf('e0v4uukf4bld93t');
      console.log(`  Snippet: ${line.substring(Math.max(0, idx - 100), Math.min(line.length, idx + 200)).replace(/\n/g, ' ')}`);
      console.log('---');
    } catch (e) {
      // ignore
    }
  }
});
