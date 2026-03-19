const jwt = require('jsonwebtoken');

/**
 * Authentication Middleware
 * Checks if user has valid JWT token from cookies or Authorization header
 * If not authenticated, renders login form
 * If authenticated, attaches user data to req.user and proceeds
 */
const authMiddleware = (req, res, next) => {
    try {
        // Get token from cookies or Authorization header
        let token = req.cookies?.accessToken;
        
        // If no token in cookies, try Authorization header
        if (!token) {
            const authHeader = req.headers.authorization;
            if (authHeader && authHeader.startsWith('Bearer ')) {
                token = authHeader.substring(7);
            }
        }

        // If no token found, show login form
        if (!token) {
            return res.render('admin/login', { 
                title: 'Login',
                message: null,
                error: null 
            });
        }

        // Verify JWT token
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET || 'access_secret_123');
        
        // Attach user data to request object
        req.user = decoded;
        req.token = token;
        
        // User is authenticated, proceed to next middleware
        next();

    } catch (error) {
        console.error('Auth Middleware Error:', error.message);
        
        // If token is expired or invalid, show login form
        return res.render('admin/login', { 
            title: 'Login',
            message: null,
            error: 'Session expired. Please login again.' 
        });
    }
};

module.exports = authMiddleware;
