'use client';
import { useState } from 'react';
import Sidebar from '../components/sidebar/page';
import Navbar from '../components/navbar/page';
import './complaints.css';

export default function ComplaintsPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [complaints, setComplaints] = useState([
    { id: 1, type: 'Plumbing', desc: 'Leaking tap in Room 302', status: 'Pending', date: '2024-05-10' },
    { id: 2, type: 'WiFi', desc: 'No internet on 3rd floor', status: 'Resolved', date: '2024-05-08' },
  ]);

  return (
    <div className="cp-app-container">
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
      <div className="cp-main-wrapper">
        <Navbar setIsOpen={setIsSidebarOpen} />
        <main className="cp-scroll-body">
          <div className="cp-header">
            <h1>Grievance Redressal</h1>
            <p>Report issues and track their resolution status.</p>
          </div>

          <div className="cp-grid">
            {/* COMPLAINT FORM */}
            <form className="cp-form-card" onSubmit={(e) => e.preventDefault()}>
              <h3>New Complaint</h3>
              <div className="cp-input-group">
                <label>Issue Category</label>
                <select>
                  <option>Plumbing</option>
                  <option>Electrical</option>
                  <option>Internet/WiFi</option>
                  <option>Cleaning</option>
                  <option>Other</option>
                </select>
              </div>
              <div className="cp-input-group">
                <label>Description</label>
                <textarea placeholder="Describe the issue in detail..." rows="4"></textarea>
              </div>
              <button type="submit" className="cp-submit-btn">Submit Complaint</button>
            </form>

            {/* RECENT HISTORY */}
            <div className="cp-history-card">
              <h3>Recent History</h3>
              <div className="cp-list">
                {complaints.map(item => (
                  <div key={item.id} className="cp-list-item">
                    <div className="cp-item-info">
                      <span className={`cp-status ${item.status.toLowerCase()}`}>{item.status}</span>
                      <h4>{item.type}</h4>
                      <p>{item.desc}</p>
                    </div>
                    <span className="cp-date">{item.date}</span>
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