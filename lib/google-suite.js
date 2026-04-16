// Copyright 2014-2016, Google, Inc.
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//    http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

const { google } = require('googleapis');
// const log = require('./util/logger');
const config = require('./config/configFile');
const { JWT } = require('google-auth-library');

// Create JWT auth object
const jwt = new JWT({
    email: config.GsuiteKeys.client_email,
    key: config.GsuiteKeys.private_key,
    scopes: [
        'https://www.googleapis.com/auth/admin.directory.group',
        'https://www.googleapis.com/auth/admin.directory.group.member',
        'https://www.googleapis.com/auth/admin.directory.user',
        'https://www.googleapis.com/auth/calendar.events',
    ],
    subject: config.GsuiteKeys.delegatedUser,
});

async function runGsuiteOperation(operation, payload) {
    try {
        const authRes = await jwt.authorize();
        // console.log('Auth successful: \n' + JSON.stringify(authRes));
        console.log('Auth successful');
    } catch (AuthError) {
        console.log('Authentication error to GSuite!' + AuthError.toString());
        throw { errors: [{ message: 'Authentication error to GSuite' }], code: 500};
    }

    const res = await operation(jwt, payload);
    const operationResult = { success: true, code: res.status, data: res.data };

    // ------- WHAT IS THIS? ---------
    // GOOD PRACTICES FOR MYAEGEE??
    // code for 'created' is 201 but Google returns 200
    if (operation.name.indexOf('add') > -1 && operationResult.code === 200 ){
        operationResult.code = 201;
    }

    // by standard, 204 has no content body, but we always return content
    if (operationResult.code === 204) { operationResult.code = 200; }

    // --------

    return operationResult;
}

const gsuiteOperations = {

    // CRUD for accounts
    addAccount: async function addAccount(jwt, data) {
        const admin = google.admin('directory_v1');
        const result = await admin.users.insert({
            auth: jwt,
            requestBody: data,
        });
        console.log('[MyAEGEE] gsuiteOperations.addAccount working...')

        return result;
    },

    getAccount: async function getAccount(jwt, data) {
        const admin = google.admin('directory_v1');
        const result = await admin.users.get({
            auth: jwt,
            userKey: data.primaryEmail,
        });
        console.log('[MyAEGEE] gsuiteOperations.getAccount working...')
        
        return result;
    },

    // This is not needed. Use suspend instead.
    deleteAccount: async function deleteAccount(jwt, data) {
        const admin = google.admin('directory_v1');
        const result = await admin.users.delete({
            auth: jwt,
            userKey: data.primaryEmail,
        });
        console.log('[MyAEGEE] gsuiteOperations.deleteAccount working...')

        return result;
    },

    // This is way too generic. Personalize according to your needs.
    // Check suspendAccount() and activateAcount() for examples.
    editAccount: async function editAccount(jwt, data) {
        throw GsuiteError;
    },

    suspendAccount: async function suspendAccount(jwt, data) {
        const admin = google.admin('directory_v1');
        const result = await admin.users.update({
            auth: jwt,
            userKey: data.primaryEmail,
            requestBody: { suspended: true },
        });
        console.log('[MyAEGEE] gsuiteOperations.suspendAccount working...')

        return result;
    },

    activateAccount: async function activateAccount(jwt, data) {
        const admin = google.admin('directory_v1');
        const result = await admin.users.update({
            auth: jwt,
            userKey: data.primaryEmail,
            requestBody: { suspended: false },
        });
        console.log('[MyAEGEE] gsuiteOperations.activateAccount working...')

        return result;
    },
}


exports.runGsuiteOperation = runGsuiteOperation;
exports.gsuiteOperations = gsuiteOperations;