const fs = require('fs');
const readline = require('readline');

const logPath = 'C:\\Users\\HP\\.gemini\\antigravity\\brain\\0a11583e-07dd-48ec-a0bc-5edb9deca04c\\.system_generated\\logs\\transcript_full.jsonl';

const rl = readline.createInterface({
  input: fs.createReadStream(logPath),
  output: process.stdout,
  terminal: false
});

const urls = new Set();

rl.on('line', (line) => {
  const matches = line.match(/https?:\/\/[^\s"'`]+/g);
  if (matches) {
    for (const url of matches) {
      if (url.includes('/api/collections/')) {
        // Strip out trailing characters
        let clean = url.replace(/[\\),;]/g, '').trim();
        urls.add(clean);
      }
    }
  }
});

rl.on('close', () => {
  console.log('=== All Intercepted API Collection URLs in Logs ===');
  Array.from(urls).forEach(u => console.log(u));
  console.log('==================================================');
});
