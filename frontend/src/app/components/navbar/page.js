'use client';
import "./navbar.css";

export default function Navbar({ setIsOpen }) {
  return (
    <nav className="inb-main-nav">
      <div className="inb-nav-left">
        <button className="inb-menu-btn" onClick={() => setIsOpen(true)}>☰</button>
        <span className="inb-page-indicator">Student Portal</span>
      </div>
      
      <div className="inb-nav-right">
        <div className="inb-user-info">
          <span>Rahul Sharma</span>
          <div className="inb-mini-avatar">RS</div>
        </div>
      </div>
    </nav>
  );
}