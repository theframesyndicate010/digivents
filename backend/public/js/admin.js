// Admin Panel JavaScript Functions

// Generic function to make API calls
async function apiCall(url, method = 'GET', data = null) {
    try {
        const options = {
            method,
            headers: {
                'Content-Type': 'application/json',
            }
        };

        if (data) {
            options.body = JSON.stringify(data);
        }

        const response = await fetch(url, options);
        const result = await response.json();
        
        if (!response.ok) {
            throw new Error(result.message || 'Something went wrong');
        }
        
        return result;
    } catch (error) {
        console.error('API call error:', error);
        throw error;
    }
}

// Show notification
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `fixed top-4 right-4 p-4 rounded-lg text-white z-50 ${
        type === 'success' ? 'bg-green-500' : 'bg-red-500'
    }`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// AUTHORS FUNCTIONS
async function createAuthor(formData) {
    try {
        const result = await apiCall('/admin/authors', 'POST', formData);
        showNotification(result.message);
        location.reload();
    } catch (error) {
        showNotification(error.message, 'error');
    }
}

async function updateAuthor(id, formData) {
    try {
        const result = await apiCall(`/admin/authors/${id}`, 'PUT', formData);
        showNotification(result.message);
        location.reload();
    } catch (error) {
        showNotification(error.message, 'error');
    }
}

async function deleteAuthor(id) {
    if (!confirm('Are you sure you want to delete this author?')) return;
    
    try {
        const result = await apiCall(`/admin/authors/${id}`, 'DELETE');
        showNotification(result.message);
        location.reload();
    } catch (error) {
        showNotification(error.message, 'error');
    }
}

// CATEGORIES FUNCTIONS
async function createCategory(formData) {
    try {
        const result = await apiCall('/admin/categories', 'POST', formData);
        showNotification(result.message);
        location.reload();
    } catch (error) {
        showNotification(error.message, 'error');
    }
}

async function updateCategory(id, formData) {
    try {
        const result = await apiCall(`/admin/categories/${id}`, 'PUT', formData);
        showNotification(result.message);
        location.reload();
    } catch (error) {
        showNotification(error.message, 'error');
    }
}

async function deleteCategory(id) {
    if (!confirm('Are you sure you want to delete this category?')) return;
    
    try {
        const result = await apiCall(`/admin/categories/${id}`, 'DELETE');
        showNotification(result.message);
        location.reload();
    } catch (error) {
        showNotification(error.message, 'error');
    }
}

// PROJECTS FUNCTIONS
async function createProject(formData) {
    try {
        const result = await apiCall('/admin/projects', 'POST', formData);
        showNotification(result.message);
        location.reload();
    } catch (error) {
        showNotification(error.message, 'error');
    }
}

async function updateProject(id, formData) {
    try {
        const result = await apiCall(`/admin/projects/${id}`, 'PUT', formData);
        showNotification(result.message);
        location.reload();
    } catch (error) {
        showNotification(error.message, 'error');
    }
}

async function deleteProject(id) {
    if (!confirm('Are you sure you want to delete this project?')) return;
    
    try {
        const result = await apiCall(`/admin/projects/${id}`, 'DELETE');
        showNotification(result.message);
        location.reload();
    } catch (error) {
        showNotification(error.message, 'error');
    }
}

// CLIENTS FUNCTIONS
async function createClient(formData) {
    try {
        const result = await apiCall('/admin/clients', 'POST', formData);
        showNotification(result.message);
        location.reload();
    } catch (error) {
        showNotification(error.message, 'error');
    }
}

async function updateClient(id, formData) {
    try {
        const result = await apiCall(`/admin/clients/${id}`, 'PUT', formData);
        showNotification(result.message);
        location.reload();
    } catch (error) {
        showNotification(error.message, 'error');
    }
}

async function deleteClient(id) {
    if (!confirm('Are you sure you want to delete this client?')) return;
    
    try {
        const result = await apiCall(`/admin/clients/${id}`, 'DELETE');
        showNotification(result.message);
        location.reload();
    } catch (error) {
        showNotification(error.message, 'error');
    }
}

async function fetchMessages() {
    try {
        const result = await apiCall('/admin/messages');
        console.log(result);
    } catch (error) {
        showNotification(error.message, 'error');
    }
}

// CONTACTS FUNCTIONS
async function updateContact(id, formData) {
    try {
        const result = await apiCall(`/admin/contacts/${id}`, 'PUT', formData);
        showNotification(result.message);
        location.reload();
    } catch (error) {
        showNotification(error.message, 'error');
    }
}

async function deleteContact(id) {
    if (!confirm('Are you sure you want to delete this contact?')) return;
    
    try {
        const result = await apiCall(`/admin/contacts/${id}`, 'DELETE');
        showNotification(result.message);
        location.reload();
    } catch (error) {
        showNotification(error.message, 'error');
    }
}

// Modal functions
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('hidden');
        document.body.style.overflow = 'auto';
        
        // Reset form if exists
        const form = modal.querySelector('form');
        if (form) {
            form.reset();
        }
        
        // Clear graphics preview if exists
        const preview = modal.querySelector('#graphicsPreview');
        if (preview) {
            preview.innerHTML = '';
        }
    }
}

// Form handling
function handleFormSubmit(event, action, id = null) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData.entries());
    
    if (id) {
        action(id, data);
    } else {
        action(data);
    }
}

// Mobile menu toggle
function toggleMobileMenu() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('mobileMenuOverlay');
    
    sidebar.classList.toggle('open');
    overlay.classList.toggle('hidden');
}