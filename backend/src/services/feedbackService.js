const db = require('../config/db');

class FeedbackService {
    async getAllFeedback() {
        const rows = await db('feedback').select('*').orderBy('created_at', 'desc');
        return rows;
    }

    async createFeedback(data) {
        const payload = {
            name: data.name,
            email: data.email || null,
            rating: data.rating ? parseInt(data.rating, 10) : 5,
            message: data.message,
            project_id: data.project_id ? parseInt(data.project_id, 10) : null,
            status: data.status || 'pending'
        };

        const [id] = await db('feedback').insert(payload);
        return this.getFeedbackById(id);
    }

    async getFeedbackById(id) {
        return db('feedback').where({ id }).first();
    }

    async updateFeedbackStatus(id, status) {
        await db('feedback').where({ id }).update({ status });
        return this.getFeedbackById(id);
    }

    async deleteFeedback(id) {
        return db('feedback').where({ id }).del();
    }
}

module.exports = new FeedbackService();
