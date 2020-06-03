const mocha = require('mocha');
const chai = require('chai');
const chaiHttp = require('chai-http')
const db = require('../db')
const app = require('../');

const expect = chai.expect;
chai.use(chaiHttp);
const agent = chai.request.agent(app);

describe('matching testing', () => {

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
        .end(async (err, res) => {
            expect(res).to.have.cookie('koa:sess');
            expect(res).to.have.cookie('koa:sess.sig');
            await db.query(`insert into "User"(username, email, password, birthdate, gender) values('isnotamatch', 'email1', 'password1', '2001-01-01', 'male')`);
            await db.query(`insert into "User"(username, email, password, birthdate, gender) values('isamatch', 'email2', 'password2', '2001-01-01', 'female')`);
            await db.query(`insert into "Match"(match, username) values('testuser1', 'isamatch')`);
            done();
        })
    })

    
    it('should get user\'s closest matches', done => {
        agent
        .get('/profile/me/closestmatches')
        .end((err, res) => {
            expect(res.body).is.a('Array');
            done()
        })
    })
    
    it('should get user\'s current pairs', done => {
        agent
        .get('/profile/me/matches')
        .end((err, res) => {
            expect(res.body).is.a('Array');
            done();
        })
    });
    
    it('should put a match between users and return false when there\'s no pair', done => {
        agent
        .put('/profile/me/matches')
        .send({match: 'isnotamatch'})
        .end((err, res) => {
            expect(res.body).eq(false);
            done();
        })
    })

    it('should put a match between users and return true when there\'s a pair', done => {
        agent
        .put('/profile/me/matches')
        .send({match: 'isamatch'})
        .end(async (err, res) => {
            await db.query(`delete from "User" where username = 'isamatch'`);
            expect(res.body).eq(true);
            done();
        })
    })


    it('should put a ditch between users', done => {
        agent
        .put('/profile/me/ditches')
        .send({ditch: 'isnotamatch'})
        .end(async (err, res) => {
            await db.query(`delete from "User" where username = 'isnotamatch'`);
            expect(res).to.have.status(200);
            done();
        })
    })


    after(async () => {
        return db.query(`delete from "User" where username = 'testuser1'`);
    })

})