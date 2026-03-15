import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { HiX } from 'react-icons/hi';
import { pageTransition } from '../animations';
import { fetchAllGraphics } from '../data/graphicsApi';

/* ── Lightbox overlay ─────────────────────────────────────────── */
const Lightbox = ({ graphic, onClose }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="fixed inset-0 z-50 flex items-center justify-center bg-dark/90 backdrop-blur-md p-4"
    onClick={onClose}
  >
    <motion.div
      initial={{ scale: 0.85, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.85, opacity: 0 }}
      transition={{ duration: 0.35, ease: [0.33, 1, 0.68, 1] }}
      className="relative max-w-5xl w-full max-h-[90vh]"
      onClick={(e) => e.stopPropagation()}
    >
      <button
        onClick={onClose}
        className="absolute -top-12 right-0 text-white/60 hover:text-white transition-colors"
      >
        <HiX size={28} />
      </button>
      <img
        src={graphic.image}
        alt={graphic.title}
        className="w-full max-h-[80vh] object-contain rounded-xl"
      />
      <div className="mt-4 text-center">
        <h3 className="text-white font-bold text-xl">{graphic.title}</h3>
        {graphic.category && (
          <p className="text-white/50 text-sm mt-1">{graphic.category}</p>
        )}
        {graphic.description && (
          <p className="text-white/40 text-sm mt-2 max-w-lg mx-auto">
            {graphic.description}
          </p>
        )}
      </div>
    </motion.div>
  </motion.div>
);

/* ── Masonry-style graphic card ───────────────────────────────── */
const GraphicCard = ({ graphic, index, onClick }) => {
  // Alternate card heights for masonry feel
  const heights = ['h-64', 'h-80', 'h-72', 'h-96', 'h-60', 'h-72'];
  const heightClass = heights[index % heights.length];

  // Fallback image if none provided
  const imageUrl = graphic.image || 'https://via.placeholder.com/500x500?text=No+Image';

  return (
    <motion.div
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{
        duration: 0.5,
        delay: (index % 3) * 0.1,
        ease: [0.33, 1, 0.68, 1],
      }}
      whileHover={{ y: -8, transition: { duration: 0.25, ease: 'easeOut' } }}
      onClick={() => onClick(graphic)}
      className="card-dark group cursor-pointer hover:border-white/20 transition-colors duration-300 overflow-hidden"
    >
      <div className={`relative overflow-hidden ${heightClass}`}>
        <img
          src={imageUrl}
          alt={graphic.title || 'Graphic'}
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
          loading="lazy"
          onerror="this.src='https://via.placeholder.com/500x500?text=Image+Error'"
        />
        {/* Hover overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-dark/90 via-dark/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        {/* Category badge */}
        {graphic.category && (
          <div className="absolute top-4 left-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <span className="bg-dark/70 backdrop-blur-sm text-white/70 text-xs px-3 py-1 rounded-full border border-white/10">
              {graphic.category}
            </span>
          </div>
        )}

        {/* Title on hover */}
        <div className="absolute bottom-0 left-0 right-0 p-5 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
          <div className="w-8 h-[2px] bg-gradient-to-r from-accent1 to-accent2 mb-2 rounded-full" />
          <h3 className="text-white font-bold text-lg leading-tight">
            {graphic.title || 'Untitled'}
          </h3>
        </div>
      </div>
    </motion.div>
  );
};

/* ── Category filter pills ────────────────────────────────────── */
const FilterPill = ({ label, active, onClick }) => (
  <motion.button
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    onClick={onClick}
    className={`px-5 py-2 rounded-full text-sm font-medium border transition-all duration-300 ${
      active
        ? 'bg-gradient-to-r from-accent1 to-accent2 text-white border-transparent'
        : 'bg-white/5 text-white/50 border-white/10 hover:bg-white/10 hover:text-white/80'
    }`}
  >
    {label}
  </motion.button>
);

/* ── Main page ────────────────────────────────────────────────── */
const GraphicsPage = () => {
  const [graphics, setGraphics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('All');
  const [lightbox, setLightbox] = useState(null);

  useEffect(() => {
    fetchAllGraphics()
      .then((data) => setGraphics(data))
      .catch((err) => console.error('Failed to fetch graphics:', err))
      .finally(() => setLoading(false));
  }, []);

  // Lock body scroll when lightbox is open
  useEffect(() => {
    if (lightbox) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [lightbox]);

  // Extract unique categories
  const categories = [
    'All',
    ...new Set(graphics.map((g) => g.category).filter(Boolean)),
  ];

  const filtered =
    activeFilter === 'All'
      ? graphics
      : graphics.filter((g) => g.category === activeFilter);

  /* Parallax hero refs */
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });
  const bgY = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
  const bgScale = useTransform(scrollYProgress, [0, 1], [1, 1.2]);
  const overlayOpacity = useTransform(scrollYProgress, [0, 0.8], [0.3, 0.9]);
  const textY = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);
  const textOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <motion.div {...pageTransition}>
      {/* ── Full-screen parallax hero ─────────────────────────── */}
      <section
        ref={heroRef}
        className="relative h-screen min-h-[600px] overflow-hidden flex items-end"
      >
        <motion.div className="absolute inset-0" style={{ y: bgY }}>
          <motion.img
            src="https://images.unsplash.com/photo-1626785774573-4b799315345d?w=1920&q=80"
            alt="Graphics"
            className="w-full h-full object-cover"
            style={{ scale: bgScale }}
            initial={{ scale: 1.15 }}
            animate={{ scale: 1 }}
            transition={{ duration: 1.8, ease: [0.25, 0.46, 0.45, 0.94] }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-dark via-dark/60 to-dark/20" />
          <div className="absolute inset-0 bg-gradient-to-r from-dark/70 to-transparent" />
          <motion.div
            className="absolute inset-0 bg-dark"
            style={{ opacity: overlayOpacity }}
          />
        </motion.div>

        <motion.div
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative w-full pb-16 sm:pb-24"
          style={{ y: textY, opacity: textOpacity }}
        >
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: '4rem' }}
            transition={{ delay: 0.1, duration: 0.8, ease: 'easeOut' }}
            className="h-[3px] bg-gradient-to-r from-accent1 to-accent2 mb-8 rounded-full"
          />
          <div className="overflow-hidden">
            <motion.h1
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: 0.2,
                duration: 0.7,
                ease: [0.33, 1, 0.68, 1],
              }}
              className="text-5xl sm:text-6xl lg:text-8xl font-bold leading-[0.95] text-white"
            >
              Graphics
            </motion.h1>
          </div>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              delay: 0.5,
              duration: 0.7,
              ease: [0.33, 1, 0.68, 1],
            }}
            className="text-white/60 text-base sm:text-lg mt-6 max-w-2xl leading-relaxed"
          >
            Eye-catching visuals crafted with passion — from brand identities and
            posters to social media creatives and digital illustrations.
          </motion.p>

          {/* Scroll indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 0.6 }}
            className="mt-12 flex items-center gap-3"
          >
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{
                repeat: Infinity,
                duration: 1.6,
                ease: 'easeInOut',
              }}
              className="w-5 h-8 border-2 border-white/30 rounded-full flex justify-center pt-1"
            >
              <motion.div
                animate={{ y: [0, 8, 0], opacity: [1, 0.3, 1] }}
                transition={{
                  repeat: Infinity,
                  duration: 1.6,
                  ease: 'easeInOut',
                }}
                className="w-1 h-2 bg-white/60 rounded-full"
              />
            </motion.div>
            <span className="text-white/30 text-xs uppercase tracking-widest">
              Scroll to explore
            </span>
          </motion.div>
        </motion.div>
      </section>

      {/* ── Gallery section ───────────────────────────────────── */}
      <section className="section-padding bg-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Category filters */}
          {categories.length > 1 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="flex flex-wrap gap-3 mb-12 justify-center"
            >
              {categories.map((cat) => (
                <FilterPill
                  key={cat}
                  label={cat}
                  active={activeFilter === cat}
                  onClick={() => setActiveFilter(cat)}
                />
              ))}
            </motion.div>
          )}

          {/* Masonry grid */}
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
            {loading
              ? Array.from({ length: 9 }).map((_, i) => {
                  const skeletonHeights = [
                    'h-64',
                    'h-80',
                    'h-72',
                    'h-96',
                    'h-60',
                    'h-72',
                  ];
                  return (
                    <div
                      key={i}
                      className="card-dark animate-pulse break-inside-avoid mb-6"
                    >
                      <div
                        className={`${skeletonHeights[i % skeletonHeights.length]} bg-white/5 rounded-xl`}
                      />
                    </div>
                  );
                })
              : filtered.map((graphic, index) => (
                  <div key={graphic.id || index} className="break-inside-avoid mb-6">
                    <GraphicCard
                      graphic={graphic}
                      index={index}
                      onClick={setLightbox}
                    />
                  </div>
                ))}
          </div>

          {/* Empty state */}
          {!loading && filtered.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <p className="text-white/40 text-lg">
                No graphics found{activeFilter !== 'All' && ` in "${activeFilter}"`}. Check back soon!
              </p>
            </motion.div>
          )}
        </div>
      </section>

      {/* ── Lightbox ──────────────────────────────────────────── */}
      <AnimatePresence>
        {lightbox && (
          <Lightbox graphic={lightbox} onClose={() => setLightbox(null)} />
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default GraphicsPage;
