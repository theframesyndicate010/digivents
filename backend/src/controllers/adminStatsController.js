const adminStatsService = require('../services/adminStatsService');
const { successResponse } = require('../utils/apiResponse');

class AdminStatsController {
    async getAdminStats(req, res, next) {
        try {
            const stats = await adminStatsService.getAdminStats();
            return successResponse(res, 'Admin stats retrieved successfully', stats);
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new AdminStatsController();

