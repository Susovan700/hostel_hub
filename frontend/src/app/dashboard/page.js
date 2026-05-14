'use client';

import { useState } from 'react';
import Sidebar from '../components/sidebar/page';
import Navbar from '../components/navbar/page';

import './dashboard.css';

export default function Dashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="db-app-container">
      {/* SIDEBAR - Stays fixed due to flex-shrink: 0 in CSS */}
      <Sidebar
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
      />

      <div className="db-main-wrapper">
        <Navbar setIsOpen={setIsSidebarOpen} />

        <main className="db-scroll-body">
          {/* TOP BANNER */}
          <div className="db-welcome-banner">
            <div className="db-banner-text">
              <h1>Welcome Back 👋</h1>
              <p>
                Monitor hostel activities, meals, attendance and notices.
              </p>
            </div>
            <button className="db-primary-btn">
              + Raise Complaint
            </button>
          </div>

          {/* STATS */}
          <div className="db-stats-grid">
            <div className="db-stat-card db-card-blue">
              <h3>Today's Lunch</h3>
              <p>Veg Pulao & Raita</p>
              <span>Meal Confirmed</span>
            </div>

            <div className="db-stat-card db-card-green">
              <h3>Attendance</h3>
              <p>92%</p>
              <span>Excellent Performance</span>
            </div>

            <div className="db-stat-card db-card-purple">
              <h3>Complaints</h3>
              <p>1 Resolved</p>
              <span>No Pending Issues</span>
            </div>
          </div>

          {/* LOWER GRID */}
          <div className="db-lower-grid">
            {/* NOTICE PANEL */}
            <div className="db-panel-card">
              <div className="db-panel-header">
                <h2>Latest Notices</h2>
                <button className="db-view-all">View All</button>
              </div>
              <div className="db-item-box">
                Water supply maintenance today at 4 PM.
              </div>
              <div className="db-item-box">
                Hostel gate closes at 10 PM tonight.
              </div>
              <div className="db-item-box">
                New meal menu uploaded for this week.
              </div>
            </div>

            {/* ACTIVITY PANEL */}
            <div className="db-panel-card">
              <div className="db-panel-header">
                <h2>Recent Activities</h2>
              </div>
              <div className="db-item-box db-activity">
                Complaint resolved successfully.
              </div>
              <div className="db-item-box db-activity">
                Dinner confirmed for today.
              </div>
              <div className="db-item-box db-activity">
                Attendance updated.
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}