'use strict'

const Register = require('./auth/register').routes();
const Login = require('./auth/login').routes();
const Logout = require('./auth/logout').routes();
const Profile = require('./profile').routes();

module.exports = app => {
    app.use(Register);
    app.use(Login);
    app.use(Logout);
    app.use(Profile);
}