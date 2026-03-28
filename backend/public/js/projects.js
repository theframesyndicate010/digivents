document.addEventListener('DOMContentLoaded', function () {
    const ui = window.AdminUI;

    loadProjects();

    async function loadProjects() {
        try {
            const result = await ui.apiRequest('/api/projects', { credentials: 'include' });
            renderProjects(result.data || []);
        } catch (error) {
            ui.showElement('projectsError', error.message || 'Failed to load projects');
            renderProjects([]);
        } finally {
            ui.hideElement('projectsLoading');
        }
    }

    function statusBadge(status) {
        const normalized = String(status || 'active').toLowerCase();
        const cls = normalized === 'completed'
            ? 'bg-blue-100 text-blue-800'
            : normalized === 'pending'
                ? 'bg-gray-100 text-gray-800'
                : normalized === 'in-progress'
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-green-100 text-green-800';
        return '<span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full ' + cls + '">' + ui.escapeHtml(normalized.charAt(0).toUpperCase() + normalized.slice(1)) + '</span>';
    }

    function renderProjects(projects) {
        const tableBody = document.getElementById('projectsTableBody');
        const mobileList = document.getElementById('projectsMobileList');
        const items = Array.isArray(projects) ? projects : [];

        if (!items.length) {
            const empty = '<tr><td colspan="4" class="text-center py-12 text-gray-500"><i class="fas fa-project-diagram text-4xl mb-3 block"></i>No projects found.</td></tr>';
            if (tableBody) tableBody.innerHTML = empty;
            if (mobileList) mobileList.innerHTML = '<div class="text-center py-12 text-gray-500">No projects found.</div>';
            return;
        }

        if (tableBody) {
            tableBody.innerHTML = items.map(function (project) {
                const id = ui.escapeHtml(project.id || '');
                const name = ui.escapeHtml(project.name || 'Untitled');
                const tag = ui.escapeHtml(project.tag || 'No tag');
                const cover = project.cover_photo || project.coverPhoto;
                const coverHtml = cover
                    ? '<img class="h-10 w-10 rounded-md object-cover" src="' + ui.escapeHtml(cover) + '" alt="Project cover">'
                    : '<div class="h-10 w-10 rounded-md bg-gray-200 flex items-center justify-center text-gray-500"><i class="fas fa-image"></i></div>';
                const contact = project.contact
                    ? '<a href="' + ui.escapeHtml(project.contact) + '" target="_blank" class="text-blue-600 hover:underline">Link</a>'
                    : '-';

                return '<tr>' +
                    '<td class="px-6 py-4"><div class="flex items-center"><div class="h-10 w-10 flex-shrink-0">' + coverHtml + '</div><div class="ml-4"><div class="text-sm font-medium text-gray-900">' + name + '</div><div class="text-xs text-gray-500">' + tag + '</div></div></div></td>' +
                    '<td class="px-6 py-4 whitespace-nowrap">' + statusBadge(project.status) + '</td>' +
                    '<td class="px-6 py-4 text-sm text-gray-500">' + contact + '</td>' +
                    '<td class="px-6 py-4 text-sm"><a href="/admin/edit-project/' + id + '" class="text-indigo-600 mr-3">Edit</a><button class="text-red-600" type="button" data-delete-project-id="' + id + '">Delete</button></td>' +
                '</tr>';
            }).join('');
        }

        if (mobileList) {
            mobileList.innerHTML = items.map(function (project) {
                const id = ui.escapeHtml(project.id || '');
                const name = ui.escapeHtml(project.name || 'Untitled');
                const tag = ui.escapeHtml(project.tag || 'No tag');
                const cover = project.cover_photo || project.coverPhoto;
                const coverHtml = cover
                    ? '<img class="h-16 w-16 rounded-md object-cover" src="' + ui.escapeHtml(cover) + '" alt="Project cover">'
                    : '<div class="h-16 w-16 rounded-md bg-gray-200 flex items-center justify-center text-gray-500"><i class="fas fa-image text-2xl"></i></div>';
                const contact = project.contact
                    ? '<a href="' + ui.escapeHtml(project.contact) + '" target="_blank" class="text-blue-600 hover:underline break-all">Link</a>'
                    : '<span class="text-gray-400">-</span>';

                return '<div class="mobile-card">' +
                    '<div class="flex gap-3 mb-3">' +
                        '<div class="flex-shrink-0">' + coverHtml + '</div>' +
                        '<div class="flex-1 min-w-0">' +
                            '<h3 class="mobile-card-title truncate">' + name + '</h3>' +
                            '<p class="text-xs text-gray-500 truncate">' + tag + '</p>' +
                        '</div>' +
                    '</div>' +
                    '<div class="mobile-card-body">' +
                        '<div class="mobile-card-row"><span class="mobile-card-label">Status:</span><span>' + statusBadge(project.status) + '</span></div>' +
                        '<div class="mobile-card-row"><span class="mobile-card-label">Link:</span><span class="mobile-card-value">' + contact + '</span></div>' +
                    '</div>' +
                    '<div class="mobile-card-actions">' +
                        '<a class="bg-indigo-600 text-white rounded hover:bg-indigo-700 transition-colors" href="/admin/edit-project/' + id + '"><i class="fas fa-edit mr-1"></i>Edit</a>' +
                        '<button class="bg-red-600 text-white rounded hover:bg-red-700 transition-colors" type="button" data-delete-project-id="' + id + '"><i class="fas fa-trash mr-1"></i>Delete</button>' +
                    '</div>' +
                '</div>';
            }).join('');
        }
        // Wire up delete handlers for project delete buttons
        function wireDeleteHandlers() {
            document.querySelectorAll('[data-delete-project-id]').forEach(function (btn) {
                if (btn.dataset.bound === '1') return;
                btn.dataset.bound = '1';
                btn.addEventListener('click', function () {
                    const id = btn.getAttribute('data-delete-project-id') || '';
                    if (!id) return;
                    deleteProject(id);
                });
            });
        }

        // Call after rendering
        setTimeout(wireDeleteHandlers, 0);
    }

    window.deleteProject = async function deleteProject(id) {
        if (!confirm('Delete this project?')) return;
        try {
            await ui.apiRequest('/api/projects/' + encodeURIComponent(id), {
                method: 'DELETE',
                credentials: 'include'
            });
            ui.showElement('projectsError', 'Project deleted successfully!', 'mb-4 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700');
            setTimeout(() => {
                ui.hideElement('projectsError');
                // Force reload to ensure UI updates
                window.location.reload();
            }, 1200);
        } catch (error) {
            ui.showElement('projectsError', error.message || 'Failed to delete project', 'mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700');
            setTimeout(() => ui.hideElement('projectsError'), 4000);
        }
    };
});