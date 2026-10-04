import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import styles from '../styles/landing.module.css';

export const DataFlow: React.FC = () => {
  const containerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      const panels = gsap.utils.toArray('.horizontal-panel');
      
      gsap.to(panels, {
        xPercent: -100 * (panels.length - 1),
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          pin: true,
          scrub: 1,
          snap: 1 / (panels.length - 1),
          // Scroll distance equals the width of all panels to feel natural 1:1
          end: () => "+=" + containerRef.current!.offsetWidth * (panels.length - 1)
        }
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} aria-labelledby="data-flow-heading" style={{ 
      overflow: 'hidden', 
      width: '100%', 
      height: '100vh', 
      backgroundColor: 'var(--surface)', 
      position: 'relative' 
    }}>
      <div style={{ 
        display: 'flex', 
        width: '300vw', 
        height: '100%',
        willChange: 'transform'
      }}>
        {/* Panel 1 */}
        <div className="horizontal-panel" style={{ width: '100vw', height: '100%', display: 'flex', alignItems: 'center', padding: 'clamp(16px, 4vw, 24px)' }}>
          <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <div className={styles.label} id="data-flow-heading" style={{ marginBottom: '40px' }}>(01) Data Flow</div>
            <h2 className={styles.displayHeadline} style={{ fontSize: 'clamp(40px, 6vw, 80px)', marginBottom: '24px' }}>
              Phase 1: Ingestion
            </h2>
            <p className={styles.bodyText}>
              We connect to your GitHub repository and pull the raw AST, treating code not as plain text but as a structured entity.
            </p>
          </div>
        </div>
        {/* Panel 2 */}
        <div className="horizontal-panel" style={{ width: '100vw', height: '100%', display: 'flex', alignItems: 'center', padding: 'clamp(16px, 4vw, 24px)' }}>
          <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <h2 className={styles.displayHeadline} style={{ fontSize: 'clamp(40px, 6vw, 80px)', marginBottom: '24px' }}>
              Phase 2: Graph Mapping
            </h2>
            <p className={styles.bodyText}>
              Functions, classes, and dependencies are mapped into a massive graph. This graph allows us to see how everything connects.
            </p>
          </div>
        </div>
        {/* Panel 3 */}
        <div className="horizontal-panel" style={{ width: '100vw', height: '100%', display: 'flex', alignItems: 'center', padding: 'clamp(16px, 4vw, 24px)' }}>
          <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <h2 className={styles.displayHeadline} style={{ fontSize: 'clamp(40px, 6vw, 80px)', marginBottom: '24px' }}>
              Phase 3: Spatial Render
            </h2>
            <p className={styles.bodyText}>
              Finally, we orchestrate the graph into a 3D physical space, letting you fly through your architecture like a city.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
