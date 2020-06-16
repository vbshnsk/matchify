'use strict'

const Router = require('koa-router');

const login = require('./login').routes();
const logout = require('./logout').routes();
const register = require('./register').routes()

const router = new Router();

router.use(login, logout, register);

module.exports = router;