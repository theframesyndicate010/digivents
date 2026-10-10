document.addEventListener('DOMContentLoaded', function () {
    const ui = window.AdminUI;

    loadTestimonials();

    async function loadTestimonials() {
        try {
            // Admin listing: includes hidden entries so they can be re-enabled
            const result = await ui.apiRequest('/api/testimonials/admin/all', { credentials: 'include' });
            renderTestimonials(result.data || []);
        } catch (error) {
            ui.showElement('testimonialsError', error.message || 'Failed to load testimonials');
            renderTestimonials([]);
        } finally {
            ui.hideElement('testimonialsLoading');
        }
    }

    function avatarThumb(t) {
        const initial = ui.escapeHtml((t.name || '?').charAt(0).toUpperCase());
        const cls = 'h-9 w-9 rounded-full object-cover bg-gray-100 flex-shrink-0';
        return t.avatar
            ? '<img src="' + ui.escapeHtml(t.avatar) + '" alt="' + ui.escapeHtml(t.name || 'Avatar') + '" class="' + cls + '">'
            : '<span class="h-9 w-9 rounded-full bg-gray-100 flex-shrink-0 flex items-center justify-center text-sm font-semibold text-gray-500">' + initial + '</span>';
    }

    function renderTestimonials(items) {
        const tableBody = document.getElementById('testimonialsTableBody');
        const mobileList = document.getElementById('testimonialsMobileList');
        const list = Array.isArray(items) ? items : [];

        if (!list.length) {
            const empty = '<tr><td colspan="6" class="text-center py-8 text-gray-500"><i class="fas fa-quote-left text-4xl mb-2 block"></i>No testimonials found.</td></tr>';
            if (tableBody) tableBody.innerHTML = empty;
            if (mobileList) mobileList.innerHTML = '<div class="text-center py-8 text-gray-500">No testimonials found.</div>';
            return;
        }

        if (tableBody) {
            tableBody.innerHTML = list.map(function (t) {
                const id = ui.escapeHtml(t.id || '');
                const name = ui.escapeHtml(t.name || 'Unnamed');
                const text = ui.escapeHtml(t.text || '');
                const status = t.is_active
                    ? '<span class="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">Active</span>'
                    : '<span class="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">Hidden</span>';
                return '<tr>' +
                    '<td class="px-6 py-4">' + avatarThumb(t) + '</td>' +
                    '<td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">' + name + '</td>' +
                    '<td class="px-6 py-4 text-sm text-gray-600">' + text + '</td>' +
                    '<td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">' + t.position + '</td>' +
                    '<td class="px-6 py-4 whitespace-nowrap">' + status + '</td>' +
                    '<td class="px-6 py-4 whitespace-nowrap text-sm font-medium">' +
                        '<a class="text-indigo-600 hover:text-indigo-900 mr-3" href="/admin/edit-testimonial/' + id + '">Edit</a>' +
                        '<button class="text-red-600 hover:text-red-900" type="button" data-delete-testimonial-id="' + id + '">Delete</button>' +
                    '</td>' +
                '</tr>';
            }).join('');
        }

        if (mobileList) {
            mobileList.innerHTML = list.map(function (t) {
                const id = ui.escapeHtml(t.id || '');
                const name = ui.escapeHtml(t.name || 'Unnamed');
                const text = ui.escapeHtml(t.text || '');
                const status = t.is_active
                    ? '<span class="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">Active</span>'
                    : '<span class="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">Hidden</span>';
                return '<div class="mobile-card">' +
                    '<div class="mobile-card-header">' +
                        '<div class="flex items-center gap-3">' + avatarThumb(t) + '<div><h3 class="mobile-card-title">' + name + '</h3></div></div>' +
                        '<div class="text-xs text-gray-500 text-right">' + status + '</div>' +
                    '</div>' +
                    '<div class="mobile-card-body">' +
                        '<div class="mobile-card-row"><span class="mobile-card-label">Testimonial:</span><span class="mobile-card-value">' + text + '</span></div>' +
                        '<div class="mobile-card-row"><span class="mobile-card-label">Position:</span><span class="mobile-card-value">' + t.position + '</span></div>' +
                    '</div>' +
                    '<div class="mobile-card-actions">' +
                        '<a class="bg-indigo-600 text-white rounded hover:bg-indigo-700 transition-colors" href="/admin/edit-testimonial/' + id + '"><i class="fas fa-edit mr-1"></i>Edit</a>' +
                        '<button class="bg-red-600 text-white rounded hover:bg-red-700 transition-colors" type="button" data-delete-testimonial-id="' + id + '"><i class="fas fa-trash mr-1"></i>Delete</button>' +
                    '</div>' +
                '</div>';
            }).join('');
        }

        function wireDeleteHandlers() {
            document.querySelectorAll('[data-delete-testimonial-id]').forEach(function (btn) {
                if (btn.dataset.bound === '1') return;
                btn.dataset.bound = '1';
                btn.addEventListener('click', function () {
                    deleteTestimonial(btn.getAttribute('data-delete-testimonial-id') || '');
                });
            });
        }

        setTimeout(wireDeleteHandlers, 0);
    }

    window.deleteTestimonial = async function deleteTestimonial(id) {
        if (!id) return;
        if (!confirm('Are you sure you want to delete this testimonial?')) return;

        const btn = document.querySelector('[data-delete-testimonial-id="' + id + '"]');
        if (btn) { btn.disabled = true; btn.textContent = 'Deleting...'; }

        try {
            await ui.apiRequest('/api/testimonials/' + encodeURIComponent(id), {
                method: 'DELETE',
                credentials: 'include'
            });
            ui.showElement('testimonialsError', 'Testimonial deleted successfully!', 'mb-4 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700');
            setTimeout(() => { ui.hideElement('testimonialsError'); loadTestimonials(); }, 1000);
        } catch (error) {
            ui.showElement('testimonialsError', error.message || 'Failed to delete testimonial', 'mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700');
            setTimeout(() => ui.hideElement('testimonialsError'), 3000);
        } finally {
            if (btn) { btn.disabled = false; btn.textContent = 'Delete'; }
        }
    };
});