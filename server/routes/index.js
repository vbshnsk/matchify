'use strict'

const Auth = require('./auth');
const Profile = require('./profile');

module.exports = app => {
    app.use(Auth.routes());
    app.use(Auth.allowedMethods())
    app.use(Profile.routes());
    app.use(Profile.allowedMethods());
}