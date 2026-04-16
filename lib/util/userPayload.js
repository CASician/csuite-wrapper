/*
This is what google expects from the application in order to create an account.
In our code, this payload is sent to a gsuiteOperation as a whole. 

For more fields: 

    https://developers.google.com/admin-sdk/directory/v1/reference/users

Cri's note: 
this used to be defined in too many places: 
    - gsuite-wrapper, line 370
    - V
*/
const crypto = require('crypto');

function createUserPayload({
    givenName = 'Default',
    surname = 'User',
    primaryEmail = null,
    recoveryEmail = 'recovery@example.com',
    password = 'AEGEE-Europe',
    antenna = 'AEGEE-Timbuktu',
    userPK = null,
} = {}) {

    const payload = {

        // --- Configurable fields ---
        primaryEmail: primaryEmail ?? `${givenName.toLowerCase()}.${surname.toLowerCase()}@aegee.eu`, 
        name: {
            givenName: givenName,
            familyName: surname,
        },
        recoveryEmail,
        password: crypto.createHash('sha1').update(JSON.stringify(password)).digest('hex'),
        organizations: [{ department: antenna }],
        userPK: userPK ?? `${givenName.toLowerCase()}-${surname.toUpperCase()}`,
        emails: [
            {
                address: recoveryEmail, 
                type: 'home',
                customType: '',
                primary: true,
            },
        ],


        // --- Fixed defaults ---
        suspended: true,
        hashFunction: 'SHA-1',
        orgUnitPath: '/gsuiteWrapperTest',
        includeInGlobalAddressList: true,
    };

    return payload;
}

exports.createUserPayload = createUserPayload;