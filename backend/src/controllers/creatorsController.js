const creatorService = require('../services/creatorService');
const { successResponse } = require('../utils/apiResponse');

exports.getCreators = async (req, res, next) => {
    try {
        const creators = await creatorService.fetchAllCreators();
        return successResponse(res, 'Creators retrieved successfully', creators);
    } catch (error) {
        console.error('[GET CREATORS ERROR]', error);
        next(error);
    }
};

exports.getCreatorById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const creator = await creatorService.getCreatorById(id);
        return successResponse(res, 'Creator retrieved successfully', creator);
    } catch (error) {
        console.error(`[GET CREATOR ${req.params.id} ERROR]`, error);
        next(error);
    }
};

exports.createCreator = async (req, res, next) => {
    try {
        if (!req.body.name) {
            return res.status(400).json({ success: false, message: 'Name is required' });
        }

        const newCreator = await creatorService.createCreator(req.body, req.file);

        return successResponse(res, 'Creator added successfully', newCreator, 201);
    } catch (error) {
        console.error('[CREATE CREATOR ERROR]', error);
        next(error);
    }
};

exports.updateCreator = async (req, res, next) => {
    try {
        const updatedCreator = await creatorService.updateCreator(req.params.id, req.body, req.file);
        return successResponse(res, 'Creator updated successfully', updatedCreator);
    } catch (error) {
        console.error(`[UPDATE CREATOR ${req.params.id} ERROR]`, error);
        next(error);
    }
};

exports.deleteCreator = async (req, res, next) => {
    try {
        await creatorService.deleteCreator(req.params.id);
        return successResponse(res, 'Creator deleted successfully');
    } catch (error) {
        console.error(`[DELETE CREATOR ${req.params.id} ERROR]`, error);
        next(error);
    }
};