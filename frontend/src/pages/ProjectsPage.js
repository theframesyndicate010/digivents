import React, { useRef, useState, useEffect, useCallback } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { HiHeart, HiExternalLink, HiX, HiPlay } from 'react-icons/hi';
import { SiTiktok } from 'react-icons/si';
import { pageTransition } from '../animations';
import { fetchAllProjects } from '../data/projectsApi';

/* ── Helper: extract TikTok video ID from URL ──────────────────── */
const getTikTokVideoId = (url) => {
  if (!url) return null;
  // Match: tiktok.com/@user/video/1234567890
  const longMatch = url.match(/video\/(\d+)/);
  if (longMatch) return longMatch[1];
  // Match: vm.tiktok.com/XXXXX -> can't extract ID from short URLs
  return null;
};

/* ── TikTok Embed Player ──────────────────────────────────────── */
const TikTokEmbed = ({ videoUrl, title }) => {
  const videoId = getTikTokVideoId(videoUrl);

  if (!videoId) {
    return (
      <div className="w-full h-full bg-gradient-to-br from-gray-900 to-black flex items-center justify-center">
        <div className="text-center p-4">
          <SiTiktok className="text-4xl text-white/30 mx-auto mb-3" />
          <p className="text-white/40 text-sm">Video coming soon</p>
        </div>
      </div>
    );
  }

  return (
    <iframe
      src={`https://www.tiktok.com/embed/v2/${videoId}?lang=en`}
      className="w-full h-full border-0"
      allow="encrypted-media"
      allowFullScreen
      title={title || 'TikTok video'}
      loading="lazy"
    />
  );
};

/* ── Video Modal for fullscreen viewing ───────────────────────── */
const VideoModal = ({ project, onClose }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-xl p-4"
    onClick={onClose}
  >
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.8, opacity: 0 }}
      transition={{ duration: 0.35, ease: [0.33, 1, 0.68, 1] }}
      className="relative w-full max-w-[400px] h-[85vh] max-h-[750px] rounded-2xl overflow-hidden bg-black"
      onClick={(e) => e.stopPropagation()}
    >
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-10 w-10 h-10 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center text-white/70 hover:text-white hover:bg-black/70 transition-all"
      >
        <HiX size={20} />
      </button>
      <TikTokEmbed videoUrl={project.videoUrl || project.socialLinks?.tiktok} title={project.title} />
    </motion.div>
  </motion.div>
);

/* ── TikTok-style Project Card ────────────────────────────────── */
const ProjectCard = ({ project, index, onPlay }) => {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(project.likes || 0);
  const videoUrl = project.videoUrl || project.socialLinks?.tiktok || '';
  const videoId = getTikTokVideoId(videoUrl);
  const hasTikTok = !!videoId;

  const handleLike = (e) => {
    e.stopPropagation();
    if (!liked) {
      setLiked(true);
      setLikeCount((c) => c + 1);
    } else {
      setLiked(false);
      setLikeCount((c) => Math.max(0, c - 1));
    }
  };

  const openTikTok = (e) => {
    e.stopPropagation();
    if (videoUrl) window.open(videoUrl, '_blank', 'noopener');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{
        duration: 0.5,
        delay: (index % 3) * 0.1,
        ease: [0.33, 1, 0.68, 1],
      }}
      className="group relative"
    >
      {/* Phone-shaped card with 9:16 ratio */}
      <div className="relative bg-[#121212] rounded-2xl overflow-hidden border border-white/[0.06] hover:border-white/[0.12] transition-all duration-500 shadow-2xl shadow-black/40">
        {/* Video container — 9:16 aspect ratio */}
        <div className="relative aspect-[9/16] overflow-hidden bg-black">
          {hasTikTok ? (
            <>
              {/* Thumbnail / preview state */}
              <div
                className="absolute inset-0 cursor-pointer"
                onClick={() => onPlay(project)}
              >
                {/* Gradient overlay for thumbnail */}
                {project.image && (
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                )}
                {!project.image && (
                  <div className="w-full h-full bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f3460]" />
                )}

                {/* Play overlay */}
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-100 group-hover:bg-black/50 transition-all duration-300">
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/30 group-hover:bg-white/30 transition-all"
                  >
                    <HiPlay className="text-white text-2xl ml-1" />
                  </motion.div>
                </div>
              </div>

              {/* Side action bar (TikTok style) */}
              <div className="absolute right-3 bottom-20 flex flex-col items-center gap-5 z-10">
                {/* Like button */}
                <motion.button
                  whileTap={{ scale: 1.4 }}
                  onClick={handleLike}
                  className="flex flex-col items-center gap-1"
                >
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                    liked
                      ? 'bg-red-500/20 text-red-500'
                      : 'bg-white/10 backdrop-blur-sm text-white/70 hover:text-white'
                  }`}>
                    <HiHeart className={`text-xl transition-all ${liked ? 'scale-110' : ''}`} />
                  </div>
                  <span className={`text-xs font-medium ${liked ? 'text-red-400' : 'text-white/50'}`}>
                    {likeCount > 0 ? likeCount : ''}
                  </span>
                </motion.button>

                {/* Watch on TikTok */}
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={openTikTok}
                  className="flex flex-col items-center gap-1"
                >
                  <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center text-white/70 hover:text-white hover:bg-white/20 transition-all">
                    <SiTiktok className="text-base" />
                  </div>
                  <span className="text-xs text-white/50">TikTok</span>
                </motion.button>
              </div>

              {/* Bottom info overlay */}
              <div className="absolute bottom-0 left-0 right-14 p-4 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
                <h3 className="text-white font-semibold text-sm leading-tight truncate">
                  {project.title}
                </h3>
                {project.category && (
                  <p className="text-white/50 text-xs mt-1 truncate">{project.category}</p>
                )}
                {project.tags?.length > 0 && (
                  <div className="flex gap-1.5 mt-2 flex-wrap">
                    {project.tags.slice(0, 2).map((tag, i) => (
                      <span key={i} className="text-[10px] text-cyan-300/70 font-medium">
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </>
          ) : (
            /* No TikTok URL — show placeholder */
            <div className="w-full h-full bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f3460] flex items-center justify-center">
              {project.image ? (
                <>
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover opacity-60"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-black/40" />
                </>
              ) : null}
              <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center">
                <SiTiktok className="text-3xl text-white/20 mb-3" />
                <h3 className="text-white font-semibold text-sm">{project.title}</h3>
                <p className="text-white/40 text-xs mt-1">{project.category}</p>
              </div>
              {/* Like button for non-video cards too */}
              <div className="absolute right-3 bottom-4 flex flex-col items-center gap-1">
                <motion.button
                  whileTap={{ scale: 1.4 }}
                  onClick={handleLike}
                  className="flex flex-col items-center gap-1"
                >
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                    liked
                      ? 'bg-red-500/20 text-red-500'
                      : 'bg-white/10 backdrop-blur-sm text-white/70 hover:text-white'
                  }`}>
                    <HiHeart className={`text-xl ${liked ? 'scale-110' : ''}`} />
                  </div>
                  <span className={`text-xs font-medium ${liked ? 'text-red-400' : 'text-white/50'}`}>
                    {likeCount > 0 ? likeCount : ''}
                  </span>
                </motion.button>
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};


const ProjectsPage = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeVideo, setActiveVideo] = useState(null);

  useEffect(() => {
    fetchAllProjects()
      .then((data) => setProjects(data))
      .catch((err) => console.error('Failed to fetch projects:', err))
      .finally(() => setLoading(false));
  }, []);

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

  const handlePlay = useCallback((project) => setActiveVideo(project), []);

  return (
    <motion.div {...pageTransition}>
      {/* Fullscreen video modal */}
      <AnimatePresence>
        {activeVideo && (
          <VideoModal project={activeVideo} onClose={() => setActiveVideo(null)} />
        )}
      </AnimatePresence>

      {/* Full-screen hero */}
      <section ref={heroRef} className="relative h-screen min-h-[600px] overflow-hidden flex items-end">
        <motion.div className="absolute inset-0" style={{ y: bgY }}>
          <motion.img
            src="https://images.unsplash.com/photo-1579632652768-6cb9dcf85912?w=1920&q=80"
            alt="Projects"
            className="w-full h-full object-cover"
            style={{ scale: bgScale }}
            initial={{ scale: 1.15 }}
            animate={{ scale: 1 }}
            transition={{ duration: 1.8, ease: [0.25, 0.46, 0.45, 0.94] }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-dark via-dark/60 to-dark/20" />
          <div className="absolute inset-0 bg-gradient-to-r from-dark/70 to-transparent" />
          <motion.div className="absolute inset-0 bg-dark" style={{ opacity: overlayOpacity }} />
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
              transition={{ delay: 0.2, duration: 0.7, ease: [0.33, 1, 0.68, 1] }}
              className="text-5xl sm:text-6xl lg:text-8xl font-bold leading-[0.95] text-white"
            >
              Our Projects
            </motion.h1>
          </div>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.7, ease: [0.33, 1, 0.68, 1] }}
            className="text-white/60 text-base sm:text-lg mt-6 max-w-2xl leading-relaxed"
          >
            Watch our latest work come to life. Each project tells a story — tap play to experience it.
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 0.6 }}
            className="mt-12 flex items-center gap-3"
          >
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ repeat: Infinity, duration: 1.6, ease: 'easeInOut' }}
              className="w-5 h-8 border-2 border-white/30 rounded-full flex justify-center pt-1"
            >
              <motion.div
                animate={{ y: [0, 8, 0], opacity: [1, 0.3, 1] }}
                transition={{ repeat: Infinity, duration: 1.6, ease: 'easeInOut' }}
                className="w-1 h-2 bg-white/60 rounded-full"
              />
            </motion.div>
            <span className="text-white/30 text-xs uppercase tracking-widest">Scroll to explore</span>
          </motion.div>
        </motion.div>
      </section>

      {/* Projects grid — TikTok-style vertical cards */}
      <section className="section-padding bg-dark">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="flex items-center gap-3 mb-10"
          >
            <SiTiktok className="text-xl text-white/60" />
            <h2 className="text-white/70 text-sm uppercase tracking-widest font-medium">Latest Videos</h2>
            <div className="flex-1 h-px bg-white/[0.06]" />
            <span className="text-white/30 text-sm">{projects.length} projects</span>
          </motion.div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            {loading
              ? Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="rounded-2xl overflow-hidden bg-[#121212] border border-white/[0.06] animate-pulse">
                    <div className="aspect-[9/16] bg-white/[0.03]" />
                  </div>
                ))
              : projects.map((project, index) => (
                  <ProjectCard
                    key={project.id || index}
                    project={project}
                    index={index}
                    onPlay={handlePlay}
                  />
                ))}
          </div>

          {/* Empty state */}
          {!loading && projects.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-24"
            >
              <SiTiktok className="text-5xl text-white/10 mx-auto mb-4" />
              <p className="text-white/30 text-lg">No projects yet</p>
              <p className="text-white/20 text-sm mt-1">Videos will appear here once added</p>
            </motion.div>
          )}
        </div>
      </section>
    </motion.div>
  );
};

export default ProjectsPage;
