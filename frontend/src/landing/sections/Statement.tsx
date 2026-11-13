import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import styles from '../styles/landing.module.css';
import { content } from '../content/landing.content';

export const Statement: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const words = content.statement.headline.split(' ');

  useEffect(() => {
    if (!sectionRef.current) return;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.manifesto-word',
        { y: '100%', opacity: 0 },
        {
          y: '0%',
          opacity: 1,
          stagger: 0.03,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 75%',
            once: true
          }
        }
      );

      gsap.fromTo(
        '.manifesto-card',
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 70%',
            once: true
          }
        }
      );
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
      aria-labelledby="statement-heading"
      style={{ borderTop: '1px solid rgba(255, 255, 255, 0.07)', position: 'relative' }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '48px' }}>
        <span className="technical-meta">{content.statement.label}</span>
        <span className="technical-badge technical-badge-ice" style={{ borderRadius: '9999px' }}>
          PARADIGM SHIFT // SPATIAL
        </span>
      </div>

      <div className={styles.grid} style={{ alignItems: 'flex-start' }}>
        <div style={{ gridColumn: '1 / 8' }}>
          <h2
            id="statement-heading"
            style={{
              fontFamily: "'Inter Tight', sans-serif",
              fontSize: 'clamp(36px, 5.2vw, 76px)',
              color: '#F4F4F6',
              lineHeight: 0.96,
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '-0.04em',
              margin: '0 0 28px 0'
            }}
          >
            {words.map((word, i) => (
              <span key={i} style={{ display: 'inline-block', overflow: 'hidden', marginRight: '0.22em' }}>
                <span className="manifesto-word" style={{ display: 'inline-block', willChange: 'transform, opacity' }}>
                  {word}
                </span>
              </span>
            ))}
          </h2>

          <p
            style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: 'clamp(15px, 1.35vw, 19px)',
              lineHeight: 1.6,
              color: '#9499A6',
              maxWidth: '620px',
              margin: '0 0 32px 0'
            }}
          >
            {content.statement.support}
          </p>

          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <span className="technical-badge">[AST // TREE-SITTER]</span>
            <span className="technical-badge">[TOPOLOGY // FORCE-DIRECTED]</span>
            <span className="technical-badge">[GROUNDING // BI-DIRECTIONAL]</span>
          </div>
        </div>

        <div style={{ gridColumn: '8 / -1' }} className="manifesto-card">
          <div
            className="spotlight-card"
            onMouseMove={handleCardMouseMove}
            style={{
              padding: '16px',
              borderRadius: '10px',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span className="technical-meta" style={{ color: '#38BDF8' }}>
                TOPOLOGY_SPEC // STUDY_01
              </span>
              <span className="technical-meta">DEPTH: 8 LVLS</span>
            </div>

            <div
              style={{
                width: '100%',
                aspectRatio: '16/10',
                overflow: 'hidden',
                borderRadius: '6px',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                position: 'relative'
              }}
            >
              <img
                src="/Study _).jpg"
                alt="Architecture Study"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  filter: 'grayscale(100%) contrast(1.15)',
                  opacity: 0.85
                }}
              />
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '8px',
                paddingTop: '8px',
                borderTop: '1px solid rgba(255, 255, 255, 0.07)'
              }}
            >
              <div>
                <span className="technical-meta" style={{ fontSize: '9px', display: 'block' }}>SCALE</span>
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '11px', color: '#F4F4F6' }}>
                  60K+ NODES
                </span>
              </div>
              <div>
                <span className="technical-meta" style={{ fontSize: '9px', display: 'block' }}>REFRESH</span>
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '11px', color: '#38BDF8' }}>
                  144 FPS
                </span>
              </div>
              <div>
                <span className="technical-meta" style={{ fontSize: '9px', display: 'block' }}>DRIFT</span>
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '11px', color: '#F4F4F6' }}>
                  0.00%
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
