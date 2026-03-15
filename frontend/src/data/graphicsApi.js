// Dynamic graphics API — fetches from Strapi backend
// Used by GraphicsPage to display graphic design portfolio

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
    console.log('Fetching graphics from Strapi...');
    const data = await apiFetch('/graphics?populate=*&sort=createdAt:desc');
    console.log('Graphics API response:', data);
    const transformed = (data.data || []).map(transformGraphic);
    console.log('Transformed graphics:', transformed);
    return transformed;
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
    const graphics = data.data || [];
    if (graphics.length === 0) throw new Error('Graphic not found');
    return transformGraphic(graphics[0]);
  } catch (error) {
    console.error('Failed to fetch graphic by slug:', error);
    throw new Error('Graphic not found');
  }
};

/**
 * Upload a new graphic with image and metadata
 * @param {File} file - Image file to upload
 * @param {string} title - Graphic title
 * @param {string} description - Graphic description
 * @param {string} category - Graphic category
 * @param {string} token - JWT token for authentication
 * @returns {Promise<Object>} Created graphic object
 */
export const uploadGraphic = async (file, title, description, category, token) => {
  try {
    // Step 1: Upload image file
    const formData = new FormData();
    formData.append('file', file);

    const uploadResponse = await uploadFile('/upload', formData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    
    if (!uploadResponse.url) {
      throw new Error('Upload response missing URL');
    }

    const imageUrl = uploadResponse.url;

    // Step 2: Create graphic entry with metadata
    const graphicPayload = {
      data: {
        title: title || file.name,
        slug: (title || file.name).toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, ''),
        description: description || '',
        category: category || '',
        image: imageUrl,
      },
    };

    const response = await apiFetch('/graphics', {
      method: 'POST',
      body: JSON.stringify(graphicPayload),
      headers: { Authorization: `Bearer ${token}` },
    });

    return response?.data ? transformGraphic(response.data) : response;
  } catch (error) {
    console.error('Failed to upload graphic:', error);
    throw error;
  }
};
