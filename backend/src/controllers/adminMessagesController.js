// Controller for rendering admin messages page
exports.renderMessagesPage = async (req, res) => {
    try {
        res.render('admin/messages', {
            title: 'Messages',
            currentPage: 'messages',
            user: req.user || null
        });
    } catch (error) {
        console.error('[ADMIN MESSAGE ERROR]', error);
        res.status(500).send('Failed to load messages page');
    }
};