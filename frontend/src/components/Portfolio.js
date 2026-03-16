import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { HiArrowRight, HiHeart, HiPlay } from 'react-icons/hi';
import { SiTiktok, SiInstagram } from 'react-icons/si';
import { Link } from 'react-router-dom';
import { fadeInUp, staggerContainer } from '../animations';
import { fetchFeaturedProjects } from '../data/projectsApi';

/* ── Helper: extract TikTok video ID ──────────────────────────── */
const getTikTokVideoId = (url) => {
  if (!url) return null;
  const match = url.match(/video\/(\d+)/);
  return match ? match[1] : null;
};

/* ── Helper: extract Instagram post/reel ID ───────────────────── */
const getInstagramPostId = (url) => {
  if (!url) return null;
  const match = url.match(/instagram\.com\/(?:reel|p)\/([A-Za-z0-9_-]+)/);
  return match ? match[1] : null;
};

/* ── Detect platform type ──────────────────────────────────────── */
const getProjectPlatform = (project) => {
  const tiktokUrl = project.videoUrl || project.socialLinks?.tiktok || '';
  const instaUrl = project.socialLinks?.instagram || '';
  if (getTikTokVideoId(tiktokUrl)) return 'tiktok';
  if (getInstagramPostId(instaUrl)) return 'instagram';
  return null;
};

/* ── Professional Project Card with Reference Design ────────────────────────────── */
const MiniProjectCard = ({ project, index }) => {
  const [liked, setLiked] = useState(false);
  const platform = getProjectPlatform(project);
  const hasVideo = !!platform;
  const PlatformIcon = platform === 'instagram' ? SiInstagram : SiTiktok;

  return (
    <motion.div
      variants={fadeInUp}
      custom={index}
      className="group h-full"
    >
      <Link to="/projects">
        <div className="relative h-full rounded-2xl overflow-hidden bg-dark shadow-lg hover:shadow-2xl transition-all duration-500 border border-white/5 hover:border-white/10 cursor-pointer">
          {/* Full-Bleed Image Container */}
          <div className="relative overflow-hidden bg-gray-900 aspect-[3/4]">
            {project.image ? (
              <img
                src={project.image}
                alt={project.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                loading="lazy"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-slate-800 via-slate-700 to-slate-900 flex items-center justify-center">
                <div className="text-white/30 flex flex-col items-center gap-3">
                  <HiPlay className="text-5xl" />
                  <span className="text-xs uppercase tracking-wider font-medium">No Preview</span>
                </div>
              </div>
            )}

            {/* Gradient Overlay - More Elegant */}
            <div className="absolute inset-0 bg-gradient-to-t from-dark via-dark/50 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-300" />

            {/* Play Button Overlay for Videos */}
            {hasVideo && (
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                <motion.div
                  initial={{ scale: 0.8 }}
                  whileHover={{ scale: 1.15 }}
                  className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/50 shadow-2xl hover:bg-white/30"
                >
                  <HiPlay className="text-white text-2xl ml-1 fill-white" />
                </motion.div>
              </div>
            )}

            {/* Top Badge */}
            <div className="absolute top-4 left-4 z-10">
              <motion.span 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold backdrop-blur-md ${
                  hasVideo 
                    ? 'bg-blue-500/30 border border-blue-400/50 text-blue-100' 
                    : 'bg-purple-500/30 border border-purple-400/50 text-purple-100'
                }`}
              >
                {hasVideo ? 'Video Project' : 'Graphic Design'}
              </motion.span>
            </div>

            {/* Platform Icon */}
            {hasVideo && (
              <div className="absolute top-4 right-4 z-10">
                <div className="w-9 h-9 bg-white/20 backdrop-blur-md rounded-lg flex items-center justify-center border border-white/30">
                  <PlatformIcon className="text-white text-sm" />
                </div>
              </div>
            )}

            {/* Content Overlay at Bottom */}
            <div className="absolute bottom-0 left-0 right-0 p-6 z-20">
              {/* Tagline */}
              <motion.p 
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="text-white/60 text-xs uppercase tracking-wider font-medium mb-2"
              >
                {hasVideo ? 'Video Production' : 'Design Work'}
              </motion.p>

              {/* Main Title */}
              <motion.h3 
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: 0.15 }}
                className="text-white font-bold text-lg lg:text-xl leading-snug mb-2 line-clamp-2 group-hover:text-accent1 transition-colors"
              >
                {project.title}
              </motion.h3>

              {/* Category/Description */}
              {project.category && (
                <motion.p 
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="text-white/50 text-xs leading-relaxed line-clamp-1 mb-4"
                >
                  {project.category}
                </motion.p>
              )}

              {/* Bottom Actions Bar */}
              <div className="flex items-center justify-between pt-4 border-t border-white/10">
                <motion.button
                  whileTap={{ scale: 1.2 }}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setLiked(!liked);
                  }}
                  className="flex items-center gap-1.5"
                >
                  <motion.div 
                    className={`text-lg transition-all ${
                      liked ? 'text-red-400 scale-110' : 'text-white/40 hover:text-red-400'
                    }`}
                    whileHover={{ scale: 1.2 }}
                  >
                    <HiHeart className={liked ? 'fill-current' : ''} />
                  </motion.div>
                  {(project.likes || 0) > 0 && (
                    <span className="text-xs text-white/40 font-medium">
                      {(project.likes || 0) + (liked ? 1 : 0)}
                    </span>
                  )}
                </motion.button>

                <motion.span
                  whileHover={{ x: 3 }}
                  className="text-xs text-accent1 font-semibold flex items-center gap-1 group-hover:text-accent2 transition-colors cursor-pointer"
                >
                  View More <HiArrowRight className="text-sm" />
                </motion.span>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

const Portfolio = ({ limit }) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeaturedProjects(limit || 4)
      .then((data) => setItems(data))
      .catch((err) => console.error('Failed to fetch projects:', err))
      .finally(() => setLoading(false));
  }, [limit]);

  return (
    <section className="section-padding bg-gradient-to-b from-dark to-dark/95">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-16"
        >
          <div>
            <motion.span
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-white/50 text-sm uppercase tracking-widest font-medium inline-flex items-center gap-3"
            >
              <SiInstagram className="text-lg" />
              <SiTiktok className="text-lg" />
              <span>Featured Portfolio</span>
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="section-title mt-4"
            >
              Our Latest<br />Projects
            </motion.h2>
          </div>
          <motion.div whileHover={{ scale: 1.05, x: 5 }} whileTap={{ scale: 0.95 }}>
            <Link to="/projects" className="btn-outline text-sm shrink-0">
              Explore All <HiArrowRight />
            </Link>
          </motion.div>
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8"
        >
          {loading
            ? Array.from({ length: limit || 4 }).map((_, i) => (
                <div key={i} className="rounded-2xl overflow-hidden bg-darkGray border border-white/[0.05] animate-pulse">
                  <div className="aspect-[3/4] bg-dark" />
                  <div className="p-6 space-y-3">
                    <div className="h-2 bg-white/10 rounded w-1/3"></div>
                    <div className="h-4 bg-white/10 rounded w-4/5"></div>
                    <div className="h-3 bg-white/5 rounded w-1/2"></div>
                  </div>
                </div>
              ))
            : items.map((project, index) => (
                <MiniProjectCard key={project.id || index} project={project} index={index} />
              ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Portfolio;