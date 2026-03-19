// Dynamic clients API — fetches from Strapi backend
// Used by BrandPartners (Our Clients) component on the home page

import { apiFetch, getImageUrl } from './api';

/**
 * Transform Strapi client response to frontend format
 */
const transformClient = (client) => {
  const attrs = client;
  return {
    id: client.id,
    documentId: client.documentId,
    name: attrs.name || '',
    logo: getImageUrl(attrs.logo),
    slug: attrs.slug || '',
    socialMediaLink: attrs.socialMediaLink || '',
  };
};

// Fetch all clients from Strapi
export const fetchAllClients = async () => {
  try {
    const data = await apiFetch('/clients?populate=*&sort=createdAt:asc');
    return (data.data || []).map(transformClient);
  } catch (error) {
    console.error('Failed to fetch clients:', error);
    return [];
  }
};

// Fetch limited clients for homepage
export const fetchFeaturedClients = async (limit = 6) => {
  try {
    const data = await apiFetch(`/clients?populate=*&sort=createdAt:asc&pagination[limit]=${limit}`);
    return (data.data || []).map(transformClient);
  } catch (error) {
    console.error('Failed to fetch featured clients:', error);
    return [];
  }
};

// Fetch feedbacks/testimonials with client info
export const fetchTestimonials = async () => {
  try {
    const data = await apiFetch('/feedbacks?populate=*&sort=createdAt:desc');
    return (data.data || []).map((feedback) => {
      const attrs = feedback;
      return {
        id: feedback.id,
        name: attrs.name || '',
        message: attrs.message || '',
        client: attrs.client?.name || '',
        clientLogo: getImageUrl(attrs.client?.logo),
      };
    });
  } catch (error) {
    console.error('Failed to fetch testimonials:', error);
    return [];
  }
};
