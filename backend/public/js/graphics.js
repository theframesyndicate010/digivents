document.addEventListener('DOMContentLoaded', () => {
    const ui = window.AdminUI;
    if (!ui) return;

    async function loadGraphics() {
        try {
            const res = await ui.apiRequest('/api/graphics', { credentials: 'include' });
            const graphics = Array.isArray(res.data) ? res.data : [];
            renderGraphics(graphics);
        } catch (err) {
            ui.showElement('graphicsError', err.message || 'Failed to load graphics');
            renderGraphics([]);
        } finally {
            ui.hideElement('graphicsLoading');
        }
    }

    function renderGraphics(graphics) {
        const tableBody = document.getElementById('graphicsTableBody');
        const mobileList = document.getElementById('graphicsMobileList');

        const emptyState = `
            <div class="text-center py-12">
                <i class="fas fa-images text-gray-300 text-6xl mb-4"></i>
                <p class="text-gray-500 text-lg mb-2">No graphics found</p>
                <p class="text-gray-400 text-sm">Start by adding your first graphic</p>
            </div>
        `;
        if (!graphics.length) {
            if (tableBody) tableBody.innerHTML = `<tr><td colspan="5">${emptyState}</td></tr>`;
            if (mobileList) mobileList.innerHTML = emptyState;
            return;
        }

        tableBody.innerHTML = graphics.map(g => {
            const id = ui.escapeHtml(g.id);
            return `
                <tr class="hover:bg-gray-50">
                    <td><img src="${g.photo || '/images/placeholder.png'}" class="w-16 h-16 object-cover rounded-lg border"></td>
                    <td>${ui.escapeHtml(g.name || '-')}</td>
                    <td class="text-gray-600 max-w-xs truncate">${ui.escapeHtml(g.description || '-')}</td>
                    <td>${ui.formatDate(g.created_at)}</td>
                    <td>
                        <a href="/admin/edit-graphic/${id}" class="text-indigo-600 hover:text-indigo-800 mr-3">Edit</a>
                        <button class="text-red-600 hover:text-red-800 delete-graphic-btn" data-graphic-id="${id}">Delete</button>
                    </td>
                </tr>
            `;
        }).join('');

        mobileList.innerHTML = graphics.map(g => {
            const id = ui.escapeHtml(g.id);
            const name = ui.escapeHtml(g.name || '-');
            const description = ui.escapeHtml(g.description || '-');
            const createdDate = ui.formatDate(g.created_at);
            return `
                <div class="mobile-card">
                    <div class="flex gap-3 mb-3">
                        <img src="${g.photo || '/images/placeholder.png'}" class="w-20 h-20 object-cover rounded-lg border flex-shrink-0">
                        <div class="flex-1 min-w-0">
                            <h4 class="mobile-card-title truncate">${name}</h4>
                            <p class="text-sm text-gray-600 line-clamp-2">${description}</p>
                            <p class="text-xs text-gray-500 mt-1">${createdDate}</p>
                        </div>
                    </div>
                    <div class="mobile-card-actions">
                        <a href="/admin/edit-graphic/${id}" class="bg-indigo-600 text-white rounded hover:bg-indigo-700 transition-colors"><i class="fas fa-edit mr-1"></i>Edit</a>
                        <button class="bg-red-600 text-white rounded hover:bg-red-700 transition-colors delete-graphic-btn" data-graphic-id="${id}"><i class="fas fa-trash mr-1"></i>Delete</button>
                    </div>
                </div>
            `;
        }).join('');

        attachDeleteHandlers();
    }

    function attachDeleteHandlers() {
        document.querySelectorAll('.delete-graphic-btn').forEach(btn => {
            btn.addEventListener('click', async function() {
                const id = this.dataset.graphicId;
                if (!id || !confirm('Delete this graphic?')) return;
                try {
                    await ui.apiRequest('/api/graphics/' + encodeURIComponent(id), { method: 'DELETE', credentials: 'include' });
                    loadGraphics();
                } catch (err) {
                    ui.showElement('graphicsError', err.message || 'Failed to delete graphic');
                }
            });
        });
    }

    loadGraphics();
});