const fs = require('fs');
const path = require('path');

const html = fs.readFileSync(path.join(__dirname, 'page_html.html'), 'utf8');
const regex = /<a[^>]*href=["']([^"']*)["'][^>]*>/g;
let match;
const links = new Set();
while ((match = regex.exec(html)) !== null) {
  links.add(match[1]);
}
console.log('Links found in page HTML:', Array.from(links));
