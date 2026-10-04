import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';

const links = [
  { name: 'Home', path: '/' },
  { name: 'Documentation', path: '/docs' },
  { name: 'Projects', path: '/projects' },
  { name: 'About', path: '/about' }
];

export const Navbar: React.FC = () => {
  const location = useLocation();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 720);
  const [menuOpen, setMenuOpen] = useState(false);
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0, opacity: 0 });
  const navRef = useRef<HTMLElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 720);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (!isMobile && navRef.current) {
      // Need a tiny timeout to ensure fonts and DOM are laid out
      setTimeout(() => {
        const activeLink = navRef.current?.querySelector('.nav-link.active') as HTMLElement;
        if (activeLink) {
          // Adjust underline to match text width, ignoring padding roughly, or just use offsetWidth
          setIndicatorStyle({
            left: activeLink.offsetLeft + 24, // 24 is side padding
            width: activeLink.offsetWidth - 48,
            opacity: 1
          });
        }
      }, 50);
    }
  }, [location.pathname, isMobile]);

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden';
      const handleEscape = (e: KeyboardEvent) => {
        if (e.key === 'Escape') setMenuOpen(false);
      };
      document.addEventListener('keydown', handleEscape);
      
      // Trap focus
      const focusableEls = overlayRef.current?.querySelectorAll('a, button');
      if (focusableEls && focusableEls.length > 0) {
        const first = focusableEls[0] as HTMLElement;
        const last = focusableEls[focusableEls.length - 1] as HTMLElement;
        
        const handleTab = (e: KeyboardEvent) => {
          if (e.key === 'Tab') {
            if (e.shiftKey) {
              if (document.activeElement === first) {
                e.preventDefault();
                last.focus();
              }
            } else {
              if (document.activeElement === last) {
                e.preventDefault();
                first.focus();
              }
            }
          }
        };
        document.addEventListener('keydown', handleTab);
        first.focus();
        
        return () => {
          document.removeEventListener('keydown', handleEscape);
          document.removeEventListener('keydown', handleTab);
        }
      }
    } else {
      document.body.style.overflow = '';
    }
  }, [menuOpen]);

  const closeMenu = () => setMenuOpen(false);

  return (
    <>
      <div style={{
        position: 'fixed',
        top: '20px',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 9999,
        display: 'flex',
        justifyContent: 'center',
        width: '100%',
        pointerEvents: 'none'
      }}>
        <nav 
          ref={navRef}
          style={{
            pointerEvents: 'auto',
            background: 'transparent',
            display: 'flex',
            position: 'relative',
            gap: '24px',
            padding: '12px 32px',
          }}
        >
          {isMobile ? (
            <button
              onClick={() => setMenuOpen(true)}
              style={{
                background: 'transparent',
                border: 'none',
                padding: '8px 24px',
                color: 'var(--ink)',
                fontSize: '16px',
                fontWeight: 400,
                textTransform: 'uppercase',
                letterSpacing: '0.12em',
                cursor: 'pointer',
                outline: 'none',
                fontFamily: 'inherit'
              }}
            >
              Menu
            </button>
          ) : (
            <>
              <div 
                style={{
                  position: 'absolute',
                  bottom: '10px',
                  left: indicatorStyle.left,
                  width: indicatorStyle.width,
                  height: '2px',
                  backgroundColor: 'var(--ink)',
                  opacity: indicatorStyle.opacity,
                  transition: 'all 300ms cubic-bezier(0.22, 1, 0.36, 1)',
                  zIndex: 0
                }}
              />
              {links.map((link) => {
                const isActive = location.pathname === link.path;
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    aria-current={isActive ? 'page' : undefined}
                    style={{
                      position: 'relative',
                      zIndex: 1,
                      padding: '10px 24px',
                      textDecoration: 'none',
                      color: 'var(--ink)',
                      fontSize: '16px',
                      fontWeight: 400,
                      textTransform: 'uppercase',
                      letterSpacing: '0.12em',
                      transition: 'color 300ms cubic-bezier(0.22, 1, 0.36, 1)',
                      outline: 'none',
                    }}
                    className={`nav-link ${isActive ? 'active' : ''}`}
                  >
                    {link.name}
                  </Link>
                );
              })}
            </>
          )}
        </nav>
      </div>

      {isMobile && menuOpen && (
        <div 
          ref={overlayRef}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'var(--bg)',
            zIndex: 10000,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '24px'
          }}
        >
          <button 
            onClick={closeMenu}
            style={{
              position: 'absolute',
              top: '24px',
              right: '24px',
              background: 'transparent',
              border: 'none',
              fontSize: '14px',
              fontWeight: 500,
              textTransform: 'uppercase',
              letterSpacing: '0.04em',
              color: 'var(--ink)',
              cursor: 'pointer',
              padding: '8px'
            }}
          >
            Close
          </button>
          
          <nav style={{ display: 'flex', flexDirection: 'column', gap: '32px', textAlign: 'center' }}>
            {links.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={closeMenu}
                aria-current={location.pathname === link.path ? 'page' : undefined}
                style={{
                  fontSize: '32px',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em',
                  color: 'var(--ink)',
                  textDecoration: 'none'
                }}
              >
                {link.name}
              </Link>
            ))}
          </nav>
        </div>
      )}
      
      <style>{`
        .nav-link:focus-visible {
          border-radius: 999px;
          outline: 2px solid var(--ink);
          outline-offset: -2px;
        }
      `}</style>
    </>
  );
};
