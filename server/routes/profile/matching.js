'use strict'

const Profile = require('../../controllers/profile');
const Router = require('koa-router');
const bodyParser = require('koa-body');

const router = new Router();

router.get('/closestmatches', bodyParser(), Profile.isProtected(), Profile.getUserClosestMatches(), ctx => {
    ctx.body = ctx.state.matches;
})

router.get('/matches', bodyParser(), Profile.isProtected(), Profile.getUserMatches(), ctx => ctx.body = ctx.state.matches);

router.put('/matches', bodyParser(), Profile.isProtected(), Profile.addMatch(), ctx => ctx.body = ctx.state.isAMatch);

module.exports = router;