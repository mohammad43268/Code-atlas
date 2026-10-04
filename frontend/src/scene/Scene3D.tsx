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
          backgroundColor: 'var(--bg)',
          color: 'var(--ink)',
          border: '1px solid var(--ink)',
          boxShadow: '4px 4px 0px var(--ink)',
          padding: '12px 20px',
          fontFamily: 'Inter, sans-serif',
          fontWeight: 700,
          fontSize: '0.85rem',
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          transition: 'transform 0.1s ease',
          textDecoration: 'none'
        }}
        onMouseDown={(e) => e.currentTarget.style.transform = 'translate(4px, 4px)'}
        onMouseUp={(e) => e.currentTarget.style.transform = 'translate(0px, 0px)'}
        onMouseLeave={(e) => e.currentTarget.style.transform = 'translate(0px, 0px)'}
      >
        <i className="fa-solid fa-arrow-left"></i> BACK
      </Link>
      <ChatPanel />
    </div>
  );
};
