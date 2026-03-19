const db = require('../config/db');

// Helper function to get status badge color
function getStatusColor(status) {
    const colors = {
        'new': 'bg-blue-100 text-blue-800',
        'read': 'bg-gray-100 text-gray-800',
        'replied': 'bg-green-100 text-green-800',
        'archived': 'bg-yellow-100 text-yellow-800'
    };
    return colors[(status || 'new').toLowerCase()] || 'bg-gray-100 text-gray-800';
}

// Helper function to format date
function formatDate(dateString) {
    if (!dateString) return 'Recently';
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    
    if (diffMins < 60) return diffMins === 0 ? 'Just now' : diffMins + ' min ago';
    if (diffHours < 24) return diffHours + ' hour' + (diffHours > 1 ? 's' : '') + ' ago';
    if (diffDays < 7) return diffDays + ' day' + (diffDays > 1 ? 's' : '') + ' ago';
    
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

// Get all messages with pagination
exports.getMessages = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const perPage = 10;
        const offset = (page - 1) * perPage;

        console.log('[MESSAGES] Fetching messages, page:', page);

        // Get total count
        const countResult = await db('contacts').count('* as count').first();
        const total = countResult.count || 0;
        const totalPages = Math.ceil(total / perPage);

        // Get paginated messages
        const messages = await db('contacts')
            .select('*')
            .orderBy('created_at', 'desc')
            .limit(perPage)
            .offset(offset);

        // Format messages with relative times and status colors
        const formattedMessages = (messages || []).map(msg => ({
            ...msg,
            relativeTime: formatDate(msg.created_at),
            statusColor: getStatusColor(msg.status),
            statusDisplay: (msg.status || 'new').charAt(0).toUpperCase() + (msg.status || 'new').slice(1),
            messagePreview: msg.message ? msg.message.substring(0, 150) + (msg.message.length > 150 ? '...' : '') : 'No message'
        }));

        console.log('[MESSAGES] Found', messages.length, 'messages');

        res.render('admin/contacts', {
            title: 'Messages',
            currentPage: 'contacts',
            user: req.user,
            messages: formattedMessages,
            pagination: {
                page,
                perPage,
                total,
                totalPages,
                hasNextPage: page < totalPages,
                hasPrevPage: page > 1
            }
        });

    } catch (error) {
        console.error('[MESSAGES] Error:', error.message);
        res.render('admin/contacts', {
            title: 'Messages',
            currentPage: 'contacts',
            user: req.user,
            messages: [],
            pagination: {
                page: 1,
                perPage: 10,
                total: 0,
                totalPages: 0,
                hasNextPage: false,
                hasPrevPage: false
            },
            error: 'Failed to load messages'
        });
    }
};
