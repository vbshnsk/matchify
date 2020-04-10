'use strict'

const Router = require('koa-router');
const bodyParser = require('koa-body');
const router = new Router();

router.prefix("/register");

router.get('register-get', "/", ctx => ctx.body ="hewwo uwu");

router.post("/", bodyParser(), async (ctx, next) => {
    try {
        next();
        await ctx.db.query('insert into "User"("Username", "Password", "Email", "BirthDate") values($1, $2, $3, $4)', ctx.state.userData);   
        const res = await ctx.db.query('select * from "User"');
    } catch (error) {
        console.error(error)
    }
})

router.use(async ctx => {
    const user = ctx.request.body;
    if (user.password === user.passwordConfirmation){
        ctx.state.userData = [user.username, user.password, user.email, "2001-06-18"];
    };
})

module.exports = router;