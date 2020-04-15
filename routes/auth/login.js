'use strict'

const Router = require('koa-router');
const bodyParser = require('koa-body');
const User = require('../../models/user');

const router = new Router();

router.prefix('/login');

router.use(async (ctx, next) =>{
    try{
        await next();
    }
    catch(error){
        console.error(error);   
    }
});

router.get('/', (ctx) => ctx.body = 1);

router.post('/', bodyParser(), User.authorize(), ctx => {
    ctx.redirect('/login');
});

module.exports = router;