const fs = require('fs');
const path = require('path');

const html = fs.readFileSync(path.join(__dirname, 'page_html.html'), 'utf8');

// Search for the word backend or mkis-erp-backend or pocketbase
const terms = ['backend', 'pocketbase', 'http', 'api'];
for (const term of terms) {
  let count = 0;
  let pos = html.indexOf(term);
  while (pos !== -1) {
    count++;
    pos = html.indexOf(term, pos + 1);
  }
  console.log(`Term "${term}" found: ${count} times`);
}

// Print lines containing "backend"
const lines = html.split('\n');
for (const line of lines) {
  if (line.includes('backend')) {
    console.log('Line with backend:', line.trim().substring(0, 500));
  }
}
