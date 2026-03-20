exports.getMessages = async (req, res) => {
    try {
        res.render('admin/contacts', {
            title: 'Messages',
            currentPage: 'contacts',
            user: req.user
        });

    } catch (error) {
        console.error('[MESSAGES] Error:', error.message);
        res.render('admin/contacts', {
            title: 'Messages',
            currentPage: 'contacts',
            user: req.user,
            error: 'Failed to load messages'
        });
    }
};
