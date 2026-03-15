// Dynamic graphics API — fetches from Strapi projects (not separate graphics)
// Graphics are now part of projects - fetches project media as graphics

import { apiFetch, getImageUrl, uploadFile } from './api';

/**
 * Transform Strapi project media into graphic format
 */
const transformProjectToGraphic = (project, mediaItem) => {
  return {
    id: `${project.id}-${mediaItem.id}`,
    documentId: mediaItem.documentId || `${project.documentId}-${mediaItem.id}`,
    title: project.name || '',
    slug: project.slug || '',
    description: project.description || '',
    category: project.tag || '',
    image: getImageUrl(mediaItem),
    projectId: project.id,
    projectSlug: project.slug,
  };
};

// Fetch all graphics from projects
export const fetchAllGraphics = async () => {
  try {
    // Fetch all published projects with their media
    const data = await apiFetch('/projects?populate=media&sort=createdAt:desc&pagination[limit]=200');
    const projects = data.data || [];
    
    console.log('[Graphics API] Fetched', projects.length, 'projects');
    
    // Extract media from projects and transform to graphics
    const graphics = [];
    projects.forEach(project => {
      if (project.media && Array.isArray(project.media)) {
        project.media.forEach(mediaItem => {
          graphics.push(transformProjectToGraphic(project, mediaItem));
        });
      }
    });
    
    console.log('[Graphics API] Extracted', graphics.length, 'graphics from projects');
    return graphics;
  } catch (error) {
    console.error('[Graphics API] Failed to fetch graphics:', error.message);
    return [];
  }
};

// Fetch limited graphics for homepage or previews
export const fetchFeaturedGraphics = async (limit = 6) => {
  try {
    const data = await apiFetch(
      `/projects?populate=media&sort=createdAt:desc&pagination[limit]=50`
    );
    const projects = data.data || [];
    
    const graphics = [];
    projects.forEach(project => {
      if (project.media && Array.isArray(project.media)) {
        project.media.forEach(mediaItem => {
          graphics.push(transformProjectToGraphic(project, mediaItem));
        });
      }
    });
    
    return graphics.slice(0, limit);
  } catch (error) {
    console.error('[Graphics API] Failed to fetch featured graphics:', error);
    return [];
  }
};

// Fetch graphics for a specific project
export const fetchProjectGraphics = async (projectSlug) => {
  try {
    const data = await apiFetch(
      `/projects?filters[slug][$eq]=${projectSlug}&populate=media`
    );
    const projects = data.data || [];
    
    if (projects.length === 0) {
      throw new Error('Project not found');
    }
    
    const project = projects[0];
    const graphics = [];
    
    if (project.media && Array.isArray(project.media)) {
      project.media.forEach(mediaItem => {
        graphics.push(transformProjectToGraphic(project, mediaItem));
      });
    }
    
    return graphics;
  } catch (error) {
    console.error('[Graphics API] Failed to fetch project graphics:', error);
    throw error;
  }
};
