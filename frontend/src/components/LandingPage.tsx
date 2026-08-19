import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from '@studio-freight/lenis';

gsap.registerPlugin(ScrollTrigger);

interface LandingPageProps {
  onExplore: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onExplore }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    // Initialize Lenis for award-winning smooth scroll
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    });
    
    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    const ctx = gsap.context(() => {
      // Intro Timeline
      const tl = gsap.timeline();
      
      tl.from('.landing-header', { y: -30, opacity: 0, duration: 0.8, ease: 'power3.out' })
        .from('.hero-badge', { y: 20, opacity: 0, duration: 0.6, ease: 'power3.out' }, '-=0.4')
        .from('.hero-title', { y: 40, opacity: 0, duration: 0.8, ease: 'power3.out' }, '-=0.4')
        .from('.hero-pitch', { y: 30, opacity: 0, duration: 0.8, ease: 'power3.out' }, '-=0.6')
        .from('.hero-actions', { y: 20, opacity: 0, duration: 0.8, ease: 'power3.out' }, '-=0.6');

      // Removed scroll-based fade animations to guarantee visibility of content

    }, containerRef);
    
    return () => {
      ctx.revert();
      lenis.destroy();
    };
  }, []);

  return (
    <div className="landing-container" ref={containerRef}>
      <header className="landing-header">
        <div className="logo">CodeAtlas</div>
        <nav className="nav-links">
          <a href="#features" className="nav-link">Features</a>
          <a href="#tech" className="nav-link">Architecture</a>
          <a href="https://github.com" className="nav-link">GitHub</a>
        </nav>
      </header>

      <main className="landing-main">
        <section className="landing-hero">
          <h1 className="hero-title">
            Understand Code <br />
            <span className="title-highlight">In Three Dimensions</span>
          </h1>
          <p className="hero-pitch">
            The AI-powered platform that renders any GitHub repository as an explorable 3D world. Navigate dependencies and visualize architecture instantly.
          </p>
          <div className="hero-actions">
            <button className="cta-button primary" onClick={onExplore}>
              Explore Repository
            </button>
            <a href="#features" className="cta-button secondary">Learn More</a>
          </div>
        </section>

        <section id="features" className="content-section">
          <div className="section-header scroll-fade-up">
            <h2 className="section-title">Beyond Static Analysis</h2>
            <p className="section-subtitle">CodeAtlas combines physics-based rendering, grounded AI, and real-time collaboration.</p>
          </div>
          <div className="features-grid">
            <div className="feature-card bento-large">
              <h3>3D Architecture</h3>
              <p>Navigate tens of thousands of files in a force-directed 3D space to instantly understand structure.</p>
            </div>
            <div className="feature-card bento-tall">
              <h3>AI Intelligence</h3>
              <p>Ask plain-language questions. Our local RAG pipeline finds the exact codebase context to answer.</p>
            </div>
            <div className="feature-card bento-small-1">
              <h3>Ripple Analysis</h3>
              <p>Simulate changes and visualize cascading impacts across your entire dependency graph.</p>
            </div>
            <div className="feature-card bento-small-2">
              <h3>Multiplayer</h3>
              <p>Explore code together. See cursors, leave pinned notes, and chat with your team in real-time.</p>
            </div>
          </div>
        </section>

        <section id="tech" className="content-section tech-section-bg">
          <div className="section-header scroll-fade-up">
            <h2 className="section-title">Built for Scale</h2>
            <p className="section-subtitle">A polyglot microservices architecture designed to handle million-line repositories without breaking a sweat.</p>
          </div>
          
          <div className="tech-marquee-wrapper scroll-fade-up">
            <div className="tech-marquee">
              <span className="marquee-item">C++ & WASM Engine</span>
              <span className="marquee-divider">•</span>
              <span className="marquee-item">Python AI RAG</span>
              <span className="marquee-divider">•</span>
              <span className="marquee-item">Node Orchestrator</span>
              <span className="marquee-divider">•</span>
              <span className="marquee-item">Java Parser</span>
              <span className="marquee-divider">•</span>
              <span className="marquee-item">React & Three.js</span>
              <span className="marquee-divider">•</span>
              <span className="marquee-item">Redis & BullMQ</span>
              <span className="marquee-divider">•</span>
            </div>
            <div className="tech-marquee" aria-hidden="true">
              <span className="marquee-item">C++ & WASM Engine</span>
              <span className="marquee-divider">•</span>
              <span className="marquee-item">Python AI RAG</span>
              <span className="marquee-divider">•</span>
              <span className="marquee-item">Node Orchestrator</span>
              <span className="marquee-divider">•</span>
              <span className="marquee-item">Java Parser</span>
              <span className="marquee-divider">•</span>
              <span className="marquee-item">React & Three.js</span>
              <span className="marquee-divider">•</span>
              <span className="marquee-item">Redis & BullMQ</span>
              <span className="marquee-divider">•</span>
            </div>
          </div>
        </section>

        <section className="cta-section scroll-fade-up">
          <h2 className="section-title">Ready to dive in?</h2>
          <p className="section-subtitle">Enter a GitHub repository URL and start exploring.</p>
          <button className="cta-button primary" onClick={onExplore}>
            Launch 3D Explorer
          </button>
        </section>
      </main>

      <footer className="landing-footer">
        <span>© {new Date().getFullYear()} CodeAtlas Engineering Team.</span>
        <a href="https://github.com" className="footer-link">GitHub Repository</a>
      </footer>
    </div>
  );
};
