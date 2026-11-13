import React, { useState } from 'react';
import { useOrchestrator } from '../../context/useOrchestrator';

export const NodeInspector: React.FC = () => {
  const { selectedNode, setSelectedNode, setPinnedContextNode, pinnedContextNode, focusNode } = useOrchestrator();
  const [copied, setCopied] = useState(false);

  if (!selectedNode) return null;

  const isPinned = pinnedContextNode?.id === selectedNode.id;

  const handleCopyPath = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(selectedNode.path);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // ignore
    }
  };

  const isFolder = selectedNode.type === 'folder';
  const cleanPath = isFolder ? `${selectedNode.path.replace(/\/+$/, '')}/` : selectedNode.path;

  return (
    <div
      style={{
        position: 'absolute',
        top: '12px',
        left: '12px',
        zIndex: 45,
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        background: '#161922',
        border: '1px solid #282E3D',
        borderRadius: '8px',
        padding: '6px 12px',
        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.45)',
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: '11px',
        color: '#E2E8F0',
        animation: 'fadeIn 0.18s ease-out'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
        <i
          className={`fa-solid ${isFolder ? 'fa-folder' : 'fa-file-code'}`}
          style={{ color: '#38BDF8', fontSize: '12px' }}
        />
        <span
          style={{
            fontWeight: 600,
            color: '#F8FAFC',
            maxWidth: '180px',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap'
          }}
          title={cleanPath}
        >
          {cleanPath}
        </span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#64748B', fontSize: '10px' }}>
        <span>d:{selectedNode.depth}</span>
        {selectedNode.lineCount && <span>· ~{selectedNode.lineCount}L</span>}
      </div>

      <div style={{ width: '1px', height: '14px', backgroundColor: '#262A36' }} />

      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
        <button
          type="button"
          onClick={() => focusNode(selectedNode.id)}
          title="Fly to node in 3D"
          style={{
            background: '#1F2430',
            border: '1px solid #2D3444',
            color: '#94A3B8',
            borderRadius: '5px',
            padding: '3px 7px',
            fontSize: '10px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            transition: 'all 0.15s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = '#F8FAFC';
            e.currentTarget.style.borderColor = '#6366F1';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = '#94A3B8';
            e.currentTarget.style.borderColor = '#2D3444';
          }}
        >
          <i className="fa-solid fa-crosshairs" style={{ fontSize: '9px' }} />
          <span>Fly</span>
        </button>

        <button
          type="button"
          onClick={() => setPinnedContextNode(isPinned ? null : selectedNode)}
          title={isPinned ? 'Unpin context' : 'Pin to AI prompt context'}
          style={{
            background: isPinned ? 'rgba(16, 185, 129, 0.15)' : '#1F2430',
            border: isPinned ? '1px solid #10B981' : '1px solid #2D3444',
            color: isPinned ? '#34D399' : '#94A3B8',
            borderRadius: '5px',
            padding: '3px 7px',
            fontSize: '10px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            transition: 'all 0.15s ease'
          }}
          onMouseEnter={(e) => {
            if (!isPinned) {
              e.currentTarget.style.color = '#F8FAFC';
              e.currentTarget.style.borderColor = '#6366F1';
            }
          }}
          onMouseLeave={(e) => {
            if (!isPinned) {
              e.currentTarget.style.color = '#94A3B8';
              e.currentTarget.style.borderColor = '#2D3444';
            }
          }}
        >
          <i className={`fa-solid ${isPinned ? 'fa-check' : 'fa-thumbtack'}`} style={{ fontSize: '9px' }} />
          <span>{isPinned ? 'Pinned' : 'Pin'}</span>
        </button>

        <button
          type="button"
          onClick={handleCopyPath}
          title="Copy path"
          style={{
            background: 'transparent',
            border: 'none',
            color: copied ? '#34D399' : '#64748B',
            cursor: 'pointer',
            padding: '3px 5px',
            fontSize: '11px'
          }}
        >
          <i className={`fa-solid ${copied ? 'fa-check' : 'fa-copy'}`} />
        </button>

        <button
          type="button"
          onClick={() => setSelectedNode(null)}
          title="Deselect"
          style={{
            background: 'transparent',
            border: 'none',
            color: '#64748B',
            cursor: 'pointer',
            padding: '3px 5px',
            fontSize: '11px',
            marginLeft: '2px'
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = '#F87171')}
          onMouseLeave={(e) => (e.currentTarget.style.color = '#64748B')}
        >
          <i className="fa-solid fa-xmark" />
        </button>
      </div>
    </div>
  );
};
