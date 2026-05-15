'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import './sidebar.css';

export default function Sidebar({ isOpen, setIsOpen }) {
  const router = useRouter();
  const pathname = usePathname();
  const [role, setRole] = useState(null);

  useEffect(() => {
    const storedRole = localStorage.getItem("userRole");
    setRole(storedRole);
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    router.push('/');
  };

  const isActive = (path) => pathname === path;
  const isAdmin = role === 'Admin' || role === 'Super_Admin';

  return (
    <>
      <div
        className={`sidebar-overlay ${isOpen ? 'show-overlay' : ''}`}
        onClick={() => setIsOpen(false)}
      />

      <aside className={`main-sidebar ${isOpen ? 'open-sidebar' : ''}`}>

        <div className="sidebar-top">
          <div className="sidebar-logo" onClick={() => router.push('/')}>
            Hostel<span>Hub</span>
          </div>
          <button className="close-btn" onClick={() => setIsOpen(false)} aria-label="Close sidebar">✕</button>
        </div>

        <nav className="sidebar-links">
          <Link href="/dashboard" className={`sidebar-item ${isActive('/dashboard') ? 'active' : ''}`}>
            <span className="si-icon">🏠</span> Dashboard
          </Link>

          <Link href="/meals" className={`sidebar-item ${isActive('/meals') ? 'active' : ''}`}>
            <span className="si-icon">🍽</span> Meals
          </Link>

          {!isAdmin && (
            <Link href="/attendance" className={`sidebar-item ${isActive('/attendance') ? 'active' : ''}`}>
              <span className="si-icon">📅</span> Attendance
            </Link>
          )}

          <Link href="/complaints" className={`sidebar-item ${isActive('/complaints') ? 'active' : ''}`}>
            <span className="si-icon">⚠</span> {isAdmin ? "View Complaints" : "Complaints"}
          </Link>

          <Link href="/leave" className={`sidebar-item ${isActive('/leave') ? 'active' : ''}`}>
            <span className="si-icon">📝</span> {isAdmin ? "Leave Tracker" : "Leave"}
          </Link>

          <Link href="/notices" className={`sidebar-item ${isActive('/notices') ? 'active' : ''}`}>
            <span className="si-icon">📢</span> Notices
          </Link>

          <Link href="/profile" className={`sidebar-item ${isActive('/profile') ? 'active' : ''}`}>
            <span className="si-icon">👤</span> Profile
          </Link>
        </nav>

        <div className="sidebar-bottom">
          <button className="logout-btn" onClick={handleLogout}>Logout</button>
        </div>

      </aside>
    </>
  );
}