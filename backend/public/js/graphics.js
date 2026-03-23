document.addEventListener('DOMContentLoaded', () => {
    const ui = window.AdminUI;

    loadGraphics();

    async function loadGraphics() {
        try {
            const result = await ui.apiRequest('/api/graphics', { credentials: 'include' });
            const graphics = Array.isArray(result.data) ? result.data : [];
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

        if (!graphics.length) {
            if (tableBody) tableBody.innerHTML = '<tr><td colspan="5" class="py-12 text-center">No graphics found</td></tr>';
            if (mobileList) mobileList.innerHTML = '<div class="py-12 text-center">No graphics found</div>';
            return;
        }

        if (tableBody) {
            tableBody.innerHTML = graphics.map(g => {
                const photo = g.photo ? g.photo : '/images/placeholder.png';
                return `
                    <tr>
                        <td><img src="${photo}" alt="${g.name}" class="w-14 h-14 object-cover rounded border"></td>
                        <td>${g.name || '-'}</td>
                        <td>${g.description || '-'}</td>
                        <td>${ui.formatDate(g.created_at)}</td>
                        <td>
                            <a href="/admin/edit-graphic/${g.id}" class="text-indigo-600 hover:text-indigo-800 mr-3">Edit</a>
                            <button onclick="deleteGraphic('${g.id}', this)" class="text-red-600 hover:text-red-800">Delete</button>
                        </td>
                    </tr>
                `;
            }).join('');
        }

        if (mobileList) {
            mobileList.innerHTML = graphics.map(g => {
                const photo = g.photo ? g.photo : '/images/placeholder.png';
                return `
                    <div class="border p-2 flex gap-2">
                        <img src="${photo}" class="w-16 h-16 object-cover rounded border">
                        <div>
                            <p>${g.name || '-'}</p>
                            <p>${g.description || '-'}</p>
                            <p>${ui.formatDate(g.created_at)}</p>
                            <div>
                                <a href="/admin/edit-graphic/${g.id}" class="text-indigo-600 hover:text-indigo-800 mr-3">Edit</a>
                                <button onclick="deleteGraphic('${g.id}', this)" class="text-red-600 hover:text-red-800">Delete</button>
                            </div>
                        </div>
                    </div>
                `;
            }).join('');
        }
    }

    window.deleteGraphic = async (id, btn) => {
        if (!confirm('Delete this graphic?')) return;
        if (btn) btn.disabled = true;

        try {
            await ui.apiRequest(`/api/graphics/${encodeURIComponent(id)}`, {
                method: 'DELETE',
                credentials: 'include'
            });
            ui.showElement('graphicsError', 'Graphic deleted successfully!', 'mb-4 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700');
            setTimeout(() => {
                ui.hideElement('graphicsError');
                loadGraphics();
            }, 1000);
        } catch (err) {
            console.error('[DELETE GRAPHIC ERROR]', err);
            ui.showElement('graphicsError', err.message || 'Failed to delete graphic', 'mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700');
            setTimeout(() => ui.hideElement('graphicsError'), 3000);
        } finally {
            if (btn) btn.disabled = false;
        }
    };
});