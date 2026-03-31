import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { pageTransition, fadeInUp, fadeInRight, staggerContainer } from '../animations';
import Testimonials from '../components/Testimonials';
import { fetchTeam, fetchStats, fetchValues } from '../data/teamApi';

const AboutPage = () => {
  const [team, setTeam] = useState([]);
  const [stats, setStats] = useState([]);
  const [values, setValues] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([fetchTeam(), fetchStats(), fetchValues()])
      .then(([teamData, statsData, valuesData]) => {
        setTeam(teamData);
        setStats(statsData);
        setValues(valuesData);
      })
      .catch((err) => console.error('Failed to fetch about data:', err))
      .finally(() => setLoading(false));
  }, []);
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const bgY = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
  const bgScale = useTransform(scrollYProgress, [0, 1], [1, 1.15]);
  const textY = useTransform(scrollYProgress, [0, 1], ['0%', '40%']);
  const textOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const overlayOpacity = useTransform(scrollYProgress, [0, 0.8], [0.3, 0.85]);

  const storyRef = useRef(null);
  const { scrollYProgress: storyScroll } = useScroll({ target: storyRef, offset: ['start end', 'end start'] });
  const storyImgY = useTransform(storyScroll, [0, 1], [40, -40]);

  return (
    <motion.div {...pageTransition}>

      {/* ─── FULL-SCREEN HERO ─── */}
      <section ref={heroRef} className="relative h-screen min-h-[600px] overflow-hidden flex items-end">
        <motion.div className="absolute inset-0" style={{ y: bgY }}>
          <motion.img
            src="https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=1920&q=80"
            alt="About"
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
            About Us
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.7, ease: [0.33, 1, 0.68, 1] }}
            className="text-5xl sm:text-6xl lg:text-8xl font-bold leading-[0.95] text-white"
          >
            About Our Agency
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6, ease: [0.33, 1, 0.68, 1] }}
            className="text-white/50 text-base sm:text-lg mt-6 max-w-2xl leading-relaxed"
          >
            Crafting captivating visual narratives with creativity, innovation, and an unwavering commitment to excellence.
          </motion.p>

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

      {/* ─── OUR STORY ─── */}
      <section ref={storyRef} className="section-padding bg-dark">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Image side */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: [0.33, 1, 0.68, 1] }}
              className="relative"
            >
              <motion.div style={{ y: storyImgY }} className="rounded-2xl overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=800&q=80"
                  alt="Our story"
                  className="w-full h-[420px] sm:h-[500px] object-cover"
                  loading="lazy"
                />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3, duration: 0.5, ease: [0.33, 1, 0.68, 1] }}
                className="absolute -bottom-6 -right-4 sm:-right-6 bg-gradient-to-r from-accent2 to-accent1 rounded-2xl p-6 shadow-2xl"
              >
                <span className="text-4xl font-bold text-white">2022</span>
                <p className="text-white/70 text-sm font-medium mt-1">Established</p>
              </motion.div>
            </motion.div>

            {/* Text side */}
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <motion.div
                variants={fadeInRight}
                className="w-10 h-[2px] bg-gradient-to-r from-accent2 to-accent1 mb-6 rounded-full"
              />
              <motion.h2 variants={fadeInRight} className="section-title mb-6">Our Story</motion.h2>
              <motion.p variants={fadeInRight} custom={1} className="text-white/55 leading-relaxed mb-4">
Founded in 2022, DigiVents is a digital marketing and event management agency based in Birtamode, Jhapa. The company specializes in social media marketing, branding, corporate events, musical concerts, and live experiences. By combining creativity, strategy, and technology, DigiVents helps businesses grow their online presence while delivering impactful events.              </motion.p>
              <motion.p variants={fadeInRight} custom={2} className="text-white/45 leading-relaxed mb-8">
Since its launch, the agency has successfully organized various events and live performances, creating engaging experiences and effective digital campaigns for its clients.              </motion.p>
              <motion.div variants={fadeInRight} custom={3} className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                {stats.map((stat, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 + i * 0.1, duration: 0.5, ease: [0.33, 1, 0.68, 1] }}
                    whileHover={{ y: -5, transition: { duration: 0.2 } }}
                    className="text-center p-4 bg-darkGray/50 rounded-xl border border-white/[0.06] hover:border-white/15 transition-colors duration-300"
                  >
                    <span className="text-2xl font-bold gradient-text">{stat.value}</span>
                    <p className="text-white/35 text-xs mt-1 uppercase tracking-wider">{stat.label}</p>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ─── VALUES ─── */}
      <section className="section-padding bg-darkGray relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '40px 40px' }} />
        <div className="max-w-7xl mx-auto relative">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: [0.33, 1, 0.68, 1] }}
            className="text-center mb-16"
          >
            <span className="text-white/40 text-sm uppercase tracking-[0.2em] font-medium">Our Values</span>
            <h2 className="section-title mt-3">What Drives <span className="gradient-text">Us</span></h2>
            <motion.div
              initial={{ width: 0 }}
              whileInView={{ width: '5rem' }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="h-[2px] bg-gradient-to-r from-accent2 to-accent1 mx-auto mt-5 rounded-full"
            />
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
            {values.map((val, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ delay: (i % 4) * 0.1, duration: 0.5, ease: [0.33, 1, 0.68, 1] }}
                whileHover={{ y: -8, transition: { duration: 0.25, ease: 'easeOut' } }}
                className="p-6 bg-dark border border-white/[0.06] rounded-2xl text-center group cursor-pointer hover:border-white/15 transition-colors duration-300"
              >
                <div className="w-14 h-14 bg-gradient-to-br from-accent2/20 to-accent1/20 rounded-2xl flex items-center justify-center mx-auto mb-5 group-hover:from-accent2/30 group-hover:to-accent1/30 transition-all duration-300">
                  <span className="text-white/80 text-xl font-bold">0{i + 1}</span>
                </div>
                <h3 className="text-white font-bold text-lg mb-2 group-hover:text-white/80 transition-colors duration-300">{val.title}</h3>
                <p className="text-white/35 text-sm leading-relaxed">{val.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── TEAM ─── */}
      <section className="section-padding bg-dark">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: [0.33, 1, 0.68, 1] }}
            className="text-center mb-16"
          >
            <span className="text-white/40 text-sm uppercase tracking-[0.2em] font-medium">Our Team</span>
            <h2 className="section-title mt-3">Meet the <span className="gradient-text">Creators</span></h2>
            <motion.div
              initial={{ width: 0 }}
              whileInView={{ width: '5rem' }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="h-[2px] bg-gradient-to-r from-accent2 to-accent1 mx-auto mt-5 rounded-full"
            />
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {team.map((member, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ delay: (i % 4) * 0.1, duration: 0.5, ease: [0.33, 1, 0.68, 1] }}
                whileHover={{ y: -8, transition: { duration: 0.25, ease: 'easeOut' } }}
                className="group text-center"
              >
                <div className="relative overflow-hidden rounded-2xl mb-5 border border-white/[0.06] group-hover:border-white/15 transition-colors duration-300">
                  <img
                    src={member.image || 'https://via.placeholder.com/400x600/1a1a1a/666666?text=No+Photo'}
                    alt={member.name}
                    className="w-full h-72 object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                    loading="lazy"
                    onError={(e) => {
                      console.error('Image failed to load:', member.image);
                      e.target.src = 'https://via.placeholder.com/400x600/1a1a1a/666666?text=No+Photo';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-dark/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
                <h3 className="text-white font-bold text-lg group-hover:text-white/80 transition-colors duration-300">{member.name}</h3>
                <p className="text-white/35 text-sm mt-1">{member.role}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Testimonials />
    </motion.div>
  );
};

export default AboutPage;
