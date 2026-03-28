// Dynamic projects API — fetches from Strapi backend
// Used by both ProjectsPage (full list) and Portfolio component (home page preview)

import { apiFetch, getImageUrl } from './api';

/**
 * Transform backend project response to frontend format
 */
const transformProject = (project) => {
  const attrs = project;
  
  // Use cover_photo if available, otherwise try to extract from video URL
  let coverImage = getImageUrl(attrs.coverPhoto) || '';
  
  if (!coverImage && attrs.youtubeLink) {
    let videoId = attrs.youtubeLink.split('v=')[1]?.split('&')[0];
    if (!videoId && attrs.youtubeLink.includes('youtu.be')) videoId = attrs.youtubeLink.split('/').pop();
    if (videoId) {
      coverImage = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
    }
  }

  return {
    id: project.id,
    title: attrs.name || attrs.title || '',
    slug: attrs.slug || '',
    category: attrs.client || attrs.tag || '',
    image: coverImage,
    description: attrs.description || '',
    client: attrs.client || '',
    videoUrl: attrs.youtubeLink || attrs.instagramLink || attrs.tiktokLink || '',
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
    return (data.data || data || []).map(transformProject);
  } catch (error) {
    console.error('Failed to fetch projects:', error);
    return [];
  }
};

// Fetch limited projects for homepage portfolio
export const fetchFeaturedProjects = async (limit = 5) => {
  try {
    const data = await apiFetch('/projects');
    return (data.data || data || []).slice(0, limit).map(transformProject);
  } catch (error) {
    console.error('Failed to fetch featured projects:', error);
    return [];
  }
};

// Fetch single project by documentId
export const fetchProjectById = async (id) => {
  try {
    const data = await apiFetch(`/projects/${id}`);
    return transformProject(data.data || data);
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
    return transformProject(projects[0]);
  } catch (error) {
    console.error('Failed to fetch project by slug:', error);
    throw new Error('Project not found');
  }
};
