// Dynamic projects API — fetches from Strapi backend
// Used by both ProjectsPage (full list) and Portfolio component (home page preview)

import { apiFetch, getImageUrl } from './api';
import { extractVideoThumbnail, getThumbnailUrl } from '../utils/videoThumbnailExtractor';

/**
 * Transform backend project response to frontend format
 * Now supports thumbnail extraction from multiple video platforms
 */
const transformProject = async (project) => {
  const attrs = project;
  
  // Get cover photo from backend
  const coverPhoto = getImageUrl(attrs.coverPhoto) || '';
  
  // Determine the video link from available sources
  const videoLink = attrs.youtubeLink || attrs.instagramLink || attrs.tiktokLink || attrs.facebookLink || '';
  
  // Extract thumbnail from video link if available
  let thumbnail = coverPhoto;
  if (videoLink) {
    const extractedThumbnail = await extractVideoThumbnail(videoLink);
    // Use getThumbnailUrl to apply fallback logic
    thumbnail = getThumbnailUrl({ cover_photo: coverPhoto }, extractedThumbnail);
  }

  return {
    id: project.id,
    title: attrs.name || attrs.title || '',
    slug: attrs.slug || '',
    category: attrs.client || attrs.tag || '',
    image: thumbnail,
    thumbnail: thumbnail, // Add explicit thumbnail field
    description: attrs.description || '',
    client: attrs.client || '',
    videoUrl: videoLink,
    likes: attrs.likes || 0,
    workers: (attrs.workers || []).map((w) => ({
      id: w.id,
      name: w.name,
      role: w.role,
      photo: w.photo,
    })),
    socialLinks: {
      instagram: attrs.instagramLink || '',
      tiktok: attrs.tiktokLink || '',
      facebook: attrs.facebookLink || '',
      youtube: attrs.youtubeLink || '',
    },
  };
};

// Fetch all projects from Strapi
export const fetchAllProjects = async () => {
  try {
    const data = await apiFetch('/projects');
    const projects = data.data || data || [];
    // Transform projects sequentially to handle async thumbnail extraction
    const transformedProjects = [];
    for (const project of projects) {
      transformedProjects.push(await transformProject(project));
    }
    return transformedProjects;
  } catch (error) {
    console.error('Failed to fetch projects:', error);
    return [];
  }
};

// Fetch limited projects for homepage portfolio
export const fetchFeaturedProjects = async (limit = 5) => {
  try {
    const data = await apiFetch('/projects');
    const projects = (data.data || data || []).slice(0, limit);
    // Transform projects sequentially to handle async thumbnail extraction
    const transformedProjects = [];
    for (const project of projects) {
      transformedProjects.push(await transformProject(project));
    }
    return transformedProjects;
  } catch (error) {
    console.error('Failed to fetch featured projects:', error);
    return [];
  }
};

// Fetch single project by documentId
export const fetchProjectById = async (id) => {
  try {
    const data = await apiFetch(`/projects/${id}`);
    return await transformProject(data.data || data);
  } catch (error) {
    console.error('Failed to fetch project:', error);
    throw new Error('Project not found');
  }
};

// Fetch single project by slug
export const fetchProjectBySlug = async (slug) => {
  try {
    const data = await apiFetch('/projects');
    const projects = (data.data || data || []).filter((p) => p.slug === slug);
    if (projects.length === 0) throw new Error('Project not found');
    return await transformProject(projects[0]);
  } catch (error) {
    console.error('Failed to fetch project by slug:', error);
    throw new Error('Project not found');
  }
};
