const db = require('../config/db');
const { getMessagesTable } = require('../utils/tableResolver');

exports.getAdminStats = async () => {
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
};
