// To run this:
// npx mocha test/accounts.test.js
// npx mocha test/accounts.test.js --grep "Should add an account"
const chai = require('chai');
const should = chai.should();
const { runGsuiteOperation, gsuiteOperations } = require('../lib/google-suite');
const { createUserPayload } = require('../lib/util/userPayload');

describe('Accounts', () => {
    const name = 'test';
    const surname = 'isTesting';

    const data = createUserPayload({ givenName: name, surname: surname });
    
    describe('CRUD Accounts', function () {
        this.timeout(15000);
        it('Should add an account', async function() {
            // const payload = JSON.parse(JSON.stringify(data));
            // this should be the new version, faster and keeping extra details
            const payload = structuredClone(data);
            
            const res = await runGsuiteOperation(gsuiteOperations.addAccount, payload);
            res.code.should.equal(201);
        });

        it('Should get an account', async function() {
            await new Promise(resolve => setTimeout(resolve, 3000));
            const payload = structuredClone(data);

            const res = await runGsuiteOperation(gsuiteOperations.getAccount, payload);
            res.code.should.equal(200);
            res.data.primaryEmail.should.equal(payload.primaryEmail);
        });

        it('Should suspend an account', async function() {
            const payload = structuredClone(data);

            const res = await runGsuiteOperation(gsuiteOperations.suspendAccount, payload);
            res.code.should.equal(200);
        });

        it('Should activate an account', async function() {
            const payload = structuredClone(data);

            const res = await runGsuiteOperation(gsuiteOperations.activateAccount, payload);
            res.code.should.equal(200);
        });

    })
})