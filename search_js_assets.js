const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'js_assets');
if (!fs.existsSync(dir)) {
  console.log('js_assets directory does not exist');
  process.exit(1);
}

const files = fs.readdirSync(dir);
console.log(`Searching ${files.length} files in js_assets...`);

for (const file of files) {
  const filePath = path.join(dir, file);
  if (fs.statSync(filePath).isFile()) {
    const content = fs.readFileSync(filePath, 'utf8');
    if (content.includes('student_attendance')) {
      console.log(`Found "student_attendance" in: ${file}`);
      // Print context of matching line
      const lines = content.split('\n');
      lines.forEach((line, idx) => {
        if (line.includes('student_attendance')) {
          console.log(`  Line ${idx + 1}: ${line.substring(0, 150)}`);
        }
      });
    }
  }
}
