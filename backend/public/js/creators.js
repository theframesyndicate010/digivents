document.addEventListener('DOMContentLoaded', function () {
    const ui = window.AdminUI;

    function wireDeleteHandlers() {
        document.querySelectorAll('[data-delete-creator-id]').forEach(function (btn) {
            if (btn.dataset.bound === '1') return;
            btn.dataset.bound = '1';
            btn.addEventListener('click', function () {
                const id = btn.getAttribute('data-delete-creator-id') || '';
                if (!id) return;
                deleteCreator(id);
            });
        });
    }

    loadCreators();

    async function loadCreators() {
        try {
            const result = await ui.apiRequest('/api/creators', { credentials: 'include' });
            renderCreators(result.data || []);
        } catch (error) {
            ui.showElement('creatorsError', error.message || 'Failed to load creators');
            renderCreators([]);
        } finally {
            ui.hideElement('creatorsLoading');
        }
    }

    function renderCreators(creators) {
        const tableBody = document.getElementById('creatorsTableBody');
        const mobileList = document.getElementById('creatorsMobileList');
        const items = Array.isArray(creators) ? creators : [];

        if (!items.length) {
            const empty = '<tr><td colspan="3" class="text-center py-8 text-gray-500"><i class="fas fa-users text-4xl mb-2 block"></i>No creators found.</td></tr>';
            if (tableBody) tableBody.innerHTML = empty;
            if (mobileList) mobileList.innerHTML = '<div class="text-center py-8 text-gray-500">No creators found.</div>';
            return;
        }

        if (tableBody) {
            tableBody.innerHTML = items.map(function (creator) {
                const id = ui.escapeHtml(creator.id || '');
                const name = ui.escapeHtml(creator.name || 'Unnamed');
                const photo = creator.photo
                    ? '<img class="h-10 w-10 rounded-full object-cover" src="' + ui.escapeHtml(creator.photo) + '" alt="Creator photo">'
                    : '<div class="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500"><i class="fas fa-user"></i></div>';

                return '<tr>' +
                    '<td class="px-6 py-4 whitespace-nowrap"><div class="flex items-center"><div class="h-10 w-10 flex-shrink-0">' + photo + '</div><div class="ml-4"><div class="text-sm font-medium text-gray-900">' + name + '</div><div class="text-xs text-gray-500">ID: ' + id + '</div></div></div></td>' +
                    '<td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">' + ui.escapeHtml(ui.formatDate(creator.created_at)) + '</td>' +
                    '<td class="px-6 py-4 whitespace-nowrap text-sm font-medium"><a href="/admin/edit-creator/' + id + '" class="text-indigo-600 hover:text-indigo-900 mr-3">Edit</a><button class="text-red-600 hover:text-red-900" type="button" data-delete-creator-id="' + id + '">Delete</button></td>' +
                '</tr>';
            }).join('');
        }

        if (mobileList) {
            mobileList.innerHTML = items.map(function (creator) {
                const id = ui.escapeHtml(creator.id || '');
                const name = ui.escapeHtml(creator.name || 'Unnamed');
                const photo = creator.photo
                    ? '<img class="h-16 w-16 rounded-full object-cover border-2 border-gray-200" src="' + ui.escapeHtml(creator.photo) + '" alt="Creator photo">'
                    : '<div class="h-16 w-16 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 border-2 border-gray-200"><i class="fas fa-user text-2xl"></i></div>';
                const createdDate = ui.escapeHtml(ui.formatDate(creator.created_at));

                return '<div class="mobile-card">' +
                    '<div class="flex gap-3 mb-3">' +
                        '<div class="flex-shrink-0">' + photo + '</div>' +
                        '<div class="flex-1 min-w-0">' +
                            '<h3 class="mobile-card-title truncate">' + name + '</h3>' +
                            '<p class="text-xs text-gray-500">ID: ' + id + '</p>' +
                            '<p class="text-xs text-gray-500 mt-1">Created: ' + createdDate + '</p>' +
                        '</div>' +
                    '</div>' +
                    '<div class="mobile-card-actions">' +
                        '<a class="bg-indigo-600 text-white rounded hover:bg-indigo-700 transition-colors" href="/admin/edit-creator/' + id + '"><i class="fas fa-edit mr-1"></i>Edit</a>' +
                        '<button class="bg-red-600 text-white rounded hover:bg-red-700 transition-colors" type="button" data-delete-creator-id="' + id + '"><i class="fas fa-trash mr-1"></i>Delete</button>' +
                    '</div>' +
                '</div>';
            }).join('');
        }

        wireDeleteHandlers();
    }

    window.deleteCreator = async function deleteCreator(id) {
        if (!confirm('Are you sure you want to delete this creator?')) return;
        try {
            await ui.apiRequest('/api/creators/' + encodeURIComponent(id), {
                method: 'DELETE',
                credentials: 'include'
            });
            loadCreators();
        } catch (error) {
            ui.showElement('creatorsError', error.message || 'Failed to delete creator');
        }
    };
});