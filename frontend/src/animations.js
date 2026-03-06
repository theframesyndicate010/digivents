import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// Shared smooth easing — easeOutCubic for natural deceleration
const smooth = [0.33, 1, 0.68, 1];

// Reusable animation variants
export const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.12, ease: smooth },
  }),
};

export const fadeInDown = {
  hidden: { opacity: 0, y: -30 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.1, ease: smooth },
  }),
};

export const fadeInLeft = {
  hidden: { opacity: 0, x: -40 },
  visible: (i = 0) => ({
    opacity: 1,
    x: 0,
    transition: { duration: 0.6, delay: i * 0.12, ease: smooth },
  }),
};

export const fadeInRight = {
  hidden: { opacity: 0, x: 40 },
  visible: (i = 0) => ({
    opacity: 1,
    x: 0,
    transition: { duration: 0.6, delay: i * 0.12, ease: smooth },
  }),
};

export const scaleIn = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: (i = 0) => ({
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5, delay: i * 0.1, ease: smooth },
  }),
};

export const staggerContainer = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1, delayChildren: 0.05 },
  },
};

export const letterAnimation = {
  hidden: { opacity: 0, y: 50, rotateX: -90 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    rotateX: 0,
    transition: { duration: 0.5, delay: i * 0.04, ease: smooth },
  }),
};

export const slideInFromBottom = {
  hidden: { opacity: 0, y: 80 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: smooth },
  },
};

// Smoother page transitions — crossfade with subtle slide
export const pageTransition = {
  initial: { opacity: 0, y: 30 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: smooth },
  },
  exit: {
    opacity: 0,
    y: -15,
    transition: { duration: 0.35, ease: [0.55, 0, 1, 0.45] }, // easeInCubic
  },
};

export const floatingAnimation = {
  animate: {
    y: [0, -12, 0],
    transition: { duration: 5, repeat: Infinity, ease: 'easeInOut' },
  },
};

export const pulseGlow = {
  animate: {
    boxShadow: [
      '0 0 20px rgba(192,123,50,0)',
      '0 0 40px rgba(192,123,50,0.3)',
      '0 0 20px rgba(192,123,50,0)',
    ],
    transition: { duration: 2, repeat: Infinity, ease: 'easeInOut' },
  },
};

// Scroll to top on route change
export const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};
