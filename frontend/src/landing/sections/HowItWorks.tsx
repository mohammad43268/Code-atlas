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
          { opacity: 0, y: 28 },
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

  const handleCardMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
    e.currentTarget.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
  };

  return (
    <section
      ref={sectionRef}
      className={styles.section}
      aria-labelledby="how-it-works-heading"
      style={{ borderTop: '1px solid rgba(255, 255, 255, 0.07)', position: 'relative' }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '56px' }}>
        <span id="how-it-works-heading" className="technical-meta">[02 // EXECUTION PROTOCOL]</span>
        <span className="technical-badge technical-badge-ice" style={{ borderRadius: '9999px' }}>
          3-STAGE PIPELINE
        </span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '56px' }}>
        {content.howItWorks.map((item, i) => (
          <div
            key={item.step}
            className="anim-step-row"
            style={{
              paddingBottom: '48px',
              borderBottom: i < content.howItWorks.length - 1 ? '1px solid rgba(255, 255, 255, 0.07)' : 'none'
            }}
          >
            <div className={styles.grid} style={{ alignItems: 'center' }}>
              <div style={{ gridColumn: '1 / 3' }}>
                <span
                  style={{
                    fontFamily: "'Inter Tight', sans-serif",
                    fontSize: 'clamp(36px, 4vw, 52px)',
                    fontWeight: 800,
                    letterSpacing: '-0.04em',
                    color: '#F4F4F6',
                    lineHeight: 1,
                    display: 'block',
                    marginBottom: '10px'
                  }}
                >
                  {item.step}
                </span>
                <span className="technical-badge">{item.tag}</span>
              </div>

              <div style={{ gridColumn: '3 / 8' }}>
                <h3
                  style={{
                    fontFamily: "'Inter Tight', sans-serif",
                    fontSize: 'clamp(22px, 2.4vw, 36px)',
                    lineHeight: 1.08,
                    color: '#F4F4F6',
                    textTransform: 'uppercase',
                    letterSpacing: '-0.03em',
                    margin: '0 0 14px 0',
                    fontWeight: 700
                  }}
                >
                  {item.title}
                </h3>
                <p
                  style={{
                    fontFamily: 'Inter, sans-serif',
                    fontSize: 'clamp(14px, 1.15vw, 16px)',
                    lineHeight: 1.6,
                    color: '#9499A6',
                    maxWidth: '520px',
                    margin: 0
                  }}
                >
                  {item.desc}
                </p>
              </div>

              <div style={{ gridColumn: '8 / -1', display: 'flex', justifyContent: 'flex-end' }}>
                <div
                  className="spotlight-card"
                  onMouseMove={handleCardMouseMove}
                  style={{
                    width: '100%',
                    maxWidth: '440px',
                    padding: '12px',
                    borderRadius: '10px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '10px'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span className="technical-meta" style={{ color: '#38BDF8' }}>
                      STEP_{item.step} // BLUEPRINT
                    </span>
                    <span className="technical-meta" style={{ color: '#10B981' }}>
                      VERIFIED
                    </span>
                  </div>

                  <div
                    style={{
                      width: '100%',
                      aspectRatio: '16/10',
                      overflow: 'hidden',
                      borderRadius: '6px',
                      border: '1px solid rgba(255, 255, 255, 0.07)'
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
                        transition: 'transform 0.45s cubic-bezier(0.16, 1, 0.3, 1)'
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.04)')}
                      onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                    />
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '2px' }}>
                    <span className="technical-meta" style={{ fontSize: '9px' }}>
                      TELEMETRY_PIPELINE: ACTIVE
                    </span>
                    <span className="technical-meta" style={{ fontSize: '9px', color: '#818CF8' }}>
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
