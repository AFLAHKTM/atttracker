const fs = require('fs');
const path = require('path');

const assets = [
  '/assets/entry.client-CCzG85MF.js',
  '/assets/chunk-GNGMS2XR-BstLPzL7.js',
  '/assets/index-Dd445zWr.js',
  '/assets/error-logger-CtIreROw.js',
  '/assets/pocketbase-CB63dS4K.js',
  '/assets/pocketbase.es-DOe2iU6O.js',
  '/assets/root-QHIs-QxQ.js',
  '/assets/with-props-fcYV7VHH.js',
  '/assets/theme-provider-DAQ3fvWu.js',
  '/assets/index-D7E1TsW7.js',
  '/assets/login-DcjfF21f.js',
  '/assets/button-rbT8sF_m.js',
  '/assets/card-C1Q4ZiJf.js',
  '/assets/input-CrGBE0ZR.js',
  '/assets/label-DPstUjY2.js',
  '/assets/index-DInKoca1.js',
  '/assets/home-Dt1cGjVg.js'
];

const destDir = path.join(__dirname, 'js_assets');
if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir);
}

(async () => {
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

  console.log('\nSearching for key collections/terms:');
  const files = fs.readdirSync(destDir);
  const terms = ['collections', 'student_attendance', 'leave', 'attendance', 'exams', 'revaluations', 'leaves', 'holiday'];

  for (const file of files) {
    const content = fs.readFileSync(path.join(destDir, file), 'utf8');
    const found = [];
    for (const term of terms) {
      if (content.includes(term)) {
        found.push(term);
      }
    }
    if (found.length > 0) {
      console.log(`File ${file} contains: ${found.join(', ')}`);
      // Print snippets
      for (const t of found) {
        const idx = content.indexOf(t);
        console.log(`  Snippet for "${t}": ${content.substring(Math.max(0, idx - 80), Math.min(content.length, idx + 80)).replace(/\n/g, ' ')}`);
      }
    }
  }
})();
