const projectService = require('../services/projectService');
const { successResponse } = require('../utils/apiResponse');

exports.getProjects = async (req, res, next) => {
    try {
        const projects = await projectService.fetchAllProjects();
        return successResponse(res, 'Projects retrieved successfully', projects);
    } catch (error) {
        console.error('[GET PROJECTS ERROR]', error);
        next(error);
    }
};

exports.getProjectById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const project = await projectService.getProjectById(id);
        return successResponse(res, 'Project retrieved successfully', project);
    } catch (error) {
        console.error(`[GET PROJECT ${req.params.id} ERROR]`, error);
        next(error);
    }
};

exports.createProject = async (req, res, next) => {
    try {
        const newProject = await projectService.createProject(req.body, req.files);
        return successResponse(res, 'Project created successfully', newProject, 201);
    } catch (error) {
        console.error('[CREATE PROJECT ERROR]', error);
        next(error);
    }
};

exports.updateProject = async (req, res, next) => {
    try {
        const { id } = req.params;
        const updatedProject = await projectService.updateProject(id, req.body, req.files);
        return successResponse(res, 'Project updated successfully', updatedProject);
    } catch (error) {
        console.error(`[UPDATE PROJECT ${req.params.id} ERROR]`, error);
        next(error);
    }
};

exports.deleteProject = async (req, res, next) => {
    try {
        const { id } = req.params;
        await projectService.deleteProject(id);
        return successResponse(res, 'Project deleted successfully');
    } catch (error) {
        console.error(`[DELETE PROJECT ${req.params.id} ERROR]`, error);
        next(error);
    }
};
