import React from 'react';
import { Link } from 'react-router-dom';
import styles from '../styles/landing.module.css';
import { content } from '../content/landing.content';
import { useFitText } from '../hooks/useFitText';

export const Footer: React.FC = () => {
  const { containerRef, textRef } = useFitText('CODEATLAS');

  return (
    <footer id="footer" className={styles.section} style={{ paddingBottom: '32px' }}>
      <div className={styles.grid} style={{ marginBottom: '64px' }}>
        <div style={{ gridColumn: '1 / 6' }}>
          <a href={content.footer.repoLink} style={{ color: 'var(--text-primary)', textDecoration: 'none', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
            GitHub Repository ↗
          </a>
        </div>
        <div style={{ gridColumn: '7 / -1', display: 'flex', gap: '32px', justifyContent: 'flex-end' }}>
          {['/', '/docs', '/projects', '/about'].map((path, i) => (
            <Link key={i} to={path} style={{ color: 'var(--text-primary)', textDecoration: 'none', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
              {path === '/' ? 'Home' : path.replace('/', '')}
            </Link>
          ))}
        </div>
      </div>
      
      <div ref={containerRef} style={{ width: '100%', display: 'flex', justifyContent: 'center', borderTop: '1px solid var(--border-subtle)', paddingTop: '32px' }}>
        <h2 ref={textRef} className={styles.footerWordmark}>
          CODEATLAS
        </h2>
      </div>
      
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '16px' }}>
        <span style={{ fontSize: '11px', color: 'var(--text-muted)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
          &copy; {content.footer.copyright}
        </span>
      </div>
    </footer>
  );
};
