import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import styles from '../styles/landing.module.css';
import { content } from '../content/landing.content';

gsap.registerPlugin(ScrollTrigger);

const handleSpotlightMove = (e: React.MouseEvent<HTMLDivElement>) => {
  const rect = e.currentTarget.getBoundingClientRect();
  e.currentTarget.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
  e.currentTarget.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
};

export const TeamRoadmap: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const timelineFillRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      if (timelineFillRef.current) {
        gsap.fromTo(
          timelineFillRef.current,
          { scaleY: 0 },
          {
            scaleY: 1,
            ease: 'none',
            scrollTrigger: {
              trigger: '.roadmap-timeline-track',
              start: 'top 75%',
              end: 'bottom 65%',
              scrub: 0.8
            }
          }
        );
      }

      gsap.fromTo(
        '.anim-milestone-item',
        { opacity: 0, x: -16 },
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
      style={{
        borderTop: '1px solid rgba(255, 255, 255, 0.07)',
        position: 'relative',
        backgroundColor: '#050506'
      }}
    >
      {/* Section Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '48px', flexWrap: 'wrap', gap: '12px' }}>
        <span className="technical-meta">[04 // SYSTEM GOVERNANCE & ROADMAP]</span>
        <span className="technical-badge technical-badge-ice">RELEASE // v1.0-PRODUCTION</span>
      </div>

      <div className={styles.grid} style={{ gap: '48px' }}>
        {/* Left Column: Contributor Matrix */}
        <div style={{ gridColumn: '1 / 6', display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div>
            <h3
              id="team-roadmap-heading"
              style={{
                fontFamily: "'Inter Tight', sans-serif",
                fontSize: 'clamp(28px, 3vw, 44px)',
                lineHeight: 0.96,
                letterSpacing: '-0.04em',
                color: '#F4F4F6',
                textTransform: 'uppercase',
                margin: '0 0 12px 0',
                fontWeight: 700
              }}
            >
              Core Architecture & Engineering
            </h3>
            <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '14px', lineHeight: 1.6, color: '#9499A6', margin: 0 }}>
              Engineered by systems technologists specializing in WebGL spatial computation, AST static analysis, and LLM context grounding.
            </p>
          </div>

          <div
            className="spotlight-card"
            onMouseMove={handleSpotlightMove}
            style={{
              padding: '20px',
              backgroundColor: 'rgba(14, 15, 18, 0.65)',
              backdropFilter: 'blur(20px) saturate(140%)',
              WebkitBackdropFilter: 'blur(20px) saturate(140%)',
              border: '1px solid rgba(255, 255, 255, 0.07)',
              boxShadow: 'inset 0 1px 0 0 rgba(255, 255, 255, 0.06)',
              display: 'flex',
              flexDirection: 'column',
              gap: '10px'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255, 255, 255, 0.07)', paddingBottom: '12px', marginBottom: '4px' }}>
              <span className="technical-meta">CONTRIBUTOR MATRIX</span>
              <span className="technical-meta" style={{ color: '#10B981', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                <span className="emerald-dot" />
                VERIFIED
              </span>
            </div>

            {content.team.map((member, idx) => (
              <div
                key={member.name}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '10px 8px',
                  borderBottom: idx === content.team.length - 1 ? 'none' : '1px solid rgba(255, 255, 255, 0.05)',
                  transition: 'transform 0.28s cubic-bezier(0.16, 1, 0.3, 1), background-color 0.28s ease',
                  cursor: 'default'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateX(4px)';
                  e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.025)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateX(0px)';
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: 0 }}>
                  <span className="technical-meta" style={{ color: '#646A77', fontSize: '10px' }}>
                    0{idx + 1}
                  </span>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '13px', fontWeight: 600, color: '#F4F4F6' }}>
                      {member.name}
                    </div>
                    <div style={{ fontFamily: 'Inter, sans-serif', fontSize: '12px', color: '#9499A6', marginTop: '2px' }}>
                      {member.role}
                    </div>
                  </div>
                </div>
                <span
                  className="technical-badge"
                  style={{
                    fontSize: '9px',
                    backgroundColor: 'rgba(255, 255, 255, 0.03)',
                    borderColor: 'rgba(255, 255, 255, 0.12)',
                    color: '#E2E8F0',
                    flexShrink: 0
                  }}
                >
                  {member.handle}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: 4-Phase Vertical Connected Roadmap */}
        <div style={{ gridColumn: '7 / -1', display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div>
            <h3
              style={{
                fontFamily: "'Inter Tight', sans-serif",
                fontSize: 'clamp(28px, 3vw, 44px)',
                lineHeight: 0.96,
                letterSpacing: '-0.04em',
                color: '#F4F4F6',
                textTransform: 'uppercase',
                margin: '0 0 12px 0',
                fontWeight: 700
              }}
            >
              Engineering Release Roadmap
            </h3>
            <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '14px', lineHeight: 1.6, color: '#9499A6', margin: 0 }}>
              Milestones tracking spatial WebGL rendering, AST static analysis, and multi-agent context grounding.
            </p>
          </div>

          <div
            className="roadmap-timeline-track"
            style={{
              position: 'relative',
              paddingLeft: '28px',
              display: 'flex',
              flexDirection: 'column',
              gap: '14px'
            }}
          >
            {/* Base vertical hairline rail */}
            <div
              aria-hidden="true"
              style={{
                position: 'absolute',
                left: '7px',
                top: '14px',
                bottom: '14px',
                width: '1px',
                backgroundColor: 'rgba(255, 255, 255, 0.08)'
              }}
            />
            {/* Scroll-driven active progress fill */}
            <div
              ref={timelineFillRef}
              aria-hidden="true"
              style={{
                position: 'absolute',
                left: '7px',
                top: '14px',
                bottom: '14px',
                width: '1px',
                background: 'linear-gradient(180deg, #10B981 0%, #38BDF8 65%, #818CF8 100%)',
                transformOrigin: 'top center'
              }}
            />

            {content.roadmap.map((m) => {
              const isCompleted = m.status === 'COMPLETED';
              const isInDev = m.status === 'IN DEVELOPMENT';
              const accentColor = isCompleted ? '#10B981' : isInDev ? '#38BDF8' : '#646A77';

              return (
                <div
                  key={m.phase}
                  className="anim-milestone-item spotlight-card"
                  onMouseMove={handleSpotlightMove}
                  style={{
                    position: 'relative',
                    padding: '18px 20px',
                    backgroundColor: 'rgba(14, 15, 18, 0.65)',
                    backdropFilter: 'blur(20px) saturate(140%)',
                    WebkitBackdropFilter: 'blur(20px) saturate(140%)',
                    border: isCompleted
                      ? '1px solid rgba(16, 185, 129, 0.22)'
                      : isInDev
                      ? '1px solid rgba(56, 189, 248, 0.24)'
                      : '1px solid rgba(255, 255, 255, 0.07)',
                    boxShadow: 'inset 0 1px 0 0 rgba(255, 255, 255, 0.05)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '6px'
                  }}
                >
                  {/* Timeline Node Marker */}
                  <span
                    aria-hidden="true"
                    style={{
                      position: 'absolute',
                      left: '-25px',
                      top: '22px',
                      width: '9px',
                      height: '9px',
                      borderRadius: '9999px',
                      backgroundColor: isCompleted || isInDev ? accentColor : '#08090B',
                      border: `1.5px solid ${accentColor}`,
                      boxShadow: isCompleted
                        ? '0 0 10px rgba(16, 185, 129, 0.55)'
                        : isInDev
                        ? '0 0 10px rgba(56, 189, 248, 0.45)'
                        : 'none'
                    }}
                  />

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span className="technical-meta" style={{ color: isCompleted || isInDev ? accentColor : '#646A77' }}>
                        {m.phase}
                      </span>
                      <span className="technical-meta">[{m.date}]</span>
                    </div>
                    <span
                      className={`technical-badge ${
                        isCompleted
                          ? 'technical-badge-emerald'
                          : isInDev
                          ? 'technical-badge-ice'
                          : ''
                      }`}
                      style={{ fontSize: '9px' }}
                    >
                      {m.status}
                    </span>
                  </div>

                  <div
                    style={{
                      fontFamily: "'Inter Tight', sans-serif",
                      fontSize: '1.15rem',
                      fontWeight: 600,
                      letterSpacing: '-0.02em',
                      color: '#F4F4F6'
                    }}
                  >
                    {m.title}
                  </div>

                  <p
                    style={{
                      fontFamily: 'Inter, sans-serif',
                      fontSize: '13px',
                      lineHeight: 1.55,
                      color: '#9499A6',
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
