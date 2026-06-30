# Live Attendance & Leave Tracker

A beautiful, premium dashboard that tracks attendance percentages, leave request history, excused absences, and provides detailed logs of absent and on-leave days. It interfaces with the MKIS ERP backend by scraping data securely and dynamically in real-time.

## Features
- **Overall Attendance Circular Progress**: Visualizes both Actual and Excused attendance percentages.
- **Excused Absences Logic**: Evaluates leave history and applies excused absences only if leave requests are officially approved.
- **Detailed Subject-wise Statistics**: Breaks down present, absent, on-leave, and percentage counts for each class.
- **Absent & On Leave Logs**: Complete history tables detailing dates, event names, subjects, and teachers for all missed lectures.
- **Dynamic Timetable Status**: Fetches and renders today's scheduled lectures and their status.

## Technologies Used
- **Backend**: Node.js, Express, Puppeteer (for MKIS ERP login/scraping)
- **Frontend**: HTML5, CSS3, JavaScript (Vanilla, Lucide Icons)

## How to Run Locally
1. Clone this repository.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the server:
   ```bash
   node server.js
   ```
4. Open `http://localhost:3000` in your browser.

## Deployment to Render
To deploy this application to Render:
1. Create a Web Service on Render and connect your GitHub repository.
2. Choose **Node** as the environment.
3. Add a **Dockerfile** to this repository (see below) to ensure Puppeteer runs with all its Linux dependencies, or use Render's standard configuration with Chrome dependencies installed.
