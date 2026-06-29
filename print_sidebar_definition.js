const fs = require('fs');
const path = require('path');

const content = fs.readFileSync(path.join(__dirname, 'js_assets', 'dashboard-B_7YhCFh.js'), 'utf8');

// Find keywords like 'roles:' and print their context
const pos = content.indexOf('roles:');
if (pos !== -1) {
  console.log('Found roles: in sidebar JS!');
  // Let's print 3000 characters before and after to capture the full navigation definition
  const start = Math.max(0, pos - 1500);
  const end = Math.min(content.length, pos + 2500);
  console.log(content.substring(start, end).replace(/\n/g, ' '));
} else {
  console.log('roles: not found in dashboard-B_7YhCFh.js');
}
