// Dynamic team & about data — fetches from backend API
// Used by AboutPage

import { apiFetch, getImageUrl } from './api';

/**
 * Transform backend creator response to frontend team member format
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

// Fetch all team members from backend
// Uses /creators endpoint which returns team member data
export const fetchTeam = async () => {
  try {
    const response = await apiFetch('/creators');
    // Backend returns { success: true, message: "...", data: [...] }
    const creators = response.data || response || [];
    console.log('[TeamAPI] Fetched creators:', creators);
    return creators.map(transformWorker);
  } catch (error) {
    console.error('Failed to fetch team:', error);
    return [];
  }
};

// Stats derived from actual data counts
export const fetchStats = async () => {
  try {
    // Fetch data from all endpoints
    const [projectsRes, clientsRes, creatorsRes] = await Promise.all([
      apiFetch('/projects'),
      apiFetch('/clients'),
      apiFetch('/creators'),
    ]);
    
    // Extract data arrays (backend returns { success, message, data })
    const projects = projectsRes.data || projectsRes || [];
    const clients = clientsRes.data || clientsRes || [];
    const creators = creatorsRes.data || creatorsRes || [];
    
    console.log('[TeamAPI] Stats counts:', { 
      projects: projects.length, 
      clients: clients.length, 
      creators: creators.length 
    });
    
    return [
      { id: 1, value: '4', label: 'Years of Experience' },
      { id: 2, value: `${clients.length}+`, label: 'Repeated Clients' },
      { id: 3, value: `${projects.length}`, label: 'Completed Projects' },
      { id: 4, value: `${clients.length}+`, label: 'Happy Clients' },
    ];
  } catch (error) {
    console.error('Failed to fetch stats:', error);
    // Fallback to static stats
    return [
      { id: 1, value: '4', label: 'Years of Experience' },
      { id: 2, value: '200+', label: 'Repeated Clients' },
      { id: 3, value: '478', label: 'Completed Projects' },
      { id: 4, value: '350+', label: 'Happy Clients' },
    ];
  }
};

// Fetch company values — static content
export const fetchValues = async () => {
  return [
    { id: 1, title: 'Collaboration', description: 'We work closely with our clients to bring their vision to life authentically.' },
    { id: 2, title: 'Creativity', description: 'We deliver unique and creative solutions for every project.' },
    { id: 3, title: 'Quality', description: 'We are committed to delivering high-quality results.' },
  ];
};
