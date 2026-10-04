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
      
      const pad = window.innerWidth >= 768 ? 48 : 32; 
      const targetWidth = container.clientWidth - pad;
      
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (ctx) {
        // Measure real glyph width (ignoring DOM element box extra spaces/bearings)
        const baseSize = 100;
        ctx.font = `${baseSize}px Comvota, sans-serif`;
        const metrics = ctx.measureText('CODEATLAS');
        const trueWidth = metrics.actualBoundingBoxRight + Math.abs(metrics.actualBoundingBoxLeft);
        
        if (trueWidth > 0) {
          const scale = targetWidth / trueWidth;
          const newFontSize = baseSize * scale;
          wordmark.style.fontSize = `${Math.floor(newFontSize)}px`;
          
          // Export the optical width to align the top elements perfectly
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
        backgroundColor: 'var(--bg)',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        overflow: 'hidden'
      }}
    >
      <WaterCanvas />

      <div style={{
        position: 'relative',
        zIndex: 10,
        padding: '0 16px', 
        paddingBottom: '32px',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '3vh',
        pointerEvents: 'none' // Ensure clicks fall through unless specified
      }}>
        
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          width: '100%',
          maxWidth: 'var(--wordmark-width, 100%)',
          pointerEvents: 'auto' // Re-enable pointer events for the hero content
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <p style={{
              fontSize: 'clamp(18px, 2vw, 24px)',
              color: 'var(--ink)',
              maxWidth: '30ch', 
              margin: 0,
              fontWeight: 400,
              lineHeight: 1.3,
              letterSpacing: '0.02em',
              fontFamily: 'Comvota, sans-serif'
            }}>
              Explore any GitHub codebase as a 3D world.
            </p>
            
            <Link 
              to="/scene"
              style={{
                width: 'fit-content',
                padding: '12px 24px',
                backgroundColor: 'var(--ink)',
                color: 'var(--bg)',
                border: '1px solid var(--ink)',
                fontFamily: 'Inter, sans-serif',
                fontWeight: 700,
                fontSize: '0.85rem',
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'all 0.2s ease',
                boxShadow: '4px 4px 0px rgba(0,0,0,0.2)',
                textDecoration: 'none'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.color = 'var(--ink)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--ink)';
                e.currentTarget.style.color = 'var(--bg)';
                e.currentTarget.style.transform = 'translate(0px, 0px)';
              }}
              onMouseDown={(e) => e.currentTarget.style.transform = 'translate(2px, 2px)'}
              onMouseUp={(e) => e.currentTarget.style.transform = 'translate(0px, 0px)'}
            >
              Enter 3D Space <i className="fa-solid fa-arrow-right"></i>
            </Link>
          </div>
          
          <span style={{
            fontSize: 'clamp(14px, 1.5vw, 18px)',
            color: 'var(--ink)',
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            fontWeight: 400,
            fontFamily: 'Comvota, sans-serif',
            paddingBottom: '0' 
          }}>
            Scroll ↓
          </span>
        </div>

        <div style={{
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
          pointerEvents: 'none'
        }}>
          <h1 
            ref={wordmarkRef}
            style={{
              margin: 0,
              padding: 0,
              fontFamily: 'Comvota, sans-serif',
              fontWeight: 300,
              lineHeight: 0.8,
              letterSpacing: '0',
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
