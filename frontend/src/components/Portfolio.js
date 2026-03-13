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

/* ── Mini TikTok Card for homepage ────────────────────────────── */
const MiniProjectCard = ({ project, index }) => {
  const [liked, setLiked] = useState(false);
  const platform = getProjectPlatform(project);
  const hasVideo = !!platform;
  const PlatformIcon = platform === 'instagram' ? SiInstagram : SiTiktok;

  return (
    <motion.div
      variants={fadeInUp}
      custom={index}
      className="group relative"
    >
      <div className="relative bg-[#121212] rounded-2xl overflow-hidden border border-white/[0.06] hover:border-white/[0.12] transition-all duration-500">
        <div className={`relative overflow-hidden ${index === 0 ? 'aspect-[9/14]' : 'aspect-[9/16]'}`}>
          {/* Thumbnail */}
          {project.image ? (
            <img
              src={project.image}
              alt={project.title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f3460]" />
          )}

          {/* Play overlay */}
          {hasVideo && (
            <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/20">
                <HiPlay className="text-white text-lg ml-0.5" />
              </div>
            </div>
          )}

          {/* Platform badge */}
          {hasVideo && (
            <div className="absolute top-3 left-3">
              <div className="w-7 h-7 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center">
                <PlatformIcon className="text-white/80 text-xs" />
              </div>
            </div>
          )}

          {/* Like button */}
          <div className="absolute right-3 bottom-14">
            <motion.button
              whileTap={{ scale: 1.4 }}
              onClick={(e) => { e.preventDefault(); setLiked(!liked); }}
              className="flex flex-col items-center gap-0.5"
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                liked ? 'bg-red-500/20 text-red-500' : 'bg-white/10 backdrop-blur-sm text-white/60'
              }`}>
                <HiHeart className="text-sm" />
              </div>
              {project.likes > 0 && (
                <span className="text-[10px] text-white/40">{project.likes + (liked ? 1 : 0)}</span>
              )}
            </motion.button>
          </div>

          {/* Bottom info */}
          <div className="absolute bottom-0 left-0 right-10 p-3 bg-gradient-to-t from-black/70 to-transparent">
            <h3 className="text-white font-semibold text-sm leading-tight truncate">{project.title}</h3>
            <p className="text-white/40 text-xs mt-0.5 truncate">{project.category}</p>
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
    fetchFeaturedProjects(limit || 4)
      .then((data) => setItems(data))
      .catch((err) => console.error('Failed to fetch projects:', err))
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
