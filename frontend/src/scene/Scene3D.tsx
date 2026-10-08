import React from 'react';
import { Link } from 'react-router-dom';
import { ChatPanel } from '../components/ChatPanel';

export const Scene3D: React.FC = () => {
  return (
    <div style={{ position: 'relative', width: '100vw', height: '100vh', overflow: 'hidden' }}>
      <Link
        to="/"
        style={{
          position: 'absolute',
          top: '24px',
          left: '24px',
          zIndex: 100,
          backgroundColor: 'rgba(30, 30, 30, 0.6)',
          backdropFilter: 'blur(12px)',
          color: 'var(--text-primary)',
          border: '1px solid var(--border-subtle)',
          borderRadius: '24px',
          padding: '10px 20px',
          fontFamily: 'Inter, sans-serif',
          fontWeight: 500,
          fontSize: '0.85rem',
          letterSpacing: '0.05em',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          transition: 'all 0.2s ease',
          textDecoration: 'none'
        }}
        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(50, 50, 50, 0.8)'}
        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'rgba(30, 30, 30, 0.6)'}
      >
        <i className="fa-solid fa-arrow-left"></i> BACK
      </Link>
      <ChatPanel />
    </div>
  );
};
