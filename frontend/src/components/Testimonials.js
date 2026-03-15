import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiChevronLeft, HiChevronRight } from 'react-icons/hi';
import { FiStar } from 'react-icons/fi';

// Import images from your assets folder
import benidhi from '../assets/benidhi.jpeg';
import clinic from '../assets/clinic.jpeg';
import shivam from '../assets/shivam.jpeg';
import goldCup from '../assets/gold-cup.jpeg';


const testimonials = [
  {
    text: 'We wanted to improve our online presence and reach more customers. Digivents helped us with digital marketing and the results have been very positive for our business.',
    name: 'Bednidhi Traders',
    avatar: benidhi
  },
  {
    text: 'Working with Digivents has been a smooth experience. They helped us grow our visibility online and connect with more people who need our services',
    name: 'Advance Pain Specialist Clinic',
    avatar: clinic
  },
  {
    text: 'Our social media presence has improved a lot. We are now reaching the right audience for our housing projects',
    name: 'Shivam Housing',
    avatar: shivam
  },
  {
    text: 'With Digivents’ support, our match updates and schedules reached fans instantly. The engagement this season was outstanding.',
    name: 'Jhapa Gold Cup',
    avatar: goldCup
  },
];

const slideVariants = {
  enter: (dir) => ({ x: dir > 0 ? 300 : -300, opacity: 0, scale: 0.9 }),
  center: { x: 0, opacity: 1, scale: 1 },
  exit: (dir) => ({ x: dir > 0 ? -300 : 300, opacity: 0, scale: 0.9 }),
};

const Testimonials = () => {
  const [[current, direction], setCurrent] = useState([0, 0]);

  const next = () => setCurrent([(current + 1) % testimonials.length, 1]);
  const prev = () => setCurrent([(current - 1 + testimonials.length) % testimonials.length, -1]);

  const testimonial = testimonials[current];

  return (
    <section className="section-padding bg-dark relative overflow-hidden">
      <motion.div
        animate={{ opacity: [0.3, 0.6, 0.3], scale: [1, 1.3, 1] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl"
      />
      <motion.div
        animate={{ opacity: [0.2, 0.4, 0.2], scale: [1, 1.2, 1] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 3 }}
        className="absolute bottom-0 left-0 w-72 h-72 bg-white/5 rounded-full blur-3xl"
      />

      <div className="max-w-7xl mx-auto relative">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <span className="text-white/50 text-sm uppercase tracking-widest font-medium">Testimonials</span>
          <h2 className="section-title mt-3">
            Our Client Chronicles:<br />
            <span className="gradient-text">Stories that Make Us Smile!</span>
          </h2>
        </motion.div>

        <div className="max-w-3xl mx-auto">
          <div className="relative h-[320px] sm:h-[280px]">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={current}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
                className="absolute inset-0 bg-darkGray border border-white/10 rounded-3xl p-8 lg:p-12"
              >
                <div className="absolute -top-4 left-8 text-6xl text-white/10 font-serif">"</div>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="flex gap-1 mb-6"
                >
                  {[...Array(5)].map((_, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, scale: 0, rotate: -180 }}
                      animate={{ opacity: 1, scale: 1, rotate: 0 }}
                      transition={{ delay: 0.4 + i * 0.1, type: 'spring' }}
                    >
                      <FiStar className="text-amber-400 fill-amber-400 text-lg" />
                    </motion.div>
                  ))}
                </motion.div>

                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.4 }}
                  className="text-white/70 text-lg leading-relaxed mb-8"
                >
                  {testimonial.text}
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                  className="flex items-center gap-4"
                >
                  <motion.img
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.5, type: 'spring' }}
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    className="w-14 h-14 rounded-full object-cover border-2 border-white/20"
                  />
                  <div>
                    <h4 className="text-white font-semibold">{testimonial.name}</h4>
                    <p className="text-white/40 text-sm">{testimonial.title}</p>
                  </div>
                </motion.div>
              </motion.div>
            </AnimatePresence>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="flex items-center justify-center gap-4 mt-8"
          >
            <motion.button
              whileHover={{ scale: 1.15, backgroundColor: 'rgba(255,255,255,0.2)' }}
              whileTap={{ scale: 0.9 }}
              onClick={prev}
              className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center text-white transition-all"
            >
              <HiChevronLeft className="text-xl" />
            </motion.button>

            <div className="flex gap-2">
              {testimonials.map((_, i) => (
                <motion.button
                  key={i}
                  onClick={() => setCurrent([i, i > current ? 1 : -1])}
                  animate={{
                    width: i === current ? 24 : 8,
                    backgroundColor: i === current ? '#C07B32' : 'rgba(255,255,255,0.3)',
                  }}
                  transition={{ duration: 0.3 }}
                  className="h-2 rounded-full"
                />
              ))}
            </div>

            <motion.button
              whileHover={{ scale: 1.15, backgroundColor: 'rgba(255,255,255,0.2)' }}
              whileTap={{ scale: 0.9 }}
              onClick={next}
              className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center text-white transition-all"
            >
              <HiChevronRight className="text-xl" />
            </motion.button>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
