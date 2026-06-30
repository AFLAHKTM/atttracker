const express = require('express');
const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Enable CORS for local file access
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

// Cache storage for stats
let statsCache = null;
let lastSynced = null;
let isSyncing = false;
let cachedToken = null;
let cachedUserId = null;

// Resolve turbostream JSAN references (index-based references)
function resolveTurbostream(json) {
  if (!json || !Array.isArray(json)) return json;
  
  function resolve(val) {
    if (val === null || val === undefined) return val;
    if (typeof val === 'number') return val;
    if (Array.isArray(val)) {
      return val.map(item => {
        if (typeof item === 'number' && item >= 0 && item < json.length) {
          return resolve(json[item]);
        }
        return resolve(item);
      });
    }
    if (typeof val === 'object') {
      const obj = {};
      for (const key of Object.keys(val)) {
        if (key.startsWith('_')) {
          const refKeyIdx = parseInt(key.substring(1));
          const refValIdx = val[key];
          const realKey = json[refKeyIdx];
          let realVal = null;
          if (typeof refValIdx === 'number' && refValIdx >= 0 && refValIdx < json.length) {
            realVal = resolve(json[refValIdx]);
          } else if (refValIdx === -5) {
            realVal = undefined;
          } else {
            realVal = resolve(refValIdx);
          }
          obj[realKey] = realVal;
        } else {
          obj[key] = resolve(val[key]);
        }
      }
      return obj;
    }
    return val;
  }

  const resolvedData = {};
  for (let i = 0; i < json.length; i++) {
    if (typeof json[i] === 'string' && !json[i].startsWith('_')) {
      const val = json[i+1];
      if (val !== undefined) {
        resolvedData[json[i]] = resolve(val);
      }
    }
  }
  return resolvedData;
}

// Scraper function
async function scrapeERPData() {
  const browser = await puppeteer.launch({
    headless: true,
    executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
    defaultViewport: { width: 1280, height: 800 }
  });

  const page = await browser.newPage();
  
  let dashboardDataRaw = null;
  let leaveRequests = [];
  let token = cachedToken;
  let userId = cachedUserId;
  let studentId = null;

  // Intercept data files and API calls
  page.on('response', async (response) => {
    const url = response.url();
    if (url.includes('dashboard.data')) {
      try {
        const text = await response.text();
        dashboardDataRaw = JSON.parse(text);
      } catch (err) {
        console.error('Error parsing dashboard.data:', err.message);
      }
    }
    if (url.includes('/users/auth-refresh')) {
      try {
        const text = await response.text();
        const json = JSON.parse(text);
        token = json.token;
        userId = json.record.id;
        cachedToken = token;
        cachedUserId = userId;
      } catch (err) {
        // ignore
      }
    }
  });

  try {
    console.log('[Scraper] Navigating to login...');
    await page.goto('https://mkis-erp.76545689.xyz/dashboard', { waitUntil: 'networkidle2' });
    await page.waitForSelector('#identity');

    console.log('[Scraper] Logging in...');
    await page.type('#identity', '2613248');
    await page.type('#password', 'AFLUkt@123');
    await Promise.all([
      page.click('button[type="submit"]'),
      page.waitForNavigation({ waitUntil: 'networkidle2' })
    ]);

    console.log('[Scraper] Waiting on dashboard...');
    await new Promise(resolve => setTimeout(resolve, 6000));

    // Resolve student group and other parameters
    if (dashboardDataRaw) {
      const resolved = resolveTurbostream(dashboardDataRaw);
      
      // Calculate overall counts
      let overallPresent = 0;
      let overallAbsent = 0;
      let overallOnLeave = 0;
      let overallTotal = 0;
      let overallExcusedLeaves = 0;
      let subjects = [];

      if (resolved.studentAttendanceSummary) {
        const summaries = resolved.studentAttendanceSummary;
        
        // Subject-wise stats map to avoid duplicates (each subject could appear multiple times)
        const subjectMap = new Map();

        // Helper: We can get subject stats from the timetable or resolved attendance summaries
        // Let's check resolved.todaysTimetable which has subject-wise attendance_summary
        if (resolved.todaysTimetable) {
          resolved.todaysTimetable.forEach(item => {
            if (item.subject && item.attendance_summary) {
              const name = item.subject.name;
              const summary = item.attendance_summary;
              subjectMap.set(name, {
                name: name,
                present: summary.present || 0,
                absent: summary.absent || 0,
                onLeave: summary.onLeave || 0,
                total: summary.total || 66
              });
            }
          });
        }

        // If today's timetable didn't cover all subjects, let's collect from studentAttendanceSummary
        // (Wait, today's timetable did cover the 5 main subjects. Let's make sure we have them).
        subjectMap.forEach((stats) => {
          overallPresent += stats.present;
          overallAbsent += stats.absent;
          overallOnLeave += stats.onLeave;
          overallTotal += stats.total;
          subjects.push({
            name: stats.name,
            present: stats.present,
            absent: stats.absent,
            onLeave: stats.onLeave,
            total: stats.total,
            percentage: stats.total > 0 ? parseFloat(((stats.present / stats.total) * 100).toFixed(2)) : 0,
            excusedPercentage: (stats.total - stats.onLeave) > 0 ? parseFloat(((stats.present / (stats.total - stats.onLeave)) * 100).toFixed(2)) : 0
          });
        });
      }

      // Fetch leave history and absences if token is available
      let absencesList = [];
      let onLeavesList = [];
      if (token && userId) {
        try {
          console.log('[Scraper] Fetching leave requests from PocketBase API...');
          const leaveUrl = `https://mkis-erp-backend.76545689.xyz/api/collections/leave_requests/records?filter=student.user.id%3D%27${userId}%27&perPage=100`;
          const res = await fetch(leaveUrl, {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          if (res.ok) {
            const data = await res.json();
            leaveRequests = data.items.map(item => {
              // Calculate duration in days
              const start = new Date(item.start_date);
              const end = new Date(item.end_date);
              const durationMs = end - start;
              const durationDays = Math.ceil(durationMs / (1000 * 60 * 60 * 24)) + 1;
              return {
                id: item.id,
                leave_type: item.leave_type === '1r73s5809v52m2k' ? 'Exam' : 'ACADEMIC',
                start_date: item.start_date.split(' ')[0],
                end_date: item.end_date.split(' ')[0],
                duration: durationDays,
                reason: item.reason.trim(),
                status: item.status
              };
            });
          }
        } catch (err) {
          console.error('[Scraper] Error fetching leave history:', err.message);
        }

        try {
          console.log('[Scraper] Fetching student record to get studentId...');
          const studentUrl = `https://mkis-erp-backend.76545689.xyz/api/collections/students/records?filter=user%3D%27${userId}%27`;
          const sRes = await fetch(studentUrl, {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          if (sRes.ok) {
            const sData = await sRes.json();
            if (sData.items && sData.items.length > 0) {
              const studentId = sData.items[0].id;
              console.log('[Scraper] Fetching all attendance records for student:', studentId);
              
              const recordsUrl = `https://mkis-erp-backend.76545689.xyz/api/collections/attendance_records/records?filter=student%3D%27${studentId}%27&perPage=500&expand=attendance_event,attendance_event.subject,attendance_event.teacher&sort=-created`;
              const recRes = await fetch(recordsUrl, {
                headers: { 'Authorization': `Bearer ${token}` }
              });
              if (recRes.ok) {
                const recData = await recRes.json();
                
                // Clear initial overall stats to compute from DB
                overallPresent = 0;
                overallAbsent = 0;
                overallOnLeave = 0;
                overallTotal = 0;
                overallExcusedLeaves = 0;
                subjects = [];
                const subjectMap = new Map();
                const approvedLeaveIds = new Set(
                  leaveRequests.filter(r => r.status === 'Approved').map(r => r.id)
                );

                recData.items.forEach(item => {
                  const status = item.status;
                  const ev = item.expand ? item.expand.attendance_event : null;
                  const subject = ev && ev.expand ? ev.expand.subject : null;
                  const teacher = ev && ev.expand ? ev.expand.teacher : null;
                  const subjectName = subject ? subject.name : 'Other/General';
                  const teacherName = teacher ? teacher.name.trim() : '';
                  const rec = {
                    id: item.id,
                    status: item.status,
                    date: ev ? ev.date : 'Unknown',
                    event_name: ev ? ev.name : 'Unknown',
                    subject_name: subjectName,
                    teacher_name: teacherName
                  };

                  if (status === 'Absent') {
                    absencesList.push(rec);
                  } else if (status === 'On Leave') {
                    onLeavesList.push(rec);
                  }

                  // Aggregate subject stats
                  if (!subjectMap.has(subjectName)) {
                    subjectMap.set(subjectName, {
                      name: subjectName,
                      present: 0,
                      absent: 0,
                      onLeave: 0,
                      excusedLeaves: 0,
                      total: 0,
                      history: []
                    });
                  }
                  const stats = subjectMap.get(subjectName);
                  stats.total++;
                  overallTotal++;

                  stats.history.push({
                    status: status,
                    date: ev ? ev.date : 'Unknown'
                  });

                  if (status === 'Present') {
                    stats.present++;
                    overallPresent++;
                  } else if (status === 'Absent') {
                    stats.absent++;
                    overallAbsent++;
                  } else if (status === 'On Leave') {
                    stats.onLeave++;
                    overallOnLeave++;
                    const isExcused = item.leave_request && approvedLeaveIds.has(item.leave_request);
                    if (isExcused) {
                      stats.excusedLeaves++;
                      overallExcusedLeaves++;
                    }
                  }
                });

                // Populate subjects list
                subjectMap.forEach((stats) => {
                  subjects.push({
                    name: stats.name,
                    present: stats.present,
                    absent: stats.absent,
                    onLeave: stats.onLeave,
                    total: stats.total,
                    percentage: stats.total > 0 ? parseFloat(((stats.present / stats.total) * 100).toFixed(2)) : 0,
                    excusedPercentage: (stats.total - stats.excusedLeaves) > 0 ? parseFloat(((stats.present / (stats.total - stats.excusedLeaves)) * 100).toFixed(2)) : 0,
                    history: stats.history.slice(0, 7)
                  });
                });
              }
            }
          }
        } catch (err) {
          console.error('[Scraper] Error fetching attendance records:', err.message);
        }
      }

      // Reconstruct student profile
      const studentProfile = {
        name: resolved.currentUser ? resolved.currentUser.name : 'MUHAMMED AFLAH KT',
        email: resolved.currentUser ? resolved.currentUser.email : 'muhammedaflah295@gmail.com',
        avatar: resolved.currentUser ? resolved.currentUser.avatar : '1000965515_3iuscpg3yh.jpg',
        course: resolved.currentUser ? resolved.currentUser.course : 'BA ISLAMIC HISTORY',
        status: resolved.currentUser ? resolved.currentUser.status : 'Present',
        studentId: resolved.currentUser ? resolved.currentUser.id : '8x34qv9003642zt'
      };

      // Construct overall statistics
      const overallActualPercentage = overallTotal > 0 ? parseFloat(((overallPresent / overallTotal) * 100).toFixed(2)) : 0;
      // Subtract only approved excused leaves
      let totalExcusedLeaves = 0;
      const approvedLeaveIds = new Set(
        leaveRequests.filter(r => r.status === 'Approved').map(r => r.id)
      );
      // Wait, we already counted overallExcusedLeaves inside the recData loop, so we can use that!
      const overallExcusedPercentage = (overallTotal - overallExcusedLeaves) > 0 ? parseFloat(((overallPresent / (overallTotal - overallExcusedLeaves)) * 100).toFixed(2)) : 0;

      statsCache = {
        student: studentProfile,
        overall: {
          present: overallPresent,
          absent: overallAbsent,
          onLeave: overallOnLeave,
          total: overallTotal,
          actualPercentage: overallActualPercentage,
          excusedPercentage: overallExcusedPercentage
        },
        subjects: subjects,
        leaves: leaveRequests,
        absences: absencesList,
        onLeaves: onLeavesList,
        todayTimetable: resolved.studentAttendanceSummary || []
      };

      lastSynced = new Date().toISOString();
      console.log('[Scraper] Successfully scraped and parsed stats!');
    } else {
      throw new Error('No dashboard data raw captured.');
    }

  } catch (error) {
    console.error('[Scraper] Error during scraping:', error.message);
    throw error;
  } finally {
    await browser.close();
  }
}

// API endpoint
app.get('/api/stats', async (req, res) => {
  const forceRefresh = req.query.refresh === 'true';

  if (forceRefresh || !statsCache) {
    if (isSyncing) {
      return res.status(202).json({ message: 'Sync in progress, please wait...', lastSynced, stats: statsCache });
    }
    isSyncing = true;
    try {
      await scrapeERPData();
      res.json({ stats: statsCache, lastSynced });
    } catch (err) {
      res.status(500).json({ error: 'Failed to sync live stats', details: err.message, lastSynced, stats: statsCache });
    } finally {
      isSyncing = false;
    }
  } else {
    res.json({ stats: statsCache, lastSynced });
  }
});

// Fallback middleware serves index.html for any other requests
app.use((req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Live Percentage Tracker Server listening on http://localhost:${PORT}`);
});
