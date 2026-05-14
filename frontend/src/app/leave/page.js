'use client';
import { useState } from 'react';
import Sidebar from '../components/sidebar/page';
import Navbar from '../components/navbar/page';
import './leave.css';

export default function LeavePage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [leaves, setLeaves] = useState([
    { id: 1, type: 'Home Visit', start: '2024-05-20', end: '2024-05-22', status: 'Approved' },
    { id: 2, type: 'Night Out', start: '2024-05-25', end: '2024-05-26', status: 'Pending' },
  ]);

  return (
    <div className="lv-app-container">
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
      <div className="lv-main-wrapper">
        <Navbar setIsOpen={setIsSidebarOpen} />
        <main className="lv-scroll-body">
          <div className="lv-header">
            <h1>Leave Application</h1>
            <p>Request permission for home visits or night stays outside the hostel.</p>
          </div>

          <div className="lv-grid">
            {/* LEAVE FORM */}
            <form className="lv-form-card" onSubmit={(e) => e.preventDefault()}>
              <h3>Apply for Leave</h3>
              <div className="lv-input-row">
                <div className="lv-input-group">
                  <label>Leave Type</label>
                  <select>
                    <option>Home Visit</option>
                    <option>Night Out</option>
                    <option>Emergency Leave</option>
                  </select>
                </div>
              </div>
              <div className="lv-input-row">
                <div className="lv-input-group">
                  <label>From Date</label>
                  <input type="date" required />
                </div>
                <div className="lv-input-group">
                  <label>To Date</label>
                  <input type="date" required />
                </div>
              </div>
              <div className="lv-input-group">
                <label>Reason for Leave</label>
                <textarea placeholder="Provide a brief explanation..." rows="3"></textarea>
              </div>
              <button type="submit" className="lv-submit-btn">Request Approval</button>
            </form>

            {/* STATUS LIST */}
            <div className="lv-status-card">
              <h3>My Leave History</h3>
              <div className="lv-history-list">
                {leaves.map(leave => (
                  <div key={leave.id} className="lv-history-item">
                    <div className="lv-item-left">
                      <div className={`lv-status-pill ${leave.status.toLowerCase()}`}>
                        {leave.status}
                      </div>
                      <h4>{leave.type}</h4>
                      <p>{leave.start} to {leave.end}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}