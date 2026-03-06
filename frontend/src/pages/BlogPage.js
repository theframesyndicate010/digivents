import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { HiArrowRight } from 'react-icons/hi';
import { pageTransition } from '../animations';
import { fetchAllBlogs } from '../data/blogsApi';

const BlogPage = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAllBlogs()
      .then((data) => setBlogs(data))
      .catch((err) => console.error('Failed to fetch blogs:', err))
      .finally(() => setLoading(false));
  }, []);
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const bgY = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
  const bgScale = useTransform(scrollYProgress, [0, 1], [1, 1.15]);
  const textY = useTransform(scrollYProgress, [0, 1], ['0%', '40%']);
  const textOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const overlayOpacity = useTransform(scrollYProgress, [0, 0.8], [0.3, 0.85]);

  return (
    <motion.div {...pageTransition}>

      {/* ─── FULL-SCREEN HERO ─── */}
      <section ref={heroRef} className="relative h-screen min-h-[600px] overflow-hidden flex items-end">
        <motion.div className="absolute inset-0" style={{ y: bgY }}>
          <motion.img
            src="https://images.unsplash.com/photo-1536240478700-b869070f9279?w=1920&q=80"
            alt="Blog"
            className="w-full h-full object-cover"
            style={{ scale: bgScale }}
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{ duration: 1.6, ease: [0.33, 1, 0.68, 1] }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-dark via-dark/70 to-dark/30" />
          <div className="absolute inset-0 bg-gradient-to-r from-dark/80 to-transparent" />
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
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.5, ease: [0.33, 1, 0.68, 1] }}
            className="text-white/50 text-sm uppercase tracking-[0.2em] font-medium block mb-4"
          >
            Our Blog
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.7, ease: [0.33, 1, 0.68, 1] }}
            className="text-5xl sm:text-6xl lg:text-8xl font-bold leading-[0.95] text-white"
          >
            Insights & Stories
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6, ease: [0.33, 1, 0.68, 1] }}
            className="text-white/50 text-base sm:text-lg mt-6 max-w-2xl leading-relaxed"
          >
            Latest news, tips, and behind-the-scenes stories from the world of video production.
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.5 }}
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

      {/* ─── FEATURED POST ─── */}
      <section className="section-padding bg-dark pb-8">
        <div className="max-w-7xl mx-auto">
          {loading ? (
            <div className="relative rounded-3xl overflow-hidden border border-white/[0.06] animate-pulse">
              <div className="grid grid-cols-1 lg:grid-cols-2">
                <div className="h-72 lg:h-96 bg-white/5" />
                <div className="bg-darkGray p-8 lg:p-12 space-y-4">
                  <div className="h-4 w-20 bg-white/10 rounded-full" />
                  <div className="h-6 w-3/4 bg-white/10 rounded" />
                  <div className="h-4 w-full bg-white/5 rounded" />
                  <div className="h-3 w-40 bg-white/5 rounded" />
                </div>
              </div>
            </div>
          ) : blogs.length > 0 && (
            <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.33, 1, 0.68, 1] }}
            className="relative rounded-3xl overflow-hidden group cursor-pointer border border-white/[0.06] hover:border-white/15 transition-colors duration-300"
          >
            <div className="grid grid-cols-1 lg:grid-cols-2">
              <div className="relative overflow-hidden h-72 lg:h-96">
                <img
                  src={blogs[0].image}
                  alt={blogs[0].title}
                  className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                  loading="lazy"
                />
              </div>
              <div className="bg-darkGray p-8 lg:p-12 flex flex-col justify-center">
                <span className="bg-gradient-to-r from-accent1 to-accent2 text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full w-fit mb-5">{blogs[0].category}</span>
                <h2 className="text-2xl lg:text-3xl font-bold text-white mb-3 group-hover:text-white/80 transition-colors duration-300">{blogs[0].title}</h2>
                <p className="text-white/40 leading-relaxed mb-6">{blogs[0].excerpt}</p>
                <div className="flex items-center gap-3 mb-5">
                  <span className="text-white/35 text-sm">{blogs[0].author}</span>
                  <span className="w-1 h-1 bg-white/20 rounded-full" />
                  <span className="text-white/35 text-sm">{blogs[0].date}</span>
                </div>
                <div className="inline-flex items-center gap-2 text-white/50 font-medium group-hover:text-accent1 transition-colors duration-300">
                  <span>Read Article</span>
                  <HiArrowRight className="group-hover:translate-x-1 transition-transform duration-300" />
                </div>
              </div>
            </div>
          </motion.div>
          )}
        </div>
      </section>

      {/* ─── BLOG GRID ─── */}
      <section className="section-padding bg-dark pt-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {loading
            ? Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="bg-darkGray border border-white/[0.06] rounded-2xl overflow-hidden animate-pulse">
                  <div className="h-52 sm:h-56 bg-white/5" />
                  <div className="p-6 space-y-3">
                    <div className="h-3 w-32 bg-white/5 rounded" />
                    <div className="h-4 w-full bg-white/10 rounded" />
                    <div className="h-3 w-3/4 bg-white/5 rounded" />
                  </div>
                </div>
              ))
            : blogs.slice(1).map((blog, index) => (
            <motion.article
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ delay: (index % 3) * 0.1, duration: 0.5, ease: [0.33, 1, 0.68, 1] }}
              whileHover={{ y: -8, transition: { duration: 0.25, ease: 'easeOut' } }}
              className="bg-darkGray border border-white/[0.06] rounded-2xl overflow-hidden group cursor-pointer hover:border-white/15 transition-colors duration-300"
            >
              <div className="relative overflow-hidden h-52 sm:h-56">
                <img
                  src={blog.image}
                  alt={blog.title}
                  className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-darkGray/60 via-transparent to-transparent" />
                <div className="absolute top-4 left-4">
                  <span className="bg-gradient-to-r from-accent1 to-accent2 text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full">{blog.category}</span>
                </div>
              </div>
              <div className="p-6">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-white/30 text-xs">{blog.author}</span>
                  <span className="w-1 h-1 bg-white/15 rounded-full" />
                  <span className="text-white/30 text-xs">{blog.date}</span>
                </div>
                <h3 className="text-white font-semibold leading-snug group-hover:text-white/80 transition-colors duration-300 mb-2">{blog.title}</h3>
                <p className="text-white/35 text-sm leading-relaxed">{blog.excerpt}</p>
                <div className="mt-4 inline-flex items-center gap-2 text-white/40 text-sm font-medium group-hover:text-accent1 transition-colors duration-300">
                  <span>Read Blog</span>
                  <HiArrowRight className="group-hover:translate-x-1 transition-transform duration-300" />
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </section>
    </motion.div>
  );
};

export default BlogPage;
