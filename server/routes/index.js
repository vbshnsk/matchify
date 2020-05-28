'use strict'

const Auth = require('./auth');
const {Profile, WSChat} = require('./profile');

module.exports = {
    mountRoutes: app => {
        app.use(Auth.routes());
        app.use(Auth.allowedMethods())
        app.use(Profile.routes());
        app.use(Profile.allowedMethods());
    },
    mountChat: server => WSChat(server),
}