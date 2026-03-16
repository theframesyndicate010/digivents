import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { fadeInUp, staggerContainer } from '../animations';
import { useTheme } from './ThemeContext';
import logo from '../assets/logo.png';
import { fetchSocialLinks } from '../data/socialApi';

const quickLinks = [
  { name: 'Home', path: '/' },
  { name: 'Projects', path: '/projects' },
  { name: 'Services', path: '/services' },
  { name: 'About', path: '/about' },
  { name: 'Contact', path: '/contact' },
];

const legalLinks = [
  { name: 'Privacy Policy', path: '#' },
  { name: 'Terms & Conditions', path: '#' },
  { name: 'Refund Policy', path: '#' },
];

const Footer = () => {
  const [socialLinks, setSocialLinks] = useState([]);
  const { isDark } = useTheme();

  useEffect(() => {
    fetchSocialLinks()
      .then((data) => setSocialLinks(data))
      .catch((err) => console.error('Failed to fetch social links:', err));
  }, []);

  return (
    <footer className={`border-t overflow-hidden transition-colors duration-300 ${
      isDark 
        ? 'bg-darkGray border-white/10'
        : 'bg-lightGrayBg border-gray-200'
    }`}>
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          <motion.div variants={fadeInUp} className="lg:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-5">
              <motion.img
                      src={logo}
                             alt="Digivents Logo"
                             whileHover={{ scale: 1.05 }}
                             whileTap={{ scale: 0.95 }}
                             className="h-12 sm:h-16 md:h-20 w-auto"
              />
            </Link>
            <p className={`text-sm leading-relaxed mb-6 ${
              isDark ? 'text-white/40' : 'text-gray-600'
            }`}>
              Turning Video into Vibrant Conversations. Your friendly video wizards creating fantastic visual content.
            </p>
            <div className="flex gap-3">
              {socialLinks.map((social, i) => (
                <motion.a
                  key={i}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  whileHover={{ y: -5, scale: 1.15 }}
                  whileTap={{ scale: 0.9 }}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className={`w-9 h-9 rounded-lg flex items-center justify-center transition-all duration-300 ${
                    isDark 
                      ? 'bg-white/5 border border-white/10 text-white/50 hover:bg-white/15 hover:text-white hover:border-white/20'
                      : 'bg-black/5 border border-black/10 text-gray-600 hover:bg-black/15 hover:text-gray-900 hover:border-black/20'
                  }`}
                >
                  {social.icon}
                </motion.a>
              ))}
            </div>
          </motion.div>

          <motion.div variants={fadeInUp} custom={1}>
            <h4 className="text-white font-semibold mb-5 text-sm uppercase tracking-wider">Quick Links</h4>
            <ul className="space-y-3">
              {quickLinks.map((link, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: -15 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 + i * 0.08 }}
                >
                  <Link to={link.path}>
                    <motion.span
                      whileHover={{ x: 5, color: '#ffffff' }}
                      className="text-white/40 text-sm inline-block transition-colors"
                    >
                      {link.name}
                    </motion.span>
                  </Link>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          <motion.div variants={fadeInUp} custom={2}>
            <h4 className="text-white font-semibold mb-5 text-sm uppercase tracking-wider">Legal</h4>
            <ul className="space-y-3">
              {legalLinks.map((link, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: -15 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 + i * 0.08 }}
                >
                  <motion.a
                    href={link.path}
                    whileHover={{ x: 5, color: '#ffffff' }}
                    className="text-white/40 text-sm inline-block transition-colors"
                  >
                    {link.name}
                  </motion.a>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          <motion.div variants={fadeInUp} custom={3}>
            <h4 className="text-white font-semibold mb-5 text-sm uppercase tracking-wider">Newsletter</h4>
            <p className="text-white/40 text-sm mb-4">Get the latest updates delivered to your inbox.</p>
            <form className="flex flex-col sm:flex-row gap-2" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                placeholder="Your email"
                className="flex-1 min-w-0 bg-dark border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm placeholder:text-white/30 focus:border-white/25 focus:outline-none transition-colors"
              />
              <motion.button
                type="submit"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-gradient-to-r from-accent2 to-accent1 text-white font-semibold px-4 py-2.5 rounded-lg hover:opacity-90 transition-all text-sm whitespace-nowrap"
              >
                Subscribe
              </motion.button>
            </form>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="border-t border-white/10 mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4"
        >
          <p className="text-white/30 text-xs">© 2024 Digivents. All rights reserved.</p>
          <p className="text-white/30 text-xs">Designed with creativity and passion.</p>
        </motion.div>
      </motion.div>
    </footer>
  );
};

export default Footer;
