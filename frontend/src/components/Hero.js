import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { FiPlay } from 'react-icons/fi';
import { HiArrowRight } from 'react-icons/hi';
import { Link } from 'react-router-dom';
import { fadeInUp, fadeInLeft, staggerContainer, floatingAnimation } from '../animations';

const Hero = () => {
  const headingText = 'Turning Video into Vibrant Conversations.';
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  });

  const rotateX = useTransform(scrollYProgress, [0, 1], [0, -90]);
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '-40%']);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.85]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <section ref={sectionRef} className="relative min-h-screen" style={{ perspective: '1200px' }}>
      <motion.div
        style={{
          rotateX,
          y,
          scale,
          opacity,
          transformOrigin: 'top center',
        }}
        className="relative min-h-screen flex items-center overflow-hidden"
      >
      {/* Animated Background */}
      <motion.div
        initial={{ scale: 1.2 }}
        animate={{ scale: 1 }}
        transition={{ duration: 2, ease: 'easeOut' }}
        className="absolute inset-0"
      >
        <img
          src="https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=1920&q=80"
          alt="Video production background"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-dark via-dark/80 to-dark/40" />
        <div className="absolute inset-0 bg-gradient-to-t from-dark via-transparent to-dark/50" />
      </motion.div>

      {/* Animated Particles / Decorative */}
      <motion.div
        animate={{ opacity: [0.3, 0.6, 0.3], scale: [1, 1.2, 1] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-20 right-20 w-72 h-72 bg-white/5 rounded-full blur-3xl"
      />
      <motion.div
        animate={{ opacity: [0.2, 0.5, 0.2], scale: [1, 1.3, 1] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
        className="absolute bottom-20 left-10 w-60 h-60 bg-white/5 rounded-full blur-3xl"
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-48 pb-20">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="max-w-3xl"
        >
          {/* Animated Heading - letter by letter */}
          <motion.h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold leading-tight mb-6">
            {headingText.split(' ').map((word, wi) => (
              <span key={wi} className="inline-block mr-[0.3em]">
                {word.split('').map((char, ci) => (
                  <motion.span
                    key={ci}
                    initial={{ opacity: 0, y: 50, rotateX: -90 }}
                    animate={{ opacity: 1, y: 0, rotateX: 0 }}
                    transition={{
                      duration: 0.5,
                      delay: wi * 0.08 + ci * 0.03 + 0.3,
                      ease: [0.25, 0.46, 0.45, 0.94],
                    }}
                    className={`inline-block ${
                      word === 'Vibrant' ? 'gradient-text' : 'text-white'
                    }`}
                  >
                    {char}
                  </motion.span>
                ))}
              </span>
            ))}
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            variants={fadeInUp}
            custom={2}
            className="text-white/60 text-lg sm:text-xl max-w-xl mb-10 leading-relaxed"
          >
            We're your friendly video wizards creating fantastic commercials, corporate videos, social ads and many more.
          </motion.p>

          {/* CTAs */}
          <motion.div variants={fadeInUp} custom={3} className="flex flex-wrap items-center gap-4">
            <motion.div whileHover={{ scale: 1.05, y: -3 }} whileTap={{ scale: 0.95 }}>
              <Link to="/projects" className="btn-primary text-base">
                See Projects <HiArrowRight />
              </Link>
            </motion.div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="btn-outline group"
            >
              <motion.span
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.5 }}
                className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center group-hover:bg-white group-hover:text-dark transition-all"
              >
                <FiPlay className="ml-0.5" />
              </motion.span>
              Play Showreel
            </motion.button>
          </motion.div>

          {/* Animated Stats */}
          <motion.div
            variants={fadeInUp}
            custom={4}
            className="flex flex-wrap gap-8 mt-16 pt-8 border-t border-white/10"
          >
            {[
              { value: '15+', label: 'Years Experience' },
              { value: '478', label: 'Projects Done' },
              { value: '350+', label: 'Happy Clients' },
            ].map((stat, i) => (
              <motion.div
                key={i}
                whileHover={{ y: -5, scale: 1.05 }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.5 + i * 0.2, duration: 0.5 }}
                  className="text-3xl font-bold text-white"
                >
                  {stat.value}
                </motion.span>
                <p className="text-white/50 text-sm mt-1">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>

      {/* Floating side element */}
      <motion.div
        {...floatingAnimation}
        className="absolute right-10 top-1/2 -translate-y-1/2 hidden xl:block"
      >
        <motion.div
          variants={fadeInLeft}
          initial="hidden"
          animate="visible"
          className="w-1 h-32 bg-gradient-to-b from-transparent via-white/30 to-transparent rounded-full"
        />
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="text-white/40 text-xs uppercase tracking-widest">Scroll</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          className="w-5 h-8 border-2 border-white/30 rounded-full flex justify-center"
        >
          <motion.div className="w-1 h-2 bg-white rounded-full mt-1" />
        </motion.div>
      </motion.div>
      </motion.div>
    </section>
  );
};

export default Hero;
