'use client';
import { useState } from 'react';
import Sidebar from '../components/sidebar/page';
import Navbar from '../components/navbar/page';
import './notices.css';

export default function NoticesPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const notices = [
    { id: 1, title: 'Annual Cultural Fest', date: 'May 14, 2024', content: 'Registrations are open for the annual hostel fest happening next month.', important: true },
    { id: 2, title: 'Maintenance Notice', date: 'May 12, 2024', content: 'Water supply will be interrupted on Sunday between 10 AM to 2 PM.', important: false },
    { id: 3, title: 'Revised Mess Timings', date: 'May 10, 2024', content: 'Effective Monday, dinner will be served from 7:30 PM to 9:30 PM.', important: false },
  ];

  return (
    <div className="nt-app-container">
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
      <div className="nt-main-wrapper">
        <Navbar setIsOpen={setIsSidebarOpen} />
        <main className="nt-scroll-body">
          <div className="nt-header">
            <h1>Notice Board</h1>
            <p>Stay updated with the latest official announcements.</p>
          </div>

          <div className="nt-feed">
            {notices.map(notice => (
              <div key={notice.id} className={`nt-card ${notice.important ? 'nt-priority' : ''}`}>
                <div className="nt-card-header">
                  <span className="nt-date">{notice.date}</span>
                  {notice.important && <span className="nt-badge">Important</span>}
                </div>
                <h3>{notice.title}</h3>
                <p>{notice.content}</p>
                <button className="nt-read-btn">Read Full Details</button>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}