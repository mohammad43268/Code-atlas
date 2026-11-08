import React, { useState } from 'react';
import { useOrchestrator } from '../../context/useOrchestrator';

export const NodeInspector: React.FC = () => {
  const { selectedNode, setSelectedNode, setPinnedContextNode, pinnedContextNode, focusNode } = useOrchestrator();
  const [copied, setCopied] = useState(false);

  if (!selectedNode) return null;

  const isPinned = pinnedContextNode?.id === selectedNode.id;

  const handleCopyPath = async () => {
    try {
      await navigator.clipboard.writeText(selectedNode.path);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // ignore
    }
  };

  return (
    <div
      className="glass-hud"
      style={{
        position: 'absolute',
        top: '76px',
        right: '16px',
        zIndex: 45,
        width: '280px',
        borderLeft: `3px solid ${selectedNode.color}`,
        borderRadius: '12px',
        padding: '14px',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        animation: 'fadeInUp 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
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
              fontSize: '0.82rem',
              flexShrink: 0
            }}
          >
            <i className={`fa-solid ${selectedNode.type === 'folder' ? 'fa-folder' : 'fa-file-code'}`} />
          </div>
          <div style={{ overflow: 'hidden' }}>
            <h4
              style={{
                fontSize: '0.86rem',
                fontWeight: 600,
                color: 'var(--text-primary)',
                margin: 0,
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }}
              title={selectedNode.name}
            >
              {selectedNode.name}
            </h4>
            <span
              style={{
                fontSize: '0.66rem',
                fontFamily: "'JetBrains Mono', monospace",
                color: 'var(--text-muted)',
                textTransform: 'uppercase',
                letterSpacing: '0.04em'
              }}
            >
              {selectedNode.type} {selectedNode.extension ? `• .${selectedNode.extension}` : ''}
            </span>
          </div>
        </div>

        <button
          onClick={() => setSelectedNode(null)}
          title="Close Inspector"
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--text-muted)',
            cursor: 'pointer',
            padding: '2px',
            fontSize: '0.85rem'
          }}
        >
          <i className="fa-solid fa-xmark" />
        </button>
      </div>

      {/* Path bar with copy button */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'rgba(255, 255, 255, 0.04)',
          borderRadius: '6px',
          padding: '6px 8px',
          fontSize: '0.72rem',
          fontFamily: "'JetBrains Mono', monospace",
          color: 'var(--text-secondary)',
          border: '1px solid rgba(255, 255, 255, 0.06)'
        }}
      >
        <span
          style={{
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            paddingRight: '6px'
          }}
          title={selectedNode.path}
        >
          {selectedNode.path}
        </span>
        <button
          type="button"
          onClick={handleCopyPath}
          title="Copy file path"
          style={{
            background: 'none',
            border: 'none',
            color: copied ? 'var(--accent-highlight)' : 'var(--text-muted)',
            cursor: 'pointer',
            fontSize: '0.72rem',
            padding: '2px 4px',
            flexShrink: 0
          }}
        >
          <i className={`fa-solid ${copied ? 'fa-check' : 'fa-copy'}`} />
        </button>
      </div>

      {/* Stats row */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          fontSize: '0.72rem',
          fontFamily: "'JetBrains Mono', monospace",
          color: 'var(--text-muted)',
          padding: '0 2px'
        }}
      >
        <span>TREE DEPTH: <strong style={{ color: 'var(--text-primary)' }}>{selectedNode.depth}</strong></span>
        {selectedNode.lineCount && (
          <span>SIZE: <strong style={{ color: 'var(--text-primary)' }}>~{selectedNode.lineCount}L</strong></span>
        )}
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', gap: '6px', marginTop: '2px' }}>
        <button
          onClick={() => focusNode(selectedNode.id)}
          style={{
            flex: 1,
            background: 'rgba(255, 255, 255, 0.06)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            color: 'var(--text-primary)',
            borderRadius: '8px',
            padding: '7px 10px',
            fontSize: '0.72rem',
            fontWeight: 500,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '5px',
            transition: 'all 0.15s ease'
          }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.12)')}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.06)')}
        >
          <i className="fa-solid fa-crosshairs" />
          <span>Fly To</span>
        </button>

        <button
          onClick={() => setPinnedContextNode(isPinned ? null : selectedNode)}
          style={{
            flex: 1.2,
            background: isPinned ? 'var(--accent-highlight)' : 'rgba(255, 255, 255, 0.9)',
            color: '#080808',
            border: 'none',
            borderRadius: '8px',
            padding: '7px 10px',
            fontSize: '0.72rem',
            fontWeight: 700,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '5px',
            transition: 'all 0.15s ease'
          }}
        >
          <i className={`fa-solid ${isPinned ? 'fa-check' : 'fa-thumbtack'}`} />
          <span>{isPinned ? 'Pinned' : 'Pin to AI'}</span>
        </button>
      </div>
    </div>
  );
};
