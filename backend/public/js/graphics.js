document.addEventListener('DOMContentLoaded', function () {
    const ui = window.AdminUI;

    loadGraphics();

    async function loadGraphics() {
        try {
            const result = await ui.apiRequest('/api/graphics', { credentials: 'include' });
            renderGraphics(result.data || []);
        } catch (error) {
            ui.showElement('graphicsError', error.message || 'Failed to load graphics');
            renderGraphics([]);
        } finally {
            ui.hideElement('graphicsLoading');
        }
    }

    function renderGraphics(graphics) {
        const tableBody = document.getElementById('graphicsTableBody');
        const mobileList = document.getElementById('graphicsMobileList');
        const items = Array.isArray(graphics) ? graphics : [];

        if (!items.length) {
            const empty = '<tr><td colspan="5" class="py-12 text-center text-gray-500"><i class="fas fa-images text-4xl mb-2 block"></i>No graphics found.</td></tr>';
            if (tableBody) tableBody.innerHTML = empty;
            if (mobileList) mobileList.innerHTML = '<div class="text-center py-12 text-gray-500">No graphics found.</div>';
            return;
        }

        if (tableBody) {
            tableBody.innerHTML = items.map(function (graphic) {
                const id = ui.escapeHtml(graphic.id || '');
                const name = ui.escapeHtml(graphic.name || '-');
                const description = ui.escapeHtml(graphic.description || '-');
                const photo = ui.escapeHtml(graphic.photo || '');

                return '<tr>' +
                    '<td class="px-6 py-4 whitespace-nowrap"><img src="' + photo + '" alt="' + name + '" class="w-14 h-14 object-cover rounded-md border border-gray-200"></td>' +
                    '<td class="px-6 py-4"><p class="text-sm font-medium text-gray-900">' + name + '</p></td>' +
                    '<td class="px-6 py-4"><p class="text-sm text-gray-600 max-w-sm truncate">' + description + '</p></td>' +
                    '<td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">' + ui.escapeHtml(ui.formatDate(graphic.created_at)) + '</td>' +
                    '<td class="px-6 py-4 whitespace-nowrap text-sm"><a href="/admin/edit-graphic/' + id + '" class="text-indigo-600 hover:text-indigo-800 mr-3"><i class="fas fa-pen mr-1"></i>Edit</a><button class="text-red-600 hover:text-red-800" onclick="deleteGraphic(\'' + id + '\')"><i class="fas fa-trash mr-1"></i>Delete</button></td>' +
                '</tr>';
            }).join('');
        }

        if (mobileList) {
            mobileList.innerHTML = items.map(function (graphic) {
                const id = ui.escapeHtml(graphic.id || '');
                const name = ui.escapeHtml(graphic.name || '-');
                const description = ui.escapeHtml(graphic.description || '-');
                const photo = ui.escapeHtml(graphic.photo || '');
                return '<div class="border border-gray-200 rounded-lg p-4">' +
                    '<div class="flex gap-3"><img src="' + photo + '" alt="' + name + '" class="w-16 h-16 object-cover rounded-md border border-gray-200"><div class="flex-1 min-w-0"><p class="font-semibold text-gray-900 truncate">' + name + '</p><p class="text-sm text-gray-600 truncate">' + description + '</p><p class="text-xs text-gray-500 mt-1">' + ui.escapeHtml(ui.formatDate(graphic.created_at)) + '</p></div></div>' +
                    '<div class="mt-3 flex gap-3"><a href="/admin/edit-graphic/' + id + '" class="text-indigo-600 hover:text-indigo-800 text-sm"><i class="fas fa-pen mr-1"></i>Edit</a><button class="text-red-600 hover:text-red-800 text-sm" onclick="deleteGraphic(\'' + id + '\')"><i class="fas fa-trash mr-1"></i>Delete</button></div>' +
                '</div>';
            }).join('');
        }
    }

    window.deleteGraphic = async function deleteGraphic(id) {
        if (!confirm('Delete this graphic?')) return;
        try {
            await ui.apiRequest('/api/graphics/' + encodeURIComponent(id), {
                method: 'DELETE',
                credentials: 'include'
            });
            loadGraphics();
        } catch (error) {
            ui.showElement('graphicsError', error.message || 'Failed to delete graphic');
        }
    };
});