const mocha = require('mocha');
const chai = require('chai');
const chaiHttp = require('chai-http')
const db = require('../db')
const app = require('../');

const expect = chai.expect;
chai.use(chaiHttp);
const agent = chai.request.agent(app);

describe('profile testing', () => {

    before(done => {
        agent
        .post('/register')
        .send({
            username: 'testuser1',
            password: 'testpassword1',
            email: 'testemail@test.com',
            birthdate: '2001-01-01',
            gender: 'other',
        })
        .end((err, res) => {
            expect(res).to.have.cookie('koa:sess');
            expect(res).to.have.cookie('koa:sess.sig');
            done();
        })
    })

    it('should put own profile authorized', done => {
        agent
        .put('/profile/me')
        .send({
            bio: 'test bio'
        })
        .end((err, res) => {
            expect(res).to.have.status(200);
            done();
        })
    })

    it('should get profile ', done => {
        agent
        .get('/profile/me')
        .end((err, res) => {
            expect(res.body.profile).to.have.property('username');
            expect(res.body.profile).to.have.property('displayname');
            expect(res.body.profile).to.have.property('email');
            expect(res.body.profile).to.have.property('bio');
            expect(res.body.profile).to.have.property('gender');
            expect(res.body.profile).to.have.property('city');
            expect(res.body.profile).to.have.property('profilephotos');
            expect(res.body.profile).to.have.property('birthdate');
            expect(res.body.profile).to.have.property('preference');
            expect(res.body.profile).to.have.property('taste').that.is.a('Object');
            expect(res.body.profile).to.have.property('stats').that.is.a('Object');
            done();
        })
    })

    after(() => {
        return db.query(`delete from "User" where username = 'testuser1'`);
    })
})