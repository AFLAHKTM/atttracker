const fs = require('fs');
const path = require('path');

const content = fs.readFileSync(path.join(__dirname, 'js_assets', 'chunk-GNGMS2XR-BstLPzL7.js'), 'utf8');

// We want to find the definition of the exported identifier 'b'.
// In compiled Vite chunk, it might be exported at the end of the file as: export{... b ...} or similar, 
// and defined earlier as function b(...) or similar, or const b = ...
// Let's search for the export statement first to see what it refers to inside the file.
const exportIdx = content.indexOf('export{');
if (exportIdx !== -1) {
  const exportBlock = content.substring(exportIdx);
  console.log('Export block snippet:');
  console.log(exportBlock.substring(0, 1000));
}

// Let's find all occurrences of "useOutletContext" in chunk-GNGMS2XR-BstLPzL7.js
const contextIdx = content.indexOf('useOutletContext');
if (contextIdx !== -1) {
  console.log('\nFound useOutletContext in chunk:');
  console.log(content.substring(contextIdx - 100, contextIdx + 200));
}
