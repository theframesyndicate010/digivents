const messageService = require('../services/messageService');
const { successResponse } = require('../utils/apiResponse');

exports.getMessages = async (req, res, next) => {
    try {
        const page = Math.max(parseInt(req.query.page) || 1, 1);
        const perPage = Math.min(Math.max(parseInt(req.query.perPage) || 20, 1), 100);
        const { status, search } = req.query;

        const data = await messageService.fetchAllMessages({ page, perPage, status, search });

        return successResponse(res, 'Messages retrieved successfully', data);
    } catch (error) {
        next(error);
    }
};

exports.createMessage = async (req, res, next) => {
    try {
        const newMessage = await messageService.createMessage(req.body);
        return successResponse(res, 'Message created successfully', newMessage, 201);
    } catch (error) {
        next(error);
    }
};

exports.updateMessage = async (req, res, next) => {
    try {
        const id = req.params.id;
        if (!id) {
            const err = new Error('Invalid message id');
            err.statusCode = 400;
            throw err;
        }

        const updatedMessage = await messageService.updateMessage(id, req.body);
        return successResponse(res, 'Message updated successfully', updatedMessage);
    } catch (error) {
        next(error);
    }
};

exports.deleteMessage = async (req, res, next) => {
    try {
        const id = req.params.id;
        if (!id) {
            const err = new Error('Invalid message id');
            err.statusCode = 400;
            throw err;
        }

        await messageService.deleteMessage(id);
        return successResponse(res, 'Message deleted successfully');
    } catch (error) {
        next(error);
    }
};
