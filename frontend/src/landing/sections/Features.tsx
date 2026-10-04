import React from 'react';
import styles from '../styles/landing.module.css';
import { content } from '../content/landing.content';

export const Features: React.FC = () => {
  return (
    <section className={styles.section} aria-labelledby="features-heading">
      <div className={styles.label} id="features-heading">(02) Features</div>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '120px', marginTop: '64px' }}>
        {content.features.map((feature, i) => {
          const isReversed = i % 2 !== 0;
          return (
            <div key={i} className={styles.grid} style={{ alignItems: 'center' }}>
              <div style={{ 
                gridColumn: isReversed ? '7 / -1' : '1 / 6', 
                gridRow: 1 
              }}>
                <div className={styles.statusLabel}>{feature.status}</div>
                <h3 className={styles.bodyText} style={{ fontSize: 'clamp(28px, 3vw, 48px)', marginBottom: '1rem' }}>
                  {feature.title}
                </h3>
                <p className={styles.bodyText} style={{ color: 'var(--muted)' }}>
                  {feature.desc}
                </p>
              </div>
              <div style={{ 
                gridColumn: isReversed ? '1 / 6' : '7 / -1',
                gridRow: 1 
              }}>
                <div className={styles.featureFrame} />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
