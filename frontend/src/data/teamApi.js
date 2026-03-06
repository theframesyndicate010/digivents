// Dynamic team & about data — fetches from Strapi backend
// Used by AboutPage

import { apiFetch, getImageUrl } from './api';

/**
 * Transform Strapi worker response to frontend team member format
 */
const transformWorker = (worker) => {
  const attrs = worker;
  return {
    id: worker.id,
    documentId: worker.documentId,
    name: attrs.name || '',
    role: attrs.role || '',
    image: getImageUrl(attrs.photo),
    bio: attrs.description || '',
    slug: attrs.slug || '',
  };
};

// Fetch all team members from Strapi
export const fetchTeam = async () => {
  try {
    const data = await apiFetch('/workers?populate=*&sort=createdAt:asc');
    return (data.data || []).map(transformWorker);
  } catch (error) {
    console.error('Failed to fetch team:', error);
    return [];
  }
};

// Fetch stats from Strapi Global settings
// Stats are part of the global single type or can be hardcoded as fallback
export const fetchStats = async () => {
  try {
    const data = await apiFetch('/global?populate=*');
    const attrs = data.data;
    // If global has stats fields, use them; otherwise return defaults
    if (attrs?.stats) return attrs.stats;
    // Fallback: derive stats from actual data counts
    const [projectsRes, clientsRes, workersRes] = await Promise.all([
      apiFetch('/projects?pagination[limit]=1&pagination[withCount]=true'),
      apiFetch('/clients?pagination[limit]=1&pagination[withCount]=true'),
      apiFetch('/workers?pagination[limit]=1&pagination[withCount]=true'),
    ]);
    return [
      { id: 1, value: '15+', label: 'Years of Experience' },
      { id: 2, value: `${clientsRes.meta?.pagination?.total || 0}+`, label: 'Repeated Clients' },
      { id: 3, value: `${projectsRes.meta?.pagination?.total || 0}`, label: 'Completed Projects' },
      { id: 4, value: `${clientsRes.meta?.pagination?.total || 0}+`, label: 'Happy Clients' },
    ];
  } catch (error) {
    console.error('Failed to fetch stats:', error);
    return [
      { id: 1, value: '15+', label: 'Years of Experience' },
      { id: 2, value: '200+', label: 'Repeated Clients' },
      { id: 3, value: '478', label: 'Completed Projects' },
      { id: 4, value: '350+', label: 'Happy Clients' },
    ];
  }
};

// Fetch company values — these are typically static content
// Could be extended to fetch from About single type's blocks
export const fetchValues = async () => {
  try {
    const data = await apiFetch('/about?populate[blocks][populate]=*');
    const attrs = data.data;
    // Check if about has values in its blocks
    if (attrs?.blocks) {
      const richTextBlocks = attrs.blocks.filter((b) => b.__component === 'shared.rich-text');
      if (richTextBlocks.length > 0) {
        return richTextBlocks.map((block, i) => ({
          id: i + 1,
          title: block.title || `Value ${i + 1}`,
          description: block.body || '',
        }));
      }
    }
    // Fallback values
    return [
      { id: 1, title: 'Creativity', description: 'We push boundaries and think outside the box to deliver unique visual experiences.' },
      { id: 2, title: 'Excellence', description: 'Every frame, every cut, every effect meets our highest quality standards.' },
      { id: 3, title: 'Innovation', description: 'We embrace cutting-edge technology and techniques to stay ahead of the curve.' },
      { id: 4, title: 'Collaboration', description: 'We work closely with our clients to bring their vision to life authentically.' },
    ];
  } catch (error) {
    console.error('Failed to fetch values:', error);
    return [
      { id: 1, title: 'Creativity', description: 'We push boundaries and think outside the box to deliver unique visual experiences.' },
      { id: 2, title: 'Excellence', description: 'Every frame, every cut, every effect meets our highest quality standards.' },
      { id: 3, title: 'Innovation', description: 'We embrace cutting-edge technology and techniques to stay ahead of the curve.' },
      { id: 4, title: 'Collaboration', description: 'We work closely with our clients to bring their vision to life authentically.' },
    ];
  }
};
