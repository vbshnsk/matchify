'use strict'

const Router = require('koa-router');
const bodyParser = require('koa-body');
const User = require('../../controllers/user');

const router = new Router();

router.prefix("/register");

router.use(async (ctx, next) =>{
    try{
        await next();
    }
    catch(error){
        ctx.status = 404;
    }
});

router.get("/", ctx => ctx.body = "Not the page you're looking for.");

router.post("/", bodyParser(), User.register(), User.authorize(), ctx => {
    ctx.redirect('/login');
});


module.exports = router;