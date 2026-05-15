'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import "./navbar.css";

export default function Navbar({ setIsOpen }) {
  const router = useRouter();
  const [userName, setUserName] = useState("User");
  const [initials, setInitials] = useState("U");

  useEffect(() => {
    const storedName = localStorage.getItem("userName") || "Guest User";
    setUserName(storedName);
    const nameParts = storedName.trim().split(/\s+/);
    const userInitials = nameParts.length > 1
      ? (nameParts[0][0] + nameParts[nameParts.length - 1][0]).toUpperCase()
      : nameParts[0][0].toUpperCase();
    setInitials(userInitials);
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    router.push('/login');
  };

  return (
    <nav className="inb-main-nav">
      <div className="inb-nav-left">
        <button className="inb-menu-btn" onClick={() => setIsOpen(true)} aria-label="Open menu">
          <span></span><span></span><span></span>
        </button>
        <span className="inb-page-indicator">Hostel Management</span>
      </div>

      <div className="inb-nav-right">
        <div className="inb-user-info">
          <div className="inb-user-details">
            <span className="inb-user-name">{userName}</span>
            <button className="inb-logout-link" onClick={handleLogout}>Logout</button>
          </div>
          <div className="inb-mini-avatar">{initials}</div>
        </div>
      </div>
    </nav>
  );
}