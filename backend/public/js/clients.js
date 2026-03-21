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
                const website = client.website ? '<a href="' + ui.escapeHtml(client.website) + '" target="_blank" class="text-blue-600 block mb-1">' + ui.escapeHtml(client.website) + '</a>' : '';
                return '<div class="bg-white shadow rounded-lg p-4">' +
                    '<div class="flex justify-between items-start mb-2"><h3 class="text-lg font-medium text-gray-900">' + name + '</h3><span class="text-xs text-gray-500">' + ui.escapeHtml(ui.formatDate(client.created_at)) + '</span></div>' +
                    '<div class="mb-3 text-sm">' + website + '</div>' +
                    '<div class="flex space-x-4 mb-4 text-lg">' + socialLinks(client) + '</div>' +
                    '<div class="flex justify-end space-x-3 border-t pt-3"><a class="text-indigo-600 font-medium text-sm" href="/admin/edit-client/' + id + '">Edit</a><button class="text-red-600 font-medium text-sm" type="button" data-delete-client-id="' + id + '">Delete</button></div>' +
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