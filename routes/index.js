'use strict'

const Auth = require('./auth').routes();

module.exports = app => {
    app.use(Auth);
}