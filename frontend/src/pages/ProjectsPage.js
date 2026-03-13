import React, { useRef, useState } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { pageTransition, fadeInUp, staggerContainer } from '../animations';
import { PlayCircle, Mouse, Search } from 'lucide-react';

const ProjectsPage = () => {
  const heroRef = useRef(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const bgY = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
  const bgScale = useTransform(scrollYProgress, [0, 1], [1, 1.15]);
  const textY = useTransform(scrollYProgress, [0, 1], ['0%', '40%']);
  const textOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const overlayOpacity = useTransform(scrollYProgress, [0, 0.8], [0.3, 0.85]);

  // Mock Data - Updated for vertical orientation
  const projects = [
    { id: 1, title: "Summer Campaign", type: "video", album: "Marketing 2024", client: "Nike", creator: "Alex River", date: "2024-03-01", thumb: "https://images.unsplash.com/photo-1536240478700-b869070f9279?w=600&q=80" },
    { id: 2, title: "Brand Identity", type: "graphic", album: "Branding", client: "Apple", creator: "Sarah Chen", date: "2024-02-28", thumb: "https://images.unsplash.com/photo-1626785774573-4b799315345d?w=600&q=80" },
    { id: 3, title: "Product Launch", type: "video", album: "Marketing 2024", client: "Tesla", creator: "Alex River", date: "2024-03-05", thumb: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=600&q=80" },
    { id: 4, title: "Social Headers", type: "graphic", album: "Social Media", client: "Nike", creator: "Jordan Lee", date: "2024-01-15", thumb: "https://images.unsplash.com/photo-1557683316-973673baf926?w=600&q=80" },
    { id: 5, title: "Cinematic Intro", type: "video", album: "VFX", client: "Netflix", creator: "Sarah Chen", date: "2024-03-10", thumb: "https://images.unsplash.com/photo-1485846234645-a62644f84728?w=600&q=80" },
    { id: 6, title: "Logo Variations", type: "graphic", album: "Branding", client: "Starbucks", creator: "Jordan Lee", date: "2023-12-01", thumb: "https://images.unsplash.com/photo-1541462608141-ad516aeb6a30?w=600&q=80" },
  ];

  const filteredProjects = projects.filter(project => {
    const matchesSearch = 
      project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.creator.toLowerCase().includes(searchQuery.toLowerCase());
      
    const matchesFilter = filterType === 'all' || project.type === filterType;
    
    return matchesSearch && matchesFilter;
  });

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
            className="h-[3px] bg-gradient-to-r from-accent1 to-accent2 mb-8 rounded-full"
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
                {filteredProjects.map(project => (
                  <motion.div 
                    key={project.id} 
                    variants={fadeInUp}
                    className="group relative bg-darkGray rounded-xl overflow-hidden aspect-[9/16] cursor-pointer"
                  >
                    <img 
                      src={project.thumb} 
                      alt={project.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    
                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/80 opacity-60 group-hover:opacity-80 transition-opacity duration-300" />

                    {/* Play Button (Center) */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white border border-white/30">
                           <PlayCircle size={24} fill="currentColor" />
                        </div>
                    </div>

                    {/* Content (Bottom) */}
                    <div className="absolute bottom-0 left-0 w-full p-4 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="px-2 py-0.5 bg-accent1 text-white text-[9px] font-bold rounded-md uppercase tracking-wider">
                           {project.type === 'video' ? 'Reel' : 'Design'}
                        </span>
                      </div>
                      <h3 className="font-bold text-white text-sm md:text-base leading-snug line-clamp-2 mb-1">
                        {project.title}
                      </h3>
                      <p className="text-white/60 text-xs font-medium truncate">
                        {project.client} • {project.creator}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </motion.div>
  );
};

export default ProjectsPage;
