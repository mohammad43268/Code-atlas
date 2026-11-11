import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';

const navLinks = [
  { name: 'Home', path: '/', index: '01' },
  { name: 'Documentation', path: '/docs', index: '02' },
  { name: 'Projects', path: '/projects', index: '03' },
  { name: 'About', path: '/about', index: '04' }
];

export const Navbar: React.FC = () => {
  const location = useLocation();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 860);
  const [menuOpen, setMenuOpen] = useState(false);
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 860);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden';
      const handleEscape = (e: KeyboardEvent) => {
        if (e.key === 'Escape') setMenuOpen(false);
      };
      document.addEventListener('keydown', handleEscape);
      return () => {
        document.body.style.overflow = '';
        document.removeEventListener('keydown', handleEscape);
      };
    } else {
      document.body.style.overflow = '';
    }
  }, [menuOpen]);

  if (location.pathname === '/scene') {
    return null;
  }

  return (
    <>
      <header
        style={{
          position: 'fixed',
          top: '16px',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 9999,
          display: 'flex',
          justifyContent: 'center',
          width: 'calc(100% - 32px)',
          maxWidth: '1280px',
          pointerEvents: 'none'
        }}
      >
        <nav
          className="tactile-panel"
          style={{
            pointerEvents: 'auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%',
            padding: '8px 16px',
            backgroundColor: 'rgba(6, 8, 12, 0.88)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            boxShadow: '0 12px 32px rgba(0, 0, 0, 0.6)'
          }}
        >
          {/* Brand & Telemetry Badge */}
          <Link
            to="/"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              textDecoration: 'none',
              color: 'var(--ink)'
            }}
          >
            <div
              style={{
                width: '7px',
                height: '7px',
                backgroundColor: 'var(--accent-highlight)',
                borderRadius: '0%',
                animation: 'cyanPulse 2.4s infinite ease-in-out'
              }}
            />
            <span
              style={{
                fontFamily: 'Comvota, sans-serif',
                fontSize: '1.15rem',
                letterSpacing: '0.06em',
                lineHeight: 1
              }}
            >
              CODEATLAS
            </span>
            <span
              className="technical-badge technical-badge-cyan"
              style={{ display: isMobile ? 'none' : 'inline-flex' }}
            >
              v1.0 // CARTOGRAPHY
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          {!isMobile && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              {navLinks.map((link) => {
                const isActive = location.pathname === link.path;
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '6px 14px',
                      textDecoration: 'none',
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: '11px',
                      letterSpacing: '0.12em',
                      textTransform: 'uppercase',
                      color: isActive ? 'var(--accent-highlight)' : 'var(--text-muted)',
                      backgroundColor: isActive ? 'rgba(0, 255, 204, 0.08)' : 'transparent',
                      border: isActive ? '1px solid rgba(0, 255, 204, 0.25)' : '1px solid transparent',
                      transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)'
                    }}
                    onMouseEnter={(e) => {
                      if (!isActive) {
                        e.currentTarget.style.color = 'var(--ink)';
                        e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.15)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isActive) {
                        e.currentTarget.style.color = 'var(--text-muted)';
                        e.currentTarget.style.borderColor = 'transparent';
                      }
                    }}
                  >
                    <span style={{ opacity: 0.5 }}>{link.index}</span>
                    <span>{link.name}</span>
                  </Link>
                );
              })}
            </div>
          )}

          {/* Right Action: Launch 3D Space */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Link
              to="/scene"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '6px 14px',
                backgroundColor: 'var(--accent-highlight)',
                color: '#050608',
                border: 'none',
                fontFamily: "'JetBrains Mono', monospace",
                fontWeight: 700,
                fontSize: '11px',
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                textDecoration: 'none',
                cursor: 'pointer',
                transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-1px)';
                e.currentTarget.style.boxShadow = '0 0 16px rgba(0, 255, 204, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <span>ENTER 3D</span>
              <i className="fa-solid fa-arrow-right" style={{ fontSize: '10px' }} />
            </Link>

            {isMobile && (
              <button
                type="button"
                onClick={() => setMenuOpen(true)}
                aria-label="Open navigation menu"
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid var(--border-subtle)',
                  padding: '6px 12px',
                  color: 'var(--ink)',
                  fontSize: '11px',
                  fontFamily: "'JetBrains Mono', monospace",
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  cursor: 'pointer'
                }}
              >
                MENU
              </button>
            )}
          </div>
        </nav>
      </header>

      {/* Mobile Drawer Overlay */}
      {menuOpen && (
        <div
          ref={overlayRef}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 10000,
            backgroundColor: 'rgba(5, 6, 8, 0.96)',
            backdropFilter: 'blur(24px)',
            display: 'flex',
            flexDirection: 'column',
            padding: '24px',
            animation: 'fadeInUp 0.25s cubic-bezier(0.16, 1, 0.3, 1)'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '16px' }}>
            <span style={{ fontFamily: 'Comvota, sans-serif', fontSize: '1.4rem' }}>CODEATLAS</span>
            <button
              onClick={() => setMenuOpen(false)}
              style={{
                background: 'none',
                border: '1px solid var(--border-subtle)',
                color: 'var(--ink)',
                padding: '6px 12px',
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: '11px',
                cursor: 'pointer'
              }}
            >
              [ESC // CLOSE]
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginTop: '48px' }}>
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMenuOpen(false)}
                style={{
                  display: 'flex',
                  alignItems: 'baseline',
                  gap: '12px',
                  textDecoration: 'none',
                  color: location.pathname === link.path ? 'var(--accent-highlight)' : 'var(--ink)',
                  fontFamily: 'Comvota, sans-serif',
                  fontSize: '2rem',
                  letterSpacing: '0.04em'
                }}
              >
                <span style={{ fontSize: '12px', fontFamily: "'JetBrains Mono', monospace", color: 'var(--muted)' }}>
                  {link.index}
                </span>
                <span>{link.name}</span>
              </Link>
            ))}
          </div>

          <div style={{ marginTop: 'auto', borderTop: '1px solid var(--border-subtle)', paddingTop: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span className="technical-meta">STATUS // ACTIVE_NODE</span>
            <Link
              to="/scene"
              onClick={() => setMenuOpen(false)}
              style={{
                padding: '10px 20px',
                backgroundColor: 'var(--accent-highlight)',
                color: '#050608',
                fontFamily: "'JetBrains Mono', monospace",
                fontWeight: 700,
                fontSize: '12px',
                textDecoration: 'none'
              }}
            >
              LAUNCH 3D ENGINE →
            </Link>
          </div>
        </div>
      )}
    </>
  );
};
