import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { HiArrowRight, HiHeart, HiPlay } from 'react-icons/hi';
import { SiTiktok, SiInstagram } from 'react-icons/si';
import { Link } from 'react-router-dom';
import { fadeInUp, staggerContainer } from '../animations';
import { fetchFeaturedProjects } from '../data/projectsApi';
import { fetchFeaturedGraphics } from '../data/graphicsApi';

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

/* ── Mini TikTok Card for homepage ────────────────────────────── */
const MiniProjectCard = ({ project, index }) => {
  const [liked, setLiked] = useState(false);
  const [imageSrc, setImageSrc] = useState(project.thumbnail || project.image);
  const [imageError, setImageError] = useState(false);
  const platform = getProjectPlatform(project);
  const hasVideo = !!platform;
  const PlatformIcon = platform === 'instagram' ? SiInstagram : SiTiktok;

  // Handle image load error with fallback to cover photo
  const handleImageError = () => {
    if (!imageError && project.image && imageSrc !== project.image) {
      // First fallback: try the cover photo/image field
      setImageSrc(project.image);
      setImageError(true);
    } else if (!imageError) {
      // If already using cover photo or no cover photo available, show placeholder
      setImageError(true);
    }
  };

  return (
    <motion.div
      variants={fadeInUp}
      custom={index}
      className="group relative h-full"
    >
      <div className="relative bg-black rounded-2xl overflow-hidden border border-white/[0.12] hover:border-white/[0.25] transition-all duration-500 shadow-lg hover:shadow-2xl hover:shadow-accent1/10 h-full">
        <div className={`relative overflow-hidden ${index === 0 ? 'aspect-[9/14]' : 'aspect-[9/16]'}`}>
          {/* Thumbnail */}
          {imageSrc && !imageError ? (
            <img
              src={imageSrc}
              alt={project.title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              loading="lazy"
              onError={handleImageError}
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
              <div className="text-white/30 flex flex-col items-center gap-2">
                <HiPlay className="text-3xl" />
                <span className="text-xs uppercase tracking-wider opacity-50">No Preview</span>
              </div>
            </div>
          )}

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/40 to-black/90 opacity-70 group-hover:opacity-80 transition-opacity duration-300" />

          {/* Play overlay */}
          {hasVideo && (
            <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
              <motion.div
                initial={{ scale: 0.8 }}
                whileHover={{ scale: 1.2 }}
                className="w-14 h-14 bg-white/30 backdrop-blur-lg rounded-full flex items-center justify-center border border-white/50 shadow-2xl shadow-white/20 hover:bg-white/40 hover:border-white transition-all"
              >
                <HiPlay className="text-white text-xl ml-1 fill-white" />
              </motion.div>
            </div>
          )}

          {/* Platform badge */}
          {hasVideo && (
            <div className="absolute top-4 left-4 z-10">
              <div className="w-9 h-9 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/40 hover:border-white/70 transition-all hover:bg-white/30 shadow-lg">
                <PlatformIcon className="text-white text-sm" />
              </div>
            </div>
          )}

          {/* Like button */}
          <div className="absolute right-3 bottom-20 z-10">
            <motion.button
              whileTap={{ scale: 1.3 }}
              onClick={(e) => { e.preventDefault(); setLiked(!liked); }}
              className="flex flex-col items-center gap-0.5"
            >
              <motion.div 
                className={`w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-md border transition-all ${
                  liked ? 'bg-red-500/50 text-red-300 border-red-500/70' : 'bg-white/20 text-white/80 border-white/30 hover:border-white/60 hover:bg-white/30'
                }`}
                whileHover={{ scale: 1.15 }}
              >
                <HiHeart className={`text-lg ${liked ? 'fill-red-300' : ''}`} />
              </motion.div>
              {project.likes > 0 && (
                <span className="text-[10px] text-white/60 font-semibold">{project.likes + (liked ? 1 : 0)}</span>
              )}
            </motion.button>
          </div>

          {/* Bottom info */}
          <div className="absolute bottom-0 left-0 right-0 p-5 bg-gradient-to-t from-black via-black/85 to-transparent">
            <div className="flex items-center gap-2 mb-3">
              <span className={`px-3 py-1 ${hasVideo ? 'bg-gradient-to-r from-accent2 to-accent1' : 'bg-blue-500/60'} text-white text-[9px] font-bold rounded-lg uppercase tracking-wider`}>
                {hasVideo ? 'Video' : 'Design'}
              </span>
            </div>
            <h3 className="text-white font-bold text-base leading-snug truncate mb-2">{project.title}</h3>
            {(project.category || project.description) && (
              <p className="text-white/60 text-xs font-medium truncate">
                {project.category || project.description}
              </p>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const Portfolio = ({ limit }) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetchFeaturedProjects(limit || 4),
      fetchFeaturedGraphics(limit || 4)
    ])
      .then(([projects, graphics]) => {
        // Combine projects and graphics, then slice to limit
        const combined = [...projects, ...graphics].slice(0, limit || 4);
        setItems(combined);
      })
      .catch((err) => console.error('Failed to fetch projects or graphics:', err))
      .finally(() => setLoading(false));
  }, [limit]);

  return (
    <section className="section-padding bg-dark">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12"
        >
          <div>
            <motion.span
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-white/50 text-sm uppercase tracking-widest font-medium inline-flex items-center gap-2"
            >
              <SiInstagram className="text-base" />
              <SiTiktok className="text-base" /> Portfolio
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="section-title mt-3"
            >
              Our Latest<br />Video Projects
            </motion.h2>
          </div>
          <motion.div whileHover={{ scale: 1.05, x: 5 }} whileTap={{ scale: 0.95 }}>
            <Link to="/projects" className="btn-outline text-sm shrink-0">
              See All Projects <HiArrowRight />
            </Link>
          </motion.div>
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4"
        >
          {loading
            ? Array.from({ length: limit || 4 }).map((_, i) => (
                <div key={i} className="rounded-2xl overflow-hidden bg-[#121212] border border-white/[0.06] animate-pulse">
                  <div className="aspect-[9/16] bg-white/[0.03]" />
                </div>
              ))
            : items.map((project, index) => (
                <Link to="/projects" key={project.id || index}>
                  <MiniProjectCard project={project} index={index} />
                </Link>
              ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Portfolio;