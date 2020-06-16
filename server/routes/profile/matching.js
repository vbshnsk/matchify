'use strict'

const Match = require('../../controllers/match');
const Profile = require('../../controllers/profile');
const Router = require('koa-router');
const bodyParser = require('koa-body');

const router = new Router();

router.get('/closestmatches', bodyParser(), Profile.isProtected(), Match.getUserClosestMatches(), ctx => {
    ctx.body = ctx.state.matches;
})

router.get('/matches', bodyParser(), Profile.isProtected(), Match.getUserMatches(), ctx => ctx.body = ctx.state.matches);

router.put('/matches', bodyParser(), Profile.isProtected(), Match.addMatch(), ctx => ctx.body = ctx.state.isAMatch);

router.put('/ditches', bodyParser(), Profile.isProtected(), Match.addDitch(), ctx => ctx.status = 200);

module.exports = router;