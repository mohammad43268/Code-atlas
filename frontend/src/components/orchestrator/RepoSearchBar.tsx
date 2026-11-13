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
        position: 'relative',
        width: '380px',
        display: 'flex',
        alignItems: 'center'
      }}
    >
      <form
        onSubmit={handleSubmit}
        style={{
          width: '100%',
          height: '30px',
          background: '#0B0C10',
          border: isExpanded ? '1px solid #6366F1' : '1px solid #262A36',
          borderRadius: '6px',
          padding: '0 4px 0 10px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          transition: 'border-color 0.18s ease'
        }}
      >
        <i
          className="fa-brands fa-github"
          style={{ color: '#64748B', fontSize: '12px', flexShrink: 0 }}
        />
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onFocus={() => setIsExpanded(true)}
          placeholder="Scan GitHub repo (owner/repo)..."
          disabled={isLoading}
          style={{
            flex: 1,
            background: 'transparent',
            border: 'none',
            outline: 'none',
            color: '#F8FAFC',
            fontSize: '12px',
            fontFamily: "'JetBrains Mono', monospace"
          }}
        />

        <button
          type="submit"
          disabled={isLoading || !inputValue.trim()}
          style={{
            height: '22px',
            padding: '0 8px',
            background: inputValue.trim() ? '#4F46E5' : '#252936',
            color: '#F8FAFC',
            border: 'none',
            borderRadius: '4px',
            fontSize: '11px',
            fontWeight: 500,
            cursor: isLoading || !inputValue.trim() ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            transition: 'background-color 0.18s ease'
          }}
          onMouseEnter={(e) => {
            if (inputValue.trim()) e.currentTarget.style.background = '#6366F1';
          }}
          onMouseLeave={(e) => {
            if (inputValue.trim()) e.currentTarget.style.background = '#4F46E5';
          }}
        >
          {isLoading ? (
            <i className="fa-solid fa-circle-notch fa-spin" style={{ fontSize: '10px' }} />
          ) : (
            <>
              <span>Load</span>
              <i className="fa-solid fa-arrow-right" style={{ fontSize: '9px' }} />
            </>
          )}
        </button>
      </form>

      {/* Preset Quick Repositories Flyout */}
      {isExpanded && (
        <div
          style={{
            position: 'absolute',
            top: 'calc(100% + 6px)',
            left: 0,
            width: '100%',
            background: '#161922',
            border: '1px solid #282E3D',
            borderRadius: '8px',
            padding: '8px',
            boxShadow: '0 16px 36px rgba(0, 0, 0, 0.65)',
            zIndex: 100,
            display: 'flex',
            flexDirection: 'column',
            gap: '4px'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '2px 4px 6px' }}>
            <span
              style={{
                fontSize: '10px',
                fontFamily: "'JetBrains Mono', monospace",
                textTransform: 'uppercase',
                color: '#64748B',
                letterSpacing: '0.08em'
              }}
            >
              Featured Repositories
            </span>
            <button
              type="button"
              onClick={() => setIsExpanded(false)}
              style={{
                background: 'none',
                border: 'none',
                fontSize: '10px',
                color: '#64748B',
                cursor: 'pointer',
                fontFamily: "'JetBrains Mono', monospace"
              }}
            >
              ESC
            </button>
          </div>

          {PRESETS.map((p) => (
            <button
              key={p.name}
              type="button"
              onClick={() => handleSelectPreset(p.name)}
              disabled={isLoading}
              style={{
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid rgba(255, 255, 255, 0.06)',
                color: '#94A3B8',
                borderRadius: '6px',
                padding: '6px 10px',
                fontSize: '11px',
                fontFamily: "'JetBrains Mono', monospace",
                cursor: 'pointer',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                transition: 'all 0.15s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#6366F1';
                e.currentTarget.style.color = '#F8FAFC';
                e.currentTarget.style.background = '#212634';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.06)';
                e.currentTarget.style.color = '#94A3B8';
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)';
              }}
            >
              <span>{p.name}</span>
              <span
                style={{
                  fontSize: '9px',
                  padding: '1px 5px',
                  borderRadius: '3px',
                  background: 'rgba(99, 102, 241, 0.15)',
                  border: '1px solid rgba(99, 102, 241, 0.3)',
                  color: '#818CF8'
                }}
              >
                {p.tag}
              </span>
            </button>
          ))}
        </div>
      )}

      {/* Realtime Status Notification */}
      {isLoading && (
        <div
          style={{
            position: 'absolute',
            top: 'calc(100% + 6px)',
            left: 0,
            width: '100%',
            padding: '6px 10px',
            borderRadius: '6px',
            background: '#161922',
            border: '1px solid #6366F1',
            color: '#818CF8',
            fontSize: '11px',
            fontFamily: "'JetBrains Mono', monospace",
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            zIndex: 99
          }}
        >
          <i className="fa-solid fa-circle-notch fa-spin" style={{ fontSize: '11px' }} />
          <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {statusMessage}
          </span>
        </div>
      )}
    </div>
  );
};
