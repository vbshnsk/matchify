'use strict'

const Register = require('./register').routes();

module.exports = app => {
    app.use(Register);
};

