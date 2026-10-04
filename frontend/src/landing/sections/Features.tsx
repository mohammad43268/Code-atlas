import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import styles from '../styles/landing.module.css';
import { content } from '../content/landing.content';

export const Features: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      gsap.utils.toArray('.anim-feature-row').forEach((row: any) => {
        const frame = row.querySelector('.anim-feature-frame');
        const text = row.querySelector('.anim-feature-text');
        
        gsap.fromTo(frame,
          { opacity: 0, y: 24 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: row,
              start: 'top 80%',
              once: true
            }
          }
        );
        
        gsap.fromTo(text,
          { opacity: 0, y: 24 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            delay: 0.1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: row,
              start: 'top 80%',
              once: true
            }
          }
        );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className={styles.section} aria-labelledby="features-heading">
      <div className={styles.label} id="features-heading">(02) Features</div>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '120px', marginTop: '64px' }}>
        {content.features.map((feature, i) => {
          const isReversed = i % 2 !== 0;
          return (
            <div key={i} className={`${styles.grid} anim-feature-row`} style={{ alignItems: 'center' }}>
              <div className="anim-feature-text" style={{ 
                gridColumn: isReversed ? '7 / -1' : '1 / 6', 
                gridRow: 1,
                willChange: 'transform, opacity'
              }}>
                <div className={styles.statusLabel}>{feature.status}</div>
                <h3 className={styles.bodyText} style={{ fontSize: 'clamp(28px, 3vw, 48px)', marginBottom: '1rem' }}>
                  {feature.title}
                </h3>
                <p className={styles.bodyText} style={{ color: 'var(--muted)' }}>
                  {feature.desc}
                </p>
              </div>
              <div className="anim-feature-frame" style={{ 
                gridColumn: isReversed ? '1 / 6' : '7 / -1',
                gridRow: 1,
                willChange: 'transform, opacity'
              }}>
                <div className={styles.featureFrame} style={{ overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                  {feature.img && (
                    <img 
                      src={feature.img} 
                      alt={feature.title} 
                      style={{ 
                        width: '100%', 
                        height: '100%', 
                        objectFit: 'cover', 
                        opacity: 0.9, 
                        transition: 'transform 0.5s ease',
                      }} 
                      onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                      onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                    />
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
