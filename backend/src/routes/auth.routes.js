const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Wrapper to catch async errors
const asyncHandler = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};

// Admin login page
router.get('/login', (req, res) => {
    res.render('admin/login', { 
        title: 'Login',
        message: null,
        error: null 
    });
});

// Existing endpoints
router.post('/login', asyncHandler(authController.login));
router.get('/logout', asyncHandler(authController.logout));
router.post('/logout', asyncHandler(authController.logout));
router.post('/refresh', asyncHandler(authController.refreshToken));

module.exports = router;
