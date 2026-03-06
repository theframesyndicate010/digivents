import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { HiArrowRight } from 'react-icons/hi';
import { Link } from 'react-router-dom';
import { fadeInUp, staggerContainer } from '../animations';
import { fetchFeaturedBlogs } from '../data/blogsApi';

const Blog = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeaturedBlogs(3)
      .then((data) => setBlogs(data))
      .catch((err) => console.error('Failed to fetch blogs:', err))
      .finally(() => setLoading(false));
  }, []);
  return (
    <section className="section-padding bg-dark overflow-hidden">
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
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-white/50 text-sm uppercase tracking-widest font-medium"
            >
              Blog
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="section-title mt-3"
            >
              Dive into our blogs
            </motion.h2>
          </div>
          <motion.div whileHover={{ scale: 1.05, x: 5 }} whileTap={{ scale: 0.95 }}>
            <Link to="/blog" className="btn-outline text-sm shrink-0">
              Read All Blogs <HiArrowRight />
            </Link>
          </motion.div>
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {loading
            ? Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="card-dark animate-pulse">
                  <div className="h-56 bg-white/5" />
                  <div className="p-6 space-y-3">
                    <div className="h-3 w-32 bg-white/5 rounded" />
                    <div className="h-4 w-full bg-white/10 rounded" />
                    <div className="h-3 w-20 bg-white/5 rounded" />
                  </div>
                </div>
              ))
            : blogs.map((blog, index) => (
            <motion.article
              key={index}
              variants={fadeInUp}
              custom={index}
              whileHover={{ y: -12, scale: 1.02 }}
              transition={{ type: 'spring', stiffness: 300 }}
              className="card-dark group cursor-pointer hover:border-white/20 transition-colors duration-500"
            >
              <div className="relative overflow-hidden h-56">
                <motion.img
                  whileHover={{ scale: 1.1, rotate: 1 }}
                  transition={{ duration: 0.6 }}
                  src={blog.image}
                  alt={blog.title}
                  className="w-full h-full object-cover"
                />
                <motion.div
                  initial={{ x: -100 }}
                  whileInView={{ x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 + index * 0.15, type: 'spring' }}
                  className="absolute top-4 left-4"
                >
                  <span className="bg-gradient-to-r from-accent1 to-accent2 text-white text-xs font-bold px-3 py-1 rounded-full">
                    {blog.category}
                  </span>
                </motion.div>
              </div>
              <div className="p-6">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-white/40 text-xs">{blog.author}</span>
                  <span className="w-1 h-1 bg-white/20 rounded-full" />
                  <span className="text-white/40 text-xs">{blog.date}</span>
                </div>
                <h3 className="text-white font-semibold leading-snug group-hover:text-white/70 transition-colors duration-300">
                  {blog.title}
                </h3>
                <motion.button
                  whileHover={{ x: 5 }}
                  className="mt-4 inline-flex items-center gap-2 text-white/60 text-sm font-medium hover:text-white transition-colors"
                >
                  READ BLOG <HiArrowRight />
                </motion.button>
              </div>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Blog;
