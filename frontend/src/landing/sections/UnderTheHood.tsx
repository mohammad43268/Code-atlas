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

export const UnderTheHood: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.anim-svg-box, .anim-svg-line',
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

      const dots = gsap.utils.toArray<SVGCircleElement>('.data-packet-dot');
      dots.forEach((dot, i) => {
        const targetX = 60 + i * 120;
        const distToService = Math.abs(300 - targetX);
        const horizontalTime = distToService / 300;

        const tl = gsap.timeline({ repeat: -1, delay: i * 0.45 });

        tl.set(dot, { x: 300, y: 40, opacity: 0, scale: 1 })
          .to(dot, { opacity: 1, duration: 0.2 })
          .to(dot, { y: 90, duration: 0.35, ease: 'none' })
          .to(dot, { x: targetX, duration: horizontalTime || 0.1, ease: 'none' })
          .to(dot, { y: 140, duration: 0.35, ease: 'none' })
          .to(dot, { scale: 1.65, duration: 0.15, yoyo: true, repeat: 1, ease: 'power1.inOut' })
          .to(dot, { y: 190, duration: 0.35, ease: 'none' })
          .to(dot, { x: 300, duration: horizontalTime || 0.1, ease: 'none' })
          .to(dot, { y: 250, duration: 0.35, ease: 'none' })
          .to(dot, { scale: 1.65, duration: 0.15, yoyo: true, repeat: 1, ease: 'power1.inOut' })
          .to(dot, { y: 350, duration: 0.5, ease: 'none' })
          .to(dot, { opacity: 0, duration: 0.2, ease: 'none' })
          .to({}, { duration: 0.8 });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className={styles.section}
      aria-labelledby="under-hood-heading"
      style={{
        borderTop: '1px solid rgba(255, 255, 255, 0.07)',
        position: 'relative',
        backgroundColor: '#050506'
      }}
    >
      {/* Section Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '48px', flexWrap: 'wrap', gap: '12px' }}>
        <span className="technical-meta">{content.underTheHood.label}</span>
        <span className="technical-badge technical-badge-ice">BUS // 60HZ EVENT STREAM</span>
      </div>

      <div className={styles.grid} style={{ gap: '40px' }}>
        {/* Left Column: Architectural Spec & Service Ledger */}
        <div style={{ gridColumn: '1 / 6', display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div>
            <h3
              id="under-hood-heading"
              style={{
                fontFamily: "'Inter Tight', sans-serif",
                fontSize: 'clamp(28px, 3vw, 44px)',
                lineHeight: 0.96,
                letterSpacing: '-0.04em',
                color: '#F4F4F6',
                textTransform: 'uppercase',
                margin: '0 0 16px 0',
                fontWeight: 700
              }}
            >
              Decoupled High-Throughput Micro-Architecture
            </h3>
            <p
              style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: '14px',
                lineHeight: 1.6,
                color: '#9499A6',
                margin: 0
              }}
            >
              {content.underTheHood.line}
            </p>
          </div>

          {/* Microservice Ledger */}
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
              gap: '12px'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255, 255, 255, 0.07)', paddingBottom: '10px' }}>
              <span className="technical-meta">MICROSERVICE DIRECTORY</span>
              <span className="technical-meta" style={{ color: '#10B981', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                <span className="emerald-dot" />
                STATUS: HEALTHY
              </span>
            </div>

            {content.underTheHood.services.map((svc) => (
              <div
                key={svc.tag}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'baseline',
                  fontSize: '12px',
                  fontFamily: "'JetBrains Mono', monospace",
                  padding: '4px 0',
                  borderBottom: '1px solid rgba(255, 255, 255, 0.035)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ color: '#38BDF8', fontSize: '8px' }}>●</span>
                  <span style={{ color: '#F4F4F6', fontWeight: 600 }}>{svc.name}</span>
                </div>
                <span className="technical-meta" style={{ fontSize: '10px' }}>{svc.tag}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Architectural SVG Telemetry Schematic */}
        <div
          style={{ gridColumn: '7 / -1' }}
          aria-hidden="true"
          className="spotlight-card"
          onMouseMove={handleSpotlightMove}
        >
          <div
            style={{
              padding: '24px',
              backgroundColor: 'rgba(10, 11, 14, 0.72)',
              backdropFilter: 'blur(20px) saturate(140%)',
              WebkitBackdropFilter: 'blur(20px) saturate(140%)',
              border: '1px solid rgba(255, 255, 255, 0.07)',
              boxShadow: 'inset 0 1px 0 0 rgba(255, 255, 255, 0.06)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <span className="technical-meta" style={{ color: '#38BDF8' }}>SCHEMATIC // EVENT_BUS_ROUTING</span>
              <span className="technical-meta">LATENCY: 18MS</span>
            </div>

            <svg viewBox="0 0 600 400" style={{ width: '100%', height: 'auto', overflow: 'visible' }}>
              <g stroke="rgba(255, 255, 255, 0.14)" strokeWidth="1" fill="none">
                <line className="anim-svg-line" x1="300" y1="60" x2="300" y2="90" stroke="#38BDF8" strokeOpacity="0.65" />
                <line className="anim-svg-line" x1="60" y1="90" x2="540" y2="90" stroke="#38BDF8" strokeOpacity="0.32" />

                {[60, 180, 300, 420, 540].map((x, i) => (
                  <g key={`l1-${i}`}>
                    <line className="anim-svg-line" x1={x} y1="90" x2={x} y2="120" stroke="rgba(255, 255, 255, 0.2)" />
                    <line className="anim-svg-line" x1={x} y1="160" x2={x} y2="190" stroke="rgba(255, 255, 255, 0.2)" />
                  </g>
                ))}

                <line className="anim-svg-line" x1="60" y1="190" x2="540" y2="190" stroke="#818CF8" strokeOpacity="0.32" />
                <line className="anim-svg-line" x1="300" y1="190" x2="300" y2="230" stroke="#818CF8" strokeOpacity="0.65" />
              </g>

              {/* API Gateway Box */}
              <g className="anim-svg-box">
                <rect x="200" y="20" width="200" height="40" fill="#08090B" stroke="rgba(56, 189, 248, 0.45)" strokeWidth="1" />
                <text x="300" y="44" textAnchor="middle" fill="#F4F4F6" fontSize="10" fontFamily="'JetBrains Mono', monospace" letterSpacing="0.12em" fontWeight="bold">
                  API GATEWAY // SSE INGESTION
                </text>
              </g>

              {/* 5 Service Nodes */}
              {content.underTheHood.services.map((svc, i) => (
                <g className="anim-svg-box" key={`box-${i}`}>
                  <rect x={60 + i * 120 - 50} y="120" width="100" height="40" fill="#0B0C10" stroke="rgba(255, 255, 255, 0.16)" strokeWidth="1" />
                  <text x={60 + i * 120} y="144" textAnchor="middle" fill="#E2E8F0" fontSize="8" fontFamily="'JetBrains Mono', monospace" letterSpacing="0.08em" fontWeight="600">
                    {svc.name}
                  </text>
                </g>
              ))}

              {/* Shared Graph Contract */}
              <g className="anim-svg-box">
                <rect x="50" y="230" width="500" height="40" fill="#08090B" stroke="rgba(129, 140, 248, 0.45)" strokeWidth="1" />
                <text x="300" y="254" textAnchor="middle" fill="#F4F4F6" fontSize="10" fontFamily="'JetBrains Mono', monospace" letterSpacing="0.15em" fontWeight="bold">
                  {content.underTheHood.bottomLabel}
                </text>
              </g>

              {/* Unified Matrix Storage Base */}
              <g className="anim-svg-box">
                <ellipse cx="300" cy="320" rx="90" ry="16" fill="#0B0C10" stroke="rgba(255, 255, 255, 0.22)" />
                <path d="M 210 320 L 210 370 A 90 16 0 0 0 390 370 L 390 320" fill="#0B0C10" stroke="rgba(255, 255, 255, 0.22)" />
                <text x="300" y="355" textAnchor="middle" fill="#9499A6" fontSize="9" fontFamily="'JetBrains Mono', monospace" letterSpacing="0.1em" fontWeight="bold">
                  {content.underTheHood.storageLabel}
                </text>
              </g>

              {/* Data Packet Photons */}
              {[0, 1, 2, 3, 4].map((i) => (
                <circle
                  className="data-packet-dot"
                  key={`dot-${i}`}
                  cx="0"
                  cy="0"
                  r="3"
                  fill={i % 2 === 0 ? '#38BDF8' : '#F8FAFC'}
                />
              ))}
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
};
