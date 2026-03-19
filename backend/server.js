require('dotenv').config({ path: __dirname + '/.env' });
const express = require('express');
const path = require('path');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
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

// 1. Helmet: Security Headers (XSS, CSRF, Clickjacking protection)
app.use(helmet());

// 2. CORS: Restrict to allowed origins only
const allowedOrigins = (process.env.ALLOWED_ORIGINS || 'http://localhost,http://localhost:3000,http://localhost:80').split(',');
const corsOptions = {
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);
        
        if (allowedOrigins.includes(origin)) {
    callback(null, true);
    } else {
        callback(new Error("Not allowed by CORS"));
    }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
};
app.use(cors(corsOptions));

// 3. Rate Limiting: Prevent brute force attacks on auth endpoints
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
app.use(express.static(path.join(__dirname, 'public')));



// Set view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Routes
app.use('/auth/login', loginLimiter); // Apply rate limiting to login
app.use('/auth/verify-otp', loginLimiter); // Apply rate limiting to OTP verification
app.use('/auth', require('./api/routes/auth'));
app.use('/admin', require('./api/routes/admin'));
app.use('/api', require('./api/routes/api'));

// Root route - redirect to admin (which will handle auth authentication)
app.get('/', (req, res) => {
    res.redirect('/admin');
});

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ error: 'Route not found' });
});

// Error handler
app.use((err, req, res, next) => {
    console.error('[ERROR]', err.stack || err);
    const message = err.message || 'Something went wrong!';
    
    res.status(500).json({ 
        error: message,
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
});

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}!`);
});