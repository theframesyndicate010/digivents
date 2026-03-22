const jwt = require('jsonwebtoken');

// Pure API middleware (returns JSON, no rendering)
exports.requireApiAdmin = (req, res, next) => {
    try {
        let token = req.cookies?.accessToken;
        if (!token) {
            const auth = req.headers.authorization;
            if (auth && auth.startsWith('Bearer ')) {
                token = auth.slice(7);
            }
        }

        if (!token) {
            return res.status(401).json({ success: false, message: 'Authentication required' });
        }

        const secret = process.env.ACCESS_TOKEN_SECRET;
        if (!secret) {
            return res.status(500).json({ success: false, message: 'Server authentication not configured' });
        }
        const decoded = jwt.verify(token, secret);
        
        if (!decoded || decoded.role !== 'admin') {
            return res.status(403).json({ success: false, message: 'Admin privileges required' });
        }

        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ success: false, message: 'Invalid or expired token', error: error.message });
    }
};

// SSR middleware for Admin Panel (renders login page if unauthenticated)
exports.requireWebAdmin = (req, res, next) => {
    try {
        let token = req.cookies?.accessToken;
        if (!token) {
            const auth = req.headers.authorization;
            if (auth && auth.startsWith('Bearer ')) {
                token = auth.substring(7);
            }
        }

        if (!token) {
            return res.render('admin/login', { title: 'Login', message: null, error: null });
        }

        const secret = process.env.ACCESS_TOKEN_SECRET;
        if (!secret) {
            return res.render('admin/login', { title: 'Login', message: null, error: 'Server authentication not configured' });
        }
        const decoded = jwt.verify(token, secret);
        req.user = decoded;
        req.token = token;
        next();
    } catch (error) {
        return res.render('admin/login', { title: 'Login', message: null, error: 'Session expired. Please login again.' });
    }
};
