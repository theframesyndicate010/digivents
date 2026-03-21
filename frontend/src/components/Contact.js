import React, { useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { HiArrowRight } from 'react-icons/hi';
import { Link } from 'react-router-dom';
import { fadeInUp, fadeInLeft, fadeInRight, staggerContainer } from '../animations';
import { contactInfo } from '../data/contactData';

const Contact = () => {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      await axios.post('/message', {
        name: form.name,
        email: form.email,
        message: form.message
      });
      setSuccess('Message sent successfully!');
      setForm({ name: '', email: '', message: '' });
    } catch (err) {
      setError(
        err.response?.data?.message || 'Failed to send message. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="section-padding bg-dark relative overflow-hidden">
      <motion.div
        initial={{ scale: 1.2 }}
        whileInView={{ scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.5 }}
        className="absolute inset-0"
      >
        <img
          src="https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=1920&q=80"
          alt="Contact background"
          className="w-full h-full object-cover opacity-10"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-dark via-dark/95 to-dark" />
      </motion.div>

      <div className="max-w-7xl mx-auto relative">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <motion.span variants={fadeInLeft} className="text-white/50 text-sm uppercase tracking-widest font-medium">
              Get in Touch
            </motion.span>
            <motion.h2 variants={fadeInLeft} custom={1} className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight mt-3 mb-4">
              Not limited to video,<br />
              <span className="gradient-text">we're your creative comrades.</span>
            </motion.h2>
            <motion.p variants={fadeInLeft} custom={2} className="text-white/50 text-lg mb-8">
              Got questions, project ideas, or just want to say hi? We're all ears!
            </motion.p>

            <motion.div variants={fadeInLeft} custom={3} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link to="/contact" className="btn-primary mb-12 inline-flex">
                Let's Collaborate <HiArrowRight />
              </Link>
            </motion.div>

            <div className="space-y-5 mt-8">
              {contactInfo.map((info, index) => {
                let href = '#';
                if (info.label === 'Email') {
                  href = `mailto:${info.value}`;
                } else if (info.label === 'Phone') {
                  href = `tel:${info.value.replace(/\s/g, '')}`;
                }
                
                return (
                  <motion.a
                    key={index}
                    href={href}
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 + index * 0.12, duration: 0.5 }}
                    whileHover={{ x: 8, transition: { duration: 0.2 } }}
                    className="flex items-start gap-4 group cursor-pointer"
                  >
                    <motion.span
                      whileHover={{ scale: 1.2, rotate: 10 }}
                      className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center text-white shrink-0 group-hover:bg-white/15 transition-colors"
                    >
                      {info.icon}
                    </motion.span>
                    <div>
                      <h4 className="text-white font-medium text-sm">{info.label}</h4>
                      <p className="text-white/40 text-sm">{info.value}</p>
                    </div>
                  </motion.a>
                );
              })}
            </div>
          </motion.div>

          <motion.div
            variants={fadeInRight}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="flex items-center"
          >
            <motion.div
              whileHover={{ borderColor: 'rgba(255, 153, 51, 0.3)' }}
              className="w-full bg-gradient-to-br from-darkGray via-darkGray to-dark border border-white/10 rounded-3xl p-8 lg:p-10 hover:border-accent1/30 transition-all shadow-xl hover:shadow-2xl hover:shadow-accent1/10 duration-300"
            >
              <motion.h3
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
                className="text-2xl font-bold text-white mb-2"
              >
                Send us a message
              </motion.h3>
              <p className="text-white/40 text-sm mb-8">We'll get back to you within 24 hours.</p>

              <form className="space-y-5" onSubmit={handleSubmit}>
                <motion.div
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.4 }}
                >
                  <input
                    type="text"
                    name="name"
                    placeholder="Your Name"
                    value={form.name}
                    onChange={handleChange}
                    className="w-full bg-dark/60 border border-white/[0.1] rounded-xl px-5 py-3.5 text-white placeholder:text-white/25 focus:border-accent1 focus:bg-dark/80 focus:outline-none focus:ring-2 focus:ring-accent1/30 hover:border-white/20 transition-all text-sm font-medium"
                  />
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.5 }}
                >
                  <input
                    type="email"
                    name="email"
                    placeholder="Your Email"
                    value={form.email}
                    onChange={handleChange}
                    className="w-full bg-dark/60 border border-white/[0.1] rounded-xl px-5 py-3.5 text-white placeholder:text-white/25 focus:border-accent1 focus:bg-dark/80 focus:outline-none focus:ring-2 focus:ring-accent1/30 hover:border-white/20 transition-all text-sm font-medium"
                  />
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.6 }}
                >
                  <textarea
                    name="message"
                    placeholder="Your Message"
                    rows={4}
                    value={form.message}
                    onChange={handleChange}
                    className="w-full bg-dark/60 border border-white/[0.1] rounded-xl px-5 py-3.5 text-white placeholder:text-white/25 focus:border-accent1 focus:bg-dark/80 focus:outline-none focus:ring-2 focus:ring-accent1/30 hover:border-white/20 transition-all text-sm font-medium resize-none"
                  />
                </motion.div>
                {error && (
                  <div className="text-red-400 text-sm font-medium">{error}</div>
                )}
                {success && (
                  <div className="text-green-400 text-sm font-medium">{success}</div>
                )}
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.02, y: -3 }}
                  whileTap={{ scale: 0.98 }}
                  className="btn-primary w-full justify-center text-sm font-semibold shadow-lg hover:shadow-xl hover:shadow-accent1/30 transition-all duration-300"
                  disabled={loading}
                >
                  {loading ? 'Sending...' : (<><span>Send Message</span> <HiArrowRight /></>)}
                </motion.button>
              </form>
            </motion.div>
          </motion.div>
        </div>

      </div>
    </section>
  );
};

export default Contact;
