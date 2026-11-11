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
      gsap.utils.toArray('.anim-step-row').forEach((row: any) => {
        gsap.fromTo(
          row,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.85,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: row,
              start: 'top 82%',
              once: true
            }
          }
        );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className={styles.section}
      aria-labelledby="how-it-works-heading"
      style={{ borderTop: '1px solid var(--border-subtle)', position: 'relative' }}
    >
      {/* Section Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '64px' }}>
        <span className="technical-meta">[02 // EXECUTION PROTOCOL]</span>
        <span className="technical-badge technical-badge-cyan">3-STAGE PIPELINE</span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '64px' }}>
        {content.howItWorks.map((item, i) => (
          <div
            key={item.step}
            className="anim-step-row"
            style={{
              paddingBottom: '48px',
              borderBottom: i < content.howItWorks.length - 1 ? '1px solid var(--border-subtle)' : 'none'
            }}
          >
            <div className={styles.grid} style={{ alignItems: 'center' }}>
              {/* Step Index & Tag */}
              <div style={{ gridColumn: '1 / 3' }}>
                <span
                  style={{
                    fontFamily: 'Comvota, sans-serif',
                    fontSize: 'clamp(36px, 4vw, 56px)',
                    color: 'var(--accent-highlight)',
                    lineHeight: 1,
                    display: 'block',
                    marginBottom: '8px'
                  }}
                >
                  {item.step}
                </span>
                <span className="technical-badge">{item.tag}</span>
              </div>

              {/* Step Title & Technical Copy */}
              <div style={{ gridColumn: '3 / 8' }}>
                <h3
                  style={{
                    fontFamily: 'Comvota, sans-serif',
                    fontSize: 'clamp(24px, 2.6vw, 42px)',
                    lineHeight: 1.05,
                    color: 'var(--ink)',
                    textTransform: 'uppercase',
                    margin: '0 0 16px 0',
                    fontWeight: 300
                  }}
                >
                  {item.title}
                </h3>
                <p
                  style={{
                    fontFamily: 'Inter, sans-serif',
                    fontSize: 'clamp(14px, 1.2vw, 17px)',
                    lineHeight: 1.6,
                    color: 'var(--text-secondary)',
                    maxWidth: '520px',
                    margin: 0
                  }}
                >
                  {item.desc}
                </p>
              </div>

              {/* Step Visual Blueprint Card */}
              <div style={{ gridColumn: '8 / -1', display: 'flex', justifyContent: 'flex-end' }}>
                <div
                  className="tactile-panel"
                  style={{
                    width: '100%',
                    maxWidth: '440px',
                    padding: '12px',
                    backgroundColor: 'rgba(8, 10, 14, 0.9)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '10px'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span className="technical-meta" style={{ color: 'var(--accent-highlight)' }}>
                      STEP_{item.step} // BLUEPRINT
                    </span>
                    <span className="technical-meta">STATUS: VERIFIED</span>
                  </div>

                  <div
                    style={{
                      width: '100%',
                      aspectRatio: '16/10',
                      overflow: 'hidden',
                      border: '1px solid rgba(255, 255, 255, 0.08)',
                      position: 'relative'
                    }}
                  >
                    <img
                      src={item.img}
                      alt={item.title}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        filter: 'grayscale(100%) contrast(1.15)',
                        opacity: 0.85,
                        transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)'
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.04)')}
                      onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                    />
                    <div
                      style={{
                        position: 'absolute',
                        inset: 0,
                        border: '1px solid rgba(0, 255, 204, 0.15)',
                        pointerEvents: 'none'
                      }}
                    />
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '4px' }}>
                    <span className="technical-meta" style={{ fontSize: '9px' }}>
                      TELEMETRY_PIPELINE: ACTIVE
                    </span>
                    <span className="technical-meta" style={{ fontSize: '9px', color: 'var(--accent-highlight)' }}>
                      GROUNDED 100%
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
