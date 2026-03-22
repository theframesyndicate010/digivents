const adminStatsService = require('../services/adminStatsService');
const { successResponse } = require('../utils/apiResponse');

exports.getAdminStats = async (req, res, next) => {
    try {
        const stats = await adminStatsService.getAdminStats();
        return successResponse(res, 'Admin stats retrieved successfully', stats);
    } catch (error) {
        next(error);
    }
};
