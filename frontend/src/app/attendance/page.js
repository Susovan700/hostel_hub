'use client';
import { useState, useEffect } from 'react';
import Sidebar from '../components/sidebar/page';
import Navbar from '../components/navbar/page';
import { apiRequest } from '../services/api.js';
import './attendance.css';

export default function AttendancePage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [status, setStatus] = useState('idle'); // idle, loading, success, error
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update clock every second
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

const handleMarkAttendance = async () => {
    setStatus('loading');
    try {
      // This sends the POST request to the fixed route above
      const res = await apiRequest("/attendance/mark", "POST");
      
      setStatus('success');
      alert(res.message);
    } catch (err) {
      setStatus('error');
      // Show specific error (e.g., "Attendance already marked for today")
      alert(err.message); 
      
      // Reset button after 3 seconds so they can try again if it was a network error
      setTimeout(() => setStatus('idle'), 3000);
    }
  };

  return (
    <div className="at-app-container">
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
      <div className="at-main-wrapper">
        <Navbar setIsOpen={setIsSidebarOpen} />
        <main className="at-scroll-body">
          <div className="at-header">
            <h1>Daily Attendance</h1>
            <p>Mark your presence for {currentTime.toLocaleDateString()}</p>
          </div>

          <div className="at-card-center">
            <div className="at-clock">
              {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
            </div>
            
            <button 
              className={`at-punch-btn ${status}`}
              onClick={handleMarkAttendance}
              disabled={status === 'loading' || status === 'success'}
            >
              {status === 'loading' ? 'Processing...' : status === 'success' ? '✓ Marked' : 'Punch In Now'}
            </button>

            {status === 'success' && (
              <p className="at-success-msg">Your attendance has been recorded in the database.</p>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}