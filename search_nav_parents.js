const fs = require('fs');
const path = require('path');

const html = fs.readFileSync(path.join(__dirname, 'page_html.html'), 'utf8');

const terms = ['Examinations', 'Settings', 'Leave'];
for (const term of terms) {
  let index = html.indexOf(term);
  if (index !== -1) {
    console.log(`=== Term: ${term} ===`);
    const start = Math.max(0, index - 500);
    const end = Math.min(html.length, index + 500);
    console.log(html.substring(start, end));
    console.log('=======================\n');
  }
}
