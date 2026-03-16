import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiChevronDown } from 'react-icons/hi';

const faqs = [
  { question: 'What services do you offer?', answer: 'We offer a comprehensive range of video production services including corporate videos, documentaries, commercials, social media content, event coverage, and full post-production editing.' },
  { question: 'How much does video production cost?', answer: 'Our pricing varies based on project scope, complexity, and requirements. We offer flexible packages starting from basic promotional videos to full-scale productions. Contact us for a custom quote tailored to your needs.' },
  { question: 'How long does it take to produce a video?', answer: 'Production timelines depend on the project complexity. A simple promotional video may take 2-3 weeks, while a full-scale production could take 4-8 weeks from pre-production to final delivery.' },
  { question: 'Can you help with scriptwriting and storyboarding?', answer: 'Absolutely! Our creative team includes experienced scriptwriters and storyboard artists who can help bring your vision to life from concept to completion.' },
  { question: 'What is the production process like?', answer: 'Our process follows three main phases: Pre-Production (planning, scripting, scheduling), Production (filming, direction), and Post-Production (editing, color grading, sound design, VFX).' },
  { question: 'Do you provide video marketing services?', answer: 'Yes! We offer comprehensive video marketing strategies including SEO optimization, social media distribution, analytics tracking, and targeted ad campaigns to maximize your video\'s reach.' },
  { question: 'Can you work with a specific budget?', answer: 'We pride ourselves on being flexible and accommodating. We can tailor our services to fit various budgets while maintaining the highest quality standards possible.' },
];

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <section className="section-padding bg-darkGray overflow-hidden">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <span className="text-white/50 text-sm uppercase tracking-widest font-medium">FAQs</span>
          <h2 className="section-title mt-3">
            Curious? Check Out the<br />
            <span className="gradient-text">Scoop!</span>
          </h2>
        </motion.div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: index % 2 === 0 ? -40 : 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.08 }}
            >
              <motion.div
                whileHover={{ scale: 1.01 }}
                className={`border rounded-2xl overflow-hidden transition-colors duration-300 ${
                  openIndex === index
                    ? 'border-white/20 bg-dark/80'
                    : 'border-white/10 bg-dark/40 hover:border-white/20'
                }`}
              >
                <motion.button
                  onClick={() => setOpenIndex(openIndex === index ? null : index)}
                  className="w-full flex items-center justify-between p-6 text-left"
                  whileTap={{ scale: 0.99 }}
                >
                  <span className="flex items-center gap-4">
                    <motion.span
                      animate={{
                        backgroundColor: openIndex === index ? 'rgba(192,123,50,0.2)' : 'rgba(255,255,255,0.05)',
                        color: openIndex === index ? '#C07B32' : 'rgba(255,255,255,0.5)',
                      }}
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold shrink-0"
                    >
                      0{index + 1}
                    </motion.span>
                    <span className={`font-medium transition-colors duration-300 ${openIndex === index ? 'text-white' : 'text-white/80'}`}>
                      {faq.question}
                    </span>
                  </span>
                  <motion.div
                    animate={{ rotate: openIndex === index ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <HiChevronDown className={`text-xl transition-colors ${openIndex === index ? 'text-white' : 'text-white/50'}`} />
                  </motion.div>
                </motion.button>

                <AnimatePresence>
                  {openIndex === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: 'easeInOut' }}
                      className="overflow-hidden"
                    >
                      <motion.p
                        initial={{ y: -10 }}
                        animate={{ y: 0 }}
                        className="px-6 pb-6 text-white/50 leading-relaxed text-sm pl-[4.5rem]"
                      >
                        {faq.answer}
                      </motion.p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQ;
