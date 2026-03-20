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
                    ? '<img class="h-12 w-12 rounded-full object-cover" src="' + ui.escapeHtml(creator.photo) + '" alt="Creator photo">'
                    : '<div class="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center text-gray-500"><i class="fas fa-user"></i></div>';

                return '<div class="bg-white shadow rounded-lg p-4">' +
                    '<div class="flex items-center space-x-4 mb-4">' + photo + '<div><h3 class="text-lg font-medium text-gray-900">' + name + '</h3><p class="text-xs text-gray-500">Created: ' + ui.escapeHtml(ui.formatDate(creator.created_at)) + '</p></div></div>' +
                    '<div class="flex justify-end space-x-3 border-t pt-3"><a href="/admin/edit-creator/' + id + '" class="text-indigo-600 font-medium text-sm">Edit</a><button class="text-red-600 font-medium text-sm" type="button" data-delete-creator-id="' + id + '">Delete</button></div>' +
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
