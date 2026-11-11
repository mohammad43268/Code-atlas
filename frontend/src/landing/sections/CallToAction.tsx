import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from '../styles/landing.module.css';
import { content } from '../content/landing.content';

export const CallToAction: React.FC = () => {
  const [repoInput, setRepoInput] = useState('');
  const navigate = useNavigate();

  const handleLaunch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/scene');
  };

  return (
    <section
      className={styles.section}
      aria-labelledby="cta-heading"
      style={{
        borderTop: '1px solid var(--border-subtle)',
        paddingTop: 'clamp(80px, 10vw, 140px)',
        paddingBottom: 'clamp(80px, 10vw, 140px)',
        position: 'relative'
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '48px' }}>
        <span className="technical-meta">{content.cta.label}</span>
        <span className="technical-badge technical-badge-cyan">ZERO SETUP REQUIRED</span>
      </div>

      <div className={styles.grid}>
        <div style={{ gridColumn: '1 / -1', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '32px' }}>
          <h2
            id="cta-heading"
            style={{
              fontFamily: 'Comvota, sans-serif',
              fontSize: 'clamp(36px, 6vw, 92px)',
              lineHeight: 0.95,
              color: 'var(--ink)',
              textTransform: 'uppercase',
              margin: 0,
              fontWeight: 300,
              maxWidth: '900px'
            }}
          >
            {content.cta.headline}
          </h2>

          <p
            style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: 'clamp(16px, 1.4vw, 20px)',
              lineHeight: 1.6,
              color: 'var(--text-secondary)',
              maxWidth: '640px',
              margin: 0
            }}
          >
            {content.cta.subheadline}
          </p>

          {/* Tactile Command Omnibar */}
          <form
            onSubmit={handleLaunch}
            className="tactile-panel"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '8px 12px',
              backgroundColor: 'rgba(8, 10, 14, 0.95)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              width: '100%',
              maxWidth: '560px',
              boxShadow: '0 16px 48px rgba(0, 0, 0, 0.6)'
            }}
          >
            <i className="fa-brands fa-github" style={{ fontSize: '1.2rem', color: 'var(--accent-highlight)', marginLeft: '8px' }} />
            <input
              type="text"
              value={repoInput}
              onChange={(e) => setRepoInput(e.target.value)}
              placeholder="github.com/mohammad43268/Code-atlas..."
              style={{
                flex: 1,
                background: 'transparent',
                border: 'none',
                outline: 'none',
                color: 'var(--ink)',
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: '13px',
                padding: '8px 4px'
              }}
            />
            <button
              type="submit"
              style={{
                padding: '10px 22px',
                backgroundColor: 'var(--accent-highlight)',
                color: '#050608',
                border: 'none',
                fontFamily: "'JetBrains Mono', monospace",
                fontWeight: 700,
                fontSize: '11px',
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                whiteSpace: 'nowrap',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => (e.currentTarget.style.boxShadow = '0 0 20px rgba(0, 255, 204, 0.5)')}
              onMouseLeave={(e) => (e.currentTarget.style.boxShadow = 'none')}
            >
              <span>LAUNCH 3D</span>
              <i className="fa-solid fa-arrow-right" style={{ fontSize: '10px' }} />
            </button>
          </form>

          {/* Action Links */}
          <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap', justifyContent: 'center' }}>
            {content.cta.links.map((link, i) => (
              <Link
                key={i}
                to={link.to}
                style={{
                  fontSize: '12px',
                  fontFamily: "'JetBrains Mono', monospace",
                  textTransform: 'uppercase',
                  letterSpacing: '0.12em',
                  textDecoration: 'none',
                  color: link.isPrimary ? 'var(--accent-highlight)' : 'var(--text-muted)',
                  borderBottom: '1px solid currentColor',
                  paddingBottom: '2px',
                  transition: 'color 0.2s ease'
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--ink)')}
                onMouseLeave={(e) => (e.currentTarget.style.color = link.isPrimary ? 'var(--accent-highlight)' : 'var(--text-muted)')}
              >
                {link.text} ↗
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
