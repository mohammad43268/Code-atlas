import React from 'react';
import styles from '../styles/landing.module.css';
import { content } from '../content/landing.content';

export const Statement: React.FC = () => {
  return (
    <section className={styles.section} aria-labelledby="statement-heading">
      <div className={styles.grid}>
        <div style={{ gridColumn: '1 / -1' }}>
          <h2 id="statement-heading" className={styles.displayHeadline} style={{ marginBottom: '2rem' }}>
            {content.statement.headline}
          </h2>
          <p className={styles.bodyText} style={{ maxWidth: '600px' }}>
            {content.statement.support}
          </p>
        </div>
      </div>
    </section>
  );
};
