'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import './page.css';

export default function Home() {
  const router = useRouter();

  return (
    <div className="hp-wrapper">

      {/* NAVBAR */}
      <nav className="hp-nav">
        <div className="hp-logo" onClick={() => router.push('/')}>
          Hostel<span>Hub</span>
        </div>

        <div className="hp-nav-actions">
          <Link href="/login" className="hp-nav-link">
            Login
          </Link>
          <Link href="/register" className="hp-btn-primary">
            Get Started
          </Link>
        </div>
      </nav>

      {/* HERO SECTION */}
      <main className="hp-hero-section">

        {/* LEFT CONTENT */}
        <div className="hp-hero-content">
          <div className="hp-hero-badge">
            Smart Digital Hostel Platform
          </div>

          <h1 className="hp-hero-title">
            Manage Your Hostel <br />
            <span className="hp-gradient-text">
              The Smart Way.
            </span>
          </h1>

          <p className="hp-hero-desc">
            Streamline meals, attendance, complaints,
            notices and hostel operations with one
            modern centralized system.
          </p>

          <div className="hp-hero-btns">
            <Link href="/register" className="hp-btn-lg-primary">
              Start Now
            </Link>
            <Link href="/dashboard" className="hp-btn-lg-outline">
              Explore Dashboard
            </Link>
          </div>

          {/* STATS */}
          <div className="hp-hero-stats">
            <div className="hp-stat-box">
              <h3 className="hp-stat-val">1200+</h3>
              <p className="hp-stat-label">Students</p>
            </div>

            <div className="hp-stat-box">
              <h3 className="hp-stat-val">98%</h3>
              <p className="hp-stat-label">Meal Accuracy</p>
            </div>

            <div className="hp-stat-box">
              <h3 className="hp-stat-val">24/7</h3>
              <p className="hp-stat-label">Support</p>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE PREVIEW */}
        <div className="hp-hero-preview">
          <div className="hp-preview-card">
            <div className="hp-card-top">
              <div className="hp-card-dots">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>

            <div className="hp-card-content">
              <div className="hp-card-header">
                <h2 className="hp-card-title">Dashboard Overview</h2>
                <div className="hp-live-badge">LIVE</div>
              </div>

              <div className="hp-mini-cards">
                <div className="hp-mini-card">
                  <h4>Today's Meals</h4>
                  <p>450 Confirmed</p>
                </div>
                <div className="hp-mini-card hp-purple">
                  <h4>Complaints</h4>
                  <p>12 Pending</p>
                </div>
              </div>

              <div className="hp-activity-box">
                <h3>Recent Notices</h3>
                <div className="hp-notice-item">Water supply maintenance at 4 PM</div>
                <div className="hp-notice-item">Hostel inspection tomorrow morning</div>
                <div className="hp-notice-item">New dinner menu updated</div>
              </div>
            </div>
          </div>
        </div>

      </main>
    </div>
  );
}