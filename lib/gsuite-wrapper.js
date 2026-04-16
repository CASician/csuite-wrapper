const { runGsuiteOperation, gsuiteOperations } = require('./google-suite');
const config = require('./config/configFile');

exports.createAccount = async function (req, res, next) {
    const data = req.body;

    let response = { success: false, message: 'Undefined error' };
    let statusCode = 500;

    if( !data.userPK
        || !data.primaryEmail
        || !data.recoveryEmail
        || !data.password
        || !data.organizations[0].department
        || !data.name.givenName
        || !data.name.familyName) {
        response.message = 'Validation error: a required property is absent or empty';
        statusCode = 400;
    }

    try {
        const result = await runGsuiteOperation(gsuiteOperations.addAccount, data);
        response = { 
            success: result.success,
            message: result.data.primaryEmail + ' account has been created',
            data: result.data 
        };
        statusCode = result.code;

        // Redis code TODO
    } catch (GsuiteError) {
        // console.log('GsuiteError:', GsuiteError);
        response = { success: false, errors: GsuiteError.errors, message: GsuiteError };
        statusCode = GsuiteError.code;
    }

    return res.status(statusCode).json(response);
};

exports.suspendAccount = async function (req, res, next) {
    const data = req.body;

    let response = { success: false, message: 'Undefined error' };
    let statusCode = 500;

    // Checks TODO on the req body. 
    // if (...) {...}
    
    try {
        const result = await runGsuiteOperation(gsuiteOperations.suspendAccount, data);
        response = { 
            success: result.success,
            message: result.data.primaryEmail + ' account has been suspended',
            data: result.data 
        };
        statusCode = result.code;

        // Redis code TODO
    } catch (GsuiteError) {
        // console.log('GsuiteError:', GsuiteError);
        response = { success: false, errors: GsuiteError.errors, message: GsuiteError };
        statusCode = GsuiteError.code;
    }

    return res.status(statusCode).json(response);
}

exports.activateAccount = async function (req, res, next) {
    const data = req.body;

    let response = { success: false, message: 'Undefined error' };
    let statusCode = 500;

    // Checks TODO on the req body. 
    // if (...) {...}
    
    try {
        const result = await runGsuiteOperation(gsuiteOperations.activateAccount, data);
        response = { 
            success: result.success,
            message: result.data.primaryEmail + ' account has been activated',
            data: result.data 
        };
        statusCode = result.code;

        // Redis code TODO
    } catch (GsuiteError) {
        // console.log('GsuiteError:', GsuiteError);
        response = { success: false, errors: GsuiteError.errors, message: GsuiteError };
        statusCode = GsuiteError.code;
    }

    return res.status(statusCode).json(response);
}