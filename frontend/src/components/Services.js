import React from 'react';
import { motion } from 'framer-motion';
import { HiArrowRight } from 'react-icons/hi';
import { Link } from 'react-router-dom';
import { fadeInUp, staggerContainer } from '../animations';

const services = [
  {
    title: 'Social Media Marketing',
    description: 'Boost engagement and build a strong online presence.',
  },
  {
    title: 'Off-Page SEO',
    description: "Increase your site's visibility and authority through backlinks, social sharing, and online promotion.",
  },
  {
    title: 'Content Creation',
    description: 'Craft visuals and copy that tell your brand story.',
  },
  {
    title: 'Paid Advertising',
    description: 'Run targeted campaigns on Google & Meta for measurable results.',
  },
  {
    title: 'Branding & Design',
    description: 'Develop a memorable identity that connects with your audience.',
  },
  {
    title: 'Reels Shoot & Edit',
    description: 'Create engaging short videos that capture attention and drive engagement.',
  },
];

const Services = () => {
  return (
    <section className="section-padding bg-darkGray overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-start">
          {/* Left - Title */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="lg:col-span-4 lg:sticky lg:top-32"
          >
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-5">
              OUR <span className="gradient-text">SERVICE</span>
            </h2>
            <p className="text-white/50 text-base leading-relaxed mb-8 max-w-md">
              We provide digital marketing solutions that help your brand grow, engage, and stand out online.
            </p>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link to="/services" className="btn-outline text-sm">
                Explore All Services <HiArrowRight />
              </Link>
            </motion.div>
          </motion.div>

          {/* Right - Timeline */}
          <div className="lg:col-span-8 relative">
            {/* Vertical line */}
            <motion.div
              initial={{ height: 0 }}
              whileInView={{ height: '100%' }}
              viewport={{ once: true }}
              transition={{ duration: 1.5, ease: 'easeInOut' }}
              className="absolute left-6 lg:left-8 top-0 w-px bg-gradient-to-b from-accent2 via-white/20 to-accent1 origin-top"
            />

            <div className="space-y-10">
              {services.map((service, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: 40 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.12 }}
                  className="relative pl-16 lg:pl-20 group"
                >
                  {/* Timeline dot */}
                  <motion.div
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.12 + 0.2, type: 'spring', stiffness: 300 }}
                    className="absolute left-3 lg:left-5 top-2 w-7 h-7 rounded-full border-2 border-white/20 bg-darkGray flex items-center justify-center group-hover:border-accent1 transition-colors duration-300"
                  >
                    <motion.div
                      className="w-2.5 h-2.5 rounded-full bg-white/30 group-hover:bg-accent1 transition-colors duration-300"
                    />
                  </motion.div>

                  {/* Service card */}
                  <motion.div
                    whileHover={{ x: 8, borderColor: 'rgba(255,255,255,0.2)' }}
                    transition={{ duration: 0.25 }}
                    className="border border-dashed border-white/10 rounded-xl p-6 hover:bg-white/[0.02] transition-colors duration-300 cursor-default"
                  >
                    <h3 className="text-lg sm:text-xl font-bold text-white uppercase tracking-wide mb-2 group-hover:text-white/80 transition-colors">
                      {service.title}
                    </h3>
                    <p className="text-white/45 text-sm leading-relaxed">
                      {service.description}
                    </p>
                  </motion.div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Services;
