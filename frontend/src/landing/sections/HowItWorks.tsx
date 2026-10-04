import React from 'react';
import styles from '../styles/landing.module.css';
import { content } from '../content/landing.content';

export const HowItWorks: React.FC = () => {
  return (
    <section className={styles.section} aria-labelledby="how-it-works-heading">
      <div className={styles.label} id="how-it-works-heading">(01) How It Works</div>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', marginTop: '64px' }}>
        {content.howItWorks.map((text, i) => (
          <div key={i} style={{ width: '100%' }}>
            <div className={styles.hairline} style={{ marginBottom: '32px' }} />
            <div className={styles.grid}>
              <div style={{ gridColumn: '1 / 3' }}>
                <span className={styles.bodyText} style={{ color: 'var(--muted)' }}>
                  0{i + 1}
                </span>
              </div>
              <div style={{ gridColumn: '3 / -1' }}>
                <h3 className={styles.bodyText} style={{ fontSize: 'clamp(24px, 3vw, 40px)' }}>
                  {text}
                </h3>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
