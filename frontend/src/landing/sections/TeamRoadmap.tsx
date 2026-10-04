import React from 'react';
import styles from '../styles/landing.module.css';
import { content } from '../content/landing.content';

export const TeamRoadmap: React.FC = () => {
  return (
    <section className={styles.section} aria-labelledby="team-roadmap-heading">
      <div className={styles.label} id="team-roadmap-heading">(04) Team & Roadmap</div>
      
      <div className={styles.grid} style={{ marginTop: '64px', gap: '64px' }}>
        <div style={{ gridColumn: '1 / 6' }}>
          <h3 className={styles.bodyText} style={{ marginBottom: '32px', color: 'var(--muted)', fontSize: '13px', letterSpacing: '0.1em' }}>TEAM</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {content.team.map((member, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(0,0,0,0.1)', paddingBottom: '16px' }}>
                <span className={styles.bodyText}>{member.name}</span>
                <span className={styles.bodyText} style={{ color: 'var(--muted)' }}>{member.role}</span>
              </div>
            ))}
          </div>
        </div>
        
        <div style={{ gridColumn: '7 / -1' }}>
          <h3 className={styles.bodyText} style={{ marginBottom: '32px', color: 'var(--muted)', fontSize: '13px', letterSpacing: '0.1em' }}>ROADMAP</h3>
          
          <div style={{ position: 'relative', height: '60px', marginTop: '64px' }}>
            <div className={styles.hairline} style={{ position: 'absolute', top: '50%', width: '100%', opacity: 1, backgroundColor: 'var(--ink)' }} />
            
            <div style={{ 
              position: 'absolute', 
              top: '50%', 
              left: '50%', 
              transform: 'translate(-50%, -50%)',
              width: '8px', 
              height: '8px', 
              borderRadius: '50%', 
              backgroundColor: 'var(--ink)' 
            }} />
            
            <span style={{ position: 'absolute', top: '0', left: '0', fontSize: '11px', letterSpacing: '0.1em' }}>SEP 2026</span>
            <span style={{ position: 'absolute', top: '0', right: '0', fontSize: '11px', letterSpacing: '0.1em' }}>APR 2027</span>
          </div>
        </div>
      </div>
    </section>
  );
};
