// Dynamic graphics API — fetches from Strapi backend
// Used by ProjectsPage to load graphics alongside projects

import { apiFetch, getImageUrl, uploadFile } from './api';

/**
 * Transform Strapi graphic response to frontend format
 */
const transformGraphic = (graphic) => {
  return {
    id: graphic.id,
    documentId: graphic.documentId,
    title: graphic.title || '',
    slug: graphic.slug || '',
    description: graphic.description || '',
    category: graphic.category || '',
    image: getImageUrl(graphic.image),
  };
};

// Fetch all graphics from Strapi
export const fetchAllGraphics = async () => {
  try {
    const data = await apiFetch('/graphics?populate=*&sort=createdAt:desc');
    return (data.data || []).map(transformGraphic);
  } catch (error) {
    console.error('Failed to fetch graphics:', error);
    return [];
  }
};

// Fetch limited graphics for homepage or previews
export const fetchFeaturedGraphics = async (limit = 6) => {
  try {
    const data = await apiFetch(
      `/graphics?populate=*&sort=createdAt:desc&pagination[limit]=${limit}`
    );
    return (data.data || []).map(transformGraphic);
  } catch (error) {
    console.error('Failed to fetch featured graphics:', error);
    return [];
  }
};

// Fetch single graphic by slug
export const fetchGraphicBySlug = async (slug) => {
  try {
    const data = await apiFetch(
      `/graphics?filters[slug][$eq]=${slug}&populate=*`
    );
    const graphics = (data.data || []).map(transformGraphic);
    return graphics.length > 0 ? graphics[0] : null;
  } catch (error) {
    console.error('Failed to fetch graphic by slug:', error);
    throw error;
  }
};
