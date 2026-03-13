import React from 'react';
import { motion } from 'framer-motion';
import { pageTransition } from '../animations';
import Hero from '../components/Hero';
import BrandPartners from '../components/BrandPartners';
import Portfolio from '../components/Portfolio';
import Services from '../components/Services';
import Industries from '../components/Industries';
import About from '../components/About';
import Testimonials from '../components/Testimonials';
import FAQ from '../components/FAQ';
import Contact from '../components/Contact';

const HomePage = () => {
  return (
    <motion.div {...pageTransition}>
      <Hero />
      <BrandPartners />
      <Portfolio limit={5} />
      <Services />
      <Industries />
      <About />
      <Testimonials />
      <FAQ />
      <Contact />
    </motion.div>
  );
};

export default HomePage;
