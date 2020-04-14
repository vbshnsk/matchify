'use strict'

const Auth = require('./auth').routes();
const Profile = require('./profile').routes();

module.exports = app => {
    app.use(Auth);
    app.use(Profile);
}