'use strict'

const Router = require('koa-router');
const User = require('../../controllers/user');

const router = new Router();

router.use(async (ctx, next) =>{
    try{
        await next();
    }
    catch(error){
        console.error(error);   
    }
});

router.prefix('/logout');

router.get('/', User.logout(), ctx => {
    ctx.body = "Logout successful."
});

module.exports = router;
