const graphicService = require('../services/graphicService');
const { successResponse, errorResponse } = require('../utils/apiResponse');
const BASE_URL = process.env.BASE_URL || '';

exports.getGraphics = async (req, res) => {
    try {
        const graphics = await graphicService.fetchAllGraphics();
        const data = graphics.map(g => ({
            ...g,
            photo: g.photo ? `${BASE_URL}${g.photo}` : ''
        }));
        return successResponse(res, 'Graphics retrieved successfully', data);
    } catch (err) {
        return errorResponse(res, 'Failed to fetch graphics', err, err.statusCode || 500);
    }
};

exports.getGraphicById = async (req, res) => {
    try {
        const { id } = req.params;
        const graphic = await graphicService.getGraphicById(id);
        const data = {
            ...graphic,
            photo: graphic.photo ? `${BASE_URL}${graphic.photo}` : ''
        };
        return successResponse(res, 'Graphic retrieved successfully', data);
    } catch (err) {
        return errorResponse(res, 'Failed to fetch graphic', err, err.statusCode || 500);
    }
};

exports.createGraphic = async (req, res) => {
    try {
        if (!req.file) return errorResponse(res, 'No file uploaded', null, 400);
        const newGraphic = await graphicService.createGraphic(req.body, req.file.filename);
        newGraphic.photo = req.file._publicPath;
        return successResponse(res, 'Graphic added successfully', newGraphic, 201);
    } catch (err) {
        return errorResponse(res, 'Failed to add graphic', err, err.statusCode || 500);
    }
};

exports.updateGraphic = async (req, res) => {
    try {
        const { id } = req.params;
        const updated = await graphicService.updateGraphic(id, req.body, req.file?.filename);
        if (!updated) return errorResponse(res, 'Graphic not found', null, 404);
        if (req.file) updated.photo = req.file._publicPath;
        return successResponse(res, 'Graphic updated successfully', updated);
    } catch (err) {
        return errorResponse(res, 'Failed to update graphic', err, err.statusCode || 500);
    }
};

exports.deleteGraphic = async (req, res) => {
    try {
        const { id } = req.params;
        await graphicService.deleteGraphic(id);
        return successResponse(res, 'Graphic deleted successfully', {});
    } catch (err) {
        return errorResponse(res, 'Failed to delete graphic', err, err.statusCode || 500);
    }
};