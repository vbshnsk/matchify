'use strict'

const Router = require('koa-router');
const router = new Router();

const Profile = require('../../controllers/profile')

const statistics = require('./statistics').routes();
const spotify = require('./spotify').routes();

router.prefix('/profile/:username');

router.param('username', Profile.isAuthorized());

router.get('/', (ctx, next) => {
    ctx.body = ctx.state;
})

router.use(spotify, statistics);

module.exports = router;