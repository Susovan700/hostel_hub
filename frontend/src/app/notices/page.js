'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '../components/sidebar/page';
import Navbar from '../components/navbar/page';
import { apiRequest } from '../services/api.js';
import './notices.css';

export default function NoticesPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [newNotice, setNewNotice] = useState({ title: '', content: '' });
  const router = useRouter();

  useEffect(() => {
    const role = localStorage.getItem("userRole");
    setUserRole(role);
    fetchNotices();
  }, []);

  const fetchNotices = async () => {
    try {
      const data = await apiRequest("/notices", "GET");
      setNotices(data);
    } catch (err) {
      console.error("Failed to load notices:", err.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePostNotice = async (e) => {
    e.preventDefault();
    try {
      await apiRequest("/admin/post-notice", "POST", newNotice);
      setShowModal(false);
      setNewNotice({ title: '', content: '' });
      fetchNotices();
      alert("Notice posted successfully!");
    } catch (err) {
      alert(err.message);
    }
  };

const handleDeleteNotice = async (id) => {
    // 1. Confirm with the user
    if (!window.confirm("Are you sure you want to permanently delete this notice?")) return;
    
    try {
      // 2. Call the API (The backend will check the JWT role)
      await apiRequest(`/admin/delete-notice/${id}`, "DELETE");
      
      // 3. Update the UI state
      setNotices(prevNotices => prevNotices.filter(n => n.id !== id));
      alert("Notice removed successfully.");
    } catch (err) {
      // 4. Handle errors (e.g., if a Student tries to call this)
      alert(err.message || "You do not have permission to delete notices.");
    }
  };

  const isAdmin = ['Super_Admin', 'Accommodation_Admin', 'General_Secretary', 'Admin'].includes(userRole);

  return (
    <div className="nt-app-container">
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
      <div className="nt-main-wrapper">
        <Navbar setIsOpen={setIsSidebarOpen} />
        <main className="nt-scroll-body">
          <div className="nt-header">
            <div>
              <h1>Notice Board</h1>
              <p>Stay updated with official announcements.</p>
            </div>
            {isAdmin && (
              <button className="nt-create-btn" onClick={() => setShowModal(true)}>
                + Post New Notice
              </button>
            )}
          </div>

          {/* CREATE NOTICE MODAL */}
          {showModal && (
            <div className="nt-modal-overlay">
              <div className="nt-modal">
                <h2>Post New Notice</h2>
                <form onSubmit={handlePostNotice}>
                  <input 
                    type="text" 
                    placeholder="Notice Title" 
                    required 
                    value={newNotice.title}
                    onChange={(e) => setNewNotice({...newNotice, title: e.target.value})}
                  />
                  <textarea 
                    placeholder="Notice Content" 
                    required 
                    rows="5"
                    value={newNotice.content}
                    onChange={(e) => setNewNotice({...newNotice, content: e.target.value})}
                  ></textarea>
                  <div className="nt-modal-actions">
                    <button type="button" onClick={() => setShowModal(false)}>Cancel</button>
                    <button type="submit" className="nt-submit-btn">Post Notice</button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {loading ? (
            <div className="nt-loader">Loading...</div>
          ) : (
            <div className="nt-feed">
              {notices.map(notice => (
                <div key={notice.id} className="nt-card">
                  <div className="nt-card-header">
                    <span className="nt-date">{notice.date}</span>
                    {isAdmin && (
                      <button 
                        className="nt-delete-icon-btn" 
                        onClick={() => handleDeleteNotice(notice.id)}
                        title="Delete Notice"
                      >
                        🗑️
                      </button>
                    )}
                  </div>
                  <h3>{notice.title}</h3>
                  <p>{notice.content.substring(0, 100)}...</p>
                  <button className="nt-read-btn" onClick={() => router.push(`/notices/${notice.id}`)}>
                    Read Full Details
                  </button>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}