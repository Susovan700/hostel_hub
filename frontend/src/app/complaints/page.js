'use client';
import { useState, useEffect } from 'react';
import Sidebar from '../components/sidebar/page';
import Navbar from '../components/navbar/page';
import { apiRequest } from '../services/api.js';
import './complaints.css';

export default function ComplaintsPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [role, setRole] = useState(null);
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({ category: 'Plumbing', description: '' });

  useEffect(() => {
    // Sync role and fetch data on mount
    const currentRole = localStorage.getItem("userRole");
    setRole(currentRole);
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    try {
      const data = await apiRequest("/complaints", "GET");
      setComplaints(data);
    } catch (err) {
      console.error("Fetch failed:", err.message);
    } finally {
      setLoading(false);
    }
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    // Ensure keys match: category and description
    const payload = {
      category: formData.category,
      description: formData.description
    };
    
    await apiRequest("/complaints/submit", "POST", payload);
    alert("Grievance submitted successfully!");
    setFormData({ category: 'Plumbing', description: '' });
    fetchComplaints();
  } catch (err) {
    // If it's a CORS error, this will likely say "Failed to fetch"
    alert("Submission Error: " + err.message);
  }
};

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to remove this record?")) return;
    try {
      // Admins use the dynamic delete endpoint
      await apiRequest(`/complaints/delete/${id}`, "DELETE");
      setComplaints(complaints.filter(c => c.id !== id));
    } catch (err) {
      alert(err.message);
    }
  };

  const isAdmin = ['Admin', 'Super_Admin', 'General_Secretary'].includes(role);

  return (
    <div className="cp-app-container">
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
      <div className="cp-main-wrapper">
        <Navbar setIsOpen={setIsSidebarOpen} />
        <main className="cp-scroll-body">
          <div className="cp-header">
            <h1>Grievance Redressal</h1>
            <p>{isAdmin ? "Administrative review of student concerns." : "Submit and track your hostel issues."}</p>
          </div>

          <div className="cp-grid">
            {/* Form is hidden for Admin users */}
            {!isAdmin && (
              <form className="cp-form-card" onSubmit={handleSubmit}>
                <h3>New Complaint</h3>
                <div className="cp-input-group">
                  <label>Category</label>
                  <select 
                    value={formData.category} 
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                  >
                    <option>Plumbing</option>
                    <option>Electrical</option>
                    <option>Internet/WiFi</option>
                    <option>Cleaning</option>
                    <option>Other</option>
                  </select>
                </div>
                <div className="cp-input-group">
                  <label>Detailed Description</label>
                  <textarea 
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    placeholder="Provide specific details (e.g., room number, time of issue)..." 
                    required 
                    rows="4"
                  ></textarea>
                </div>
                <button type="submit" className="cp-submit-btn">Submit Grievance</button>
              </form>
            )}

            {/* Admin sees full history with student names */}
            <div className={isAdmin ? "cp-history-full" : "cp-history-card"}>
              <h3>{isAdmin ? "Student Submissions" : "My Recent History"}</h3>
              {loading ? (
                <p>Loading grievances...</p>
              ) : (
                <div className="cp-list">
                  {complaints.length > 0 ? complaints.map(item => (
                    <div key={item.id} className="cp-list-item">
                      <div className="cp-item-info">
                        <div className="cp-item-top">
                          <span className={`cp-status ${item.status.toLowerCase()}`}>{item.status}</span>
                          {isAdmin && (
                            <button onClick={() => handleDelete(item.id)} className="cp-del-btn">
                              🗑️
                            </button>
                          )}
                        </div>
                        <h4>{item.type}</h4>
                        {isAdmin && (
                          <p className="cp-author">Submitted by: <strong>{item.student_name}</strong></p>
                        )}
                        <p className="cp-desc">{item.desc}</p>
                      </div>
                      <span className="cp-date">{item.date}</span>
                    </div>
                  )) : (
                    <p className="cp-empty">No records found.</p>
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