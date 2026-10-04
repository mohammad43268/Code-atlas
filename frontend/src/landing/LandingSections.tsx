import React from 'react';
import { Statement } from './sections/Statement';
import { HowItWorks } from './sections/HowItWorks';
import { Features } from './sections/Features';
import { UnderTheHood } from './sections/UnderTheHood';
import { TeamRoadmap } from './sections/TeamRoadmap';
import { CallToAction } from './sections/CallToAction';
import { Footer } from './sections/Footer';

export const LandingSections: React.FC = () => {
  return (
    <>
      <Statement />
      <HowItWorks />
      <Features />
      <UnderTheHood />
      <TeamRoadmap />
      <CallToAction />
      <Footer />
    </>
  );
};
