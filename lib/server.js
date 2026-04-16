const express = require('express');
const router = require('express-promise-router');
const bodyParser = require('body-parser');
const CsuiteRouter = router({ mergeParams: true });
const wrapper = require('./gsuite-wrapper');
const config = require('./config/configFile');

CsuiteRouter.post('/account', wrapper.createAccount);
CsuiteRouter.put('/account/:userPK/suspend', wrapper.suspendAccount);
CsuiteRouter.put('/account/:userPK/activate', wrapper.activateAccount);

const server = express();
server.use(bodyParser.json());
server.use('/', CsuiteRouter);

let app;
async function startServer() {
    return new Promise((res, rej) => {
        const localApp = server.listen(config.port, () => {
            app = localApp;
            console.log(`Up and running on port ${config.port}`);
            res();
        });
        localApp.on('error', (err) => rej(new Error('Error starting server: ' + err.stack)));
    });
}

async function stopServer() {
    console.log('Stopping server...');
    app.close();
    app = null;
    console.log('Server stopped');
}

module.exports = {
    app,
    server,
    stopServer,
    startServer,
};