const fs = require('fs');
const path = require('path');

const content = fs.readFileSync(path.join(__dirname, 'js_assets', 'index-D7E1TsW7.js'), 'utf8');
console.log('First 500 chars:', content.substring(0, 500));
console.log('Includes "leave":', content.includes('leave'));
console.log('Includes "attendance":', content.includes('attendance'));
