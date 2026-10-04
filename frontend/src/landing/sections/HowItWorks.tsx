import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import styles from '../styles/landing.module.css';
import { content } from '../content/landing.content';

export const HowItWorks: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      gsap.utils.toArray('.anim-row').forEach((row: any) => {
        gsap.fromTo(row.querySelector('.anim-hairline'),
          { scaleX: 0 },
          {
            scaleX: 1,
            duration: 0.9,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: row,
              start: 'top 85%',
              once: true
            }
          }
        );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className={styles.section} aria-labelledby="how-it-works-heading">
      <div className={styles.label} id="how-it-works-heading">(01) How It Works</div>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', marginTop: '64px' }}>
        {content.howItWorks.map((item, i) => (
          <div key={i} className="anim-row" style={{ width: '100%', paddingBottom: '32px' }}>
            <div className={`${styles.hairline} anim-hairline`} style={{ marginBottom: '32px', transformOrigin: 'left', willChange: 'transform' }} />
            <div className={styles.grid}>
              <div style={{ gridColumn: '1 / 3' }}>
                <span className={styles.bodyText} style={{ color: 'var(--muted)' }}>
                  0{i + 1}
                </span>
              </div>
              <div style={{ gridColumn: '3 / 8' }}>
                <h3 className={styles.bodyText} style={{ fontSize: 'clamp(24px, 3vw, 40px)' }}>
                  {item.title}
                </h3>
              </div>
              <div style={{ gridColumn: '8 / -1', display: 'flex', justifyContent: 'flex-end' }}>
                <div style={{ 
                  width: '100%', 
                  maxWidth: '400px', 
                  aspectRatio: '16/9', 
                  overflow: 'hidden', 
                  border: '1px solid var(--muted)',
                  backgroundColor: 'var(--surface)'
                }}>
                  {item.img && (
                    <img 
                      src={item.img} 
                      alt={`Step ${i+1}`} 
                      style={{ 
                        width: '100%', 
                        height: '100%', 
                        objectFit: 'cover', 
                        filter: 'grayscale(100%)', // optional, makes it fit the theme
                        transition: 'transform 0.5s ease',
                      }} 
                      onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                      onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
