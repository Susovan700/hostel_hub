'use client';
import { useState } from 'react';
import Sidebar from '../components/sidebar/page';
import Navbar from '../components/navbar/page';
import './profile.css';

export default function ProfilePage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Mock User Data
  const user = {
    name: "Rahul Sharma",
    id: "2024CS101",
    email: "rahul.s@university.edu",
    phone: "+91 98765 43210",
    room: "B-302",
    hostel: "Boys Hostel Block 2",
    bloodGroup: "O+",
    emergencyContact: "+91 99887 76655"
  };

  return (
    <div className="pr-app-container">
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
      <div className="pr-main-wrapper">
        <Navbar setIsOpen={setIsSidebarOpen} />
        <main className="pr-scroll-body">
          <div className="pr-header">
            <h1>My Profile</h1>
            <p>Manage your personal information and hostel records.</p>
          </div>

          <div className="pr-content-grid">
            {/* PROFILE CARD */}
            <div className="pr-user-card">
              <div className="pr-avatar">
                {user.name.split(' ').map(n => n[0]).join('')}
              </div>
              <h2 className="pr-user-name">{user.name}</h2>
              <span className="pr-user-role">Student Member</span>
              <button className="pr-edit-btn">Edit Profile</button>
            </div>

            {/* DETAILS SECTION */}
            <div className="pr-details-container">
              <div className="pr-section-card">
                <h3>Academic & Hostel Details</h3>
                <div className="pr-info-grid">
                  <div className="pr-info-item">
                    <label>Student ID</label>
                    <p>{user.id}</p>
                  </div>
                  <div className="pr-info-item">
                    <label>Room Number</label>
                    <p>{user.room}</p>
                  </div>
                  <div className="pr-info-item">
                    <label>Hostel Block</label>
                    <p>{user.hostel}</p>
                  </div>
                </div>
              </div>

              <div className="pr-section-card">
                <h3>Contact Information</h3>
                <div className="pr-info-grid">
                  <div className="pr-info-item">
                    <label>Email Address</label>
                    <p>{user.email}</p>
                  </div>
                  <div className="pr-info-item">
                    <label>Phone Number</label>
                    <p>{user.phone}</p>
                  </div>
                </div>
              </div>

              <div className="pr-section-card">
                <h3>Medical & Emergency</h3>
                <div className="pr-info-grid">
                  <div className="pr-info-item">
                    <label>Blood Group</label>
                    <p>{user.bloodGroup}</p>
                  </div>
                  <div className="pr-info-item">
                    <label>Emergency Contact</label>
                    <p>{user.emergencyContact}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}