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
					'<td class="px-6 py-4 text-sm text-gray-700 max-w-xs"><p class="truncate" title="' + text + '">' + text + '</p><button class="text-blue-600 hover:text-blue-800 text-xs mt-1" onclick="viewMessage(decodeURIComponent(\'' + nameEncoded + '\'), decodeURIComponent(\'' + messageEncoded + '\'))">Read More</button></td>' +
					'<td class="px-6 py-4 whitespace-nowrap text-sm font-medium"><div class="flex flex-wrap gap-2 items-center">' + readAction + '<button onclick="deleteContact(\'' + id + '\')" class="text-red-600 hover:text-red-900"><i class="fas fa-trash"></i> Delete</button></div></td>' +
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
					'<div class="mt-4 flex justify-between items-center gap-3"><button class="text-blue-600 text-sm font-medium" onclick="viewMessage(decodeURIComponent(\'' + nameEncoded + '\'), decodeURIComponent(\'' + messageEncoded + '\'))">Read Message</button><div class="flex items-center gap-2">' + readAction + '<button class="text-red-600 text-sm font-medium" onclick="deleteContact(\'' + id + '\')">Delete</button></div></div>' +
				'</div>';
			}).join('');
		}
	}

	window.deleteContact = async function deleteContact(id) {
		if (!confirm('Are you sure you want to delete this message?')) return;
		try {
			await ui.apiRequest('/api/messages/' + encodeURIComponent(id), {
				method: 'DELETE',
				credentials: 'include'
			});
			loadMessages();
		} catch (error) {
			ui.showElement('messagesError', error.message || 'Failed to delete message');
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

	window.viewMessage = function viewMessage(name, message) {
		alert('Message from ' + name + ':\n\n' + message);
	};
});
