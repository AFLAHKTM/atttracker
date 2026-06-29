const fs = require('fs');
const path = require('path');

const html = fs.readFileSync(path.join(__dirname, 'page_html.html'), 'utf8');

const term = 'manifest';
let pos = html.toLowerCase().indexOf(term);
while (pos !== -1) {
  console.log('Found manifest at:', pos);
  console.log('Snippet:', html.substring(pos - 50, pos + 150).replace(/\n/g, ' '));
  pos = html.toLowerCase().indexOf(term, pos + 1);
}
