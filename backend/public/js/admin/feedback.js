document.addEventListener('DOMContentLoaded', function () {
    const ui = window.AdminUI;

    window.loadFeedback = loadFeedback;
    window.approveFeedback = approveFeedback;
    window.deleteFeedback = removeFeedback;

    loadFeedback();

    function renderStars(rating) {
        const value = Number(rating) || 0;
        let stars = '';
        for (let i = 1; i <= 5; i += 1) {
            stars += i <= value
                ? '<i class="fas fa-star text-sm"></i>'
                : '<i class="far fa-star text-sm"></i>';
        }
        return stars;
    }

    function statusBadge(status) {
        const normalized = String(status || 'pending').toLowerCase();
        if (normalized === 'approved') {
            return '<span class="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">Approved</span>';
        }
        if (normalized === 'rejected') {
            return '<span class="px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full">Rejected</span>';
        }
        return '<span class="px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full">Pending</span>';
    }

    function renderFeedback(items) {
        const list = document.getElementById('feedbackList');
        const empty = document.getElementById('feedbackEmpty');
        if (!list || !empty) return;

        if (!Array.isArray(items) || !items.length) {
            list.innerHTML = '';
            empty.classList.remove('hidden');
            return;
        }

        empty.classList.add('hidden');
        list.innerHTML = items.map(function (item) {
            const id = Number(item.id);
            const name = ui.escapeHtml(item.name || 'Anonymous');
            const message = ui.escapeHtml(item.message || '');
            const date = ui.escapeHtml(ui.formatDate(item.created_at));

            return '<div class="border border-gray-200 rounded-lg p-4 md:p-6">' +
                '<div class="flex flex-col md:flex-row md:items-start md:justify-between gap-4">' +
                    '<div class="flex items-start space-x-3 md:space-x-4 flex-1">' +
                        '<div class="w-10 h-10 md:w-12 md:h-12 bg-gray-300 rounded-full flex items-center justify-center flex-shrink-0"><i class="fas fa-user text-gray-600"></i></div>' +
                        '<div class="flex-1 min-w-0">' +
                            '<div class="flex flex-col sm:flex-row sm:items-center gap-2 mb-2"><h4 class="font-semibold text-gray-900">' + name + '</h4><div class="flex text-yellow-400">' + renderStars(item.rating) + '</div>' + statusBadge(item.status) + '</div>' +
                            '<p class="text-sm text-gray-500 mb-2">' + date + '</p>' +
                            '<p class="text-sm md:text-base text-gray-700">' + message + '</p>' +
                        '</div>' +
                    '</div>' +
                    '<div class="flex gap-2 md:flex-col md:space-y-2 md:ml-4">' +
                        '<button class="flex-1 md:flex-none text-green-600 hover:text-green-800 px-3 py-2 border border-green-600 rounded md:border-0" onclick="approveFeedback(' + id + ')"><i class="fas fa-check mr-1 md:mr-0"></i><span class="md:hidden">Approve</span></button>' +
                        '<button class="flex-1 md:flex-none text-red-600 hover:text-red-800 px-3 py-2 border border-red-600 rounded md:border-0" onclick="deleteFeedback(' + id + ')"><i class="fas fa-trash mr-1 md:mr-0"></i><span class="md:hidden">Delete</span></button>' +
                    '</div>' +
                '</div>' +
            '</div>';
        }).join('');
    }

    async function loadFeedback() {
        try {
            const result = await ui.apiRequest('/api/feedback', { credentials: 'include' });
            renderFeedback(result.data || []);
            ui.hideElement('feedbackError');
        } catch (error) {
            ui.showElement('feedbackError', error.message || 'Failed to load feedback');
            renderFeedback([]);
        } finally {
            ui.hideElement('feedbackLoading');
        }
    }

    async function approveFeedback(id) {
        try {
            await ui.apiRequest('/api/feedback/' + encodeURIComponent(id), {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: 'approved' }),
                credentials: 'include'
            });
            loadFeedback();
        } catch (error) {
            ui.showElement('feedbackError', error.message || 'Failed to approve feedback');
        }
    }

    async function removeFeedback(id) {
        if (!confirm('Delete this feedback?')) return;
        try {
            await ui.apiRequest('/api/feedback/' + encodeURIComponent(id), {
                method: 'DELETE',
                credentials: 'include'
            });
            loadFeedback();
        } catch (error) {
            ui.showElement('feedbackError', error.message || 'Failed to delete feedback');
        }
    }
});
