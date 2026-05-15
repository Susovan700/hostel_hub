'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { apiRequest } from '../services/api.js';
import "./login.css";

export default function LoginPage() {
  const router = useRouter();
  const [role, setRole] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const endpoint = role === 'Admin' ? '/admin/login' : '/student/login';
      const body = role === 'Admin'
        ? { username: email, password }
        : { email, password };

      const data = await apiRequest(endpoint, "POST", body);

      // ── Save everything from the response ──────────────────────────
      localStorage.setItem("token",      data.access_token);
      localStorage.setItem("userRole",   data.role        || "");
      localStorage.setItem("userName",   data.name        || "");
      localStorage.setItem("userEmail",  data.email       || "");
      localStorage.setItem("userPhone",  data.phone       || "");
      localStorage.setItem("username",   data.username    || "");
      localStorage.setItem("roomNumber", data.room        || "");

      router.push('/dashboard');
    } catch (err) {
      alert(err.message || "Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="lg-auth-container">
      <nav className="lg-vnb-nav">
        <div className="lg-vnb-logo" onClick={() => router.push('/')}>
          Hostel<span>Hub</span>
        </div>
        <div className="lg-vnb-right">
          <span className="lg-vnb-tag">Secure Access</span>
          <Link href="/" className="lg-vnb-home">Back to Home</Link>
        </div>
      </nav>

      <div className="lg-auth-card">
        <div className="lg-auth-header">
          <h2>{role ? `${role} Login` : "Welcome Back"}</h2>
          <p>{role ? `Enter credentials for ${role} portal` : "Select your portal to continue"}</p>
        </div>

        {!role ? (
          <div className="lg-role-grid">
            <div className="lg-role-card" onClick={() => setRole('Student')}>
              <div className="lg-role-icon">🎓</div>
              <div className="lg-role-text">
                <h3>Student Portal</h3>
                <p>View meals &amp; attendance</p>
              </div>
            </div>
            <div className="lg-role-card" onClick={() => setRole('Admin')}>
              <div className="lg-role-icon">🔐</div>
              <div className="lg-role-text">
                <h3>Admin Portal</h3>
                <p>Management tools</p>
              </div>
            </div>
          </div>
        ) : (
          <form className="lg-form" onSubmit={handleLogin}>
            <div className="lg-input-group">
              <label>{role === 'Admin' ? 'Username' : 'Email Address'}</label>
              <input
                type={role === 'Admin' ? 'text' : 'email'}
                placeholder={role === 'Admin' ? 'admin_username' : 'name@university.edu'}
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="lg-input-group">
              <label>Password</label>
              <input
                type="password"
                placeholder="••••••••"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <button type="submit" className="lg-submit-btn" disabled={loading}>
              {loading ? "Signing in…" : "Sign In"}
            </button>
            <button type="button" className="lg-back-link" onClick={() => setRole(null)}>
              ← Back to role selection
            </button>
          </form>
        )}

        <div className="lg-auth-footer">
          New student? <Link href="/register">Create Account</Link>
        </div>
      </div>
    </div>
  );
}