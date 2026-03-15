import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, useVelocity, useMotionValueEvent, useSpring } from 'framer-motion';
import { HiArrowRight, HiOutlineArrowNarrowRight } from 'react-icons/hi';
import { FiClipboard, FiVideo, FiFilm, FiMonitor, FiCamera, FiMic, FiZap, FiLayers, FiCheckCircle, FiUsers, FiFileText, FiMessageSquare, FiBox, FiPenTool } from 'react-icons/fi';
import { pageTransition } from '../animations';

const phases = [
  {
    icon: <FiClipboard />,
    title: 'Pre-Production',
    description: 'Strategic planning, competitor analysis, content calendars, and creative briefs — laying the foundation.',
    image: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=600&q=80',
    bullets: ['Market Research', 'Strategy & Planning', 'Content Calendar'],
  },
  {
    icon: <FiVideo />,
    title: 'Production',
    description: 'Executing campaigns with precision — ad creatives, reels, shoots, and real-time optimizations.',
    image: 'https://images.unsplash.com/photo-1579632652768-6cb9dcf85912?w=600&q=80',
    bullets: ['Creative Execution', 'Ad Campaigns', 'Shoots & Content'],
  },
  {
    icon: <FiFilm />,
    title: 'Post-Production',
    description: 'Analytics, reporting, iteration, and scaling — turning results into sustained growth.',
    image: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=600&q=80',
    bullets: ['Performance Analysis', 'A/B Testing', 'Scale & Optimize'],
  },
];

const allServices = [
  { icon: <FiMonitor />, title: 'Social Media Marketing', description: 'Boost engagement and build a strong online presence with data-driven social strategies.', image: 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=600&q=80' },
  { icon: <FiZap />, title: 'Off-Page SEO', description: "Increase your site's visibility and authority through backlinks, social sharing, and online promotion.", image: 'https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?w=600&q=80' },
  { icon: <FiLayers />, title: 'Content Creation', description: 'Craft visuals and copy that tell your brand story and drive meaningful conversions.', image: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=600&q=80' },
  { icon: <FiClipboard />, title: 'Paid Advertising', description: 'Run targeted campaigns on Google & Meta for measurable, ROI-positive results.', image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&q=80' },
  { icon: <FiCamera />, title: 'Branding & Design', description: 'Develop a memorable identity that connects with your audience across every touchpoint.', image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=600&q=80' },
  { icon: <FiMic />, title: 'Reels Shoot & Edit', description: 'Create engaging short videos that capture attention and drive engagement at scale.', image: 'https://images.unsplash.com/photo-1536240478700-b869070f9279?w=600&q=80' },
];

const stats = [
  { value: '150+', label: 'Projects Delivered' },
  { value: '50+', label: 'Happy Clients' },
  { value: '3x', label: 'Avg. ROI Increase' },
  { value: '24/7', label: 'Dedicated Support' },
];

const onboardingSteps = [
  {
    icon: <FiUsers />,
    title: 'Coordinate',
    description: 'We meet with you to understand your vision, goals, and brand identity.',
    step: '01'
  },
  {
    icon: <FiFileText />,
    title: 'Requirements',
    description: 'We analyze exactly what services and solutions fit your business needs.',
    step: '02'
  },
  {
    icon: <FiMessageSquare />,
    title: 'Team Discussion',
    description: 'Our experts brainstorm to craft the perfect strategy for your campaign.',
    step: '03'
  },
  {
    icon: <FiBox />,
    title: 'Package Selection',
    description: 'We propose the best service package tailored to your budget and goals.',
    step: '04'
  },
  {
    icon: <FiPenTool />,
    title: 'Agreement',
    description: 'We finalize the contract and kick off the project immediately.',
    step: '05'
  },
];

// Fold-away section wrapper — folds on desktop always, on mobile only if mobileEnabled
const FoldSection = ({ children, className = '', mobileEnabled = false }) => {
  const ref = useRef(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 1024);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  const shouldFold = !isMobile || mobileEnabled;

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  });

  const rotateX = useTransform(scrollYProgress, [0, 1], [0, shouldFold ? -60 : 0]);
  const y = useTransform(scrollYProgress, [0, 1], ['0%', shouldFold ? '-25%' : '0%']);
  const scale = useTransform(scrollYProgress, [0, 1], [1, shouldFold ? 0.9 : 1]);
  const opacity = useTransform(scrollYProgress, [0, 0.85], [1, shouldFold ? 0 : 1]);

  return (
    <div ref={ref} style={{ perspective: shouldFold ? '1200px' : 'none' }} className="relative">
      <motion.div
        style={shouldFold ? { rotateX, y, scale, opacity, transformOrigin: 'top center' } : {}}
        className={className}
      >
        {children}
      </motion.div>
    </div>
  );
};

// Slide-away section — smooth zoom-out + slide-up + velocity-based blur on scroll
const SlideAwaySection = ({ children, className = '' }) => {
  const ref = useRef(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 1024);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  });

  // Detect scroll velocity for blur
  const scrollVelocity = useVelocity(scrollYProgress);
  const smoothVelocity = useSpring(scrollVelocity, { damping: 30, stiffness: 200 });
  const velocityBlur = useTransform(smoothVelocity, [-1, 0, 1], isMobile ? ['blur(0px)', 'blur(0px)', 'blur(0px)'] : ['blur(6px)', 'blur(0px)', 'blur(6px)']);

  const y = useTransform(scrollYProgress, [0, 1], ['0%', isMobile ? '0%' : '-15%']);
  const scale = useTransform(scrollYProgress, [0, 1], [1, isMobile ? 1 : 0.88]);
  const opacity = useTransform(scrollYProgress, [0, 0.7, 1], [1, isMobile ? 1 : 0.6, isMobile ? 1 : 0]);
  const borderRadius = useTransform(scrollYProgress, [0, 1], ['0px', isMobile ? '0px' : '24px']);

  return (
    <div ref={ref} className="relative">
      <motion.div
        style={{ y, scale, opacity, filter: velocityBlur, borderRadius, overflow: 'hidden' }}
        className={className}
      >
        {children}
      </motion.div>
    </div>
  );
};

const ServicesPage = () => {
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const bgY = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
  const bgScale = useTransform(scrollYProgress, [0, 1], [1, 1.15]);
  const textY = useTransform(scrollYProgress, [0, 1], ['0%', '40%']);
  const textOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const overlayOpacity = useTransform(scrollYProgress, [0, 0.8], [0.3, 0.85]);

  return (
    <motion.div {...pageTransition}>

      {/* ─── FULL-SCREEN HERO ─── */}
      <FoldSection mobileEnabled>
        <section ref={heroRef} className="relative h-screen min-h-[600px] overflow-hidden flex items-end">
          <motion.div className="absolute inset-0" style={{ y: bgY }}>
            <motion.img
              src="https://images.unsplash.com/photo-1552664730-d307ca884978?w=1920&q=80"
              alt="Services"
              className="w-full h-full object-cover"
              style={{ scale: bgScale }}
              initial={{ scale: 1.1 }}
              animate={{ scale: 1 }}
              transition={{ duration: 1.6, ease: [0.33, 1, 0.68, 1] }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-dark via-dark/70 to-dark/30" />
            <div className="absolute inset-0 bg-gradient-to-r from-dark/80 to-transparent" />
            <motion.div className="absolute inset-0 bg-dark" style={{ opacity: overlayOpacity }} />
          </motion.div>

          <motion.div
            className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative w-full pb-16 sm:pb-24"
            style={{ y: textY, opacity: textOpacity }}
          >
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: '4rem' }}
              transition={{ delay: 0.1, duration: 0.7, ease: 'easeOut' }}
              className="h-[3px] bg-gradient-to-r from-accent2 to-accent1 mb-8 rounded-full"
            />
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.5, ease: [0.33, 1, 0.68, 1] }}
              className="text-white/50 text-sm uppercase tracking-[0.2em] font-medium block mb-4"
            >
              What We Do
            </motion.span>
            <motion.h1
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25, duration: 0.7, ease: [0.33, 1, 0.68, 1] }}
              className="text-5xl sm:text-6xl lg:text-8xl font-bold leading-[0.95] text-white"
            >
              Our Services
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6, ease: [0.33, 1, 0.68, 1] }}
              className="text-white/50 text-base sm:text-lg mt-6 max-w-2xl leading-relaxed"
            >
              From strategy to execution, we craft digital marketing campaigns that grow brands, drive engagement, and deliver measurable results.
            </motion.p>

            {/* Scroll indicator */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1, duration: 0.5 }}
              className="mt-12 flex items-center gap-3"
            >
              <motion.div
                animate={{ y: [0, 8, 0] }}
                transition={{ repeat: Infinity, duration: 1.6, ease: 'easeInOut' }}
                className="w-5 h-8 border-2 border-white/30 rounded-full flex justify-center pt-1"
              >
                <motion.div
                  animate={{ y: [0, 8, 0], opacity: [1, 0.3, 1] }}
                  transition={{ repeat: Infinity, duration: 1.6, ease: 'easeInOut' }}
                  className="w-1 h-2 bg-white/60 rounded-full"
                />
              </motion.div>
              <span className="text-white/30 text-xs uppercase tracking-widest">Scroll to explore</span>
            </motion.div>
          </motion.div>
        </section>
      </FoldSection>

      {/* ─── STATS BAND ─── */}
      <section className="bg-darkGray border-y border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
            {stats.map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5, ease: [0.33, 1, 0.68, 1] }}
                className="text-center"
              >
                <div className="text-3xl sm:text-4xl lg:text-5xl font-bold gradient-text mb-2">{stat.value}</div>
                <div className="text-white/40 text-sm uppercase tracking-wider">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── OUR PROCESS — TIMELINE ─── */}
      <FoldSection>
        <section className="section-padding bg-dark relative overflow-hidden">
          {/* Subtle background texture */}
          <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '40px 40px' }} />

          <div className="max-w-7xl mx-auto relative">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-center mb-20"
            >
              <span className="text-white/40 text-sm uppercase tracking-[0.2em] font-medium">Our Process</span>
              <h2 className="section-title mt-3">From Concept to <span className="gradient-text">Completion</span></h2>
              <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: '5rem' }}
                viewport={{ once: true }}
                transition={{ delay: 0.3, duration: 0.6 }}
                className="h-[2px] bg-gradient-to-r from-accent2 to-accent1 mx-auto mt-5 rounded-full"
              />
            </motion.div>

            {/* Process cards — vertical on mobile, horizontal on desktop */}
            <div className="space-y-8 lg:space-y-0 lg:grid lg:grid-cols-3 lg:gap-0 relative">
              {/* Connecting line (desktop only) */}
              <motion.div
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1, delay: 0.3, ease: [0.33, 1, 0.68, 1] }}
                className="hidden lg:block absolute top-[140px] left-[16.67%] right-[16.67%] h-[1px] bg-gradient-to-r from-accent2/50 via-white/10 to-accent1/50 origin-left z-0"
              />

              {phases.map((phase, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{ delay: i * 0.15, duration: 0.5, ease: [0.33, 1, 0.68, 1] }}
                  className="relative z-10 px-0 lg:px-4"
                >
                  <div className="group bg-darkGray border border-white/[0.06] rounded-2xl overflow-hidden hover:border-white/15 transition-colors duration-300">
                    {/* Image */}
                    <div className="relative h-52 sm:h-56 overflow-hidden">
                      <img
                        src={phase.image}
                        alt={phase.title}
                        className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-darkGray via-darkGray/40 to-transparent" />

                      {/* Step indicator */}
                      <div className="absolute top-4 left-4 flex items-center gap-3">
                        <div className="w-12 h-12 bg-dark/80 backdrop-blur-sm border border-white/10 rounded-xl flex items-center justify-center text-white/80 text-xl">
                          {phase.icon}
                        </div>
                      </div>
                      <div className="absolute top-4 right-4">
                        <div className="bg-gradient-to-r from-accent2 to-accent1 text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full">
                          Step 0{i + 1}
                        </div>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-white mb-3 group-hover:text-white/80 transition-colors">{phase.title}</h3>
                      <p className="text-white/40 text-sm leading-relaxed mb-5">{phase.description}</p>
                      <div className="space-y-2">
                        {phase.bullets.map((b, bi) => (
                          <div key={bi} className="flex items-center gap-2.5 text-white/50 text-sm">
                            <FiCheckCircle className="text-accent2 text-xs flex-shrink-0" />
                            <span>{b}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </FoldSection>

      {/* ─── WHAT WE OFFER ─── */}
      <SlideAwaySection>
        <section className="section-padding bg-darkGray relative overflow-hidden">
          {/* Decorative blurs */}
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-accent1/[0.03] rounded-full blur-[120px] pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-accent2/[0.03] rounded-full blur-[100px] pointer-events-none" />

          <div className="max-w-7xl mx-auto relative">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-center mb-16"
            >
              <span className="text-white/40 text-sm uppercase tracking-[0.2em] font-medium">Services</span>
              <h2 className="section-title mt-3">What We <span className="gradient-text">Offer</span></h2>
              <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: '5rem' }}
                viewport={{ once: true }}
                transition={{ delay: 0.3, duration: 0.6 }}
                className="h-[2px] bg-gradient-to-r from-accent2 to-accent1 mx-auto mt-5 rounded-full"
              />
              <p className="text-white/40 text-base mt-6 max-w-2xl mx-auto leading-relaxed">
                End-to-end digital marketing solutions tailored to your brand's goals and audience.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
              {allServices.map((service, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{ delay: (i % 3) * 0.1, duration: 0.5, ease: [0.33, 1, 0.68, 1] }}
                  whileHover={{ y: -8, transition: { duration: 0.25, ease: 'easeOut' } }}
                  className="group relative bg-dark border border-white/[0.06] rounded-2xl overflow-hidden hover:border-white/15 transition-colors duration-300 cursor-pointer"
                >
                  {/* Top image band */}
                  <div className="relative h-40 sm:h-44 overflow-hidden">
                    <img
                      src={service.image}
                      alt={service.title}
                      className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-dark via-dark/60 to-dark/20" />
                    {/* Icon floating over image */}
                    <div className="absolute bottom-4 left-5 w-12 h-12 bg-dark/80 backdrop-blur-sm border border-white/10 rounded-xl flex items-center justify-center text-white/80 text-xl group-hover:border-accent1/30 transition-colors duration-300">
                      {service.icon}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-5 sm:p-6">
                    <h3 className="text-white font-bold text-lg mb-2 group-hover:text-white/80 transition-colors duration-300">{service.title}</h3>
                    <p className="text-white/35 text-sm leading-relaxed mb-4">{service.description}</p>
                    <div className="inline-flex items-center gap-2 text-white/30 text-sm group-hover:text-accent1 transition-colors duration-300">
                      <span>Learn More</span>
                      <HiArrowRight className="group-hover:translate-x-1 transition-transform duration-300" />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </SlideAwaySection>

      {/* ─── HOW WE WORK ─── */}
      <section className="section-padding bg-dark relative border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <span className="text-white/40 text-sm uppercase tracking-[0.2em] font-medium">Workflow</span>
            <h2 className="section-title mt-3">How We <span className="gradient-text">Work</span></h2>
            <motion.div
              initial={{ width: 0 }}
              whileInView={{ width: '5rem' }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="h-[2px] bg-gradient-to-r from-accent2 to-accent1 mx-auto mt-5 rounded-full"
            />
          </motion.div>

          <div className="relative">
             {/* Connecting line for desktop */}
            <div className="hidden lg:block absolute top-12 left-[10%] right-[10%] h-[1px] bg-gradient-to-r from-white/5 via-white/20 to-white/5 -z-0" />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
              {onboardingSteps.map((step, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.5 }}
                  className="relative group"
                >
                   {/* Step Number Circle */}
                  <div className="w-24 h-24 mx-auto bg-darkGray border border-white/10 rounded-full flex items-center justify-center mb-6 group-hover:border-accent1/50 transition-colors duration-300 relative z-10">
                    <div className="text-3xl text-white/80 group-hover:text-accent1 transition-colors duration-300">
                      {step.icon}
                    </div>
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-accent2 to-accent1 rounded-full flex items-center justify-center text-[10px] font-bold text-white">
                      {step.step}
                    </div>
                  </div>

                  <div className="text-center px-2">
                    <h3 className="text-lg font-bold text-white mb-3">{step.title}</h3>
                    <p className="text-white/40 text-sm leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── CTA SECTION ─── */}
      <section className="relative py-24 sm:py-32 overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1557804506-669a67965ba0?w=1920&q=80"
            alt="CTA"
            className="w-full h-full object-cover opacity-10"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-dark via-dark/95 to-dark" />
        </div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative text-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.33, 1, 0.68, 1] }}
          >
            <span className="text-white/40 text-sm uppercase tracking-[0.2em] font-medium block mb-4">Ready to Grow?</span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight text-white">
              Let's Build Something <span className="gradient-text">Extraordinary</span>
            </h2>
            <p className="text-white/40 text-base sm:text-lg mt-5 max-w-xl mx-auto leading-relaxed">
              Partner with us and turn your digital vision into a reality that delivers real, measurable impact.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-10">
              <motion.a
                href="/contact"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                className="btn-primary text-base px-8 py-3.5"
              >
                Start a Project <HiOutlineArrowNarrowRight className="text-lg" />
              </motion.a>
              <motion.a
                href="/projects"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                className="btn-outline text-base px-8 py-3.5"
              >
                View Our Work
              </motion.a>
            </div>
          </motion.div>
        </div>
      </section>

    </motion.div>
  );
};

export default ServicesPage;