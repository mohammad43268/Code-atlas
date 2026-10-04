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
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 75%',
          once: true
        }
      });

      const boxes = gsap.utils.toArray('.anim-svg-box');
      const lines = gsap.utils.toArray<SVGLineElement>('.anim-svg-line');
      
      lines.forEach(line => {
        const length = line.getTotalLength ? line.getTotalLength() : 1000;
        line.style.strokeDasharray = `${length}`;
        line.style.strokeDashoffset = `${length}`;
      });

      tl.fromTo(boxes,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, stagger: 0.05, duration: 0.8, ease: 'power3.out' }
      )
      .to(lines,
        { strokeDashoffset: 0, duration: 1.5, ease: 'power2.inOut', stagger: 0.02 },
        "-=0.6"
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className={styles.section} aria-labelledby="under-hood-heading">
      <div className={styles.label} id="under-hood-heading">(03) Under The Hood</div>
      
      <div className={styles.grid} style={{ marginTop: '64px' }}>
        <div style={{ gridColumn: '1 / -1', marginBottom: '80px' }}>
          <h3 className={styles.displayHeadline} style={{ fontSize: 'clamp(32px, 4vw, 56px)', maxWidth: '800px', marginBottom: '24px' }}>
            {content.underTheHood.line}
          </h3>
          <p className={styles.bodyText} style={{ color: 'var(--muted)', maxWidth: '600px' }}>
            We've designed a highly modular, decoupled architecture that can scale infinitely. Here is a high-level view of how data flows through the system.
          </p>
        </div>
        
        <div style={{ gridColumn: '1 / -1' }} aria-hidden="true">
          <svg viewBox="0 0 1200 800" style={{ width: '100%', height: 'auto', overflow: 'visible' }}>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="var(--muted)" strokeWidth="0.5" strokeOpacity="0.2" />
            </pattern>
            <rect width="100%" height="100%" fill="url(#grid)" />

            <g stroke="var(--ink)" strokeWidth="1.5" fill="none">
              {/* TIER 1: CLIENTS / GATEWAY */}
              <g className="anim-svg-box">
                <rect x="400" y="40" width="400" height="80" rx="4" fill="var(--bg)" stroke="var(--ink)" />
                <text x="600" y="86" textAnchor="middle" fill="var(--ink)" stroke="none" fontSize="16" fontFamily="inherit" letterSpacing="0.1em" fontWeight="bold">
                  API GATEWAY
                </text>
              </g>

              {/* TIER 1 to TIER 2 BUS */}
              <line className="anim-svg-line" x1="600" y1="120" x2="600" y2="180" />
              <line className="anim-svg-line" x1="150" y1="180" x2="1050" y2="180" />
              
              {[150, 375, 600, 825, 1050].map((x, i) => (
                <line className="anim-svg-line" key={`bus1-${i}`} x1={x} y1="180" x2={x} y2="240" />
              ))}

              {/* TIER 2: 5 INDEPENDENT SERVICES */}
              {content.underTheHood.services.map((svc, i) => (
                <g className="anim-svg-box" key={`box-${i}`} transform={`translate(${i * 225 + 50}, 240)`}>
                  <rect x="0" y="0" width="200" height="100" rx="4" fill="var(--surface)" stroke="none" />
                  <rect x="0" y="0" width="200" height="100" rx="4" fill="none" stroke="var(--ink)" />
                  <text x="100" y="46" textAnchor="middle" fill="var(--ink)" stroke="none" fontSize="12" fontFamily="inherit" letterSpacing="0.1em" fontWeight="bold">
                    {svc}
                  </text>
                  {/* Mock details for "we fill detail later" */}
                  <line x1="20" y1="70" x2="180" y2="70" stroke="var(--muted)" strokeWidth="4" strokeOpacity="0.5" />
                  <line x1="20" y1="82" x2="140" y2="82" stroke="var(--muted)" strokeWidth="4" strokeOpacity="0.5" />
                </g>
              ))}

              {/* TIER 2 to TIER 3 BUS */}
              {[150, 375, 600, 825, 1050].map((x, i) => (
                <line className="anim-svg-line" key={`bus2-${i}`} x1={x} y1="340" x2={x} y2="400" />
              ))}
              <line className="anim-svg-line" x1="150" y1="400" x2="1050" y2="400" />
              <line className="anim-svg-line" x1="600" y1="400" x2="600" y2="460" />

              {/* TIER 3: SHARED GRAPH CONTRACT */}
              <g className="anim-svg-box">
                <rect x="100" y="460" width="1000" height="80" rx="4" fill="var(--bg)" />
                <text x="600" y="504" textAnchor="middle" fill="var(--ink)" stroke="none" fontSize="14" fontFamily="inherit" letterSpacing="0.15em" fontWeight="bold">
                  {content.underTheHood.bottomLabel}
                </text>
              </g>

              {/* TIER 3 to TIER 4 BUS */}
              <line className="anim-svg-line" x1="600" y1="540" x2="600" y2="600" />
              <line className="anim-svg-line" x1="300" y1="600" x2="900" y2="600" />
              
              <line className="anim-svg-line" x1="300" y1="600" x2="300" y2="640" />
              <line className="anim-svg-line" x1="900" y1="600" x2="900" y2="640" />

              {/* TIER 4: STORAGE & CACHING */}
              <g className="anim-svg-box">
                {/* DB Cylinder */}
                <ellipse cx="300" cy="655" rx="140" ry="20" fill="var(--bg)" stroke="var(--ink)" />
                <path d="M 160 655 L 160 720 A 140 20 0 0 0 440 720 L 440 655" fill="var(--bg)" stroke="var(--ink)" />
                <text x="300" y="700" textAnchor="middle" fill="var(--ink)" stroke="none" fontSize="14" fontFamily="inherit" letterSpacing="0.1em" fontWeight="bold">
                  VECTOR STORAGE
                </text>
              </g>

              <g className="anim-svg-box">
                {/* Cache Queue */}
                <rect x="760" y="640" width="280" height="80" rx="8" fill="var(--bg)" stroke="var(--ink)" />
                <line x1="830" y1="640" x2="830" y2="720" stroke="var(--ink)" />
                <line x1="900" y1="640" x2="900" y2="720" stroke="var(--ink)" />
                <text x="970" y="685" textAnchor="middle" fill="var(--ink)" stroke="none" fontSize="14" fontFamily="inherit" letterSpacing="0.1em" fontWeight="bold">
                  CACHE
                </text>
              </g>
            </g>
          </svg>
        </div>
      </div>
    </section>
  );
};
