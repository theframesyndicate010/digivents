import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { HiArrowRight } from 'react-icons/hi';
import { FiSend } from 'react-icons/fi';
import { pageTransition } from '../animations';
import { contactInfo } from '../data/contactData';
import { fetchFormFields, sendMessage } from '../data/contactApi';

const smooth = [0.33, 1, 0.68, 1];

const ContactPage = () => {
  const [formConfig, setFormConfig] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({});
  const [submitStatus, setSubmitStatus] = useState(null);

  useEffect(() => {
    fetchFormFields()
      .then((fieldsData) => {
        setFormConfig(fieldsData);
      })
      .catch((err) => console.error('Failed to fetch form fields:', err))
      .finally(() => setLoading(false));
  }, []);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const validateForm = () => {
    const required = ['First Name', 'Last Name', 'Email', 'Message'];
    const missing = required.filter(field => !formData[field]?.trim());
    
    if (missing.length > 0) {
      setSubmitStatus(`Please fill in: ${missing.join(', ')}`);
      return false;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData['Email'])) {
      setSubmitStatus('Please enter a valid email address');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      setSubmitStatus('Sending your message...');
      const result = await sendMessage(formData);
      setSubmitStatus(result.message);
      setFormData({});
      e.target.reset();
      setTimeout(() => setSubmitStatus(null), 5000);
    } catch (err) {
      console.error('Submit error:', err);
      const errorMsg = err.message || 'Failed to send message. Please try again.';
      setSubmitStatus(`Error: ${errorMsg}`);
    }
  };
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
            src="https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=1920&q=80"
            alt="Contact"
            className="w-full h-full object-cover"
            style={{ scale: bgScale }}
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{ duration: 1.6, ease: smooth }}
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
            className="h-[3px] bg-gradient-to-r from-accent2 to-accent1 mb-8 rounded-full"
          />
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.5, ease: smooth }}
            className="text-white/50 text-sm uppercase tracking-[0.2em] font-medium block mb-4"
          >
            Contact Us
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.7, ease: smooth }}
            className="text-5xl sm:text-6xl lg:text-8xl font-bold leading-[0.95] text-white"
          >
            Let's Connect
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6, ease: smooth }}
            className="text-white/50 text-base sm:text-lg mt-6 max-w-2xl leading-relaxed"
          >
            Ready to start your next project? Get in touch and let's create something amazing together.
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

      {/* ─── CONTACT GRID ─── */}
      <section className="section-padding bg-dark">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">

            {/* ── LEFT: INFO ── */}
            <div>
              <motion.h2
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, ease: smooth }}
                className="text-3xl font-bold mb-4"
              >
                Not limited to video,<br />
                <span className="gradient-text">we're your creative comrades.</span>
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1, duration: 0.5, ease: smooth }}
                className="text-white/50 mb-10 leading-relaxed"
              >
                Got questions, project ideas, or just want to say hi? We're all ears! Drop us a message and we'll get back to you within 24 hours.
              </motion.p>

              <div className="space-y-4">
                {contactInfo.map((info, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.08, duration: 0.5, ease: smooth }}
                    className="flex items-start gap-5 group cursor-pointer p-4 rounded-xl hover:bg-white/[0.04] transition-all duration-300"
                  >
                    <span className="w-12 h-12 bg-gradient-to-br from-accent2/20 to-accent1/20 border border-white/[0.06] rounded-xl flex items-center justify-center text-white text-lg shrink-0 group-hover:border-white/15 transition-colors duration-300">
                      {info.icon}
                    </span>
                    <div>
                      <h4 className="text-white font-medium mb-1">{info.label}</h4>
                      <p className="text-white/40 text-sm">{info.value}</p>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Map placeholder */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2, duration: 0.5, ease: smooth }}
                className="mt-10 h-48 bg-darkGray border border-white/[0.06] rounded-2xl flex items-center justify-center overflow-hidden relative"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/[0.03] to-transparent" />
                <div className="text-center relative">
                  <div className="text-white text-3xl mb-2">📍</div>
                  <p className="text-white/30 text-sm">
                    {contactInfo.find(info => info.label?.toLowerCase().includes('address') || info.label?.toLowerCase().includes('location'))?.value || 'Loading location...'}
                  </p>
                </div>
              </motion.div>
            </div>

            {/* ── RIGHT: FORM ── */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.15, duration: 0.6, ease: smooth }}
            >
              <div className="bg-gradient-to-br from-darkGray via-darkGray to-dark border border-white/[0.1] rounded-3xl p-8 lg:p-10 hover:border-white/20 transition-all duration-300 shadow-2xl">
                <div className="flex items-center gap-3 mb-10">
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    className="w-12 h-12 bg-gradient-to-br from-accent2/30 to-accent1/30 border border-white/[0.15] rounded-xl flex items-center justify-center text-accent1 shadow-lg shadow-accent1/20"
                  >
                    <FiSend size={20} />
                  </motion.div>
                  <div>
                    <h3 className="text-2xl font-bold text-white">Send a Message</h3>
                    <p className="text-white/40 text-xs mt-1">We'll respond within 24 hours</p>
                  </div>
                </div>

                <form className="space-y-6" onSubmit={handleSubmit}>
                  {formConfig && (
                    <>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        {formConfig.nameFields.map((ph, i) => (
                          <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                          >
                            <label className="text-white/50 text-xs uppercase tracking-wider font-medium mb-2.5 block">{ph}</label>
                            <input
                              type="text"
                              placeholder={ph}
                              value={formData[ph] || ''}
                              onChange={(e) => handleInputChange(ph, e.target.value)}
                              className="w-full bg-dark/60 border border-white/[0.1] rounded-xl px-5 py-3.5 text-white placeholder:text-white/25 focus:border-accent1 focus:bg-dark/80 focus:outline-none focus:ring-2 focus:ring-accent1/30 transition-all duration-300 text-sm font-medium hover:border-white/20"
                            />
                          </motion.div>
                        ))}
                      </div>

                      {formConfig.inputFields.map((field, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, y: 20 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: (2 + i) * 0.1 }}
                        >
                          <label className="text-white/50 text-xs uppercase tracking-wider font-medium mb-2.5 block">{field.label}</label>
                          <input
                            type={field.type}
                            placeholder={field.placeholder}
                            value={formData[field.label] || ''}
                            onChange={(e) => handleInputChange(field.label, e.target.value)}
                            className="w-full bg-dark/60 border border-white/[0.1] rounded-xl px-5 py-3.5 text-white placeholder:text-white/25 focus:border-accent1 focus:bg-dark/80 focus:outline-none focus:ring-2 focus:ring-accent1/30 transition-all duration-300 text-sm font-medium hover:border-white/20"
                          />
                        </motion.div>
                      ))}

                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.4 }}
                      >
                        <label className="text-white/50 text-xs uppercase tracking-wider font-medium mb-2.5 block">{formConfig.messageField.label}</label>
                        <textarea
                          value={formData['Message'] || ''}
                          placeholder={formConfig.messageField.placeholder}
                          rows={formConfig.messageField.rows}
                          onChange={(e) => handleInputChange('Message', e.target.value)}
                          className="w-full bg-dark/60 border border-white/[0.1] rounded-xl px-5 py-3.5 text-white placeholder:text-white/25 focus:border-accent1 focus:bg-dark/80 focus:outline-none focus:ring-2 focus:ring-accent1/30 transition-all duration-300 text-sm font-medium hover:border-white/20 resize-none"
                        />
                      </motion.div>
                    </>
                  )}

                  {submitStatus && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className={`px-4 py-3 rounded-xl text-sm text-center font-medium transition-all duration-300 ${
                        submitStatus.toLowerCase().includes('failed')
                          ? 'bg-accentRed/20 border border-accentRed/40 text-accentRed'
                          : 'bg-accentGreen/20 border border-accentGreen/40 text-accentGreen'
                      }`}
                    >
                      {submitStatus}
                    </motion.div>
                  )}

                  <motion.button
                    type="submit"
                    whileHover={{ y: -3, scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ duration: 0.2, ease: 'easeOut' }}
                    className="btn-primary w-full justify-center text-sm font-semibold shadow-lg hover:shadow-xl hover:shadow-accent1/30 transition-all duration-300"
                  >
                    Send Message <HiArrowRight />
                  </motion.button>
                </form>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </motion.div>
  );
};

export default ContactPage;
