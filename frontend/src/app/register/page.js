"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import "./register.css";
import { apiRequest } from "../services/api.js";

export default function RegisterPage() {
  const router = useRouter();
  const [role, setRole] = useState("student");
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    phone: "",
    password: "",
    room: "Unassigned",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const endpoint = role === "student" ? "/student/register" : "/admin/register";

      const payload =
        role === "student"
          ? {
              name: formData.name,
              email: formData.email,
              phone: formData.phone || "+91 00000 00000",
              password: formData.password,
              room_number: formData.room,
            }
          : {
              name: formData.name,
              username: formData.username,
              email: formData.email,
              phone: formData.phone || "+91 00000 00000",
              password: formData.password,
              role: "Admin",
            };

      const res = await apiRequest(endpoint, "POST", payload);

      alert(res.message || "Registration Successful!");

      // ── Auto-fill localStorage so profile shows data immediately after login ──
      // (The user still needs to log in, but this primes the keys so there's
      //  no blank flash if they navigate before the login response arrives.)
      localStorage.setItem("userName",   res.name     || formData.name);
      localStorage.setItem("userEmail",  res.email    || formData.email);
      localStorage.setItem("userPhone",  res.phone    || formData.phone || "");
      localStorage.setItem("username",   res.username || formData.username || "");
      localStorage.setItem("userRole",   res.role     || (role === "student" ? "Student" : "Admin"));
      localStorage.setItem("roomNumber", res.room     || formData.room || "");

      router.push("/login");
    } catch (err) {
      const msg = err.message || "";
      if (msg.toLowerCase().includes("email already exists") || msg.toLowerCase().includes("email")) {
        alert("Email already registered.");
      } else if (msg.toLowerCase().includes("username already exists") || msg.toLowerCase().includes("username")) {
        alert("Username already taken.");
      } else {
        alert(msg || "Registration failed");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rg-auth-container">
      <nav className="rg-vnb-nav">
        <div className="rg-vnb-logo" onClick={() => router.push("/")}>
          Hostel<span>Hub</span>
        </div>
        <div className="rg-vnb-right">
          <Link href="/login" className="rg-vnb-login">
            Already a member? Login
          </Link>
        </div>
      </nav>

      <div className="rg-auth-card">
        <div className="rg-auth-header">
          <h2>Create Account</h2>
          <p>Join our hostel management system</p>
        </div>

        <div className="rg-role-toggle">
          <button
            className={role === "student" ? "rg-active" : ""}
            onClick={() => setRole("student")}
            type="button"
          >
            🎓 Student
          </button>
          <button
            className={role === "admin" ? "rg-active" : ""}
            onClick={() => setRole("admin")}
            type="button"
          >
            ⚙ Admin
          </button>
        </div>

        <form className="rg-form" onSubmit={handleRegister}>

          {/* ── Full Name ── */}
          <div className="rg-input-group">
            <label>{role === "student" ? "Full Name" : "Admin Name"}</label>
            <input
              name="name"
              type="text"
              placeholder={role === "student" ? "John Doe" : "Admin Staff"}
              required
              value={formData.name}
              onChange={handleChange}
            />
          </div>

          {/* ── Username (admin only) ── */}
          {role === "admin" && (
            <div className="rg-input-group">
              <label>Username</label>
              <input
                name="username"
                type="text"
                placeholder="Enter username"
                required
                value={formData.username}
                onChange={handleChange}
              />
            </div>
          )}

          {/* ── Email ── */}
          <div className="rg-input-group">
            <label>Email Address</label>
            <input
              name="email"
              type="email"
              placeholder="name@email.com"
              required
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          {/* ── Phone ── */}
          <div className="rg-input-group">
            <label>Phone Number <span style={{ opacity: 0.5, fontSize: "0.85em" }}>(optional)</span></label>
            <input
              name="phone"
              type="tel"
              placeholder="+91 98765 43210"
              value={formData.phone}
              onChange={handleChange}
            />
          </div>

          {/* ── Room (student only) ── */}
          {role === "student" && (
            <div className="rg-input-group">
              <label>Room Number</label>
              <input
                name="room"
                type="text"
                placeholder="e.g. B-302"
                value={formData.room}
                onChange={handleChange}
              />
            </div>
          )}

          {/* ── Password ── */}
          <div className="rg-input-group">
            <label>Password</label>
            <input
              name="password"
              type="password"
              placeholder="••••••••"
              required
              value={formData.password}
              onChange={handleChange}
            />
          </div>

          <button type="submit" className="rg-submit-btn" disabled={loading}>
            {loading ? "Registering…" : `Register as ${role === "student" ? "Student" : "Admin"}`}
          </button>
        </form>
      </div>
    </div>
  );
}