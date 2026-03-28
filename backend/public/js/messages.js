document.addEventListener('DOMContentLoaded', () => {
    fetchMessages();
});

async function fetchMessages() {
    const loading = document.getElementById('messagesLoading');
    const errorDiv = document.getElementById('messagesError');
    const tableBody = document.getElementById('messagesTableBody');
    const mobileList = document.getElementById('messagesMobileList');

    try {
        if (loading) loading.classList.remove('hidden');
        if (errorDiv) errorDiv.classList.add('hidden');

        const response = await fetch('/api/messages');
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Failed to fetch messages');
        }

        const messages = data.data.messages || [];
        
        if (loading) loading.classList.add('hidden');

        if (messages.length === 0) {
            if (tableBody) tableBody.innerHTML = '<tr><td colspan="5" class="px-6 py-4 text-center text-sm text-gray-500">No messages found</td></tr>';
            if (mobileList) mobileList.innerHTML = '<p class="text-center text-gray-500">No messages found</p>';
            return;
        }

        renderMessages(messages);
    } catch (error) {
        console.error('Fetch error:', error);
        if (loading) loading.classList.add('hidden');
        if (errorDiv) {
            errorDiv.textContent = error.message;
            errorDiv.classList.remove('hidden');
        }
    }
}

function renderMessages(messages) {
    const tableBody = document.getElementById('messagesTableBody');
    const mobileList = document.getElementById('messagesMobileList');

    if (tableBody) {
        tableBody.innerHTML = messages.map(msg => `
            <tr>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    ${new Date(msg.created_at).toLocaleDateString()}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    ${msg.name || (msg.first_name + ' ' + msg.last_name)}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    ${msg.email}
                </td>
                <td class="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                    ${msg.message}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button class="view-message-btn text-blue-600 hover:text-blue-900 mr-3" data-message-id="${msg.id}">View</button>
                    <button class="delete-message-btn text-red-600 hover:text-red-900" data-message-id="${msg.id}">Delete</button>
                </td>
            </tr>
        `).join('');
    }

    if (mobileList) {
        mobileList.innerHTML = messages.map(msg => {
            const name = msg.name || (msg.first_name + ' ' + msg.last_name);
            const date = new Date(msg.created_at).toLocaleDateString();
            const message = msg.message || '';
            return `
                <div class="mobile-card">
                    <div class="mobile-card-header">
                        <div>
                            <h3 class="mobile-card-title">${name}</h3>
                            <div class="text-xs text-gray-500 mt-1">${msg.email}</div>
                        </div>
                        <div class="text-xs text-gray-500 text-right">${date}</div>
                    </div>
                    <div class="mobile-card-body">
                        <div class="text-sm text-gray-600 line-clamp-3">${message}</div>
                    </div>
                    <div class="mobile-card-actions">
                        <button class="view-message-btn bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors" data-message-id="${msg.id}"><i class="fas fa-eye mr-1"></i>View</button>
                        <button class="delete-message-btn bg-red-600 text-white rounded hover:bg-red-700 transition-colors" data-message-id="${msg.id}"><i class="fas fa-trash mr-1"></i>Delete</button>
                    </div>
                </div>
            `;
        }).join('');
    }

    // Attach event listeners after rendering
    attachMessageEventListeners();
}

function attachMessageEventListeners() {
    // View message buttons
    document.querySelectorAll('.view-message-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const id = this.getAttribute('data-message-id');
            viewMessage(id);
        });
    });

    // Delete message buttons
    document.querySelectorAll('.delete-message-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const id = this.getAttribute('data-message-id');
            deleteMessage(id);
        });
    });
}

async function deleteMessage(id) {
    if (!confirm('Are you sure you want to delete this message?')) return;

    try {
        const response = await fetch(`/api/messages/${id}`, { method: 'DELETE' });
        const data = await response.json();

        if (!response.ok) throw new Error(data.message || 'Failed to delete');

        alert('Message deleted successfully');
        fetchMessages();
    } catch (error) {
        alert(error.message);
    }
}

function viewMessage(id) {
    // Basic view logic - could be improved with a modal
    alert('View message feature coming soon. ID: ' + id);
}
