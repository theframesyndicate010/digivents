import { API_BASE, apiFetch, uploadFile } from './api';

// Helper for debug logging
const logFetch = (msg) => console.log(`[BackendApi]`, msg);

export const creatorsApi = {
  list: () => { logFetch('Fetching creators...'); return apiFetch(`${API_BASE}/creators`, { credentials: 'include' }).catch(err => { console.error(err); throw err; }); },
  getById: (id) => { logFetch(`Fetching creator ${id}...`); return apiFetch(`${API_BASE}/creators/${id}`, { credentials: 'include' }).catch(err => { console.error(err); throw err; }); },
  create: (formData) => { logFetch('Creating creator...'); return uploadFile(`${API_BASE}/creators`, formData, { credentials: 'include' }).catch(err => { console.error(err); throw err; }); },
  update: (id, formData) => { logFetch(`Updating creator ${id}...`); return fetchUpdateMultipart(`${API_BASE}/creators/${id}`, formData, { credentials: 'include' }).catch(err => { console.error(err); throw err; }); },
  remove: (id) => { logFetch(`Removing creator ${id}...`); return apiFetch(`${API_BASE}/creators/${id}`, { method: 'DELETE', credentials: 'include' }).catch(err => { console.error(err); throw err; }); },
};

export const projectsApi = {
  list: () => { logFetch('Fetching projects...'); return apiFetch(`${API_BASE}/projects`, { credentials: 'include' }).catch(err => { console.error(err); throw err; }); },
  getById: (id) => { logFetch(`Fetching project ${id}...`); return apiFetch(`${API_BASE}/projects/${id}`, { credentials: 'include' }).catch(err => { console.error(err); throw err; }); },
  create: (formData) => { logFetch('Creating project...'); return uploadFile(`${API_BASE}/projects`, formData, { credentials: 'include' }).catch(err => { console.error(err); throw err; }); },
  update: (id, formData) => { logFetch(`Updating project ${id}...`); return fetchUpdateMultipart(`${API_BASE}/projects/${id}`, formData, { credentials: 'include' }).catch(err => { console.error(err); throw err; }); },
  remove: (id) => { logFetch(`Removing project ${id}...`); return apiFetch(`${API_BASE}/projects/${id}`, { method: 'DELETE', credentials: 'include' }).catch(err => { console.error(err); throw err; }); },
};

export const graphicsApi = {
  list: () => { logFetch('Fetching graphics...'); return apiFetch(`${API_BASE}/graphics`, { credentials: 'include' }).catch(err => { console.error(err); throw err; }); },
  getById: (id) => { logFetch(`Fetching graphic ${id}...`); return apiFetch(`${API_BASE}/graphics/${id}`, { credentials: 'include' }).catch(err => { console.error(err); throw err; }); },
  create: (formData) => { logFetch('Creating graphic...'); return uploadFile(`${API_BASE}/graphics`, formData, { credentials: 'include' }).catch(err => { console.error(err); throw err; }); },
  update: (id, formData) => { logFetch(`Updating graphic ${id}...`); return fetchUpdateMultipart(`${API_BASE}/graphics/${id}`, formData, { credentials: 'include' }).catch(err => { console.error(err); throw err; }); },
  remove: (id) => { logFetch(`Removing graphic ${id}...`); return apiFetch(`${API_BASE}/graphics/${id}`, { method: 'DELETE', credentials: 'include' }).catch(err => { console.error(err); throw err; }); },
};

export const clientsApi = {
  list: () => { logFetch('Fetching clients...'); return apiFetch(`${API_BASE}/clients`, { credentials: 'include' }).catch(err => { console.error(err); throw err; }); },
  getById: (id) => { logFetch(`Fetching client ${id}...`); return apiFetch(`${API_BASE}/clients/${id}`, { credentials: 'include' }).catch(err => { console.error(err); throw err; }); },
  create: (payload) => { logFetch('Creating client...'); return apiFetch(`${API_BASE}/clients`, { method: 'POST', credentials: 'include', body: JSON.stringify(payload) }).catch(err => { console.error(err); throw err; }); },
  update: (id, payload) => { logFetch(`Updating client ${id}...`); return apiFetch(`${API_BASE}/clients/${id}`, { method: 'PUT', credentials: 'include', body: JSON.stringify(payload) }).catch(err => { console.error(err); throw err; }); },
  remove: (id) => { logFetch(`Removing client ${id}...`); return apiFetch(`${API_BASE}/clients/${id}`, { method: 'DELETE', credentials: 'include' }).catch(err => { console.error(err); throw err; }); },
};

export const messagesApi = {
  submit: (payload) => { logFetch('Submitting message...'); return apiFetch(`${API_BASE}/messages`, { method: 'POST', body: JSON.stringify(payload) }).catch(err => { console.error(err); throw err; }); },
  list: () => { logFetch('Fetching messages...'); return apiFetch(`${API_BASE}/messages`, { credentials: 'include' }).catch(err => { console.error(err); throw err; }); },
  update: (id, payload) => { logFetch(`Updating message ${id}...`); return apiFetch(`${API_BASE}/messages/${id}`, { method: 'PUT', credentials: 'include', body: JSON.stringify(payload) }).catch(err => { console.error(err); throw err; }); },
  remove: (id) => { logFetch(`Removing message ${id}...`); return apiFetch(`${API_BASE}/messages/${id}`, { method: 'DELETE', credentials: 'include' }).catch(err => { console.error(err); throw err; }); },
};

export const feedbackApi = {
  submit: (payload) => { logFetch('Submitting feedback...'); return apiFetch(`${API_BASE}/feedback`, { method: 'POST', body: JSON.stringify(payload) }).catch(err => { console.error(err); throw err; }); },
  list: () => { logFetch('Fetching feedback...'); return apiFetch(`${API_BASE}/feedback`, { credentials: 'include' }).catch(err => { console.error(err); throw err; }); },
  update: (id, payload) => { logFetch(`Updating feedback ${id}...`); return apiFetch(`${API_BASE}/feedback/${id}`, { method: 'PUT', credentials: 'include', body: JSON.stringify(payload) }).catch(err => { console.error(err); throw err; }); },
  remove: (id) => { logFetch(`Removing feedback ${id}...`); return apiFetch(`${API_BASE}/feedback/${id}`, { method: 'DELETE', credentials: 'include' }).catch(err => { console.error(err); throw err; }); },
};

async function fetchUpdateMultipart(endpoint, formData, options = {}) {
  const { API_BASE } = await import('./api');
  // Ensure endpoint does not already include API_BASE
  const url = endpoint.startsWith(API_BASE) ? endpoint : `${API_BASE}${endpoint}`;
  const response = await fetch(url, {
    method: 'PUT',
    body: formData,
    ...options,
  });

  const payload = await response.json().catch(() => ({
    success: false,
    message: response.statusText,
  }));

  if (!response.ok || payload.success === false) {
    throw new Error(payload.message || `Request failed: ${response.status}`);
  }

  return payload;
}
