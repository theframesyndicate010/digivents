// API configuration — single source of truth for backend URL
// For production, use environment variable. Falls back to relative API calls (same domain)
const getApiUrl = () => {
  // Development: explicit localhost URL or environment variable
  if (process.env.NODE_ENV === 'development') {
    return process.env.REACT_APP_API_URL || 'http://localhost:1337';
  }
  
  // Production: use environment variable OR assume backend is on same domain
  if (process.env.REACT_APP_API_URL) {
    return process.env.REACT_APP_API_URL;
  }
  
  // Fallback: use current domain (works if frontend and backend on same server)
  const protocol = window.location.protocol;
  const hostname = window.location.hostname;
  const port = window.location.port ? `:${window.location.port}` : '';
  return `${protocol}//${hostname}${port}`;
};

const API_URL = getApiUrl();

console.log('[API Config] Using API URL:', API_URL);

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
    console.log('[API] Fetching:', url);
    const response = await fetch(url, {
      headers: { 'Content-Type': 'application/json', ...options.headers },
      ...options,
    });
    
    if (!response.ok) {
      const errorBody = await response.text().catch(() => '');
      console.error('[API Error]', {
        status: response.status,
        statusText: response.statusText,
        url,
        body: errorBody,
      });
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log('[API] Success:', endpoint, data);
    return data;
  } catch (error) {
    console.error(`[API Error] Failed to fetch ${url}:`, error);
    throw error;
  }
};

/**
 * Upload file to backend (without Content-Type header for multipart/form-data)
 * Browser will set Content-Type: multipart/form-data automatically
 */
export const uploadFile = async (endpoint, formData, options = {}) => {
  const url = `${API_URL}/api${endpoint}`;
  try {
    const response = await fetch(url, {
      method: 'POST',
      body: formData,
      // DO NOT set Content-Type header for multipart/form-data
      // Browser will add it with correct boundary
      ...options,
    });
    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: response.statusText }));
      throw new Error(error.message || `Upload failed: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Failed to upload to ${url}:`, error);
    throw error;
  }
};

export default API_URL;
