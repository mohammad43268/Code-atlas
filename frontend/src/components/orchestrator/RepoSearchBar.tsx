import React, { useState, useRef, useEffect } from 'react';
import { useOrchestrator } from '../../context/useOrchestrator';

const PRESETS = [
  { name: 'mohammad43268/Code-atlas', tag: 'Default' },
  { name: 'facebook/react', tag: 'Core' },
  { name: 'shadcn-ui/ui', tag: 'Design' },
  { name: 'expressjs/express', tag: 'Server' }
];

export const RepoSearchBar: React.FC = () => {
  const { loadRepo, isLoading, statusMessage } = useOrchestrator();
  const [inputValue, setInputValue] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsExpanded(false);
      }
    };
    if (isExpanded) {
      document.addEventListener('mousedown', handleOutside);
    }
    return () => document.removeEventListener('mousedown', handleOutside);
  }, [isExpanded]);

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
      ref={containerRef}
      style={{
        position: 'absolute',
        top: '16px',
        left: '110px',
        zIndex: 50,
        display: 'flex',
        flexDirection: 'column',
        gap: '6px'
      }}
    >
      <form
        onSubmit={handleSubmit}
        className="glass-hud"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          borderRadius: '24px',
          padding: '5px 8px 5px 12px',
          transition: 'all 0.25s ease'
        }}
      >
        <i
          className="fa-brands fa-github"
          style={{ color: 'var(--accent-highlight)', fontSize: '0.95rem' }}
        />
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onFocus={() => setIsExpanded(true)}
          placeholder="Scan GitHub repo (owner/repo)..."
          disabled={isLoading}
          style={{
            background: 'transparent',
            border: 'none',
            outline: 'none',
            color: 'var(--text-primary)',
            fontSize: '0.8rem',
            fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
            width: isExpanded ? '270px' : '200px',
            transition: 'width 0.25s ease'
          }}
        />

        <button
          type="submit"
          disabled={isLoading || !inputValue.trim()}
          style={{
            background: inputValue.trim() ? 'var(--accent-highlight)' : 'rgba(255,255,255,0.08)',
            color: inputValue.trim() ? '#080808' : 'var(--text-muted)',
            border: 'none',
            borderRadius: '16px',
            padding: '4px 10px',
            fontSize: '0.72rem',
            fontWeight: 600,
            cursor: isLoading || !inputValue.trim() ? 'not-allowed' : 'pointer',
            transition: 'all 0.2s ease',
            display: 'flex',
            alignItems: 'center',
            gap: '4px'
          }}
        >
          {isLoading ? (
            <i className="fa-solid fa-circle-notch fa-spin" style={{ fontSize: '0.75rem' }} />
          ) : (
            <>
              <span>Load</span>
              <i className="fa-solid fa-arrow-right" style={{ fontSize: '0.65rem' }} />
            </>
          )}
        </button>
      </form>

      {/* Preset Quick Repositories Flyout */}
      {isExpanded && (
        <div
          className="glass-hud"
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '6px',
            padding: '10px 12px',
            borderRadius: '12px',
            width: '320px',
            animation: 'fadeInUp 0.2s ease-out'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
            <span
              style={{
                fontSize: '0.66rem',
                fontFamily: "'JetBrains Mono', monospace",
                textTransform: 'uppercase',
                color: 'var(--text-muted)',
                letterSpacing: '0.08em'
              }}
            >
              Featured Repositories
            </span>
            <span
              onClick={() => setIsExpanded(false)}
              style={{
                fontSize: '0.66rem',
                color: 'var(--text-muted)',
                cursor: 'pointer',
                fontFamily: 'Inter, sans-serif'
              }}
            >
              esc
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {PRESETS.map((p) => (
              <button
                key={p.name}
                type="button"
                onClick={() => handleSelectPreset(p.name)}
                disabled={isLoading}
                style={{
                  background: 'rgba(255, 255, 255, 0.04)',
                  border: '1px solid rgba(255, 255, 255, 0.06)',
                  color: 'var(--text-secondary)',
                  borderRadius: '6px',
                  padding: '6px 10px',
                  fontSize: '0.74rem',
                  fontFamily: "'JetBrains Mono', monospace",
                  cursor: 'pointer',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  transition: 'all 0.15s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'var(--accent-highlight)';
                  e.currentTarget.style.color = 'var(--text-primary)';
                  e.currentTarget.style.background = 'rgba(0, 255, 204, 0.08)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.06)';
                  e.currentTarget.style.color = 'var(--text-secondary)';
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.04)';
                }}
              >
                <span>{p.name}</span>
                <span
                  style={{
                    fontSize: '0.65rem',
                    padding: '1px 5px',
                    borderRadius: '4px',
                    background: 'rgba(255, 255, 255, 0.08)',
                    color: 'var(--text-muted)'
                  }}
                >
                  {p.tag}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Realtime Status Notification */}
      {isLoading && (
        <div
          style={{
            padding: '5px 10px',
            borderRadius: '6px',
            background: 'rgba(0, 255, 204, 0.12)',
            border: '1px solid var(--accent-highlight)',
            color: 'var(--accent-highlight)',
            fontSize: '0.72rem',
            fontFamily: "'JetBrains Mono', monospace",
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            maxWidth: '320px',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap'
          }}
        >
          <i className="fa-solid fa-circle-notch fa-spin" />
          <span>{statusMessage}</span>
        </div>
      )}
    </div>
  );
};
