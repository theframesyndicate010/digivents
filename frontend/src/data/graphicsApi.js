// Dynamic graphics API — fetches from Strapi backend
// Used by ProjectsPage to load graphics alongside projects

import { apiFetch, getImageUrl, uploadFile } from './api';

/**
 * Transform backend graphic response to frontend format
 */
const transformGraphic = (graphic) => {
  return {
    id: graphic.id,
    title: graphic.title || graphic.name || '',
    description: graphic.description || '',
    image: getImageUrl(graphic.photo) || '',
  };
};

// Fetch all graphics from Strapi
export const fetchAllGraphics = async () => {
  try {
    const data = await apiFetch('/graphics');
    return (data.data || data || []).map(transformGraphic);
  } catch (error) {
    console.error('Failed to fetch graphics:', error);
    return [];
  }
};

// Fetch limited graphics for homepage or previews
export const fetchFeaturedGraphics = async (limit = 6) => {
  try {
    const data = await apiFetch('/graphics');
    return (data.data || data || []).slice(0, limit).map(transformGraphic);
  } catch (error) {
    console.error('Failed to fetch featured graphics:', error);
    return [];
  }
};

// Fetch single graphic by slug
export const fetchGraphicBySlug = async (slug) => {
  try {
    const data = await apiFetch('/graphics');
    const graphics = (data.data || data || []).map(transformGraphic);
    return graphics.find((g) => g.slug === slug) || null;
  } catch (error) {
    console.error('Failed to fetch graphic by slug:', error);
    throw error;
  }
};
