import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import styles from '../styles/landing.module.css';
import { content } from '../content/landing.content';

export const UnderTheHood: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      // Intro animation for layout
      gsap.fromTo('.anim-svg-box, .anim-svg-line', 
        { opacity: 0, y: 10 },
        { 
          opacity: 1, 
          y: 0, 
          stagger: 0.02, 
          duration: 0.8, 
          ease: 'power2.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 75%',
            once: true
          }
        }
      );

      // Data Packet Animations
      const dots = gsap.utils.toArray<SVGCircleElement>('.data-packet-dot');
      
      dots.forEach((dot, i) => {
        const targetX = 60 + i * 120;
        const distToService = Math.abs(300 - targetX);
        const horizontalTime = distToService / 300; // Speed scaling
        
        const tl = gsap.timeline({ repeat: -1, delay: i * 0.5 });
        
        tl.set(dot, { x: 300, y: 40, opacity: 0, scale: 1 })
          .to(dot, { opacity: 1, duration: 0.2 })
          // Gateway to top bus
          .to(dot, { y: 90, duration: 0.4, ease: 'none' })
          // Spread across bus
          .to(dot, { x: targetX, duration: horizontalTime || 0.1, ease: 'none' })
          // Down to service
          .to(dot, { y: 140, duration: 0.4, ease: 'none' })
          // Processing blink
          .to(dot, { scale: 2, duration: 0.15, yoyo: true, repeat: 1, ease: 'power1.inOut' })
          // Down to bottom bus
          .to(dot, { y: 190, duration: 0.4, ease: 'none' })
          // Merge to center
          .to(dot, { x: 300, duration: horizontalTime || 0.1, ease: 'none' })
          // Down to graph contract
          .to(dot, { y: 250, duration: 0.4, ease: 'none' })
          // Processing blink
          .to(dot, { scale: 2, duration: 0.15, yoyo: true, repeat: 1, ease: 'power1.inOut' })
          // Down to storage
          .to(dot, { y: 350, duration: 0.6, ease: 'none' })
          .to(dot, { opacity: 0, duration: 0.2, ease: 'none' })
          // Wait before looping
          .to({}, { duration: 1 });
      });

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className={styles.section} aria-labelledby="under-hood-heading">
      <div className={styles.label} id="under-hood-heading">(03) Under The Hood</div>
      
      <div className={styles.grid} style={{ marginTop: '64px' }}>
        <div style={{ gridColumn: '1 / 6' }}>
          <p className={styles.bodyText} style={{ marginBottom: '16px' }}>{content.underTheHood.line}</p>
          <p className={styles.bodyText} style={{ color: 'var(--muted)' }}>
            Data flows from the client into independent ingestion services, merging into a unified spatial graph in storage.
          </p>
        </div>
        
        <div style={{ gridColumn: '7 / -1', paddingTop: '16px' }} aria-hidden="true">
          <svg viewBox="0 0 600 400" style={{ width: '100%', height: 'auto', overflow: 'visible' }}>
            <g stroke="var(--ink)" strokeWidth="1" fill="none">
              
              {/* LINES */}
              <line className="anim-svg-line" x1="300" y1="60" x2="300" y2="90" />
              <line className="anim-svg-line" x1="60" y1="90" x2="540" y2="90" />
              
              {[60, 180, 300, 420, 540].map((x, i) => (
                <g key={`l1-${i}`}>
                  <line className="anim-svg-line" x1={x} y1="90" x2={x} y2="120" />
                  <line className="anim-svg-line" x1={x} y1="160" x2={x} y2="190" />
                </g>
              ))}

              <line className="anim-svg-line" x1="60" y1="190" x2="540" y2="190" />
              <line className="anim-svg-line" x1="300" y1="190" x2="300" y2="230" />
              <line className="anim-svg-line" x1="300" y1="270" x2="300" y2="310" />

              {/* BOXES */}
              <g className="anim-svg-box">
                <rect x="200" y="20" width="200" height="40" rx="4" fill="var(--bg)" stroke="var(--ink)" />
                <text x="300" y="44" textAnchor="middle" fill="var(--ink)" stroke="none" fontSize="10" fontFamily="inherit" letterSpacing="0.1em" fontWeight="bold">API GATEWAY</text>
              </g>

              {content.underTheHood.services.map((svc, i) => (
                <g className="anim-svg-box" key={`box-${i}`}>
                  <rect x={60 + i * 120 - 50} y="120" width="100" height="40" rx="4" fill="var(--surface)" stroke="var(--ink)" />
                  <text x={60 + i * 120} y="144" textAnchor="middle" fill="var(--ink)" stroke="none" fontSize="8" fontFamily="inherit" letterSpacing="0.1em" fontWeight="bold">{svc}</text>
                </g>
              ))}

              <g className="anim-svg-box">
                <rect x="50" y="230" width="500" height="40" rx="4" fill="var(--bg)" stroke="var(--ink)" />
                <text x="300" y="254" textAnchor="middle" fill="var(--ink)" stroke="none" fontSize="10" fontFamily="inherit" letterSpacing="0.15em" fontWeight="bold">{content.underTheHood.bottomLabel}</text>
              </g>

              <g className="anim-svg-box">
                <ellipse cx="300" cy="320" rx="80" ry="15" fill="var(--bg)" stroke="var(--ink)" />
                <path d="M 220 320 L 220 370 A 80 15 0 0 0 380 370 L 380 320" fill="var(--bg)" stroke="var(--ink)" />
                <text x="300" y="355" textAnchor="middle" fill="var(--ink)" stroke="none" fontSize="10" fontFamily="inherit" letterSpacing="0.1em" fontWeight="bold">VECTOR STORAGE</text>
              </g>

              {/* DATA PACKETS */}
              {[0, 1, 2, 3, 4].map(i => (
                <circle className="data-packet-dot" key={`dot-${i}`} cx="0" cy="0" r="3" fill="var(--ink)" stroke="none" />
              ))}
            </g>
          </svg>
        </div>
      </div>
    </section>
  );
};
