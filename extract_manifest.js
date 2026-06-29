const fs = require('fs');
const path = require('path');

const html = fs.readFileSync(path.join(__dirname, 'page_html.html'), 'utf8');

const startIdx = html.indexOf('window.__reactRouterManifest =');
if (startIdx !== -1) {
  const endIdx = html.indexOf('};', startIdx);
  console.log(html.substring(startIdx, endIdx + 2));
} else {
  console.log('window.__reactRouterManifest not found in page_html.html');
}
