// Global DOM Selectors
let syncBtn, syncIcon, syncOverlay, syncTimestamp;
let avatarImg, statusBadge, studentName, studentCourse, studentEmail;
let overallActualPct, overallExcusedPct, actualCircle, excusedCircle;
let metricPresent, metricAbsent, metricLeave, metricTotal;
let subjectGrid, recentHistoryTable, absentHistoryTable, onleaveHistoryTable, leaveHistoryTable, todayTimetableTimeline;

// Circumference of Progress Rings (2 * PI * r = 2 * Math.PI * 70 = 439.82)
const CIRCUMFERENCE = 439.82;

// Resolve API base URL if opened as local file
const API_BASE = window.location.protocol === 'file:' ? 'http://localhost:3000' : '';

// Set circle Dash Offset
function setProgress(circleElement, percent) {
  const offset = CIRCUMFERENCE - (percent / 100) * CIRCUMFERENCE;
  circleElement.style.strokeDashoffset = offset;
}

// Fetch stats and update UI
async function updateDashboard(refresh = false) {
  try {
    if (refresh) {
      syncOverlay.classList.add('active');
      syncIcon.classList.add('spin-animation');
    }

    const url = refresh ? `${API_BASE}/api/stats?refresh=true` : `${API_BASE}/api/stats`;
    const response = await fetch(url);
    const data = await response.json();

    if (data.stats) {
      renderStats(data.stats, data.lastSynced);
    } else {
      alert(data.message || 'Data is syncing in backend. Refresh in a few seconds.');
    }
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    alert('Failed to connect to backend server. Make sure node server is running.');
  } finally {
    if (refresh) {
      syncOverlay.classList.remove('active');
      syncIcon.classList.remove('spin-animation');
    }
  }
}

// Helper to format date relatively (Today, Yesterday, or standard Date)
function formatRelativeDate(dateStr) {
  if (!dateStr || dateStr === 'Unknown') return '—';
  const dateObj = new Date(dateStr);
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  // Strip time for clean comparison
  const dStr = dateObj.toDateString();
  const tStr = today.toDateString();
  const yStr = yesterday.toDateString();

  if (dStr === tStr) {
    return 'Today';
  } else if (dStr === yStr) {
    return 'Yesterday';
  } else {
    return dateObj.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
  }
}

// Render data onto components
function renderStats(stats, lastSynced) {
  // Update sync timestamp
  if (lastSynced) {
    const date = new Date(lastSynced);
    syncTimestamp.textContent = date.toLocaleTimeString() + ' (' + date.toLocaleDateString() + ')';
  }

  // 1. Profile Area
  studentName.textContent = stats.student.name;
  studentCourse.textContent = stats.student.course;
  studentEmail.textContent = stats.student.email;
  if (stats.student.avatar) {
    avatarImg.src = `https://mkis-erp-backend.76545689.xyz/api/files/_pb_users_auth_/${stats.student.studentId}/${stats.student.avatar}`;
  }
  
  // Status Badge
  statusBadge.textContent = stats.student.status;
  statusBadge.className = 'status-badge'; // reset
  if (stats.student.status === 'Present') {
    statusBadge.classList.add('pulse');
  } else if (stats.student.status === 'Absent') {
    statusBadge.classList.add('absent');
  } else {
    statusBadge.classList.add('onleave');
  }

  // 2. Overall Progress Rings
  const actualPct = stats.overall.actualPercentage;
  const excusedPct = stats.overall.excusedPercentage;
  
  overallActualPct.textContent = `${actualPct}%`;
  overallExcusedPct.textContent = `${excusedPct}%`;
  
  setProgress(actualCircle, actualPct);
  setProgress(excusedCircle, excusedPct);

  // 3. Quick Metrics
  metricPresent.textContent = stats.overall.present;
  metricAbsent.textContent = stats.overall.absent;
  metricLeave.textContent = stats.overall.onLeave;
  metricTotal.textContent = stats.overall.total;

  // 4. Subject Wise Grid
  subjectGrid.innerHTML = '';
  if (stats.subjects && stats.subjects.length > 0) {
    stats.subjects.forEach(subj => {
      const card = document.createElement('div');
      card.className = 'card subject-card';
      card.innerHTML = `
        <div class="subject-card-header">
          <h3 class="subject-name" title="${subj.name}">${subj.name}</h3>
          <div class="subject-stats-summary">
            <span class="text-xs text-muted">Actual: ${subj.percentage}%</span>
            <span class="badge-pill badge-pct">${subj.excusedPercentage}% Excused</span>
          </div>
        </div>
        <div class="subject-stats-bar-wrapper">
          <div class="subject-stats-bar" style="width: ${subj.percentage}%"></div>
        </div>
        <div class="subject-card-footer">
          <span>Present: <strong>${subj.present}</strong></span>
          <span>Absent: <strong>${subj.absent}</strong></span>
          <span>Leave: <strong>${subj.onLeave}</strong></span>
        </div>
      `;
      subjectGrid.appendChild(card);
    });
  } else {
    subjectGrid.innerHTML = '<div class="table-placeholder card">No subject-wise details available. Click sync.</div>';
  }

  // 5. Leave Requests Table
  leaveHistoryTable.innerHTML = '';
  if (stats.leaves && stats.leaves.length > 0) {
    stats.leaves.forEach(leave => {
      const row = document.createElement('tr');
      const statusClass = leave.status.toLowerCase();
      row.innerHTML = `
        <td><strong>${leave.leave_type}</strong></td>
        <td>${leave.duration} Day${leave.duration > 1 ? 's' : ''}</td>
        <td>${leave.start_date} to ${leave.end_date}</td>
        <td>${leave.reason}</td>
        <td><span class="status-label ${statusClass}">${leave.status}</span></td>
      `;
      leaveHistoryTable.appendChild(row);
    });
  } else {
    leaveHistoryTable.innerHTML = `
      <tr>
        <td colspan="5" class="table-placeholder">No formal leave requests found in history.</td>
      </tr>
    `;
  }

  // 5a. Recent Attendance Log Table (Last 7 Lectures)
  recentHistoryTable.innerHTML = '';
  if (stats.recentAttendance && stats.recentAttendance.length > 0) {
    stats.recentAttendance.forEach(rec => {
      const row = document.createElement('tr');
      const formattedDate = formatRelativeDate(rec.date);
      
      let badgeClass = 'approved';
      if (rec.status === 'Absent') {
        badgeClass = 'rejected';
      } else if (rec.status === 'On Leave') {
        badgeClass = 'returned';
      }

      row.innerHTML = `
        <td><strong>${formattedDate}</strong></td>
        <td>${rec.event_name}</td>
        <td>${rec.teacher_name || '—'}</td>
        <td>${rec.subject_name}</td>
        <td><span class="status-label ${badgeClass}">${rec.status}</span></td>
      `;
      recentHistoryTable.appendChild(row);
    });
  } else {
    recentHistoryTable.innerHTML = `
      <tr>
        <td colspan="5" class="table-placeholder">No recent attendance records found.</td>
      </tr>
    `;
  }

  // 5b. Absent Days History Table
  absentHistoryTable.innerHTML = '';
  if (stats.absences && stats.absences.length > 0) {
    stats.absences.forEach(abs => {
      const row = document.createElement('tr');
      // Format date nicely (YYYY-MM-DD to DD MMM YYYY or similar)
      const dateObj = new Date(abs.date);
      const formattedDate = dateObj.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
      
      row.innerHTML = `
        <td><strong>${formattedDate}</strong></td>
        <td>${abs.event_name}</td>
        <td>${abs.teacher_name || '—'}</td>
        <td>${abs.subject_name}</td>
        <td><span class="status-label rejected">Absent</span></td>
      `;
      absentHistoryTable.appendChild(row);
    });
  } else {
    absentHistoryTable.innerHTML = `
      <tr>
        <td colspan="4" class="table-placeholder">No absent records found.</td>
      </tr>
    `;
  }

  // 5c. On Leave Days History Table
  onleaveHistoryTable.innerHTML = '';
  if (stats.onLeaves && stats.onLeaves.length > 0) {
    stats.onLeaves.forEach(leave => {
      const row = document.createElement('tr');
      const dateObj = new Date(leave.date);
      const formattedDate = dateObj.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
      
      row.innerHTML = `
        <td><strong>${formattedDate}</strong></td>
        <td>${leave.event_name}</td>
        <td>${leave.teacher_name || '—'}</td>
        <td>${leave.subject_name}</td>
        <td><span class="status-label returned">On Leave</span></td>
      `;
      onleaveHistoryTable.appendChild(row);
    });
  } else {
    onleaveHistoryTable.innerHTML = `
      <tr>
        <td colspan="4" class="table-placeholder">No leave records found.</td>
      </tr>
    `;
  }

  // 6. Today's Timetable Status Timeline
  todayTimetableTimeline.innerHTML = '';
  if (stats.todayTimetable && stats.todayTimetable.length > 0) {
    stats.todayTimetable.forEach(item => {
      const el = document.createElement('div');
      el.className = 'card timeline-item';
      
      const statusClass = item.status === 'Present' ? 'present' : 'pending';
      const cleanEventName = item.event.name.replace('Lecture: ', '');
      
      el.innerHTML = `
        <div class="timeline-item-info">
          <span class="timeline-item-name">${cleanEventName}</span>
          <span class="timeline-item-time">${item.event.teacher ? item.event.teacher.name : 'Unknown Teacher'}</span>
        </div>
        <span class="timeline-status ${statusClass}">${item.status}</span>
      `;
      todayTimetableTimeline.appendChild(el);
    });
  } else {
    todayTimetableTimeline.innerHTML = '<div class="table-placeholder card">No relevant class attendance events recorded for today.</div>';
  }

  // Re-initialize icons
  lucide.createIcons();
}

// Initial load
document.addEventListener('DOMContentLoaded', () => {
  // Initialize selectors
  syncBtn = document.getElementById('sync-btn');
  syncIcon = document.getElementById('sync-icon');
  syncOverlay = document.getElementById('sync-overlay');
  syncTimestamp = document.getElementById('sync-timestamp');

  avatarImg = document.getElementById('avatar');
  statusBadge = document.getElementById('status-badge');
  studentName = document.getElementById('student-name');
  studentCourse = document.getElementById('student-course');
  studentEmail = document.getElementById('student-email');

  overallActualPct = document.getElementById('overall-actual-pct');
  overallExcusedPct = document.getElementById('overall-excused-pct');
  actualCircle = document.getElementById('actual-progress');
  excusedCircle = document.getElementById('excused-progress');

  metricPresent = document.getElementById('metric-present');
  metricAbsent = document.getElementById('metric-absent');
  metricLeave = document.getElementById('metric-leave');
  metricTotal = document.getElementById('metric-total');

  subjectGrid = document.getElementById('subject-wise-grid');
  recentHistoryTable = document.getElementById('recent-history-table');
  absentHistoryTable = document.getElementById('absent-history-table');
  onleaveHistoryTable = document.getElementById('onleave-history-table');
  leaveHistoryTable = document.getElementById('leave-history-table');
  todayTimetableTimeline = document.getElementById('today-timetable-timeline');

  // Event Listeners
  syncBtn.addEventListener('click', () => updateDashboard(true));

  // Setup initial rings dashoffset
  if (actualCircle) {
    actualCircle.style.strokeDasharray = CIRCUMFERENCE;
    actualCircle.style.strokeDashoffset = CIRCUMFERENCE;
  }
  if (excusedCircle) {
    excusedCircle.style.strokeDasharray = CIRCUMFERENCE;
    excusedCircle.style.strokeDashoffset = CIRCUMFERENCE;
  }
  
  updateDashboard(false);
});
