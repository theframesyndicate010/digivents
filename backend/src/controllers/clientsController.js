const clientService = require('../services/clientService');
const { successResponse } = require('../utils/apiResponse');

exports.getClients = async (req, res, next) => {
    try {
        const clients = await clientService.fetchAllClients();
        return successResponse(res, 'Clients retrieved successfully', clients);
    } catch (error) {
        console.error('[GET CLIENTS ERROR]', error);
        next(error);
    }
};

exports.getClientById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const client = await clientService.getClientById(id);
        return successResponse(res, 'Client retrieved successfully', client);
    } catch (error) {
        console.error(`[GET CLIENT ${req.params.id} ERROR]`, error);
        next(error);
    }
};

exports.createClient = async (req, res, next) => {
    try {
        const newClient = await clientService.createClient(req.body);
        return successResponse(res, 'Client added successfully', newClient, 201);
    } catch (error) {
        console.error('[CREATE CLIENT ERROR]', error);
        next(error);
    }
};

exports.updateClient = async (req, res, next) => {
    try {
        const { id } = req.params;
        const updatedClient = await clientService.updateClient(id, req.body);
        return successResponse(res, 'Client updated successfully', updatedClient);
    } catch (error) {
        console.error(`[UPDATE CLIENT ${req.params.id} ERROR]`, error);
        next(error);
    }
};

exports.deleteClient = async (req, res, next) => {
    try {
        const { id } = req.params;
        await clientService.deleteClient(id);
        return successResponse(res, 'Client deleted successfully');
    } catch (error) {
        console.error(`[DELETE CLIENT ${req.params.id} ERROR]`, error);
        next(error);
    }
};
