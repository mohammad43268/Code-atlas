import React from 'react';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose, onLogin }) => {
  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      backdropFilter: 'blur(10px)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000,
      padding: '1rem'
    }}>
      <div className="premium-card" style={{
        width: '100%',
        maxWidth: '400px',
        padding: '2.5rem',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        gap: '1.5rem',
        animation: 'fadeInUp 0.4s ease-out forwards'
      }}>
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          style={{ position: 'absolute', top: '1rem', right: '1.5rem', background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '1.5rem', cursor: 'pointer' }}
        >
          <i className="fa-solid fa-xmark"></i>
        </button>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
            <svg width="32" height="32" viewBox="0 0 100 100" fill="none">
              <rect x="20" y="20" width="60" height="60" stroke="white" strokeWidth="4" />
              <path d="M 50 20 L 50 80 M 20 50 L 80 50" stroke="white" strokeWidth="4" />
            </svg>
          </div>
          <h2 style={{ fontSize: '2rem', textTransform: 'uppercase', lineHeight: 1 }}>Authenticate</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '0.5rem' }}>Access your orchestration workspace</p>
        </div>

        {/* Social Logins */}
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button className="premium-button-secondary" style={{ flex: 1, padding: '0.75rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem' }}>
            <i className="fa-brands fa-github" style={{ fontSize: '1.2rem' }}></i>
            <span style={{ fontSize: '0.8rem' }}>GitHub</span>
          </button>
          <button className="premium-button-secondary" style={{ flex: 1, padding: '0.75rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem' }}>
            <i className="fa-brands fa-google" style={{ fontSize: '1.2rem' }}></i>
            <span style={{ fontSize: '0.8rem' }}>Google</span>
          </button>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', color: 'var(--text-muted)', fontSize: '0.8rem', gap: '1rem' }}>
          <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--border-subtle)' }}></div>
          <span>OR</span>
          <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--border-subtle)' }}></div>
        </div>

        {/* Form Inputs */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ position: 'relative' }}>
            <i className="fa-solid fa-envelope" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}></i>
            <input type="email" placeholder="Email Address" className="premium-input" style={{ width: '100%', paddingLeft: '2.5rem' }} />
          </div>
          <div style={{ position: 'relative' }}>
            <i className="fa-solid fa-lock" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}></i>
            <input type="password" placeholder="Password" className="premium-input" style={{ width: '100%', paddingLeft: '2.5rem' }} />
          </div>
        </div>

        <button className="premium-button-primary" onClick={onLogin} style={{ width: '100%', marginTop: '0.5rem' }}>
          INITIALIZE SESSION <i className="fa-solid fa-arrow-right" style={{ marginLeft: '0.5rem' }}></i>
        </button>
        
        <p style={{ textAlign: 'center', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          Don't have an account? <a href="#" style={{ color: 'var(--text-primary)', textDecoration: 'underline' }}>Request Access</a>
        </p>

      </div>
    </div>
  );
};
