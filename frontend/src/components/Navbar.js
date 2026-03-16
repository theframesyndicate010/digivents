import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { HiMenuAlt3, HiX, HiSun, HiMoon } from 'react-icons/hi';
import { useTheme } from './ThemeContext';
import logo from '../assets/logo.png';

const navLinks = [
  { name: 'Home', path: '/' },
  { name: 'Projects', path: '/projects' },
  { name: 'About', path: '/about' },
  { name: 'Services', path: '/services' },
  { name: 'Contact', path: '/contact' },
];

const menuVariants = {
  closed: { opacity: 0, height: 0, transition: { duration: 0.3, ease: 'easeInOut' } },
  open: { opacity: 1, height: 'auto', transition: { duration: 0.4, ease: 'easeInOut' } },
};

const linkVariants = {
  closed: { opacity: 0, x: -20 },
  open: (i) => ({
    opacity: 1,
    x: 0,
    transition: { delay: i * 0.1, duration: 0.3 },
  }),
};

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const { isDark, toggleTheme } = useTheme();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
        scrolled
          ? isDark 
            ? 'bg-dark/80 backdrop-blur-xl border-b border-white/10 shadow-lg shadow-black/20'
            : 'bg-white/80 backdrop-blur-xl border-b border-gray-200 shadow-lg shadow-black/5'
          : isDark 
            ? 'bg-dark/30 backdrop-blur-md'
            : 'bg-white/30 backdrop-blur-md'
      } dark:${scrolled ? 'bg-dark/80 border-white/10' : 'bg-dark/30'}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
                      <motion.img
              src={logo}
              alt="Digivents Logo"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="h-12 sm:h-16 md:h-20 w-auto"
            />
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link key={link.name} to={link.path} className="relative py-2">
                <motion.span
                  whileHover={{ y: -1 }}
                  className={`text-sm font-medium tracking-wide transition-colors inline-block ${
                    location.pathname === link.path
                      ? 'text-accent1'
                      : isDark 
                        ? 'text-white/60 hover:text-white'
                        : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {link.name}
                </motion.span>
                {location.pathname === link.path && (
                  <motion.div
                    layoutId="activeNav"
                    className="absolute -bottom-1 left-0 right-0 h-0.5 bg-accent1 rounded-full"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
              </Link>
            ))}
          </div>

          {/* CTA Button */}
          <div className="hidden lg:flex items-center gap-4">
            {/* Theme Toggle */}
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={toggleTheme}
              className={`p-2.5 rounded-lg transition-all duration-300 border ${
                isDark
                  ? 'bg-white/10 hover:bg-white/20 text-white border-white/20 hover:border-white/40'
                  : 'bg-black/10 hover:bg-black/20 text-gray-800 border-black/20 hover:border-black/40'
              }`}
              title={isDark ? 'Light mode' : 'Dark mode'}
            >
              {isDark ? <HiSun className="text-lg" /> : <HiMoon className="text-lg" />}
            </motion.button>

            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                to="/contact"
                className="bg-white text-dark font-semibold text-sm px-6 py-2.5 rounded-full hover:bg-white/90 transition-all duration-300 inline-flex items-center gap-2"
              >
                Get in Touch
              </Link>
            </motion.div>
          </div>

          {/* Mobile Menu Button */}
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsOpen(!isOpen)}
            className={`lg:hidden text-2xl relative z-50 ${isDark ? 'text-white' : 'text-gray-900'}`}
          >
            <AnimatePresence mode="wait">
              {isOpen ? (
                <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }}>
                  <HiX />
                </motion.div>
              ) : (
                <motion.div key="menu" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.2 }}>
                  <HiMenuAlt3 />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div variants={menuVariants} initial="closed" animate="open" exit="closed" className={`lg:hidden overflow-hidden backdrop-blur-xl rounded-b-2xl ${
              isDark 
                ? 'bg-dark/98 border-t border-white/10'
                : 'bg-white/95 border-t border-gray-200'
            }`}>
              <div className="py-4">
                {navLinks.map((link, i) => (
                  <motion.div key={link.name} variants={linkVariants} custom={i} initial="closed" animate="open">
                    <Link to={link.path} className={`block px-6 py-3 text-sm tracking-wide transition-colors ${
                      location.pathname === link.path 
                        ? isDark
                          ? 'text-accent1 bg-white/5'
                          : 'text-accent1 bg-black/5'
                        : isDark
                          ? 'text-white/50 hover:text-white hover:bg-white/5'
                          : 'text-gray-600 hover:text-gray-900 hover:bg-black/5'
                    }`}>
                      {link.name}
                    </Link>
                  </motion.div>
                ))}
                <motion.div variants={linkVariants} custom={navLinks.length} initial="closed" animate="open" className="px-4 pt-2 pb-4 flex items-center gap-3">
                  <Link to="/contact" className={`flex-1 font-semibold text-sm px-6 py-2.5 rounded-full transition-all duration-300 inline-flex items-center gap-2 justify-center ${
                    isDark
                      ? 'bg-white text-dark hover:bg-white/90'
                      : 'bg-gray-900 text-white hover:bg-gray-800'
                  }`}>Get in Touch</Link>
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={toggleTheme}
                    className={`p-2.5 rounded-lg transition-all duration-300 border ${
                      isDark
                        ? 'bg-white/10 hover:bg-white/20 text-white border-white/20 hover:border-white/40'
                        : 'bg-black/10 hover:bg-black/20 text-gray-800 border-black/20 hover:border-black/40'
                    }`}
                    title={isDark ? 'Light mode' : 'Dark mode'}
                  >
                    {isDark ? <HiSun className="text-lg" /> : <HiMoon className="text-lg" />}
                  </motion.button>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
};

export default Navbar;
