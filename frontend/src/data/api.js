// API configuration — single source of truth for backend URL
// For production, use environment variable. Falls back to relative API calls (same domain)
const getApiUrl = () => {
  // Development: explicit localhost URL or environment variable
  if (process.env.NODE_ENV === 'development') {
    return process.env.REACT_APP_API_URL || 'http://localhost:3000';
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


export const API_BASE = '/api';
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
  // endpoint should start with '/'
  // API_BASE now includes '/api', so avoid double /api
  const url = `${API_URL}${API_BASE}${endpoint}`;
  try {
    console.log('[API] Fetching:', url);
    console.log('[API] Request body:', options.body);
    
    const response = await fetch(url, {
      headers: { 'Content-Type': 'application/json', ...options.headers },
      ...options,
    });
    
    let responseBody = '';
    let errorDetails = null;
    
    try {
      responseBody = await response.text();
      errorDetails = JSON.parse(responseBody);
    } catch {
      // Response is not JSON
    }
    
    if (!response.ok) {
      const errorMessage = errorDetails?.error?.message || 
                          errorDetails?.message || 
                          responseBody || 
                          response.statusText;
      
      const detailedError = errorDetails?.error?.details?.errors || 
                           errorDetails?.data || null;
      
      console.error('[API Error Details]', {
        status: response.status,
        statusText: response.statusText,
        url,
        message: errorMessage,
        details: detailedError,
        fullResponse: errorDetails,
      });
      
      throw new Error(
        `API error: ${response.status}${errorMessage ? ` - ${errorMessage}` : ''}${
          detailedError ? ` - ${JSON.stringify(detailedError)}` : ''
        }`
      );
    }
    
    const data = JSON.parse(responseBody);
    console.log('[API] Success:', endpoint, data);
    return data;
  } catch (error) {
    console.error(`[API Error] Failed to fetch ${url}:`, error.message);
    throw error;
  }
};

/**
 * Upload file to backend (without Content-Type header for multipart/form-data)
 * Browser will set Content-Type: multipart/form-data automatically
 */
export const uploadFile = async (endpoint, formData, options = {}) => {
  const url = `${API_URL}${API_BASE}${endpoint}`;
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
