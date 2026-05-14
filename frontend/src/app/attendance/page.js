'use client';
import { useState } from 'react';
import Sidebar from '../components/sidebar/page';
import Navbar from '../components/navbar/page';
import './attendance.css';

export default function AttendancePage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Mock data for the attendance log
  const attendanceData = [
    { date: "May 14, 2026", time: "08:15 PM", status: "Present" },
    { date: "May 13, 2026", time: "08:30 PM", status: "Present" },
    { date: "May 12, 2026", time: "--", status: "Absent" },
    { date: "May 11, 2026", time: "08:05 PM", status: "Present" },
    { date: "May 10, 2026", time: "08:10 PM", status: "Present" },
  ];

  return (
    <div className="at-app-container">
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
      
      <div className="at-main-wrapper">
        <Navbar setIsOpen={setIsSidebarOpen} />
        
        <main className="at-scroll-body">
          <div className="at-header">
            <h1>Attendance Tracker</h1>
            <p>Maintain your 85% requirement to avoid penalties.</p>
          </div>

          {/* STAT CARDS */}
          <div className="at-stats-row">
            <div className="at-stat-card at-hero-card">
              <div className="at-progress-circle">
                <span className="at-percentage">92%</span>
              </div>
              <div className="at-hero-text">
                <h3>Overall Status</h3>
                <p>Status: <span className="at-status-good">Excellent</span></p>
              </div>
            </div>

            <div className="at-stat-card">
              <label>Days Present</label>
              <div className="at-value">24</div>
              <span className="at-sub">This Month</span>
            </div>

            <div className="at-stat-card">
              <label>Days Absent</label>
              <div className="at-value at-absent-val">02</div>
              <span className="at-sub">This Month</span>
            </div>
          </div>

          {/* LOG TABLE */}
          <div className="at-log-container">
            <div className="at-log-header">
              <h2>Recent Activity</h2>
              <button className="at-filter-btn">Filter by Month ▾</button>
            </div>
            
            <div className="at-table-responsive">
              <table className="at-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Check-in Time</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {attendanceData.map((entry, index) => (
                    <tr key={index}>
                      <td>{entry.date}</td>
                      <td>{entry.time}</td>
                      <td>
                        <span className={`at-badge ${entry.status.toLowerCase()}`}>
                          {entry.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}