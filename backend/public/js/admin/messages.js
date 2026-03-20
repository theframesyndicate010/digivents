document.addEventListener('DOMContentLoaded', function () {
    const ui = window.AdminUI;

    loadMessages();

    async function loadMessages() {
        try {
            const result = await ui.apiRequest('/api/messages?perPage=100', { credentials: 'include' });
            const messages = (result.data && result.data.messages) || [];
            renderMessages(messages);
        } catch (error) {
            ui.showElement('messagesError', error.message || 'Failed to load messages');
            renderMessages([]);
        } finally {
            ui.hideElement('messagesLoading');
        }
    }

    function renderMessages(messages) {
        const tableBody = document.getElementById('messagesTableBody');
        const mobileList = document.getElementById('messagesMobileList');
        const items = Array.isArray(messages) ? messages : [];

        if (!items.length) {
            const empty = '<tr><td colspan="5" class="py-12 text-center text-gray-500"><i class="fas fa-envelope-open-text text-4xl mb-4 block"></i><p>No messages found.</p></td></tr>';
            if (tableBody) tableBody.innerHTML = empty;
            if (mobileList) mobileList.innerHTML = '<div class="text-center py-8 text-gray-500 rounded border border-gray-100"><p>No messages found.</p></div>';
            return;
        }

        if (tableBody) {
            tableBody.innerHTML = items.map(function (message) {
                const id = ui.escapeHtml(message.id || '');
                const name = ui.escapeHtml(message.name || 'Unknown');
                const email = ui.escapeHtml(message.email || '-');
                const text = ui.escapeHtml(message.message || '-');
                const nameEncoded = encodeURIComponent(message.name || 'Unknown');
                const messageEncoded = encodeURIComponent(message.message || '-');
                const status = String(message.status || 'new').toLowerCase();
                const readAction = status !== 'read'
                    ? '<button onclick="markAsRead(\'' + id + '\')" class="text-green-600 hover:text-green-900"><i class="fas fa-check"></i> Read</button>'
                    : '';

                return '<tr>' +
                    '<td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">' + ui.escapeHtml(ui.formatDate(message.created_at)) + '</td>' +
                    '<td class="px-6 py-4 whitespace-nowrap"><div class="text-sm font-medium text-gray-900">' + name + '</div></td>' +
                    '<td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500"><a href="mailto:' + email + '" class="text-blue-600 hover:text-blue-800">' + email + '</a></td>' +
                    '<td class="px-6 py-4 text-sm text-gray-700 max-w-xs"><p class="truncate" title="' + text + '">' + text + '</p><button class="text-blue-600 hover:text-blue-800 text-xs mt-1" onclick="viewMessage(decodeURIComponent(\'' + nameEncoded + '\'), decodeURIComponent(\'' + messageEncoded + '\'), \'' + email + '\')">Read More</button></td>' +
                    '<td class="px-6 py-4 whitespace-nowrap text-sm font-medium"><div class="flex flex-wrap gap-2 items-center">' + readAction + '<button class="text-red-600 hover:text-red-900" type="button" data-delete-message-id="' + id + '"><i class="fas fa-trash"></i> Delete</button></div></td>' +
                '</tr>';
            }).join('');
        }

        if (mobileList) {
            mobileList.innerHTML = items.map(function (message) {
                const id = ui.escapeHtml(message.id || '');
                const name = ui.escapeHtml(message.name || 'Unknown');
                const email = ui.escapeHtml(message.email || 'No email');
                const text = ui.escapeHtml(message.message || 'No message');
                const nameEncoded = encodeURIComponent(message.name || 'Unknown');
                const messageEncoded = encodeURIComponent(message.message || 'No message');
                const status = String(message.status || 'new').toLowerCase();
                const readAction = status !== 'read'
                    ? '<button class="text-green-600 text-sm font-medium" onclick="markAsRead(\'' + id + '\')">Read</button>'
                    : '';

                return '<div class="border border-gray-200 rounded-lg p-4 bg-white shadow-sm">' +
                    '<div class="flex justify-between items-start mb-2"><div><h4 class="font-medium text-gray-900">' + name + '</h4><a href="mailto:' + email + '" class="text-sm text-blue-600">' + email + '</a></div><span class="text-xs text-gray-500">' + ui.escapeHtml(ui.formatDate(message.created_at)) + '</span></div>' +
                    '<p class="text-sm text-gray-700 mt-2 line-clamp-2">' + text + '</p>' +
                    '<div class="mt-4 flex justify-between items-center gap-3"><button class="text-blue-600 text-sm font-medium" onclick="viewMessage(decodeURIComponent(\'' + nameEncoded + '\'), decodeURIComponent(\'' + messageEncoded + '\'))">Read Message</button><div class="flex items-center gap-2">' + readAction + '<button class="text-red-600 text-sm font-medium" type="button" data-delete-message-id="' + id + '">Delete</button></div></div>' +
                '</div>';
            }).join('');
        }
    }

    // Wire up delete handlers for message delete buttons
    function wireDeleteHandlers() {
        document.querySelectorAll('[data-delete-message-id]').forEach(function (btn) {
            if (btn.dataset.bound === '1') return;
            btn.dataset.bound = '1';
            btn.addEventListener('click', function () {
                const id = btn.getAttribute('data-delete-message-id') || '';
                if (!id) return;
                deleteContact(id);
            });
        });
    }

    setTimeout(wireDeleteHandlers, 0);

    window.deleteContact = async function deleteContact(id) {
        if (!confirm('Are you sure you want to delete this message?')) return;
        const btn = document.querySelector('[data-delete-message-id="' + id + '"]');
        if (btn) {
            btn.disabled = true;
            btn.textContent = 'Deleting...';
        }
        try {
            await ui.apiRequest('/api/messages/' + encodeURIComponent(id), {
                method: 'DELETE',
                credentials: 'include'
            });
            ui.showElement('messagesError', 'Message deleted successfully!', 'mb-4 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700');
            setTimeout(() => {
                ui.hideElement('messagesError');
                loadMessages();
            }, 1000);
        } catch (error) {
            ui.showElement('messagesError', error.message || 'Failed to delete message', 'mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700');
            setTimeout(() => ui.hideElement('messagesError'), 3000);
        } finally {
            if (btn) {
                btn.disabled = false;
                btn.textContent = 'Delete';
            }
        }
    };

    window.markAsRead = async function markAsRead(id) {
        try {
            await ui.apiRequest('/api/messages/' + encodeURIComponent(id), {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: 'read' }),
                credentials: 'include'
            });
            loadMessages();
        } catch (error) {
            ui.showElement('messagesError', error.message || 'Failed to mark as read');
        }
    };

    // Modal for viewing message details
    function ensureMessageModal() {
        if (document.getElementById('messageModal')) return;
        const modal = document.createElement('div');
        modal.id = 'messageModal';
        modal.className = 'fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 hidden';
        modal.innerHTML = `
            <div class="bg-white rounded-lg shadow-lg max-w-lg w-full p-6 relative">
                <button id="closeMessageModal" class="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-2xl">&times;</button>
                <h3 class="text-lg font-semibold mb-2" id="modalMessageName"></h3>
                <div class="mb-2 text-sm text-gray-500" id="modalMessageEmail"></div>
                <div class="mb-4 text-gray-700 whitespace-pre-line" id="modalMessageText"></div>
            </div>
        `;
        document.body.appendChild(modal);
        document.getElementById('closeMessageModal').onclick = hideMessageModal;
        modal.onclick = function(e) { if (e.target === modal) hideMessageModal(); };
    }

    function showMessageModal(name, email, message) {
        ensureMessageModal();
        document.getElementById('modalMessageName').textContent = name;
        document.getElementById('modalMessageEmail').textContent = email;
        document.getElementById('modalMessageText').textContent = message;
        document.getElementById('messageModal').classList.remove('hidden');
    }

    function hideMessageModal() {
        const modal = document.getElementById('messageModal');
        if (modal) modal.classList.add('hidden');
    }

    window.viewMessage = function viewMessage(name, message, email) {
        showMessageModal(name, email || '', message);
    };
});