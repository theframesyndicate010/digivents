/**
 * Video Thumbnail Extractor
 * 
 * Utilities for detecting video platforms and extracting thumbnail URLs
 * from YouTube, Instagram, TikTok, and Facebook video links.
 */

/**
 * Platform-specific URL patterns for video detection
 * Each platform has multiple regex patterns to match various URL formats
 */
export const PLATFORM_PATTERNS = {
  youtube: [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/
  ],
  instagram: [
    /instagram\.com\/(?:p|reel|tv)\/([a-zA-Z0-9_-]+)/
  ],
  tiktok: [
    /tiktok\.com\/@[\w.-]+\/video\/(\d+)/,
    /vm\.tiktok\.com\/([a-zA-Z0-9]+)/
  ],
  facebook: [
    /facebook\.com\/watch\/?\?v=(\d+)/,
    /fb\.watch\/([a-zA-Z0-9_-]+)/,
    /facebook\.com\/.*\/videos\/(\d+)/
  ]
};

/**
 * Validates and normalizes a URL string
 * 
 * @param {string} urlString - The URL string to validate
 * @returns {string|null} - Normalized URL with protocol, or null if invalid
 * 
 * Requirements: 6.1
 */
export function validateUrl(urlString) {
  if (!urlString || typeof urlString !== 'string') {
    return null;
  }

  try {
    // Trim whitespace
    const trimmed = urlString.trim();
    
    // Add https:// if no protocol is present
    const urlWithProtocol = trimmed.startsWith('http') 
      ? trimmed 
      : `https://${trimmed}`;
    
    // Use URL constructor to validate format
    const url = new URL(urlWithProtocol);
    
    // Return the normalized URL
    return url.href;
  } catch (error) {
    console.error(`Invalid URL: ${urlString}`, error.message);
    return null;
  }
}

/**
 * Detects which video platform a URL belongs to
 * 
 * @param {string} url - The video URL to analyze
 * @returns {string|null} - Platform name ('youtube', 'instagram', 'tiktok', 'facebook') or null
 * 
 * Requirements: 6.2, 6.4
 */
export function detectVideoPlatform(url) {
  // Validate URL first
  const validUrl = validateUrl(url);
  if (!validUrl) {
    return null;
  }

  // Test against each platform's patterns
  for (const [platform, patterns] of Object.entries(PLATFORM_PATTERNS)) {
    for (const pattern of patterns) {
      if (pattern.test(validUrl)) {
        return platform;
      }
    }
  }

  // No matching platform found
  return null;
}

/**
 * Extracts thumbnail URL from a YouTube video link
 * 
 * @param {string} url - The YouTube video URL
 * @returns {string|null} - Thumbnail URL or null if extraction fails
 * 
 * Requirements: 1.1, 1.2
 */
export function extractYouTubeThumbnail(url) {
  // Validate URL first
  const validUrl = validateUrl(url);
  if (!validUrl) {
    return null;
  }

  // Verify this is a YouTube URL
  const platform = detectVideoPlatform(validUrl);
  if (platform !== 'youtube') {
    return null;
  }

  // Extract video ID using the YouTube patterns
  let videoId = null;
  for (const pattern of PLATFORM_PATTERNS.youtube) {
    const match = validUrl.match(pattern);
    if (match && match[1]) {
      videoId = match[1];
      break;
    }
  }

  // Return null if no video ID was extracted
  if (!videoId) {
    return null;
  }

  // Construct and return the thumbnail URL
  return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
}

/**
 * Extracts thumbnail URL from an Instagram video/post link using oEmbed API
 * 
 * @param {string} url - The Instagram post/reel/tv URL
 * @returns {Promise<string|null>} - Thumbnail URL or null if extraction fails
 * 
 * Requirements: 2.1, 2.2, 2.3, 2.4
 */
export async function extractInstagramThumbnail(url) {
  // Validate URL first
  const validUrl = validateUrl(url);
  if (!validUrl) {
    return null;
  }

  // Verify this is an Instagram URL
  const platform = detectVideoPlatform(validUrl);
  if (platform !== 'instagram') {
    return null;
  }

  // Extract post ID using the Instagram patterns
  let postId = null;
  for (const pattern of PLATFORM_PATTERNS.instagram) {
    const match = validUrl.match(pattern);
    if (match && match[1]) {
      postId = match[1];
      break;
    }
  }

  // Return null if no post ID was extracted
  if (!postId) {
    return null;
  }

  try {
    // Call Instagram oEmbed API
    const oEmbedUrl = `https://graph.facebook.com/v12.0/instagram_oembed?url=${encodeURIComponent(validUrl)}`;
    const response = await fetch(oEmbedUrl, { 
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      }
    });

    // Check if the response is successful
    if (!response.ok) {
      console.error(`Instagram oEmbed API error: ${response.status} ${response.statusText}`);
      return null;
    }

    // Parse the JSON response
    const data = await response.json();

    // Extract and return the thumbnail_url field
    if (data && data.thumbnail_url) {
      return data.thumbnail_url;
    }

    // No thumbnail_url in response
    console.warn('Instagram oEmbed response missing thumbnail_url field');
    return null;

  } catch (error) {
    // Handle any errors (network errors, parsing errors, etc.)
    console.error(`Instagram thumbnail extraction failed for ${validUrl}:`, error.message);
    return null;
  }
}

/**
 * Extracts thumbnail URL from a TikTok video link using oEmbed API
 * 
 * @param {string} url - The TikTok video URL
 * @returns {Promise<string|null>} - Thumbnail URL or null if extraction fails
 * 
 * Requirements: 3.1, 3.2, 3.3, 3.4
 */
export async function extractTikTokThumbnail(url) {
  // Validate URL first
  const validUrl = validateUrl(url);
  if (!validUrl) {
    return null;
  }

  // Verify this is a TikTok URL
  const platform = detectVideoPlatform(validUrl);
  if (platform !== 'tiktok') {
    return null;
  }

  // Extract video ID using the TikTok patterns
  let videoId = null;
  for (const pattern of PLATFORM_PATTERNS.tiktok) {
    const match = validUrl.match(pattern);
    if (match && match[1]) {
      videoId = match[1];
      break;
    }
  }

  // Return null if no video ID was extracted
  if (!videoId) {
    return null;
  }

  try {
    // Call TikTok oEmbed API
    const oEmbedUrl = `https://www.tiktok.com/oembed?url=${encodeURIComponent(validUrl)}`;
    const response = await fetch(oEmbedUrl, { 
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      }
    });

    // Check if the response is successful
    if (!response.ok) {
      console.error(`TikTok oEmbed API error: ${response.status} ${response.statusText}`);
      return null;
    }

    // Parse the JSON response
    const data = await response.json();

    // Extract and return the thumbnail_url field
    if (data && data.thumbnail_url) {
      return data.thumbnail_url;
    }

    // No thumbnail_url in response
    console.warn('TikTok oEmbed response missing thumbnail_url field');
    return null;

  } catch (error) {
    // Handle any errors (network errors, parsing errors, etc.)
    console.error(`TikTok thumbnail extraction failed for ${validUrl}:`, error.message);
    return null;
  }
}

/**
 * Extracts thumbnail URL from a Facebook video link using oEmbed API
 * 
 * @param {string} url - The Facebook video URL
 * @returns {Promise<string|null>} - Thumbnail URL or null if extraction fails
 * 
 * Requirements: 4.1, 4.2, 4.3, 4.4
 */
export async function extractFacebookThumbnail(url) {
  // Validate URL first
  const validUrl = validateUrl(url);
  if (!validUrl) {
    return null;
  }

  // Verify this is a Facebook URL
  const platform = detectVideoPlatform(validUrl);
  if (platform !== 'facebook') {
    return null;
  }

  // Extract video ID using the Facebook patterns
  let videoId = null;
  for (const pattern of PLATFORM_PATTERNS.facebook) {
    const match = validUrl.match(pattern);
    if (match && match[1]) {
      videoId = match[1];
      break;
    }
  }

  // Return null if no video ID was extracted
  if (!videoId) {
    return null;
  }

  try {
    // Call Facebook oEmbed API
    const oEmbedUrl = `https://www.facebook.com/plugins/video/oembed.json/?url=${encodeURIComponent(validUrl)}`;
    const response = await fetch(oEmbedUrl, { 
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      }
    });

    // Check if the response is successful
    if (!response.ok) {
      console.error(`Facebook oEmbed API error: ${response.status} ${response.statusText}`);
      return null;
    }

    // Parse the JSON response
    const data = await response.json();

    // Extract and return the thumbnail_url field
    if (data && data.thumbnail_url) {
      return data.thumbnail_url;
    }

    // No thumbnail_url in response
    console.warn('Facebook oEmbed response missing thumbnail_url field');
    return null;

  } catch (error) {
    // Handle any errors (network errors, parsing errors, etc.)
    console.error(`Facebook thumbnail extraction failed for ${validUrl}:`, error.message);
    return null;
  }
}

/**
 * Default placeholder image path for when thumbnail extraction fails
 * and no cover photo is available
 */
export const DEFAULT_PLACEHOLDER = '/assets/default-project-thumbnail.svg';

/**
 * ThumbnailCache class for caching thumbnail URLs
 * Uses browser localStorage for client-side caching with TTL support
 * 
 * Requirements: 8.1, 8.2, 8.3
 */
export class ThumbnailCache {
  constructor(storageKey = 'video_thumbnail_cache', defaultTTL = 86400000) {
    this.storageKey = storageKey;
    this.defaultTTL = defaultTTL; // 24 hours in milliseconds
  }

  /**
   * Gets the cache storage object from localStorage
   * @private
   * @returns {Object} - The cache storage object
   */
  _getStorage() {
    try {
      const data = localStorage.getItem(this.storageKey);
      return data ? JSON.parse(data) : {};
    } catch (error) {
      console.error('Failed to read from cache:', error);
      return {};
    }
  }

  /**
   * Saves the cache storage object to localStorage
   * @private
   * @param {Object} storage - The cache storage object to save
   */
  _setStorage(storage) {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(storage));
    } catch (error) {
      console.error('Failed to write to cache:', error);
    }
  }

  /**
   * Gets a cached thumbnail URL for a video URL
   * Checks expiration and returns null if expired
   * 
   * @param {string} url - The video URL (cache key)
   * @returns {string|null} - The cached thumbnail URL or null if not found/expired
   * 
   * Requirements: 8.1, 8.2, 8.3
   */
  get(url) {
    if (!url || typeof url !== 'string') {
      return null;
    }

    const storage = this._getStorage();
    const entry = storage[url];

    // Check if entry exists
    if (!entry) {
      return null;
    }

    // Check if entry has expired
    const now = Date.now();
    if (entry.expiresAt && now > entry.expiresAt) {
      // Entry has expired, remove it
      this.clear(url);
      return null;
    }

    // Validate that the cached value is a string
    if (typeof entry.thumbnail !== 'string') {
      console.warn('Corrupted cache entry detected, clearing:', url);
      this.clear(url);
      return null;
    }

    return entry.thumbnail;
  }

  /**
   * Sets a thumbnail URL in the cache with TTL
   * 
   * @param {string} url - The video URL (cache key)
   * @param {string} thumbnail - The thumbnail URL to cache
   * @param {number} [ttl] - Time to live in milliseconds (optional, uses default if not provided)
   * 
   * Requirements: 8.1, 8.2, 8.3
   */
  set(url, thumbnail, ttl) {
    if (!url || typeof url !== 'string') {
      console.warn('Invalid cache key:', url);
      return;
    }

    if (!thumbnail || typeof thumbnail !== 'string') {
      console.warn('Invalid cache value:', thumbnail);
      return;
    }

    const storage = this._getStorage();
    const timeToLive = ttl !== undefined ? ttl : this.defaultTTL;
    const expiresAt = timeToLive > 0 ? Date.now() + timeToLive : null;

    storage[url] = {
      thumbnail,
      expiresAt,
      cachedAt: Date.now()
    };

    this._setStorage(storage);
  }

  /**
   * Clears a specific cache entry
   * 
   * @param {string} url - The video URL (cache key) to clear
   * 
   * Requirements: 8.1
   */
  clear(url) {
    if (!url || typeof url !== 'string') {
      return;
    }

    const storage = this._getStorage();
    delete storage[url];
    this._setStorage(storage);
  }

  /**
   * Clears all cache entries
   */
  clearAll() {
    try {
      localStorage.removeItem(this.storageKey);
    } catch (error) {
      console.error('Failed to clear cache:', error);
    }
  }

  /**
   * Gets the number of entries in the cache
   * @returns {number} - The number of cache entries
   */
  size() {
    const storage = this._getStorage();
    return Object.keys(storage).length;
  }
}

/**
 * Unified thumbnail extractor that routes to platform-specific extractors
 * 
 * @param {string} url - The video URL to extract thumbnail from
 * @returns {Promise<string|null>} - Thumbnail URL or null if extraction fails
 * 
 * Requirements: 6.3
 */
export async function extractVideoThumbnail(url) {
  // Validate URL first
  const validUrl = validateUrl(url);
  if (!validUrl) {
    console.error(`Thumbnail extraction failed: Invalid URL - ${url}`);
    return null;
  }

  // Detect the platform
  const platform = detectVideoPlatform(validUrl);
  
  if (!platform) {
    console.warn(`Thumbnail extraction failed: Unsupported platform - ${validUrl}`);
    return null;
  }

  try {
    // Route to appropriate platform-specific extractor
    switch (platform) {
      case 'youtube':
        return extractYouTubeThumbnail(validUrl);
      
      case 'instagram':
        return await extractInstagramThumbnail(validUrl);
      
      case 'tiktok':
        return await extractTikTokThumbnail(validUrl);
      
      case 'facebook':
        return await extractFacebookThumbnail(validUrl);
      
      default:
        console.warn(`Thumbnail extraction failed: Unknown platform - ${platform}`);
        return null;
    }
  } catch (error) {
    // Log any unexpected errors during extraction
    console.error(`Thumbnail extraction failed for ${validUrl}:`, error.message, error);
    return null;
  }
}

/**
 * Gets the thumbnail URL with fallback logic
 * Implements the fallback chain: extracted thumbnail → Cover_Photo → default placeholder
 * 
 * @param {Object} project - The project object containing cover_photo field
 * @param {string|null} extractedThumbnail - The extracted thumbnail URL (or null)
 * @returns {string} - The thumbnail URL to use (never null, always returns a valid URL)
 * 
 * Requirements: 5.1, 5.2, 5.3
 */
export function getThumbnailUrl(project, extractedThumbnail) {
  // First priority: extracted thumbnail
  if (extractedThumbnail) {
    return extractedThumbnail;
  }

  // Second priority: project's cover photo
  if (project && project.cover_photo) {
    return project.cover_photo;
  }

  // Final fallback: default placeholder
  return DEFAULT_PLACEHOLDER;
}
