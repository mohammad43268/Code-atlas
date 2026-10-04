import React, { useEffect } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import Lenis from '@studio-freight/lenis';

import { DataFlow } from './sections/DataFlow';
import { Statement } from './sections/Statement';
import { HowItWorks } from './sections/HowItWorks';
import { Features } from './sections/Features';
import { UnderTheHood } from './sections/UnderTheHood';
import { TeamRoadmap } from './sections/TeamRoadmap';
import { CallToAction } from './sections/CallToAction';
import { Footer } from './sections/Footer';

gsap.registerPlugin(ScrollTrigger);

export const LandingSections: React.FC = () => {
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const lenis = new Lenis({
      lerp: 0.1,
      smoothWheel: true,
    });
    
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);

    if ('fonts' in document) {
      document.fonts.ready.then(() => {
        ScrollTrigger.refresh();
      });
    }

    return () => {
      lenis.destroy();
      gsap.ticker.remove(lenis.raf);
    };
  }, []);

  return (
    <div style={{ position: 'relative', zIndex: 10, background: 'var(--bg)' }}>
      <DataFlow />
      <Statement />
      <HowItWorks />
      <Features />
      <UnderTheHood />
      <TeamRoadmap />
      <CallToAction />
      <Footer />
    </div>
  );
};
