'use strict'

const Register = require('./auth/register').routes();
const Login = require('./auth/login').routes();
const Logout = require('./auth/logout').routes();

module.exports = app => {
    app.use(Register);
    app.use(Login);
    app.use(Logout);
}