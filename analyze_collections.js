const fs = require('fs');
const path = require('path');

const logContent = fs.readFileSync(path.join(__dirname, 'api_log.txt'), 'utf8');
const blocks = logContent.split('URL: ');

for (const block of blocks) {
  if (!block.trim()) continue;
  
  const lines = block.split('\n');
  const url = lines[0];
  
  // Find where "Data: " starts
  const dataIndex = block.indexOf('Data: ');
  if (dataIndex === -1) {
    console.log(`URL: ${url}`);
    console.log('No Data block found.');
    console.log('---------------------------------------------');
    continue;
  }
  
  let jsonStr = block.substring(dataIndex + 6).trim();
  // Strip any trailing empty lines or separators
  
  let keys = [];
  try {
    const json = JSON.parse(jsonStr);
    keys = Object.keys(json);
    if (json.items) {
      keys.push(`items count: ${json.items.length}`);
      if (json.items.length > 0) {
        const firstItem = json.items[0];
        keys.push(`item keys: [${Object.keys(firstItem).join(', ')}]`);
        if (firstItem.collectionName) {
          keys.push(`collectionName: ${firstItem.collectionName}`);
        }
      }
    }
  } catch (e) {
    keys = [`Failed to parse JSON: ${e.message}`];
  }
  
  console.log(`URL: ${url}`);
  console.log(`Keys/Details: ${keys.join(', ')}`);
  console.log('---------------------------------------------');
}
