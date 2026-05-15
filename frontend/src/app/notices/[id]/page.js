'use client';
import { use, useState, useEffect } from 'react';
import { apiRequest } from '../../services/api';
import Sidebar from '../../components/sidebar/page';
import Navbar from '../../components/navbar/page';

export default function NoticeDetails({ params }) {
  const { id } = use(params); // Get ID from URL
  const [notice, setNotice] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const getNotice = async () => {
      try {
        // You might need to add a specific GET /api/notices/<id> in Flask
        // For now, we fetch all and filter, or use a placeholder
        const all = await apiRequest("/notices", "GET");
        const match = all.find(n => n.id.toString() === id);
        setNotice(match);
      } catch (err) {
        console.error(err);
      }
    };
    getNotice();
  }, [id]);

  if (!notice) return <div className="nt-loader">Loading details...</div>;

  return (
    <div className="nt-app-container">
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
      <div className="nt-main-wrapper">
        <Navbar setIsOpen={setIsSidebarOpen} />
        <main className="nt-scroll-body" style={{padding: '40px'}}>
          <div className="nt-detail-card" style={{background: 'white', padding: '30px', borderRadius: '20px'}}>
            <span style={{color: '#64748b'}}>{notice.date}</span>
            <h1 style={{margin: '10px 0'}}>{notice.title}</h1>
            <hr style={{margin: '20px 0', opacity: 0.1}}/>
            <p style={{lineHeight: '1.6', color: '#334155'}}>{notice.content}</p>
          </div>
        </main>
      </div>
    </div>
  );
}