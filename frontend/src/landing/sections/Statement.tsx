import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import styles from '../styles/landing.module.css';
import { content } from '../content/landing.content';

export const Statement: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const lines = content.statement.headline.split(', ');

  useEffect(() => {
    if (!sectionRef.current) return;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      gsap.fromTo('.headline-line', 
        { y: '100%' },
        { 
          y: '0%', 
          stagger: 0.08, 
          duration: 1, 
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%',
            once: true
          }
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className={styles.section} aria-labelledby="statement-heading">
      <div className={styles.grid}>
        <div style={{ gridColumn: '1 / -1' }}>
          <h2 id="statement-heading" className={styles.displayHeadline} style={{ marginBottom: '2rem' }}>
            {lines.map((line, i) => (
              <div key={i} style={{ overflow: 'hidden' }}>
                <span className="headline-line" style={{ display: 'block', willChange: 'transform' }}>
                  {line}{i < lines.length - 1 ? ',' : ''}
                </span>
              </div>
            ))}
          </h2>
          <p className={styles.bodyText} style={{ maxWidth: '600px' }}>
            {content.statement.support}
          </p>
        </div>
      </div>
    </section>
  );
};
