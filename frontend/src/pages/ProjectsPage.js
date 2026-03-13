import React, { useRef, useState, useEffect, useCallback, useMemo } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { HiHeart, HiExternalLink, HiX, HiPlay, HiPhotograph } from 'react-icons/hi';
import { SiInstagram, SiTiktok } from 'react-icons/si';
import { pageTransition } from '../animations';
import { fetchAllProjects } from '../data/projectsApi';

/* ── Helper: extract TikTok video ID from URL ──────────────────── */
const getTikTokVideoId = (url) => {
  if (!url) return null;
  const longMatch = url.match(/video\/(\d+)/);
  if (longMatch) return longMatch[1];
  return null;
};

/* ── Helper: extract Instagram shortcode from URL ─────────────── */
const getInstagramShortcode = (url) => {
  if (!url) return null;
  const match = url.match(/(?:instagram\.com\/(?:reel|p|tv)\/)([a-zA-Z0-9_-]+)/i);
  if (match) return match[1];
  return null;
};

/* ── Helper: detect video platform ─────────────────────────────── */
const getVideoPlatform = (project) => {
  const videoUrl = project.videoUrl || '';
  const instagramUrl = project.socialLinks?.instagram || '';
  const tiktokUrl = project.socialLinks?.tiktok || '';

  // Check videoUrl first
  if (getInstagramShortcode(videoUrl)) return { type: 'instagram', url: videoUrl, id: getInstagramShortcode(videoUrl) };
  if (getTikTokVideoId(videoUrl)) return { type: 'tiktok', url: videoUrl, id: getTikTokVideoId(videoUrl) };

  // Then check social links
  if (getInstagramShortcode(instagramUrl)) return { type: 'instagram', url: instagramUrl, id: getInstagramShortcode(instagramUrl) };
  if (getTikTokVideoId(tiktokUrl)) return { type: 'tiktok', url: tiktokUrl, id: getTikTokVideoId(tiktokUrl) };

  return null;
};

/* ── Platform Badge Component ─────────────────────────────────── */
const PlatformBadge = ({ type, className = '' }) => {
  const config = {
    tiktok: { icon: SiTiktok, color: 'from-[#ff0050]/20 to-[#00f2ea]/20', border: 'border-[#ff0050]/30' },
    instagram: { icon: SiInstagram, color: 'from-fuchsia-500/20 via-rose-500/20 to-orange-400/20', border: 'border-pink-400/35' },
  };
  const { icon: Icon, color, border } = config[type] || config.tiktok;
  return (
    <div className={`w-8 h-8 bg-gradient-to-br ${color} backdrop-blur-md rounded-full flex items-center justify-center border ${border} ${className}`}>
      <Icon className="text-white/90 text-xs" />
    </div>
  );
};

/* ── Video Embed Player (supports TikTok & Instagram) ─────────── */
const VideoEmbed = ({ platform, title }) => {
  if (!platform) {
    return (
      <div className="w-full h-full bg-gradient-to-br from-gray-900 to-black flex items-center justify-center">
        <div className="text-center p-4">
          <HiPlay className="text-4xl text-white/30 mx-auto mb-3" />
          <p className="text-white/40 text-sm">Video coming soon</p>
        </div>
      </div>
    );
  }

  if (platform.type === 'instagram') {
    return (
      <iframe
        src={`https://www.instagram.com/reel/${platform.id}/embed/`}
        className="w-full h-full border-0"
        allow="autoplay; encrypted-media"
        allowFullScreen
        title={title || 'Instagram video'}
        loading="lazy"
      />
    );
  }

  return (
    <iframe
      src={`https://www.tiktok.com/embed/v2/${platform.id}?lang=en`}
      className="w-full h-full border-0"
      allow="encrypted-media"
      allowFullScreen
      title={title || 'TikTok video'}
      loading="lazy"
    />
  );
};

/* ── Video Modal for fullscreen viewing ───────────────────────── */
const VideoModal = ({ project, onClose }) => {
  const platform = getVideoPlatform(project);
  const isInstagram = platform?.type === 'instagram';

  return (
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
        className={`relative rounded-2xl overflow-hidden bg-black ${
          isInstagram
            ? 'w-full max-w-[420px] h-[85vh] max-h-[760px]'
            : 'w-full max-w-[400px] h-[85vh] max-h-[750px]'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-10 h-10 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center text-white/70 hover:text-white hover:bg-black/70 transition-all"
        >
          <HiX size={20} />
        </button>

        {/* Platform badge */}
        <div className="absolute top-4 left-4 z-10">
          <PlatformBadge type={platform?.type || 'tiktok'} />
        </div>

        <VideoEmbed platform={platform} title={project.title} />

        {/* Title overlay at bottom */}
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent pointer-events-none">
          <h3 className="text-white font-semibold text-sm">{project.title}</h3>
          {project.category && <p className="text-white/50 text-xs mt-0.5">{project.category}</p>}
        </div>
      </motion.div>
    </motion.div>
  );
};

/* ── Project Card (supports TikTok & Instagram) ───────────────── */
const ProjectCard = ({ project, index, onPlay }) => {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(project.likes || 0);
  const platform = getVideoPlatform(project);
  const hasVideo = !!platform;

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

  const openExternal = (e) => {
    e.stopPropagation();
    if (platform?.url) window.open(platform.url, '_blank', 'noopener');
  };

  /* Instagram thumbnail fallback */
  const instaThumb = platform?.type === 'instagram'
    ? `https://www.instagram.com/p/${platform.id}/media/?size=l`
    : null;
  const thumbnail = project.image || instaThumb;

  /* Accent colors per platform */
  const accent = platform?.type === 'instagram'
    ? { glow: 'shadow-pink-500/15', ring: 'group-hover:border-pink-400/30' }
    : { glow: 'shadow-cyan-500/10', ring: 'group-hover:border-cyan-400/20' };

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
      <div className={`relative bg-[#121212] rounded-2xl overflow-hidden border border-white/[0.06] ${accent.ring} transition-all duration-500 shadow-2xl ${hasVideo ? accent.glow : 'shadow-black/40'}`}>
        <div className="relative overflow-hidden bg-black aspect-[9/16]">
          {hasVideo ? (
            <>
              {/* Thumbnail / preview state */}
              <div
                className="absolute inset-0 cursor-pointer"
                onClick={() => onPlay(project)}
              >
                {thumbnail ? (
                  <img
                    src={thumbnail}
                    alt={project.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    loading="lazy"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f3460]" />
                )}

                {/* Play overlay */}
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center group-hover:bg-black/50 transition-all duration-300">
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className={`w-14 h-14 sm:w-16 sm:h-16 backdrop-blur-md rounded-full flex items-center justify-center border transition-all ${
                      platform.type === 'instagram'
                        ? 'bg-gradient-to-br from-fuchsia-500/40 via-rose-500/30 to-orange-400/35 border-pink-400/45 group-hover:from-fuchsia-500/55 group-hover:to-orange-400/45'
                        : 'bg-white/20 border-white/30 group-hover:bg-white/30'
                    }`}
                  >
                    <HiPlay className="text-white text-2xl ml-1" />
                  </motion.div>
                </div>
              </div>

              {/* Platform badge — top left */}
              <div className="absolute top-3 left-3 z-10">
                <PlatformBadge type={platform.type} />
              </div>

              {/* Side action bar */}
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

                {/* Watch on platform */}
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={openExternal}
                  className="flex flex-col items-center gap-1"
                >
                  <div className={`w-10 h-10 rounded-full backdrop-blur-sm flex items-center justify-center transition-all ${
                    platform.type === 'instagram'
                      ? 'bg-pink-500/10 text-pink-300/85 hover:text-pink-200 hover:bg-pink-500/20'
                      : 'bg-white/10 text-white/70 hover:text-white hover:bg-white/20'
                  }`}>
                    {platform.type === 'instagram' ? <SiInstagram className="text-base" /> : <SiTiktok className="text-base" />}
                  </div>
                  <span className="text-xs text-white/50">{platform.type === 'instagram' ? 'Instagram' : 'TikTok'}</span>
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
            /* No video URL — show placeholder */
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
                <HiPlay className="text-3xl text-white/20 mb-3" />
                <h3 className="text-white font-semibold text-sm">{project.title}</h3>
                <p className="text-white/40 text-xs mt-1">{project.category}</p>
              </div>
              {/* Like button for non-video cards */}
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


/* ── "Others" Project Card (manually uploaded, no video link) ── */
const OtherProjectCard = ({ project, index }) => {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(project.likes || 0);

  const handleLike = (e) => {
    e.stopPropagation();
    setLiked((prev) => !prev);
    setLikeCount((c) => (liked ? Math.max(0, c - 1) : c + 1));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.5, delay: (index % 3) * 0.1, ease: [0.33, 1, 0.68, 1] }}
      className="group relative"
    >
      <div className="relative bg-[#121212] rounded-2xl overflow-hidden border border-white/[0.06] group-hover:border-purple-500/20 transition-all duration-500 shadow-2xl shadow-black/40">
        {/* Image — landscape 4:3 */}
        <div className="relative aspect-[4/3] overflow-hidden bg-black">
          {project.image ? (
            <img
              src={project.image}
              alt={project.title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-purple-900/40 via-[#16213e] to-[#0f3460]" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

          {/* Media count badge */}
          {project.media?.length > 1 && (
            <div className="absolute top-3 left-3 z-10">
              <div className="flex items-center gap-1 px-2 py-1 bg-black/50 backdrop-blur-sm rounded-full">
                <HiPhotograph className="text-white/80 text-xs" />
                <span className="text-white/80 text-[10px] font-medium">{project.media.length}</span>
              </div>
            </div>
          )}

          {/* Like button */}
          <div className="absolute right-3 bottom-3 z-10">
            <motion.button
              whileTap={{ scale: 1.4 }}
              onClick={handleLike}
              className="flex flex-col items-center gap-0.5"
            >
              <div className={`w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 ${
                liked
                  ? 'bg-red-500/20 text-red-500'
                  : 'bg-white/10 backdrop-blur-sm text-white/70 hover:text-white'
              }`}>
                <HiHeart className={`text-lg ${liked ? 'scale-110' : ''}`} />
              </div>
              {likeCount > 0 && (
                <span className={`text-[10px] font-medium ${liked ? 'text-red-400' : 'text-white/40'}`}>{likeCount}</span>
              )}
            </motion.button>
          </div>
        </div>

        {/* Info bar */}
        <div className="p-3.5">
          <h3 className="text-white font-semibold text-sm leading-tight truncate">{project.title}</h3>
          <div className="flex items-center justify-between mt-1.5">
            {project.category && (
              <p className="text-white/40 text-xs truncate">{project.category}</p>
            )}
            {project.tags?.length > 0 && (
              <div className="flex gap-1 flex-shrink-0 ml-2">
                {project.tags.slice(0, 2).map((tag, i) => (
                  <span key={i} className="text-[10px] text-purple-300/60 font-medium">#{tag}</span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

/* ── Section Header ───────────────────────────────────────────── */
const SectionHeader = ({ icon: Icon, iconClass, label, count, accentColor = 'from-accent1 to-accent2' }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5 }}
    className="mb-8"
  >
    <div className="flex items-center gap-3">
      <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${accentColor} flex items-center justify-center`}>
        <Icon className={`text-lg ${iconClass || 'text-white'}`} />
      </div>
      <div>
        <h2 className="text-white text-lg font-semibold leading-tight">{label}</h2>
        <p className="text-white/30 text-xs mt-0.5">{count} {count === 1 ? 'project' : 'projects'}</p>
      </div>
      <div className="flex-1 h-px bg-white/[0.06] ml-2" />
    </div>
  </motion.div>
);

/* ── Skeleton loaders ─────────────────────────────────────────── */
const VideoSkeleton = ({ aspect = 'aspect-[9/16]' }) => (
  <div className="rounded-2xl overflow-hidden bg-[#121212] border border-white/[0.06] animate-pulse">
    <div className={`${aspect} bg-white/[0.03]`} />
  </div>
);
const CardSkeleton = () => (
  <div className="rounded-2xl overflow-hidden bg-[#121212] border border-white/[0.06] animate-pulse">
    <div className="aspect-[4/3] bg-white/[0.03]" />
    <div className="p-3.5 space-y-2">
      <div className="h-3 bg-white/[0.05] rounded w-3/4" />
      <div className="h-2 bg-white/[0.03] rounded w-1/2" />
    </div>
  </div>
);


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

  /* ── Split projects by platform ──────────────────────────────── */
  const { instagramProjects, tiktokProjects, otherProjects } = useMemo(() => {
    const ig = [];
    const tt = [];
    const other = [];
    projects.forEach((p) => {
      const platform = getVideoPlatform(p);
      if (platform?.type === 'instagram') ig.push(p);
      else if (platform?.type === 'tiktok') tt.push(p);
      else other.push(p);
    });
    return { instagramProjects: ig, tiktokProjects: tt, otherProjects: other };
  }, [projects]);

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

      {/* ── Instagram Section ────────────────────────────────────── */}
      {(loading || instagramProjects.length > 0) && (
        <section className="section-padding bg-dark">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeader
              icon={SiInstagram}
              iconClass="text-white"
              label="Instagram Videos"
              count={instagramProjects.length}
              accentColor="from-fuchsia-500/80 via-rose-500/70 to-orange-400/60"
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
              {loading
                ? Array.from({ length: 3 }).map((_, i) => <VideoSkeleton key={i} />)
                : instagramProjects.map((project, index) => (
                    <ProjectCard key={project.id || index} project={project} index={index} onPlay={handlePlay} />
                  ))}
            </div>
          </div>
        </section>
      )}

      {/* ── TikTok Section ──────────────────────────────────────── */}
      {(loading || tiktokProjects.length > 0) && (
        <section className={`section-padding ${instagramProjects.length > 0 ? 'bg-[#0a0a0a]' : 'bg-dark'}`}>
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeader
              icon={SiTiktok}
              iconClass="text-white"
              label="TikTok Videos"
              count={tiktokProjects.length}
              accentColor="from-[#ff0050]/80 to-[#00f2ea]/60"
            />
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
              {loading
                ? Array.from({ length: 4 }).map((_, i) => <VideoSkeleton key={i} />)
                : tiktokProjects.map((project, index) => (
                    <ProjectCard key={project.id || index} project={project} index={index} onPlay={handlePlay} />
                  ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Others Section (manual uploads) ────────────────────── */}
      {(loading || otherProjects.length > 0) && (
        <section className={`section-padding ${
          tiktokProjects.length > 0 ? 'bg-dark' : instagramProjects.length > 0 ? 'bg-[#0a0a0a]' : 'bg-dark'
        }`}>
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeader
              icon={HiPhotograph}
              iconClass="text-white"
              label="Other Projects"
              count={otherProjects.length}
              accentColor="from-purple-600/80 to-indigo-500/60"
            />
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
              {loading
                ? Array.from({ length: 4 }).map((_, i) => <CardSkeleton key={i} />)
                : otherProjects.map((project, index) => (
                    <OtherProjectCard key={project.id || index} project={project} index={index} />
                  ))}
            </div>
          </div>
        </section>
      )}

      {/* Global empty state */}
      {!loading && projects.length === 0 && (
        <section className="section-padding bg-dark">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-24"
            >
              <div className="flex items-center justify-center gap-4 mb-4">
                <SiInstagram className="text-4xl text-pink-400/25" />
                <SiTiktok className="text-4xl text-white/10" />
                <HiPhotograph className="text-4xl text-purple-400/15" />
              </div>
              <p className="text-white/30 text-lg">No projects yet</p>
              <p className="text-white/20 text-sm mt-1">Projects will appear here once added</p>
            </motion.div>
          </div>
        </section>
      )}
    </motion.div>
  );
};

export default ProjectsPage;
