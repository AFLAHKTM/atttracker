const fs = require('fs');
const path = require('path');

const files = ['index-Dd445zWr.js', 'index-DInKoca1.js'];
for (const file of files) {
  const filePath = path.join(__dirname, 'js_assets', file);
  if (fs.existsSync(filePath)) {
    const content = fs.readFileSync(filePath, 'utf8');
    console.log(`=== File: ${file} ===`);
    console.log('Length:', content.length);
    console.log('Includes "leave":', content.includes('leave'));
    console.log('Includes "attendance":', content.includes('attendance'));
    if (content.includes('leave')) {
      const idx = content.indexOf('leave');
      console.log('Snippet:', content.substring(idx - 50, idx + 150));
    }
  }
}
