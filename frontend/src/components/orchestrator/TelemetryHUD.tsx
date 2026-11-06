import React from 'react';
import { useOrchestrator } from '../../context/useOrchestrator';

export const TelemetryHUD: React.FC = () => {
  const {
    graph,
    selectedNode,
    hoveredNode,
    autoRotate,
    showGrid,
    setAutoRotate,
    setShowGrid,
    resetCamera
  } = useOrchestrator();

  const displayNode = hoveredNode || selectedNode;

  return (
    <>
      {/* Top-Right Telemetry Data */}
      <div
        style={{
          position: 'absolute',
          top: '24px',
          right: '24px',
          zIndex: 40,
          pointerEvents: 'none',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-end',
          gap: '6px',
          fontFamily: 'monospace',
          fontSize: '0.72rem',
          letterSpacing: '0.06em',
          color: 'var(--text-muted)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ color: 'var(--accent-highlight)' }}>●</span>
          <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{graph.repoName}</span>
          <span style={{ padding: '2px 6px', borderRadius: '4px', background: 'rgba(255,255,255,0.08)', color: 'var(--accent-highlight)' }}>
            {graph.branch}
          </span>
        </div>

        <div style={{ display: 'flex', gap: '14px', marginTop: '4px' }}>
          <span>NODES: <strong style={{ color: 'var(--ink)' }}>{graph.nodes.length}</strong></span>
          <span>CONNS: <strong style={{ color: 'var(--ink)' }}>{graph.connections.length}</strong></span>
          <span>DIRS: <strong style={{ color: 'var(--ink)' }}>{graph.totalFolders}</strong></span>
          <span>FILES: <strong style={{ color: 'var(--ink)' }}>{graph.totalFiles}</strong></span>
        </div>

        {displayNode && (
          <div
            style={{
              marginTop: '6px',
              padding: '6px 12px',
              background: 'rgba(15, 15, 15, 0.75)',
              backdropFilter: 'blur(8px)',
              border: `1px solid ${displayNode.color}44`,
              borderRadius: '8px',
              color: 'var(--text-primary)',
              maxWidth: '300px',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap'
            }}
          >
            <span style={{ color: displayNode.color, marginRight: '6px' }}>
              {displayNode.type === 'folder' ? '📁' : '📄'}
            </span>
            <span>{displayNode.path}</span>
            {displayNode.lineCount && (
              <span style={{ color: 'var(--text-muted)', marginLeft: '8px' }}>
                ({displayNode.lineCount} lines)
              </span>
            )}
          </div>
        )}
      </div>

      {/* Floating Bottom Viewport Controls Toolbar */}
      <div
        style={{
          position: 'absolute',
          bottom: '24px',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 40,
          display: 'flex',
          gap: '8px',
          background: 'rgba(20, 20, 20, 0.75)',
          backdropFilter: 'blur(16px)',
          border: '1px solid var(--border-subtle)',
          borderRadius: '30px',
          padding: '6px 12px',
          boxShadow: '0 8px 32px rgba(0,0,0,0.5)'
        }}
      >
        <button
          onClick={resetCamera}
          title="Reset Camera Overview"
          style={{
            background: 'transparent',
            border: 'none',
            color: 'var(--text-primary)',
            padding: '6px 12px',
            fontSize: '0.78rem',
            fontFamily: 'Inter, sans-serif',
            cursor: 'pointer',
            borderRadius: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)')}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
        >
          <i className="fa-solid fa-crosshairs" style={{ color: 'var(--accent-highlight)' }}></i>
          <span>Reset</span>
        </button>

        <button
          onClick={() => setAutoRotate((prev) => !prev)}
          title="Toggle 3D Orbit Rotation"
          style={{
            background: autoRotate ? 'rgba(0, 255, 204, 0.15)' : 'transparent',
            border: 'none',
            color: autoRotate ? 'var(--accent-highlight)' : 'var(--text-secondary)',
            padding: '6px 12px',
            fontSize: '0.78rem',
            fontFamily: 'Inter, sans-serif',
            cursor: 'pointer',
            borderRadius: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)')}
          onMouseLeave={(e) =>
            (e.currentTarget.style.backgroundColor = autoRotate ? 'rgba(0, 255, 204, 0.15)' : 'transparent')
          }
        >
          <i className="fa-solid fa-rotate" style={{ animation: autoRotate ? 'spin 6s linear infinite' : 'none' }}></i>
          <span>Rotate</span>
        </button>

        <button
          onClick={() => setShowGrid((prev) => !prev)}
          title="Toggle Cyber-Grid Floor"
          style={{
            background: showGrid ? 'rgba(0, 255, 204, 0.15)' : 'transparent',
            border: 'none',
            color: showGrid ? 'var(--accent-highlight)' : 'var(--text-secondary)',
            padding: '6px 12px',
            fontSize: '0.78rem',
            fontFamily: 'Inter, sans-serif',
            cursor: 'pointer',
            borderRadius: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)')}
          onMouseLeave={(e) =>
            (e.currentTarget.style.backgroundColor = showGrid ? 'rgba(0, 255, 204, 0.15)' : 'transparent')
          }
        >
          <i className="fa-solid fa-border-all"></i>
          <span>Grid</span>
        </button>
      </div>
    </>
  );
};
