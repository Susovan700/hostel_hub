"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import "./register.css";

export default function RegisterPage() {
  const router = useRouter();
  const [role, setRole] = useState("student");

  return (
    <div className="rg-auth-container">
      {/* INTERNAL VIRTUAL NAVBAR */}
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
            className={role === "gs" ? "rg-active" : ""}
            onClick={() => setRole("gs")}
            type="button"
          >
            🏛 GS
          </button>

          <button
            className={role === "admin" ? "rg-active" : ""}
            onClick={() => setRole("admin")}
            type="button"
          >
            ⚙ Admin
          </button>
        </div>

        <form className="rg-form">
          <div className="rg-input-group">
            <label>Full Name</label>
            <input type="text" placeholder="John Doe" required />
          </div>
          <div className="rg-input-group">
            <label>Email Address</label>
            <input type="email" placeholder="name@university.edu" required />
          </div>
          <div className="rg-input-group">
            <label>Password</label>
            <input type="password" placeholder="••••••••" required />
          </div>
          <button type="submit" className="rg-submit-btn">
            Register Now
          </button>
        </form>
      </div>
    </div>
  );
}
