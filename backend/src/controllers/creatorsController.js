const creatorService = require('../services/creatorService');
const { successResponse } = require('../utils/apiResponse');

exports.getCreators = async (req, res, next) => {
    try {
        const creators = await creatorService.fetchAllCreators();
        return successResponse(res, 'Creators retrieved successfully', creators);
    } catch (error) {
        next(error);
    }
};

exports.getCreatorById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const creator = await creatorService.getCreatorById(id);
        return successResponse(res, 'Creator retrieved successfully', creator);
    } catch (error) {
        next(error);
    }
};

exports.createCreator = async (req, res, next) => {
    try {
        // req.file is populated by multer upload middleware
        const newCreator = await creatorService.createCreator(req.body, req.file);
        return successResponse(res, 'Creator added successfully', newCreator, 201);
    } catch (error) {
        next(error);
    }
};

exports.updateCreator = async (req, res, next) => {
    try {
        const { id } = req.params;
        const updatedCreator = await creatorService.updateCreator(id, req.body, req.file);
        return successResponse(res, 'Creator updated successfully', updatedCreator);
    } catch (error) {
        next(error);
    }
};

exports.deleteCreator = async (req, res, next) => {
    try {
        const { id } = req.params;
        await creatorService.deleteCreator(id);
        return successResponse(res, 'Creator deleted successfully');
    } catch (error) {
        next(error);
    }
};
