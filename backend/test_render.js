const ejs = require('ejs');
const path = require('path');

const viewsPath = path.join(__dirname, 'views');
const templatePath = path.join(viewsPath, 'admin/messages.ejs');

const data = {
    title: 'Messages',
    currentPage: 'messages',
    user: null
};

ejs.renderFile(templatePath, data, { root: viewsPath }, (err, str) => {
    if (err) {
        console.error('RENDER ERROR:', err);
        process.exit(1);
    }
    console.log('RENDER SUCCESS');
    process.exit(0);
});
