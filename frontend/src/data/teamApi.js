// Dynamic team & about data — fetches from Strapi backend
// Used by AboutPage

import { apiFetch, getImageUrl } from './api';

/**
 * Transform Strapi worker response to frontend team member format
 */
const transformWorker = (worker) => {
  const attrs = worker;
  const imageUrl = getImageUrl(attrs.photo);
  
  console.log('[TeamAPI] Transforming worker:', {
    id: worker.id,
    name: attrs.name,
    photoRaw: attrs.photo,
    photoTransformed: imageUrl
  });
  
  return {
    id: worker.id,
    documentId: worker.documentId,
    name: attrs.name || '',
    role: attrs.role || '',
    image: imageUrl,
    bio: attrs.description || '',
    slug: attrs.slug || '',
  };
};

// Fetch all team members from Strapi
// PATCHED: No /workers endpoint in backend, use /creators as team equivalent
export const fetchTeam = async () => {
  try {
    const data = await apiFetch('/creators');
    return (data.data || data || []).map(transformWorker);
  } catch (error) {
    console.error('Failed to fetch team:', error);
    return [];
  }
};

// Stats are part of the global single type or can be hardcoded as fallback
// PATCHED: No /global or /workers endpoints, fallback to static stats or count from endpoints
export const fetchStats = async () => {
  try {
    // Fallback: derive stats from actual data counts
    const [projectsRes, clientsRes, creatorsRes] = await Promise.all([
      apiFetch('/projects'),
      apiFetch('/clients'),
      apiFetch('/creators'),
    ]);
    return [
      { id: 1, value: '4', label: 'Years of Experience' },
      { id: 2, value: `${(clientsRes.length || clientsRes.data?.length || 0)}+`, label: 'Repeated Clients' },
      { id: 3, value: `${projectsRes.length || projectsRes.data?.length || 0}`, label: 'Completed Projects' },
      { id: 4, value: `${(clientsRes.length || clientsRes.data?.length || 0)}+`, label: 'Happy Clients' },
    ];
  } catch (error) {
    console.error('Failed to fetch stats:', error);
    return [
      { id: 1, value: '4', label: 'Years of Experience' },
      { id: 2, value: '200+', label: 'Repeated Clients' },
      { id: 3, value: '478', label: 'Completed Projects' },
      { id: 4, value: '350+', label: 'Happy Clients' },
    ];
  }
};

// Fetch company values — these are typically static content
// Could be extended to fetch from About single type's blocks
// PATCHED: No /about endpoint, fallback to static values
export const fetchValues = async () => {
  // Return static company values or fetch from a valid endpoint if available
  return [
    { id: 1, title: 'Collaboration', description: 'We work closely with our clients to bring their vision to life authentically.' },
    { id: 2, title: 'Creativity', description: 'We deliver unique and creative solutions for every project.' },
    { id: 3, title: 'Quality', description: 'We are committed to delivering high-quality results.' },
  ];
};
  // Fallback values removed; file ends cleanly
