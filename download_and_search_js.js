const fs = require('fs');
const path = require('path');

(async () => {
  const assets = [
    '/assets/entry.client-CCzG85MF.js',
    '/assets/chunk-GNGMS2XR-BstLPzL7.js',
    '/assets/index-Dd445zWr.js',
    '/assets/root-QHIs-QxQ.js',
    '/assets/home-Dt1cGjVg.js'
  ];

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

  console.log('Search for collections in downloaded JS:');
  const files = fs.readdirSync(destDir);
  const collections = new Set();
  const endpoints = new Set();

  for (const file of files) {
    const content = fs.readFileSync(path.join(destDir, file), 'utf8');
    
    // PocketBase collection queries often look like: collections.get('name') or collection('name')
    const collectionRegex = /collection\(['"]([^'"]+)['"]\)/g;
    let match;
    while ((match = collectionRegex.exec(content)) !== null) {
      collections.add(match[1]);
    }

    const apiRegex = /\/api\/collections\/([^/?"'\s]+)/g;
    while ((match = apiRegex.exec(content)) !== null) {
      collections.add(match[1]);
    }
  }

  console.log('Found collections:', Array.from(collections));
})();
