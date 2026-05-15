'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '../components/sidebar/page';
import Navbar from '../components/navbar/page';
import { apiRequest } from '../services/api.js';
import './dashboard.css';

export default function Dashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState('');
  const [userRole, setUserRole] = useState('');
  const router = useRouter();

  useEffect(() => {
    const name = localStorage.getItem('userName') || 'Admin';
    const role = localStorage.getItem('userRole') || 'Admin';
    setUserName(name);
    setUserRole(role);
    fetchNotices();
  }, []);

  const fetchNotices = async () => {
    try {
      const data = await apiRequest('/notices', 'GET');
      // Show only the latest 3 on dashboard
      setNotices(data.slice(0, 3));
    } catch (err) {
      console.error('Failed to load notices:', err.message);
    } finally {
      setLoading(false);
    }
  };

  const today = new Date().toLocaleDateString('en-IN', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="db-app-container">
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

      <div className="db-main-wrapper">
        <Navbar setIsOpen={setIsSidebarOpen} />

        <main className="db-scroll-body">

          {/* WELCOME BANNER */}
          <div className="db-welcome-banner">
            <div className="db-banner-text">
              <h1>Welcome Back 👋</h1>
              <p>Monitor hostel activities, meals, attendance and notices.</p>
            </div>
            <div className="db-banner-meta">
              <span className="db-date-chip">{today}</span>
            </div>
          </div>

          {/* STAT CARDS */}
          <div className="db-stats-grid">
            <div className="db-stat-card db-card-blue">
              <p className="db-stat-label">Today's Lunch</p>
              <h3 className="db-stat-value">Rajma Chawal</h3>
              <span className="db-stat-sub">Meal Confirmed</span>
            </div>

            <div className="db-stat-card db-card-green">
              <p className="db-stat-label">Attendance</p>
              <h3 className="db-stat-value">92%</h3>
              <span className="db-stat-sub">Excellent Performance</span>
            </div>

            <div className="db-stat-card db-card-purple">
              <p className="db-stat-label">Gate Curfew</p>
              <h3 className="db-stat-value">10:00 PM</h3>
              <span className="db-stat-sub">Tonight's Closing Time</span>
            </div>
          </div>

          {/* LOWER GRID */}
          <div className="db-lower-grid">

            {/* NOTICES PANEL */}
            <div className="db-panel-card">
              <div className="db-panel-header">
                <h2>Latest Notices</h2>
                <button
                  className="db-view-all"
                  onClick={() => router.push('/notices')}
                >
                  View All
                </button>
              </div>

              {loading ? (
                <div className="db-notices-loader">Loading notices...</div>
              ) : notices.length === 0 ? (
                <div className="db-item-box">No notices at the moment.</div>
              ) : (
                notices.map((notice) => (
                  <div
                    key={notice.id}
                    className="db-item-box db-notice-item"
                    onClick={() => router.push(`/notices/${notice.id}`)}
                  >
                    <div className="db-notice-dot" />
                    <div className="db-notice-content">
                      <p className="db-notice-title">{notice.title}</p>
                      <span className="db-notice-date">{notice.date}</span>
                    </div>
                    <span className="db-notice-arrow">→</span>
                  </div>
                ))
              )}
            </div>

            {/* ACTIVITY PANEL */}
            <div className="db-panel-card">
              <div className="db-panel-header">
                <h2>Recent Activities</h2>
              </div>
              <div className="db-item-box db-activity">
                Attendance marked for today.
              </div>
              <div className="db-item-box db-activity">
                Dinner confirmed for today.
              </div>
              <div className="db-item-box db-activity">
                Mess fee cleared successfully.
              </div>
            </div>

          </div>
        </main>
      </div>
    </div>
  );
}