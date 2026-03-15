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
    
      
      if (project.media && Array.isArray(project.media)) {
        project.media.forEach(mediaItem => {
          graphics.push(transformProjectToGraphic(project, mediaItem));
        });
      }
    });
    
    console.log('[Graphics API] Extracted', graphics.length, 'graphics from projects');
    console.log('[Graphics API] Final graphics:', graphics);
    return graphics;
=======
    const data = await apiFetch('/graphics?populate=*&sort=createdAt:desc');
    return (data.data || []).map(transformGraphic);
>>>>>>> 6d99c53 (Integrate graphics into projects page and cleanup)
  } catch (error) {
    console.error('[Graphics API] Failed to fetch graphics:', error.message);
    console.error('[Graphics API] Full error:', error);
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
