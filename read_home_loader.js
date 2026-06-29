const fs = require('fs');
const path = require('path');

const content = fs.readFileSync(path.join(__dirname, 'js_assets', 'home-B6FA3nRr.js'), 'utf8');

// The loader function is usually at the bottom of the file or near the routes definition.
// Let's print out the last 4000 characters of home-B6FA3nRr.js, where loader is typically defined.
console.log('Last 3000 chars of home-B6FA3nRr.js:');
console.log(content.substring(content.length - 3000));
