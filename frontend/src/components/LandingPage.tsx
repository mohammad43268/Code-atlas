import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { WaterCanvas } from './WaterCanvas';
import { LandingSections } from '../landing/LandingSections';

export const LandingPage: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const wordmarkRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const fitText = () => {
      if (!containerRef.current || !wordmarkRef.current) return;

      const container = containerRef.current;
      const wordmark = wordmarkRef.current;

      const pad = window.innerWidth >= 768 ? 48 : 24;
      const targetWidth = container.clientWidth - pad;

      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (ctx) {
        const baseSize = 100;
        ctx.font = `${baseSize}px Comvota, sans-serif`;
        const metrics = ctx.measureText('CODEATLAS');
        const trueWidth = metrics.actualBoundingBoxRight + Math.abs(metrics.actualBoundingBoxLeft);

        if (trueWidth > 0) {
          const scale = targetWidth / trueWidth;
          const newFontSize = baseSize * scale;
          wordmark.style.fontSize = `${Math.floor(newFontSize)}px`;
          container.style.setProperty('--wordmark-width', `${targetWidth}px`);
        }
      }
    };

    if ('fonts' in document) {
      document.fonts.ready.then(fitText);
    } else {
      setTimeout(fitText, 100);
    }

    const observer = new ResizeObserver(() => {
      window.requestAnimationFrame(fitText);
    });

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <>
      <div
        ref={containerRef}
        style={{
          width: '100%',
          height: '100svh',
          backgroundColor: 'transparent',
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
          overflow: 'hidden'
        }}
      >
        <WaterCanvas />

        {/* Hero Viewport Tactical Deck */}
        <div
          style={{
            position: 'relative',
            zIndex: 10,
            padding: '0 20px',
            paddingBottom: '28px',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '2.5vh',
            pointerEvents: 'none'
          }}
        >
          {/* Top Telemetry Strip */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-end',
              width: '100%',
              maxWidth: 'var(--wordmark-width, 100%)',
              pointerEvents: 'auto'
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: '580px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                <span className="technical-badge technical-badge-cyan">
                  <span
                    style={{
                      width: '6px',
                      height: '6px',
                      borderRadius: '50%',
                      backgroundColor: 'var(--accent-highlight)',
                      display: 'inline-block',
                      animation: 'cyanPulse 2s infinite ease-in-out'
                    }}
                  />
                  AST ENGINE ONLINE
                </span>
                <span className="technical-meta" style={{ color: 'var(--text-muted)' }}>
                  COORD // [40.7128°N, 74.0060°W]
                </span>
              </div>

              <h2
                style={{
                  fontSize: 'clamp(20px, 2.4vw, 32px)',
                  color: 'var(--ink)',
                  margin: 0,
                  fontWeight: 300,
                  lineHeight: 1.25,
                  letterSpacing: '0.01em',
                  fontFamily: 'Comvota, sans-serif'
                }}
              >
                Transpiling abstract GitHub codebases into living 3D spatial topography.
              </h2>

              {/* Action Deck */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                <Link
                  to="/scene"
                  style={{
                    padding: '12px 28px',
                    backgroundColor: 'var(--accent-highlight)',
                    color: '#050608',
                    border: '1px solid var(--accent-highlight)',
                    fontFamily: "'JetBrains Mono', monospace",
                    fontWeight: 700,
                    fontSize: '0.78rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.12em',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '10px',
                    transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
                    textDecoration: 'none',
                    boxShadow: '0 0 24px rgba(0, 255, 204, 0.25)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 0 32px rgba(0, 255, 204, 0.5)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 0 24px rgba(0, 255, 204, 0.25)';
                  }}
                >
                  <span>LAUNCH 3D ENGINE</span>
                  <i className="fa-solid fa-arrow-right" style={{ fontSize: '0.7rem' }} />
                </Link>

                <a
                  href="#statement-heading"
                  style={{
                    padding: '12px 20px',
                    backgroundColor: 'rgba(255, 255, 255, 0.04)',
                    color: 'var(--ink)',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    fontFamily: "'JetBrains Mono', monospace",
                    fontWeight: 500,
                    fontSize: '0.78rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    textDecoration: 'none',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.3)';
                    e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.08)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.12)';
                    e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.04)';
                  }}
                >
                  SYSTEM ARCHITECTURE
                </a>
              </div>
            </div>

            {/* Scroll Indicator */}
            <div
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
                  height: '40px',
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  position: 'relative',
                  overflow: 'hidden'
                }}
              >
                <div
                  style={{
                    width: '100%',
                    height: '16px',
                    backgroundColor: 'var(--accent-highlight)',
                    animation: 'subtleShimmer 1.8s infinite ease-in-out'
                  }}
                />
              </div>
            </div>
          </div>

          {/* Monumental Responsive Display Wordmark */}
          <div
            style={{
              width: '100%',
              display: 'flex',
              justifyContent: 'center',
              pointerEvents: 'none'
            }}
          >
            <h1
              ref={wordmarkRef}
              style={{
                margin: 0,
                padding: 0,
                fontFamily: 'Comvota, sans-serif',
                fontWeight: 300,
                lineHeight: 0.82,
                letterSpacing: '-0.01em',
                color: 'var(--ink)',
                textTransform: 'uppercase',
                whiteSpace: 'nowrap',
                display: 'inline-block',
                width: 'fit-content',
                userSelect: 'none',
                textAlign: 'center'
              }}
            >
              CODEATLAS
            </h1>
          </div>
        </div>
      </div>
      <LandingSections />
    </>
  );
};
