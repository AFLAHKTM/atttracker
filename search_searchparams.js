const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'js_assets');
if (!fs.existsSync(dir)) {
  console.log('js_assets directory does not exist');
  process.exit(1);
}

const files = fs.readdirSync(dir);
console.log(`Searching searchParams in ${files.length} files...`);

for (const file of files) {
  const filePath = path.join(dir, file);
  if (fs.statSync(filePath).isFile()) {
    const content = fs.readFileSync(filePath, 'utf8');
    if (content.includes('searchParams')) {
      console.log(`Found searchParams in: ${file}`);
      // Find searchParams.get
      const lines = content.split('\n');
      lines.forEach((line, idx) => {
        if (line.includes('searchParams')) {
          console.log(`  Line ${idx + 1}: ${line.substring(0, 150).trim()}`);
        }
      });
    }
  }
}
