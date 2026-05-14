'use client';

import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation'; // Added usePathname
import './sidebar.css';

export default function Sidebar({ isOpen, setIsOpen }) {
  const router = useRouter();
  const pathname = usePathname(); // This gets the current URL path

  const handleLogout = () => {
    router.push('/');
  };

  // Helper function to check if a link is active
  const isActive = (path) => pathname === path;

  return (
    <>
      {/* OVERLAY */}
      <div
        className={`sidebar-overlay ${isOpen ? 'show-overlay' : ''}`}
        onClick={() => setIsOpen(false)}
      ></div>

      {/* SIDEBAR */}
      <aside className={`main-sidebar ${isOpen ? 'open-sidebar' : ''}`}>
        
        {/* LOGO SECTION */}
        <div className="sidebar-top">
          <div className="sidebar-logo" onClick={() => router.push('/')} style={{cursor: 'pointer'}}>
            Hostel<span>Hub</span>
          </div>
          <button className="close-btn" onClick={() => setIsOpen(false)}>
            ✕
          </button>
        </div>

        {/* NAVIGATION LINKS */}
        <div className="sidebar-links">
          <Link 
            href="/dashboard" 
            className={`sidebar-item ${isActive('/dashboard') ? 'active' : ''}`}
          >
            🏠 Dashboard
          </Link>
          
          <Link 
            href="/meals" 
            className={`sidebar-item ${isActive('/meals') ? 'active' : ''}`}
          >
            🍽 Meals
          </Link>
          
          <Link 
            href="/attendance" 
            className={`sidebar-item ${isActive('/attendance') ? 'active' : ''}`}
          >
            📅 Attendance
          </Link>
          
          <Link 
            href="/complaints" 
            className={`sidebar-item ${isActive('/complaints') ? 'active' : ''}`}
          >
            ⚠ Complaints
          </Link>
          
          <Link 
            href="/leave" 
            className={`sidebar-item ${isActive('/leave') ? 'active' : ''}`}
          >
            📝 Leave
          </Link>
          
          <Link 
            href="/notices" 
            className={`sidebar-item ${isActive('/notices') ? 'active' : ''}`}
          >
            📢 Notices
          </Link>
          
          <Link 
            href="/profile" 
            className={`sidebar-item ${isActive('/profile') ? 'active' : ''}`}
          >
            👤 Profile
          </Link>
        </div>

        {/* BOTTOM SECTION */}
        <div className="sidebar-bottom">
          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>

      </aside>
    </>
  );
}