const db = require('../config/db');

exports.getAllFeedback = async () => {
    return db('feedback').select('*').orderBy('created_at', 'desc');
};

exports.createFeedback = async (data) => {
    const payload = {
        name: data.name,
        email: data.email || null,
        rating: data.rating ? parseInt(data.rating, 10) : 5,
        message: data.message,
        project_id: data.project_id ? parseInt(data.project_id, 10) : null,
        status: data.status || 'pending'
    };

    const [id] = await db('feedback').insert(payload);
    return exports.getFeedbackById(id);
};

exports.getFeedbackById = async (id) => {
    return db('feedback').where({ id }).first();
};

exports.updateFeedbackStatus = async (id, status) => {
    await db('feedback').where({ id }).update({ status });
    return exports.getFeedbackById(id);
};

exports.deleteFeedback = async (id) => {
    return db('feedback').where({ id }).del();
};
