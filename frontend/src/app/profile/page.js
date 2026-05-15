'use client';
import { useState, useEffect } from 'react';
import Sidebar from '../components/sidebar/page';
import Navbar from '../components/navbar/page';
import { apiRequest } from '../services/api.js';
import './profile.css';

export default function ProfilePage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const [userData, setUserData] = useState({
    name: "",
    username: "",
    email: "",
    role: "",
    room: "",
    phone: ""
  });

  // ── Edit form state (separate so cancel doesn't corrupt displayed data) ──
  const [editForm, setEditForm] = useState({
    name: "",
    email: "",
    phone: ""
  });

  // ── Fetch fresh data from backend on mount ────────────────────────────────
useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await apiRequest("/profile", "GET");
        const profile = {
          name:     res.name     || "",
          username: res.username || "",
          email:    res.email    || "",
          phone:    res.phone    || "",
          room:     res.room     || "",
          role:     res.role     || ""
        };
        setUserData(profile);

        // Sync localStorage with fresh data from DB
        localStorage.setItem("userName",   profile.name);
        localStorage.setItem("userEmail",  profile.email);
        localStorage.setItem("userPhone",  profile.phone);
        localStorage.setItem("username",   profile.username);
        localStorage.setItem("userRole",   profile.role);
        localStorage.setItem("roomNumber", profile.room);
      } catch (err) {
        // Fallback to localStorage if API fails
        setUserData({
          name:     localStorage.getItem("userName")   || "Admin",
          username: localStorage.getItem("username")   || "x",
          email:    localStorage.getItem("userEmail")  || "Not Set",
          phone:    localStorage.getItem("userPhone")  || "Not Set",
          room:     localStorage.getItem("roomNumber") || "",
          role:     localStorage.getItem("userRole")   || "Admin"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  // ── Open edit modal pre-filled with current values ────────────────────────
  const openEdit = () => {
    setEditForm({
      name:  userData.name,
      email: userData.email,
      phone: userData.phone
    });
    setIsEditModalOpen(true);
  };

  // ── Save changes ──────────────────────────────────────────────────────────
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await apiRequest("/profile/update", "PUT", {
        name:  editForm.name,
        phone: editForm.phone,
        email: editForm.email   // ignored by backend for students, accepted for admins
      });

      const updated = {
        ...userData,
        name:  res.name  || editForm.name,
        email: res.email || editForm.email,
        phone: res.phone || editForm.phone
      };

      setUserData(updated);

      // Sync localStorage
      localStorage.setItem("userName",  updated.name);
      localStorage.setItem("userEmail", updated.email);
      localStorage.setItem("userPhone", updated.phone);

      setIsEditModalOpen(false);
      alert("Profile updated successfully!");
    } catch (err) {
      alert(err.message || "Failed to update profile.");
    }
  };

  const getInitials = (name) => {
    if (!name) return "??";
    return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
  };

  if (loading) {
    return (
      <div className="pr-app-container">
        <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
        <div className="pr-main-wrapper">
          <Navbar setIsOpen={setIsSidebarOpen} />
          <main className="pr-scroll-body" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <p style={{ color: 'var(--color-text-secondary)' }}>Loading profile…</p>
          </main>
        </div>
      </div>
    );
  }

  const isStudent = userData.role === "Student";
  const isAdmin   = ["Admin", "Super_Admin", "General_Secretary"].includes(userData.role);

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

            {/* ── Left card ── */}
            <div className="pr-user-card">
              <div className="pr-avatar">{getInitials(userData.name)}</div>
              <h2 className="pr-user-name">{userData.name || "—"}</h2>
              <span className="pr-user-role">{userData.role}</span>
              <button className="pr-edit-btn" onClick={openEdit}>
                Edit Profile
              </button>
            </div>

            {/* ── Right details ── */}
            <div className="pr-details-container">

              <div className="pr-section-card">
                <h3>Account Details</h3>
                <div className="pr-info-grid">
                  <div className="pr-info-item">
                    <label>Full Name</label>
                    <p>{userData.name || "—"}</p>
                  </div>

                  {/* Username shown for admins; email-as-ID shown for students */}
                  {isAdmin && (
                    <div className="pr-info-item">
                      <label>Username</label>
                      <p>{userData.username || "—"}</p>
                    </div>
                  )}

                  <div className="pr-info-item">
                    <label>Role</label>
                    <p>{userData.role || "—"}</p>
                  </div>

                  {isStudent && (
                    <div className="pr-info-item">
                      <label>Room Number</label>
                      <p>{userData.room || "Unassigned"}</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="pr-section-card">
                <h3>Contact Information</h3>
                <div className="pr-info-grid">
                  <div className="pr-info-item">
                    <label>Email Address</label>
                    <p>{userData.email || "—"}</p>
                  </div>
                  <div className="pr-info-item">
                    <label>Phone Number</label>
                    <p>{userData.phone || "—"}</p>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </main>
      </div>

      {/* ── Edit Modal ── */}
      {isEditModalOpen && (
        <div className="pr-modal-overlay">
          <div className="pr-modal">
            <h2>Update Profile</h2>
            <form onSubmit={handleEditSubmit}>

              <div className="pr-input-group">
                <label>Full Name</label>
                <input
                  type="text"
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  required
                />
              </div>

              {/* Admins can update email; students cannot (email is their login ID) */}
              {isAdmin && (
                <div className="pr-input-group">
                  <label>Email Address</label>
                  <input
                    type="email"
                    value={editForm.email}
                    onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                  />
                </div>
              )}

              {isStudent && (
                <div className="pr-input-group">
                  <label>Email Address</label>
                  <input type="email" value={editForm.email} disabled style={{ opacity: 0.5, cursor: 'not-allowed' }} />
                  <small style={{ color: 'var(--color-text-tertiary)', marginTop: 4 }}>Email cannot be changed.</small>
                </div>
              )}

              <div className="pr-input-group">
                <label>Phone Number</label>
                <input
                  type="tel"
                  value={editForm.phone}
                  onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                  placeholder="+91 98765 43210"
                />
              </div>

              <div className="pr-modal-actions">
                <button type="button" className="pr-cancel-btn" onClick={() => setIsEditModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="pr-save-btn">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}