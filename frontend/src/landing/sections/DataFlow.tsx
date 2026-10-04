import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import styles from '../styles/landing.module.css';

export const DataFlow: React.FC = () => {
  const containerRef = useRef<HTMLElement>(null);
  const packetRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      const panels = gsap.utils.toArray('.horizontal-panel');
      
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          pin: true,
          scrub: 1,
          snap: 1 / (panels.length - 1),
          // Scroll distance equals the width of all panels to feel natural 1:1
          end: () => "+=" + containerRef.current!.offsetWidth * (panels.length - 1)
        }
      });

      // Move the panels
      tl.to(panels, {
        xPercent: -100 * (panels.length - 1),
        ease: "none"
      }, 0);

      // Move the data packet across the entire width of the track
      // The track is 200vw long (from center of panel 1 to center of panel 3)
      if (packetRef.current) {
        tl.to(packetRef.current, {
          x: '200vw', 
          ease: "none"
        }, 0);
      }

    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} aria-labelledby="data-flow-heading" style={{ 
      overflow: 'hidden', 
      width: '100%', 
      height: '100vh', 
      backgroundColor: 'transparent', 
      position: 'relative' 
    }}>
      <div style={{ 
        display: 'flex', 
        width: '300vw', 
        height: '100%',
        willChange: 'transform',
        position: 'relative'
      }}>
        
        {/* The Connection Track spanning from center of panel 1 to center of panel 3 */}
        <div style={{
          position: 'absolute',
          top: '65%',
          left: '50vw',
          width: '200vw',
          height: '2px',
          backgroundColor: 'var(--ink)',
          opacity: 0.2,
          zIndex: 0
        }} />

        {/* The Traveling Data Packet */}
        <div ref={packetRef} style={{
          position: 'absolute',
          top: '65%',
          left: '50vw',
          width: '20px',
          height: '20px',
          backgroundColor: 'var(--ink)',
          borderRadius: '0%', // brutalist square
          transform: 'translate(-50%, -50%)',
          zIndex: 2,
          boxShadow: '4px 4px 0px rgba(0,0,0,0.2)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <div style={{ width: '8px', height: '8px', backgroundColor: 'var(--bg)', animation: 'pulse 1s infinite alternate' }} />
        </div>

        {/* Panel 1 */}
        <div className="horizontal-panel" style={{ width: '100vw', height: '100%', position: 'relative', padding: 'clamp(16px, 4vw, 24px)' }}>
          <div className="outline-number" style={{ top: '5vh', left: '5vw', opacity: 0.05, color: 'transparent', WebkitTextStroke: '4px var(--ink)' }}>01</div>
          <div style={{ position: 'absolute', top: '15vh', left: '10vw', maxWidth: '600px', zIndex: 10 }}>
            <div className={styles.label} id="data-flow-heading" style={{ marginBottom: '24px' }}>Data Flow</div>
            <h2 className={styles.displayHeadline} style={{ fontSize: 'clamp(32px, 5vw, 64px)', marginBottom: '24px' }}>
              Phase 1: Ingestion
            </h2>
            <p className={styles.bodyText}>
              We connect to your GitHub repository and pull the raw AST, treating code not as plain text but as a highly structured entity.
            </p>
          </div>
          {/* Node Box */}
          <div style={{
            position: 'absolute',
            top: '65%',
            left: '50vw',
            transform: 'translate(-50%, -50%)',
            width: '180px',
            height: '180px',
            border: '2px solid var(--ink)',
            backgroundColor: 'var(--surface)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1,
            boxShadow: '12px 12px 0px var(--ink)'
          }}>
            <i className="fa-brands fa-github" style={{ fontSize: '3rem', marginBottom: '1rem', color: 'var(--ink)' }}></i>
            <span className="tech-label" style={{ backgroundColor: 'var(--bg)' }}>AST_EXTRACT</span>
          </div>
        </div>

        {/* Panel 2 */}
        <div className="horizontal-panel" style={{ width: '100vw', height: '100%', position: 'relative', padding: 'clamp(16px, 4vw, 24px)' }}>
          <div className="outline-number" style={{ top: '5vh', left: '5vw', opacity: 0.05, color: 'transparent', WebkitTextStroke: '4px var(--ink)' }}>02</div>
          <div style={{ position: 'absolute', top: '15vh', left: '10vw', maxWidth: '600px', zIndex: 10 }}>
            <h2 className={styles.displayHeadline} style={{ fontSize: 'clamp(32px, 5vw, 64px)', marginBottom: '24px' }}>
              Phase 2: Graph Mapping
            </h2>
            <p className={styles.bodyText}>
              Functions, classes, and dependencies are mapped into a massive graph. This abstract web of relations allows us to see how everything connects.
            </p>
          </div>
          {/* Node Box */}
          <div style={{
            position: 'absolute',
            top: '65%',
            left: '50vw',
            transform: 'translate(-50%, -50%)',
            width: '180px',
            height: '180px',
            border: '2px solid var(--ink)',
            backgroundColor: 'var(--surface)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1,
            boxShadow: '12px 12px 0px var(--ink)'
          }}>
            <i className="fa-solid fa-project-diagram" style={{ fontSize: '3rem', marginBottom: '1rem', color: 'var(--ink)' }}></i>
            <span className="tech-label" style={{ backgroundColor: 'var(--bg)' }}>GRAPH_BUILD</span>
          </div>
        </div>

        {/* Panel 3 */}
        <div className="horizontal-panel" style={{ width: '100vw', height: '100%', position: 'relative', padding: 'clamp(16px, 4vw, 24px)' }}>
          <div className="outline-number" style={{ top: '5vh', left: '5vw', opacity: 0.05, color: 'transparent', WebkitTextStroke: '4px var(--ink)' }}>03</div>
          <div style={{ position: 'absolute', top: '15vh', left: '10vw', maxWidth: '600px', zIndex: 10 }}>
            <h2 className={styles.displayHeadline} style={{ fontSize: 'clamp(32px, 5vw, 64px)', marginBottom: '24px' }}>
              Phase 3: Spatial Render
            </h2>
            <p className={styles.bodyText}>
              Finally, we orchestrate the multi-dimensional graph into a 3D physical space, letting you fly through your architecture like a city.
            </p>
          </div>
          {/* Node Box */}
          <div style={{
            position: 'absolute',
            top: '65%',
            left: '50vw',
            transform: 'translate(-50%, -50%)',
            width: '180px',
            height: '180px',
            border: '2px solid var(--ink)',
            backgroundColor: 'var(--surface)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1,
            boxShadow: '12px 12px 0px var(--ink)'
          }}>
            <i className="fa-solid fa-cubes" style={{ fontSize: '3rem', marginBottom: '1rem', color: 'var(--ink)' }}></i>
            <span className="tech-label" style={{ backgroundColor: 'var(--bg)' }}>3D_RENDER</span>
          </div>
        </div>

      </div>
    </section>
  );
};
