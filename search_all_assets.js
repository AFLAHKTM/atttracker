const fs = require('fs');
const path = require('path');

const destDir = path.join(__dirname, 'js_assets');
const files = fs.readdirSync(destDir);

for (const file of files) {
  const content = fs.readFileSync(path.join(destDir, file), 'utf8');
  const found = [];
  if (content.toLowerCase().includes('attendance')) found.push('attendance');
  if (content.toLowerCase().includes('collections')) found.push('collections');
  if (content.toLowerCase().includes('student_attendance')) found.push('student_attendance');
  if (content.toLowerCase().includes('leave')) found.push('leave');
  
  if (found.length > 0) {
    console.log(`File: ${file} contains: ${found.join(', ')}`);
    // Print snippet for the first match
    const first = found[0];
    const idx = content.toLowerCase().indexOf(first.toLowerCase());
    console.log(`  Snippet: ${content.substring(Math.max(0, idx - 80), Math.min(content.length, idx + 120)).replace(/\n/g, ' ')}`);
  }
}
