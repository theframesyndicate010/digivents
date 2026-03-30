require('dotenv').config({ path: __dirname + '/.env' });
const express = require('express');
const path = require('path');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const rateLimit = require('express-rate-limit');
const app = express();

const PORT = process.env.PORT || 3000;

process.on('exit', (code) => {
    console.log(`About to exit with code: ${code}`);
});
process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception:', err);
});
process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});


// ============================================
// SECURITY MIDDLEWARE - Applied in order
// ============================================

// 1. CORS: Restrict to allowed origins only
const allowedOrigins = (process.env.ALLOWED_ORIGINS || 'http://localhost,http://localhost:3000/admin,http://163.47.151.246:3000/admin')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);

const normalizeOrigin = (origin) => {
    if (!origin) return '';
    const sanitized = origin.trim().toLowerCase();
    try {
        const parsed = new URL(sanitized);
        return `${parsed.protocol}//${parsed.host}`;
    } catch {
        // Fallback for non-URL strings.
        return sanitized.replace(/\/$/, '');
    }
};

const allowedOriginSet = new Set(allowedOrigins.map(normalizeOrigin));

const isLoopbackOrigin = (origin) => {
    try {
        const parsed = new URL(origin);
        return ['localhost', '127.0.0.1', '[::1]'].includes(parsed.hostname.toLowerCase());
    } catch {
        return false;
    }
};

const corsOptions = {
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin || origin === 'null') return callback(null, true);

        const normalizedOrigin = normalizeOrigin(origin);

        if (allowedOriginSet.has(normalizedOrigin)) {
            return callback(null, true);
        }

        // Allow localhost/loopback from any port for local access patterns.
        if (isLoopbackOrigin(origin)) {
            return callback(null, true);
        }

        // Block unknown origins without crashing request processing.
        return callback(null, false);
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
};
app.use(cors(corsOptions));

// 2. Rate Limiting: Prevent brute force attacks on auth endpoints
const loginLimiter = rateLimit({
    windowMs: parseInt(process.env.RATE_LIMIT_LOGIN_WINDOW) || 15 * 60 * 1000, // 15 minutes
    max: parseInt(process.env.RATE_LIMIT_LOGIN_MAX) || 5, // 5 attempts
    message: 'Too many login attempts from this IP, please try again after 15 minutes',
    standardHeaders: true, // Return info in `RateLimit-*` headers
    legacyHeaders: false, // Disable `X-RateLimit-*` headers
});

// Middleware
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static file serving with dual caching strategy
// 1. Upload directory with no caching (must be registered first)
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads'), {
    etag: false,
    lastModified: false,
    maxAge: 0,
    setHeaders: (res, filePath) => {
        res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
        res.setHeader('Pragma', 'no-cache');
        res.setHeader('Expires', '0');
    }
}));

// 2. General static files with caching enabled
app.use(express.static(path.join(__dirname, 'public'), {
    maxAge: '1h',
    etag: true
}));



// Set view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Routes
app.use('/auth/login', loginLimiter); // Apply rate limiting to login
app.use('/auth/verify-otp', loginLimiter); // Apply rate limiting to OTP verification
// Refactored Modular API Routes (Strangler Fig pattern: handles matching routes before falling back to old ones)
app.use('/api', require('./src/routes'));

app.use('/auth', require('./src/routes/auth.routes'));
app.use('/admin', require('./src/routes/admin.routes'));
// app.use('/api', require('./src/routes/legacyApi.routes'));

// Root route - redirect to admin (which will handle auth authentication)
app.get('/', (req, res) => {
    res.redirect('/admin');
});

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Centralized Error handler
const errorHandler = require('./src/middlewares/error.middleware');
app.use(errorHandler);

// 404 handler (Move to very end)
app.use((req, res) => {
    res.status(404).json({ error: 'Route not found' });
});

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}!`);
});