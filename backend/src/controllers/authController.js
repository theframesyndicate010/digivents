const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const db = require('../config/db');

// SECURITY: These MUST be set in environment variables - never use defaults
const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;

// Validate secrets are configured at startup
if (!ACCESS_TOKEN_SECRET || !REFRESH_TOKEN_SECRET) {
    throw new Error('CRITICAL: ACCESS_TOKEN_SECRET and REFRESH_TOKEN_SECRET must be set in environment variables');
}

const shouldUseSecureCookies = (req) => {
    if (process.env.COOKIE_SECURE === 'true') return true;
    if (process.env.COOKIE_SECURE === 'false') return false;

    const forwardedProto = req.headers['x-forwarded-proto'];
    const isHttpsViaProxy = typeof forwardedProto === 'string' && forwardedProto.includes('https');
    return process.env.NODE_ENV === 'production' && (req.secure || isHttpsViaProxy);
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const isFormSubmission = req.headers['content-type']?.includes('application/x-www-form-urlencoded');
        
        console.log(`[LOGIN] Attempt: ${email}, Form submission: ${isFormSubmission}`);

        // Validate input
        if (!email || !password) {
            console.log('[LOGIN] Missing email or password');
            if (isFormSubmission) {
                return res.render('admin/login', { 
                    title: 'Login',
                    message: null,
                    error: 'Email and password are required'
                });
            }
            return res.status(400).json({ message: 'Email and password are required' });
        }

        // 1. Find user
        console.log(`[LOGIN] Querying database for user: ${email}`);
        const user = await db('users').where({ email }).first();
        
        if (!user) {
            console.log(`[LOGIN] User not found: ${email}`);
            // Check if this is a form submission
            if (isFormSubmission) {
                return res.render('admin/login', { 
                    title: 'Login',
                    message: null,
                    error: 'Invalid email or password' 
                });
            }
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        console.log(`[LOGIN] User found, verifying password`);
        // 2. Verify password
        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (!isMatch) {
            console.log(`[LOGIN] Password mismatch for: ${email}`);
            if (isFormSubmission) {
                return res.render('admin/login', { 
                    title: 'Login',
                    message: null,
                    error: 'Invalid email or password' 
                });
            }
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        
        console.log(`[LOGIN] Password verified for: ${email}`);

        // 3. Generate Tokens
        // Access Token (15 mins)
        const accessToken = jwt.sign(
            { id: user.id, email: user.email, role: user.role },
            ACCESS_TOKEN_SECRET,
            { expiresIn: '15m' }
        );
        console.log(`[LOGIN] Access token generated`);

        // Refresh Token (7 days) - We use a random string for better security/revocation
        const refreshToken = crypto.randomBytes(40).toString('hex');
        
        // Hash the refresh token before storing
        const refreshTokenHash = crypto
            .createHash('sha256')
            .update(refreshToken)
            .digest('hex');

        // 4. Store session in DB (OPTIONAL - can fail without breaking login)
        const userAgent = req.headers['user-agent'] || 'Unknown';
        const ipAddress = req.ip || req.connection.remoteAddress;
        const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
        
        console.log(`[LOGIN] Inserting session record for user ${user.id}`);
        try {
            await db('sessions').insert({
                user_id: user.id,
                refresh_token_hash: refreshTokenHash,
                user_agent: userAgent,
                ip_address: ipAddress,
                expires_at: expiresAt
            });
            console.log(`[LOGIN] Session inserted successfully`);
        } catch (sessionError) {
            console.warn(`[LOGIN] Session insert error (non-critical):`, sessionError.message);
            // Continue anyway - session storage failure shouldn't prevent login
        }

        // 5. Send Response with Cookies
        console.log(`[LOGIN] Setting cookies and preparing response`);
        const secureCookies = shouldUseSecureCookies(req);
        res.cookie('accessToken', accessToken, {
            httpOnly: true,
            secure: secureCookies,
            sameSite: 'strict',
            maxAge: 15 * 60 * 1000 // 15 minutes
        });

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: secureCookies,
            sameSite: 'strict', // Protects against CSRF
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });

        // Check if this is a form submission (from admin panel login form)
        if (req.headers['content-type']?.includes('application/x-www-form-urlencoded')) {
            console.log(`[LOGIN] Form submission detected, redirecting to /admin`);
            // Redirect to admin dashboard
            return res.redirect('/admin');
        }

        console.log(`[LOGIN] Sending JSON response for ${email}`);
        // Otherwise return JSON (for API/frontend)
        res.json({
            success: true,
            accessToken,
            user: {
                id: user.id,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {
        console.error('[LOGIN] ERROR:', error.message, error.stack);
        
        // Check if this is a form submission
        const isFormSubmission = req.headers['content-type']?.includes('application/x-www-form-urlencoded');
        if (isFormSubmission) {
            return res.render('admin/login', { 
                title: 'Login',
                message: null,
                error: 'An error occurred during login. Please try again.' 
            });
        }
        
        res.status(500).json({ message: 'Server error during login' });
    }
};

exports.logout = async (req, res) => {
    try {
        const { refreshToken } = req.cookies;

        if (refreshToken) {
            // Hash the token to find it in DB
            const refreshTokenHash = crypto
                .createHash('sha256')
                .update(refreshToken)
                .digest('hex');

            // Delete the specific session
            // Note: In a real app, you might just mark is_revoked=true
            await db('sessions')
                .where({ refresh_token_hash: refreshTokenHash })
                .del();
        }

        // Clear cookies
        const secureCookies = shouldUseSecureCookies(req);
        res.clearCookie('accessToken', {
            httpOnly: true,
            secure: secureCookies,
            sameSite: 'strict'
        });

        res.clearCookie('refreshToken', {
            httpOnly: true,
            secure: secureCookies,
            sameSite: 'strict'
        });

        // Check if this is a form submission (browser request) or API request
        if (req.headers.accept?.includes('text/html')) {
            // Redirect to login page for browser requests
            return res.redirect('/admin/login');
        }

        res.json({ success: true, message: 'Logged out successfully' });

    } catch (error) {
        console.error('Logout error:', error);
        
        // Still redirect/respond even if there was an error
        if (req.headers.accept?.includes('text/html')) {
            return res.redirect('/admin/login');
        }
        
        res.status(500).json({ message: 'Server error during logout' });
    }
};

exports.refreshToken = async (req, res) => {
    try {
        const { refreshToken } = req.cookies;
        
        if (!refreshToken) {
            return res.status(401).json({ message: 'No refresh token provided' });
        }

        const refreshTokenHash = crypto
            .createHash('sha256')
            .update(refreshToken)
            .digest('hex');

        // Find session
        const session = await db('sessions')
            .where({ refresh_token_hash: refreshTokenHash })
            .andWhere('expires_at', '>', new Date())
            .andWhere({ is_revoked: false })
            .first();

        if (!session) {
            // Potential reuse attack or expired -> Clear cookie
            res.clearCookie('refreshToken');
            return res.status(403).json({ message: 'Invalid or expired session' });
        }

        // Find user
        const user = await db('users').where({ id: session.user_id }).first();
        if (!user) {
            return res.status(403).json({ message: 'User not found' });
        }

        // Generate new Access Token
        const newAccessToken = jwt.sign(
            { id: user.id, email: user.email, role: user.role },
            ACCESS_TOKEN_SECRET,
            { expiresIn: '15m' }
        );

        // Optional: Implement Token Rotation here (Issue new Refresh Token)
        // For this basic implementation, we just update last_used_at
        await db('sessions')
            .where({ id: session.id })
            .update({ last_used_at: db.fn.now() });

        res.json({ accessToken: newAccessToken });

    } catch (error) {
        console.error('Refresh token error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

