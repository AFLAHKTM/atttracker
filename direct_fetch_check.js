(async () => {
  const url = 'https://mkis-erp.76545689.xyz/assets/index-D7E1TsW7.js';
  const res = await fetch(url);
  const text = await res.text();
  console.log('Length from server:', text.length);
  console.log('Includes "leave":', text.includes('leave'));
  console.log('Includes "attendance":', text.includes('attendance'));
})();
