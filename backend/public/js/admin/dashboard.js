document.addEventListener('DOMContentLoaded', async function () {
    const ui = window.AdminUI;

    try {
        const statsRes = await ui.apiRequest('/api/admin/stats', { credentials: 'include' });
        const stats = statsRes.data || {};
        ui.setElementText('stats-projects', stats.projects || 0);
        ui.setElementText('stats-clients', stats.clients || 0);
        ui.setElementText('stats-creators', stats.creators || 0);
        ui.setElementText('stats-messages', stats.messages || 0);

        const [projectsRes, messagesRes] = await Promise.all([
            ui.apiRequest('/api/projects', { credentials: 'include' }),
            ui.apiRequest('/api/messages?perPage=5', { credentials: 'include' })
        ]);

        renderRecentProjects(projectsRes.data || []);
        renderRecentMessages((messagesRes.data && messagesRes.data.messages) || []);
    } catch (error) {
        ui.showElement('dashboardError', error.message || 'Failed to load dashboard data');
        ui.setElementText('stats-projects', 0);
        ui.setElementText('stats-clients', 0);
        ui.setElementText('stats-creators', 0);
        ui.setElementText('stats-messages', 0);
    } finally {
        ui.hideElement('recentProjectsLoading');
        ui.hideElement('recentMessagesLoading');
    }

    function statusClass(status) {
        const normalized = String(status || 'active').toLowerCase();
        if (normalized === 'completed') return 'bg-blue-100 text-blue-800';
        if (normalized === 'pending') return 'bg-gray-100 text-gray-800';
        if (normalized === 'in-progress') return 'bg-yellow-100 text-yellow-800';
        return 'bg-green-100 text-green-800';
    }

    function renderRecentProjects(projects) {
        const container = document.getElementById('recentProjectsList');
        if (!container) return;
        const list = (projects || []).slice(0, 5);
        if (!list.length) {
            container.innerHTML = '<p class="text-gray-500 text-center py-8">No projects yet.</p>';
            return;
        }

        container.innerHTML = list.map(function (project) {
            const name = ui.escapeHtml(project.name || 'Untitled');
            const tag = ui.escapeHtml(project.tag || 'No tag');
            const status = ui.escapeHtml(project.status || 'active');
            const statusLabel = status.charAt(0).toUpperCase() + status.slice(1);
            return '<div class="flex items-center justify-between gap-3">' +
                '<div>' +
                    '<p class="font-medium text-gray-900">' + name + '</p>' +
                    '<p class="text-sm text-gray-500">' + tag + '</p>' +
                '</div>' +
                '<span class="px-2 py-1 text-xs font-medium rounded-full ' + statusClass(status) + '">' + statusLabel + '</span>' +
            '</div>';
        }).join('');
    }

    function renderRecentMessages(messages) {
        const container = document.getElementById('recentMessagesList');
        if (!container) return;
        const list = (messages || []).slice(0, 5);
        if (!list.length) {
            container.innerHTML = '<p class="text-gray-500 text-center py-8">No messages yet.</p>';
            return;
        }

        container.innerHTML = list.map(function (message) {
            const name = ui.escapeHtml(message.name || 'Anonymous');
            const preview = ui.escapeHtml(message.subject || message.message || 'No message');
            const date = ui.escapeHtml(ui.formatDate(message.created_at));

            return '<div class="flex items-start space-x-3">' +
                '<div class="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center flex-shrink-0">' +
                    '<i class="fas fa-user text-gray-600 text-sm"></i>' +
                '</div>' +
                '<div class="flex-1 min-w-0">' +
                    '<p class="font-medium text-gray-900">' + name + '</p>' +
                    '<p class="text-sm text-gray-600 truncate">' + preview + '</p>' +
                    '<p class="text-xs text-gray-500 mt-1">' + date + '</p>' +
                '</div>' +
            '</div>';
        }).join('');
    }
});
