'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import "./login.css";

export default function LoginPage() {
  const router = useRouter();
  const [role, setRole] = useState(null); 
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <div className="lg-auth-container">
      
      {/* INTERNAL VIRTUAL NAVBAR */}
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
                <p>View meals & attendance</p>
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
          <form className="lg-form" onSubmit={(e) => { e.preventDefault(); router.push('/dashboard'); }}>
            <div className="lg-input-group">
              <label>Email Address</label>
              <input type="email" placeholder="name@university.edu" required />
            </div>
            <div className="lg-input-group">
              <label>Password</label>
              <input type="password" placeholder="••••••••" required />
            </div>
            <button type="submit" className="lg-submit-btn">Sign In</button>
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