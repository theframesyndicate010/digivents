import React, { useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { pageTransition, fadeInUp, staggerContainer } from '../animations';
import { PlayCircle, Mouse, Search, X } from 'lucide-react';
import { fetchAllProjects } from '../data/projectsApi';
import { fetchAllGraphics } from '../data/graphicsApi';

const ProjectsPage = () => {
  const heroRef = useRef(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [selectedProject, setSelectedProject] = useState(null);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const bgY = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
  const bgScale = useTransform(scrollYProgress, [0, 1], [1, 1.15]);
  const textY = useTransform(scrollYProgress, [0, 1], ['0%', '40%']);
  const textOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const overlayOpacity = useTransform(scrollYProgress, [0, 0.8], [0.3, 0.85]);

  useEffect(() => {
    Promise.all([fetchAllProjects(), fetchAllGraphics()])
      .then(([projectsData, graphicsData]) => {
        // Add type indicator to distinguish projects from graphics
        const projectsWithType = projectsData.map((p) => ({ ...p, contentType: 'project' }));
        const graphicsWithType = graphicsData.map((g) => ({ 
          ...g, 
          contentType: 'graphic',
          title: g.title,
          image: g.image 
        }));
        // Combine projects and graphics
        setProjects([...projectsWithType, ...graphicsWithType]);
      })
      .catch((error) => {
        console.error('Failed to fetch projects or graphics:', error);
        setProjects([]);
      })
      .finally(() => setLoading(false));
  }, []);

  const filteredProjects = useMemo(() => {
    return projects.filter((item) => {
      // Determine type: project with video, project without video, or graphic
      const itemType = item.contentType === 'graphic' ? 'graphic' : (item.videoUrl ? 'video' : 'graphic');
      const creator = item.workers?.[0]?.name || '';
      const query = searchQuery.toLowerCase().trim();

      const matchesSearch =
        item.title.toLowerCase().includes(query) ||
        (item.client || '').toLowerCase().includes(query) ||
        creator.toLowerCase().includes(query) ||
        (item.category || '').toLowerCase().includes(query);

      const matchesFilter = filterType === 'all' || itemType === filterType;

      return matchesSearch && matchesFilter;
    });
  }, [projects, searchQuery, filterType]);

  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageTransition}
      className="min-h-screen bg-dark text-white font-sans"
    >
      {/* ─── HERO SECTION ─── */}
      <section ref={heroRef} className="relative h-[80vh] min-h-[600px] overflow-hidden flex items-end">
        <motion.div className="absolute inset-0" style={{ y: bgY }}>
          <motion.img
            src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1920&q=80"
            alt="Projects Hero"
            className="w-full h-full object-cover"
            style={{ scale: bgScale }}
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{ duration: 1.6, ease: [0.33, 1, 0.68, 1] }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-dark via-dark/40 to-dark/20" />
          <motion.div className="absolute inset-0 bg-dark" style={{ opacity: overlayOpacity }} />
    </motion.div>

        <motion.div
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative w-full pb-16 sm:pb-24"
          style={{ y: textY, opacity: textOpacity }}
        >
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: '4rem' }}
            transition={{ delay: 0.1, duration: 0.7, ease: 'easeOut' }}
            className="h-[3px] bg-gradient-to-r from-accent2 to-accent1 mb-8 rounded-full"
          />
          <motion.h1
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.7, ease: [0.33, 1, 0.68, 1] }}
            className="text-5xl sm:text-6xl lg:text-8xl font-bold leading-[0.95] text-white mb-6"
          >
            Our Projects
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6, ease: [0.33, 1, 0.68, 1] }}
            className="text-white/70 text-base sm:text-xl max-w-2xl leading-relaxed"
          >
            Watch our latest work come to life. Each project tells a story — tap play to experience it.
          </motion.p>
          
          <motion.div
             initial={{ opacity: 0 }}
             animate={{ opacity: 1 }}
             transition={{ delay: 1, duration: 1 }}
             className="mt-12 flex items-center gap-3 text-white/40 text-xs font-bold tracking-widest uppercase"
          >
            <motion.div
              animate={{ y: [0, 6, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            >
              <Mouse size={24} />
            </motion.div>
            <span>Scroll to explore</span>
          </motion.div>
        </motion.div>
      </section>

      <div className="max-w-7xl mx-auto px-4 lg:px-10 py-20">
        
        {/* Search & Filters */}
        <div className="sticky top-20 z-40 bg-dark/80 backdrop-blur-md py-6 mb-8 -mx-4 px-4 lg:-mx-10 lg:px-10 flex flex-col md:flex-row justify-between items-center gap-6 border-b border-white/5 transition-all duration-300">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" size={20} />
            <input
              type="text"
              placeholder="Search projects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-full py-3 pl-12 pr-6 text-white placeholder:text-white/40 focus:outline-none focus:border-accent1 transition-colors"
            />
          </div>

          <div className="flex items-center gap-2 bg-white/5 p-1 rounded-full border border-white/10">
            {['all', 'video', 'graphic'].map((type) => (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  filterType === type
                    ? 'bg-accent1 text-white shadow-lg shadow-accent1/25'
                    : 'text-white/60 hover:text-white hover:bg-white/5'
                }`}
              >
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Project Grid */}
        <main>
          <AnimatePresence mode="wait">
              <motion.div 
                key={filterType} // Add key to trigger re-animation on filter change
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6"
              >
                {loading && (
                  Array.from({ length: 8 }).map((_, index) => (
                    <div
                      key={`skeleton-${index}`}
                      className="bg-darkGray rounded-xl overflow-hidden aspect-[9/16] border border-white/5 animate-pulse"
                    >
                      <div className="w-full h-full bg-white/5" />
                    </div>
                  ))
                )}

                {!loading && filteredProjects.map((project) => {
                  const projectType = project.videoUrl ? 'video' : 'graphic';
                  const creator = project.workers?.[0]?.name || 'Digivents Team';
                  const imageSrc = project.image;

                  return (
                  <motion.div 
                    key={project.id} 
                    variants={fadeInUp}
                    className="group relative bg-darkGray rounded-2xl overflow-hidden aspect-[9/16] cursor-pointer border border-white/10 hover:border-white/30 shadow-lg hover:shadow-2xl transition-all duration-500 h-full"
                    onClick={() => setSelectedProject(project)}
                  >
                    {imageSrc ? (
                      <img 
                        src={imageSrc}
                        alt={project.title} 
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'flex'; // Show placeholder
                        }}
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center group-hover:scale-110 transition-transform duration-700">
                         {/* Placeholder if no image */}
                         <div className="text-white/30 flex flex-col items-center gap-3">
                            {projectType === 'video' ? <PlayCircle size={56} strokeWidth={1.5} /> : <Search size={56} strokeWidth={1.5} />}
                            <span className="text-xs uppercase tracking-widest font-bold opacity-60">No Preview</span>
                         </div>
                      </div>
                    )}
                    
                    {/* Fallback Placeholder (Hidden by default, shown on error) */}
                    <div className="hidden absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 items-center justify-center group-hover:scale-110 transition-transform duration-700">
                         <div className="text-white/30 flex flex-col items-center gap-3">
                            {projectType === 'video' ? <PlayCircle size={56} strokeWidth={1.5} /> : <Search size={56} strokeWidth={1.5} />}
                            <span className="text-xs uppercase tracking-widest font-bold opacity-60">No Preview</span>
                         </div>
                    </div>

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/40 to-black/90 opacity-50 group-hover:opacity-70 transition-opacity duration-300" />

                    {/* Play Button (Center) */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                        <motion.div
                          initial={{ scale: 0.8 }}
                          whileHover={{ scale: 1.2 }}
                          className="w-14 h-14 bg-white/25 backdrop-blur-xl rounded-full flex items-center justify-center text-white border border-white/40 shadow-xl shadow-white/20"
                        >
                           <PlayCircle size={28} fill="currentColor" />
                        </motion.div>
                    </div>

                    {/* Content (Bottom) */}
                    <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/95 via-black/60 to-transparent transform translate-y-1 group-hover:translate-y-0 transition-transform duration-300">
                      <div className="flex items-center gap-2 mb-3">
                        <span className={`px-3 py-1 ${projectType === 'video' ? 'bg-gradient-to-r from-accent2 to-accent1' : 'bg-blue-500/70'} text-white text-[10px] font-bold rounded-full uppercase tracking-wider shadow-lg`}>
                           {projectType === 'video' ? '▶ Reel' : '◆ Design'}
                        </span>
                      </div>
                      <h3 className="font-bold text-white text-sm md:text-base leading-tight line-clamp-2 mb-2">
                        {project.title}
                      </h3>
                      <p className="text-white/70 text-xs font-medium truncate flex items-center gap-1">
                        <span className="w-1 h-1 bg-accent1 rounded-full"></span>
                        {project.client || project.category || 'Client'} • {creator}
                      </p>
                    </div>
                  </motion.div>
                )})}
              </motion.div>

              {!loading && filteredProjects.length === 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center py-16"
                >
                  <p className="text-white/35 text-lg">No projects found</p>
                  <p className="text-white/20 text-sm mt-2">Try another search or filter.</p>
                </motion.div>
              )}
          </AnimatePresence>
        </main>
      </div>

      {/* Modal Popup */}
      {createPortal(
        <AnimatePresence>
          {selectedProject && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/95 backdrop-blur-md"
              onClick={() => setSelectedProject(null)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                className="relative w-full max-w-6xl bg-black rounded-3xl overflow-hidden shadow-2xl border border-white/20 flex flex-col max-h-[95vh]"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={() => setSelectedProject(null)}
                  className="absolute top-6 right-6 z-10 p-3 bg-black/60 hover:bg-white/20 rounded-full text-white transition-all duration-300 border border-white/20 hover:border-white/40 shadow-lg"
                >
                  <X size={24} />
                </button>
                
                <div className="relative w-full bg-black flex items-center justify-center overflow-auto">
                  {selectedProject.videoUrl ? (
                    (() => {
                      const url = selectedProject.videoUrl;
                      if (url.includes('youtube.com') || url.includes('youtu.be')) {
                        let videoId = url.split('v=')[1]?.split('&')[0];
                        if (!videoId && url.includes('youtu.be')) videoId = url.split('/').pop();
                        return (
                          <div className="w-full aspect-video max-h-[calc(95vh-200px)]">
                            <iframe
                              src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
                              title={selectedProject.title}
                              className="w-full h-full"
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                              allowFullScreen
                            />
                          </div>
                        );
                      }
                      if (url.includes('vimeo.com')) {
                        const videoId = url.split('/').pop();
                        return (
                          <div className="w-full aspect-video max-h-[calc(95vh-200px)]">
                            <iframe
                              src={`https://player.vimeo.com/video/${videoId}?autoplay=1`}
                              title={selectedProject.title}
                              className="w-full h-full"
                              allow="autoplay; fullscreen; picture-in-picture"
                              allowFullScreen
                            />
                          </div>
                        );
                      }
                      if (url.includes('tiktok.com')) {
                        // Extract video ID from tiktok url (e.g. https://www.tiktok.com/@user/video/123456789)
                        const match = url.match(/video\/(\d+)/);
                        const videoId = match ? match[1] : null;
                        if (videoId) {
                           return (
                            <div className="w-full max-w-[400px] aspect-[9/16] max-h-[calc(95vh-200px)]">
                              <iframe
                                src={`https://www.tiktok.com/embed/v2/${videoId}`}
                                title={selectedProject.title}
                                className="w-full h-full"
                                allow="autoplay; fullscreen; picture-in-picture"
                                allowFullScreen
                              />
                            </div>
                           )
                        }
                      }
                      if (url.includes('instagram.com/reel') || url.includes('instagram.com/p/')) {
                         // Convert to embed url
                         const embedUrl = url.split('?')[0].replace(/\/$/, '') + '/embed';
                         return (
                          <div className="w-full max-w-[400px] aspect-[9/16] max-h-[calc(95vh-200px)] bg-white rounded-xl overflow-hidden">
                            <iframe
                              src={embedUrl}
                              title={selectedProject.title}
                              className="w-full h-full"
                              allow="autoplay; fullscreen; picture-in-picture"
                              allowFullScreen
                              scrolling="no"
                              frameBorder="0"
                            />
                          </div>
                         )
                      }
                      return (
                        <video
                          src={url}
                          controls
                          autoPlay
                          className="w-full h-auto max-h-[calc(95vh-200px)] object-contain"
                        />
                      );
                    })()
                  ) : (
                    <img
                      src={selectedProject.image}
                      alt={selectedProject.title}
                      className="w-full h-auto max-h-[calc(95vh-200px)] object-contain rounded-lg"
                      onError={(e) => {
                        e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 600"%3E%3Crect fill="%23222" width="400" height="600"/%3E%3C/svg%3E';
                      }}
                    />
                  )}
                </div>
                
                <div className="p-8 bg-gradient-to-t from-black via-black/80 to-black/0 border-t border-white/10 shrink-0">
                  <h3 className="text-3xl font-bold text-white mb-3">{selectedProject.title}</h3>
                  <div className="flex items-center gap-3 mb-4">
                    <span className={`px-4 py-1.5 ${selectedProject.videoUrl ? 'bg-gradient-to-r from-accent2 to-accent1' : 'bg-blue-500/70'} text-white text-xs font-bold rounded-full uppercase tracking-wider`}>
                      {selectedProject.videoUrl ? '▶ Video' : '◆ Image'}
                    </span>
                    {selectedProject.client && (
                      <span className="text-white/60 text-sm">• {selectedProject.client}</span>
                    )}
                  </div>
                  <p className="text-white/70 text-base leading-relaxed">
                    {selectedProject.description || selectedProject.category || 'No description available'}
                  </p>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </motion.div>
  );
};

export default ProjectsPage;
