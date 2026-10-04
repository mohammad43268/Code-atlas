import React from 'react';
import styles from '../styles/landing.module.css';
import { content } from '../content/landing.content';

export const UnderTheHood: React.FC = () => {
  return (
    <section className={styles.section} aria-labelledby="under-hood-heading">
      <div className={styles.label} id="under-hood-heading">(03) Under The Hood</div>
      
      <div className={styles.grid} style={{ marginTop: '64px' }}>
        <div style={{ gridColumn: '1 / 6' }}>
          <p className={styles.bodyText}>{content.underTheHood.line}</p>
        </div>
        
        <div style={{ gridColumn: '7 / -1', paddingTop: '32px' }} aria-hidden="true">
          <svg viewBox="0 0 1000 200" style={{ width: '100%', height: 'auto', overflow: 'visible' }}>
            <g stroke="var(--ink)" strokeWidth="1" fill="none">
              {/* Connecting vertical lines */}
              {[100, 300, 500, 700, 900].map((x, i) => (
                <line key={`v1-${i}`} x1={x} y1="60" x2={x} y2="100" />
              ))}
              
              {/* Main horizontal bus */}
              <line x1="100" y1="100" x2="900" y2="100" />
              
              {/* Center vertical down to wide bar */}
              <line x1="500" y1="100" x2="500" y2="140" />
              
              {/* Service Boxes */}
              {content.underTheHood.services.map((svc, i) => (
                <g key={`box-${i}`} transform={`translate(${i * 200}, 0)`}>
                  <rect x="10" y="0" width="180" height="60" rx="4" />
                  <text x="100" y="34" textAnchor="middle" fill="var(--ink)" stroke="none" fontSize="12" fontFamily="inherit" letterSpacing="0.1em">
                    {svc}
                  </text>
                </g>
              ))}
              
              {/* Shared Graph Contract Bottom Bar */}
              <rect x="10" y="140" width="980" height="60" rx="4" />
              <text x="500" y="174" textAnchor="middle" fill="var(--ink)" stroke="none" fontSize="12" fontFamily="inherit" letterSpacing="0.1em">
                {content.underTheHood.bottomLabel}
              </text>
            </g>
          </svg>
        </div>
      </div>
    </section>
  );
};
