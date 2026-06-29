const fs = require('fs');
const path = require('path');

const newAssets = [
  '/assets/dashboard-B_7YhCFh.js',
  '/assets/home-B6FA3nRr.js',
  '/assets/roles-BI6CGRjg.js',
  '/assets/index-KO_UJMfF.js',
  '/assets/index-AazicoWZ.js',
  '/assets/index-CKFePm-Z.js',
  '/assets/index-BlZ_xX5T.js',
  '/assets/index-qpVh98Og.js',
  '/assets/index-D9AkKVWA.js',
  '/assets/index-DbPW23MF.js',
  '/assets/index-Cyhq-jS_.js',
  '/assets/index-hMC76ybR.js',
  '/assets/index-T1UKxOe5.js',
  '/assets/index-CyYAzjBW.js',
  '/assets/index-ebDcgc51.js'
];

const destDir = path.join(__dirname, 'js_assets');
if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir);
}

(async () => {
  for (const asset of newAssets) {
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

  console.log('\nSearching for key collections/terms in new assets:');
  const files = fs.readdirSync(destDir);
  const terms = ['collections', 'student_attendance', 'leave', 'attendance', 'exams', 'revaluations', 'leaves', 'holiday'];

  for (const file of files) {
    if (!newAssets.some(a => a.includes(file))) continue; // Only search the new assets
    const content = fs.readFileSync(path.join(destDir, file), 'utf8');
    const found = [];
    for (const term of terms) {
      if (content.toLowerCase().includes(term.toLowerCase())) {
        found.push(term);
      }
    }
    if (found.length > 0) {
      console.log(`File ${file} contains: ${found.join(', ')}`);
      for (const t of found) {
        const idx = content.toLowerCase().indexOf(t.toLowerCase());
        console.log(`  Snippet for "${t}": ${content.substring(Math.max(0, idx - 80), Math.min(content.length, idx + 120)).replace(/\n/g, ' ')}`);
      }
    }
  }
})();
