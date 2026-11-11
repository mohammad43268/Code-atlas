import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

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
          end: () => '+=' + containerRef.current!.offsetWidth * (panels.length - 1)
        }
      });

      tl.to(
        panels,
        {
          xPercent: -100 * (panels.length - 1),
          ease: 'none'
        },
        0
      );

      if (packetRef.current) {
        tl.to(
          packetRef.current,
          {
            x: '200vw',
            ease: 'none'
          },
          0
        );
      }
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      aria-labelledby="data-flow-heading"
      style={{
        overflow: 'hidden',
        width: '100%',
        height: '100vh',
        backgroundColor: '#040507',
        position: 'relative',
        borderTop: '1px solid var(--border-subtle)',
        borderBottom: '1px solid var(--border-subtle)'
      }}
    >
      <div
        style={{
          display: 'flex',
          width: '300vw',
          height: '100%',
          willChange: 'transform',
          position: 'relative'
        }}
      >
        {/* Laser Data Bus Connection Track */}
        <div
          style={{
            position: 'absolute',
            top: '64%',
            left: '50vw',
            width: '200vw',
            height: '1px',
            backgroundColor: 'rgba(0, 255, 204, 0.25)',
            boxShadow: '0 0 12px rgba(0, 255, 204, 0.4)',
            zIndex: 1
          }}
        />

        {/* Traveling Cyan Photon Packet */}
        <div
          ref={packetRef}
          style={{
            position: 'absolute',
            top: '64%',
            left: '50vw',
            width: '18px',
            height: '18px',
            backgroundColor: '#050608',
            border: '1px solid var(--accent-highlight)',
            boxShadow: '0 0 16px rgba(0, 255, 204, 0.8)',
            transform: 'translate(-50%, -50%)',
            zIndex: 3,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <div
            style={{
              width: '6px',
              height: '6px',
              backgroundColor: 'var(--accent-highlight)',
              animation: 'cyanPulse 1s infinite ease-in-out'
            }}
          />
        </div>

        {/* Panel 1: Ingestion */}
        <div
          className="horizontal-panel"
          style={{
            width: '100vw',
            height: '100%',
            position: 'relative',
            padding: 'clamp(24px, 5vw, 64px)',
            boxSizing: 'border-box',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span className="technical-meta">[PIPELINE 01/03 // INGESTION]</span>
            <span className="technical-badge technical-badge-cyan">PARSER: TREE-SITTER</span>
          </div>

          <div style={{ maxWidth: '640px', zIndex: 10 }}>
            <h2
              id="data-flow-heading"
              style={{
                fontFamily: 'Comvota, sans-serif',
                fontSize: 'clamp(32px, 4.5vw, 72px)',
                lineHeight: 0.95,
                color: 'var(--ink)',
                textTransform: 'uppercase',
                margin: '0 0 20px 0'
              }}
            >
              Phase 1: Recursive AST Ingestion
            </h2>
            <p
              style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: 'clamp(15px, 1.3vw, 19px)',
                lineHeight: 1.6,
                color: 'var(--text-secondary)',
                margin: 0
              }}
            >
              Connect any public or private GitHub repository. CodeAtlas streams the Git object tree and builds language ASTs, extracting symbols, imports, and interface boundaries.
            </p>
          </div>

          {/* Node Box */}
          <div
            className="tactile-panel"
            style={{
              position: 'absolute',
              top: '64%',
              left: '50vw',
              transform: 'translate(-50%, -50%)',
              width: '190px',
              height: '190px',
              backgroundColor: 'rgba(8, 10, 14, 0.95)',
              border: '1px solid var(--accent-highlight)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 2,
              boxShadow: '0 0 32px rgba(0, 255, 204, 0.15)'
            }}
          >
            <i className="fa-brands fa-github" style={{ fontSize: '2.5rem', marginBottom: '12px', color: 'var(--ink)' }} />
            <span className="technical-badge" style={{ borderColor: 'var(--accent-highlight)', color: 'var(--accent-highlight)' }}>
              AST_EXTRACT
            </span>
            <span className="technical-meta" style={{ fontSize: '9px', marginTop: '6px' }}>
              RECURSIVE SCAN
            </span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span className="technical-meta">INDEX: 01_SOURCE</span>
            <span className="technical-meta">LATENCY: &lt; 400MS</span>
          </div>
        </div>

        {/* Panel 2: Graph Mapping */}
        <div
          className="horizontal-panel"
          style={{
            width: '100vw',
            height: '100%',
            position: 'relative',
            padding: 'clamp(24px, 5vw, 64px)',
            boxSizing: 'border-box',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            borderLeft: '1px solid var(--border-subtle)'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span className="technical-meta">[PIPELINE 02/03 // TOPOLOGY]</span>
            <span className="technical-badge technical-badge-cyan">GRAPH: FORCE-DIRECTED</span>
          </div>

          <div style={{ maxWidth: '640px', zIndex: 10 }}>
            <h2
              style={{
                fontFamily: 'Comvota, sans-serif',
                fontSize: 'clamp(32px, 4.5vw, 72px)',
                lineHeight: 0.95,
                color: 'var(--ink)',
                textTransform: 'uppercase',
                margin: '0 0 20px 0'
              }}
            >
              Phase 2: Force-Directed Topology
            </h2>
            <p
              style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: 'clamp(15px, 1.3vw, 19px)',
                lineHeight: 1.6,
                color: 'var(--text-secondary)',
                margin: 0
              }}
            >
              Files and modules are transformed into graph vertices with repulsive physics and weighted import edges. Architectural silos and cyclic dependencies become immediately visible.
            </p>
          </div>

          {/* Node Box */}
          <div
            className="tactile-panel"
            style={{
              position: 'absolute',
              top: '64%',
              left: '50vw',
              transform: 'translate(-50%, -50%)',
              width: '190px',
              height: '190px',
              backgroundColor: 'rgba(8, 10, 14, 0.95)',
              border: '1px solid var(--accent-highlight)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 2,
              boxShadow: '0 0 32px rgba(0, 255, 204, 0.15)'
            }}
          >
            <i className="fa-solid fa-diagram-project" style={{ fontSize: '2.5rem', marginBottom: '12px', color: 'var(--accent-highlight)' }} />
            <span className="technical-badge" style={{ borderColor: 'var(--accent-highlight)', color: 'var(--accent-highlight)' }}>
              GRAPH_BUILD
            </span>
            <span className="technical-meta" style={{ fontSize: '9px', marginTop: '6px' }}>
              TOPOLOGY_SOLVER
            </span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span className="technical-meta">INDEX: 02_TOPOLOGY</span>
            <span className="technical-meta">NODES: 60,000+</span>
          </div>
        </div>

        {/* Panel 3: Spatial Cartography */}
        <div
          className="horizontal-panel"
          style={{
            width: '100vw',
            height: '100%',
            position: 'relative',
            padding: 'clamp(24px, 5vw, 64px)',
            boxSizing: 'border-box',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            borderLeft: '1px solid var(--border-subtle)'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span className="technical-meta">[PIPELINE 03/03 // ORCHESTRATION]</span>
            <span className="technical-badge technical-badge-cyan">WEBGL: INSTANCED 120FPS</span>
          </div>

          <div style={{ maxWidth: '640px', zIndex: 10 }}>
            <h2
              style={{
                fontFamily: 'Comvota, sans-serif',
                fontSize: 'clamp(32px, 4.5vw, 72px)',
                lineHeight: 0.95,
                color: 'var(--ink)',
                textTransform: 'uppercase',
                margin: '0 0 20px 0'
              }}
            >
              Phase 3: Spatial Cartography & Copilot
            </h2>
            <p
              style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: 'clamp(15px, 1.3vw, 19px)',
                lineHeight: 1.6,
                color: 'var(--text-secondary)',
                margin: 0
              }}
            >
              Fly through the codebase with damped camera flight controls. Pin any node into the grounded reasoning copilot, receiving citations that visually anchor back into physical 3D nodes.
            </p>
          </div>

          {/* Node Box */}
          <div
            className="tactile-panel"
            style={{
              position: 'absolute',
              top: '64%',
              left: '50vw',
              transform: 'translate(-50%, -50%)',
              width: '190px',
              height: '190px',
              backgroundColor: 'rgba(8, 10, 14, 0.95)',
              border: '1px solid var(--accent-highlight)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 2,
              boxShadow: '0 0 32px rgba(0, 255, 204, 0.15)'
            }}
          >
            <i className="fa-solid fa-cube" style={{ fontSize: '2.5rem', marginBottom: '12px', color: 'var(--ink)' }} />
            <span className="technical-badge" style={{ borderColor: 'var(--accent-highlight)', color: 'var(--accent-highlight)' }}>
              SPATIAL_MATRIX
            </span>
            <span className="technical-meta" style={{ fontSize: '9px', marginTop: '6px' }}>
              ORCHESTRATOR COPILOT
            </span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span className="technical-meta">INDEX: 03_RENDER</span>
            <span className="technical-meta">OUTPUT: 3D SPACE</span>
          </div>
        </div>
      </div>
    </section>
  );
};
