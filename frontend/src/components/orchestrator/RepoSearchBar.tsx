import React, { useState } from 'react';
import { useOrchestrator } from '../../context/useOrchestrator';

const PRESETS = [
  'mohammad43268/Code-atlas',
  'facebook/react',
  'shadcn-ui/ui',
  'expressjs/express'
];

export const RepoSearchBar: React.FC = () => {
  const { loadRepo, isLoading, statusMessage } = useOrchestrator();
  const [inputValue, setInputValue] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;
    const ok = await loadRepo(inputValue.trim());
    if (ok) {
      setInputValue('');
      setIsExpanded(false);
    }
  };

  const handleSelectPreset = async (preset: string) => {
    if (isLoading) return;
    await loadRepo(preset);
    setIsExpanded(false);
  };

  return (
    <div
      style={{
        position: 'absolute',
        top: '24px',
        left: '120px',
        zIndex: 50,
        display: 'flex',
        flexDirection: 'column',
        gap: '6px'
      }}
    >
      <form
        onSubmit={handleSubmit}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          background: 'rgba(18, 18, 18, 0.85)',
          backdropFilter: 'blur(16px)',
          border: '1px solid var(--border-subtle)',
          borderRadius: '24px',
          padding: '4px 8px 4px 14px',
          boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
          transition: 'all 0.25s ease'
        }}
      >
        <i className="fa-brands fa-github" style={{ color: 'var(--accent-highlight)', fontSize: '0.95rem' }}></i>
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onFocus={() => setIsExpanded(true)}
          placeholder="GitHub repo (e.g. facebook/react)..."
          disabled={isLoading}
          style={{
            background: 'transparent',
            border: 'none',
            outline: 'none',
            color: 'var(--text-primary)',
            fontSize: '0.82rem',
            fontFamily: 'Inter, sans-serif',
            width: isExpanded ? '280px' : '200px',
            transition: 'width 0.25s ease'
          }}
        />

        <button
          type="submit"
          disabled={isLoading || !inputValue.trim()}
          style={{
            background: 'var(--ink)',
            color: 'var(--bg-solid)',
            border: 'none',
            borderRadius: '16px',
            padding: '4px 12px',
            fontSize: '0.75rem',
            fontWeight: 600,
            cursor: isLoading || !inputValue.trim() ? 'not-allowed' : 'pointer',
            opacity: isLoading || !inputValue.trim() ? 0.4 : 1,
            transition: 'opacity 0.2s ease',
            display: 'flex',
            alignItems: 'center',
            gap: '4px'
          }}
        >
          {isLoading ? (
            <i className="fa-solid fa-spinner fa-spin" style={{ fontSize: '0.75rem' }}></i>
          ) : (
            <>
              <span>Load</span>
              <i className="fa-solid fa-arrow-right" style={{ fontSize: '0.65rem' }}></i>
            </>
          )}
        </button>
      </form>

      {/* Preset repository chips */}
      {isExpanded && (
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '6px',
            padding: '8px 12px',
            background: 'rgba(12, 12, 12, 0.95)',
            backdropFilter: 'blur(16px)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '14px',
            maxWidth: '340px',
            boxShadow: '0 10px 30px rgba(0,0,0,0.6)',
            animation: 'fadeInUp 0.2s ease-out'
          }}
        >
          <span style={{ width: '100%', fontSize: '0.68rem', textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '0.08em' }}>
            Quick Repositories
          </span>
          {PRESETS.map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => handleSelectPreset(p)}
              disabled={isLoading}
              style={{
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.1)',
                color: 'var(--text-secondary)',
                borderRadius: '8px',
                padding: '3px 8px',
                fontSize: '0.72rem',
                fontFamily: 'monospace',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'var(--accent-highlight)';
                e.currentTarget.style.color = 'var(--accent-highlight)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)';
                e.currentTarget.style.color = 'var(--text-secondary)';
              }}
            >
              {p}
            </button>
          ))}
          <div style={{ width: '100%', display: 'flex', justifyContent: 'flex-end', marginTop: '2px' }}>
            <span
              onClick={() => setIsExpanded(false)}
              style={{ fontSize: '0.68rem', color: 'var(--text-muted)', cursor: 'pointer', textDecoration: 'underline' }}
            >
              close
            </span>
          </div>
        </div>
      )}

      {/* Status toast if loading */}
      {isLoading && (
        <div
          style={{
            padding: '4px 10px',
            borderRadius: '6px',
            background: 'rgba(0, 255, 204, 0.12)',
            border: '1px solid var(--accent-highlight)',
            color: 'var(--accent-highlight)',
            fontSize: '0.72rem',
            fontFamily: 'monospace',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px'
          }}
        >
          <i className="fa-solid fa-circle-notch fa-spin"></i>
          <span>{statusMessage}</span>
        </div>
      )}
    </div>
  );
};
