const fs = require('fs');
const path = require('path');

const html = fs.readFileSync(path.join(__dirname, 'page_html.html'), 'utf8');

// Find all indices of "/assets/" and print 50 chars after
let pos = html.indexOf('/assets/');
while (pos !== -1) {
  console.log('Match:', html.substring(pos, pos + 100));
  pos = html.indexOf('/assets/', pos + 1);
}
