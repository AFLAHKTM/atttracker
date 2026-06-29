const fs = require('fs');
const path = require('path');

const content = fs.readFileSync(path.join(__dirname, 'page_html.html'), 'utf8');

// Find window.__reactRouterManifest and extract the routes object
const term = 'window.__reactRouterManifest =';
const startIdx = content.indexOf(term);
if (startIdx !== -1) {
  const jsonStart = content.indexOf('{', startIdx);
  let braceCount = 0;
  let jsonEnd = -1;
  for (let i = jsonStart; i < content.length; i++) {
    if (content[i] === '{') braceCount++;
    if (content[i] === '}') braceCount--;
    if (braceCount === 0) {
      jsonEnd = i + 1;
      break;
    }
  }
  if (jsonEnd !== -1) {
    const manifestStr = content.substring(jsonStart, jsonEnd);
    try {
      const manifest = JSON.parse(manifestStr);
      console.log('=== Complete React Router Routes ===');
      for (const routeId of Object.keys(manifest.routes)) {
        console.log(`Route ID: ${routeId}`);
        console.log(`  Path: ${manifest.routes[routeId].path}`);
        console.log(`  parentId: ${manifest.routes[routeId].parentId}`);
      }
      console.log('===========================');
    } catch (e) {
      console.log('Error parsing manifest:', e.message);
    }
  }
} else {
  console.log('Manifest not found in page_html.html');
}
