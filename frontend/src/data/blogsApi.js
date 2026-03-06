// Dynamic blogs API — fetches from Strapi backend
// Used by both BlogPage (full list) and Blog component (home page preview)

import { apiFetch, getImageUrl } from './api';

/**
 * Transform Strapi article response to frontend blog format
 */
const transformArticle = (article) => {
  const attrs = article;
  return {
    id: article.id,
    documentId: article.documentId,
    category: attrs.category?.name?.toUpperCase() || 'UNCATEGORIZED',
    title: attrs.title || '',
    author: attrs.author?.name || 'Unknown',
    authorAvatar: getImageUrl(attrs.author?.avatar),
    date: attrs.publishedAt
      ? new Date(attrs.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
      : '',
    image: getImageUrl(attrs.cover),
    excerpt: attrs.description || '',
    slug: attrs.slug || '',
    blocks: attrs.blocks || [],
  };
};

// Fetch all blogs from Strapi
export const fetchAllBlogs = async () => {
  try {
    const data = await apiFetch('/articles?populate=*&sort=publishedAt:desc');
    return (data.data || []).map(transformArticle);
  } catch (error) {
    console.error('Failed to fetch blogs:', error);
    return [];
  }
};

// Fetch limited blogs for homepage
export const fetchFeaturedBlogs = async (limit = 3) => {
  try {
    const data = await apiFetch(`/articles?populate=*&sort=publishedAt:desc&pagination[limit]=${limit}`);
    return (data.data || []).map(transformArticle);
  } catch (error) {
    console.error('Failed to fetch featured blogs:', error);
    return [];
  }
};

// Fetch single blog by slug or documentId
export const fetchBlogById = async (id) => {
  try {
    // Try by documentId first
    const data = await apiFetch(`/articles/${id}?populate=*`);
    return transformArticle(data.data);
  } catch (error) {
    console.error('Failed to fetch blog:', error);
    throw new Error('Blog not found');
  }
};

// Fetch single blog by slug
export const fetchBlogBySlug = async (slug) => {
  try {
    const data = await apiFetch(`/articles?filters[slug][$eq]=${slug}&populate=*`);
    const articles = data.data || [];
    if (articles.length === 0) throw new Error('Blog not found');
    return transformArticle(articles[0]);
  } catch (error) {
    console.error('Failed to fetch blog by slug:', error);
    throw new Error('Blog not found');
  }
};
