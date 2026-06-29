const fs = require('fs');
const path = require('path');

const content = fs.readFileSync(path.join(__dirname, 'all_responses.txt'), 'utf8');
const blocks = content.split('URL: ');

console.log(`Total intercepted response blocks: ${blocks.length}`);

for (const block of blocks) {
  if (!block.trim()) continue;
  const lines = block.split('\n');
  const urlLine = lines[0];
  const statusLine = lines.find(l => l.startsWith('Status: '));
  
  if (urlLine.includes('/api/')) {
    console.log(`URL: ${urlLine}`);
    console.log(`  ${statusLine}`);
    // Check if it has collectionName or similar key
    const bodyIdx = block.indexOf('Body: ');
    if (bodyIdx !== -1) {
      const body = block.substring(bodyIdx + 6).trim();
      try {
        const json = JSON.parse(body);
        console.log(`  Keys: [${Object.keys(json).join(', ')}]`);
        if (json.items) {
          console.log(`  Items count: ${json.items.length}`);
          if (json.items.length > 0) {
            console.log(`  First item keys: [${Object.keys(json.items[0]).join(', ')}]`);
            if (json.items[0].collectionName) {
              console.log(`  Collection: ${json.items[0].collectionName}`);
            }
          }
        }
      } catch (e) {
        console.log(`  Body length: ${body.length} (Non-JSON)`);
      }
    }
    console.log('---------------------------------------------');
  }
}
