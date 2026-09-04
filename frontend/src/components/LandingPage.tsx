import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { LoginModal } from './LoginModal';

gsap.registerPlugin(ScrollTrigger);

interface LandingPageProps {
  onExplore: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onExplore }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const marqueeRef = useRef<HTMLDivElement>(null);
  const cursorDot = useRef<HTMLDivElement>(null);
  const cursorRing = useRef<HTMLDivElement>(null);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  
  useEffect(() => {
    const ctx = gsap.context(() => {
      
      // 0. Custom Cursor
      const moveCursor = (e: MouseEvent) => {
        if (cursorDot.current) {
          gsap.to(cursorDot.current, { x: e.clientX, y: e.clientY, duration: 0.1, ease: 'none' });
        }
        if (cursorRing.current) {
          gsap.to(cursorRing.current, { x: e.clientX, y: e.clientY, duration: 0.4, ease: 'power2.out' });
        }
      };

      const addHoverClass = () => cursorRing.current?.classList.add('active');
      const removeHoverClass = () => cursorRing.current?.classList.remove('active');
      window.addEventListener('mousemove', moveCursor);
      document.querySelectorAll('button, a, .premium-card').forEach(el => {
        el.addEventListener('mouseenter', addHoverClass);
        el.addEventListener('mouseleave', removeHoverClass);
      });

      // 1. Asymmetric Hero Animation
      const tl = gsap.timeline();
      tl.fromTo('.hud-element', 
        { opacity: 0, x: -20 },
        { opacity: 1, x: 0, duration: 0.8, stagger: 0.1, ease: 'power3.out' }
      )
      .to('.reveal-text-inner', {
        y: 0, duration: 1.2, ease: 'power4.out', stagger: 0.1
      }, '-=0.5')
      .fromTo('.hero-fade', 
        { y: 30, opacity: 0 }, 
        { y: 0, opacity: 1, duration: 1, ease: 'power4.out', stagger: 0.2 }, 
        '-=0.8'
      );

      // Hero Underline
      const underline = document.querySelector('.hero-underline') as SVGPathElement;
      if (underline) {
        const ulLen = underline.getTotalLength();
        gsap.set(underline, { strokeDasharray: ulLen, strokeDashoffset: ulLen });
        gsap.to(underline, { strokeDashoffset: 0, duration: 1.5, ease: 'power3.inOut', delay: 1.5 });
      }

      // 2. Marquee
      if (marqueeRef.current) {
        gsap.to('.marquee-content', { xPercent: -50, repeat: -1, duration: 25, ease: 'linear' });
      }

      // 3. Editorial Scroll Triggers
      gsap.utils.toArray('.editorial-section').forEach((section: any) => {
        // Outline number parallax
        const num = section.querySelector('.outline-number');
        if (num) {
          gsap.fromTo(num, 
            { y: 150, opacity: 0 },
            { y: -50, opacity: 1, ease: 'none', scrollTrigger: { trigger: section, start: 'top bottom', end: 'bottom top', scrub: true } }
          );
        }

        const textContent = section.querySelector('.editorial-text');
        const imageContent = section.querySelector('.editorial-image');
        
        if (textContent) {
          gsap.fromTo(textContent, { y: 100, opacity: 0 }, {
            y: 0, opacity: 1, duration: 1.5, ease: 'power3.out',
            scrollTrigger: { trigger: section, start: 'top 75%' }
          });
        }
        
        if (imageContent) {
          gsap.fromTo(imageContent, { scale: 0.9, opacity: 0, rotation: 2 }, {
            scale: 1, opacity: 1, rotation: 0, duration: 1.5, ease: 'power4.out',
            scrollTrigger: { trigger: section, start: 'top 75%' }
          });
        }
      });

      // 4. Parallax Image scale
      gsap.utils.toArray('.parallax-img').forEach((img: any) => {
        gsap.to(img, {
          yPercent: 20, ease: 'none',
          scrollTrigger: { trigger: img.parentElement, start: 'top bottom', end: 'bottom top', scrub: true }
        });
      });

      // 5. Complex Blueprint SVG Paths
      const paths = document.querySelectorAll('.blueprint-path') as NodeListOf<SVGPathElement>;
      paths.forEach((path, i) => {
        const length = path.getTotalLength();
        gsap.set(path, { strokeDasharray: length, strokeDashoffset: length });
        gsap.to(path, {
          strokeDashoffset: 0,
          ease: 'none',
          scrollTrigger: {
            trigger: '.blueprint-container',
            start: 'top 80%',
            end: 'bottom bottom',
            scrub: 0.5 + (i * 0.2)
          }
        });
      });

      return () => {
        window.removeEventListener('mousemove', moveCursor);
        document.querySelectorAll('button, a, .premium-card').forEach(el => {
          el.removeEventListener('mouseenter', addHoverClass);
          el.removeEventListener('mouseleave', removeHoverClass);
        });
      };
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="premium-bg-grid" style={{ width: '100%', minHeight: '100vh', position: 'relative' }}>
      <div ref={cursorDot} className="custom-cursor-dot"></div>
      <div ref={cursorRing} className="custom-cursor-ring"></div>

      {/* Navigation */}
      <header className="responsive-padding" style={{ position: 'fixed', top: 0, width: '100%', padding: '2rem 4rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 100, mixBlendMode: 'difference' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {/* Geometric CodeAtlas Logo */}
          <svg width="24" height="24" viewBox="0 0 100 100" fill="none" style={{ marginTop: '-4px' }}>
            <rect x="20" y="20" width="60" height="60" stroke="white" strokeWidth="6" />
            <path d="M 50 20 L 50 80 M 20 50 L 80 50" stroke="white" strokeWidth="6" />
          </svg>
          <h2 style={{ fontSize: 'clamp(1.2rem, 3vw, 1.5rem)', fontWeight: 'bold' }}>CODEATLAS_</h2>
        </div>
        <nav style={{ display: 'flex', alignItems: 'center', gap: '2.5rem' }}>
          <a href="#architecture" className="tech-label" style={{ textDecoration: 'none', color: '#FFFFFF', border: 'none', display: 'none' }}>ARCHITECTURE</a>
          <a href="#platform" className="tech-label" style={{ textDecoration: 'none', color: '#FFFFFF', border: 'none', display: 'none' }}>PLATFORM</a>
          <button 
            className="premium-button-secondary" 
            style={{ padding: '0.5rem 1rem', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem', mixBlendMode: 'normal' }}
            onClick={() => setIsLoginOpen(true)}
          >
            <i className="fa-solid fa-user"></i> LOG IN
          </button>
        </nav>
      </header>

      {/* Hero Section - Asymmetrical */}
      <section className="responsive-padding" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', padding: '0 4rem', position: 'relative', overflow: 'hidden' }}>
        
        {/* Abstract Glows */}
        <div style={{ position: 'absolute', top: '20%', right: '10%', width: '500px', height: '500px', background: 'radial-gradient(circle, rgba(255,255,255,0.06) 0%, transparent 60%)', filter: 'blur(60px)', pointerEvents: 'none' }}></div>

        <div className="responsive-grid" style={{ maxWidth: '1400px', margin: '0 auto', width: '100%', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'center', paddingLeft: 'clamp(0rem, 5vw, 4rem)', paddingRight: 'clamp(0rem, 5vw, 4rem)' }}>
          
          {/* Left Side: Hero Text */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <h1 style={{ fontSize: 'clamp(3rem, 7vw, 6rem)', lineHeight: 0.9, marginBottom: '2rem', display: 'flex', flexDirection: 'column', textTransform: 'uppercase' }}>
              <span className="reveal-text-wrapper"><span className="reveal-text-inner">SPATIAL</span></span>
              <span className="reveal-text-wrapper"><span className="reveal-text-inner">CODE</span></span>
              <span className="reveal-text-wrapper" style={{ position: 'relative' }}>
                <span className="reveal-text-inner accent-text">ENGINE.</span>
                <svg width="100%" height="20" viewBox="0 0 500 20" preserveAspectRatio="none" style={{ position: 'absolute', bottom: '-15px', left: 0 }}>
                  <path className="hero-underline" d="M 0 10 L 200 10 L 220 20 L 500 20" fill="none" stroke="var(--accent-highlight)" strokeWidth="4" strokeLinecap="square" />
                </svg>
              </span>
            </h1>

            <div className="hero-fade responsive-stack" style={{ display: 'flex', gap: '2rem', alignItems: 'flex-start', marginTop: '2rem' }}>
              <p style={{ fontSize: 'clamp(1rem, 1.5vw, 1.15rem)', maxWidth: '400px', color: 'var(--text-secondary)', fontWeight: 400 }}>
                Abandon standard 2D file trees. Enter a high-performance orchestration environment designed for massive scale architecture.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <button className="premium-button-primary" onClick={onExplore}>INITIALIZE WORKSPACE</button>
                <button className="premium-button-secondary">READ DOCUMENTATION</button>
              </div>
            </div>
          </div>

          {/* Right Side: Creative Bento Grid (New Content) */}
          <div className="hero-fade" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem', width: '100%', maxWidth: '500px' }}>
            
            {/* Bento 1: Neural Graph (Span 2) */}
            <div className="premium-card" style={{ padding: '1.5rem', gridColumn: 'span 2', height: '160px', position: 'relative', overflow: 'hidden', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'linear-gradient(45deg, rgba(29, 78, 216, 0.1), rgba(139, 92, 246, 0.1))', zIndex: 0 }}></div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: "'JetBrains Mono', monospace", zIndex: 1, letterSpacing: '0.1em' }}>LOCAL FOUNDATION</div>
              <div style={{ fontSize: '2rem', fontFamily: 'Valve, sans-serif', zIndex: 1, color: '#fff', position: 'absolute', top: '3rem', left: '1.5rem' }}>OLLAMA OSS 120B</div>
              
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-end', height: '50px', zIndex: 1 }}>
                {[40, 70, 45, 90, 60, 30, 85, 50, 75, 40, 65, 80].map((h, i) => (
                  <div key={i} style={{ flex: 1, height: `${h}%`, backgroundColor: 'var(--accent-highlight)', opacity: 0.5 + (i % 3) * 0.2, borderRadius: '2px 2px 0 0', transformOrigin: 'bottom' }}></div>
                ))}
              </div>
            </div>
            
            {/* Bento 2: Code Synthesis */}
            <div className="premium-card" style={{ padding: '1.5rem', height: '180px', display: 'flex', flexDirection: 'column', gap: '0.75rem', backgroundColor: '#050505', position: 'relative' }}>
               <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: "'JetBrains Mono', monospace", zIndex: 2 }}>CLOUD SYNTHESIS</div>
               <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: 1, justifyContent: 'center', opacity: 0.3, zIndex: 1 }}>
                 <div style={{ width: '80%', height: '8px', backgroundColor: '#333', borderRadius: '4px' }}></div>
                 <div style={{ width: '60%', height: '8px', backgroundColor: '#22c55e', borderRadius: '4px' }}></div>
                 <div style={{ width: '90%', height: '8px', backgroundColor: '#333', borderRadius: '4px' }}></div>
                 <div style={{ width: '40%', height: '8px', backgroundColor: 'var(--accent-highlight)', borderRadius: '4px' }}></div>
               </div>
               <div style={{ position: 'absolute', bottom: '1.5rem', left: '1.5rem', fontSize: '2.5rem', fontFamily: 'Valve, sans-serif', zIndex: 2 }}>GPT</div>
            </div>
            
            {/* Bento 3: 3D Hardware */}
            <div className="premium-card" style={{ padding: '1.5rem', height: '180px', position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
               <div style={{ position: 'absolute', top: '1.5rem', left: '1.5rem', fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: "'JetBrains Mono', monospace", zIndex: 2 }}>EDGE INFERENCE</div>
               
               {/* Abstract 3D shape simulation using CSS */}
               <div style={{ width: '70px', height: '70px', border: '1px solid var(--border-strong)', borderRadius: '12px', transform: 'rotateX(45deg) rotateZ(45deg)', position: 'relative', marginTop: '-1rem', background: 'rgba(255,255,255,0.02)', zIndex: 1 }}>
                 <div style={{ position: 'absolute', top: '-10px', left: '-10px', width: '100%', height: '100%', border: '1px solid var(--accent-highlight)', borderRadius: '12px', opacity: 0.5 }}></div>
                 <div style={{ position: 'absolute', top: '10px', left: '10px', width: '100%', height: '100%', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '12px', opacity: 0.3 }}></div>
               </div>
               
               <div style={{ position: 'absolute', bottom: '1.5rem', right: '1.5rem', fontSize: '1.25rem', fontFamily: 'Valve, sans-serif', zIndex: 2, textAlign: 'right' }}>QWEN<br/>3.8B</div>
            </div>

            {/* Bento 4: Active Processes */}
            <div className="premium-card" style={{ padding: '1.25rem', gridColumn: 'span 2', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{ width: '12px', height: '12px', borderRadius: '2px', border: '1px solid var(--text-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <div style={{ width: '6px', height: '6px', backgroundColor: '#22c55e', animation: 'blink 1.5s infinite' }}></div>
                </div>
                <div style={{ fontSize: '0.85rem', fontFamily: "'JetBrains Mono', monospace", color: '#e5e5e5' }}>SYNCHRONIZED_MODELS</div>
              </div>
              <div style={{ fontSize: '0.9rem', fontFamily: "'JetBrains Mono', monospace", color: 'var(--text-secondary)' }}>QWEN + OLLAMA + GPT</div>
            </div>
            
          </div>
        </div>
      </section>

      {/* Marquee */}
      <div className="marquee-container" ref={marqueeRef} style={{ transform: 'rotate(-2deg) scale(1.05)', zIndex: 20 }}>
        <div className="marquee-content">
          <span className="marquee-text">ORCHESTRATE • VISUALIZE • COLLABORATE • </span>
          <span className="marquee-text">ORCHESTRATE • VISUALIZE • COLLABORATE • </span>
        </div>
      </div>

      {/* Complex Blueprint Area */}
      <main className="blueprint-container" style={{ position: 'relative', zIndex: 10, padding: '10rem 0' }}>
        
        {/* Architectual SVG Blueprint Lines */}
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 0 }}>
          <svg width="100%" height="100%" viewBox="0 0 1000 3000" preserveAspectRatio="none">
            {/* Structural Column Left */}
            <path className="blueprint-path" d="M 100 0 L 100 3000" fill="none" stroke="var(--border-subtle)" strokeWidth="1" />
            <path className="blueprint-path" d="M 120 0 L 120 3000" fill="none" stroke="var(--border-subtle)" strokeWidth="1" strokeDasharray="4 4" />
            
            {/* Structural Column Right */}
            <path className="blueprint-path" d="M 900 0 L 900 3000" fill="none" stroke="var(--border-subtle)" strokeWidth="1" />
            
            {/* Diagonal Intersections */}
            <path className="blueprint-path" d="M 100 500 L 900 800" fill="none" stroke="var(--accent-highlight)" strokeWidth="2" />
            <path className="blueprint-path" d="M 900 1500 L 100 1900" fill="none" stroke="var(--accent-highlight)" strokeWidth="2" />
            
            {/* Technical Brackets */}
            <path className="blueprint-path" d="M 80 400 L 120 400 M 80 900 L 120 900" fill="none" stroke="var(--border-strong)" strokeWidth="2" />
            <path className="blueprint-path" d="M 880 1400 L 920 1400 M 880 2000 L 920 2000" fill="none" stroke="var(--border-strong)" strokeWidth="2" />
          </svg>
        </div>

        {/* Section 02 - Asymmetric Right */}
        <section id="architecture" className="editorial-section responsive-padding" style={{ minHeight: '80vh', position: 'relative', display: 'flex', alignItems: 'center', padding: '0 4rem' }}>
          <div className="outline-number" style={{ top: '0', right: '-5%' }}>02</div>
          <div className="responsive-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', maxWidth: '1400px', margin: '0 auto', width: '100%', position: 'relative', zIndex: 2 }}>
            <div className="editorial-text" style={{ paddingTop: 'clamp(0rem, 5vw, 4rem)' }}>
              <h2 style={{ fontSize: 'clamp(2.5rem, 8vw, 4.5rem)', lineHeight: 1, marginBottom: '2rem', textTransform: 'uppercase' }}>Visual<br/>Clarity.</h2>
              <p style={{ fontSize: '1.15rem', color: 'var(--text-secondary)', maxWidth: '400px' }}>
                We replaced identical styling and vague error messages with deliberate, focal-point driven architecture. Every transition serves a purpose.
              </p>
            </div>
            <div className="editorial-image crosshair-container" style={{ position: 'relative' }}>
              <div style={{ position: 'absolute', top: '-1rem', left: '-1rem', borderTop: '2px solid white', borderLeft: '2px solid white', width: '2rem', height: '2rem', zIndex: 10 }}></div>
              <div style={{ position: 'absolute', bottom: '-1rem', right: '-1rem', borderBottom: '2px solid white', borderRight: '2px solid white', width: '2rem', height: '2rem', zIndex: 10 }}></div>
              <div className="premium-card" style={{ height: '700px', overflow: 'hidden' }}>
                <img className="parallax-img" src="/an open laptop computer sitting on top of a desk next to a notebook and pen.jpg" alt="Laptop" style={{ width: '100%', height: '130%', objectFit: 'cover', top: '-15%', position: 'absolute', filter: 'grayscale(100%) contrast(1.2)' }} />
              </div>
            </div>
          </div>
        </section>

        {/* Section 03 - Asymmetric Left */}
        <section className="editorial-section responsive-padding" style={{ minHeight: '80vh', position: 'relative', display: 'flex', alignItems: 'center', padding: '0 4rem', marginTop: 'clamp(2rem, 10vw, 10rem)' }}>
          <div className="outline-number" style={{ top: '0', left: '-5%' }}>03</div>
          <div className="responsive-grid" style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '4rem', maxWidth: '1400px', margin: '0 auto', width: '100%', position: 'relative', zIndex: 2 }}>
            <div className="editorial-image crosshair-container" style={{ position: 'relative', marginTop: 'clamp(0rem, 5vw, 6rem)' }}>
              <div className="premium-card" style={{ height: '600px', overflow: 'hidden' }}>
                <img className="parallax-img" src="/Coder.jpg" alt="Coder" style={{ width: '100%', height: '130%', objectFit: 'cover', top: '-15%', position: 'absolute', filter: 'grayscale(100%) contrast(1.2)' }} />
              </div>
            </div>
            <div className="editorial-text" style={{ paddingBottom: 'clamp(0rem, 10vw, 8rem)', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <h2 style={{ fontSize: 'clamp(2.5rem, 8vw, 4.5rem)', lineHeight: 1, marginBottom: '2rem', textTransform: 'uppercase' }}>Deliberate<br/>Design.</h2>
              <p style={{ fontSize: '1.15rem', color: 'var(--text-secondary)' }}>
                Using standard system fonts everywhere is a visual cliché. We use the custom Valve font exclusively for brutalist headings, paired with crisp mono for extreme readability.
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="responsive-padding" style={{ padding: '8rem 4rem', borderTop: '1px solid var(--border-subtle)', backgroundColor: 'var(--bg-secondary)', position: 'relative', overflow: 'hidden' }}>
        <div className="outline-number" style={{ bottom: '-10%', right: '0', fontSize: 'clamp(10rem, 20vw, 20rem)' }}>00</div>
        <div className="responsive-stack" style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '2rem', position: 'relative', zIndex: 10 }}>
          <div>
            <h2 style={{ fontSize: 'clamp(3rem, 10vw, 5rem)', marginBottom: '1rem', lineHeight: 1, textTransform: 'uppercase' }}>Start<br/>Orchestrating.</h2>
          </div>
          <button className="premium-button-primary" onClick={onExplore} style={{ padding: '1.5rem 4rem', fontSize: '1.2rem', alignSelf: 'stretch' }}>
            OPEN WORKSPACE
          </button>
        </div>
      </footer>
      
      {/* Login Modal Overlay */}
      <LoginModal 
        isOpen={isLoginOpen} 
        onClose={() => setIsLoginOpen(false)} 
        onLogin={() => {
          setIsLoginOpen(false);
          onExplore();
        }} 
      />

    </div>
  );
};
