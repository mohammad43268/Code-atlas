import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface PhaseSpec {
  index: string;
  tag: string;
  title: string;
  desc: string;
  metric: string;
}

const PHASES: PhaseSpec[] = [
  {
    index: '01',
    tag: 'AST_INGESTION',
    title: 'Recursive AST Ingestion',
    desc: 'Connect any public or private GitHub repository. CodeAtlas streams the Git object tree and compiles language ASTs, extracting symbols, imports, and interface boundaries.',
    metric: 'TREE-SITTER // <400MS PARSE'
  },
  {
    index: '02',
    tag: 'FORCE_TOPOLOGY',
    title: 'Force-Directed Topology',
    desc: 'Files and modules transform into graph vertices with repulsive physics and weighted import edges. Architectural silos and cyclic dependencies immediately illuminate.',
    metric: 'TOPOLOGY_SOLVER // 60K+ NODES'
  },
  {
    index: '03',
    tag: 'SPATIAL_GROUNDING',
    title: 'Spatial Grounding & Copilot',
    desc: 'Fly through the codebase with damped orbital controls. Pin any node into the grounded reasoning copilot, receiving citations anchored back to physical 3D coordinates.',
    metric: 'WEBGL INSTANCED // ZERO DRIFT'
  }
];

interface MorphNode {
  id: string;
  label: string;
  color: string;
  // Coordinates inside 800x500 SVG viewBox per phase
  p0: [number, number];
  p1: [number, number];
  p2: [number, number];
}

const MORPH_NODES: MorphNode[] = [
  { id: 'root', label: 'repo/root', color: '#F4F4F6', p0: [400, 70], p1: [400, 250], p2: [380, 230] },
  { id: 'src', label: 'src/', color: '#38BDF8', p0: [240, 175], p1: [230, 170], p2: [230, 155] },
  { id: 'api', label: 'api/', color: '#818CF8', p0: [560, 175], p1: [565, 185], p2: [545, 175] },
  { id: 'scene', label: 'Scene.tsx', color: '#38BDF8', p0: [140, 300], p1: [165, 315], p2: [185, 310] },
  { id: 'hooks', label: 'useOrchestrator.ts', color: '#F4F4F6', p0: [310, 300], p1: [330, 385], p2: [365, 375] },
  { id: 'server', label: 'streamRouter.js', color: '#818CF8', p0: [490, 300], p1: [600, 340], p2: [575, 330] },
  { id: 'ast', label: 'githubTreeService.ts', color: '#F59E0B', p0: [660, 300], p1: [480, 110], p2: [455, 105] },
  { id: 'copilot', label: 'COPILOT_PIN', color: '#10B981', p0: [400, 415], p1: [275, 105], p2: [240, 375] }
];

const EDGES: Array<[number, number]> = [
  [0, 1],
  [0, 2],
  [1, 3],
  [1, 4],
  [2, 5],
  [2, 6],
  [4, 7],
  [3, 4],
  [5, 6]
];

export const DataFlow: React.FC = () => {
  const containerRef = useRef<HTMLElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const [activePhase, setActivePhase] = useState<number>(0);

  useEffect(() => {
    if (!containerRef.current) return;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: containerRef.current,
        start: 'top top',
        end: '+=200%',
        pin: true,
        scrub: 1,
        onUpdate: (self) => {
          const p = self.progress;
          if (progressBarRef.current) {
            progressBarRef.current.style.height = `${Math.min(100, Math.max(8, p * 100))}%`;
          }
          if (p < 0.34) {
            setActivePhase(0);
          } else if (p < 0.68) {
            setActivePhase(1);
          } else {
            setActivePhase(2);
          }
        }
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const getCoord = (node: MorphNode): [number, number] => {
    if (activePhase === 0) return node.p0;
    if (activePhase === 1) return node.p1;
    return node.p2;
  };

  const currentPhase = PHASES[activePhase] ?? PHASES[0];

  return (
    <section
      ref={containerRef}
      id="data-flow-heading"
      aria-label="Pipeline Scrollytelling"
      style={{
        width: '100%',
        minHeight: '100vh',
        paddingTop: '112px',
        paddingBottom: '64px',
        paddingLeft: 'clamp(16px, 4vw, 40px)',
        paddingRight: 'clamp(16px, 4vw, 40px)',
        backgroundColor: '#050506',
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        borderTop: '1px solid rgba(255, 255, 255, 0.07)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.07)',
        overflow: 'hidden'
      }}
    >
      {/* Architectural 64px Background Grid with Radial Fade Mask */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage:
            'linear-gradient(to right, rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.03) 1px, transparent 1px)',
          backgroundSize: '64px 64px',
          maskImage: 'radial-gradient(circle at 55% 50%, black 30%, transparent 82%)',
          WebkitMaskImage: 'radial-gradient(circle at 55% 50%, black 30%, transparent 82%)',
          pointerEvents: 'none',
          zIndex: 0
        }}
      />

      <div
        style={{
          position: 'relative',
          zIndex: 2,
          width: '100%',
          maxWidth: '1440px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(12, minmax(0, 1fr))',
          gap: 'clamp(24px, 4vw, 48px)',
          alignItems: 'center'
        }}
      >
        {/* Left Column: Phase Index & Vertical Scroll Progress */}
        <div
          style={{
            gridColumn: 'span 5',
            display: 'flex',
            gap: '24px',
            position: 'relative'
          }}
        >
          {/* Vertical Progress Axis */}
          <div
            style={{
              width: '2px',
              backgroundColor: 'rgba(255, 255, 255, 0.08)',
              position: 'relative',
              flexShrink: 0,
              borderRadius: '2px',
              overflow: 'hidden'
            }}
          >
            <div
              ref={progressBarRef}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: `${((activePhase + 1) / 3) * 100}%`,
                background: 'linear-gradient(180deg, #F8FAFC 0%, #38BDF8 100%)',
                boxShadow: '0 0 12px rgba(56, 189, 248, 0.45)',
                transition: 'height 0.35s cubic-bezier(0.16, 1, 0.3, 1)'
              }}
            />
          </div>

          {/* 3-Stage Editorial Phase Stack */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', width: '100%' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span className="technical-meta">[00 // EXECUTION PIPELINE]</span>
              <span className="technical-badge technical-badge-ice" style={{ borderRadius: '9999px' }}>
                PHASE {currentPhase.index} / 03
              </span>
            </div>

            {PHASES.map((phase, idx) => {
              const isActive = idx === activePhase;
              return (
                <div
                  key={phase.index}
                  onClick={() => setActivePhase(idx)}
                  style={{
                    cursor: 'pointer',
                    opacity: isActive ? 1 : 0.32,
                    filter: isActive ? 'blur(0px)' : 'blur(0.8px)',
                    transform: isActive ? 'translateX(4px)' : 'translateX(0px)',
                    transition: 'all 0.45s cubic-bezier(0.16, 1, 0.3, 1)',
                    borderLeft: isActive
                      ? '2px solid rgba(255, 255, 255, 0.25)'
                      : '2px solid transparent',
                    paddingLeft: '16px'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px', marginBottom: '6px' }}>
                    <span
                      style={{
                        fontFamily: "'Inter Tight', sans-serif",
                        fontSize: 'clamp(1.75rem, 2.5vw, 2.5rem)',
                        fontWeight: 800,
                        letterSpacing: '-0.04em',
                        color: isActive ? '#F4F4F6' : '#646A77',
                        lineHeight: 1
                      }}
                    >
                      {phase.index}
                    </span>
                    <span className="technical-meta" style={{ color: isActive ? '#38BDF8' : '#646A77' }}>
                      {phase.tag}
                    </span>
                  </div>

                  <h3
                    style={{
                      fontFamily: "'Inter Tight', sans-serif",
                      fontSize: 'clamp(1.15rem, 1.5vw, 1.5rem)',
                      fontWeight: 600,
                      letterSpacing: '-0.02em',
                      color: '#F4F4F6',
                      margin: '0 0 6px 0'
                    }}
                  >
                    {phase.title}
                  </h3>

                  {isActive && (
                    <p
                      style={{
                        fontFamily: 'Inter, sans-serif',
                        fontSize: '14px',
                        lineHeight: 1.6,
                        color: '#9499A6',
                        margin: 0
                      }}
                    >
                      {phase.desc}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Interactive Glassmorphic Viewport Frame (16/10) */}
        <div
          style={{
            gridColumn: 'span 7',
            width: '100%'
          }}
        >
          <div
            style={{
              width: '100%',
              aspectRatio: '16 / 10',
              backgroundColor: 'rgba(14, 15, 18, 0.65)',
              backdropFilter: 'blur(20px) saturate(140%)',
              WebkitBackdropFilter: 'blur(20px) saturate(140%)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              boxShadow: '0 24px 64px rgba(0, 0, 0, 0.65), inset 0 1px 0 0 rgba(255, 255, 255, 0.08)',
              borderRadius: '12px',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
              position: 'relative'
            }}
          >
            {/* Viewport Top Chrome Strip */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '12px 18px',
                borderBottom: '1px solid rgba(255, 255, 255, 0.07)',
                backgroundColor: 'rgba(8, 9, 11, 0.8)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span className="emerald-dot" />
                <span className="technical-meta" style={{ color: '#F4F4F6' }}>
                  VIEWPORT // {currentPhase.tag}
                </span>
              </div>
              <span className="technical-meta" style={{ color: '#38BDF8' }}>
                {currentPhase.metric}
              </span>
            </div>

            {/* Dynamic Morphing SVG Node-Graph */}
            <div style={{ flex: 1, position: 'relative', width: '100%', height: '100%' }}>
              <svg
                viewBox="0 0 800 460"
                style={{ width: '100%', height: '100%', display: 'block' }}
                aria-hidden="true"
              >
                <defs>
                  <radialGradient id="nodeGlow" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.24" />
                    <stop offset="100%" stopColor="#38BDF8" stopOpacity="0" />
                  </radialGradient>
                </defs>

                {/* Phase-Adaptive Orbital Halo when in Topology or Spatial phase */}
                <circle
                  cx="400"
                  cy="240"
                  r={activePhase === 0 ? 0 : activePhase === 1 ? 150 : 185}
                  fill="none"
                  stroke="rgba(255, 255, 255, 0.06)"
                  strokeDasharray="4 6"
                  style={{ transition: 'all 0.85s cubic-bezier(0.16, 1, 0.3, 1)' }}
                />

                {/* Smooth Bezier Edges connecting morphing nodes */}
                {EDGES.map(([aIdx, bIdx], idx) => {
                  const nA = MORPH_NODES[aIdx];
                  const nB = MORPH_NODES[bIdx];
                  if (!nA || !nB) return null;
                  const [x1, y1] = getCoord(nA);
                  const [x2, y2] = getCoord(nB);
                  const mx = (x1 + x2) / 2;
                  const my = (y1 + y2) / 2 - (activePhase === 2 ? 26 : 0);
                  const pathD = `M ${x1} ${y1} Q ${mx} ${my} ${x2} ${y2}`;

                  return (
                    <path
                      key={idx}
                      d={pathD}
                      fill="none"
                      stroke={activePhase === 2 && idx === 6 ? '#10B981' : 'rgba(255, 255, 255, 0.16)'}
                      strokeWidth={activePhase === 2 && idx === 6 ? 1.8 : 1}
                      style={{ transition: 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1)' }}
                    />
                  );
                })}

                {/* Morphing Vertices */}
                {MORPH_NODES.map((node) => {
                  const [cx, cy] = getCoord(node);
                  const isHighlighted =
                    (activePhase === 0 && node.id === 'root') ||
                    (activePhase === 1 && (node.id === 'src' || node.id === 'api')) ||
                    (activePhase === 2 && (node.id === 'copilot' || node.id === 'scene'));

                  return (
                    <g
                      key={node.id}
                      style={{
                        transform: `translate(${cx}px, ${cy}px)`,
                        transition: 'transform 0.85s cubic-bezier(0.16, 1, 0.3, 1)'
                      }}
                    >
                      {isHighlighted && <circle cx="0" cy="0" r="34" fill="url(#nodeGlow)" />}
                      <circle
                        cx="0"
                        cy="0"
                        r={isHighlighted ? 8 : 5.5}
                        fill="#050506"
                        stroke={node.color}
                        strokeWidth={isHighlighted ? 2 : 1.5}
                      />
                      <rect
                        x="-58"
                        y="14"
                        width="116"
                        height="20"
                        rx="4"
                        fill="rgba(5, 5, 6, 0.82)"
                        stroke="rgba(255, 255, 255, 0.12)"
                        strokeWidth="1"
                      />
                      <text
                        x="0"
                        y="27"
                        textAnchor="middle"
                        fill={isHighlighted ? '#F4F4F6' : '#9499A6'}
                        fontSize="10"
                        fontFamily="'JetBrains Mono', monospace"
                      >
                        {node.label}
                      </text>
                    </g>
                  );
                })}
              </svg>

              {/* Bottom Overlay Status Chip */}
              <div
                style={{
                  position: 'absolute',
                  bottom: '14px',
                  left: '16px',
                  right: '16px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  pointerEvents: 'none'
                }}
              >
                <span className="technical-badge" style={{ borderRadius: '6px' }}>
                  {activePhase === 0 && 'MODE: AST_SYNTAX_TREE'}
                  {activePhase === 1 && 'MODE: FORCE_DIRECTED_EULER'}
                  {activePhase === 2 && 'MODE: BI_DIRECTIONAL_PIN'}
                </span>
                <span className="technical-meta">
                  {activePhase === 2 ? 'CITATION LOCK: ACTIVE' : 'NODES: 8 // DEPTH: 3'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
