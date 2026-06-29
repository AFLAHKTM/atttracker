const fs = require('fs');
const path = require('path');

const content = fs.readFileSync(path.join(__dirname, 'all_responses.txt'), 'utf8');

// Find all matches of dashboard.data and print the parsed array elements
const blocks = content.split('URL: ');
for (const block of blocks) {
  if (block.includes('dashboard.data')) {
    const bodyIdx = block.indexOf('Body: ');
    if (bodyIdx !== -1) {
      const body = block.substring(bodyIdx + 6).trim();
      try {
        const json = JSON.parse(body);
        console.log('Successfully parsed dashboard.data JSON!');
        
        // Let's print out the keys and their positions in the array
        console.log('Array length:', json.length);
        
        // Let's find specific keys and print their values
        const keysToFind = ['studentAttendanceSummary', 'studentOverallLeaveDetails', 'stats', 'studentExamMarks'];
        for (const key of keysToFind) {
          const idx = json.indexOf(key);
          if (idx !== -1) {
            console.log(`Key "${key}" found at index ${idx}`);
            // In React Router streaming format:
            // [..., "key", value, ...]
            // Let's print the next few items in the array
            console.log('Next items:', json.slice(idx, idx + 5));
          } else {
            console.log(`Key "${key}" not found in array`);
          }
        }
      } catch (e) {
        console.log('Error parsing JSON from block:', e.message);
      }
    }
  }
}
