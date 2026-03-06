import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { HiArrowRight } from 'react-icons/hi';
import { Link } from 'react-router-dom';
import { useRef } from 'react';
import { fadeInUp, fadeInRight, staggerContainer } from '../animations';

const stats = [
  { value: '15+', label: 'Years of Experience' },
  { value: '200+', label: 'Repeated Clients' },
  { value: '478', label: 'Completed Projects' },
  { value: '350+', label: 'Happy Clients' },
];

const About = () => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });
  const imageY = useTransform(scrollYProgress, [0, 1], [50, -50]);

  return (
    <section ref={ref} className="section-padding bg-darkGray relative overflow-hidden">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
        className="absolute -top-40 -right-40 w-80 h-80 border border-white/5 rounded-full"
      />
      <motion.div
        animate={{ rotate: -360 }}
        transition={{ duration: 50, repeat: Infinity, ease: 'linear' }}
        className="absolute -bottom-20 -left-20 w-60 h-60 border border-white/5 rounded-full"
      />

      <div className="max-w-7xl mx-auto relative">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -80 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="relative"
          >
            <motion.div style={{ y: imageY }} className="relative rounded-2xl overflow-hidden">
              <motion.img
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.6 }}
                src="https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=800&q=80"
                alt="About our agency"
                className="w-full h-[500px] object-cover rounded-2xl"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-darkGray/60 to-transparent" />
            </motion.div>

            <motion.div
              initial={{ scale: 0, rotate: -20 }}
              whileInView={{ scale: 1, rotate: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6, type: 'spring', stiffness: 200 }}
              whileHover={{ scale: 1.1, rotate: 5 }}
              className="absolute -bottom-6 -right-6 bg-gradient-to-r from-accent1 to-accent2 rounded-2xl p-6 shadow-2xl cursor-pointer"
            >
              <motion.span
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 1 }}
                className="text-4xl font-bold text-white"
              >
                15+
              </motion.span>
              <p className="text-white/70 text-sm font-medium mt-1">Years of<br />Experience</p>
            </motion.div>

            <motion.div
              animate={{ y: [0, -10, 0], rotate: [0, 5, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute top-4 -left-4 bg-dark border border-white/20 rounded-xl p-3 shadow-xl"
            >
              <span className="text-white text-lg">★</span>
              <span className="text-white/70 text-xs ml-1">Top Rated</span>
            </motion.div>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <motion.span variants={fadeInRight} className="text-white/50 text-sm uppercase tracking-widest font-medium">
              About Us
            </motion.span>
            <motion.h2 variants={fadeInRight} custom={1} className="section-title mt-3 mb-6">
              About Our Agency
            </motion.h2>
            <motion.p variants={fadeInRight} custom={2} className="text-white/60 leading-relaxed mb-4">
              Established in 2015, we have dedicated ourselves to crafting captivating visual narratives defined by creativity, innovation, and an unwavering commitment to excellence in video production.
            </motion.p>
            <motion.p variants={fadeInRight} custom={3} className="text-white/50 leading-relaxed mb-8">
              Our mission is clear: to transform ideas into compelling visual stories. We believe that every project is an opportunity to create something extraordinary.
            </motion.p>

            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8"
            >
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  variants={fadeInUp}
                  custom={index}
                  whileHover={{
                    y: -8,
                    borderColor: 'rgba(255,255,255,0.2)',
                    transition: { duration: 0.3 },
                  }}
                  className="text-center p-4 bg-dark/50 rounded-xl border border-white/5 cursor-pointer"
                >
                  <motion.span
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.5 + index * 0.15, type: 'spring', stiffness: 200 }}
                    className="text-2xl lg:text-3xl font-bold text-white inline-block"
                  >
                    {stat.value}
                  </motion.span>
                  <p className="text-white/40 text-xs mt-2 uppercase tracking-wider">{stat.label}</p>
                </motion.div>
              ))}
            </motion.div>

            <motion.div variants={fadeInUp} custom={5} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link to="/about" className="btn-primary">
                Know More About Us <HiArrowRight />
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default About;
