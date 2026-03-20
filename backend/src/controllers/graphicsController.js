const graphicService = require('../services/graphicService');
const { successResponse } = require('../utils/apiResponse');

exports.getGraphics = async (req, res, next) => {
    try {
        const graphics = await graphicService.fetchAllGraphics();
        return successResponse(res, 'Graphics retrieved successfully', graphics);
    } catch (error) {
        next(error);
    }
};

exports.getGraphicById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const graphic = await graphicService.getGraphicById(id);
        return successResponse(res, 'Graphic retrieved successfully', graphic);
    } catch (error) {
        next(error);
    }
};

exports.createGraphic = async (req, res, next) => {
    try {
        // req.file is populated by multer upload middleware
        const newGraphic = await graphicService.createGraphic(req.body, req.file);
        return successResponse(res, 'Graphic added successfully', newGraphic, 201);
    } catch (error) {
        next(error);
    }
};

exports.updateGraphic = async (req, res, next) => {
    try {
        const { id } = req.params;
        const updatedGraphic = await graphicService.updateGraphic(id, req.body, req.file);
        return successResponse(res, 'Graphic updated successfully', updatedGraphic);
    } catch (error) {
        next(error);
    }
};

exports.deleteGraphic = async (req, res, next) => {
    try {
        const { id } = req.params;
        await graphicService.deleteGraphic(id);
        return successResponse(res, 'Graphic deleted successfully');
    } catch (error) {
        next(error);
    }
};
