import React from 'react';
import { motion } from 'framer-motion';
import { HiArrowRight } from 'react-icons/hi';
import { FiMapPin, FiMail, FiPhone, FiClock } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { fadeInUp, fadeInLeft, fadeInRight, staggerContainer } from '../animations';

const contactInfo = [
  { icon: <FiMapPin />, label: 'Address', value: '123 Artistic Lane, Suite 302, NY, USA M5V 1A1' },
  { icon: <FiMail />, label: 'Email', value: 'contact@storystream.com' },
  { icon: <FiPhone />, label: 'Phone', value: '(416) 555-1234' },
  { icon: <FiClock />, label: 'Business Hours', value: 'Sunday - Thursday: 9am to 5pm' },
];

const Contact = () => {
  return (
    <section className="section-padding bg-dark relative overflow-hidden">
      <motion.div
        initial={{ scale: 1.2 }}
        whileInView={{ scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.5 }}
        className="absolute inset-0"
      >
        <img
          src="https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=1920&q=80"
          alt="Contact background"
          className="w-full h-full object-cover opacity-10"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-dark via-dark/95 to-dark" />
      </motion.div>

      <div className="max-w-7xl mx-auto relative">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <motion.span variants={fadeInLeft} className="text-white/50 text-sm uppercase tracking-widest font-medium">
              Get in Touch
            </motion.span>
            <motion.h2 variants={fadeInLeft} custom={1} className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight mt-3 mb-4">
              Not limited to video,<br />
              <span className="gradient-text">we're your creative comrades.</span>
            </motion.h2>
            <motion.p variants={fadeInLeft} custom={2} className="text-white/50 text-lg mb-8">
              Got questions, project ideas, or just want to say hi? We're all ears!
            </motion.p>

            <motion.div variants={fadeInLeft} custom={3} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link to="/contact" className="btn-primary mb-12 inline-flex">
                Let's Collaborate <HiArrowRight />
              </Link>
            </motion.div>

            <div className="space-y-5 mt-8">
              {contactInfo.map((info, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 + index * 0.12, duration: 0.5 }}
                  whileHover={{ x: 8, transition: { duration: 0.2 } }}
                  className="flex items-start gap-4 group cursor-pointer"
                >
                  <motion.span
                    whileHover={{ scale: 1.2, rotate: 10 }}
                    className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center text-white shrink-0 group-hover:bg-white/15 transition-colors"
                  >
                    {info.icon}
                  </motion.span>
                  <div>
                    <h4 className="text-white font-medium text-sm">{info.label}</h4>
                    <p className="text-white/40 text-sm">{info.value}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            variants={fadeInRight}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="flex items-center"
          >
            <motion.div
              whileHover={{ borderColor: 'rgba(255,255,255,0.15)' }}
              className="w-full bg-darkGray border border-white/10 rounded-3xl p-8 lg:p-10 transition-colors"
            >
              <motion.h3
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
                className="text-2xl font-bold text-white mb-2"
              >
                Send us a message
              </motion.h3>
              <p className="text-white/40 text-sm mb-8">We'll get back to you within 24 hours.</p>

              <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                {['Your Name', 'Your Email'].map((placeholder, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: 30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.4 + i * 0.1 }}
                  >
                    <input
                      type={i === 1 ? 'email' : 'text'}
                      placeholder={placeholder}
                      className="w-full bg-dark border border-white/10 rounded-xl px-5 py-3.5 text-white placeholder:text-white/30 focus:border-white/30 focus:outline-none focus:ring-1 focus:ring-white/10 transition-all text-sm"
                    />
                  </motion.div>
                ))}
                <motion.div
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.6 }}
                >
                  <textarea
                    placeholder="Your Message"
                    rows={4}
                    className="w-full bg-dark border border-white/10 rounded-xl px-5 py-3.5 text-white placeholder:text-white/30 focus:border-white/30 focus:outline-none focus:ring-1 focus:ring-white/10 transition-all text-sm resize-none"
                  />
                </motion.div>
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  className="btn-primary w-full justify-center text-sm"
                >
                  Send Message <HiArrowRight />
                </motion.button>
              </form>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
