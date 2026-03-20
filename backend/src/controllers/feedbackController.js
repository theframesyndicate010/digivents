const feedbackService = require('../services/feedbackService');
const { successResponse } = require('../utils/apiResponse');

class FeedbackController {
    async getFeedback(req, res, next) {
        try {
            const result = await feedbackService.getAllFeedback();
            return successResponse(res, 'Feedback retrieved successfully', result);
        } catch (error) {
            next(error);
        }
    }

    async createFeedback(req, res, next) {
        try {
            const { name, message } = req.body;
            if (!name || !message) {
                return res.status(400).json({
                    success: false,
                    message: 'Name and message are required',
                    data: null
                });
            }
            
            const result = await feedbackService.createFeedback(req.body);
            return successResponse(res, 'Feedback submitted successfully', result, 201);
        } catch (error) {
            next(error);
        }
    }

    async updateFeedback(req, res, next) {
        try {
            const { id } = req.params;
            const { status } = req.body;
            
            const existing = await feedbackService.getFeedbackById(id);
            if (!existing) {
                return res.status(404).json({
                    success: false,
                    message: 'Feedback not found',
                    data: null
                });
            }
            
            const result = await feedbackService.updateFeedbackStatus(id, status);
            return successResponse(res, 'Feedback status updated', result);
        } catch (error) {
            next(error);
        }
    }

    async deleteFeedback(req, res, next) {
        try {
            const { id } = req.params;
            
            const existing = await feedbackService.getFeedbackById(id);
            if (!existing) {
                return res.status(404).json({
                    success: false,
                    message: 'Feedback not found',
                    data: null
                });
            }
            
            await feedbackService.deleteFeedback(id);
            return successResponse(res, 'Feedback deleted successfully');
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new FeedbackController();
