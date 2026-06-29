const fs = require('fs');
const path = require('path');

const content = fs.readFileSync(path.join(__dirname, 'all_responses.txt'), 'utf8');
const blocks = content.split('URL: ');

for (const block of blocks) {
  if (block.includes('notifications/records')) {
    const bodyIdx = block.indexOf('Body: ');
    if (bodyIdx !== -1) {
      const body = block.substring(bodyIdx + 6).trim();
      try {
        const json = JSON.parse(body);
        if (json.items) {
          console.log('=== Notifications Captured ===');
          json.items.forEach(item => {
            console.log(`Title: ${item.title}`);
            console.log(`Content: ${item.content}`);
            console.log(`Created: ${item.created}`);
            console.log('---');
          });
        }
      } catch (e) {
        // ignore
      }
    }
  }
}
