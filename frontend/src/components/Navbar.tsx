import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';

const navLinks = [
  { name: 'Home', path: '/', index: '01' },
  { name: 'Documentation', path: '/docs', index: '02' },
  { name: 'Projects', path: '/projects', index: '03' },
  { name: 'About', path: '/about', index: '04' }
];

const MagneticItem: React.FC<{ children: React.ReactNode; strength?: number }> = ({
  children,
  strength = 0.25
}) => {
  const ref = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = (e.clientX - (rect.left + rect.width / 2)) * strength;
    const y = (e.clientY - (rect.top + rect.height / 2)) * strength;
    ref.current.style.transform = `translate3d(${x}px, ${y}px, 0)`;
  };

  const handleMouseLeave = () => {
    if (!ref.current) return;
    ref.current.style.transform = 'translate3d(0px, 0px, 0)';
  };

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        display: 'inline-flex',
        transition: 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
      }}
    >
      {children}
    </div>
  );
};

export const Navbar: React.FC = () => {
  const location = useLocation();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 860);
  const [menuOpen, setMenuOpen] = useState(false);

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
          top: '18px',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 9999,
          display: 'flex',
          justifyContent: 'center',
          width: 'calc(100% - 32px)',
          maxWidth: '1180px',
          pointerEvents: 'none'
        }}
      >
        <nav
          aria-label="Primary Navigation"
          style={{
            pointerEvents: 'auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%',
            height: '56px',
            padding: '0 10px 0 22px',
            borderRadius: '9999px',
            background: 'rgba(10, 11, 14, 0.72)',
            backdropFilter: 'blur(24px) saturate(140%)',
            WebkitBackdropFilter: 'blur(24px) saturate(140%)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            boxShadow: '0 16px 40px rgba(0, 0, 0, 0.55), inset 0 1px 0 0 rgba(255, 255, 255, 0.08)'
          }}
        >
          {/* Brand & Crisp Emerald Online Pulse */}
          <Link
            to="/"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              textDecoration: 'none',
              color: '#F4F4F6'
            }}
          >
            <span className="emerald-dot" />
            <span
              style={{
                fontFamily: "'Inter Tight', sans-serif",
                fontWeight: 800,
                fontSize: '0.95rem',
                letterSpacing: '-0.02em',
                lineHeight: 1
              }}
            >
              CODEATLAS
            </span>
            <span
              className="technical-badge"
              style={{
                display: isMobile ? 'none' : 'inline-flex',
                borderRadius: '9999px',
                fontSize: '10px',
                color: '#9499A6',
                borderColor: 'rgba(255, 255, 255, 0.08)'
              }}
            >
              V1.0 // SPATIAL
            </span>
          </Link>

          {/* Desktop Navigation Links with Magnetic Hover */}
          {!isMobile && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              {navLinks.map((link) => {
                const isActive = location.pathname === link.path;
                return (
                  <MagneticItem key={link.path} strength={0.2}>
                    <Link
                      to={link.path}
                      aria-current={isActive ? 'page' : undefined}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '7px 14px',
                        borderRadius: '9999px',
                        textDecoration: 'none',
                        fontFamily: "'JetBrains Mono', monospace",
                        fontSize: '11px',
                        letterSpacing: '0.1em',
                        textTransform: 'uppercase',
                        color: isActive ? '#F4F4F6' : '#646A77',
                        backgroundColor: isActive ? 'rgba(255, 255, 255, 0.07)' : 'transparent',
                        border: isActive
                          ? '1px solid rgba(255, 255, 255, 0.16)'
                          : '1px solid transparent',
                        transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                        whiteSpace: 'nowrap'
                      }}
                      onMouseEnter={(e) => {
                        if (!isActive) {
                          e.currentTarget.style.color = '#F4F4F6';
                          e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.04)';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!isActive) {
                          e.currentTarget.style.color = '#646A77';
                          e.currentTarget.style.backgroundColor = 'transparent';
                        }
                      }}
                    >
                      <span style={{ opacity: 0.55 }}>{link.index}</span>
                      <span>{link.name}</span>
                    </Link>
                  </MagneticItem>
                );
              })}
            </div>
          )}

          {/* Liquid Platinum Primary CTA */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <MagneticItem strength={0.22}>
              <Link
                to="/scene"
                className="platinum-cta"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  height: '38px',
                  padding: '0 18px',
                  borderRadius: '9999px'
                }}
              >
                <span>ENTER 3D</span>
                <i className="fa-solid fa-arrow-right" style={{ fontSize: '10px' }} />
              </Link>
            </MagneticItem>

            {isMobile && (
              <button
                type="button"
                onClick={() => setMenuOpen(true)}
                aria-label="Open navigation menu"
                style={{
                  background: 'rgba(255, 255, 255, 0.06)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '9999px',
                  height: '38px',
                  padding: '0 14px',
                  color: '#F4F4F6',
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
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 10000,
            backgroundColor: 'rgba(5, 5, 6, 0.96)',
            backdropFilter: 'blur(24px)',
            display: 'flex',
            flexDirection: 'column',
            padding: '24px',
            animation: 'fadeInUp 0.25s cubic-bezier(0.16, 1, 0.3, 1)'
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              borderBottom: '1px solid rgba(255, 255, 255, 0.07)',
              paddingBottom: '16px'
            }}
          >
            <span style={{ fontFamily: "'Inter Tight', sans-serif", fontWeight: 800, fontSize: '1.25rem', color: '#F4F4F6' }}>
              CODEATLAS
            </span>
            <button
              onClick={() => setMenuOpen(false)}
              style={{
                background: 'none',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                borderRadius: '9999px',
                color: '#F4F4F6',
                padding: '6px 14px',
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
                  color: location.pathname === link.path ? '#38BDF8' : '#F4F4F6',
                  fontFamily: "'Inter Tight', sans-serif",
                  fontWeight: 700,
                  fontSize: '2rem',
                  letterSpacing: '-0.03em'
                }}
              >
                <span style={{ fontSize: '12px', fontFamily: "'JetBrains Mono', monospace", color: '#646A77' }}>
                  {link.index}
                </span>
                <span>{link.name}</span>
              </Link>
            ))}
          </div>

          <div
            style={{
              marginTop: 'auto',
              borderTop: '1px solid rgba(255, 255, 255, 0.07)',
              paddingTop: '16px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
          >
            <span className="technical-meta">STATUS // OPERATIONAL</span>
            <Link
              to="/scene"
              onClick={() => setMenuOpen(false)}
              className="platinum-cta"
              style={{ padding: '10px 20px', borderRadius: '9999px' }}
            >
              ENTER 3D →
            </Link>
          </div>
        </div>
      )}
    </>
  );
};
