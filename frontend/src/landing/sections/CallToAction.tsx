import React from 'react';
import { Link } from 'react-router-dom';
import styles from '../styles/landing.module.css';
import { content } from '../content/landing.content';

export const CallToAction: React.FC = () => {
  return (
    <section className={styles.section} aria-labelledby="cta-heading" style={{ paddingTop: '100px', paddingBottom: '100px' }}>
      <div className={styles.grid}>
        <div style={{ gridColumn: '1 / -1', textAlign: 'center' }}>
          <h2 id="cta-heading" className={styles.displayHeadline} style={{ fontSize: 'clamp(32px, 5vw, 80px)', marginBottom: '64px' }}>
            {content.cta.headline}
          </h2>
          <div style={{ display: 'flex', gap: '32px', justifyContent: 'center' }}>
            {content.cta.links.map((link, i) => (
              <Link 
                key={i}
                to={link.to} 
                style={{
                  fontSize: '14px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.12em',
                  textDecoration: 'none',
                  color: 'var(--ink)',
                  borderBottom: '1px solid var(--ink)',
                  paddingBottom: '4px'
                }}
              >
                {link.text}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
