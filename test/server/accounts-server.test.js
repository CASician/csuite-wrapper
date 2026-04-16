const chai = require('chai');
const should = chai.should();
const { createUserPayload } = require('../../lib/util/userPayload');
const { request } = require('./test-helper');
const { startServer, stopServer } = require('../../lib/server');

describe('Accounts', () => {
    const name = 'Router';
    const surname = 'withantennacheck';
    const data = createUserPayload({ givenName: name, surname: surname });

    before(async () => await startServer());
    after(async () => await stopServer());

    describe('POST /account', function () {
        this.timeout(15000);
        it('Should add an account', async function() {
            payload = structuredClone(data);
            // console.log(payload);

            const res = await request({
                uri: '/account',
                method: 'POST',
                headers: { 'test-title': 'create account' },
                body: payload,
            });
            
            // console.log(res);
            const body = res.body;
            // console.log(body.message);

            res.statusCode.should.equal(201);
            body.success.should.equal(true);
        });

        it('Should suspend an account', async function() {
            payload = structuredClone(data);

            const res = await request({
                uri: '/account/' + payload.userPK + '/suspend',
                method: 'PUT',
                headers: { 'test-title': 'suspend account' },
                body: payload,
            });

            res.statusCode.should.equal(200);
            res.body.success.should.equal(true);
        });

        it('Should activate an account', async function() {
            payload = structuredClone(data);

            const res = await request({
                uri: '/account/' + payload.userPK + '/activate',
                method: 'PUT',
                headers: { 'test-title': 'activate account' },
                body: payload,
            });

            res.statusCode.should.equal(200);
            res.body.success.should.equal(true);
        });
    });
});