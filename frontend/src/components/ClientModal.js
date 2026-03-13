import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { HiOutlineLink } from 'react-icons/hi';
import { SiInstagram, SiTiktok, SiFacebook } from 'react-icons/si';

const ClientModal = ({ client, isOpen, onClose }) => {
  if (!client) return null;

  // Extract social links from the client data
  const socialLinks = {
    instagram: client.instagram || '',
    tiktok: client.tiktok || '',
    facebook: client.facebook || '',
  };

  const socialIcons = [
    {
      key: 'instagram',
      icon: SiInstagram,
      url: socialLinks.instagram,
      label: 'INSTAGRAM',
      color: 'text-pink-400',
    },
    {
      key: 'tiktok',
      icon: SiTiktok,
      url: socialLinks.tiktok,
      label: 'TIKTOK',
      color: 'text-white',
    },
    {
      key: 'facebook',
      icon: SiFacebook,
      url: socialLinks.facebook,
      label: 'FACEBOOK',
      color: 'text-blue-500',
    },
  ];

  const websiteUrl = client.website || client.socialMediaLink || '';

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-sm bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-3xl overflow-hidden border border-white/10 shadow-2xl"
          >
            {/* Close button */}
            <motion.button
              whileHover={{ rotate: 90, scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={onClose}
              className="absolute top-6 right-6 z-10 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
            >
              <X size={20} />
            </motion.button>

            {/* Content */}
            <div className="p-8 text-center flex flex-col items-center">
              {/* Logo */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.1, type: 'spring', damping: 20 }}
                className="mb-6 w-24 h-24 rounded-3xl bg-gradient-to-br from-cyan-400/20 via-blue-500/20 to-purple-600/20 border border-cyan-400/30 flex items-center justify-center shadow-lg shadow-cyan-500/20"
              >
                {client.logo ? (
                  <img
                    src={client.logo}
                    alt={client.name}
                    className="w-16 h-16 object-contain"
                  />
                ) : (
                  <div className="text-4xl font-bold text-cyan-400">
                    {client.name.charAt(0).toUpperCase()}
                  </div>
                )}
              </motion.div>

              {/* Client Name */}
              <motion.h2
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="text-2xl font-bold text-white mb-2"
              >
                {client.name}
              </motion.h2>

              {/* Links panel: row 1 website, row 2 socials */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
                className="w-full mt-6"
              >
                <div className="h-px bg-white/10 mb-5" />

                <div className="grid grid-cols-1 gap-3 mb-3">
                  {websiteUrl ? (
                    <motion.a
                      href={websiteUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ scale: 1.02, y: -1 }}
                      whileTap={{ scale: 0.98 }}
                      className="flex items-center justify-center gap-2 p-3 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-400/30 hover:border-cyan-300/50 transition-all group"
                    >
                      <HiOutlineLink className="text-base text-cyan-300 group-hover:scale-110 transition-transform" />
                      <span className="text-xs font-semibold text-cyan-200 tracking-wide">WEBSITE</span>
                    </motion.a>
                  ) : (
                    <div className="flex items-center justify-center gap-2 p-3 rounded-xl bg-white/5 border border-white/10">
                      <HiOutlineLink className="text-base text-white/40" />
                      <span className="text-xs font-semibold text-white/40 tracking-wide">NO WEBSITE</span>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-3 gap-3">
                  {socialIcons.map((social, index) => {
                    const Icon = social.icon;
                    const isActive = Boolean(social.url);
                    if (isActive) {
                      return (
                        <motion.a
                          key={social.key}
                          href={social.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.3 + index * 0.05 }}
                          whileHover={{ scale: 1.05, y: -2 }}
                          whileTap={{ scale: 0.95 }}
                          className="flex flex-col items-center gap-2 p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 transition-all group"
                        >
                          <Icon className={`text-lg ${social.color} group-hover:scale-125 transition-transform`} />
                          <span className="text-[10px] font-medium text-white/60 group-hover:text-white transition-colors">
                            {social.label}
                          </span>
                        </motion.a>
                      );
                    }

                    return (
                      <div
                        key={social.key}
                        className="flex flex-col items-center gap-2 p-3 rounded-xl bg-white/[0.03] border border-white/[0.06]"
                      >
                        <Icon className="text-lg text-white/35" />
                        <span className="text-[10px] font-medium text-white/35">{social.label}</span>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            </div>

            {/* Bottom accent */}
            <div className="h-px bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent" />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ClientModal;
