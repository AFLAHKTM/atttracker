const fs = require('fs');
const path = require('path');

const content = fs.readFileSync(path.join(__dirname, 'exams_responses.txt'), 'utf8');
const blocks = content.split('URL: ');

for (const block of blocks) {
  const firstLine = block.split('\n')[0].trim();
  if (firstLine.includes('.data')) {
    console.log(`URL: ${firstLine}`);
    const bodyIdx = block.indexOf('Body: ');
    if (bodyIdx !== -1) {
      const body = block.substring(bodyIdx + 6).trim();
      console.log(`Body snippet: ${body.substring(0, 1000)}`);
      console.log('---------------------------------------------');
    }
  }
}
