import React from 'react';
import { Link } from 'react-router-dom';
import styles from '../styles/landing.module.css';
import { content } from '../content/landing.content';
import { useFitText } from '../hooks/useFitText';

export const Footer: React.FC = () => {
  const { containerRef, textRef } = useFitText('CODEATLAS');

  return (
    <footer
      id="footer"
      className={styles.section}
      style={{
        borderTop: '1px solid var(--border-subtle)',
        paddingTop: '64px',
        paddingBottom: '32px',
        backgroundColor: '#040507',
        position: 'relative'
      }}
    >
      <div className={styles.grid} style={{ marginBottom: '64px' }}>
        {/* Left Column: Coordinates & Status */}
        <div style={{ gridColumn: '1 / 6', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span
              style={{
                width: '6px',
                height: '6px',
                backgroundColor: 'var(--accent-highlight)',
                borderRadius: '0%',
                display: 'inline-block'
              }}
            />
            <span className="technical-meta" style={{ color: 'var(--accent-highlight)' }}>
              {content.footer.status}
            </span>
          </div>
          <span className="technical-meta">ENGINE // THREE_R3F_WEBGL_INSTANCED</span>
          <span className="technical-meta">LATENCY // 18MS_DETERMINISTIC</span>
        </div>

        {/* Center / Right Column: Index Navigation Links */}
        <div
          style={{
            gridColumn: '7 / -1',
            display: 'flex',
            gap: '28px',
            justifyContent: 'flex-end',
            alignItems: 'center',
            flexWrap: 'wrap'
          }}
        >
          {content.footer.links.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              style={{
                color: 'var(--text-secondary)',
                textDecoration: 'none',
                fontSize: '11px',
                fontFamily: "'JetBrains Mono', monospace",
                textTransform: 'uppercase',
                letterSpacing: '0.12em',
                transition: 'color 0.2s ease'
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--accent-highlight)')}
              onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-secondary)')}
            >
              {link.name}
            </Link>
          ))}
          <a
            href={content.footer.repoLink}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: 'var(--accent-highlight)',
              textDecoration: 'none',
              fontSize: '11px',
              fontFamily: "'JetBrains Mono', monospace",
              textTransform: 'uppercase',
              letterSpacing: '0.12em',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            <span>GITHUB</span>
            <i className="fa-solid fa-arrow-up-right-from-square" style={{ fontSize: '9px' }} />
          </a>
        </div>
      </div>

      {/* Monumental Scaled Footer Display Wordmark */}
      <div
        ref={containerRef}
        style={{
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          paddingTop: '32px'
        }}
      >
        <h2
          ref={textRef}
          style={{
            margin: 0,
            padding: 0,
            fontFamily: 'Comvota, sans-serif',
            fontWeight: 300,
            lineHeight: 0.8,
            color: 'var(--ink)',
            textTransform: 'uppercase',
            whiteSpace: 'nowrap',
            letterSpacing: '-0.01em',
            userSelect: 'none'
          }}
        >
          CODEATLAS
        </h2>
      </div>

      {/* Colophon & Copyright */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginTop: '24px',
          paddingTop: '16px',
          borderTop: '1px solid rgba(255, 255, 255, 0.04)',
          flexWrap: 'wrap',
          gap: '8px'
        }}
      >
        <span className="technical-meta" style={{ fontSize: '10px' }}>
          &copy; {content.footer.copyright}
        </span>
        <span className="technical-meta" style={{ fontSize: '10px' }}>
          DEPLOYED ON VITE // REACT 19 // R3F v9
        </span>
      </div>
    </footer>
  );
};
