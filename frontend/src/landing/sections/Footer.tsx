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
        borderTop: '1px solid rgba(255, 255, 255, 0.07)',
        paddingTop: '72px',
        paddingBottom: '36px',
        backgroundColor: '#050506',
        position: 'relative'
      }}
    >
      <div className={styles.grid} style={{ marginBottom: '64px', gap: '24px' }}>
        {/* Left Column: Coordinates & Status */}
        <div style={{ gridColumn: '1 / 6', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span className="emerald-dot" />
            <span className="technical-meta" style={{ color: '#10B981' }}>
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
                color: '#9499A6',
                textDecoration: 'none',
                fontSize: '11px',
                fontFamily: "'JetBrains Mono', monospace",
                textTransform: 'uppercase',
                letterSpacing: '0.12em',
                whiteSpace: 'nowrap',
                transition: 'color 0.2s ease'
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = '#F4F4F6')}
              onMouseLeave={(e) => (e.currentTarget.style.color = '#9499A6')}
            >
              {link.name}
            </Link>
          ))}
          <a
            href={content.footer.repoLink}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: '#F8FAFC',
              textDecoration: 'none',
              fontSize: '11px',
              fontFamily: "'JetBrains Mono', monospace",
              textTransform: 'uppercase',
              letterSpacing: '0.12em',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              whiteSpace: 'nowrap',
              transition: 'color 0.2s ease'
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = '#38BDF8')}
            onMouseLeave={(e) => (e.currentTarget.style.color = '#F8FAFC')}
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
          borderTop: '1px solid rgba(255, 255, 255, 0.07)',
          paddingTop: '36px'
        }}
      >
        <h2
          ref={textRef}
          style={{
            margin: 0,
            padding: 0,
            fontFamily: "'Inter Tight', sans-serif",
            fontWeight: 800,
            lineHeight: 0.82,
            background: 'linear-gradient(180deg, #FFFFFF 0%, #A1A1AA 65%, rgba(255, 255, 255, 0.14) 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            textTransform: 'uppercase',
            whiteSpace: 'nowrap',
            letterSpacing: '-0.05em',
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
          marginTop: '28px',
          paddingTop: '16px',
          borderTop: '1px solid rgba(255, 255, 255, 0.05)',
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
