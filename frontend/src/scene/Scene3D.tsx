import React from 'react';
import { ChatPanel } from '../components/ChatPanel';

interface Scene3DProps {
  onBack: () => void;
}

export const Scene3D: React.FC<Scene3DProps> = ({ onBack }) => {
  return (
    <div style={{ position: 'relative', width: '100vw', height: '100vh', overflow: 'hidden' }}>
      <button 
        onClick={onBack}
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
          transition: 'transform 0.1s ease'
        }}
        onMouseDown={(e) => e.currentTarget.style.transform = 'translate(4px, 4px)'}
        onMouseUp={(e) => e.currentTarget.style.transform = 'translate(0px, 0px)'}
        onMouseLeave={(e) => e.currentTarget.style.transform = 'translate(0px, 0px)'}
      >
        <i className="fa-solid fa-arrow-left"></i> BACK
      </button>
      <ChatPanel />
    </div>
  );
};
