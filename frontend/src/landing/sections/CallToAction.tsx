import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from '../styles/landing.module.css';
import { content } from '../content/landing.content';

const handleSpotlightMove = (e: React.MouseEvent<HTMLElement>) => {
  const rect = e.currentTarget.getBoundingClientRect();
  e.currentTarget.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
  e.currentTarget.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
};

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
        borderTop: '1px solid rgba(255, 255, 255, 0.07)',
        paddingTop: 'clamp(112px, 11vw, 150px)',
        paddingBottom: 'clamp(96px, 11vw, 150px)',
        position: 'relative',
        backgroundColor: '#050506'
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '48px', flexWrap: 'wrap', gap: '12px' }}>
        <span className="technical-meta">{content.cta.label}</span>
        <span className="technical-badge technical-badge-ice">ZERO SETUP REQUIRED</span>
      </div>

      <div className={styles.grid}>
        <div style={{ gridColumn: '1 / -1', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '32px' }}>
          <h2
            id="cta-heading"
            style={{
              fontFamily: "'Inter Tight', sans-serif",
              fontSize: 'clamp(36px, 6vw, 88px)',
              lineHeight: 0.94,
              letterSpacing: '-0.04em',
              color: '#F4F4F6',
              textTransform: 'uppercase',
              margin: 0,
              fontWeight: 700,
              maxWidth: '920px'
            }}
          >
            {content.cta.headline}
          </h2>

          <p
            style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: 'clamp(15px, 1.4vw, 19px)',
              lineHeight: 1.6,
              color: '#9499A6',
              maxWidth: '640px',
              margin: 0
            }}
          >
            {content.cta.subheadline}
          </p>

          {/* Editorial Command Omnibar */}
          <form
            onSubmit={handleLaunch}
            className="spotlight-card"
            onMouseMove={handleSpotlightMove}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '8px 10px 8px 16px',
              backgroundColor: 'rgba(14, 15, 18, 0.72)',
              backdropFilter: 'blur(20px) saturate(140%)',
              WebkitBackdropFilter: 'blur(20px) saturate(140%)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              width: '100%',
              maxWidth: '580px',
              boxShadow: 'inset 0 1px 0 0 rgba(255, 255, 255, 0.08), 0 24px 64px rgba(0, 0, 0, 0.65)'
            }}
          >
            <i className="fa-brands fa-github" style={{ fontSize: '1.15rem', color: '#9499A6' }} />
            <input
              type="text"
              value={repoInput}
              onChange={(e) => setRepoInput(e.target.value)}
              placeholder="github.com/mohammad43268/Code-atlas"
              aria-label="GitHub repository URL"
              style={{
                flex: 1,
                minWidth: 0,
                background: 'transparent',
                border: 'none',
                outline: 'none',
                color: '#F4F4F6',
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: '12.5px',
                padding: '8px 4px'
              }}
            />
            <button
              type="submit"
              className="platinum-cta"
              style={{
                padding: '10px 22px',
                borderRadius: '2px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                whiteSpace: 'nowrap',
                cursor: 'pointer'
              }}
            >
              <span>LAUNCH 3D</span>
              <i className="fa-solid fa-arrow-right" style={{ fontSize: '10px' }} />
            </button>
          </form>

          {/* Action Links */}
          <div style={{ display: 'flex', gap: '28px', flexWrap: 'wrap', justifyContent: 'center' }}>
            {content.cta.links.map((link, i) => (
              <Link
                key={i}
                to={link.to}
                style={{
                  fontSize: '11px',
                  fontFamily: "'JetBrains Mono', monospace",
                  textTransform: 'uppercase',
                  letterSpacing: '0.12em',
                  textDecoration: 'none',
                  color: link.isPrimary ? '#F8FAFC' : '#646A77',
                  borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
                  paddingBottom: '3px',
                  whiteSpace: 'nowrap',
                  transition: 'color 0.2s ease, border-color 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = '#38BDF8';
                  e.currentTarget.style.borderBottomColor = '#38BDF8';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = link.isPrimary ? '#F8FAFC' : '#646A77';
                  e.currentTarget.style.borderBottomColor = 'rgba(255, 255, 255, 0.2)';
                }}
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
