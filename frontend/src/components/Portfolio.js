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

/* ── Professional Project Card for homepage ────────────────────────────── */
const MiniProjectCard = ({ project, index }) => {
  const [liked, setLiked] = useState(false);
  const platform = getProjectPlatform(project);
  const hasVideo = !!platform;
  const isGraphic = !hasVideo;
  const PlatformIcon = platform === 'instagram' ? SiInstagram : SiTiktok;
  const projectType = hasVideo ? 'Video' : 'Graphic';
  const typeColor = hasVideo ? 'from-blue-500 to-cyan-500' : 'from-purple-500 to-pink-500';

  return (
    <motion.div
      variants={fadeInUp}
      custom={index}
      className="group h-full"
    >
      <div className="relative h-full bg-white rounded-xl overflow-hidden border border-gray-200 hover:border-gray-300 transition-all duration-500 shadow-sm hover:shadow-xl flex flex-col">
        {/* Image Container */}
        <div className="relative overflow-hidden bg-gray-100 flex-1">
          {project.image ? (
            <img
              src={project.image}
              alt={project.title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-gray-200 via-gray-100 to-gray-200 flex items-center justify-center">
              <div className="text-gray-400 flex flex-col items-center gap-2">
                <HiPlay className="text-4xl" />
                <span className="text-xs uppercase tracking-wider font-medium">No Preview</span>
              </div>
            </div>
          )}

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* Play Button Overlay */}
          {hasVideo && (
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
              <motion.div
                initial={{ scale: 0.8 }}
                whileHover={{ scale: 1.1 }}
                className="w-12 h-12 bg-white shadow-lg rounded-full flex items-center justify-center"
              >
                <HiPlay className="text-blue-600 text-lg ml-0.5 fill-current" />
              </motion.div>
            </div>
          )}

          {/* Type Badge */}
          <div className="absolute top-3 left-3 z-10">
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r ${typeColor} text-white text-xs font-bold shadow-lg`}>
              {hasVideo ? (
                <>
                  <HiPlay className="text-sm" /> {projectType}
                </>
              ) : (
                <>
                  <span className="text-sm">◆</span> {projectType}
                </>
              )}
            </span>
          </div>

          {/* Platform Badge (for videos only) */}
          {hasVideo && (
            <div className="absolute top-3 right-3 z-10">
              <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-lg">
                <PlatformIcon className="text-gray-800 text-sm" />
              </div>
            </div>
          )}
        </div>

        {/* Content Section */}
        <div className="p-4 bg-white flex-shrink-0">
          {/* Title */}
          <h3 className="text-gray-900 font-bold text-sm leading-snug mb-1 line-clamp-2 group-hover:text-blue-600 transition-colors">
            {project.title}
          </h3>

          {/* Client/Category */}
          {project.category && (
            <p className="text-gray-500 text-xs mb-3 line-clamp-1">
              {project.category}
            </p>
          )}

          {/* Footer with Like and Type Info */}
          <div className="flex items-center justify-between pt-3 border-t border-gray-100">
            <div className="flex items-center gap-2">
              <span className={`text-xs font-semibold px-2 py-1 rounded-md ${
                hasVideo 
                  ? 'bg-blue-50 text-blue-700' 
                  : 'bg-purple-50 text-purple-700'
              }`}>
                {projectType}
              </span>
            </div>

            {/* Like Button */}
            <motion.button
              whileTap={{ scale: 1.2 }}
              onClick={(e) => {
                e.preventDefault();
                setLiked(!liked);
              }}
              className="flex items-center gap-1"
            >
              <motion.div 
                className={`text-lg transition-all ${
                  liked ? 'text-red-500 scale-110' : 'text-gray-300 hover:text-red-400'
                }`}
                whileHover={{ scale: 1.15 }}
              >
                <HiHeart className={liked ? 'fill-current' : ''} />
              </motion.div>
              {(project.likes || 0) > 0 && (
                <span className="text-xs text-gray-500 font-medium">
                  {(project.likes || 0) + (liked ? 1 : 0)}
                </span>
              )}
            </motion.button>
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
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6"
        >
          {loading
            ? Array.from({ length: limit || 4 }).map((_, i) => (
                <div key={i} className="rounded-xl overflow-hidden bg-gray-200 border border-gray-300 animate-pulse">
                  <div className="aspect-[3/4] bg-gray-300" />
                  <div className="p-4 space-y-3">
                    <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-300 rounded w-1/2"></div>
                  </div>
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