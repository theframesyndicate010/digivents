// Dynamic social links API — fetches from Strapi Global settings
// Used by Footer component

import React from 'react';
import { FiFacebook, FiInstagram, FiYoutube, FiGlobe } from 'react-icons/fi';
import { FaTiktok } from 'react-icons/fa';
import { apiFetch } from './api';

// Icon mapping for social platforms
const socialIconMap = {
  facebook: <FiFacebook />,
  instagram: <FiInstagram />,
  youtube: <FiYoutube />,
  tiktok: <FaTiktok />,
};

// Default fallback social links
const defaultSocialLinks = [
  { id: 1, icon: <FiFacebook />, href: 'https://www.facebook.com/digiventsbirtamode', label: 'Facebook' },
  { id: 2, icon: <FiInstagram />, href: 'https://www.instagram.com/digi.vents/', label: 'Instagram' },
  { id: 3, icon: <FiYoutube />, href: 'https://www.youtube.com/@digivents', label: 'YouTube' },
  { id: 4, icon: <FaTiktok />, href: 'https://tiktok.com', label: 'TikTok' },
];

/**
 * Fetch social links from Strapi Global settings or project social links.
 * Falls back to default links if the API doesn't have social fields.
 */
// PATCHED: No /global endpoint, always use static fallback
export const fetchSocialLinks = async () => {
  return defaultSocialLinks.map((s) => ({ ...s }));
};

export default defaultSocialLinks;
