import React from 'react';
import { useOrchestrator } from '../../context/useOrchestrator';

export const TelemetryHUD: React.FC = () => {
  const {
    graph,
    selectedNode,
    hoveredNode,
    autoRotate,
    showGrid,
    dataFlowSpeed,
    setAutoRotate,
    setShowGrid,
    setDataFlowSpeed,
    resetCamera
  } = useOrchestrator();

  const displayNode = hoveredNode || selectedNode;

  const cycleFlowSpeed = () => {
    const speeds = [0.5, 1, 2, 4];
    const currentIndex = speeds.indexOf(dataFlowSpeed);
    const nextSpeed = speeds[(currentIndex + 1) % speeds.length] ?? 1;
    setDataFlowSpeed(nextSpeed);
  };

  return (
    <>
      {/* Top-Right Telemetry Data HUD */}
      <div
        className="glass-hud"
        style={{
          position: 'absolute',
          top: '16px',
          right: '16px',
          zIndex: 40,
          pointerEvents: 'auto',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-end',
          gap: '8px',
          padding: '10px 14px',
          borderRadius: '12px',
          fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
          fontSize: '0.72rem',
          letterSpacing: '0.04em',
          maxWidth: '360px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', width: '100%', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', overflow: 'hidden' }}>
            <span
              style={{
                width: '7px',
                height: '7px',
                borderRadius: '50%',
                backgroundColor: 'var(--accent-highlight)',
                display: 'inline-block',
                animation: 'cyanPulse 2.4s infinite ease-in-out'
              }}
            />
            <span
              style={{
                color: 'var(--text-primary)',
                fontWeight: 600,
                textTransform: 'uppercase',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }}
              title={graph.repoName}
            >
              {graph.repoName}
            </span>
          </div>

          <span
            style={{
              padding: '2px 8px',
              borderRadius: '6px',
              background: 'rgba(0, 255, 204, 0.1)',
              border: '1px solid rgba(0, 255, 204, 0.3)',
              color: 'var(--accent-highlight)',
              fontSize: '0.68rem',
              fontWeight: 500,
              flexShrink: 0
            }}
          >
            {graph.branch}
          </span>
        </div>

        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'flex-end', width: '100%' }}>
          <span style={{ color: 'var(--text-muted)' }}>
            NODES <strong style={{ color: 'var(--ink)' }}>{graph.nodes.length}</strong>
          </span>
          <span style={{ color: 'rgba(255,255,255,0.2)' }}>•</span>
          <span style={{ color: 'var(--text-muted)' }}>
            CONNS <strong style={{ color: 'var(--ink)' }}>{graph.connections.length}</strong>
          </span>
          <span style={{ color: 'rgba(255,255,255,0.2)' }}>•</span>
          <span style={{ color: 'var(--text-muted)' }}>
            DIRS <strong style={{ color: 'var(--ink)' }}>{graph.totalFolders}</strong>
          </span>
          <span style={{ color: 'rgba(255,255,255,0.2)' }}>•</span>
          <span style={{ color: 'var(--text-muted)' }}>
            FILES <strong style={{ color: 'var(--ink)' }}>{graph.totalFiles}</strong>
          </span>
        </div>

        {displayNode && (
          <div
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '4px 8px',
              background: 'rgba(255, 255, 255, 0.04)',
              border: `1px solid ${displayNode.color}55`,
              borderRadius: '6px',
              color: 'var(--text-primary)',
              overflow: 'hidden',
              fontSize: '0.68rem'
            }}
          >
            <span style={{ color: displayNode.color }}>
              {displayNode.type === 'folder' ? '📁' : '📄'}
            </span>
            <span
              style={{
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                color: 'var(--text-secondary)'
              }}
              title={displayNode.path}
            >
              {displayNode.path}
            </span>
            {displayNode.lineCount && (
              <span style={{ color: 'var(--text-muted)', marginLeft: 'auto', flexShrink: 0 }}>
                ~{displayNode.lineCount}L
              </span>
            )}
          </div>
        )}
      </div>

      {/* Floating Bottom Viewport Controls Toolbar */}
      <div
        className="glass-hud"
        style={{
          position: 'absolute',
          bottom: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 40,
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          borderRadius: '40px',
          padding: '5px 8px'
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
            fontSize: '0.75rem',
            fontFamily: 'Inter, sans-serif',
            fontWeight: 500,
            cursor: 'pointer',
            borderRadius: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.08)')}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
        >
          <i className="fa-solid fa-crosshairs" style={{ color: 'var(--accent-highlight)' }}></i>
          <span>Reset</span>
        </button>

        <button
          onClick={() => setAutoRotate((prev) => !prev)}
          title="Toggle Damped 3D Orbit"
          style={{
            background: autoRotate ? 'rgba(0, 255, 204, 0.12)' : 'transparent',
            border: autoRotate ? '1px solid rgba(0, 255, 204, 0.3)' : '1px solid transparent',
            color: autoRotate ? 'var(--accent-highlight)' : 'var(--text-secondary)',
            padding: '6px 12px',
            fontSize: '0.75rem',
            fontFamily: 'Inter, sans-serif',
            fontWeight: 500,
            cursor: 'pointer',
            borderRadius: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = autoRotate ? 'rgba(0, 255, 204, 0.2)' : 'rgba(255,255,255,0.08)')}
          onMouseLeave={(e) =>
            (e.currentTarget.style.backgroundColor = autoRotate ? 'rgba(0, 255, 204, 0.12)' : 'transparent')
          }
        >
          <i className="fa-solid fa-rotate" style={{ animation: autoRotate ? 'spin 6s linear infinite' : 'none' }}></i>
          <span>Orbit</span>
        </button>

        <button
          onClick={() => setShowGrid((prev) => !prev)}
          title="Toggle Cyber-Grid Floor"
          style={{
            background: showGrid ? 'rgba(0, 255, 204, 0.12)' : 'transparent',
            border: showGrid ? '1px solid rgba(0, 255, 204, 0.3)' : '1px solid transparent',
            color: showGrid ? 'var(--accent-highlight)' : 'var(--text-secondary)',
            padding: '6px 12px',
            fontSize: '0.75rem',
            fontFamily: 'Inter, sans-serif',
            fontWeight: 500,
            cursor: 'pointer',
            borderRadius: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = showGrid ? 'rgba(0, 255, 204, 0.2)' : 'rgba(255,255,255,0.08)')}
          onMouseLeave={(e) =>
            (e.currentTarget.style.backgroundColor = showGrid ? 'rgba(0, 255, 204, 0.12)' : 'transparent')
          }
        >
          <i className="fa-solid fa-border-all"></i>
          <span>Grid</span>
        </button>

        <button
          onClick={cycleFlowSpeed}
          title="Cycle Data Flow Photon Speed (0.5x, 1x, 2x, 4x)"
          style={{
            background: dataFlowSpeed > 1 ? 'rgba(0, 255, 204, 0.12)' : 'transparent',
            border: dataFlowSpeed > 1 ? '1px solid rgba(0, 255, 204, 0.3)' : '1px solid transparent',
            color: dataFlowSpeed > 1 ? 'var(--accent-highlight)' : 'var(--text-secondary)',
            padding: '6px 12px',
            fontSize: '0.75rem',
            fontFamily: 'Inter, sans-serif',
            fontWeight: 500,
            cursor: 'pointer',
            borderRadius: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.08)')}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = dataFlowSpeed > 1 ? 'rgba(0, 255, 204, 0.12)' : 'transparent')}
        >
          <i className="fa-solid fa-bolt" style={{ color: 'var(--accent-highlight)' }}></i>
          <span>{dataFlowSpeed}x</span>
        </button>
      </div>
    </>
  );
};
