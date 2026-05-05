import React from 'react';
import Hero from '../components/Hero';
import FeaturesComp from '../components/FeaturesComp';
import Modules from '../components/Modules';
import Contact from './Contact';
import CoreValues from '../components/CoreValues';

function Home() {
  return (
    <main>
      <Hero />
      <Modules />
      <CoreValues />
      <Contact />
    </main>
  );
}

export default Home;
