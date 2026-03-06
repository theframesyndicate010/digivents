import React from 'react';
import { motion } from 'framer-motion';
import { staggerContainer } from '../animations';

const industries = [
  { title: 'Corporate Videos', description: "Enhance your brand's impact with our corporate video expertise. We create engaging content for businesses, from promotions to training materials.", image: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=600&q=80' },
  { title: 'Documentaries', description: 'We bring real-life stories to life. Our documentaries inform, entertain, and educate on diverse subjects.', image: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=600&q=80' },
  { title: 'Entertainment & Narrative Films', description: "Immerse your audience in captivating stories. Our creative team brings your visions to life.", image: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=600&q=80' },
  { title: 'Commercials & Advertisements', description: 'Make a memorable impression. Our short, attention-grabbing videos showcase your products effectively.', image: 'https://images.unsplash.com/photo-1559028012-481c04fa702d?w=600&q=80' },
  { title: 'Shorts & Reels', description: 'Stay on-trend and engage your audience with our dynamic social media content designed for maximum impact.', image: 'https://images.unsplash.com/photo-1611162616475-46b635cb6868?w=600&q=80' },
  { title: 'Event & Live Streaming', description: 'Capture and share the excitement of live events with multi-camera setups and post-event editing.', image: 'https://images.unsplash.com/photo-1505236858219-8359eb29e329?w=600&q=80' },
  { title: 'Animation & VFX', description: 'Elevate your content with stunning visuals using cutting-edge tech for breathtaking effects.', image: 'https://images.unsplash.com/photo-1535016120720-40c646be5580?w=600&q=80' },
];

const itemVariants = {
  hidden: { opacity: 0, x: -60, scale: 0.95 },
  visible: (i) => ({
    opacity: 1,
    x: 0,
    scale: 1,
    transition: {
      duration: 0.6,
      delay: i * 0.12,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  }),
};

const Industries = () => {
  return (
    <section className="section-padding bg-dark overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <motion.span
            initial={{ opacity: 0, letterSpacing: '0em' }}
            whileInView={{ opacity: 1, letterSpacing: '0.2em' }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-white/50 text-sm uppercase font-medium inline-block"
          >
            Industries
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="section-title mt-3"
          >
            We're Video Pros in<br />
            <span className="gradient-text">Many Industries!</span>
          </motion.h2>
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {industries.map((item, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              custom={index}
              whileHover={{
                scale: 1.02,
                y: -8,
                transition: { duration: 0.3 },
              }}
              className={`group relative overflow-hidden rounded-2xl border border-white/10 hover:border-white/25 transition-colors duration-500 bg-darkGray ${
                index === 0 ? 'md:col-span-2' : ''
              }`}
            >
              <div className="flex flex-col sm:flex-row">
                <div className="sm:w-1/2 p-8 flex flex-col justify-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 + index * 0.1, type: 'spring' }}
                    className="inline-flex items-center gap-2 mb-4"
                  >
                    <span className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center text-white/60 text-xs font-bold">
                      0{index + 1}
                    </span>
                  </motion.div>
                  <h3 className="text-xl lg:text-2xl font-bold text-white mb-3 group-hover:text-white/70 transition-colors duration-300">
                    {item.title}
                  </h3>
                  <p className="text-white/50 text-sm leading-relaxed">{item.description}</p>
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: '40%' }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.6 + index * 0.1, duration: 0.6 }}
                    className="h-0.5 bg-gradient-to-r from-accent1 to-accent2 mt-4 rounded-full"
                  />
                </div>
                <div className="sm:w-1/2 h-64 sm:h-auto overflow-hidden relative">
                  <motion.img
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.7 }}
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-darkGray/30 to-transparent" />
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Industries;
