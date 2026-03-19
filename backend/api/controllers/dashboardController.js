const db = require('../config/db');

// Helper function to get relative time
function getRelativeTime(date) {
    if (!date) return 'Recently';
    const now = new Date();
    const then = new Date(date);
    const diffMs = now - then;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    
    if (diffMins < 60) return diffMins === 0 ? 'Just now' : diffMins + ' min ago';
    if (diffHours < 24) return diffHours + ' hour' + (diffHours > 1 ? 's' : '') + ' ago';
    if (diffDays < 7) return diffDays + ' day' + (diffDays > 1 ? 's' : '') + ' ago';
    return then.toLocaleDateString();
}

// Helper function to get status colors
function getStatusColor(status) {
    const colors = {
        'active': 'bg-green-100 text-green-800',
        'in-progress': 'bg-yellow-100 text-yellow-800',
        'completed': 'bg-blue-100 text-blue-800',
        'pending': 'bg-gray-100 text-gray-800',
        'new': 'bg-purple-100 text-purple-800'
    };
    return colors[(status || '').toLowerCase()] || 'bg-gray-100 text-gray-800';
}

// Get dashboard statistics
exports.getDashboard = async (req, res) => {
    try {
        console.log('[DASHBOARD] Fetching dashboard data...');
        
        // Fetch counts from database
        const [
            projectsCount,
            clientsCount,
            feedbackCount,
            contactsCount,
            recentProjects,
            recentMessages
        ] = await Promise.all([
            db('projects').count('* as count').first(),
            db('clients').count('* as count').first(),
            db('feedback').count('* as count').first(),
            db('contacts').count('* as count').first(),
            db('projects').orderBy('updated_at', 'desc').limit(5),
            db('contacts').orderBy('created_at', 'desc').limit(5)
        ]);

        console.log('[DASHBOARD] Counts:', {
            projects: projectsCount.count,
            clients: clientsCount.count,
            feedback: feedbackCount.count,
            contacts: contactsCount.count
        });

        // Format recent projects with relative times and colors
        const formattedProjects = (recentProjects || []).map(project => ({
            ...project,
            relativeTime: getRelativeTime(project.updated_at),
            statusDisplay: (project.status || 'active').charAt(0).toUpperCase() + (project.status || 'active').slice(1),
            statusColor: getStatusColor(project.status)
        }));

        // Format recent messages with relative times
        const formattedMessages = (recentMessages || []).map(message => ({
            ...message,
            relativeTime: getRelativeTime(message.created_at)
        }));

        res.render('admin/dashboard', {
            title: 'Dashboard',
            currentPage: 'dashboard',
            user: req.user,
            stats: {
                projects: parseInt(projectsCount.count) || 0,
                clients: parseInt(clientsCount.count) || 0,
                feedback: parseInt(feedbackCount.count) || 0,
                contacts: parseInt(contactsCount.count) || 0
            },
            recentProjects: formattedProjects,
            recentMessages: formattedMessages
        });

    } catch (error) {
        console.error('[DASHBOARD] Error:', error.message);
        res.render('admin/dashboard', {
            title: 'Dashboard',
            currentPage: 'dashboard',
            user: req.user,
            stats: {
                projects: 0,
                clients: 0,
                feedback: 0,
                contacts: 0
            },
            recentProjects: [],
            recentMessages: [],
            error: 'Failed to load dashboard data'
        });
    }
};
