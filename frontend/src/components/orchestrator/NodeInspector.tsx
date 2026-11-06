import React from 'react';
import { useOrchestrator } from '../../context/useOrchestrator';

export const NodeInspector: React.FC = () => {
  const { selectedNode, setSelectedNode, setPinnedContextNode, pinnedContextNode, focusNode } = useOrchestrator();

  if (!selectedNode) return null;

  const isPinned = pinnedContextNode?.id === selectedNode.id;

  return (
    <div
      style={{
        position: 'absolute',
        top: '80px',
        right: '24px',
        zIndex: 45,
        width: '300px',
        background: 'rgba(18, 18, 18, 0.88)',
        backdropFilter: 'blur(20px)',
        border: '1px solid var(--border-subtle)',
        borderLeft: `3px solid ${selectedNode.color}`,
        borderRadius: '16px',
        padding: '16px',
        boxShadow: '0 12px 36px rgba(0,0,0,0.6)',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        animation: 'fadeInUp 0.25s ease-out',
        fontFamily: 'Inter, sans-serif'
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0 }}>
          <div
            style={{
              width: '28px',
              height: '28px',
              borderRadius: '6px',
              background: `${selectedNode.color}22`,
              color: selectedNode.color,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '0.85rem',
              flexShrink: 0
            }}
          >
            <i className={`fa-solid ${selectedNode.type === 'folder' ? 'fa-folder' : 'fa-file-code'}`}></i>
          </div>
          <div style={{ overflow: 'hidden' }}>
            <h4
              style={{
                fontSize: '0.9rem',
                fontWeight: 600,
                color: 'var(--text-primary)',
                margin: 0,
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }}
            >
              {selectedNode.name}
            </h4>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              {selectedNode.type} {selectedNode.extension ? `• .${selectedNode.extension}` : ''}
            </span>
          </div>
        </div>

        <button
          onClick={() => setSelectedNode(null)}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--text-muted)',
            cursor: 'pointer',
            padding: '2px',
            fontSize: '0.85rem'
          }}
        >
          <i className="fa-solid fa-xmark"></i>
        </button>
      </div>

      {/* Path */}
      <div
        style={{
          background: 'rgba(255,255,255,0.04)',
          borderRadius: '8px',
          padding: '8px 10px',
          fontSize: '0.75rem',
          fontFamily: 'monospace',
          color: 'var(--text-secondary)',
          wordBreak: 'break-all'
        }}
      >
        {selectedNode.path}
      </div>

      {/* Stats row */}
      {selectedNode.lineCount && (
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
          <span>Estimated Size:</span>
          <strong style={{ color: 'var(--ink)' }}>~{selectedNode.lineCount} lines</strong>
        </div>
      )}

      {/* Actions */}
      <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
        <button
          onClick={() => focusNode(selectedNode.id)}
          style={{
            flex: 1,
            background: 'rgba(255,255,255,0.08)',
            border: '1px solid var(--border-subtle)',
            color: 'var(--text-primary)',
            borderRadius: '10px',
            padding: '8px',
            fontSize: '0.75rem',
            fontWeight: 500,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.15)')}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.08)')}
        >
          <i className="fa-solid fa-crosshairs"></i>
          <span>Fly To</span>
        </button>

        <button
          onClick={() => setPinnedContextNode(isPinned ? null : selectedNode)}
          style={{
            flex: 1.2,
            background: isPinned ? 'var(--accent-highlight)' : 'var(--ink)',
            color: '#080808',
            border: 'none',
            borderRadius: '10px',
            padding: '8px',
            fontSize: '0.75rem',
            fontWeight: 700,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            transition: 'all 0.2s ease'
          }}
        >
          <i className={`fa-solid ${isPinned ? 'fa-check' : 'fa-thumbtack'}`}></i>
          <span>{isPinned ? 'Context Pinned' : 'Pin to AI Chat'}</span>
        </button>
      </div>
    </div>
  );
};
