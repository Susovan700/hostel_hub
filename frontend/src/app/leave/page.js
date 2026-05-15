'use client';
import { useState, useEffect } from 'react';
import Sidebar from '../components/sidebar/page';
import Navbar from '../components/navbar/page';
import { apiRequest } from '../services/api.js';
import './leave.css';

export default function LeavePage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [role, setRole] = useState(null);
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({ 
    type: 'Home Visit', 
    start: '', 
    end: '', 
    reason: '' 
  });

  useEffect(() => {
    // Determine user role and load records
    const currentRole = localStorage.getItem("userRole");
    setRole(currentRole);
    fetchLeaves();
  }, []);

  const fetchLeaves = async () => {
    try {
      // Calls @app.route('/api/leaves', methods=['GET'])
      const data = await apiRequest("/leaves", "GET");
      setLeaves(data);
    } catch (err) {
      console.error("Failed to fetch leaves:", err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRequest = async (e) => {
    e.preventDefault();
    try {
      // Calls @app.route('/api/leaves/request', methods=['POST'])
      await apiRequest("/leaves/request", "POST", formData);
      alert("Leave request submitted for review.");
      setFormData({ type: 'Home Visit', start: '', end: '', reason: '' });
      fetchLeaves(); // Refresh list
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this leave record?")) return;
    try {
      // Calls @app.route('/api/leaves/delete/<int:id>', methods=['DELETE'])
      await apiRequest(`/leaves/delete/${id}`, "DELETE");
      setLeaves(leaves.filter(l => l.id !== id));
    } catch (err) {
      alert(err.message);
    }
  };

  const isAdmin = ['Admin', 'Super_Admin', 'General_Secretary'].includes(role);

  return (
    <div className="lv-app-container">
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
      <div className="lv-main-wrapper">
        <Navbar setIsOpen={setIsSidebarOpen} />
        <main className="lv-scroll-body">
          <div className="lv-header">
            <h1>Leave Application</h1>
            <p>{isAdmin ? "Manage and review hostel exit requests." : "Request permission for home visits or night stays."}</p>
          </div>

          <div className="lv-grid">
            {/* Form is only rendered for Students */}
            {!isAdmin && (
              <form className="lv-form-card" onSubmit={handleRequest}>
                <h3>Apply for Leave</h3>
                <div className="lv-input-row">
                  <div className="lv-input-group">
                    <label>Leave Type</label>
                    <select 
                      value={formData.type} 
                      onChange={(e) => setFormData({...formData, type: e.target.value})}
                    >
                      <option>Home Visit</option>
                      <option>Night Out</option>
                      <option>Emergency Leave</option>
                    </select>
                  </div>
                </div>
                <div className="lv-input-row">
                  <div className="lv-input-group">
                    <label>From Date</label>
                    <input 
                      type="date" 
                      value={formData.start} 
                      onChange={(e) => setFormData({...formData, start: e.target.value})} 
                      required 
                    />
                  </div>
                  <div className="lv-input-group">
                    <label>To Date</label>
                    <input 
                      type="date" 
                      value={formData.end} 
                      onChange={(e) => setFormData({...formData, end: e.target.value})} 
                      required 
                    />
                  </div>
                </div>
                <div className="lv-input-group">
                  <label>Reason for Leave</label>
                  <textarea 
                    value={formData.reason} 
                    onChange={(e) => setFormData({...formData, reason: e.target.value})}
                    placeholder="Provide a brief explanation..." 
                    rows="3"
                    required
                  ></textarea>
                </div>
                <button type="submit" className="lv-submit-btn">Request Approval</button>
              </form>
            )}

            {/* List expands to full width for Admin */}
            <div className={isAdmin ? "lv-history-full" : "lv-status-card"}>
              <h3>{isAdmin ? "All Leave Records" : "My Leave History"}</h3>
              {loading ? (
                <p>Loading records...</p>
              ) : (
                <div className="lv-history-list">
                  {leaves.length > 0 ? leaves.map(leave => (
                    <div key={leave.id} className="lv-history-item">
                      <div className="lv-item-left">
                        <div className="lv-item-header">
                          <div className={`lv-status-pill ${leave.status.toLowerCase()}`}>
                            {leave.status}
                          </div>
                          {isAdmin && (
                            <button onClick={() => handleDelete(leave.id)} className="lv-del-btn">
                              🗑️
                            </button>
                          )}
                        </div>
                        <h4>{leave.type}</h4>
                        {isAdmin && (
                          <p className="lv-student">Requested by: <strong>{leave.student_name}</strong></p>
                        )}
                        <p className="lv-dates">📅 {leave.start} to {leave.end}</p>
                        <p className="lv-reason">"{leave.reason}"</p>
                      </div>
                    </div>
                  )) : (
                    <div className="lv-empty">No leave records found.</div>
                  )}
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}