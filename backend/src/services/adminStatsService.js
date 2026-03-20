const db = require('../config/db');

async function getMessagesTable() {
    const hasMessages = await db.schema.hasTable('messages');
    if (hasMessages) return 'messages';
    const hasContacts = await db.schema.hasTable('contacts');
    if (hasContacts) return 'contacts';
    throw new Error('No messages/contacts table found in database');
}

class AdminStatsService {
    async getAdminStats() {
        const messagesTable = await getMessagesTable();

        const [projectsCount, clientsCount, creatorsCount, messagesCount] =
            await Promise.all([
                db('projects').count('* as count').first(),
                db('clients').count('* as count').first(),
                db('creators').count('* as count').first(),
                db(messagesTable).count('* as count').first()
            ]);

        return {
            projects: parseInt(projectsCount?.count || 0, 10),
            clients: parseInt(clientsCount?.count || 0, 10),
            creators: parseInt(creatorsCount?.count || 0, 10),
            messages: parseInt(messagesCount?.count || 0, 10)
        };
    }
}

module.exports = new AdminStatsService();

