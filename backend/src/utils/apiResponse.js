// Utility for consistent success responses
exports.successResponse = (res, message, data = {}, statusCode = 200) => {
    return res.status(statusCode).json({
        success: true,
        message,
        data
    });
};

// Utility for consistent error responses
exports.errorResponse = (res, message, error = null, statusCode = 500) => {
    if (error) {
        console.error(`[ERROR] ${message}`, error);
    }
    return res.status(statusCode).json({
        success: false,
        message,
        data: null
    });
};
