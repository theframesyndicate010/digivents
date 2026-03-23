// Dynamic projects API — fetches from Strapi backend
// Used by both ProjectsPage (full list) and Portfolio component (home page preview)

import { apiFetch, getImageUrl } from './api';

/**
 * Transform Strapi project response to frontend format
 */
const transformProject = (project) => {
  const attrs = project;
  const mediaItems = attrs.media || [];

  // 1. Determine Video URL
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

  // 2. Determine Cover Image
  // Priority: cover_photo field -> first image in media -> video thumbnail
  let coverImage = null;

  if (attrs.cover_photo) {
    coverImage = getImageUrl(attrs.cover_photo);
  } else {
    // Try to find the first image in media (supports both string URLs and objects)
    const coverMedia = mediaItems.find((m) => {
      if (typeof m === 'string') return /\.(jpg|jpeg|png|webp|gif)$/i.test(m);
      return m.mime?.startsWith('image/');
    });
    if (coverMedia) {
      coverImage = getImageUrl(coverMedia);
    } else {
      // If no image media, try to get thumbnail from video media
      const videoMedia = mediaItems.find((m) => typeof m !== 'string' && m.mime?.startsWith('video/'));
      if (videoMedia && videoMedia.formats?.thumbnail) {
        coverImage = getImageUrl(videoMedia.formats.thumbnail);
      }
    }
  }

  // If still no cover image, try to extract from video URL (YouTube only for now)
  if (!coverImage && videoUrl) {
    if (videoUrl.includes('youtube.com') || videoUrl.includes('youtu.be')) {
      let videoId = videoUrl.split('v=')[1]?.split('&')[0];
      if (!videoId && videoUrl.includes('youtu.be')) videoId = videoUrl.split('/').pop();
      if (videoId) {
        coverImage = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
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
    category: (typeof attrs.client === 'string' ? attrs.client : attrs.client?.name) || attrs.tag || '',
    image: coverImage,
    media: allMedia,
    tags: attrs.tag ? attrs.tag.split(',').map((t) => t.trim()) : [],
    description: attrs.description || '',
    createdDate: attrs.createdDate || '',
    client: (typeof attrs.client === 'string' ? attrs.client : attrs.client?.name) || '',
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
    const data = await apiFetch('/api/projects');
    return (data.data || data || []).map(transformProject);
  } catch (error) {
    console.error('Failed to fetch projects:', error);
    return [];
  }
};

// Fetch limited projects for homepage portfolio
export const fetchFeaturedProjects = async (limit = 5) => {
  try {
    const data = await apiFetch('/api/projects');
    return (data.data || data || []).slice(0, limit).map(transformProject);
  } catch (error) {
    console.error('Failed to fetch featured projects:', error);
    return [];
  }
};

// Fetch single project by documentId
export const fetchProjectById = async (id) => {
  try {
    const data = await apiFetch(`/api/projects/${id}`);
    return transformProject(data.data || data);
  } catch (error) {
    console.error('Failed to fetch project:', error);
    throw new Error('Project not found');
  }
};

// Fetch single project by slug
export const fetchProjectBySlug = async (slug) => {
  try {
    const data = await apiFetch('/api/projects');
    const projects = (data.data || data || []).filter((p) => p.slug === slug);
    if (projects.length === 0) throw new Error('Project not found');
    return transformProject(projects[0]);
  } catch (error) {
    console.error('Failed to fetch project by slug:', error);
    throw new Error('Project not found');
  }
};
