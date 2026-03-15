// Dynamic projects API — fetches from Strapi backend
// Used by both ProjectsPage (full list) and Portfolio component (home page preview)

import { apiFetch, getImageUrl } from './api';

/**
 * Transform Strapi project response to frontend format
 */
const transformProject = (project) => {
  const attrs = project;
  const mediaItems = attrs.media || [];

  // 1. Determine Cover Image
  // Try to find the first image in media
  let coverMedia = mediaItems.find((m) => m.mime?.startsWith('image/'));
  // If no image found, fallback to first media item (could be video thumbnail if available)
  if (!coverMedia && mediaItems.length > 0) coverMedia = mediaItems[0];
  
  // If it's a video file, try to use its thumbnail if available
  let coverImage = null;
  if (coverMedia) {
      if (coverMedia.mime?.startsWith('video/') && coverMedia.formats?.thumbnail) {
          coverImage = getImageUrl(coverMedia.formats.thumbnail);
      } else {
          coverImage = getImageUrl(coverMedia);
      }
  }

  // 2. Determine Video URL
  // Priority: videoUrl field -> Social Links -> Video File in Media
  let videoUrl = attrs.videoUrl || '';
  
  if (!videoUrl) {
    if (attrs.tiktokLink && attrs.tiktokLink.includes('tiktok.com')) {
      videoUrl = attrs.tiktokLink;
    } else if (attrs.instagramLink && attrs.instagramLink.includes('instagram.com')) {
      videoUrl = attrs.instagramLink;
    } else if (attrs.youtubeLink && (attrs.youtubeLink.includes('youtube.com') || attrs.youtubeLink.includes('youtu.be'))) {
      videoUrl = attrs.youtubeLink;
    } else {
      // Check for video file in media
      const videoFile = mediaItems.find((m) => m.mime?.startsWith('video/'));
      if (videoFile) {
        videoUrl = getImageUrl(videoFile);
      }
    }
  }

  // Build all media URLs
  const allMedia = mediaItems.map((m) => getImageUrl(m));

  return {
    id: project.id,
    documentId: project.documentId,
    title: attrs.name || '',
    slug: attrs.slug || '',
    category: attrs.client?.name || attrs.tag || '',
    image: coverImage,
    media: allMedia,
    tags: attrs.tag ? attrs.tag.split(',').map((t) => t.trim()) : [],
    description: attrs.description || '',
    createdDate: attrs.createdDate || '',
    client: attrs.client?.name || '',
    videoUrl: videoUrl,
    likes: attrs.likes || 0,
    workers: (attrs.workers || []).map((w) => ({
      id: w.id,
      name: w.name,
      role: w.role,
      photo: getImageUrl(w.photo),
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
    const data = await apiFetch('/projects?populate=*&sort=createdAt:desc');
    return (data.data || []).map(transformProject);
  } catch (error) {
    console.error('Failed to fetch projects:', error);
    return [];
  }
};

// Fetch limited projects for homepage portfolio
export const fetchFeaturedProjects = async (limit = 5) => {
  try {
    const data = await apiFetch(`/projects?populate=*&sort=createdAt:desc&pagination[limit]=${limit}`);
    return (data.data || []).map(transformProject);
  } catch (error) {
    console.error('Failed to fetch featured projects:', error);
    return [];
  }
};

// Fetch single project by documentId
export const fetchProjectById = async (id) => {
  try {
    const data = await apiFetch(`/projects/${id}?populate=*`);
    return transformProject(data.data);
  } catch (error) {
    console.error('Failed to fetch project:', error);
    throw new Error('Project not found');
  }
};

// Fetch single project by slug
export const fetchProjectBySlug = async (slug) => {
  try {
    const data = await apiFetch(`/projects?filters[slug][$eq]=${slug}&populate=*`);
    const projects = data.data || [];
    if (projects.length === 0) throw new Error('Project not found');
    return transformProject(projects[0]);
  } catch (error) {
    console.error('Failed to fetch project by slug:', error);
    throw new Error('Project not found');
  }
};
