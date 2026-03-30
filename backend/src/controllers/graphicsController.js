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
        console.error('[GRAPHICS_CONTROLLER] Error fetching graphics:', err);
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
        console.error('[GRAPHICS_CONTROLLER] Error fetching graphic by ID:', err);
        return errorResponse(res, 'Failed to fetch graphic', err, err.statusCode || 500);
    }
};

exports.createGraphic = async (req, res) => {
    try {
        if (!req.file) {
            console.error('[GRAPHICS_CONTROLLER] File upload failed - req.file is undefined');
            console.error('[GRAPHICS_CONTROLLER] req.body:', req.body);
            console.error('[GRAPHICS_CONTROLLER] Content-Type:', req.headers['content-type']);
            return errorResponse(res, 'File upload failed - no file received', null, 400);
        }
        const newGraphic = await graphicService.createGraphic(req.body, req.file.filename);
        // Set the public path for the photo
        newGraphic.photo = `${BASE_URL}/uploads/graphics/${req.file.filename}`;
        return successResponse(res, 'Graphic added successfully', newGraphic, 201);
    } catch (err) {
        console.error('[GRAPHICS_CONTROLLER] Error creating graphic:', err);
        // Use the error's message if it's an operational error, otherwise use generic message
        const message = err.isOperational ? err.message : 'Failed to add graphic';
        return errorResponse(res, message, err, err.statusCode || 500);
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
        console.error('[GRAPHICS_CONTROLLER] Error updating graphic:', err);
        return errorResponse(res, 'Failed to update graphic', err, err.statusCode || 500);
    }
};

exports.deleteGraphic = async (req, res) => {
    try {
        const { id } = req.params;
        await graphicService.deleteGraphic(id);
        return successResponse(res, 'Graphic deleted successfully', {});
    } catch (err) {
        console.error('[GRAPHICS_CONTROLLER] Error deleting graphic:', err);
        return errorResponse(res, 'Failed to delete graphic', err, err.statusCode || 500);
    }
};