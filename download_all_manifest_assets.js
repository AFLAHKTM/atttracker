const fs = require('fs');
const path = require('path');

const html = fs.readFileSync(path.join(__dirname, 'page_html.html'), 'utf8');

// Match Javascript files in /assets/
const assetRegex = /\/assets\/[a-zA-Z0-9_.-]+\.js/g;
const assets = new Set();
let match;
while ((match = assetRegex.exec(html)) !== null) {
  assets.add(match[0]);
}

console.log('Detected assets in HTML manifest:', Array.from(assets));

(async () => {
  const destDir = path.join(__dirname, 'js_assets');
  if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir);
  }

  for (const asset of assets) {
    const url = `https://mkis-erp.76545689.xyz${asset}`;
    console.log(`Downloading ${url}...`);
    try {
      const res = await fetch(url);
      const text = await res.text();
      const fileName = path.basename(asset);
      fs.writeFileSync(path.join(destDir, fileName), text, 'utf8');
      console.log(`Saved ${fileName}`);
    } catch (e) {
      console.error(`Error downloading ${asset}:`, e.message);
    }
  }

  console.log('Search for key terms in all downloaded JS:');
  const files = fs.readdirSync(destDir);
  const terms = ['collections', 'student_attendance', 'leave', 'attendance', 'users'];

  for (const file of files) {
    const content = fs.readFileSync(path.join(destDir, file), 'utf8');
    const foundTerms = [];
    for (const term of terms) {
      if (content.includes(term)) {
        foundTerms.push(term);
      }
    }
    if (foundTerms.length > 0) {
      console.log(`File ${file} contains: ${foundTerms.join(', ')}`);
      const firstTerm = foundTerms[0];
      const idx = content.indexOf(firstTerm);
      console.log(`  Snippet for "${firstTerm}": ${content.substring(Math.max(0, idx - 100), Math.min(content.length, idx + 100)).replace(/\n/g, ' ')}`);
    }
  }
})();
