import React from 'react';
import { Link } from 'react-router-dom';
import { ChatPanel } from '../components/ChatPanel';
import { OrchestratorProvider } from '../context/OrchestratorContext';
import { RepoSearchBar } from '../components/orchestrator/RepoSearchBar';
import { TelemetryHUD } from '../components/orchestrator/TelemetryHUD';
import { NodeInspector } from '../components/orchestrator/NodeInspector';

export const Scene3D: React.FC = () => {
  return (
    <OrchestratorProvider>
      <div style={{ position: 'relative', width: '100vw', height: '100vh', overflow: 'hidden' }}>
        {/* Back navigation button */}
        <Link
          to="/"
          style={{
            position: 'absolute',
            top: '24px',
            left: '24px',
            zIndex: 100,
            backgroundColor: 'rgba(30, 30, 30, 0.75)',
            backdropFilter: 'blur(16px)',
            color: 'var(--text-primary)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '24px',
            padding: '9px 18px',
            fontFamily: 'Inter, sans-serif',
            fontWeight: 500,
            fontSize: '0.82rem',
            letterSpacing: '0.05em',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            transition: 'all 0.2s ease',
            textDecoration: 'none',
            boxShadow: '0 4px 16px rgba(0,0,0,0.3)'
          }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(50, 50, 50, 0.9)')}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'rgba(30, 30, 30, 0.75)')}
        >
          <i className="fa-solid fa-arrow-left"></i> BACK
        </Link>

        {/* 3D Viewport Controls & HUD Overlays */}
        <RepoSearchBar />
        <TelemetryHUD />
        <NodeInspector />

        {/* Split Screen 3D Canvas + AI Chat */}
        <ChatPanel />
      </div>
    </OrchestratorProvider>
  );
};
