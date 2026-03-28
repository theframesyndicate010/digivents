document.addEventListener('DOMContentLoaded', function () {
    const ui = window.AdminUI;

    loadClients();

    async function loadClients() {
        try {
            const result = await ui.apiRequest('/api/clients', { credentials: 'include' });
            renderClients(result.data || []);
        } catch (error) {
            ui.showElement('clientsError', error.message || 'Failed to load clients');
            renderClients([]);
        } finally {
            ui.hideElement('clientsLoading');
        }
    }

    function socialLinks(client) {
        const parts = [];
        if (client.instagram_link) parts.push('<a href="' + ui.escapeHtml(client.instagram_link) + '" target="_blank" class="text-pink-600"><i class="fab fa-instagram"></i></a>');
        if (client.facebook_link) parts.push('<a href="' + ui.escapeHtml(client.facebook_link) + '" target="_blank" class="text-blue-600"><i class="fab fa-facebook"></i></a>');
        if (client.tiktok_link) parts.push('<a href="' + ui.escapeHtml(client.tiktok_link) + '" target="_blank" class="text-black"><i class="fab fa-tiktok"></i></a>');
        if (!parts.length) parts.push('<span class="text-sm text-gray-400">-</span>');
        return parts.join(' ');
    }

    function renderClients(clients) {
        const tableBody = document.getElementById('clientsTableBody');
        const mobileList = document.getElementById('clientsMobileList');
        const items = Array.isArray(clients) ? clients : [];

        if (!items.length) {
            const empty = '<tr><td colspan="5" class="text-center py-8 text-gray-500"><i class="fas fa-briefcase text-4xl mb-2 block"></i>No clients found.</td></tr>';
            if (tableBody) tableBody.innerHTML = empty;
            if (mobileList) mobileList.innerHTML = '<div class="text-center py-8 text-gray-500">No clients found.</div>';
            return;
        }

        if (tableBody) {
            tableBody.innerHTML = items.map(function (client) {
                const id = ui.escapeHtml(client.id || '');
                const name = ui.escapeHtml(client.name || 'Unnamed');
                const website = client.website ? '<a href="' + ui.escapeHtml(client.website) + '" target="_blank" class="hover:underline text-blue-600">' + ui.escapeHtml(client.website) + '</a>' : '-';
                return '<tr>' +
                    '<td class="px-6 py-4 whitespace-nowrap"><div class="text-sm font-medium text-gray-900">' + name + '</div><div class="text-xs text-gray-500">ID: ' + id + '</div></td>' +
                    '<td class="px-6 py-4 whitespace-nowrap text-sm">' + website + '</td>' +
                    '<td class="px-6 py-4 whitespace-nowrap"><div class="flex space-x-3 text-lg">' + socialLinks(client) + '</div></td>' +
                    '<td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">' + ui.escapeHtml(ui.formatDate(client.created_at)) + '</td>' +
                    '<td class="px-6 py-4 whitespace-nowrap text-sm font-medium"><a class="text-indigo-600 hover:text-indigo-900 mr-3" href="/admin/edit-client/' + id + '">Edit</a><button class="text-red-600 hover:text-red-900" type="button" data-delete-client-id="' + id + '">Delete</button></td>' +
                '</tr>';
            }).join('');
        }

        if (mobileList) {
            mobileList.innerHTML = items.map(function (client) {
                const id = ui.escapeHtml(client.id || '');
                const name = ui.escapeHtml(client.name || 'Unnamed');
                const website = client.website ? '<a href="' + ui.escapeHtml(client.website) + '" target="_blank" class="text-blue-600 hover:underline break-all">' + ui.escapeHtml(client.website) + '</a>' : '<span class="text-gray-400">-</span>';
                const createdDate = ui.escapeHtml(ui.formatDate(client.created_at));
                return '<div class="mobile-card">' +
                    '<div class="mobile-card-header">' +
                        '<div><h3 class="mobile-card-title">' + name + '</h3><div class="text-xs text-gray-500 mt-1">ID: ' + id + '</div></div>' +
                        '<div class="text-xs text-gray-500 text-right">' + createdDate + '</div>' +
                    '</div>' +
                    '<div class="mobile-card-body">' +
                        '<div class="mobile-card-row"><span class="mobile-card-label">Website:</span><span class="mobile-card-value">' + website + '</span></div>' +
                        '<div class="mobile-card-row"><span class="mobile-card-label">Social:</span><div class="flex gap-2 text-lg">' + socialLinks(client) + '</div></div>' +
                    '</div>' +
                    '<div class="mobile-card-actions">' +
                        '<a class="bg-indigo-600 text-white rounded hover:bg-indigo-700 transition-colors" href="/admin/edit-client/' + id + '"><i class="fas fa-edit mr-1"></i>Edit</a>' +
                        '<button class="bg-red-600 text-white rounded hover:bg-red-700 transition-colors" type="button" data-delete-client-id="' + id + '"><i class="fas fa-trash mr-1"></i>Delete</button>' +
                    '</div>' +
                '</div>';
            }).join('');
        }
        // Wire up delete handlers for client delete buttons
        function wireDeleteHandlers() {
            document.querySelectorAll('[data-delete-client-id]').forEach(function (btn) {
                if (btn.dataset.bound === '1') return;
                btn.dataset.bound = '1';
                btn.addEventListener('click', function () {
                    const id = btn.getAttribute('data-delete-client-id') || '';
                    if (!id) return;
                    deleteClient(id);
                });
            });
        }

        // Call after rendering
        setTimeout(wireDeleteHandlers, 0);
    }

    window.deleteClient = async function deleteClient(id) {
        if (!confirm('Are you sure you want to delete this client?')) return;
        // Find the button and disable it during the request
        const btn = document.querySelector('[data-delete-client-id="' + id + '"]');
        if (btn) {
            btn.disabled = true;
            btn.textContent = 'Deleting...';
        }
        try {
            await ui.apiRequest('/api/clients/' + encodeURIComponent(id), {
                method: 'DELETE',
                credentials: 'include'
            });
            ui.showElement('clientsError', 'Client deleted successfully!', 'mb-4 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700');
            setTimeout(() => {
                ui.hideElement('clientsError');
                loadClients();
            }, 1000);
        } catch (error) {
            ui.showElement('clientsError', error.message || 'Failed to delete client', 'mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700');
            setTimeout(() => ui.hideElement('clientsError'), 3000);
        } finally {
            if (btn) {
                btn.disabled = false;
                btn.textContent = 'Delete';
            }
        }
    };
});