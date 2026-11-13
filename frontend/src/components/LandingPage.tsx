import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import { WaterCanvas } from './WaterCanvas';
import { LandingSections } from '../landing/LandingSections';

gsap.registerPlugin(ScrollTrigger);

const HERO_CHARS = 'CODEATLAS'.split('');

export const LandingPage: React.FC = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const subheadLayerRef = useRef<HTMLDivElement>(null);
  const ctaLayerRef = useRef<HTMLDivElement>(null);
  const wordmarkLayerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!heroRef.current) return;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      // Character reveal from overflow-hidden mask
      gsap.fromTo(
        '.hero-char',
        { yPercent: 110 },
        {
          yPercent: 0,
          duration: 1.05,
          ease: 'power4.out',
          stagger: 0.03,
          delay: 0.1
        }
      );

      // Subtle intro reveal for metadata, headline & CTAs
      gsap.fromTo(
        '.hero-meta-reveal',
        { y: 20, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.9,
          stagger: 0.08,
          ease: 'power3.out',
          delay: 0.25
        }
      );

      // Multi-layer ScrollTrigger scrub parallax differential
      const scrollTl = gsap.timeline({
        scrollTrigger: {
          trigger: heroRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: 1.2
        }
      });

      if (subheadLayerRef.current) {
        scrollTl.to(subheadLayerRef.current, { yPercent: -35, opacity: 0.3, ease: 'none' }, 0);
      }
      if (ctaLayerRef.current) {
        scrollTl.to(ctaLayerRef.current, { yPercent: -20, opacity: 0.4, ease: 'none' }, 0);
      }
      if (wordmarkLayerRef.current) {
        scrollTl.to(wordmarkLayerRef.current, { yPercent: 18, scale: 0.98, ease: 'none' }, 0);
      }
    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <>
      <div
        ref={heroRef}
        style={{
          width: '100%',
          minHeight: '100svh',
          paddingTop: '112px',
          backgroundColor: 'transparent',
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
          overflow: 'hidden'
        }}
      >
        <WaterCanvas />

        {/* Hero Content Stack */}
        <div
          style={{
            position: 'relative',
            zIndex: 10,
            padding: '0 clamp(16px, 4vw, 40px) 24px clamp(16px, 4vw, 40px)',
            width: '100%',
            maxWidth: '1440px',
            margin: '0 auto',
            display: 'flex',
            flexDirection: 'column',
            gap: 'clamp(24px, 4vh, 48px)',
            pointerEvents: 'none'
          }}
        >
          {/* Editorial Lead & Action Deck */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-end',
              flexWrap: 'wrap',
              gap: '24px',
              width: '100%',
              pointerEvents: 'auto'
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: '640px' }}>
              <div
                ref={subheadLayerRef}
                className="hero-meta-reveal"
                style={{ display: 'flex', flexDirection: 'column', gap: '16px', willChange: 'transform, opacity' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                  <span className="technical-badge technical-badge-emerald" style={{ borderRadius: '9999px' }}>
                    <span className="emerald-dot" />
                    AST ENGINE ONLINE
                  </span>
                  <span className="technical-meta">COORD // [40.7128°N, 74.0060°W]</span>
                </div>

                <h2
                  style={{
                    fontFamily: "'Inter Tight', sans-serif",
                    fontSize: 'clamp(22px, 2.8vw, 38px)',
                    color: '#F4F4F6',
                    margin: 0,
                    fontWeight: 600,
                    lineHeight: 1.15,
                    letterSpacing: '-0.03em'
                  }}
                >
                  Transpiling abstract GitHub codebases into living 3D spatial topography.
                </h2>
              </div>

              {/* Liquid Platinum CTA Bar */}
              <div
                ref={ctaLayerRef}
                className="hero-meta-reveal"
                style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap', willChange: 'transform, opacity' }}
              >
                <Link
                  to="/scene"
                  className="platinum-cta"
                  style={{
                    padding: '13px 28px',
                    borderRadius: '9999px',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '10px'
                  }}
                >
                  <span>LAUNCH 3D ENGINE</span>
                  <i className="fa-solid fa-arrow-right" style={{ fontSize: '10px' }} />
                </Link>

                <a
                  href="#data-flow-heading"
                  style={{
                    padding: '13px 22px',
                    borderRadius: '9999px',
                    backgroundColor: 'rgba(14, 15, 18, 0.65)',
                    backdropFilter: 'blur(20px)',
                    color: '#F4F4F6',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    fontFamily: "'JetBrains Mono', monospace",
                    fontWeight: 500,
                    fontSize: '11px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.12em',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    textDecoration: 'none',
                    whiteSpace: 'nowrap',
                    transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.24)';
                    e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.06)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)';
                    e.currentTarget.style.backgroundColor = 'rgba(14, 15, 18, 0.65)';
                  }}
                >
                  SYSTEM ARCHITECTURE
                </a>
              </div>
            </div>

            {/* Scroll Anchor */}
            <div
              className="hero-meta-reveal"
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-end',
                gap: '8px'
              }}
            >
              <span className="technical-meta">SCROLL TO MAP ↓</span>
              <div
                style={{
                  width: '1px',
                  height: '44px',
                  backgroundColor: 'rgba(255, 255, 255, 0.14)',
                  position: 'relative',
                  overflow: 'hidden'
                }}
              >
                <div
                  style={{
                    width: '100%',
                    height: '18px',
                    backgroundColor: '#F8FAFC',
                    animation: 'subtleShimmer 2.2s infinite cubic-bezier(0.16, 1, 0.3, 1)'
                  }}
                />
              </div>
            </div>
          </div>

          {/* Giant Monumental Bottom-Anchored Display Wordmark */}
          <div
            ref={wordmarkLayerRef}
            style={{
              width: '100%',
              display: 'flex',
              justifyContent: 'center',
              pointerEvents: 'none',
              willChange: 'transform',
              overflow: 'hidden'
            }}
          >
            <h1
              aria-label="CODEATLAS"
              style={{
                margin: 0,
                padding: 0,
                fontFamily: "'Inter Tight', sans-serif",
                fontSize: 'clamp(4.2rem, 15.2vw, 18rem)',
                fontWeight: 800,
                lineHeight: 0.84,
                letterSpacing: '-0.05em',
                textTransform: 'uppercase',
                whiteSpace: 'nowrap',
                userSelect: 'none',
                textAlign: 'center',
                display: 'flex'
              }}
            >
              {HERO_CHARS.map((char, idx) => (
                <span
                  key={idx}
                  style={{
                    display: 'inline-block',
                    overflow: 'hidden'
                  }}
                >
                  <span
                    className="hero-char"
                    style={{
                      display: 'inline-block',
                      backgroundImage:
                        'linear-gradient(180deg, #FFFFFF 0%, #A1A1AA 65%, rgba(255,255,255,0.12) 100%)',
                      WebkitBackgroundClip: 'text',
                      backgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      color: 'transparent',
                      willChange: 'transform'
                    }}
                  >
                    {char}
                  </span>
                </span>
              ))}
            </h1>
          </div>
        </div>
      </div>

      <LandingSections />
    </>
  );
};
