const fs = require('fs');
const path = require('path');

const content = fs.readFileSync(path.join(__dirname, 'all_responses.txt'), 'utf8');
const blocks = content.split('URL: ');

const urls = [];
for (const block of blocks) {
  if (!block.trim()) continue;
  const url = block.split('\n')[0].trim();
  urls.push(url);
}

// Print unique URLs
const uniqueUrls = Array.from(new Set(urls));
console.log('Unique Intercepted URLs:');
uniqueUrls.forEach(u => console.log(u));
