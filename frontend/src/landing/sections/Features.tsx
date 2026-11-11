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
      gsap.fromTo(
        '.bento-card',
        { opacity: 0, y: 35 },
        {
          opacity: 1,
          y: 0,
          stagger: 0.1,
          duration: 0.85,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 75%',
            once: true
          }
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const feat0 = content.features[0];
  const feat1 = content.features[1];
  const feat2 = content.features[2];

  return (
    <section
      ref={sectionRef}
      className={styles.section}
      aria-labelledby="features-heading"
      style={{ borderTop: '1px solid var(--border-subtle)', position: 'relative' }}
    >
      {/* Section Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '48px' }}>
        <span className="technical-meta">[03 // ARCHITECTURAL CAPABILITIES]</span>
        <span className="technical-badge technical-badge-cyan">ASYMMETRIC BENTO MATRIX</span>
      </div>

      {/* Asymmetric Bento Grid */}
      <div className={styles.grid} style={{ gap: '20px' }}>
        {/* Bento Cell 1: Main WebGL Engine (7 cols) */}
        <div
          className="bento-card tactile-panel"
          style={{
            gridColumn: '1 / 8',
            padding: '32px',
            backgroundColor: 'rgba(8, 10, 14, 0.95)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            minHeight: '440px'
          }}
        >
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <span className="technical-badge">{feat0?.tag || 'ENGINE'}</span>
              <span className="technical-badge technical-badge-cyan">{feat0?.metric || '120 FPS'}</span>
            </div>

            <h3
              style={{
                fontFamily: 'Comvota, sans-serif',
                fontSize: 'clamp(28px, 3.2vw, 48px)',
                lineHeight: 1,
                color: 'var(--ink)',
                textTransform: 'uppercase',
                margin: '0 0 16px 0',
                fontWeight: 300
              }}
            >
              {feat0?.title}
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
              {feat0?.desc}
            </p>
          </div>

          <div
            style={{
              width: '100%',
              aspectRatio: '16/8',
              overflow: 'hidden',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              marginTop: '28px',
              position: 'relative'
            }}
          >
            {feat0?.img && (
              <img
                src={feat0.img}
                alt={feat0.title}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  filter: 'grayscale(100%) contrast(1.1)',
                  opacity: 0.8
                }}
              />
            )}
            <div
              style={{
                position: 'absolute',
                bottom: '12px',
                left: '12px',
                padding: '4px 8px',
                background: 'rgba(5, 6, 8, 0.85)',
                border: '1px solid rgba(0, 255, 204, 0.3)',
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: '10px',
                color: 'var(--accent-highlight)'
              }}
            >
              SPATIAL_PIPELINE // R3F_DREI
            </div>
          </div>
        </div>

        {/* Bento Cell 2: Grounded Reasoning Copilot (5 cols) */}
        <div
          className="bento-card tactile-panel"
          style={{
            gridColumn: '8 / -1',
            padding: '32px',
            backgroundColor: 'rgba(8, 10, 14, 0.95)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            minHeight: '440px'
          }}
        >
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <span className="technical-badge">{feat1?.tag || 'REASONING'}</span>
              <span className="technical-badge technical-badge-cyan">{feat1?.metric || 'ZERO DRIFT'}</span>
            </div>

            <h3
              style={{
                fontFamily: 'Comvota, sans-serif',
                fontSize: 'clamp(24px, 2.6vw, 40px)',
                lineHeight: 1.05,
                color: 'var(--ink)',
                textTransform: 'uppercase',
                margin: '0 0 16px 0',
                fontWeight: 300
              }}
            >
              {feat1?.title}
            </h3>

            <p
              style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: 'clamp(14px, 1.2vw, 16px)',
                lineHeight: 1.6,
                color: 'var(--text-secondary)',
                margin: 0
              }}
            >
              {feat1?.desc}
            </p>
          </div>

          {/* Interactive Citation Widget Simulation */}
          <div
            style={{
              padding: '16px',
              backgroundColor: 'rgba(5, 6, 8, 0.9)',
              border: '1px solid rgba(0, 255, 204, 0.25)',
              marginTop: '24px',
              display: 'flex',
              flexDirection: 'column',
              gap: '8px'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span className="technical-meta" style={{ color: 'var(--accent-highlight)' }}>
                CITATION_INSPECTOR // ACTIVE
              </span>
              <span className="technical-meta">PIN: #NODE_384</span>
            </div>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '11px', color: 'var(--ink)' }}>
              &gt; CameraControls.ts: Fly-to target [0.0, 2.0, 9.0]
            </div>
            <div style={{ display: 'flex', gap: '6px', marginTop: '4px' }}>
              <span className="technical-badge" style={{ fontSize: '9px' }}>DAMPED: 0.8S</span>
              <span className="technical-badge" style={{ fontSize: '9px' }}>STREAM: SSE</span>
            </div>
          </div>
        </div>

        {/* Bento Cell 3: Transitive Graph Analysis (6 cols) */}
        <div
          className="bento-card tactile-panel"
          style={{
            gridColumn: '1 / 7',
            padding: '28px',
            backgroundColor: 'rgba(8, 10, 14, 0.95)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
          }}
        >
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <span className="technical-badge">{feat2?.tag || 'ANALYSIS'}</span>
              <span className="technical-badge technical-badge-cyan">{feat2?.metric || '99.8% AST'}</span>
            </div>

            <h3
              style={{
                fontFamily: 'Comvota, sans-serif',
                fontSize: 'clamp(22px, 2.2vw, 34px)',
                lineHeight: 1.1,
                color: 'var(--ink)',
                textTransform: 'uppercase',
                margin: '0 0 12px 0',
                fontWeight: 300
              }}
            >
              {feat2?.title}
            </h3>

            <p
              style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: '14px',
                lineHeight: 1.6,
                color: 'var(--text-secondary)',
                margin: 0
              }}
            >
              {feat2?.desc}
            </p>
          </div>

          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '20px' }}>
            <span className="technical-badge">CYCLIC_TEST: 0 LOOPS</span>
            <span className="technical-badge">UNREFERENCED: 0 FILES</span>
            <span className="technical-badge">COUPLING: OPTIMAL</span>
          </div>
        </div>

        {/* Bento Cell 4: Live Telemetry Stream (6 cols) */}
        <div
          className="bento-card tactile-panel"
          style={{
            gridColumn: '7 / -1',
            padding: '28px',
            backgroundColor: 'rgba(8, 10, 14, 0.95)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
          }}
        >
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <span className="technical-badge">04 // TELEMETRY</span>
              <span className="technical-badge technical-badge-cyan">REALTIME PHOTONS</span>
            </div>

            <h3
              style={{
                fontFamily: 'Comvota, sans-serif',
                fontSize: 'clamp(22px, 2.2vw, 34px)',
                lineHeight: 1.1,
                color: 'var(--ink)',
                textTransform: 'uppercase',
                margin: '0 0 12px 0',
                fontWeight: 300
              }}
            >
              Dynamic Photon Highway
            </h3>

            <p
              style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: '14px',
                lineHeight: 1.6,
                color: 'var(--text-secondary)',
                margin: 0
              }}
            >
              Luminous photon particles travel along inter-module boundaries at configurable speeds (0.5x to 4x), revealing runtime call volume and architecture boundaries.
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '8px',
              paddingTop: '16px',
              borderTop: '1px solid rgba(255, 255, 255, 0.08)',
              marginTop: '20px'
            }}
          >
            <div>
              <span className="technical-meta" style={{ fontSize: '9px', display: 'block' }}>PHOTONS</span>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '11px', color: 'var(--accent-highlight)' }}>ACTIVE</span>
            </div>
            <div>
              <span className="technical-meta" style={{ fontSize: '9px', display: 'block' }}>VELOCITY</span>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '11px', color: 'var(--ink)' }}>2.0X SPEED</span>
            </div>
            <div>
              <span className="technical-meta" style={{ fontSize: '9px', display: 'block' }}>SHADER</span>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '11px', color: 'var(--ink)' }}>BLOOM_PASS</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
