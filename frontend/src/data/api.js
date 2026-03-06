// API configuration — single source of truth for backend URL
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:1337';

/**
 * Helper to build full image URL from Strapi media object
 * Strapi v5 returns media in { url: '/uploads/...' } format
 */
export const getImageUrl = (media) => {
  if (!media) return null;
  // If it's already a full URL (e.g., from ImageKit), return as-is
  const url = media?.url || media;
  if (typeof url === 'string' && url.startsWith('http')) return url;
  return `${API_URL}${url}`;
};

/**
 * Generic fetch wrapper for Strapi API calls
 * Handles errors and returns parsed JSON
 */
export const apiFetch = async (endpoint, options = {}) => {
  const url = `${API_URL}/api${endpoint}`;
  try {
    const response = await fetch(url, {
      headers: { 'Content-Type': 'application/json', ...options.headers },
      ...options,
    });
    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Failed to fetch ${url}:`, error);
    throw error;
  }
};

export default API_URL;
