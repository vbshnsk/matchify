'use strict'

const Router = require('koa-router');
const bodyParser = require('koa-body');
const User = require('../models/user');

const router = new Router();

router.prefix("/register");

router.get('register-get', "/", ctx => ctx.body = "Not the page you're looking for.");

router.post("/", bodyParser(), async ctx => {
    try {
        await User.insertUser(ctx.request.body);
    } catch (error) {
        console.error(error)
    }
})

module.exports = router;