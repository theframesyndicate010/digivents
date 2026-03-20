// Get dashboard statistics
exports.getDashboard = async (req, res) => {
    try {
        res.render('admin/dashboard', {
            title: 'Dashboard',
            currentPage: 'dashboard',
            user: req.user
        });

    } catch (error) {
        console.error('[DASHBOARD] Error:', error.message);
        res.render('admin/dashboard', {
            title: 'Dashboard',
            currentPage: 'dashboard',
            user: req.user,
            error: 'Failed to load dashboard data'
        });
    }
};
