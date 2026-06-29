const fs = require('fs');
const path = require('path');

const html = fs.readFileSync(path.join(__dirname, 'page_html.html'), 'utf8');

// Find occurrences of "Examinations" and "Settings" and print their surrounding tags
const terms = ['Examinations', 'Settings', 'Leave'];
for (const term of terms) {
  let index = html.indexOf(term);
  if (index !== -1) {
    console.log(`=== Term: ${term} ===`);
    const start = Math.max(0, index - 200);
    const end = Math.min(html.length, index + 200);
    console.log(html.substring(start, end));
    console.log('=======================\n');
  } else {
    console.log(`Term "${term}" not found in page_html.html`);
  }
}
