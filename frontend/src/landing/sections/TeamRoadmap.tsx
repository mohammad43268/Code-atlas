import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import styles from '../styles/landing.module.css';
import { content } from '../content/landing.content';

export const TeamRoadmap: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.anim-milestone-item',
        { opacity: 0, x: -20 },
        {
          opacity: 1,
          x: 0,
          stagger: 0.1,
          duration: 0.7,
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

  return (
    <section
      ref={sectionRef}
      className={styles.section}
      aria-labelledby="team-roadmap-heading"
      style={{ borderTop: '1px solid var(--border-subtle)', position: 'relative' }}
    >
      {/* Section Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '48px' }}>
        <span className="technical-meta">[04 // SYSTEM GOVERNANCE & ROADMAP]</span>
        <span className="technical-badge technical-badge-cyan">RELEASE // v1.0-PRODUCTION</span>
      </div>

      <div className={styles.grid} style={{ gap: '48px' }}>
        {/* Left Column: Contributor Matrix */}
        <div style={{ gridColumn: '1 / 6', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <h3
              id="team-roadmap-heading"
              style={{
                fontFamily: 'Comvota, sans-serif',
                fontSize: 'clamp(24px, 2.8vw, 42px)',
                lineHeight: 1,
                color: 'var(--ink)',
                textTransform: 'uppercase',
                margin: '0 0 12px 0',
                fontWeight: 300
              }}
            >
              Core Architecture & Engineering
            </h3>
            <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '14px', color: 'var(--text-secondary)', margin: 0 }}>
              Engineered by systems technologists specializing in WebGL spatial computation, AST static analysis, and LLM context grounding.
            </p>
          </div>

          <div
            className="tactile-panel"
            style={{
              padding: '16px',
              backgroundColor: 'rgba(8, 10, 14, 0.95)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              display: 'flex',
              flexDirection: 'column',
              gap: '14px'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', paddingBottom: '8px' }}>
              <span className="technical-meta">CONTRIBUTOR MATRIX</span>
              <span className="technical-meta" style={{ color: 'var(--accent-highlight)' }}>VERIFIED</span>
            </div>

            {content.team.map((member) => (
              <div
                key={member.name}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'baseline',
                  paddingBottom: '8px',
                  borderBottom: '1px solid rgba(255, 255, 255, 0.04)'
                }}
              >
                <div>
                  <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '13px', fontWeight: 600, color: 'var(--ink)' }}>
                    {member.name}
                  </div>
                  <div style={{ fontFamily: 'Inter, sans-serif', fontSize: '11px', color: 'var(--text-muted)' }}>
                    {member.role}
                  </div>
                </div>
                <span className="technical-badge" style={{ fontSize: '9px' }}>
                  {member.handle}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: 4-Phase Roadmap Ledger */}
        <div style={{ gridColumn: '7 / -1', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <h3
              style={{
                fontFamily: 'Comvota, sans-serif',
                fontSize: 'clamp(24px, 2.8vw, 42px)',
                lineHeight: 1,
                color: 'var(--ink)',
                textTransform: 'uppercase',
                margin: '0 0 12px 0',
                fontWeight: 300
              }}
            >
              Engineering Release Roadmap
            </h3>
            <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '14px', color: 'var(--text-secondary)', margin: 0 }}>
              Milestones tracking spatial WebGL rendering, AST static analysis, and multi-agent context grounding.
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {content.roadmap.map((m) => {
              const isCompleted = m.status === 'COMPLETED';
              const isInDev = m.status === 'IN DEVELOPMENT';
              return (
                <div
                  key={m.phase}
                  className="anim-milestone-item tactile-panel"
                  style={{
                    padding: '16px 20px',
                    backgroundColor: 'rgba(8, 10, 14, 0.95)',
                    border: isCompleted
                      ? '1px solid rgba(0, 255, 204, 0.3)'
                      : isInDev
                      ? '1px solid rgba(56, 189, 248, 0.3)'
                      : '1px solid rgba(255, 255, 255, 0.1)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '6px'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span className="technical-meta" style={{ color: isCompleted ? 'var(--accent-highlight)' : 'var(--text-muted)' }}>
                        {m.phase}
                      </span>
                      <span className="technical-meta">[{m.date}]</span>
                    </div>
                    <span
                      className="technical-badge"
                      style={{
                        borderColor: isCompleted ? 'var(--accent-highlight)' : isInDev ? '#38bdf8' : 'rgba(255,255,255,0.1)',
                        color: isCompleted ? 'var(--accent-highlight)' : isInDev ? '#38bdf8' : 'var(--text-muted)',
                        fontSize: '9px'
                      }}
                    >
                      {m.status}
                    </span>
                  </div>

                  <div
                    style={{
                      fontFamily: 'Comvota, sans-serif',
                      fontSize: '1.1rem',
                      letterSpacing: '0.02em',
                      color: 'var(--ink)'
                    }}
                  >
                    {m.title}
                  </div>

                  <p
                    style={{
                      fontFamily: 'Inter, sans-serif',
                      fontSize: '12px',
                      lineHeight: 1.5,
                      color: 'var(--text-muted)',
                      margin: 0
                    }}
                  >
                    {m.details}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
