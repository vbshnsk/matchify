const mocha = require('mocha');
const chai = require('chai');
const chaiHttp = require('chai-http')
const db = require('../db')
const app = require('../');

const expect = chai.expect;
chai.use(chaiHttp);
const agent = chai.request.agent(app);

describe('authorization testing', () => {

    it('should not register user with invalid data', done => {
        agent
        .post('/register')
        .send({
            username: 'testuser1',
            birthdate: null
        })
        .end((err, res) => {
            expect(res).to.have.status(404);
            done();
        })
    })

    it('should not login user with invalid data', done => {
        agent
        .post('/login')
        .send({
            username: 'testuser1',
            password: 'testpassword1'
        })
        .end((err, res) => {
            expect(res).to.have.status(404);
            done();
        })
    })


    it('should register user with valid data', done => {
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
            expect(res).to.have.status(200);
            done();
        })
    })

    it('should login user with valid data', done => {
        agent
        .post('/login')
        .send(
            {
                username: 'testuser1',
                password: 'testpassword1'
            }
        )
        .end((err, res) => {
            expect(res).to.have.status(200);
            expect(res).to.have.cookie('koa:sess')
            expect(res).to.have.cookie('koa:sess.sig')
            done();
        })
    })

    it('should get current logged user data, when there is one', done => {
        agent
        .get('/login')
        .end((err, res) => {
            expect(res.body).to.have.property('authorized').eq(true);
            expect(res.body).to.have.property('username');
            done();
        })
    })

    it('should log user out', done => {
        agent
        .get('/logout')
        .end((err, res) => {
            expect(res).to.have.status(200);
            done();
        })
    })

    it('should not get current logged user data, when there isn\'t one', done => {
        agent
        .get('/login')
        .end((err, res) => {
            expect(res.body).to.have.property('authorized').eq(false);
            expect(res.body).not.to.have.property('username');
            done();
        })
    })


    after(async () => {
        return db.query(`delete from "User" where username = 'testuser1'`);
    })
})